# 派工选择：跨方法深入追踪

范围：普通批次的 PosDispatcher_i 路径。此文完整读取了列出的普通派工方法体，明确区分直接代码、宏依赖与运行假设；暂停批次、耐用品和 FlowBatch 的不同选择链仍需分别深入分析。

## 纠正此前的入队解释

PosDispatchingManager_i::addToQueue 确实调用各设备 dispatcher 的 addToQueue，但 `poscimfw/pdp/pdp.sqx:419–505` 的 PosDispatcher_i::addToQueue 实际将旧内存队列实现放在块注释中，只剩方法跟踪。同文件 removeFromQueue（549–617）也是如此。

因此，“CALLS addToQueue”是事实，“该方法把批次加入内存队列”不是事实。有效选择路径依赖数据库中的 FRLOT_EQP 关联与 FRLOT 状态；Lot 的 queued machines 集合仍由管理器更新，两者之间的持久化映射需要继续追踪。

## whatNextForMachine：候选与执行顺序

完整方法：pdp.sqx:2296–2655。

1. 初始化空 DispatchDecisionSequence。设备为空时直接返回空序列（2328、2355–2359）。
2. 用设备 identifier 查询 FRLOT_EQP 的关联数量，用于预分配候选序列（2360–2377）；这个 COUNT 不是最终合格候选数。
3. 游标联结 FRLOT 与 FRLOT_EQP，按设备 ID 与 system key 关联筛选 LOT_HOLD_STATE=NotOnHold、LOT_PROCESS_STATE=Waiting、DISP_RESERVED=FALSE，且 FOR READ ONLY（2386–2394）。旧 SQL -- 注释中的分号不是有效终止符。
4. 逐项 FETCH LOT_ID/LOT_OBJ，只有 SQLCODE==0 才加入候选；最后按实际读取数缩短序列并 CLOSE（2413–2429）。
5. 调用 currentWhatNextForMachine 得到当前生效配置，再用 convertToLogicInfoFromParameters 解析 parameters（2436–2439）。
6. 过滤名称以 SP_WhatsNextRule_Prefix_For_Durable 开头的规则；过滤后没有普通规则时创建 INT-PRIORITY 默认规则（2445–2470）。
7. 从最后一条规则到第一条规则逐一查找策略对象，调用 dispatchFor_inSQL，并将结果替换当前候选（2490–2517）。这证明组合执行顺序反向，但最终优先级效果还取决于各算法是否稳定排序或过滤，不能只凭循环方向认定所有算法都具有相同优先级含义。
8. 将最终每个候选包装为 ProcessActivity，包含一个 processedMaterialGroups 元素与 plannedMachine；返回 DispatchDecisionSequence（2526–2547、2654）。这里生成派工建议，没有看到启动设备或提交进站交易。

SQL 错误由 FW_THROW_SQLERROR 宏处理，策略未找到与派工失败通过映射宏处理；锁错误被转换为框架错误（2556–2591）。宏定义缺失，不能补造具体错误码的完整语义。

## 当前生效配置不是普通 getter

完整方法 currentWhatNextForMachine：pdp.sqx:961–1158。

- 取得当前时间并按固定格式生成时间字符串（971–984）。
- 当 next effective time 非空且当前时间已达到它时，扫描配置列表，找到第一条时间字符串晚于当前时间的记录；有已生效前项则替换 current，记录下一次生效时间；全部已生效则选最后一条并清空 next time（986–1071）。
- 当前 parameters 为空字符串时创建 INT-PRIORITY 默认配置（1074–1092）。
- 返回 current 配置副本（1097–1098）。

这会标脏和改变内部缓存，不是纯读取。遍历依赖输入列表顺序，方法内部没有排序。不能未经设置/调用约束就认定任意顺序列表均能按时间正确选择。

直接访问 theCurrentWhatNextLogic->parameters 前的对象初始化不变式尚需结合 init 与宏定义核实，不能仅凭局部指针操作判定存在或不存在空指针缺陷。

getEffectiveWhatNextLogic（1189–1248）只复制整个配置列表，不等同于“计算当前配置”。

## 设置配置的保留与清空策略

完整方法 setEffectiveWhatNextLogic：pdp.sqx:1337–1547。

先复制输入列表并标脏（1361–1363）。SP_DEFAULT_DISPATCHINGRULE_USEFLAG 未设置按 0 处理，等于 1 且存在 current 指针时调用清理宏（1375–1395）。列表为空则清空 next time；不为空时按输入顺序查第一条未来配置，选择最后已生效项或更新 next time（1403–1474）。parameters 为空再回退 INT-PRIORITY（1479–1498）。

代码未见按 effectiveDateTime 主动排序或严格校验。因此保留当前配置、默认值回退、未来生效列表不能简单描述成“新列表第一条立即生效”。宏清理后的指针状态、全未来列表的初始配置来源仍需初始化路径证据。

## 参数解析与策略对象解析

`poscimfw/pfwgls/pfwgls.cpp:406–463` 的全局 convertToLogicInfoFromParameters 按冒号拆规则；每个 token 若有 '('，前半为 logicName，括号部分按长度截取为 param；没有 '(' 则参数为空。没有看到完整的嵌套、引号、括号平衡或参数内冒号的语法解析，所以不能把它当作通用表达式语言。

`poscimfw/pdp/pdpmg.cpp:2046–2062` 的 findWhatNextLogicObjectNamed 通过 SP_CORBAOBJECT_FIND... 宏查找对象，并处理 LogicObjectNotFoundSignal。接口名到具体对象的列表绑定/初始化仍需读取，不能自动把字符串 FIFO 当作已确认运行绑定。

## 对原本体与数据索引的影响

- 保留管理器到 dispatcher 的 CALLS 边，补充目标方法仅跟踪的规则，禁止把该边解释成队列变更。
- 增加 current 配置选择、候选筛选、普通/耐用品规则过滤、反向组合和决策封装等规则。
- FRLOT_EQP 是有效候选检索中的实际来源，不应因逗号联表提取遗漏而消失。
- SQL -- 注释必须在语句提取阶段处理，不能在第一个分号处盲目截断。

## 下一组尚待核实

dispatcher 初始化、策略对象工厂注册、普通暂停队列、耐用品队列、FlowBatch dispatcher、Lot queued machines 到 FRLOT_EQP 的完整存储绑定、各排序算法的稳定性和边界条件。它们是当前深入分析的未完成项。

## 初始化与策略注册的进一步证据

PosDispatcher_init（pdp.sqx:209–241）显式调用 INIT_POINTERDATAMEMBER 初始化 current what-next/where-next，初始化配置列表，调用基础 Dispatcher_init，清空 next time，建立旧 waiting lot 集合及控制作业集合，并调用 GIVE_MY_POINTERS_TO_MY_DO。初始化入口已找到，但宏实现和实际对象生命周期仍缺失，所以此前的指针初始化问题缩小为宏与调用不变式，不能直接判定空指针缺陷。

PosDispatchingManager_init（pdpmg.cpp:335–379）初始化策略对象列表，并通过不同 marker 绑定一般派工工厂和 FlowBatch 工厂；没有看到它逐一创建或注册 FIFO 等具体策略。

registerWhatNextLogicObject（pdpmg.cpp:1792–1837）检查输入对象非空、以对象 getLogicName() 为 key 防重复，按 EBROKER 条件分支把对象转字符串，标脏后加入列表。空对象也抛 DuplicateLogicObjectSignal，不能按异常名推断一定是重复 key。现有源码检索没有找到直接调用该注册方法的外部启动代码；因此“类返回策略名”与“运行环境已注册该策略”必须分开。

## 默认 INT-PRIORITY 算法实际读取什么

PosWhatNextInternalPriority_i::getLogicName（pwtintp.cpp:135–146）返回 INT-PRIORITY，确认默认名称对应的类契约；仍不证明它已在当前运行配置中注册。

其 dispatchFor_inSQL（pwtintpdb.sqx:88–181）对每个传入候选，通过 FRLOT 与 FRPO 联表读取 PLAN_END_TIME 和 REMAIN_CYCLE_TIME（124–126）。SQLCODE==0 才计算 plannedTime.substractTimeStamp(currentTime) / (remainingCycleTime * 60 * 1000)；若计划时间早于当前时间再取负，并加入排序容器（129–146）。并未直接读取 FRLOT.PRIORITY 字段，不能把此默认策略说成按静态优先级列排序。

比较函数 compareDoubleKeys（36–47）返回相等 0、大于 1、小于 -1。容器顺序与稳定性仍缺实现；时间差方法的单位/符号约定和 remainingCycleTime 为零的业务不变式尚未核实。方法体没有显式零分母保护，但是否可达需上游数据约束，暂不升级为确认缺陷。

SQL 读取失败时该实现不将候选加入结果，而非原样保留所有候选。它不仅是对相同集合做无损重排，组合规则链可能改变候选数量。
