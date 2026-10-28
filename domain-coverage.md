# 业务领域覆盖与缺口

**目标仍在进行，目录覆盖不等于领域语义完成。** 此表根据审阅登记自动生成，帮助定位薄弱领域，不以方法比例宣称完成度。

当前 41 个源码目录中，29 个有完整方法/函数登记，12 个尚无；共 444 项登记，包含 14 项原索引外定义。

## 目录对照

| 目录 | 应用候选 | 生成候选 | 已完整阅读（索引内 / 外） | 仅片段 | 状态与报告 |
|---|---|---|---|---|---|
| iiop | 0 | 0 | 0 / 0 | 0 | 仅结构定位，未登记完整方法 |
| poscimfw/include | 0 | 0 | 0 / 0 | 0 | 仅结构定位，未登记完整方法 |
| poscimfw/pabcl | 122 | 356 | 5 / 0 | 0 | 部分方法及相关链已审阅，领域未完成；[persistence-delete-deep](persistence-delete-deep.md)、[persistence-collections-deep](persistence-collections-deep.md) |
| poscimfw/patmg | 16 | 0 | 1 / 0 | 0 | 部分方法及相关链已审阅，领域未完成；[auth-privileges-deep](auth-privileges-deep.md) |
| poscimfw/pcdmg | 206 | 600 | 24 / 0 | 0 | 部分方法及相关链已审阅，领域未完成；[machine-resource-deep](machine-resource-deep.md)、[persistence-delete-deep](persistence-delete-deep.md)、[persistence-collections-deep](persistence-collections-deep.md)、[persistence-planner-deep](persistence-planner-deep.md)、[machine-state-deep](machine-state-deep.md) |
| poscimfw/pcmpmg | 21 | 0 | 0 / 0 | 0 | 仅结构定位，未登记完整方法 |
| poscimfw/pdcmg | 86 | 205 | 23 / 0 | 0 | 部分方法及相关链已审阅，领域未完成；[data-collection-deep](data-collection-deep.md) |
| poscimfw/pdp | 201 | 352 | 31 / 1 | 2 | 部分方法及相关链已审阅，领域未完成；[dispatch-deep](dispatch-deep.md)、[queue-storage-deep](queue-storage-deep.md)、[dispatch-variants-deep](dispatch-variants-deep.md)、[flowbatch-deep](flowbatch-deep.md)、[planning-deep](planning-deep.md) |
| poscimfw/pdrmg | 811 | 1263 | 9 / 0 | 1 | 部分方法及相关链已审阅，领域未完成；[persistence-delete-deep](persistence-delete-deep.md)、[persistence-collections-deep](persistence-collections-deep.md)、[cassette-loading-deep](cassette-loading-deep.md) |
| poscimfw/penmg | 72 | 204 | 4 / 0 | 1 | 部分方法及相关链已审阅，领域未完成；[recipe-selection-deep](recipe-selection-deep.md)、[inhibit-query-deep](inhibit-query-deep.md) |
| poscimfw/pevmg | 634 | 7789 | 18 / 0 | 0 | 部分方法及相关链已审阅，领域未完成；[event-delivery-deep](event-delivery-deep.md) |
| poscimfw/pfa | 206 | 554 | 23 / 0 | 0 | 部分方法及相关链已审阅，领域未完成；[factory-location-deep](factory-location-deep.md) |
| poscimfw/pfwgls | 4 | 0 | 0 / 3 | 0 | 部分方法及相关链已审阅，领域未完成；[dispatch-deep](dispatch-deep.md)、[data-collection-deep](data-collection-deep.md)、[auth-privileges-deep](auth-privileges-deep.md) |
| poscimfw/pmcmg | 908 | 1610 | 23 / 0 | 1 | 部分方法及相关链已审阅，领域未完成；[machine-resource-deep](machine-resource-deep.md)、[persistence-delete-deep](persistence-delete-deep.md)、[factory-location-deep](factory-location-deep.md)、[machine-state-deep](machine-state-deep.md) |
| poscimfw/pmsds | 59 | 89 | 35 / 0 | 0 | 部分方法及相关链已审阅，领域未完成；[message-requests-deep](message-requests-deep.md) |
| poscimfw/ppcdf | 793 | 3228 | 35 / 0 | 9 | 部分方法及相关链已审阅，领域未完成；[data-collection-deep](data-collection-deep.md)、[dc-snapshot-deep](dc-snapshot-deep.md)、[lot-bank-deep](lot-bank-deep.md)、[route-next-deep](route-next-deep.md) |
| poscimfw/ppl | 110 | 261 | 21 / 0 | 0 | 部分方法及相关链已审阅，领域未完成；[planning-deep](planning-deep.md)、[product-request-deep](product-request-deep.md) |
| poscimfw/pprmg | 658 | 1527 | 50 / 3 | 10 | 部分方法及相关链已审阅，领域未完成；[queue-storage-deep](queue-storage-deep.md)、[flowbatch-deep](flowbatch-deep.md)、[dc-snapshot-deep](dc-snapshot-deep.md)、[lot-split-deep](lot-split-deep.md)、[lot-join-init-deep](lot-join-init-deep.md)、[planning-deep](planning-deep.md)、[lot-bank-deep](lot-bank-deep.md) |
| poscimfw/pprsp | 322 | 870 | 2 / 0 | 0 | 部分方法及相关链已审阅，领域未完成；[bom-deep](bom-deep.md) |
| poscimfw/ppsmg | 164 | 487 | 17 / 0 | 0 | 部分方法及相关链已审阅，领域未完成；[auth-privileges-deep](auth-privileges-deep.md) |
| poscimfw/pptsmg | 35 | 89 | 19 / 0 | 0 | 部分方法及相关链已审阅，领域未完成；[bom-deep](bom-deep.md) |
| poscimfw/prcmg | 161 | 423 | 13 / 0 | 1 | 部分方法及相关链已审阅，领域未完成；[recipe-selection-deep](recipe-selection-deep.md) |
| ras | 0 | 0 | 0 / 0 | 0 | 仅结构定位，未登记完整方法 |
| ras/tracelog | 43 | 0 | 0 / 0 | 0 | 仅结构定位，未登记完整方法 |
| ras/tracelog/logger | 169 | 0 | 0 / 0 | 0 | 仅结构定位，未登记完整方法 |
| smtchcmf/bllofmtr | 47 | 0 | 0 / 0 | 0 | 仅结构定位，未登记完整方法 |
| smtchcmf/drblmngm | 106 | 0 | 14 / 0 | 0 | 部分方法及相关链已审阅，领域未完成；[cassette-loading-deep](cassette-loading-deep.md) |
| smtchcmf/dsptchng | 28 | 0 | 0 / 0 | 0 | 仅结构定位，未登记完整方法 |
| smtchcmf/dtcllctn | 39 | 0 | 0 / 0 | 0 | 仅结构定位，未登记完整方法 |
| smtchcmf/fctrycmp | 74 | 0 | 4 / 0 | 0 | 部分方法及相关链已审阅，领域未完成；[factory-location-deep](factory-location-deep.md) |
| smtchcmf/frmwrkgl | 145 | 0 | 3 / 7 | 0 | 部分方法及相关链已审阅，领域未完成；[persistence-collections-deep](persistence-collections-deep.md)、[persistence-planner-deep](persistence-planner-deep.md)、[message-requests-deep](message-requests-deep.md) |
| smtchcmf/mchnmngm | 178 | 0 | 1 / 0 | 0 | 部分方法及相关链已审阅，领域未完成；[machine-resource-deep](machine-resource-deep.md) |
| smtchcmf/mtrlmngm | 36 | 0 | 8 / 0 | 0 | 部分方法及相关链已审阅，领域未完成；[cassette-loading-deep](cassette-loading-deep.md)、[lot-split-deep](lot-split-deep.md)、[lot-join-init-deep](lot-join-init-deep.md) |
| smtchcmf/plnnngcm | 48 | 0 | 20 / 0 | 0 | 部分方法及相关链已审阅，领域未完成；[product-request-deep](product-request-deep.md) |
| smtchcmf/prcssdfn | 76 | 0 | 2 / 0 | 0 | 部分方法及相关链已审阅，领域未完成；[route-next-deep](route-next-deep.md) |
| smtchcmf/prdctmng | 159 | 0 | 20 / 0 | 1 | 部分方法及相关链已审阅，领域未完成；[cassette-loading-deep](cassette-loading-deep.md)、[lot-split-deep](lot-split-deep.md)、[lot-join-init-deep](lot-join-init-deep.md)、[product-request-deep](product-request-deep.md) |
| smtchcmf/prdctspc | 28 | 0 | 0 / 0 | 0 | 仅结构定位，未登记完整方法 |
| smtchcmf/prsnmngm | 34 | 0 | 0 / 0 | 0 | 仅结构定位，未登记完整方法 |
| smtchcmf/rcpmngmn | 31 | 0 | 0 / 0 | 0 | 仅结构定位，未登记完整方法 |
| smtchcmf/rsrcclss | 43 | 0 | 1 / 0 | 0 | 部分方法及相关链已审阅，领域未完成；[message-requests-deep](message-requests-deep.md) |
| smtchcmf/tmsrvcsc | 52 | 0 | 4 / 0 | 0 | 部分方法及相关链已审阅，领域未完成；[auth-privileges-deep](auth-privileges-deep.md) |

## 未完成工作的判断

- 主业务链继续补工序执行、设备预约/加工、采集结果保存、事件消费及上层交易守卫，现有报告中的具体未知项不因索引或检查通过消失。
- 工厂位置、消息分发及部分基础/框架目录尚无完整方法登记，接下来按实际方法补证；IDL/自由函数目录的0个方法候选可能是提取范围问题，不等于目录无逻辑。
- 生成持久化已分族，但未审阅成员不会因同形自动标完成；参见 persistence-families.md。
- 缺少交易、宏、DDL和运行环境造成的未知需保留；仍有可读源码时继续分析，不将局部外部依赖当全项目阻塞。
- 原目标的主要模块说明、关键链证据、本体事实、数据库关系及统一入口仍需持续审计。此表只提供现状，不改变完成标准。
