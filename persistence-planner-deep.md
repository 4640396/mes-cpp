# 框架 SQL 计划：配置成本、搜索与回退

来源 smtchcmf/frmwrkgl/cimfwdo.cpp。本报告完整阅读四个模板方法与 doSearchOptimalSQL；配置构造和 callback 为已读辅助片段，未把整个框架类登记为完成。

## 配置不是实测数据库耗时

CollectionHelperBase 配置（437–555）：SP_DO_BURSTINSERT_表名、SP_DO_UPDATE_表名、SP_DO_PARTIAL_THRESHOLD_表名 优先于对应 DEFAULT；ON 为区分大小写的精确比较。阈值按 strtod 取数，只接受0到1，超范围/NaN转0，未检查字符串尾部。布尔和阈值的显式参数构造重载不经过同一环境解析路径，不能推定都受同样校验。

强制更新模式会把 issueCost 加到 delete/insert/update/move/tableMarker 的行成本中；批插入的 issueInsertCost 按 issueCost×2/5 计算，否则为 issueCost。这是配置模型和整数算术，不是实测每条 SQL 的延迟或数据库执行计划。

Sequence 配置（558–651）还读 SP_DO_PARTIAL_ENHANCE_表名 / DEFAULT 和 SP_DO_PARTIAL_MERGE_表名 / DEFAULT。增强值解析头/尾对角线，逗号或减号设置不同组合，超宏上限重置对应数值；Merge 恰为 ON 才开启。部署值目前未知。

## 已完整阅读的计划入口

doSearchOptimalSQL（2721–2737）创建编辑图，initialize→fillMinimalResidueCost→searchOptimalSQL→assembleSQL，最后返回 callback 的 deleteAll。成本对象和 Merge/普通 callback 由已读 SequenceHelper 入口选择，见 [集合持久化](persistence-collections-deep.md)。

模板 searchOptimalSQL 的 threshold 重载（1845–1855）用 minCost + (maxCost−minCost)×threshold 得到成本阈值；remainCost 重载（1858–1865）用 minCost+剩余额度。它们调用同一搜索主体（1868–2070）。

主体通过 priority_queue 探索编辑节点，处理 Delete、Insert、Replace、Update，使用已知实际成本和剩余成本下界估算，并在阈值余量耗尽时填充保守剩余成本。由 updateCost 计算比较/更新开销，候选成本超过 maxCost 不进入队列。终点 lastOp 决定后续回溯。

这支持“在配置的编辑图与成本模型中选择更新路径”，不证明所有可能 SQL 的全局最优，不承诺真实耗时最短。initialize 的图范围、成本上下界正确性、priority_queue 非空前提与比较器还需进一步核实，不能忽略这些前提而做形式化正确性声明。

## 回溯与计划输出

assembleSQL（2459–2634）从尾端回溯 Delete/Insert/Replace/Update，先处理落在图外的尾部，再按 callback 输出。未搜索的特殊状态有完整更新回退分支。Replace 在 callback 表达为删除加插入，不能等同为固定 UPDATE。

普通 EditCallback 片段（2102–2189）会合并连续倒序的 Delete/Insert/Shift 范围；addUpdate 标记 deleteAll=false，并在旧/新序号不同的时候累积 Shift。finalize 根据是否保留任何更新决定 DeleteAll 或区间删除，再冲出缓存的 Shift/Insert。Merge callback 有独立实现，不能把普通版本细节自动推广。

SequenceUpdateSQLCallback（2647–2678）将 NotModified 变成 None，其他比较结果变成 Update，并以 [seqNo,seqNo+1) 表达单项范围；Delete/Insert/Shift/Travel 直接添加计划项。生成 save 后续还会排序和执行计划，因此这里只是计划生产，不是 SQL 已执行。

## 索引边界与后续

原 method-index 基于简单限定名和括号/花括号定位，会漏模板限定类名及部分多层构造器。本轮四个模板方法以 template_definition 单独登记、校验方法头与花括号及来源哈希，不偷偷计入原26,832个候选方法的分母；全局模板函数 doSearchOptimalSQL 仍按 global_function 单列。文本范围验证不是编译器 AST。

尚需核实编辑图 initialize、上下界/成本模型、Merge 回调、Comparator、排序及实际 Writer 的并发/事务行为。本报告不标记模板族全部完成。

## 后续核实：搜索图并非完整矩阵

已完整读取 initialize（1205–1318）及 maximalCost（1325–1353）。doSearchOptimalSQL 先调用类内的三参数 initialize 包装（1086–1090），包装再将旧长度同时传给 dLength、dLength2，转发到四参数实现；事实关系保留这一中间层。初始化依据旧/新长度和 headDiagonal/tailDiagonal/tailEnabled/interDiagonal 构造一组对角线，限制节点空间为 (iLength+1)×jLength；有条件裁剪尾部偏差。它并不无条件枚举所有旧×新元素对，默认设置与增强配置会改变搜索范围。

长度上限和 dLength2≤dLength 以断言表达；断言宏、分配失败及溢出行为依赖构建设置。maximalCost 累加“替换”和“完整更新”的配置成本，取较小值作为上界，不是用数据库 EXPLAIN 或现场计时得出。

SequenceCost 的已读片段（2193–2271）显示：minimalUpdateCost 先把比较缓存设 Unknown；updateCost 仅在 remainCost>0 时调用比较器，否则直接按 Modified 处理。NotModified 免更新行成本，但如果序号不同仍有移动成本。因此 Update 计划不等价于内容真的改变，而“未改值但移动”也可能需要 SQL。

## 后续核实：比较器与 Reader 的顺序前提

PosCode UserDataSets 的 Reader 构造（poscimfw/pcdmg/R_pcodedo.sqx:91–112）确实以 d_SeqNo DESC 查询 FRCODE_UDATA。对应 ItemComparator（C_pcodedo.cpp:208–248）以旧记录迭代器差作为旧长度，取缓存末端的倒数元素定位旧序号，并断言保存序号与请求值一致；不能自动推广到所有生成 Reader，更不能假定缺号或重复序号已经被此断言安全处理。

完整读取 compareCollectionItemToHostVars（同文件373–425）：逐列比较 NAME、TYPE、VALUE、ORIG，空指针当空串，以各列 MAX_*_LEN 的 strncmp 比较；任一不同返回 true，否则 false。它不是比较整个 BO，也不做大小写、空白或业务归一化。列长常量及上层输入保障待头文件/DDL/调用方核实。

## 后续核实：Merge 回调承担不同清理顺序

已读 CIMFW_DO_EditCallbackForMerge 的实现片段（2274–2379）：构造时若旧长度较长，先预留尾部删除范围；单项 addDelete 本身为空；addInsert 在已有目标位置改成更新；序号变化时累积 Travel 而不是 Shift。finalize 冲出 Travel 后再输出尾部 Delete/DeleteAll 和新增范围。

这与已读 Writer::travel 不删源的行为相衔接：不能单看一个空 addDelete 就断言永不清理，也不能单看 Travel 就称其完成了删除源。实际 outSQLs 还会由调用者排序；排序和完整 Merge 计划在重叠范围上的效果尚未运行验证。

剩余范围收敛为：成本下界填充、编辑节点、计划排序、其他比较器/Reader 变体以及 DO/数据库运行验证。这里新增两个模板方法及两个生成方法的完整审阅，辅助片段不自动升级为整个类已审阅。
