# 拆批、成员转移与数量更新

完整方法体静态审阅。路径相对 fw_cpp_sqx；本报告核实拆批和底层成员转移，不把它当作已完成的合批交易分析。工厂复制、宏及事务仍有外部边界。

## 基类逐个创建，扩展层重点处理首个结果

ProductManager_i::createSplitLotsFrom（smtchcmf/prdctmng/prdctmng.cpp:1546–1736）取得父批产品规格和 LotFamily，对每个 splitData 调工厂 newLot(parent)，要求 newLotID 指针非空，设置 ID、名字、规格、管理器、家族，并调用父批 transferProducts_toLot；非 TRANSIENT 分支加入管理器列表。这不是本地自动分配子批 ID 的实现，ID 的合法性/唯一性和工厂复制范围仍需其他证据。

PosProductManager_i::createSplitLotsFrom（poscimfw/pprmg/pprmgr.cpp:2212–3266）先遍历所有 splitProducts，将每片 PreviousLot 写为父批，并累计输入片数 length；然后显式调用基类。返回长度0报错，但没有检查返回长度必须为1。后续 aChildLot 明确取 retVal[0]，没有对全部返回子批再套循环。

因此下面的数量刷新、流程、状态、计划和关联复制，能证明的是对首个子批的扩展处理；其他子批可能已有工厂/基类复制数据，不能反过来说它们完全未初始化。上层是否保证一次只有一个 splitData，尚未找到交易证据，不能宣称任意多子批都受完整处理。

## 数量的口径不同

扩展层 refresh 首个子批和父批的当前数量；首个子批 originalQuantity 设置为所有输入 splitProducts 数之和，父批 originalQuantity 减同一总数。这不是逐子批按各自成员数赋 originalQuantity，也不在此方法显式检查重复晶圆、空子批、合计越过父数量等全部约束。

PosLot_i::refreshQuantity（plot.cpp:1923–2010）先清 quantity/productQuantity/controlQuantity/notAllocatedQuantity，再遍历实际成员：ControlWafer 计 control，否则 product；未 STBAllocated 另计 notAllocated；quantity=control+product。不是直接拿输入数量赋值。setProductQuantity（12272–12286）则只写 productQuantity，不联动其他数量，不能视为 refresh 的等价入口。

## 首个子批的扩展复制有选择性

| 内容 | 当前源码行为 |
|---|---|
| 工序计划 | 默认复制父 LotSchedule 的工序计划日期、设备、主流程与工序号；SP_NOSCHEDULE_FOR_CHILDLOT 恰为 `1` 才跳过 |
| 流程与状态 | 父有上下文才创建子上下文；复制 BankInRequired；调用 setSplitLotState；子批 OnHold 则随后 makeNotOnHold |
| 完成批处理 | 子 lotState Finished 且父上下文存在时，从 currentLot 移除并 archive |
| 备注 | 复制 LotNote；工序备注默认复制，SP_NOLOTOPENOTE_FOR_CHILDLOT=`1` 时跳过；若遇重复异常，后续对象选择仍依赖当前变量状态，不能简单说“读取已存在备注再更新” |
| MonitorGroup / QTime | 将子批加入父监控组；新建 QTime 对象并复制信息、改 lotID 为子批 |
| FutureHold | 排除 MergeHold 和 ReworkHold，其他逐项尝试复制，重复异常忽略 |
| FutureRework | 按父标识找记录，复制信息并替换 lotID 后创建新请求 |
| 其他 | STB来源、批注、日期、类型、供应商、优先级、客户、订单、Bank/Owner、发货/派工/责任工序/备份/位置/转移标志及备份来源等逐项设置 |
| PropertySet | SP_CREATE_PROPERTYSET_FOR_NEW_LOT 解析为1时新建集合；该方法不证明父全部属性已复制 |

setSplitLotState（plot.cpp:8528–8625）复制六个状态维度，将 created/released/activated 时间都设输入时间，Completed 时也设 completionTime；它不是按新交易重新运行各状态转换守卫。之后 createSplitLotsFrom 又清除首子批 Hold 状态，不能把中间复制的 Hold 当作最终状态。

setLotMostRecentlySplitFrom（15475–15489）独立保存一个 objectIdentifier；本方法存在不证明 createSplitLotsFrom 每条路径都调用它，当前拆批主体未见这个调用，工厂复制/其他入口待查。

## 成员转移与物理转盒不同

Lot_i::transferProducts_toLot（smtchcmf/prdctmng/lot.cpp:3130–3171）逐项检查产品非空，先源 removeMaterial，再目标 addMaterial，最后 product.setLot；输入空时不要求目标非空。没有本地回滚、规格兼容/暂停/在制状态完整守卫、载具槽位调整或目标数量刷新。

Lot_i::addMaterial（4174–4299）先按物料标识检查重复，加入本地集合后 narrow Product，再 addMaterialGroup、setLot，并把目标 Lot 的产品规格设置给 Product。addMaterials（4117–4145）只是逐个调用。Product_i::setLot（product.cpp:110–123）本身只写引用；getLot（59–70）通过宏读取。单独改引用不等价于成员列表已转移。

MaterialGroup_i::removeMaterial（mtrlmngm/mtrlgrup.cpp:291–365）会先调用物料 removeMaterialGroup 再移除集合；Material_i 的 add/removeMaterialGroup（material.cpp:508–603、634–703）也有反向回调。去重、先移除与异常映射使对象链逐步更新，不代表事务原子性。

## 装载/卸载 Lot 的另两个入口

Lot_i::loadLotIntoMaterialContainers（lot.cpp:2706–2817）先统计全部目标空槽总数，足够后再逐盒重新取空位，把产品装入位置容器；这一层调用的是 addMaterial_atPosition，不是 Cassette::addWafer 的计数入口。虚函数覆盖、载具 LotEntry 同步由其他层保障与否需继续核实。最后更新 Lot 自身载具序列的索引逻辑也依赖原列表长度与输入容器顺序，不能宣称任意已有载具列表都可安全追加。

unloadLotFromMaterialContainers（2851–2987）按每片自己的当前容器及位置移除，最后读取此时 Lot 的载具列表作为返回值并清空。回调可能在前面已修改列表，因此返回的不一定是调用前完整载具快照。与上一份报告中“在指定盒上按位置卸 Lot”不同，见 [载具装卸](cassette-loading-deep.md)。

## 仍需验证

拆批事务入口是否限制单子批、重复片/交叉输入约束、工厂复制/ID分配、原始数量业务含义、Hold记录处理、载具计数同步、完整合批校验及失败后的事务恢复。当前不以局部函数存在推定这些都完成。

后续已完整追到 newLot 的宏工厂与可见初始化，以及 joinAll_into 合批对象方法，见 [合批与子批初始化](lot-join-init-deep.md)。Lot_init 确有拆分来源写入，但宏工厂生命周期和完整交易仍有边界，不把这条补证扩大成全链已完成。
