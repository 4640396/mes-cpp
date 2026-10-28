# 生成删除方法的七种模式代表

通过 persistence-families.json 定位 U:Writer:deleteFrom 的730个定义，token模式候选为7种。本报告完整阅读每种的首个代表，不推定其余成员语义等价。字面值/标识符会被模式指纹掩盖，仍须逐项核实表映射、宏和调用范围。

| 完整阅读代表，路径相对 fw_cpp_sqx | WHERE 范围 | 说明 |
|---|---|---|
| poscimfw/pabcl/U_ppptsedo.sqx:79–95，Writer_FRPPPTSET | system key | 无参数 deleteFrom 删除对象主表记录 |
| 同文件171–188，Writer_FRPPPTSET_BASE | system key + d_key | 单集合元素 |
| poscimfw/pcdmg/U_pcodedo.sqx:205–223，Writer_FRCODE_UDATA | system key + d_SeqNo BETWEEN from AND to−1 | 参数表达半开区间 [from,to)，未见反向/溢出参数校验 |
| poscimfw/pdrmg/U_prtclsdo.sqx:538–557，Writer_FRRTCLSET_DF_RGRP | system key + tableMarker=prefix拼接父序号 + 子序号区间 | 给定父元素下的子序列区间 |
| 同文件559–577，同类另一重载 | system key + CAST(SUBSTR(tableMarker,markerLength+1) AS INTEGER) 区间 | 按父序号范围删整组子元素，不是按子 d_SeqNo |
| poscimfw/pmcmg/U_pmcdo.sqx:1501–1520，Writer_FREQP_CAST_LOT | system key + tableMarker=prefix拼接父字符串key + 子序号区间 | 字符串父key与子序号组合 |
| 同文件1522–1539，同类另一重载 | system key + SUBSTR(tableMarker,markerLength+1)=父key | 按父key删整组子元素 |

system key 在这些语句中不是 Lot ID，来自 Writer 的宿主变量，不能按业务对象名擅自替换。拼接序号到字符串的数据库类型转换、表标记约定、markerLength 初始化及父键是否允许特殊值依赖头文件/构造/调用者，当前未验证。

七个代表均有 SQL_NOT_FOUND 宏分支，随后 SQL_ERROR 宏映射；主表代表用 DeletionErrorFromDO，集合代表用 UpdateErrorFromDO。宏展开缺失，不能只凭名字断言错误码和运行异常完全一致。没有本地提交/回滚，也没有认证或业务状态守卫；这些 Writer 属于存储执行层，不应视为直接的业务删除接口。

这一结果说明生成代码也有不同层次：主对象、平集合、序列、嵌套集合。已读样板未证明所有表的外键、级联删除和并发锁配置，后续需要连接 CollectionHelper 与 DO 调用方。
