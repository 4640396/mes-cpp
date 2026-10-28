# 工序采集快照与引用的不同路径

完整方法体审阅，来源 poscimfw/ppcdf/ppcope.cpp，行号相对 fw_cpp_sqx。结合 [采集算法与判限](data-collection-deep.md) 阅读；没有真实 MES/数据库测试。

## 定义 setter/getter 不对称

setAssignedDCDef（2506–2522）标 dirty 并通过宏写 theAssignedDCDef。getAssignedDCDef（2554–2605）却不读该字段，而是看 theAssignedDataCollections：空列表返回 nil；非空时取第0项的 definition ID，通过管理器查对象并 duplicate 返回。不能声称先调用 setter 就能确定 getter 返回相同定义，也不能把第0项推广成任意当前定义。

这解释了前道 Delta 的默认定义路径：findCollectedDataByWafer 收到 nil 定义时调用 getAssignedDCDef，默认的是列表首项，再按标识查工序已分配项，而不是直接查询最新采集结果表。

setAssignedDCSpec（2636–2652）写 theAssignedDCSpec；getAssignedDCSpec（2681–2692）读取同一字段的宏。这个引用与 doSpecCheck 使用的内嵌 dcSpecs 仍是两条数据路径，不因引用 getter 存在就自动刷新限值。

## 两种整体赋值入口

setActualStartInfo（6174–6701）复制设备、逻辑/设备/物理配方、reticle、fixture、参数集、采集标志、采集列表和抽样晶圆。对缺少字符串化引用的若干对象通过管理器按 ID 解析，再保存本地副本；并非在此方法里重新构造 dcSpecs 限值。

assignedDataCollections 在6512行整体复制输入，随后主要补定义、规格、前道定义、前道工艺定义和晶圆对象引用，6672行替换本地集合。因此这条路径证明工序接收调用者给出的限值快照，限值最初由谁填充、什么时候更新仍需调用者证据。

setDataCollectionInfo（6841–6880）直接替换整个采集列表，并显式标记集合 dirty。两个入口都在 SP_FRLOTPO_MAINTENANCE 解析为1时调用 setLotPO，分别使用 ACTUALSTART 与 DATACOLLECTION 模式；非零返回值转成框架异常。配置由 atoi(getenv(...)) 读取，本方法未判断空环境变量，部署初始化保障未知。

setLotPO 调用在本地对象已修改之后发生，异常传播不证明前面的对象变更自动回滚。其数据库维护实现现已完整阅读，见下文；不建立“已提交”结论。setActualStartInfo 的普通字段修改与 setDataCollectionInfo 的显式集合 dirty 标记也不能未经框架验证就认定保存机制完全等价。

getActualStartInfo（6737–6811）复制当前字段/集合，参数集与抽样晶圆经对应 getter 取出，不重新读取配置对象限值。

## 局部项目更新不会刷新规格

setAssignedDataCollectionItemInfo（17053–17139）复制输入项目列表，字符串引用为空的 wafer 根据 ID 解析，`*` 特殊值保留为空引用；随后按 definition ID 找首个匹配采集条目，仅替换 dcItems，标 dirty，再替换列表。没有匹配条目时没有显式抛找不到，也没有追加新定义。该方法没有改 dcSpecs、没有调用 doSpecCheck，也未直接调用 setLotPO。

getAssignedDataCollectionItemInfo（17177–17207）返回首个同定义标识条目的 dcItems 副本，无匹配返回初始化空序列。定义/项目标识重复时的全局唯一性没有 DDL 或上层校验证明。

## 具体待验证疑点

setActualStartInfo:6547 的条件检查 `dataCollectionDefinitionID.stringifiedObjectReference`，但6559–6569的分支解析并写 `dataCollectionSpecificationID`。前一分支刚可能把定义引用补齐，因而这个条件不能等价解释成“规格引用为空则解析”。这是原始代码中的字段不一致，需结合宏对空 ID 的行为、实际输入和编译版本验证；当前不修改历史源码，也不宣称已复现生产故障。

本报告确认的是配置引用、调用者提供的工序快照、局部项目数据三层。实时更新语义、调用者顺序、DO 保存及数据库维护仍需继续核实。

## FRLOTPO 的维护是 ID 投影，不是完整快照

以下三个全局函数均来自 poscimfw/pprmg/plotpodb.sqx，已完整阅读，不在原有限定名方法索引中，另外登记为 global_function。

setLotPO（266–596）先以 PO_OBJ 查 FRLOTPO 的 LOT_ID。SQL_NOT_FOUND 直接返回初始 rc=0，不插入主记录；其他查询错误返回 SQLCODE。后续所有修改按这个 LOT_ID 执行，而非继续按 PO_OBJ。

| 模式 | 修改 |
|---|---|
| ACTUALSTART | 更新主表 LAST_UPDATE、EQP_ID、RECIPE_ID、LCRECIPE_ID；重建 DC、Reticle、Fixture 关系 |
| DATACOLLECTION | 仅重建 FRLOTPO_DC，不更新主表 LAST_UPDATE |
| RETICLE / FIXTURE | 删除对应 category 的耐用品关系后按输入重新插入 |
| MACHINE / MACHINERECIPE / LOGICALRECIPE | 只更新主表对应 ID，未设置 LAST_UPDATE |
| 其他未识别模式 | 查到主记录后也可能直接 rc=0，未见模式错误异常 |

DC 重建先删除该 Lot 的全部 FRLOTPO_DC，再按定义 ID 去重，保留输入首个定义/规格 ID 对。相同定义、不同规格的后续项不会同时保留。表只写 LOT_ID/DCDEF_ID/DCSPEC_ID，不写 dcSpecs 限值、dcItems、测量值、判限结果、动作码或采样晶圆。由此不能拿这个维护表还原完整工序快照。

耐用品关系写 FRLOTPO_DRBL 的 LOT_ID/DRBL_ID/CATEGORY；这里没有类似 DC 的显式去重集合。更新/插入非0 SQLCODE 返回错误；删除则对 SQLSTATE 00000/02000 容忍。任何一步失败都提前返回，前面已执行的 DELETE/UPDATE 是否回滚由外层事务决定；这些函数中没有 COMMIT/ROLLBACK。

setLotPOBaseInfo（66–235）按 LOT_ID 查 count 决定 UPDATE/INSERT，写 Lot、PO/PF 引用及路线定位字段，并将设备/配方 ID 的宿主变量先清空且未从输入填值。随后清空该 Lot 的 FRLOTPO_DC、FRLOTPO_DRBL。它不是保留旧关系的局部刷新，也没有自动恢复采集/耐用品关系的调用。count 后写的并发互斥和表唯一性需数据库与交易证据。

deleteLotPO（621–680）依次删 DC、耐用品、主表，按上述 SQLSTATE 容忍无记录；中途失败提前返回，不自带事务恢复。

当前源码能证明维护投影的清空/重建顺序，不能证明它是生产查询的唯一数据源。plot.cpp 有基础信息维护/删除调用位置，但这些上层方法尚未在本专题完整审阅，不能据搜索结果补出完整生命周期。
