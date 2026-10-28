# 实体限制数据库筛选深入分析

完整读取 PosEntityInhibitManager_i::getEntityInhibitRecordsFor，poscimfw/penmg/penindb.sqx:3138–4148。这是动态 SQL 构造及 C++ 后筛选的静态审阅，未连接真实数据库。

## 阈值决定两条路径

代码以 atoi(getenv(SP_ENTITY_INHIBIT_THRESHOLD_COUNT)) 读取阈值。阈值>0 时先按输入实体的 class/id OR 条件统计 FRENTINHBT_ENTTY 行；零行直接返回空序列。阈值==0，或阈值大于该行数时走逐条检查；其他情况走动态 SQL 联结。这个行数不是限制记录的去重计数。

环境变量不存在时 getenv 返回值未在此入口检查。是否有统一初始化保障待查，不能假定安全默认值。通配符开关来自 SP_ENTITY_INHIBIT_USE_WILDCARD；字符来自 SP_WILDCARD_CHAR 的首字符。

## 逐条检查路径（3281–3889）

先选 DISTINCT 限制 key 候选，再按 key 读全部实体要求。每一个数据库实体要求都必须在输入中匹配，遇到不匹配直接放弃整条限制。输入可以包含额外实体。Route/Chamber 还比较 attrib，允许数据库端 SP_InhibitAllOperations；其他 class 在此循环不比较 attrib。

启用通配符时，逐条检查使用数据库 ENTITY_ID 中最后一个通配字符之前的前缀。没有通配字符时以字符串长度及比较处理，不能简化成任意 SQL LIKE 模式。候选 SQL 先按精确或包含通配字符形式缩小集合，整个行为受两阶段筛选共同影响。

读取 FRENTINHBT 主记录后，开始时间晚于当前或非空结束时间早于当前时排除；这条路径允许恰好等于当前时间。subLotType 来自 FRENTINHBT_SLOTTP：无任何存储行时通用；输入为空但存储非空时不匹配。非空输入通过累计找到数等于输入数判断，因此表达的是覆盖全部输入的意图，但重复输入/重复存储行可能改变计数，尚无唯一性约束证据。

查询过程中每个候选取得当前时间；返回容量参数小于1默认2000，后续按500扩容，是容量而非硬结果上限。

## 动态 SQL 路径（3893–4141）

将输入实体构造成 VALUES/UNION 表，与 FRENTINHBT_ENTTY 联结，再用 GROUP BY/HAVING 匹配行数等于全部实体行数。依赖行重数及去重语义，不能未经数据约束证明就说完全等价于逐条循环。

| 条件 | 逐条路径 | 动态 SQL 路径 |
|---|---|---|
| 通配符 | 找数据库 ID 的最后一个字符位置并比较前缀 | 仅数据库 ID 最后一个字符为通配符时作前缀匹配 |
| attrib | 只在 Route/Chamber 类附加比较 | 拼接 SQL 对联结实体附加比较 |
| 时间 | 非未来开始、非已过期结束，包含相等时刻 | 空时间或严格 start<now、now<end |
| 多个输入 subLotType | 累计覆盖全部输入数的检查 | 与输入 VALUES 联结，每个匹配输入可能产生结果行；未见最终 DISTINCT |
| 结果组装 | 直接复制主表和已读集合 | 按 key 调 findEntityInhibitRecordByKey，重新读取完整集合 |

这些是代码表达的差异，尚未通过数据库夹具证明实际结果；尤其动态路径存在下面的格式化疑点，不能把它作为可靠实现规范。

## 待验证的具体源码问题

penindb.sqx:3982–3997 的 snprintf 格式字符串有两个 `%s`，显示的可变参数只有一个 SP_InhibitAllOperations。已经复读原始文件确认，不是注释剥离造成。若经正常 C/C++ 预处理后仍如此，就是格式参数数量不匹配，可能生成错误 SQL 或发生未定义行为；需检查实际编译源、宏展开及编译器格式告警。当前不修改历史业务源，也不声称已经复现生产故障。

另有环境变量空值、固定 SQL 缓冲区、直接将标识拼入 SQL 的输入约束，以及重复 subLotType/实体导致行数判断差异，需要结合部署约束、表唯一性及交易层继续核实。运行配置、DDL 和宏缺失不是把上述未知自动判为缺陷的理由。

## 按 key 组装结果（4278–4492）

findEntityInhibitRecordByKey 先从 FRENTINHBT 取主记录；查不到显式抛 EntityInhibitNotFoundSignal。接着按同一 D_THESYSTEMKEY 读取 FRENTINHBT_ENTTY（ORDER BY D_SEQNO）和 FRENTINHBT_SLOTTP，分别按3、5扩容并裁剪成实际长度。该函数不重新判断有效时间、实体匹配或 subLotType。

因此两条查询路径的返回内容也需区分：逐条路径可能在已经覆盖输入 subLotType 时提前结束游标，返回已读取前缀；动态路径按 key 重新取完整集合。外层查询与重新取记录之间的一致性依赖数据库隔离和事务，源码当前未提供其证明。实体集合在逐条路径没有 ORDER BY，而按 key 读取有 D_SEQNO 排序，不推定返回顺序相同。

此方法不处理 Lot 例外，例外由调用者继续检查；参见 [配方选择](recipe-selection-deep.md)。
