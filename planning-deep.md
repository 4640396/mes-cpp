# 计划对象、工序排程与派工排序

本报告完整阅读20个方法，路径相对 fw_cpp_sqx。配置对象管理、工序计划值、Lot计划值与派工策略是不同层次；未证明存在全厂排程优化器或实时设备预约。

## 两层计划对象的创建不同

PosPlanManager_i::createLotScheduleNamed（poscimfw/ppl/pplmgr.cpp:721–813）调用工厂，设置 manager/identifier 后在非 TRANSIENT 模式加入管理器列表。本方法的主动查重旧代码已注释，不能因为有 DuplicateIdentifierSignal catch 就说一定先执行 exists 检查；其他层是否拒绝重复仍需工厂/setIdentifier 证据。

PosLotSchedule_i::createLotOperationScheduleNamed（pltsch.cpp:271–360）则明确先检查子计划集合同 identifier 是否存在，存在直接抛 DuplicateIdentifierSignal，再绑定工厂创建并登记。调用失败、factory返回 nil、对象标识更改等行为不能由命名规则自动补齐。

removeLotOperationSchedule（396–430）先从集合移除，再 clear并经工厂删除；removeAllLotOperationSchedules（464–525）取快照逐个删除，只忽略找不到。find（556–566）使用 NO_EXCEPTION 查找宏，all（595–610）使用 GET_SEQUENCE_SET_DIRTY；宏默认值及对象引用转换仍未展开。

管理器 removeLotSchedule（pplmgr.cpp:848–881）在非 TRANSIENT 时先移列表，再 clear和DELETE_CIMFW_OBJECT；removeAllLotSchedule（932–998）按编译模式取本地列表或数据库查询结果后逐个删除。此方法自身不证明外部 Lot 上的引用已同步解绑，也不等同事务提交。

## TRANSIENT 查找会处理重名计划

findLotScheduleNamed（913–928）按编译模式选择本地查找宏或 _findLotScheduleNamed。后者（pplmgrdb.sqx:354–437）查 FRLOTSCHE，要求 LOTSCHE_ID匹配且 D_OBJMANAGER非空；count>1时逐条取引用，查询 FRLOT 是否使用该 LOTSCHE_OBJ，SQLCODE==0即break。

查询没有 ORDER BY，不能保证重名时返回固定一条。没有找到被Lot引用的记录后也没有显式抛重复或重置nil分支，最终转换行为依赖宿主缓冲和宏。count查询、单行查询及fetch的错误检查并不统一；尚未运行零行、重名全失联和SQL错误场景。不能将它概括成“重名必报错”。

## 工序计划 setter 只保存值

PosLotOperationSchedule_i 的 setPlannedStartDateTime（pltopsch.cpp:341–355）与 setPlannedEndDateTime（425–439）分别赋 TimeStamp；setPlannedMachine（509–523）存设备引用；setMainProcessDefinition（592–606）存流程引用；setOperationNumber（676–690）存字符串。未见 start≤end、设备能力/容量、工序存在性或资源预约的完整检查；TimeStamp 转换宏和类自身的输入规则仍未知。

Lot 自身 setPlannedStartDateTime（pprmg/plot.cpp:3680–3692）、setPlannedCompletionDateTime（3760–3772）又是两个字段。setLotSchedule/getLotSchedule（10672–10686、10716–10726）保存/读取引用，不把这些时间字段自动联动到子计划。

已读生成片段 C_plotdo.cpp:5752–5764、7501–7502 显示 DO 的 planned timestamp 指针及 PLAN_START_TIME/PLAN_END_TIME 转换；巨大 BO/DO 方法未因此整段登记已审阅，完整指针交接和保存触发仍保留未知。工序排程写 FRLOTOPESCHE 的 SQL 是另一条表映射候选，不自动等同 FRLOT 字段。

## EDD 实际读取哪一层

PosWhatNextEDD_i::dispatchFor_inSQL（pdp/pwtedddb.sqx:34–102）对每个输入 Lot，取字符串化引用末个 `#` 后的 system key，查询 FRLOT.PLAN_END_TIME；SQLCODE==0才把计划完成时间字符串作为key加入 SortPosLotList，然后取序列返回。

它不查询 FRLOTOPESCHE、不遍历 LotSchedule 的工序计划，不在这里检查计划开始时刻是否已到，也不实际分配设备。aMachine与parameters在有效方法体未用于筛选。排序容器的方向、相同key稳定性、空/无效时间排列依赖 SPLinkListT，未凭 EDD 名称补成已证实的严格先到期排序。

SQL非0时不把候选加入结果；没有单独将SQL错误转DispatchFailed的检查。因此这不仅可能重排，还可能减少候选数。`strrchr(...,'#')+1` 在判空之前执行，合法对象引用格式仍是输入前提，不能把后面的systemkey判空当成已完整保护所有异常引用。

与 [普通派工](dispatch-deep.md) 对照：默认 INT-PRIORITY 也使用 Lot计划完成时间，但还结合工序remainingCycleTime；两者不是相同规则。运行时是否配置/注册EDD依然需要启动/配置证据。

## 拆批复制只是联动的一条入口

已读 createSplitLotsFrom 会为首个子批复制 LotSchedule 及工序计划字段，受 SP_NOSCHEDULE_FOR_CHILDLOT 控制；同时另行复制 Lot自身计划日期。这证明一个具体调用链显式同步了两类数据，不证明任何 setter 都保持它们一致，也不证明其他子批获得同样扩展，见 [拆批分析](lot-split-deep.md)。

后续：计划工厂/ID生命周期、ProductRequest状态与计划时间关系、其他排序策略、运行注册、配置输入及真实交易守卫。当前对象模型不等于已实现自动优化排程。
