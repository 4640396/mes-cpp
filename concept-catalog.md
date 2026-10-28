# 业务概念与证据对照

这是当前本体的业务概念清单。接口证据只证明源码中存在相应契约；完整方法数量按同名实现类登记统计，不含继承或其他类协作。零项不等于没有代码，非零也不等于业务分析完成。

[阅读指南](START-HERE.md) · [本体模型说明](ontology.md) · [领域覆盖与缺口](domain-coverage.md)

| 概念 | 源码接口 | 接口证据 | 同名实现完整审阅 | 关联报告 |
|---|---|---|---|---|
| 批次 | PosLot | poscimfw/include/plot.idl:87 | 30 | [queue-storage-deep](queue-storage-deep.md)、[flowbatch-deep](flowbatch-deep.md)、[lot-split-deep](lot-split-deep.md)、[lot-join-init-deep](lot-join-init-deep.md)、[planning-deep](planning-deep.md)、[lot-bank-deep](lot-bank-deep.md) |
| 晶圆 | PosWafer | poscimfw/include/pwafer.idl:48 | 0 | 尚无同名实现审阅报告 |
| 工序实例 | PosProcessOperation | poscimfw/include/ppcope.idl:53 | 11 | [data-collection-deep](data-collection-deep.md)、[dc-snapshot-deep](dc-snapshot-deep.md) |
| 流程上下文 | PosProcessFlowContext | poscimfw/include/ppcflwx.idl:43 | 16 | [lot-bank-deep](lot-bank-deep.md)、[route-next-deep](route-next-deep.md) |
| 工艺流程 | PosProcessFlow | poscimfw/include/ppcflw.idl:40 | 8 | [route-next-deep](route-next-deep.md) |
| 工艺定义 | PosProcessDefinition | poscimfw/include/ppcdf.idl:53 | 0 | 尚无同名实现审阅报告 |
| 工序规格 | PosProcessOperationSpecification | poscimfw/include/ppcopsp.idl:46 | 0 | 尚无同名实现审阅报告 |
| 设备 | PosMachine | poscimfw/include/pmc.idl:58 | 19 | [machine-resource-deep](machine-resource-deep.md)、[factory-location-deep](factory-location-deep.md)、[machine-state-deep](machine-state-deep.md) |
| 设备状态 | PosMachineState | poscimfw/include/pmstat.idl:80 | 16 | [machine-resource-deep](machine-resource-deep.md)、[machine-state-deep](machine-state-deep.md) |
| 逻辑配方 | PosLogicalRecipe | poscimfw/include/plcrc.idl:46 | 13 | [recipe-selection-deep](recipe-selection-deep.md) |
| 设备配方 | PosMachineRecipe | poscimfw/include/pmcrc.idl:42 | 0 | 尚无同名实现审阅报告 |
| 载具 | PosCassette | poscimfw/include/pcas.idl:55 | 4 | [cassette-loading-deep](cassette-loading-deep.md) |
| 派工管理 | PosDispatchingManager | poscimfw/include/pdpmg.idl:43 | 8 | [dispatch-deep](dispatch-deep.md)、[queue-storage-deep](queue-storage-deep.md)、[flowbatch-deep](flowbatch-deep.md) |
| 事件管理 | PosEventManager | poscimfw/include/pevmg.idl:57 | 4 | [event-delivery-deep](event-delivery-deep.md) |
| 数据采集定义 | PosDataCollectionDefinition | poscimfw/include/pdcdf.idl:42 | 16 | [data-collection-deep](data-collection-deep.md) |
| 数据采集规格 | PosDataCollectionSpecification | poscimfw/include/pdcsp.idl:40 | 7 | [data-collection-deep](data-collection-deep.md) |
| 实体限制 | PosEntityInhibit | poscimfw/include/penin.idl:42 | 1 | [recipe-selection-deep](recipe-selection-deep.md) |
| 产品规格 | PosProductSpecification | poscimfw/include/pprsp.idl:50 | 2 | [bom-deep](bom-deep.md) |
| 批次计划 | PosLotSchedule | poscimfw/include/pltsch.idl:45 | 5 | [planning-deep](planning-deep.md) |
| 人员 | PosPerson | poscimfw/include/pperson.idl:62 | 10 | [auth-privileges-deep](auth-privileges-deep.md) |
| 权限组 | PosPrivilegeGroup | poscimfw/include/pprivgr.idl:37 | 7 | [auth-privileges-deep](auth-privileges-deep.md) |
| 物料清单 | PosBOM | poscimfw/include/pbom.idl:40 | 7 | [bom-deep](bom-deep.md) |
| 流程批 | PosFlowBatch | poscimfw/include/pflwbch.idl:46 | 5 | [flowbatch-deep](flowbatch-deep.md) |
| 流程批分发器 | PosFlowBatchDispatcher | poscimfw/include/pflwdp.idl:40 | 5 | [flowbatch-deep](flowbatch-deep.md) |
| 生产请求 | PosProductRequest | poscimfw/include/pprrq.idl:53 | 5 | [product-request-deep](product-request-deep.md) |
| 库区 | PosBank | poscimfw/include/pbank.idl:52 | 10 | [factory-location-deep](factory-location-deep.md) |
| 区域（Location/WorkArea类别） | PosArea | poscimfw/include/parea.idl:52 | 13 | [factory-location-deep](factory-location-deep.md) |
| 存储设备 | PosStorageMachine | poscimfw/include/pstmc.idl:48 | 2 | [factory-location-deep](factory-location-deep.md) |
| 消息分发管理 | PosMessageDistributionManager | poscimfw/include/pmsdnmg.idl:47 | 12 | [message-requests-deep](message-requests-deep.md) |
| 消息定义 | PosMessageDefinition | poscimfw/include/pmsgdfn.idl:43 | 21 | [message-requests-deep](message-requests-deep.md) |

## 使用边界

概念之间的全部业务关系仍在补齐。当前事实图包含方法调用、状态、集合和SQL证据，尚未把每条业务规则都连接到所属概念；因此不能用概念节点的直接关系数量判断业务完整度。Location与WorkArea是Area设置的类别，当前不凭名称额外制造独立实体类。

当前采用JSON模型和约束校验，没有部署OWL/RDF推理服务。
