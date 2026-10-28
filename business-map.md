# MES 业务地图（现有源码范围）

目录分类根据 IDL Category 注释与同名 _i 实现出现位置关联，是候选归类；不等同于已解析接口绑定。类名通过限定名文本匹配，可能包含调用方使用的其他类。表访问来自 SQL 文本候选，不代表运行依赖、外键或完整数据血缘。

| 实现目录 | 文件 | SQL 操作候选 | 表名候选 | IDL 业务分类线索 |
|---|---:|---:|---:|---|
| iiop | 6 | 0 | 0 | 未自动匹配，需核实 |
| poscimfw/include | 239 | 0 | 0 | 未自动匹配，需核实 |
| poscimfw/pabcl | 40 | 123 | 18 | Poseidon Abstract Class Group / SiView Abstract Class Group |
| poscimfw/patmg | 2 | 0 | 0 | Poseidon Authentication Management Class Group |
| poscimfw/pcdmg | 47 | 260 | 46 | Poseidon Code Management Component / SiView Code Management Component |
| poscimfw/pcmpmg | 1 | 0 | 0 | SiView Component Management |
| poscimfw/pdcmg | 15 | 110 | 26 | SiView Data Collection Management Component |
| poscimfw/pdp | 66 | 186 | 42 | Poseidon Dispatching Management Component / SiView Dispatching Management Component |
| poscimfw/pdrmg | 42 | 483 | 60 | Poseidon Durable Management Component / SiView Durable Management Component |
| poscimfw/penmg | 8 | 120 | 25 | Entity Inhibition Management Component |
| poscimfw/pevmg | 342 | 2770 | 337 | Poseidon Event Management Component / SiView Event Management Component |
| poscimfw/pfa | 35 | 233 | 36 | Poseidon Abstract Class Group / Poseidon Factory Component / SiView Factory Component |
| poscimfw/pfwgls | 6 | 0 | 0 | 未自动匹配，需核实 |
| poscimfw/pmcmg | 73 | 625 | 81 | Poseidon Abstract Class Group / Poseidon Machine Management Component / SiView Machine Management Component |
| poscimfw/pmsds | 9 | 43 | 7 | Poseidon Message Distribution Class Group |
| poscimfw/ppcdf | 51 | 1412 | 132 | Poseidon Process Definition Management Component / SiView Process Definition Management Component |
| poscimfw/ppl | 18 | 103 | 12 | Poseidon Planning Component / SiView Planning Component |
| poscimfw/pprmg | 66 | 612 | 72 | Poseidon Abstract Class Group / Poseidon Product Management Component / SiView Product Management Component |
| poscimfw/pprsp | 60 | 346 | 41 | Poseidon Product Specification Management Component / SiView Product Specification Management Component |
| poscimfw/ppsmg | 24 | 200 | 31 | Poseidon Person Management Component / SiView Person Management Component |
| poscimfw/pptsmg | 8 | 34 | 4 | SiView Parts Management Component |
| poscimfw/prcmg | 15 | 192 | 24 | SiView Recipe Management Component |
| ras | 5 | 0 | 0 | 未自动匹配，需核实 |
| ras/tracelog | 9 | 0 | 0 | 未自动匹配，需核实 |
| ras/tracelog/logger | 16 | 0 | 0 | 未自动匹配，需核实 |
| smtchcmf/bllofmtr | 4 | 0 | 0 | 未自动匹配，需核实 |
| smtchcmf/drblmngm | 7 | 0 | 0 | 未自动匹配，需核实 |
| smtchcmf/dsptchng | 3 | 0 | 0 | 未自动匹配，需核实 |
| smtchcmf/dtcllctn | 4 | 0 | 0 | 未自动匹配，需核实 |
| smtchcmf/fctrycmp | 4 | 0 | 0 | 未自动匹配，需核实 |
| smtchcmf/frmwrkgl | 29 | 1 | 1 | 未自动匹配，需核实 |
| smtchcmf/mchnmngm | 9 | 0 | 0 | 未自动匹配，需核实 |
| smtchcmf/mtrlmngm | 2 | 0 | 0 | 未自动匹配，需核实 |
| smtchcmf/plnnngcm | 3 | 0 | 0 | 未自动匹配，需核实 |
| smtchcmf/prcssdfn | 7 | 0 | 0 | 未自动匹配，需核实 |
| smtchcmf/prdctmng | 8 | 0 | 0 | 未自动匹配，需核实 |
| smtchcmf/prdctspc | 3 | 0 | 0 | 未自动匹配，需核实 |
| smtchcmf/prsnmngm | 3 | 0 | 0 | 未自动匹配，需核实 |
| smtchcmf/rcpmngmn | 3 | 0 | 0 | 未自动匹配，需核实 |
| smtchcmf/rsrcclss | 4 | 0 | 0 | 未自动匹配，需核实 |
| smtchcmf/tmsrvcsc | 2 | 0 | 0 | 未自动匹配，需核实 |

## 接口与实现目录候选

- **SPAbstractClassObjectFactory** : CIMFWObjectFactory, MOFW_TransManagedObjectFactory — [poscimfw/include/abclsp.idl:32](../../fw_cpp_sqx/poscimfw/include/abclsp.idl#L32)；实现目录候选：poscimfw/pabcl
- **SPAuthenticationManagementObjectFactory** : CIMFWObjectFactory, MOFW_TransManagedObjectFactory — [poscimfw/include/athmnsp.idl:22](../../fw_cpp_sqx/poscimfw/include/athmnsp.idl#L22)；实现目录候选：poscimfw/patmg
- **SPCodeManagementObjectFactory** : CIMFWObjectFactory, MOFW_TransManagedObjectFactory — [poscimfw/include/codemnsp.idl:32](../../fw_cpp_sqx/poscimfw/include/codemnsp.idl#L32)；实现目录候选：poscimfw/pcdmg
- **SPDurableManagementObjectFactory** : CIMFWDurableManagementObjectFactory, MOFW_TransManagedObjectFactory — [poscimfw/include/drblmnsp.idl:34](../../fw_cpp_sqx/poscimfw/include/drblmnsp.idl#L34)；实现目录候选：poscimfw/pdrmg
- **SPDispatchingManagementObjectFactory** : CIMFWDispatchingManagementObjectFactory, MOFW_TransManagedObjectFactory — [poscimfw/include/dsptchsp.idl:23](../../fw_cpp_sqx/poscimfw/include/dsptchsp.idl#L23)；实现目录候选：poscimfw/pdp
- **SPDataCollectionManagementObjectFactory** : CIMFWDataCollectionManagementObjectFactory, MOFW_TransManagedObjectFactory — [poscimfw/include/dtcllcsp.idl:21](../../fw_cpp_sqx/poscimfw/include/dtcllcsp.idl#L21)；实现目录候选：poscimfw/pdcmg
- **SPEntityInhibitManagementObjectFactory** : CIMFWObjectFactory, MOFW_TransManagedObjectFactory — [poscimfw/include/entinsp.idl:25](../../fw_cpp_sqx/poscimfw/include/entinsp.idl#L25)；实现目录候选：poscimfw/penmg
- **SPEventManagementObjectFactory** : CIMFWObjectFactory, MOFW_TransManagedObjectFactory — [poscimfw/include/evmgsp.idl:145](../../fw_cpp_sqx/poscimfw/include/evmgsp.idl#L145)；实现目录候选：poscimfw/pevmg
- **SPFactoryManagementObjectFactory** : CIMFWFactoryManagementObjectFactory, MOFW_TransManagedObjectFactory — [poscimfw/include/fctrycsp.idl:26](../../fw_cpp_sqx/poscimfw/include/fctrycsp.idl#L26)；实现目录候选：poscimfw/pfa
- **SPMachineManagementObjectFactory** : CIMFWMachineManagementObjectFactory, MOFW_TransManagedObjectFactory — [poscimfw/include/mchnmnsp.idl:35](../../fw_cpp_sqx/poscimfw/include/mchnmnsp.idl#L35)；实现目录候选：poscimfw/pmcmg
- **SPMessageDistributionManagementObjectFactory** : CIMFWObjectFactory, MOFW_TransManagedObjectFactory — [poscimfw/include/msdsmnsp.idl:24](../../fw_cpp_sqx/poscimfw/include/msdsmnsp.idl#L24)；实现目录候选：poscimfw/pmsds
- **PosArea** : Area, MOFW_CachedManagedObject — [poscimfw/include/parea.idl:52](../../fw_cpp_sqx/poscimfw/include/parea.idl#L52)；实现目录候选：poscimfw/pfa
- **PosAreaGroup** : NamedEntity, MOFW_CachedManagedObject — [poscimfw/include/pareagr.idl:45](../../fw_cpp_sqx/poscimfw/include/pareagr.idl#L45)；实现目录候选：poscimfw/ppsmg
- **SPPartsManagementObjectFactory** : CIMFWObjectFactory, MOFW_TransManagedObjectFactory — [poscimfw/include/partssp.idl:25](../../fw_cpp_sqx/poscimfw/include/partssp.idl#L25)；实现目录候选：poscimfw/pptsmg
- **PosAuthenticationManager** : ComponentManager, MOFW_ManagedObject — [poscimfw/include/pathmgr.idl:45](../../fw_cpp_sqx/poscimfw/include/pathmgr.idl#L45)；实现目录候选：poscimfw/patmg
- **PosBank** : NamedEntity, MOFW_CachedManagedObject — [poscimfw/include/pbank.idl:52](../../fw_cpp_sqx/poscimfw/include/pbank.idl#L52)；实现目录候选：poscimfw/pfa
- **PosBinDefinition** : NamedEntity, MOFW_CachedManagedObject — [poscimfw/include/pbindf.idl:46](../../fw_cpp_sqx/poscimfw/include/pbindf.idl#L46)；实现目录候选：poscimfw/pprsp
- **PosBinSpecification** : NamedEntity, MOFW_CachedManagedObject — [poscimfw/include/pbinsp.idl:40](../../fw_cpp_sqx/poscimfw/include/pbinsp.idl#L40)；实现目录候选：poscimfw/pprsp
- **PosBOM** : NamedEntity, MOFW_CachedManagedObject — [poscimfw/include/pbom.idl:40](../../fw_cpp_sqx/poscimfw/include/pbom.idl#L40)；实现目录候选：poscimfw/pptsmg
- **PosBufferResource** : BufferResource, MOFW_CachedManagedObject — [poscimfw/include/pbufrs.idl:38](../../fw_cpp_sqx/poscimfw/include/pbufrs.idl#L38)；实现目录候选：poscimfw/pmcmg
- **PosCalendarDate** : CalendarDate, MOFW_CachedManagedObject — [poscimfw/include/pcaldat.idl:39](../../fw_cpp_sqx/poscimfw/include/pcaldat.idl#L39)；实现目录候选：poscimfw/pfa
- **PosCassette** : Cassette, MOFW_CachedManagedObject — [poscimfw/include/pcas.idl:55](../../fw_cpp_sqx/poscimfw/include/pcas.idl#L55)；实现目录候选：poscimfw/pdrmg
- **PosCategory** : NamedEntity, MOFW_CachedManagedObject — [poscimfw/include/pcatgry.idl:45](../../fw_cpp_sqx/poscimfw/include/pcatgry.idl#L45)；实现目录候选：poscimfw/pcdmg
- **PosCodeManager** : ComponentManager, MOFW_ManagedObject — [poscimfw/include/pcdmgr.idl:56](../../fw_cpp_sqx/poscimfw/include/pcdmgr.idl#L56)；实现目录候选：poscimfw/pcdmg
- **PosComponentManagerObjectFactory** : MOFW_TransManagedObjectFactory — [poscimfw/include/pcmpmgfc.idl:53](../../fw_cpp_sqx/poscimfw/include/pcmpmgfc.idl#L53)；实现目录候选：poscimfw/pcmpmg
- **PosCode** : NamedEntity, MOFW_CachedManagedObject — [poscimfw/include/pcode.idl:38](../../fw_cpp_sqx/poscimfw/include/pcode.idl#L38)；实现目录候选：poscimfw/pcdmg
- **PosMachineContainerPosition** : MOFW_CachedManagedObject, NamedEntity — [poscimfw/include/pctnpst.idl:42](../../fw_cpp_sqx/poscimfw/include/pctnpst.idl#L42)；实现目录候选：poscimfw/pmcmg
- **PosControlJob** : MOFW_CachedManagedObject, NamedEntity — [poscimfw/include/pctrlj.idl:41](../../fw_cpp_sqx/poscimfw/include/pctrlj.idl#L41)；实现目录候选：poscimfw/pprmg
- **PosCustomer** : NamedEntity, MOFW_CachedManagedObject — [poscimfw/include/pcustmr.idl:42](../../fw_cpp_sqx/poscimfw/include/pcustmr.idl#L42)；实现目录候选：poscimfw/pprsp
- **PosCustomerProduct** : NamedEntity, MOFW_CachedManagedObject — [poscimfw/include/pcustpr.idl:44](../../fw_cpp_sqx/poscimfw/include/pcustpr.idl#L44)；实现目录候选：poscimfw/pprsp
- **PosDataCollectionDefinition** : DataCollectionDefinition, MOFW_CachedManagedObject — [poscimfw/include/pdcdf.idl:42](../../fw_cpp_sqx/poscimfw/include/pdcdf.idl#L42)；实现目录候选：poscimfw/pdcmg
- **PosDurableControlJob** : MOFW_CachedManagedObject, NamedEntity — [poscimfw/include/pdcj.idl:37](../../fw_cpp_sqx/poscimfw/include/pdcj.idl#L37)；实现目录候选：poscimfw/pdrmg
- **PosDataCollectionSpecificationManager** : DataCollectionSpecificationManager, MOFW_ManagedObject — [poscimfw/include/pdcmgr.idl:34](../../fw_cpp_sqx/poscimfw/include/pdcmgr.idl#L34)；实现目录候选：poscimfw/pdcmg
- **PosDataCollectionSpecification** : DataCollectionSpecification, MOFW_CachedManagedObject — [poscimfw/include/pdcsp.idl:40](../../fw_cpp_sqx/poscimfw/include/pdcsp.idl#L40)；实现目录候选：poscimfw/pdcmg
- **PosDispatcher** : Dispatcher, MOFW_CachedManagedObject — [poscimfw/include/pdp.idl:49](../../fw_cpp_sqx/poscimfw/include/pdp.idl#L49)；实现目录候选：poscimfw/pdp
- **PosDurableProcessFlowContext** : PosProcessFlowContext — [poscimfw/include/pdpflwx.idl:33](../../fw_cpp_sqx/poscimfw/include/pdpflwx.idl#L33)；实现目录候选：poscimfw/ppcdf
- **PosDispatchingManager** : DispatchingManager — [poscimfw/include/pdpmg.idl:43](../../fw_cpp_sqx/poscimfw/include/pdpmg.idl#L43)；实现目录候选：poscimfw/pdp
- **PosDurableProcessOperation** : PosProcessOperation — [poscimfw/include/pdpope.idl:33](../../fw_cpp_sqx/poscimfw/include/pdpope.idl#L33)；实现目录候选：poscimfw/ppcdf
- **PosDurableManager** : DurableManager, MOFW_ManagedObject — [poscimfw/include/pdrmg.idl:42](../../fw_cpp_sqx/poscimfw/include/pdrmg.idl#L42)；实现目录候选：poscimfw/pdrmg
- **PosDurableSubState** : MOFW_CachedManagedObject, NamedEntity — [poscimfw/include/pdstat.idl:35](../../fw_cpp_sqx/poscimfw/include/pdstat.idl#L35)；实现目录候选：poscimfw/pdrmg
- **PosE10State** : NamedEntity, MOFW_CachedManagedObject — [poscimfw/include/pe10st.idl:42](../../fw_cpp_sqx/poscimfw/include/pe10st.idl#L42)；实现目录候选：poscimfw/pcdmg
- **PosEqpMonitor** : MOFW_CachedManagedObject, NamedEntity — [poscimfw/include/pemon.idl:40](../../fw_cpp_sqx/poscimfw/include/pemon.idl#L40)；实现目录候选：poscimfw/pmcmg
- **PosEqpMonitorJob** : MOFW_CachedManagedObject, NamedEntity — [poscimfw/include/pemonj.idl:40](../../fw_cpp_sqx/poscimfw/include/pemonj.idl#L40)；实现目录候选：poscimfw/pmcmg
- **PosEntityInhibit** : CIMFWBO, MOFW_CachedManagedObject — [poscimfw/include/penin.idl:42](../../fw_cpp_sqx/poscimfw/include/penin.idl#L42)；实现目录候选：poscimfw/penmg
- **PosEntityInhibitManager** : ComponentManager — [poscimfw/include/peninmg.idl:40](../../fw_cpp_sqx/poscimfw/include/peninmg.idl#L40)；实现目录候选：poscimfw/penmg
- **PosAutoDispatchControlEvent** : PosEventBase, MOFW_CachedManagedObject — [poscimfw/include/pevadc.idl:35](../../fw_cpp_sqx/poscimfw/include/pevadc.idl#L35)；实现目录候选：poscimfw/pevmg
- **PosEquipmentAlarmEvent** : PosEventBase, MOFW_CachedManagedObject — [poscimfw/include/pevalrm.idl:40](../../fw_cpp_sqx/poscimfw/include/pevalrm.idl#L40)；实现目录候选：poscimfw/pevmg
- **PosAPCInterfaceEvent** : PosEventBase, MOFW_CachedManagedObject — [poscimfw/include/pevapcif.idl:38](../../fw_cpp_sqx/poscimfw/include/pevapcif.idl#L38)；实现目录候选：poscimfw/pevmg
- **PosAPCProcessDispositionEvent** : MOFW_CachedManagedObject, PosEventBase — [poscimfw/include/pevapd.idl:38](../../fw_cpp_sqx/poscimfw/include/pevapd.idl#L38)；实现目录候选：poscimfw/pevmg
- **PosEventBase** : CIMFWBO — [poscimfw/include/pevbase.idl:39](../../fw_cpp_sqx/poscimfw/include/pevbase.idl#L39)；实现目录候选：poscimfw/pevmg
- **PosBondingGroupEvent** : PosEventBase, MOFW_CachedManagedObject — [poscimfw/include/pevbdgrp.idl:35](../../fw_cpp_sqx/poscimfw/include/pevbdgrp.idl#L35)；实现目录候选：poscimfw/pevmg
- **PosLotBankMoveEvent** : PosEventBase, MOFW_CachedManagedObject — [poscimfw/include/pevbkmv.idl:40](../../fw_cpp_sqx/poscimfw/include/pevbkmv.idl#L40)；实现目录候选：poscimfw/pevmg
- **PosBackupChannelEvent** : MOFW_CachedManagedObject, PosEventBase — [poscimfw/include/pevbucn.idl:38](../../fw_cpp_sqx/poscimfw/include/pevbucn.idl#L38)；实现目录候选：poscimfw/pevmg
- **PosBackupOperationEvent** : MOFW_CachedManagedObject, PosEventBase — [poscimfw/include/pevbuop.idl:38](../../fw_cpp_sqx/poscimfw/include/pevbuop.idl#L38)；实现目录候选：poscimfw/pevmg
- **PosCollectedDataChangeEvent** : MOFW_CachedManagedObject, PosEventBase — [poscimfw/include/pevcdc.idl:35](../../fw_cpp_sqx/poscimfw/include/pevcdc.idl#L35)；实现目录候选：poscimfw/pevmg
- **PosControlJobStatusChangeEvent** : MOFW_CachedManagedObject, PosEventBase — [poscimfw/include/pevcjsc.idl:38](../../fw_cpp_sqx/poscimfw/include/pevcjsc.idl#L38)；实现目录候选：poscimfw/pevmg
- **PosCollectedDataEvent** : PosEventBase, MOFW_CachedManagedObject — [poscimfw/include/pevclctd.idl:38](../../fw_cpp_sqx/poscimfw/include/pevclctd.idl#L38)；实现目录候选：poscimfw/pevmg
- **PosChamberStatusChangeEvent** : PosEventBase, MOFW_CachedManagedObject — [poscimfw/include/pevcmbs.idl:40](../../fw_cpp_sqx/poscimfw/include/pevcmbs.idl#L40)；实现目录候选：poscimfw/pevmg
- **PosDurableBankMoveEvent** : MOFW_CachedManagedObject, PosEventBase — [poscimfw/include/pevdbkm.idl:35](../../fw_cpp_sqx/poscimfw/include/pevdbkm.idl#L35)；实现目录候选：poscimfw/pevmg
- **PosDynamicBufferResourceChangeEvent** : PosEventBase, MOFW_CachedManagedObject — [poscimfw/include/pevdbrc.idl:35](../../fw_cpp_sqx/poscimfw/include/pevdbrc.idl#L35)；实现目录候选：poscimfw/pevmg
- **PosDurableControlJobStatusChangeEvent** : MOFW_CachedManagedObject, PosEventBase — [poscimfw/include/pevdcjs.idl:35](../../fw_cpp_sqx/poscimfw/include/pevdcjs.idl#L35)；实现目录候选：poscimfw/pevmg
- **PosDurableHoldEvent** : MOFW_CachedManagedObject, PosEventBase — [poscimfw/include/pevdhld.idl:35](../../fw_cpp_sqx/poscimfw/include/pevdhld.idl#L35)；实现目录候选：poscimfw/pevmg
- **PosDurableOperationCompleteEvent** : MOFW_CachedManagedObject, PosEventBase — [poscimfw/include/pevdopc.idl:35](../../fw_cpp_sqx/poscimfw/include/pevdopc.idl#L35)；实现目录候选：poscimfw/pevmg
- **PosDurableOperationMoveEvent** : MOFW_CachedManagedObject, PosEventBase — [poscimfw/include/pevdopm.idl:35](../../fw_cpp_sqx/poscimfw/include/pevdopm.idl#L35)；实现目录候选：poscimfw/pevmg
- **PosDurableOperationStartEvent** : MOFW_CachedManagedObject, PosEventBase — [poscimfw/include/pevdops.idl:35](../../fw_cpp_sqx/poscimfw/include/pevdops.idl#L35)；实现目录候选：poscimfw/pevmg
- **PosDurablePFXEvent** : MOFW_CachedManagedObject, PosEventBase — [poscimfw/include/pevdpfx.idl:35](../../fw_cpp_sqx/poscimfw/include/pevdpfx.idl#L35)；实现目录候选：poscimfw/pevmg
- **PosDurableEvent** : PosEventBase, MOFW_CachedManagedObject — [poscimfw/include/pevdrbl.idl:35](../../fw_cpp_sqx/poscimfw/include/pevdrbl.idl#L35)；实现目录候选：poscimfw/pevmg
- **PosDurableChangeEvent** : MOFW_CachedManagedObject, PosEventBase — [poscimfw/include/pevdrch.idl:35](../../fw_cpp_sqx/poscimfw/include/pevdrch.idl#L35)；实现目录候选：poscimfw/pevmg
- **PosDurableReworkEvent** : MOFW_CachedManagedObject, PosEventBase — [poscimfw/include/pevdrwk.idl:35](../../fw_cpp_sqx/poscimfw/include/pevdrwk.idl#L35)；实现目录候选：poscimfw/pevmg
- **PosDurableXferJobStatusChangeEvent** : MOFW_CachedManagedObject, PosEventBase — [poscimfw/include/pevdxsc.idl:35](../../fw_cpp_sqx/poscimfw/include/pevdxsc.idl#L35)；实现目录候选：poscimfw/pevmg
- **PosEqpMonitorEvent** : MOFW_CachedManagedObject, PosEventBase — [poscimfw/include/pevem.idl:35](../../fw_cpp_sqx/poscimfw/include/pevem.idl#L35)；实现目录候选：poscimfw/pevmg
- **PosEquipmentModeChangeEvent** : PosEventBase, MOFW_CachedManagedObject — [poscimfw/include/pevemcg.idl:38](../../fw_cpp_sqx/poscimfw/include/pevemcg.idl#L38)；实现目录候选：poscimfw/pevmg
- **PosEqpMonitorJobEvent** : MOFW_CachedManagedObject, PosEventBase — [poscimfw/include/pevemj.idl:35](../../fw_cpp_sqx/poscimfw/include/pevemj.idl#L35)；实现目录候选：poscimfw/pevmg
- **PosEqpMonitorCountEvent** : PosEventBase, MOFW_CachedManagedObject — [poscimfw/include/pevemt.idl:35](../../fw_cpp_sqx/poscimfw/include/pevemt.idl#L35)；实现目录候选：poscimfw/pevmg
- **PosEntityInhibitEvent** : MOFW_CachedManagedObject, PosEventBase — [poscimfw/include/pevenin.idl:41](../../fw_cpp_sqx/poscimfw/include/pevenin.idl#L41)；实现目录候选：poscimfw/pevmg
- **PosEqpPortStatusChangeEvent** : MOFW_CachedManagedObject, PosEventBase — [poscimfw/include/pevepsc.idl:35](../../fw_cpp_sqx/poscimfw/include/pevepsc.idl#L35)；实现目录候选：poscimfw/pevmg
- **PosEquipmentStatusChangeEvent** : PosEventBase, MOFW_CachedManagedObject — [poscimfw/include/peveqps.idl:40](../../fw_cpp_sqx/poscimfw/include/peveqps.idl#L40)；实现目录候选：poscimfw/pevmg
- **PosLotFlowBatchEvent** : PosEventBase, MOFW_CachedManagedObject — [poscimfw/include/pevfbch.idl:40](../../fw_cpp_sqx/poscimfw/include/pevfbch.idl#L40)；实现目录候选：poscimfw/pevmg
- **PosEquipmentFlowBatchMaxCountChangeEvent** : MOFW_CachedManagedObject, PosEventBase — [poscimfw/include/pevfbm.idl:35](../../fw_cpp_sqx/poscimfw/include/pevfbm.idl#L35)；实现目录候选：poscimfw/pevmg
- **PosLotFutureHoldEvent** : MOFW_CachedManagedObject, PosEventBase — [poscimfw/include/pevfhld.idl:35](../../fw_cpp_sqx/poscimfw/include/pevfhld.idl#L35)；实现目录候选：poscimfw/pevmg
- **PosFPCEvent** : MOFW_CachedManagedObject, PosEventBase — [poscimfw/include/pevfpc.idl:35](../../fw_cpp_sqx/poscimfw/include/pevfpc.idl#L35)；实现目录候选：poscimfw/pevmg
- **PosFutureReworkEvent** : MOFW_CachedManagedObject, PosEventBase — [poscimfw/include/pevfrwk.idl:38](../../fw_cpp_sqx/poscimfw/include/pevfrwk.idl#L38)；实现目录候选：poscimfw/pevmg
- **PosInterFabXferEvent** : MOFW_CachedManagedObject, PosEventBase — [poscimfw/include/pevifx.idl:35](../../fw_cpp_sqx/poscimfw/include/pevifx.idl#L35)；实现目录候选：poscimfw/pevmg
- **PosLotHoldEvent** : PosEventBase, MOFW_CachedManagedObject — [poscimfw/include/pevlhld.idl:40](../../fw_cpp_sqx/poscimfw/include/pevlhld.idl#L40)；实现目录候选：poscimfw/pevmg
- **PosLotReworkEvent** : PosEventBase, MOFW_CachedManagedObject — [poscimfw/include/pevlrwk.idl:40](../../fw_cpp_sqx/poscimfw/include/pevlrwk.idl#L40)；实现目录候选：poscimfw/pevmg
- **PosLotChangeEvent** : PosEventBase, MOFW_CachedManagedObject — [poscimfw/include/pevltch.idl:40](../../fw_cpp_sqx/poscimfw/include/pevltch.idl#L40)；实现目录候选：poscimfw/pevmg
- **PosEventManager** : ComponentManager, MOFW_ManagedObject — [poscimfw/include/pevmg.idl:57](../../fw_cpp_sqx/poscimfw/include/pevmg.idl#L57)；实现目录候选：poscimfw/pevmg
- **PosNoteChangeEvent** : MOFW_CachedManagedObject, PosEventBase — [poscimfw/include/pevnote.idl:35](../../fw_cpp_sqx/poscimfw/include/pevnote.idl#L35)；实现目录候选：poscimfw/pevmg
- **PosLotOperationCompleteEvent** : PosEventBase, MOFW_CachedManagedObject — [poscimfw/include/pevopcp.idl:40](../../fw_cpp_sqx/poscimfw/include/pevopcp.idl#L40)；实现目录候选：poscimfw/pevmg
- **PosLotOperationMoveEvent** : PosEventBase, MOFW_CachedManagedObject — [poscimfw/include/pevopmv.idl:38](../../fw_cpp_sqx/poscimfw/include/pevopmv.idl#L38)；实现目录候选：poscimfw/pevmg
- **PosLotOperationStartEvent** : PosEventBase, MOFW_CachedManagedObject — [poscimfw/include/pevopst.idl:40](../../fw_cpp_sqx/poscimfw/include/pevopst.idl#L40)；实现目录候选：poscimfw/pevmg
- **PosOwnerChangeEvent** : PosEventBase, MOFW_CachedManagedObject — [poscimfw/include/pevowch.idl:35](../../fw_cpp_sqx/poscimfw/include/pevowch.idl#L35)；实现目录候选：poscimfw/pevmg
- **PosProcessStatusEvent** : PosEventBase, MOFW_CachedManagedObject — [poscimfw/include/pevpcst.idl:40](../../fw_cpp_sqx/poscimfw/include/pevpcst.idl#L40)；实现目录候选：poscimfw/pevmg
- **PosProcessHoldEvent** : PosEventBase, MOFW_CachedManagedObject — [poscimfw/include/pevphld.idl:40](../../fw_cpp_sqx/poscimfw/include/pevphld.idl#L40)；实现目录候选：poscimfw/pevmg
- **PosProcessJobChangeEvent** : PosEventBase, MOFW_CachedManagedObject — [poscimfw/include/pevpjc.idl:35](../../fw_cpp_sqx/poscimfw/include/pevpjc.idl#L35)；实现目录候选：poscimfw/pevmg
- **PosPlannedSplitEvent** : MOFW_CachedManagedObject, PosEventBase — [poscimfw/include/pevplsp.idl:35](../../fw_cpp_sqx/poscimfw/include/pevplsp.idl#L35)；实现目录候选：poscimfw/pevmg
- **PosProductRequestEvent** : PosEventBase, MOFW_CachedManagedObject — [poscimfw/include/pevprrq.idl:40](../../fw_cpp_sqx/poscimfw/include/pevprrq.idl#L40)；实现目录候选：poscimfw/pevmg
- **PosPortStatusChangeEvent** : PosEventBase, MOFW_CachedManagedObject — [poscimfw/include/pevprts.idl:38](../../fw_cpp_sqx/poscimfw/include/pevprts.idl#L38)；实现目录候选：poscimfw/pevmg
- **PosQTimeEvent** : PosEventBase, MOFW_CachedManagedObject — [poscimfw/include/pevqtm.idl:39](../../fw_cpp_sqx/poscimfw/include/pevqtm.idl#L39)；实现目录候选：poscimfw/pevmg
- **PosRecipeBodyManageEvent** : PosEventBase, MOFW_CachedManagedObject — [poscimfw/include/pevrcbd.idl:40](../../fw_cpp_sqx/poscimfw/include/pevrcbd.idl#L40)；实现目录候选：poscimfw/pevmg
- **PosLotReticleSetChangeEvent** : MOFW_CachedManagedObject, PosEventBase — [poscimfw/include/pevrset.idl:38](../../fw_cpp_sqx/poscimfw/include/pevrset.idl#L38)；实现目录候选：poscimfw/pevmg
- **PosProcessResourceWaferPositionEvent** : MOFW_CachedManagedObject, PosEventBase — [poscimfw/include/pevrwp.idl:35](../../fw_cpp_sqx/poscimfw/include/pevrwp.idl#L35)；实现目录候选：poscimfw/pevmg
- **PosScriptParameterChangeEvent** : MOFW_CachedManagedObject, PosEventBase — [poscimfw/include/pevscprcg.idl:35](../../fw_cpp_sqx/poscimfw/include/pevscprcg.idl#L35)；实现目录候选：poscimfw/pevmg
- **PosSLMMaxReserveCountEvent** : MOFW_CachedManagedObject, PosEventBase — [poscimfw/include/pevsmr.idl:35](../../fw_cpp_sqx/poscimfw/include/pevsmr.idl#L35)；实现目录候选：poscimfw/pevmg
- **PosSLMSwitchEvent** : MOFW_CachedManagedObject, PosEventBase — [poscimfw/include/pevss.idl:35](../../fw_cpp_sqx/poscimfw/include/pevss.idl#L35)；实现目录候选：poscimfw/pevmg
- **PosSystemMessageEvent** : PosEventBase, MOFW_CachedManagedObject — [poscimfw/include/pevsysm.idl:40](../../fw_cpp_sqx/poscimfw/include/pevsysm.idl#L40)；实现目录候选：poscimfw/pevmg
- **PosUserDataChangeEvent** : PosEventBase, MOFW_CachedManagedObject — [poscimfw/include/pevudc.idl:35](../../fw_cpp_sqx/poscimfw/include/pevudc.idl#L35)；实现目录候选：poscimfw/pevmg
- **PosVendorLotEvent** : PosEventBase, MOFW_CachedManagedObject — [poscimfw/include/pevvend.idl:40](../../fw_cpp_sqx/poscimfw/include/pevvend.idl#L40)；实现目录候选：poscimfw/pevmg
- **PosWaferChamberProcessEvent** : MOFW_CachedManagedObject, PosEventBase — [poscimfw/include/pevwfcp.idl:38](../../fw_cpp_sqx/poscimfw/include/pevwfcp.idl#L38)；实现目录候选：poscimfw/pevmg
- **PosLotWaferMoveEvent** : PosEventBase, MOFW_CachedManagedObject — [poscimfw/include/pevwfmv.idl:39](../../fw_cpp_sqx/poscimfw/include/pevwfmv.idl#L39)；实现目录候选：poscimfw/pevmg
- **PosLotWaferStackEvent** : PosEventBase, MOFW_CachedManagedObject — [poscimfw/include/pevwfst.idl:35](../../fw_cpp_sqx/poscimfw/include/pevwfst.idl#L35)；实现目录候选：poscimfw/pevmg
- **PosLotWaferScrapEvent** : PosEventBase, MOFW_CachedManagedObject — [poscimfw/include/pevwscr.idl:40](../../fw_cpp_sqx/poscimfw/include/pevwscr.idl#L40)；实现目录候选：poscimfw/pevmg
- **PosWaferSortJobEvent** : MOFW_CachedManagedObject, PosEventBase — [poscimfw/include/pevwsj.idl:35](../../fw_cpp_sqx/poscimfw/include/pevwsj.idl#L35)；实现目录候选：poscimfw/pevmg
- **PosLotWaferSortEvent** : PosEventBase, MOFW_CachedManagedObject — [poscimfw/include/pevwsrt.idl:40](../../fw_cpp_sqx/poscimfw/include/pevwsrt.idl#L40)；实现目录候选：poscimfw/pevmg
- **PosMESFactory** : MESFactory, MOFW_ManagedObject — [poscimfw/include/pfactry.idl:53](../../fw_cpp_sqx/poscimfw/include/pfactry.idl#L53)；实现目录候选：poscimfw/pfa
- **PosFactoryNote** : PosNote, MOFW_CachedManagedObject — [poscimfw/include/pfctrnt.idl:36](../../fw_cpp_sqx/poscimfw/include/pfctrnt.idl#L36)；实现目录候选：poscimfw/pfa
- **PosFlowBatch** : NamedEntity, MOFW_CachedManagedObject — [poscimfw/include/pflwbch.idl:46](../../fw_cpp_sqx/poscimfw/include/pflwbch.idl#L46)；实现目录候选：poscimfw/pdp
- **PosFlowBatchDispatcher** : MOFW_CachedManagedObject, NamedEntity — [poscimfw/include/pflwdp.idl:40](../../fw_cpp_sqx/poscimfw/include/pflwdp.idl#L40)；实现目录候选：poscimfw/pdp
- **PosFutureReworkRequest** : MOFW_CachedManagedObject, NamedEntity — [poscimfw/include/pftrwk.idl:37](../../fw_cpp_sqx/poscimfw/include/pftrwk.idl#L37)；实现目录候选：poscimfw/pprmg
- **PosLogicalRecipe** : MOFW_CachedManagedObject, NamedEntity — [poscimfw/include/plcrc.idl:46](../../fw_cpp_sqx/poscimfw/include/plcrc.idl#L46)；实现目录候选：poscimfw/prcmg
- **SPPlanningObjectFactory** : CIMFWPlanManagementObjectFactory, MOFW_TransManagedObjectFactory — [poscimfw/include/plnngsp.idl:24](../../fw_cpp_sqx/poscimfw/include/plnngsp.idl#L24)；实现目录候选：poscimfw/ppl
- **PosLot** : Lot, MOFW_CachedManagedObject — [poscimfw/include/plot.idl:87](../../fw_cpp_sqx/poscimfw/include/plot.idl#L87)；实现目录候选：poscimfw/pprmg
- **PosLotFamily** : LotFamily, MOFW_CachedManagedObject — [poscimfw/include/plotfm.idl:38](../../fw_cpp_sqx/poscimfw/include/plotfm.idl#L38)；实现目录候选：poscimfw/pprmg
- **PosLotType** : NamedEntity, MOFW_CachedManagedObject — [poscimfw/include/plottype.idl:40](../../fw_cpp_sqx/poscimfw/include/plottype.idl#L40)；实现目录候选：poscimfw/pprmg
- **PosLotComment** : PosNote, MOFW_CachedManagedObject — [poscimfw/include/pltcmnt.idl:42](../../fw_cpp_sqx/poscimfw/include/pltcmnt.idl#L42)；实现目录候选：poscimfw/pprmg
- **PosLotNote** : PosNote, MOFW_CachedManagedObject — [poscimfw/include/pltnt.idl:41](../../fw_cpp_sqx/poscimfw/include/pltnt.idl#L41)；实现目录候选：poscimfw/pprmg
- **PosLotOperationNote** : PosNote, MOFW_CachedManagedObject — [poscimfw/include/pltopnt.idl:37](../../fw_cpp_sqx/poscimfw/include/pltopnt.idl#L37)；实现目录候选：poscimfw/pprmg
- **PosLotOperationSchedule** : MOFW_CachedManagedObject, NamedEntity — [poscimfw/include/pltopsch.idl:44](../../fw_cpp_sqx/poscimfw/include/pltopsch.idl#L44)；实现目录候选：poscimfw/ppl
- **PosLotSchedule** : MOFW_CachedManagedObject, NamedEntity — [poscimfw/include/pltsch.idl:45](../../fw_cpp_sqx/poscimfw/include/pltsch.idl#L45)；实现目录候选：poscimfw/ppl
- **PosMaterialLocation** : MaterialLocation, MOFW_CachedManagedObject — [poscimfw/include/pmaloc.idl:40](../../fw_cpp_sqx/poscimfw/include/pmaloc.idl#L40)；实现目录候选：poscimfw/pmcmg
- **PosMachine** : Machine, MOFW_CachedManagedObject — [poscimfw/include/pmc.idl:58](../../fw_cpp_sqx/poscimfw/include/pmc.idl#L58)；实现目录候选：poscimfw/pmcmg
- **PosMachineContainer** : NamedEntity, MOFW_CachedManagedObject — [poscimfw/include/pmcctn.idl:39](../../fw_cpp_sqx/poscimfw/include/pmcctn.idl#L39)；实现目录候选：poscimfw/pmcmg
- **PosMachineManager** : MachineManager, MOFW_ManagedObject — [poscimfw/include/pmcmg.idl:39](../../fw_cpp_sqx/poscimfw/include/pmcmg.idl#L39)；实现目录候选：poscimfw/pmcmg
- **PosMachineNote** : PosNote, MOFW_CachedManagedObject — [poscimfw/include/pmcnote.idl:35](../../fw_cpp_sqx/poscimfw/include/pmcnote.idl#L35)；实现目录候选：poscimfw/pmcmg
- **PosMachineOperationProcedure** : PosNote, MOFW_CachedManagedObject — [poscimfw/include/pmcoppr.idl:36](../../fw_cpp_sqx/poscimfw/include/pmcoppr.idl#L36)；实现目录候选：poscimfw/pmcmg
- **PosMachineRecipe** : MachineRecipe, MOFW_CachedManagedObject — [poscimfw/include/pmcrc.idl:42](../../fw_cpp_sqx/poscimfw/include/pmcrc.idl#L42)；实现目录候选：poscimfw/prcmg
- **PosMachineOperationMode** : MOFW_CachedManagedObject, NamedEntity — [poscimfw/include/pmom.idl:38](../../fw_cpp_sqx/poscimfw/include/pmom.idl#L38)；实现目录候选：poscimfw/pcdmg
- **PosMonitorGroup** : NamedEntity, MOFW_CachedManagedObject — [poscimfw/include/pmongrp.idl:38](../../fw_cpp_sqx/poscimfw/include/pmongrp.idl#L38)；实现目录候选：poscimfw/pprmg
- **PosMessageDistributionManager** : ComponentManager, MOFW_ManagedObject — [poscimfw/include/pmsdnmg.idl:47](../../fw_cpp_sqx/poscimfw/include/pmsdnmg.idl#L47)；实现目录候选：poscimfw/pmsds
- **PosMessageDefinition** : NamedEntity, MOFW_CachedManagedObject — [poscimfw/include/pmsgdfn.idl:43](../../fw_cpp_sqx/poscimfw/include/pmsgdfn.idl#L43)；实现目录候选：poscimfw/pmsds
- **PosMachineState** : NamedEntity, MOFW_CachedManagedObject — [poscimfw/include/pmstat.idl:80](../../fw_cpp_sqx/poscimfw/include/pmstat.idl#L80)；实现目录候选：poscimfw/pcdmg
- **PosNote** : NamedEntity — [poscimfw/include/pnote.idl:40](../../fw_cpp_sqx/poscimfw/include/pnote.idl#L40)；实现目录候选：poscimfw/pabcl, poscimfw/pfa, poscimfw/pmcmg, poscimfw/pprmg
- **PosProcessDefinition** : ProcessDefinition, MOFW_CachedManagedObject — [poscimfw/include/ppcdf.idl:53](../../fw_cpp_sqx/poscimfw/include/ppcdf.idl#L53)；实现目录候选：poscimfw/ppcdf
- **PosProcessDefinitionManager** : ProcessDefinitionManager, MOFW_ManagedObject — [poscimfw/include/ppcdfmg.idl:38](../../fw_cpp_sqx/poscimfw/include/ppcdfmg.idl#L38)；实现目录候选：poscimfw/ppcdf
- **PosProcessDurable** : ProcessDurable, MOFW_CachedManagedObject — [poscimfw/include/ppcdr.idl:63](../../fw_cpp_sqx/poscimfw/include/ppcdr.idl#L63)；实现目录候选：poscimfw/pdrmg
- **PosProcessDurableCapability** : NamedEntity, MOFW_CachedManagedObject — [poscimfw/include/ppcdrcp.idl:48](../../fw_cpp_sqx/poscimfw/include/ppcdrcp.idl#L48)；实现目录候选：poscimfw/pdrmg
- **PosProcessFlow** : ProcessFlow, MOFW_CachedManagedObject — [poscimfw/include/ppcflw.idl:40](../../fw_cpp_sqx/poscimfw/include/ppcflw.idl#L40)；实现目录候选：poscimfw/ppcdf
- **PosProcessFlowContext** : ProcessFlowContext, MOFW_CachedManagedObject — [poscimfw/include/ppcflwx.idl:43](../../fw_cpp_sqx/poscimfw/include/ppcflwx.idl#L43)；实现目录候选：poscimfw/ppcdf
- **PosProcessOperation** : ProcessOperation, MOFW_CachedManagedObject — [poscimfw/include/ppcope.idl:53](../../fw_cpp_sqx/poscimfw/include/ppcope.idl#L53)；实现目录候选：poscimfw/ppcdf
- **PosProcessOperationSpecification** : ProcessOperationSpecification, MOFW_CachedManagedObject — [poscimfw/include/ppcopsp.idl:46](../../fw_cpp_sqx/poscimfw/include/ppcopsp.idl#L46)；实现目录候选：poscimfw/ppcdf
- **PosProcessResource** : ProcessResource, MOFW_CachedManagedObject — [poscimfw/include/ppcrs.idl:43](../../fw_cpp_sqx/poscimfw/include/ppcrs.idl#L43)；实现目录候选：poscimfw/pmcmg
- **PosPerson** : Person, MOFW_CachedManagedObject — [poscimfw/include/pperson.idl:62](../../fw_cpp_sqx/poscimfw/include/pperson.idl#L62)；实现目录候选：poscimfw/ppsmg
- **PosPlanManager** : PlanManager, MOFW_ManagedObject — [poscimfw/include/pplmgr.idl:43](../../fw_cpp_sqx/poscimfw/include/pplmgr.idl#L43)；实现目录候选：poscimfw/ppl
- **PosPlannedSplitJob** : MOFW_CachedManagedObject, NamedEntity — [poscimfw/include/pplspj.idl:38](../../fw_cpp_sqx/poscimfw/include/pplspj.idl#L38)；实现目录候选：poscimfw/pprmg
- **PosPortResource** : PortResource, MOFW_CachedManagedObject — [poscimfw/include/pportrs.idl:45](../../fw_cpp_sqx/poscimfw/include/pportrs.idl#L45)；实现目录候选：poscimfw/pmcmg
- **PosPropertySet** : CIMFWBO, MOFW_CachedManagedObject — [poscimfw/include/ppptset.idl:53](../../fw_cpp_sqx/poscimfw/include/ppptset.idl#L53)；实现目录候选：poscimfw/pabcl
- **PosPrivilegeGroup** : MOFW_CachedManagedObject, NamedEntity — [poscimfw/include/pprivgr.idl:37](../../fw_cpp_sqx/poscimfw/include/pprivgr.idl#L37)；实现目录候选：poscimfw/ppsmg
- **PosProductManager** : ProductManager, MOFW_ManagedObject — [poscimfw/include/pprmgr.idl:100](../../fw_cpp_sqx/poscimfw/include/pprmgr.idl#L100)；实现目录候选：poscimfw/pprmg
- **PosProductRequest** : ProductRequest, MOFW_CachedManagedObject — [poscimfw/include/pprrq.idl:53](../../fw_cpp_sqx/poscimfw/include/pprrq.idl#L53)；实现目录候选：poscimfw/ppl
- **PosProductSpecification** : ProductSpecification, MOFW_CachedManagedObject — [poscimfw/include/pprsp.idl:50](../../fw_cpp_sqx/poscimfw/include/pprsp.idl#L50)；实现目录候选：poscimfw/pprsp
- **PosProductGroup** : NamedEntity, MOFW_CachedManagedObject — [poscimfw/include/pprspg.idl:44](../../fw_cpp_sqx/poscimfw/include/pprspg.idl#L44)；实现目录候选：poscimfw/pprsp
- **PosProductSpecificationManager** : ProductSpecificationManager, MOFW_ManagedObject — [poscimfw/include/pprspmg.idl:44](../../fw_cpp_sqx/poscimfw/include/pprspmg.idl#L44)；实现目录候选：poscimfw/pprsp
- **PosTechnology** : NamedEntity, MOFW_CachedManagedObject — [poscimfw/include/pprstch.idl:41](../../fw_cpp_sqx/poscimfw/include/pprstch.idl#L41)；实现目录候选：poscimfw/pprsp
- **PosProductCategory** : NamedEntity, MOFW_CachedManagedObject — [poscimfw/include/ppsctgy.idl:44](../../fw_cpp_sqx/poscimfw/include/ppsctgy.idl#L44)；实现目录候选：poscimfw/pprsp
- **PosPersonManager** : PersonManager, MOFW_ManagedObject — [poscimfw/include/ppsmgr.idl:38](../../fw_cpp_sqx/poscimfw/include/ppsmgr.idl#L38)；实现目录候选：poscimfw/ppsmg
- **PosPartsManager** : ComponentManager, MOFW_ManagedObject — [poscimfw/include/pptsmg.idl:41](../../fw_cpp_sqx/poscimfw/include/pptsmg.idl#L41)；实现目录候选：poscimfw/pptsmg
- **PosPropertyBase** : CIMFWBO — [poscimfw/include/pptybas.idl:39](../../fw_cpp_sqx/poscimfw/include/pptybas.idl#L39)；实现目录候选：poscimfw/pabcl
- **PosPropertyInteger** : PosPropertyBase, MOFW_CachedManagedObject — [poscimfw/include/pptyint.idl:38](../../fw_cpp_sqx/poscimfw/include/pptyint.idl#L38)；实现目录候选：poscimfw/pabcl
- **PosPropertyReal** : PosPropertyBase, MOFW_CachedManagedObject — [poscimfw/include/pptyrea.idl:38](../../fw_cpp_sqx/poscimfw/include/pptyrea.idl#L38)；实现目录候选：poscimfw/pabcl
- **PosPropertySetManager** : MOFW_ManagedObject, ComponentManager — [poscimfw/include/pptysetmg.idl:36](../../fw_cpp_sqx/poscimfw/include/pptysetmg.idl#L36)；实现目录候选：poscimfw/pabcl
- **PosPropertyString** : PosPropertyBase, MOFW_CachedManagedObject — [poscimfw/include/pptystr.idl:38](../../fw_cpp_sqx/poscimfw/include/pptystr.idl#L38)；实现目录候选：poscimfw/pabcl
- **PosPropertyTableSI** : PosPropertyBase, MOFW_CachedManagedObject — [poscimfw/include/pptytsi.idl:38](../../fw_cpp_sqx/poscimfw/include/pptytsi.idl#L38)；实现目录候选：poscimfw/pabcl
- **PosPropertyTableSR** : PosPropertyBase, MOFW_CachedManagedObject — [poscimfw/include/pptytsr.idl:38](../../fw_cpp_sqx/poscimfw/include/pptytsr.idl#L38)；实现目录候选：poscimfw/pabcl
- **PosPropertyTableSS** : PosPropertyBase, MOFW_CachedManagedObject — [poscimfw/include/pptytss.idl:38](../../fw_cpp_sqx/poscimfw/include/pptytss.idl#L38)；实现目录候选：poscimfw/pabcl
- **PosQTimeRestriction** : MOFW_CachedManagedObject, NamedEntity — [poscimfw/include/pqtime.idl:38](../../fw_cpp_sqx/poscimfw/include/pqtime.idl#L38)；实现目录候选：poscimfw/ppcdf
- **PosQTimeRestrictionManager** : ComponentManager, MOFW_ManagedObject — [poscimfw/include/pqtimmg.idl:38](../../fw_cpp_sqx/poscimfw/include/pqtimmg.idl#L38)；实现目录候选：poscimfw/ppcdf
- **PosRecipeManager** : RecipeManager, MOFW_ManagedObject — [poscimfw/include/prcmg.idl:39](../../fw_cpp_sqx/poscimfw/include/prcmg.idl#L39)；实现目录候选：poscimfw/prcmg
- **SPProcessDefinitionObjectFactory** : CIMFWProcessDefinitionObjectFactory, MOFW_TransManagedObjectFactory — [poscimfw/include/prcssdsp.idl:25](../../fw_cpp_sqx/poscimfw/include/prcssdsp.idl#L25)；实现目录候选：poscimfw/ppcdf
- **SPProductManagementObjectFactory** : CIMFWProductManagementObjectFactory, MOFW_TransManagedObjectFactory — [poscimfw/include/prdctmsp.idl:34](../../fw_cpp_sqx/poscimfw/include/prdctmsp.idl#L34)；实现目录候选：poscimfw/pprmg
- **SPProductSpecificationObjectFactory** : CIMFWProductSpecificationObjectFactory, MOFW_TransManagedObjectFactory — [poscimfw/include/prdctssp.idl:37](../../fw_cpp_sqx/poscimfw/include/prdctssp.idl#L37)；实现目录候选：poscimfw/pprsp
- **PosRawMachineStateSet** : MOFW_CachedManagedObject, NamedEntity — [poscimfw/include/prmsts.idl:57](../../fw_cpp_sqx/poscimfw/include/prmsts.idl#L57)；实现目录候选：poscimfw/pcdmg
- **PosReticlePodPortResource** : MOFW_CachedManagedObject, PortResource — [poscimfw/include/prpprt.idl:36](../../fw_cpp_sqx/poscimfw/include/prpprt.idl#L36)；实现目录候选：poscimfw/pmcmg
- **SPPersonManagementObjectFactory** : CIMFWPersonManagementObjectFactory, MOFW_TransManagedObjectFactory — [poscimfw/include/prsnmnsp.idl:33](../../fw_cpp_sqx/poscimfw/include/prsnmnsp.idl#L33)；实现目录候选：poscimfw/ppsmg
- **PosReticlePod** : MOFW_CachedManagedObject, PositionalContainer — [poscimfw/include/prtclp.idl:52](../../fw_cpp_sqx/poscimfw/include/prtclp.idl#L52)；实现目录候选：poscimfw/pdrmg
- **PosReticleSet** : NamedEntity, MOFW_CachedManagedObject — [poscimfw/include/prtcls.idl:38](../../fw_cpp_sqx/poscimfw/include/prtcls.idl#L38)；实现目录候选：poscimfw/pdrmg
- **PosScript** : NamedEntity, MOFW_CachedManagedObject — [poscimfw/include/pscript.idl:36](../../fw_cpp_sqx/poscimfw/include/pscript.idl#L36)；实现目录候选：poscimfw/pcdmg
- **PosSampleSpecification** : MOFW_CachedManagedObject, NamedEntity — [poscimfw/include/psmpls.idl:38](../../fw_cpp_sqx/poscimfw/include/psmpls.idl#L38)；实现目录候选：poscimfw/pprsp
- **PosStage** : NamedEntity, MOFW_CachedManagedObject — [poscimfw/include/pstage.idl:45](../../fw_cpp_sqx/poscimfw/include/pstage.idl#L45)；实现目录候选：poscimfw/pfa
- **PosStageGroup** : NamedEntity, MOFW_CachedManagedObject — [poscimfw/include/pstggrp.idl:42](../../fw_cpp_sqx/poscimfw/include/pstggrp.idl#L42)；实现目录候选：poscimfw/pfa
- **PosStorageMachine** : StorageMachine, MOFW_CachedManagedObject — [poscimfw/include/pstmc.idl:48](../../fw_cpp_sqx/poscimfw/include/pstmc.idl#L48)；实现目录候选：poscimfw/pmcmg
- **PosSystemMessageCode** : MOFW_CachedManagedObject, NamedEntity — [poscimfw/include/psysmsg.idl:40](../../fw_cpp_sqx/poscimfw/include/psysmsg.idl#L40)；实现目录候选：poscimfw/pcdmg
- **PosTestSpecification** : NamedEntity, MOFW_CachedManagedObject — [poscimfw/include/ptestsp.idl:47](../../fw_cpp_sqx/poscimfw/include/ptestsp.idl#L47)；实现目录候选：poscimfw/pprsp
- **PosTestType** : NamedEntity, MOFW_CachedManagedObject — [poscimfw/include/ptesttp.idl:41](../../fw_cpp_sqx/poscimfw/include/ptesttp.idl#L41)；实现目录候选：poscimfw/pprsp
- **PosUserGroup** : NamedEntity, MOFW_CachedManagedObject — [poscimfw/include/pusergr.idl:40](../../fw_cpp_sqx/poscimfw/include/pusergr.idl#L40)；实现目录候选：poscimfw/ppsmg
- **PosWafer** : MOFW_CachedManagedObject, Wafer — [poscimfw/include/pwafer.idl:48](../../fw_cpp_sqx/poscimfw/include/pwafer.idl#L48)；实现目录候选：poscimfw/pprmg
- **PosWhatNextLogicBase** — [poscimfw/include/pwtbase.idl:43](../../fw_cpp_sqx/poscimfw/include/pwtbase.idl#L43)；实现目录候选：poscimfw/pdp
- **PosWhatNextDurableESD** : PosWhatNextLogicBase — [poscimfw/include/pwtdesd.idl:43](../../fw_cpp_sqx/poscimfw/include/pwtdesd.idl#L43)；实现目录候选：poscimfw/pdp
- **PosWhatNextDurableFIFO** : PosWhatNextLogicBase — [poscimfw/include/pwtdfifo.idl:43](../../fw_cpp_sqx/poscimfw/include/pwtdfifo.idl#L43)；实现目录候选：poscimfw/pdp
- **PosWhatNextDurableLRT** : PosWhatNextLogicBase — [poscimfw/include/pwtdlrt.idl:43](../../fw_cpp_sqx/poscimfw/include/pwtdlrt.idl#L43)；实现目录候选：poscimfw/pdp
- **PosWhatNextDurableMaxQTimeFIFO** : PosWhatNextLogicBase — [poscimfw/include/pwtdmaxq.idl:43](../../fw_cpp_sqx/poscimfw/include/pwtdmaxq.idl#L43)；实现目录候选：poscimfw/pdp
- **PosWhatNextDurablePreCompTime** : PosWhatNextLogicBase — [poscimfw/include/pwtdpcmp.idl:43](../../fw_cpp_sqx/poscimfw/include/pwtdpcmp.idl#L43)；实现目录候选：poscimfw/pdp
- **PosWhatNextDurableSRT** : PosWhatNextLogicBase — [poscimfw/include/pwtdsrt.idl:43](../../fw_cpp_sqx/poscimfw/include/pwtdsrt.idl#L43)；实现目录候选：poscimfw/pdp
- **PosWhatNextEDD** : PosWhatNextLogicBase — [poscimfw/include/pwtedd.idl:46](../../fw_cpp_sqx/poscimfw/include/pwtedd.idl#L46)；实现目录候选：poscimfw/pdp
- **PosWhatNextEqpMonitor** : PosWhatNextLogicBase — [poscimfw/include/pwtemon.idl:43](../../fw_cpp_sqx/poscimfw/include/pwtemon.idl#L43)；实现目录候选：poscimfw/pdp
- **PosWhatNextESD** : PosWhatNextLogicBase — [poscimfw/include/pwtesd.idl:46](../../fw_cpp_sqx/poscimfw/include/pwtesd.idl#L46)；实现目录候选：poscimfw/pdp
- **PosWhatNextExternalPriority** : PosWhatNextLogicBase — [poscimfw/include/pwtextp.idl:46](../../fw_cpp_sqx/poscimfw/include/pwtextp.idl#L46)；实现目录候选：poscimfw/pdp
- **PosWhatNextFIFO** : PosWhatNextLogicBase — [poscimfw/include/pwtfifo.idl:44](../../fw_cpp_sqx/poscimfw/include/pwtfifo.idl#L44)；实现目录候选：poscimfw/pdp
- **PosWhatNextFlowBatch** : PosWhatNextLogicBase — [poscimfw/include/pwtflwb.idl:45](../../fw_cpp_sqx/poscimfw/include/pwtflwb.idl#L45)；实现目录候选：poscimfw/pdp
- **PosWhatNextInternalPriority** : PosWhatNextLogicBase — [poscimfw/include/pwtintp.idl:46](../../fw_cpp_sqx/poscimfw/include/pwtintp.idl#L46)；实现目录候选：poscimfw/pdp
- **PosWhatNextLRT** : PosWhatNextLogicBase — [poscimfw/include/pwtlrt.idl:46](../../fw_cpp_sqx/poscimfw/include/pwtlrt.idl#L46)；实现目录候选：poscimfw/pdp
- **PosWhatNextMaxQTimeFIFO** : PosWhatNextLogicBase — [poscimfw/include/pwtmaxq.idl:46](../../fw_cpp_sqx/poscimfw/include/pwtmaxq.idl#L46)；实现目录候选：poscimfw/pdp
- **PosWhatNextPriorityClass** : PosWhatNextLogicBase — [poscimfw/include/pwtpcls.idl:46](../../fw_cpp_sqx/poscimfw/include/pwtpcls.idl#L46)；实现目录候选：poscimfw/pdp
- **PosWhatNextPreCompTime** : PosWhatNextLogicBase — [poscimfw/include/pwtpcmp.idl:45](../../fw_cpp_sqx/poscimfw/include/pwtpcmp.idl#L45)；实现目录候选：poscimfw/pdp
- **PosWhatNextPlanEqp** : PosWhatNextLogicBase — [poscimfw/include/pwtpeqp.idl:46](../../fw_cpp_sqx/poscimfw/include/pwtpeqp.idl#L46)；实现目录候选：poscimfw/pdp
- **PosWhatNextPlanStart** : PosWhatNextLogicBase — [poscimfw/include/pwtplns.idl:46](../../fw_cpp_sqx/poscimfw/include/pwtplns.idl#L46)；实现目录候选：poscimfw/pdp
- **PosWhatNextQTimeTargetTime** : PosWhatNextLogicBase — [poscimfw/include/pwtqttt.idl:45](../../fw_cpp_sqx/poscimfw/include/pwtqttt.idl#L45)；实现目录候选：poscimfw/pdp
- **PosWhatNextSRT** : PosWhatNextLogicBase — [poscimfw/include/pwtsrt.idl:46](../../fw_cpp_sqx/poscimfw/include/pwtsrt.idl#L46)；实现目录候选：poscimfw/pdp
- **PosWhatNextSST** : PosWhatNextLogicBase — [poscimfw/include/pwtsst.idl:46](../../fw_cpp_sqx/poscimfw/include/pwtsst.idl#L46)；实现目录候选：poscimfw/pdp
- **PosWhatNextUTS** : PosWhatNextLogicBase — [poscimfw/include/pwtuts.idl:44](../../fw_cpp_sqx/poscimfw/include/pwtuts.idl#L44)；实现目录候选：poscimfw/pdp
- **SPRecipeManagementObjectFactory** : CIMFWRecipeManagementObjectFactory, MOFW_TransManagedObjectFactory — [poscimfw/include/rcpmngsp.idl:31](../../fw_cpp_sqx/poscimfw/include/rcpmngsp.idl#L31)；实现目录候选：poscimfw/prcmg

## 表访问较多的表名候选

| 表名 | SQL 出现次数 | 来源文件数 | 示例 |
|---|---:|---:|---|
| FRPF | 144 | 10 | [poscimfw/pcdmg/pscripdb.sqx:332](../../fw_cpp_sqx/poscimfw/pcdmg/pscripdb.sqx#L332) |
| FRLOT | 134 | 37 | [poscimfw/pcdmg/pcodedb.sqx:225](../../fw_cpp_sqx/poscimfw/pcdmg/pcodedb.sqx#L225) |
| FRPOS | 111 | 10 | [poscimfw/pcdmg/pscripdb.sqx:169](../../fw_cpp_sqx/poscimfw/pcdmg/pscripdb.sqx#L169) |
| FRDRBLPFX | 103 | 8 | [poscimfw/pcdmg/pscripdb.sqx:453](../../fw_cpp_sqx/poscimfw/pcdmg/pscripdb.sqx#L453) |
| FRCAST | 77 | 23 | [poscimfw/pcdmg/pscripdb.sqx:453](../../fw_cpp_sqx/poscimfw/pcdmg/pscripdb.sqx#L453) |
| FRDRBLPO | 74 | 11 | [poscimfw/pdp/pwtdlrtdb.sqx:101](../../fw_cpp_sqx/poscimfw/pdp/pwtdlrtdb.sqx#L101) |
| FRDRBL | 71 | 22 | [poscimfw/pcdmg/pscripdb.sqx:559](../../fw_cpp_sqx/poscimfw/pcdmg/pscripdb.sqx#L559) |
| FRRTCLPOD | 69 | 21 | [poscimfw/pcdmg/pscripdb.sqx:665](../../fw_cpp_sqx/poscimfw/pcdmg/pscripdb.sqx#L665) |
| FRPFX | 55 | 10 | [poscimfw/pcdmg/pscripdb.sqx:332](../../fw_cpp_sqx/poscimfw/pcdmg/pscripdb.sqx#L332) |
| FRPO | 54 | 20 | [poscimfw/pdcmg/pdcdfdb.sqx:224](../../fw_cpp_sqx/poscimfw/pdcmg/pdcdfdb.sqx#L224) |
| FRLOTPO | 47 | 9 | [poscimfw/pcdmg/pscripdb.sqx:169](../../fw_cpp_sqx/poscimfw/pcdmg/pscripdb.sqx#L169) |
| FRPF_PDLIST | 34 | 7 | [poscimfw/penmg/penindb.sqx:1656](../../fw_cpp_sqx/poscimfw/penmg/penindb.sqx#L1656) |
| FRDRBLPFX_DRBLPOLIST | 33 | 5 | [poscimfw/pdp/pwtdpcmpdb.sqx:128](../../fw_cpp_sqx/poscimfw/pdp/pwtdpcmpdb.sqx#L128) |
| FREQPCTNPST | 28 | 5 | [poscimfw/pmcmg/pmcctndb.sqx:74](../../fw_cpp_sqx/poscimfw/pmcmg/pmcctndb.sqx#L74) |
| FRDRBLPFX_RETNLIST | 28 | 3 | [poscimfw/ppcdf/ppcdfdb.sqx:4046](../../fw_cpp_sqx/poscimfw/ppcdf/ppcdfdb.sqx#L4046) |
| FRDRBLPFX_BACKPOLIST | 24 | 4 | [poscimfw/ppcdf/pdpflxdb.sqx:186](../../fw_cpp_sqx/poscimfw/ppcdf/pdpflxdb.sqx#L186) |
| FREQP | 23 | 8 | [poscimfw/pcdmg/pmstatdb.sqx:241](../../fw_cpp_sqx/poscimfw/pcdmg/pmstatdb.sqx#L241) |
| FRPFX_POLIST | 23 | 5 | [poscimfw/pdp/pwtpcmpdb.sqx:83](../../fw_cpp_sqx/poscimfw/pdp/pwtpcmpdb.sqx#L83) |
| FRENTINHBT | 22 | 3 | [poscimfw/penmg/penindb.sqx:196](../../fw_cpp_sqx/poscimfw/penmg/penindb.sqx#L196) |
| FRPD | 22 | 7 | [poscimfw/penmg/penindb.sqx:917](../../fw_cpp_sqx/poscimfw/penmg/penindb.sqx#L917) |
| FRSTK | 20 | 6 | [poscimfw/pcdmg/pmstatdb.sqx:321](../../fw_cpp_sqx/poscimfw/pcdmg/pmstatdb.sqx#L321) |
| FRPRODREQ | 20 | 7 | [poscimfw/ppcdf/ppcdfdb.sqx:2407](../../fw_cpp_sqx/poscimfw/ppcdf/ppcdfdb.sqx#L2407) |
| FRPOS_RWKPF | 19 | 4 | [poscimfw/ppcdf/ppcdfdb.sqx:2769](../../fw_cpp_sqx/poscimfw/ppcdf/ppcdfdb.sqx#L2769) |
| FRFTRWK | 18 | 5 | [poscimfw/pcdmg/pcodedb.sqx:524](../../fw_cpp_sqx/poscimfw/pcdmg/pcodedb.sqx#L524) |
| FREQPMON | 18 | 4 | [poscimfw/pmcmg/pemondb.sqx:159](../../fw_cpp_sqx/poscimfw/pmcmg/pemondb.sqx#L159) |
| FRPFX_BACKPOLIST | 18 | 4 | [poscimfw/ppcdf/ppcdfdb.sqx:1408](../../fw_cpp_sqx/poscimfw/ppcdf/ppcdfdb.sqx#L1408) |
| FRPLSPLIT | 18 | 4 | [poscimfw/ppcdf/ppcdfdb.sqx:3311](../../fw_cpp_sqx/poscimfw/ppcdf/ppcdfdb.sqx#L3311) |
| FRQTIME | 17 | 8 | [poscimfw/pcdmg/pcodedb.sqx:454](../../fw_cpp_sqx/poscimfw/pcdmg/pcodedb.sqx#L454) |
| FRENTINHBT_ENTTY | 17 | 3 | [poscimfw/penmg/penindb.sqx:343](../../fw_cpp_sqx/poscimfw/penmg/penindb.sqx#L343) |
| FRQTIME_ACTION | 16 | 5 | [poscimfw/pcdmg/pcodedb.sqx:442](../../fw_cpp_sqx/poscimfw/pcdmg/pcodedb.sqx#L442) |
