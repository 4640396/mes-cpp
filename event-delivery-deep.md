# 事件创建、待处理项和清理链

完整阅读了 createEvent / removeEvent、FIFO 集合方法、LotHold 事件数据方法和对应工厂样板。行号相对 fw_cpp_sqx。未找到这份目录内真正的 watchdog 消费循环，不能把保存待处理项说成已经发给外部系统。

## 创建并不总产生事件对象

poscimfw/pevmg/pevmg.sqx:463–1978 的 createEvent 分两次解析 Any 类型。第一次取得交易 ID、业务事件时间并写 eventCreationTimeStamp，无法识别则抛 InvalidEventRecordTypeSignal。随后按 TX_ID 查询 FRWATCHDOG（1175–1224）；没有任何 watchdog 时直接返回 nil（1230–1235），不会调用后面的具体事件工厂。创建时间赋值已经在这个早退之前发生。

有订阅者时，第二组分支按记录类型选择工厂及 eventName。例如 LotHold 对应 newPosLotHoldEvent（1283–1288）。具体对象非空才 setEventData，再为各 watchdog 添加 FIFO 项。这是事件类型分派和待处理项的建立，不证明网络发送、消息中间件或 exactly-once。

SPEventManagementObjectFactory_i::newPosLotHoldEvent（evmgsp.cpp:291–308）通过 CREATE_SPFWOBJECT_NORETURN 宏创建对象，配置用户数据集非空时附加该序列，随后返回。对象注册、持久化及异常恢复仍依赖宏和框架，不能从这个样板推定全部事件工厂完全相同。

## FIFO 分流改变待处理项名称

SP_HISTORY_EVENTFIFO_DISTRIBUTE 解析为1时，按 eventName/watchdogName 查询 FIEVENT（1814–1818）。找到且 MAX_COUNT>0 时从1到MAX_COUNT随机选索引，名称为 WDG_DISP_NAME 加至少两位数字；生成名称长度>16时抛异常。未找到或非正数量则保留原 watchdog 名称。其他 SQL 错误抛 FrameworkError。未开启分流时直接使用原名。

随机选择不是轮询，不证明每个分片均衡；每个 watchdog 项都重新查询配置。多个原订阅可能映射到相同最终名称，后续集合方法以最终名称防重复。这是代码可见的合并可能性，不推定部署中一定发生。

## 集合并不自行执行消息投递

PosEventBase_i::setEventData（pevbase.cpp:255–260）为空方法。addFIFOData（475–502）构造 watchdogName、eventTime、当前事件对象引用，标 dirty，仅在名称不存在时添加；同名已有项不覆盖时间或引用。removeFIFOData（532–557）标 dirty 并尝试移除，返回失败时空分支，不显式报找不到。allFIFOData（586–600）只返回集合序列，本体没有排序逻辑，因此“FIFO”这个名字不证明此处按时间消费。

PosLotHoldEvent_i::setEventData（pevlhld.cpp:247–277）才执行具体记录类型校验及复制，失败抛类型异常。getEventData（309–361）在 isNewlyCreated 为真时抛 INV_OBJREF，否则新建 Any 并装入记录。新建对象标志的何时清除依赖框架，不能擅自把它解释为“未提交”或“未发送”。

## 清理是逐 watchdog、最后删除事件

PosEventManager_i::removeEvent（pevmg.sqx:2014–2203）要求事件非空，先 removeFIFOData(watchDogName)，再 allFIFOData；只有剩余长度为0才调用工厂 deleteCIMFWObject。未知名称本身不会在上述集合方法抛找不到；若本来空列表，仍可能进入事件删除。

这可以用作调用方处理完成后的清理接口，但此方法没有接收网络确认、重试或幂等令牌，不能称为已经证实的可靠投递协议。异常传播不等于已有对象/集合变更已回滚。

registWatchDog（2608–2612）和 unregistWatchDog（2641–2645）在当前实现中方法体为空。IDL 声明存在不证明动态注册已实现；FRWATCHDOG 配置由何处维护仍需外部工具、交易或部署文件证据。

## LotHold FIFO 的持久化样板

生成文件 U_pevlhldo.sqx:1561–1635 的 CollectionHelper_FREVLHLD_FIFO::save 根据更新配置执行差异删除/写入或全删重插，再遍历 DO 集合保存。deleteAll（883–898）按事件 system key 删除；deleteFrom（900–917）附加 D_KEY；singleInsert（936–959）写 FREVLHLD_FIFO 的 system key、table marker、D_KEY、WATCHDOG_NAME、EVENT_TIME、EVENT_OBJ；update（1008–1028）按 key 更新三个业务值。

insertInto（919–934）依配置调用 singleInsert 或 burstInsert；burstInsert（961–1006）达到阈值宏后发出固定5组 VALUES，阈值的实际宏值未知，不能假定任意批量大小都安全。save 中依赖 sqlSeq 操作排序及外部 host variable 映射，不把它当作已经证实的完整 BO→DO 桥接。U 文件1335–1355 有 DO resync/dirty 到 helper 保存的片段证据，但未登记整个巨大保存方法为完整审阅。

早期 FREVENTS INSERT 位于已注释旧代码（pevmg.sqx:1897–1924）；不能因为宿主变量名仍存在，就认定当前 createEvent 仍直接写那个表。已读的 LotHold 样板实际写其专属 FIFO 表，不能据此自动推定其他事件类型表结构完全一致。

## 未完成链路

实际 watchdog 消费入口、拉取顺序、重试/死信、崩溃恢复、并发锁、事务、注册配置维护，以及各事件具体负载和保存器仍需扩展。本报告能证明“建立待处理项→按名称移除→无项时删除”的对象链，不能证明端到端投递成功。
