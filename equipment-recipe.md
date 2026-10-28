# 设备、配方、载具与派工：源码证据

本专题记录已核实的对象级规则与条件，不将领域样板描述为全量交易审计。

## 设备配方的适用设备判断

`poscimfw/prcmg/pmcrc.cpp:1342–1387` 的 PosMachineRecipe_i::isUsedBy：

- 输入设备为空则直接返回 FALSE。
- 取得输入设备 identifier，调用 allMachines() 取得配方关联设备列表。
- 遍历列表，通过 identifier 字符串相等判断匹配；匹配返回 TRUE。
- 列表中设备对象为空时抛 FrameworkErrorSignal。

该方法证明配方与设备之间存在基于设备标识的适用关系检查，不证明设备当前正在执行该配方，也不包含下载到设备、执行开始或配方体校验。

## 配方契约

`poscimfw/include/pmcrc.idl:42,109–202` 声明 PosMachineRecipe 的名称空间、物理配方 ID、配方信息、适用设备、配方体确认标志、配方体文件位置与文件名等接口。契约存在不代表所有方法都已经追踪。

`poscimfw/include/plcrc.idl:46` 中 PosLogicalRecipe 继承 MOFW_CachedManagedObject 和 NamedEntity，而不是直接继承 MachineRecipe。其后 find...ForSubLotType 等方法同时接收设备、设备配方与 subLotType（例如 348、360、372、391、404、417），说明逻辑配方设置选择在契约层面有多条件输入。具体优先级、默认值和冲突策略仍待实现核实，不把这些接口直接解释为实际控制顺序。

## 派工文件识别的纠正

`poscimfw/pdp/pwtdfifo.cpp:126–137` 的 getLogicName 返回 DURABLE-FIFO，类名为 PosWhatNextDurableFIFO。不能仅因文件名含 FIFO 就将它认定为普通生产批次的先进先出派工算法。该文件虽有 compareKeys 辅助函数，仍需查实际选择算法及调用方。

## 覆盖边界

下文补充了设备状态、配方匹配、载具暂停及普通/耐用品 FIFO 的有效实现。设备所有能力、资源比较内部算法、完整派工策略组合与事务边界仍未全部展开。文件名和单纯契约不自动升级为业务调用事实。

## 设备状态：在线不等于可用

`pmcmg/pmc.cpp:11690–11717` 的 setCurrentMachineState 标脏、保存状态对象引用，从状态对象取得 isMachineAvailable 结果写入 theAvailableStateFlag，并通过该状态的 E10 对象 identifier 更新 theCurrentState。状态对象或 E10 对象为空时异常。

`pmc.cpp:11812–11849` 的 isAvailableState 读取当前状态对象，再调用其 isMachineAvailable；对象为空返回 FALSE。`pmc.cpp:12800–12809` 的 isOnline 则比较 theOnlineMode 与 Online 常量。两个方法依赖不同信息，不能把 Online 当作可生产或可派工的充分条件。控制模式、资源状态、配方适用性和其他限制还要分别分析。

## 逻辑配方选择的实际优先顺序

`prcmg/plcrc.cpp:4398–4491` 的 findMachineRecipeForSubLotType：

1. 按 theDefaultRecipeSettings 的数组顺序遍历设置，解析每项设备配方引用。
2. 配方非空且 isUsedBy(aMachine) 为真才继续。
3. 该项资源状态列表为空时直接选中；否则调用设备 isSameProcessResourceStatesForSubLotType，匹配才选中。
4. 首次匹配即 break；没有匹配时返回初始 nil。
5. 已选中的设置若 recipe.identifier 使用 Active 版本，则调用所选配方 getActiveObject；active 对象为空时异常。

因此“第一条满足条件的设置”会影响结果，不能把它简化成按设备编号唯一查配方。具体资源比较算法与 active 版本管理内部仍未完整展开。

## 载具暂停限制

`pdrmg/pcas.cpp:9796–9828` 的 PosCassette_i::makeOnHold 条件为 `isInBank() || !isOnHold()`，满足则保存原暂停状态、标脏并设置 OnHold，否则 InvalidStateTransitionSignal。重复暂停并非一律幂等：在库允许，非在库且已经暂停时异常。这与批次基础暂停实现不同，不能复用一套状态机。

## 普通批次 FIFO 的有效实现

有效方法在 `pdp/pwtfifodb.sqx:34–101` 的 dispatchFor_inSQL。对传入的 lots 列表逐项取得 system key，从 FRLOT 查询 QUEUED_TIME（60–61），仅 SQLCODE==0 时将该候选加入按排队时间作 key 的 SortPosLotList（65–67），最后取得结果序列（72）。此方法是在给定候选上进行数据库读取和排序组织，不代表自行查出所有可加工批次。排序容器实现缺失，完整同键顺序和比较规则未独立验证。

耐用品方法 `pdp/pwtdfifodb.sqx:29–149` 按 category 分支读取 FRCAST、FRDRBL、FRRTCLPOD 的 QUEUED_TIME，类别不支持时返回初始结果；不能与普通批次路径混用。

## 派工入队的业务分支

`pdp/pdpmg.cpp:610–812` 的 addToQueue 取得产品规格、当前工序后：普通路径通过工序 findMachinesFor(productSpec) 获得候选设备，逐个调用 dispatcher 的 addToQueue，并记录 queued machines 和 queued timestamp（745–767）。FlowBatch 路径另有入口工序、目标工序、已绑定设备的处理（671–738）。但继续追踪到 `pdp.sqx:419–505` 后确认普通 PosDispatcher_i::addToQueue 的旧队列修改体被块注释包围，现行方法仅保留跟踪。不能把管理器“调用名为入队的方法”解释成该方法实际更新了内存队列。

移出队列 `875–989` 遍历 Lot 已记录的 queued machines 调用各 dispatcher 的 removeFromQueue，然后清空 Lot 队列设备清单（937–951）。普通 dispatcher 的 removeFromQueue 在 `pdp.sqx:549–617` 同样仅保留跟踪，旧修改体已注释。有效候选检索在 whatNextForMachine 中读取 FRLOT_EQP 与 FRLOT；Lot 设备集合到关系表的持久化路径需要独立核实。详见 dispatch-deep.md。对象缺失的异常、部分更新后的事务回滚仍依赖框架证据。
