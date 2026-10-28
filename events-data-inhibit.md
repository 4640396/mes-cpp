# 事件、数据采集与实体限制

## 事件创建是按记录类型分派

`poscimfw/pevmg/pevmg.sqx:463–1978` 的 PosEventManager_i::createEvent 接收 CORBA::Any，按具体记录类型读取 transactionID、eventTimeStamp 并设置 eventCreationTimeStamp；批次暂停和返工记录分支见 618–632。后续按具体事件类型调用相应工厂创建对象，无法识别的记录类型在 1756–1759 抛 InvalidEventRecordTypeSignal。

事件对象非空时调用 setEventData(eventRecord)（1762–1767），并按 watchdog 分发配置维护 FIFO 数据（1774 起；1882、1889 为 addFIFOData 调用）。不能把出现 watchdog 或 FIFO 就认定这里使用外部消息中间件、保证 exactly-once 或证明事务已经提交。

重要边界：`pevmg/pevbase.cpp:255–260` 的基础 PosEventBase_i::setEventData 只有跟踪代码；实际数据处理必须核对具体事件实现。不能以基础方法名声称已序列化事件负载。

后续完整方法体审阅见 [事件待处理链](event-delivery-deep.md)：createEvent 在无 watchdog 订阅时返回 nil；实际 LotHold setter 才复制负载；FIFO 项按最终 watchdog 名防重复，最后一项移除后删除事件。注册和注销 watchdog 方法为空，真正消费者及可靠投递链尚未核实。

## 数据采集：旧接口已禁用

`poscimfw/pdcmg/pdcdf.cpp:690–786` 的 setDCDefinitionInfo 在 700–707 构造 FrameworkErrorSignal，错误信息说明该方法在此 MMS 版本无效，然后抛出；后续旧写入逻辑已被注释。

后续完整阅读确认 setDCDefinitionInfo__170（5056–5075）实际调用 __XXX（4955–5028）。规格对象也有 __101→__XXX 的配置链。旧入口仍禁用，不能将这些配置入口和上层交易路由混同。详见 [数据采集深入追踪](data-collection-deep.md)。

定义与规格是不同对象（PosDataCollectionDefinition、PosDataCollectionSpecification），FRDCDEF/FRDCSPEC 及子表为存储候选。已进一步核实输入处理、统计、Delta 和结果汇总；有效 doSpecCheck 位于 PosProcessOperation，读取工序已分配的规格快照。完整交易顺序、动作执行、保存和 SPC 仍未证实。

## 实体限制记录创建有数据校验

`poscimfw/penmg/peninmg.cpp:399–988` 的 createEntityInhibit 中，已核实 803–855：实体列表为空时异常；实体重复组合和重复 sublot type 有校验；调用 hasInhibitRecordFor(entityInhibitRecord) 检查相同限制记录，已存在则抛框架错误。随后不同 ID 生成模式调用对象工厂，设置记录与对象管理器（933–973）。

该段说明限制记录创建和去重，不代表已经核实设备/批次交易每次都执行限制检查。限制模型与暂停模型也不能合并为同一关系。后续已深入带 Lot 配方入口、例外与多实体筛选，见 [配方选择](recipe-selection-deep.md) 和 [限制数据库查询](inhibit-query-deep.md)；阈值两路径并不直接等价，数据库和交易验证仍未知。
