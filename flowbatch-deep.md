# FlowBatch：真实 SQL 队列、组批与双向关联

FlowBatchDispatcher 与普通 PosDispatcher 的实现不能混用。`poscimfw/include/pflwdp.idl:40` 声明它继承 MOFW_CachedManagedObject 和 NamedEntity，并不是由此契约直接继承普通 PosDispatcher。

## FlowBatch 队列确实维护数据库

`pdp/pflwdp.cpp:1780–1835,1867–1925` 的 addToQueue/removeFromQueue 调用 `_addToQueue/_removeFromQueue`。这与普通 dispatcher 的空业务体不同。

`pdp/pflwdpdb.sqx:67–154` 的 `_addToQueue`：

- Lot 为空时不进入操作体。
- 从 dispatcher 自身字符串引用中取 # 后的 system key，取得 Lot 标识与对象引用。
- 按 **LOT_KEY** 查询 FRFLWDP_LOT 是否已有记录（120），COUNT 条件没有限定 dispatcher system key。
- SQLCODE=0 且 count=0 时标脏并 INSERT；已有记录时进入错误处理宏路径，但缺少宏定义，不能断言会抛特定“重复记录”异常。

`181–239` 的 `_removeFromQueue` 同样先按 LOT_KEY 查数量，再按 LOT_KEY DELETE，不以 dispatcher system key 限定删除范围；DELETE 的 SQLCODE=0 或 100 被接受。SELECT 到 INSERT/DELETE 的事务与并发约束仍未知，不据此直接认定唯一性缺陷。

## 获取 dispatcher 有编译分支

`pdpmg.cpp:1189–1278` 的 getFlowBatchDispatcher：

- 非 TRANSIENT_MANAGER 路径解析已有引用；若为空，通过 marker 绑定工厂并创建 dispatcher，设置 manager 后保存引用。
- TRANSIENT_MANAGER 路径调用 `_getFlowBatchDispatcher`。

后者在 `pdpmgdb.sqx:142–193` 查询 FRFLWDP 的记录数，大于 1 抛框架异常，再读取 FLWDP_OBJ 转对象引用。零行时的对象转换/异常细节依赖宏，不能简单概括为“没有则创建”；直接创建只在另一编译分支看到。

## 流程批编号

getNextFlowBatchIdentifier（pflwdp.cpp:284–385）按 year/monthIndex/day 判断日期变化；初始或跨日将编号清零，编号到 999999 时也清零，然后加一。用 `%04ld%02ld%02ld%06ld` 拼接日期与六位序号。

这是有状态、会标脏的编号分配；不是随机 UUID，也不保证同一天无限调用不会回绕。实际持久化、并发串行化、monthIndex 约定与时区依赖外部框架，不在此处假定。

## setLots：不只保存列表

完整方法：pflwbch.cpp:848–1323。

1. 旧集合非空直接 LotsExistingSignal，不是覆盖式 setter（861–866）。
2. 逐项检查 Lot 非空、集合内 identifier 不重复；添加到 FlowBatch 集合后调用 Lot.setFlowBatch，已被别的 FlowBatch 指派时映射为 FlowBatchAlreadyAssignedSignal（872–901）。变更先于部分检查，失败后的事务恢复尚未知。
3. 仅第一项 Lot 用于确定 operation count。普通模式读取其当前工序的 getFlowBatchOperationCount；reFlowBatchFlag 为 TRUE 时从活动模块规格出发，若不是入口，向前回溯入口及最近目标工序，按 `nLenOpeCount - flowBatchOperationCountToEntry + flowBatchOperationCountToLastTarget` 计算（959–1173）。没有把第一项的过程推定为每个 Lot 都执行相同验证。
4. 取得每个 Lot 的 materialContainers，仅使用第一只 container 的 identifier 去重；theFlowBatchSize 赋为这组去重后 identifier 数量（1200–1253）。它在本方法中的计算口径既不是 Lot 数量，也不是晶圆数量，也不是所有 container 的总数。

此方法未直接看到所有 Lot 同产品、同工艺、同目标设备的完整兼容性验证；不能凭领域常识补造这些检查。其他 setter 可改变相关字段，所以不能把 setLots 的计算公式当作整个生命周期不可变约束。

## 设备预留与双向关系

setMachine（pflwbch.cpp:419–526）：传空设备时清除已有设备引用，并尝试从原设备集合移除该 FlowBatch；传入不同 identifier 的设备时，若原设备仍有效则 AlreadyReservedSignal，否则保存新设备并调用 aMachine->addFlowBatch(thisObject)。同 identifier 时不执行该替换分支。

getMachine（561–586）解析引用，返回有效对象或 nil；并不另行挑选候选设备。

removeLot（625–690）先从 FlowBatch 集合删除，再检查 Lot 的 FlowBatch 引用，非空时设 nil。removeAllLots（1433–1495）遍历 allLots 并逐项调用 removeLot，只忽略 LotNotFoundSignal。

Lot.setFlowBatch（pprmg/plot.cpp:2454–2560）传入另一个流程批时拒绝替换仍有效的已有指派；传 nil 时先清除自己的引用，再查原 FlowBatch 是否仍包含自己并尝试移除。这里有双向维护和互相调用，查找/删除宏的不存在处理尚缺定义，因此不能只凭局部顺序断言不会出现重复删除异常或一定原子一致。

## 本体应记录的差异

- 普通 dispatcher 的入队仅跟踪；FlowBatch dispatcher 的入队到达实际 SQL，使用不同职责与关系。
- 队列 COUNT/DELETE 的谓词是 LOT_KEY；不能擅自添加 dispatcher 限定条件。
- setLots 是有约束且有副作用的组批操作，不是普通属性赋值。
- FlowBatchSize 的计算规则必须带“setLots 内部”的上下文。
- FlowBatch—Lot、FlowBatch—Machine 关系为双向维护意图，事务和完整宏语义仍未知。

## 后续未完成项

FlowBatch 成批算法与外部请求入口、设备侧 addFlowBatch/removeFlowBatch 的容量和重复约束、操作计数配置来源、组批后拆解和目标工序开始标记的生命周期、关系表保存与事务协调。
