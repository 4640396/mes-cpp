# 全项目领域与源码覆盖目录

每个有文件的目录均有定位条目。业务分类来自 IDL 注释、接口名称和已核实方法；目录定位完成不代表所有函数语义均已解释。EXTRACTED_TEXT 是词法提取，NAME_MATCH 是候选匹配。

## iiop — CORBA/IIOP 辅助

支撑代码/契约目录，运行部署与完整宏定义未知。

文件 6；方法定义候选 0；SQL 操作候选 0；表名/预编译符号候选 0。

实现定位样例：

- iiop/genIOR.cpp
- iiop/IIOPHelper.cpp
- iiop/IIOPHelper.hpp

## poscimfw/include — IDL 契约

支撑代码/契约目录，运行部署与完整宏定义未知。

文件 239；方法定义候选 0；SQL 操作候选 0；表名/预编译符号候选 0。

实现定位样例：

- poscimfw/include/abclsp.idl
- poscimfw/include/athmnsp.idl
- poscimfw/include/codemnsp.idl

## poscimfw/pabcl — 公共抽象对象与属性

属性、属性表和公共工厂；宏生成实现的完整语义未知

文件 40；方法定义候选 478；SQL 操作候选 123；表名/预编译符号候选 18。

IDL 契约证据：

- SPAbstractClassObjectFactory：poscimfw/include/abclsp.idl:32
- PosNote：poscimfw/include/pnote.idl:40
- PosPropertySet：poscimfw/include/ppptset.idl:53
- PosPropertyBase：poscimfw/include/pptybas.idl:39
- PosPropertyInteger：poscimfw/include/pptyint.idl:38

实现定位样例：

- SPAbstractClassObjectFactory_i::SPAbstractClassObjectFactory_i：poscimfw/pabcl/abclsp.cpp:38–40
- SPAbstractClassObjectFactory_i::newPosPropertySet：poscimfw/pabcl/abclsp.cpp:55–62
- SPAbstractClassObjectFactory_i::newPosPropertyString：poscimfw/pabcl/abclsp.cpp:73–79
- SPAbstractClassObjectFactory_i::newPosPropertyInteger：poscimfw/pabcl/abclsp.cpp:82–88

SQL 表名样例：#PTYINT、#PTYREAL、#PTYSTRING、#PTYTABLESI、#PTYTABLESR、#PTYTABLESS、#RPPPTSET、FRPPPTSET、FRPPPTSET_BASE、PPTYINT。带 # 的名称为预编译符号候选，不能直接认定为物理表。

## poscimfw/patmg — 身份认证

已核实本地认证模式、密码校验和到期判断；外部认证服务未知

文件 2；方法定义候选 16；SQL 操作候选 0；表名/预编译符号候选 0。

IDL 契约证据：

- SPAuthenticationManagementObjectFactory：poscimfw/include/athmnsp.idl:22
- PosAuthenticationManager：poscimfw/include/pathmgr.idl:45

实现定位样例：

- SPAuthenticationManagementObjectFactory_i::SPAuthenticationManagementObjectFactory_i：poscimfw/patmg/athmnsp.cpp:30–34
- SPAuthenticationManagementObjectFactory_i::newPosAuthenticationManager：poscimfw/patmg/athmnsp.cpp:43–49
- SPAuthenticationManagementObjectFactory_i::deleteCIMFWObject：poscimfw/patmg/athmnsp.cpp:55–111
- SPAuthenticationManagementObjectFactory_i::deleteCIMFWObject：poscimfw/patmg/athmnsp.cpp:116–128

## poscimfw/pcdmg — 代码与状态主数据

类别、代码、设备状态与相关配置；不代表实际设备状态切换交易

文件 47；方法定义候选 806；SQL 操作候选 260；表名/预编译符号候选 46。

IDL 契约证据：

- SPCodeManagementObjectFactory：poscimfw/include/codemnsp.idl:32
- PosCategory：poscimfw/include/pcatgry.idl:45
- PosCodeManager：poscimfw/include/pcdmgr.idl:56
- PosCode：poscimfw/include/pcode.idl:38
- PosE10State：poscimfw/include/pe10st.idl:42

实现定位样例：

- SPCodeManagementObjectFactory_i::SPCodeManagementObjectFactory_i：poscimfw/pcdmg/codemnsp.cpp:68–88
- SPCodeManagementObjectFactory_i::newPosCategory：poscimfw/pcdmg/codemnsp.cpp:97–104
- SPCodeManagementObjectFactory_i::newPosCodeManager：poscimfw/pcdmg/codemnsp.cpp:107–113
- SPCodeManagementObjectFactory_i::newPosCode：poscimfw/pcdmg/codemnsp.cpp:117–134

SQL 表名样例：#RCATEGORY、#RCODE、#RE10STATE、#REQPST、#ROPEMODE、#RRAWEQPST、#RSCRIPT、#RSYSMESSAGE、FRCAST、FRCATEGORY。带 # 的名称为预编译符号候选，不能直接认定为物理表。

## poscimfw/pcmpmg — 组件管理

组件对象组织；部署与注册服务细节未知

文件 1；方法定义候选 21；SQL 操作候选 0；表名/预编译符号候选 0。

IDL 契约证据：

- PosComponentManagerObjectFactory：poscimfw/include/pcmpmgfc.idl:53

实现定位样例：

- PosComponentManagerObjectFactory_i::PosComponentManagerObjectFactory_i：poscimfw/pcmpmg/pcmpmgfc.cpp:47–74
- PosComponentManagerObjectFactory_i::newMESFactory：poscimfw/pcmpmg/pcmpmgfc.cpp:114–119
- PosComponentManagerObjectFactory_i::newAuthenticationManager：poscimfw/pcmpmg/pcmpmgfc.cpp:122–127
- PosComponentManagerObjectFactory_i::newCodeManager：poscimfw/pcmpmg/pcmpmgfc.cpp:130–135

## poscimfw/pdcmg — 数据采集定义与规格

已发现旧定义更新入口直接抛禁用异常；版本方法调用方未知

文件 15；方法定义候选 291；SQL 操作候选 110；表名/预编译符号候选 26。

IDL 契约证据：

- SPDataCollectionManagementObjectFactory：poscimfw/include/dtcllcsp.idl:21
- PosDataCollectionDefinition：poscimfw/include/pdcdf.idl:42
- PosDataCollectionSpecificationManager：poscimfw/include/pdcmgr.idl:34
- PosDataCollectionSpecification：poscimfw/include/pdcsp.idl:40

实现定位样例：

- SPDataCollectionManagementObjectFactory_i::newDataCollectionDefinition：poscimfw/pdcmg/dtcllcsp.cpp:39–57
- SPDataCollectionManagementObjectFactory_i::newDataCollectionSpecification：poscimfw/pdcmg/dtcllcsp.cpp:61–78
- SPDataCollectionManagementObjectFactory_i::newDataCollectionSpecificationManager：poscimfw/pdcmg/dtcllcsp.cpp:81–87
- SPDataCollectionManagementObjectFactory_i::SPDataCollectionManagementObjectFactory_i：poscimfw/pdcmg/dtcllcsp.cpp:103–118

SQL 表名样例：#RDCDEF、#RDCSPEC、FRDCDEF、FRDCDEF_ITEM、FRDCDEF_UDATA、FRDCSPEC、FRDCSPEC_DCDEF、FRDCSPEC_ITEM、FRDCSPEC_UDATA、FRLOT。带 # 的名称为预编译符号候选，不能直接认定为物理表。

## poscimfw/pdp — 派工与流程批

已追普通 FIFO、耐用品 FIFO、批次多设备入队/出队；全部策略组合待核实

文件 66；方法定义候选 553；SQL 操作候选 186；表名/预编译符号候选 42。

IDL 契约证据：

- SPDispatchingManagementObjectFactory：poscimfw/include/dsptchsp.idl:23
- PosDispatcher：poscimfw/include/pdp.idl:49
- PosDispatchingManager：poscimfw/include/pdpmg.idl:43
- PosFlowBatch：poscimfw/include/pflwbch.idl:46
- PosFlowBatchDispatcher：poscimfw/include/pflwdp.idl:40

实现定位样例：

- SPDispatchingManagementObjectFactory_i::newDispatcher：poscimfw/pdp/dsptchsp.cpp:45–62
- SPDispatchingManagementObjectFactory_i::newPosFlowBatchDispatcher：poscimfw/pdp/dsptchsp.cpp:74–90
- SPDispatchingManagementObjectFactory_i::newPosFlowBatch：poscimfw/pdp/dsptchsp.cpp:95–111
- SPDispatchingManagementObjectFactory_i::SPDispatchingManagementObjectFactory_i：poscimfw/pdp/dsptchsp.cpp:113–129

SQL 表名样例：#RDISP、#RFLOWBATCH、#RFLWDP、FRCAST、FRCAST_EQP、FRCAST_HOLDEQP、FRDISP、FRDISP_EQP、FRDISP_LASTCTRLJOB、FRDISP_LASTDCTRLJOB。带 # 的名称为预编译符号候选，不能直接认定为物理表。

## poscimfw/pdrmg — 载具与耐用品

载具、光罩、光罩盒及状态/暂停记录；实际搬运交易未知

文件 42；方法定义候选 2074；SQL 操作候选 483；表名/预编译符号候选 60。

IDL 契约证据：

- SPDurableManagementObjectFactory：poscimfw/include/drblmnsp.idl:34
- PosCassette：poscimfw/include/pcas.idl:55
- PosDurableControlJob：poscimfw/include/pdcj.idl:37
- PosDurableManager：poscimfw/include/pdrmg.idl:42
- PosDurableSubState：poscimfw/include/pdstat.idl:35

实现定位样例：

- SPDurableManagementObjectFactory_i::newProcessDurable：poscimfw/pdrmg/drblmnsp.cpp:58–76
- SPDurableManagementObjectFactory_i::newDurableManager：poscimfw/pdrmg/drblmnsp.cpp:79–86
- SPDurableManagementObjectFactory_i::newCassette：poscimfw/pdrmg/drblmnsp.cpp:91–109
- SPDurableManagementObjectFactory_i::newPosProcessDurableCapability：poscimfw/pdrmg/drblmnsp.cpp:133–151

SQL 表名样例：#RCAST、#RDCTRLJOB、#RDRBL、#RDRBLGRP、#RDRBLSUBST、#RRTCLPOD、#RRTCLSET、FRCAST、FRCAST_EQP、FRCAST_HOLDEQP。带 # 的名称为预编译符号候选，不能直接认定为物理表。

## poscimfw/penmg — 实体限制

已核实限制创建的空列表、重复实体/子批次类型和重复记录校验

文件 8；方法定义候选 276；SQL 操作候选 120；表名/预编译符号候选 25。

IDL 契约证据：

- SPEntityInhibitManagementObjectFactory：poscimfw/include/entinsp.idl:25
- PosEntityInhibit：poscimfw/include/penin.idl:42
- PosEntityInhibitManager：poscimfw/include/peninmg.idl:40

实现定位样例：

- SPEntityInhibitManagementObjectFactory_i::SPEntityInhibitManagementObjectFactory_i：poscimfw/penmg/entinsp.cpp:34–37
- SPEntityInhibitManagementObjectFactory_i::newPosEntityInhibit：poscimfw/penmg/entinsp.cpp:45–50
- SPEntityInhibitManagementObjectFactory_i::deleteCIMFWObject：poscimfw/penmg/entinsp.cpp:62–84
- PosEntityInhibit_i::PosEntityInhibit_i：poscimfw/penmg/penin.cpp:94–107

SQL 表名样例：#RENTINHBT、FRCAST、FRDRBL、FRDRBLPO、FRENTINHBT、FRENTINHBT_ENTTY、FRENTINHBT_EXPLOT、FRENTINHBT_RSNINFO、FRENTINHBT_RSNINFO_SPC、FRENTINHBT_SLOTTP。带 # 的名称为预编译符号候选，不能直接认定为物理表。

## poscimfw/pevmg — 事件

按 Any 类型创建具体事件及配置分发；消费与投递保证未知

文件 342；方法定义候选 8423；SQL 操作候选 2770；表名/预编译符号候选 337。

IDL 契约证据：

- SPEventManagementObjectFactory：poscimfw/include/evmgsp.idl:145
- PosAutoDispatchControlEvent：poscimfw/include/pevadc.idl:35
- PosEquipmentAlarmEvent：poscimfw/include/pevalrm.idl:40
- PosAPCInterfaceEvent：poscimfw/include/pevapcif.idl:38
- PosAPCProcessDispositionEvent：poscimfw/include/pevapd.idl:38

实现定位样例：

- SPEventManagementObjectFactory_i::newPosEquipmentAlarmEvent：poscimfw/pevmg/evmgsp.cpp:164–181
- SPEventManagementObjectFactory_i::newPosLotBankMoveEvent：poscimfw/pevmg/evmgsp.cpp:192–209
- SPEventManagementObjectFactory_i::newPosChamberStatusChangeEvent：poscimfw/pevmg/evmgsp.cpp:212–229
- SPEventManagementObjectFactory_i::newPosEquipmentStatusChangeEvent：poscimfw/pevmg/evmgsp.cpp:251–268

SQL 表名样例：#REVALRM、#REVAPCIF、#REVBASE、#REVBGRP、#REVBKMV、#REVBUCN、#REVBUOP、#REVCDCHG、#REVCJSC、#REVCLCTD。带 # 的名称为预编译符号候选，不能直接认定为物理表。

## poscimfw/pfa — 工厂与位置

工厂、区域、库区等模型；不表示部署架构

文件 35；方法定义候选 760；SQL 操作候选 233；表名/预编译符号候选 36。

IDL 契约证据：

- SPFactoryManagementObjectFactory：poscimfw/include/fctrycsp.idl:26
- PosArea：poscimfw/include/parea.idl:52
- PosBank：poscimfw/include/pbank.idl:52
- PosCalendarDate：poscimfw/include/pcaldat.idl:39
- PosMESFactory：poscimfw/include/pfactry.idl:53

实现定位样例：

- SPFactoryManagementObjectFactory_i::newMESFactory：poscimfw/pfa/fctrycsp.cpp:41–47
- SPFactoryManagementObjectFactory_i::newArea：poscimfw/pfa/fctrycsp.cpp:51–67
- SPFactoryManagementObjectFactory_i::newCalendarDate：poscimfw/pfa/fctrycsp.cpp:71–88
- SPFactoryManagementObjectFactory_i::newPosBank：poscimfw/pfa/fctrycsp.cpp:92–109

SQL 表名样例：#RAREA、#RBANK、#RCALENDAR、#RFACTORYNOTE、#RSTAGE、#RSTAGEGRP、BRSVARSMGR、FRAREA、FRAREA_EQP、FRAREA_SLMUTS。带 # 的名称为预编译符号候选，不能直接认定为物理表。

## poscimfw/pfwgls — 框架全局辅助

辅助函数与全局对象定义；关键头文件宏缺失

文件 6；方法定义候选 4；SQL 操作候选 0；表名/预编译符号候选 0。

实现定位样例：

- InitializeServerIniParams::InitializeServerIniParams：poscimfw/pfwgls/parseini.cpp:564–568
- PosGlobalFunctionsClass::clearInhibitRecords：poscimfw/pfwgls/posglsfunc.cpp:31–65
- PosGlobalFunctionsClass::clearInhibitRecordsForAttribute：poscimfw/pfwgls/posglsfunc.cpp:83–110

## poscimfw/pmcmg — 设备与资源

已核实状态对象、E10 标识、可用性及在线模式分离

文件 73；方法定义候选 2518；SQL 操作候选 625；表名/预编译符号候选 81。

IDL 契约证据：

- SPMachineManagementObjectFactory：poscimfw/include/mchnmnsp.idl:35
- PosBufferResource：poscimfw/include/pbufrs.idl:38
- PosMachineContainerPosition：poscimfw/include/pctnpst.idl:42
- PosEqpMonitor：poscimfw/include/pemon.idl:40
- PosEqpMonitorJob：poscimfw/include/pemonj.idl:40

实现定位样例：

- SPMachineManagementObjectFactory_i::newMachineManager：poscimfw/pmcmg/mchnmnsp.cpp:61–67
- SPMachineManagementObjectFactory_i::newBufferResource：poscimfw/pmcmg/mchnmnsp.cpp:71–88
- SPMachineManagementObjectFactory_i::newMaterialLocation：poscimfw/pmcmg/mchnmnsp.cpp:92–109
- SPMachineManagementObjectFactory_i::newMachine：poscimfw/pmcmg/mchnmnsp.cpp:132–149

SQL 表名样例：#RBUFFRSC、#REQP、#REQPCTN、#REQPCTNPST、#REQPMON、#REQPMONJOB、#REQPNOTE、#REQPPROCEDURE、#REQP_CAST、#REQP_LOT。带 # 的名称为预编译符号候选，不能直接认定为物理表。

## poscimfw/pmsds — 消息分发配置

消息定义、目标人员、分发信息；实际外部渠道未知

文件 9；方法定义候选 148；SQL 操作候选 43；表名/预编译符号候选 7。

IDL 契约证据：

- SPMessageDistributionManagementObjectFactory：poscimfw/include/msdsmnsp.idl:24
- PosMessageDistributionManager：poscimfw/include/pmsdnmg.idl:47
- PosMessageDefinition：poscimfw/include/pmsgdfn.idl:43

实现定位样例：

- SPMessageDistributionManagementObjectFactory_i::SPMessageDistributionManagementObjectFactory_i：poscimfw/pmsds/msdsmnsp.cpp:40–54
- SPMessageDistributionManagementObjectFactory_i::newPosMessageDistributionManager：poscimfw/pmsds/msdsmnsp.cpp:63–69
- SPMessageDistributionManagementObjectFactory_i::newPosMessageDefinition：poscimfw/pmsds/msdsmnsp.cpp:73–91
- SPMessageDistributionManagementObjectFactory_i::deleteCIMFWObject：poscimfw/pmsds/msdsmnsp.cpp:97–153

SQL 表名样例：#RMSGDEF、FRMSGDEF、FRMSGDEF_UDATA、FRMSGDEF_USER、FRMSGREQ、FRQTIME、FRQTIME_ACTION。带 # 的名称为预编译符号候选，不能直接认定为物理表。

## poscimfw/ppcdf — 工艺定义、流程与工序

已追批次位置、前移、分支、返回、改线；完整路线算法仍有边界待核实

文件 51；方法定义候选 4021；SQL 操作候选 1412；表名/预编译符号候选 132。

IDL 契约证据：

- PosDurableProcessFlowContext：poscimfw/include/pdpflwx.idl:33
- PosDurableProcessOperation：poscimfw/include/pdpope.idl:33
- PosProcessDefinition：poscimfw/include/ppcdf.idl:53
- PosProcessDefinitionManager：poscimfw/include/ppcdfmg.idl:38
- PosProcessFlow：poscimfw/include/ppcflw.idl:40

实现定位样例：

- PosDurableProcessFlowContext_i::PosDurableProcessFlowContext_i：poscimfw/ppcdf/pdpflwx.cpp:77–81
- PosDurableProcessFlowContext_i::getPreviousProcessOperationFor：poscimfw/ppcdf/pdpflwx.cpp:272–336
- PosDurableProcessFlowContext_i::getNextProcessOperationFor：poscimfw/ppcdf/pdpflwx.cpp:365–438
- PosDurableProcessFlowContext_i::createProcessOperation：poscimfw/ppcdf/pdpflwx.cpp:479–551

SQL 表名样例：#RDRBLPFX、#RDRBLPO、#RPD、#RPF、#RPFX、#RPO、#RPOS、#RQTIME、FRCAST、FRDRBL。带 # 的名称为预编译符号候选，不能直接认定为物理表。

## poscimfw/ppl — 生产请求与计划

请求、批次计划、工序排程对象管理；不等于优化求解器

文件 18；方法定义候选 371；SQL 操作候选 103；表名/预编译符号候选 12。

IDL 契约证据：

- SPPlanningObjectFactory：poscimfw/include/plnngsp.idl:24
- PosLotOperationSchedule：poscimfw/include/pltopsch.idl:44
- PosLotSchedule：poscimfw/include/pltsch.idl:45
- PosPlanManager：poscimfw/include/pplmgr.idl:43
- PosProductRequest：poscimfw/include/pprrq.idl:53

实现定位样例：

- SPPlanningObjectFactory_i::SPPlanningObjectFactory_i：poscimfw/ppl/plnngsp.cpp:40–56
- SPPlanningObjectFactory_i::newPlanManager：poscimfw/ppl/plnngsp.cpp:63–69
- SPPlanningObjectFactory_i::newProductRequest：poscimfw/ppl/plnngsp.cpp:72–90
- SPPlanningObjectFactory_i::newLotSchedule：poscimfw/ppl/plnngsp.cpp:93–109

SQL 表名样例：#RLOTOPESCHE、#RLOTSCHE、#RPRODREQ、FRLOT、FRLOTOPESCHE、FRLOTOPESCHE_UDATA、FRLOTSCHE、FRLOTSCHE_UDATA、FRPRODREQ、FRPRODREQ_PRODUCT。带 # 的名称为预编译符号候选，不能直接认定为物理表。

## poscimfw/pprmg — 批次与晶圆

状态、暂停、工序关联、晶圆级返工计数；完整上层交易缺失

文件 66；方法定义候选 2185；SQL 操作候选 612；表名/预编译符号候选 72。

IDL 契约证据：

- PosControlJob：poscimfw/include/pctrlj.idl:41
- PosFutureReworkRequest：poscimfw/include/pftrwk.idl:37
- PosLot：poscimfw/include/plot.idl:87
- PosLotFamily：poscimfw/include/plotfm.idl:38
- PosLotType：poscimfw/include/plottype.idl:40

实现定位样例：

- PosControlJob_i::PosControlJob_i：poscimfw/pprmg/pctrlj.cpp:89–100
- PosControlJob_i::setIdentifier：poscimfw/pprmg/pctrlj.cpp:352–366
- PosControlJob_i::getIdentifier：poscimfw/pprmg/pctrlj.cpp:395–405
- PosControlJob_i::setMachine：poscimfw/pprmg/pctrlj.cpp:434–448

SQL 表名样例：#RCTRLJOB、#RFTRWK、#RLOT、#RLOTCOMMENT、#RLOTFAMILY、#RLOTNOTE、#RLOTOPENOTE、#RLOTTYPE、#RMONITORGRP、#RPLSPLIT。带 # 的名称为预编译符号候选，不能直接认定为物理表。

## poscimfw/pprsp — 产品规格

产品、客户与规格对象；已核实工艺 Active 版本解析

文件 60；方法定义候选 1192；SQL 操作候选 346；表名/预编译符号候选 41。

IDL 契约证据：

- PosBinDefinition：poscimfw/include/pbindf.idl:46
- PosBinSpecification：poscimfw/include/pbinsp.idl:40
- PosCustomer：poscimfw/include/pcustmr.idl:42
- PosCustomerProduct：poscimfw/include/pcustpr.idl:44
- PosProductSpecification：poscimfw/include/pprsp.idl:50

实现定位样例：

- PosBinDefinition_i::PosBinDefinition_i：poscimfw/pprsp/pbindf.cpp:77–86
- PosBinDefinition_i::setIdentifier：poscimfw/pprsp/pbindf.cpp:287–301
- PosBinDefinition_i::getIdentifier：poscimfw/pprsp/pbindf.cpp:330–340
- PosBinDefinition_i::setDescription：poscimfw/pprsp/pbindf.cpp:369–383

SQL 表名样例：#RBINDEF、#RBINSPEC、#RCUSTOMER、#RCUSTPROD、#RPRODCATEGORY、#RPRODGRP、#RPRODSPEC、#RSMPLSPEC、#RTECH、#RTESTSPEC。带 # 的名称为预编译符号候选，不能直接认定为物理表。

## poscimfw/ppsmg — 人员与权限组

人员、区域组、权限组；成员关系与交易授权分开

文件 24；方法定义候选 651；SQL 操作候选 200；表名/预编译符号候选 31。

IDL 契约证据：

- PosAreaGroup：poscimfw/include/pareagr.idl:45
- PosPerson：poscimfw/include/pperson.idl:62
- PosPrivilegeGroup：poscimfw/include/pprivgr.idl:37
- PosPersonManager：poscimfw/include/ppsmgr.idl:38
- SPPersonManagementObjectFactory：poscimfw/include/prsnmnsp.idl:33

实现定位样例：

- PosAreaGroup_i::PosAreaGroup_i：poscimfw/ppsmg/pareagr.cpp:67–76
- PosAreaGroup_i::setIdentifier：poscimfw/ppsmg/pareagr.cpp:281–293
- PosAreaGroup_i::getIdentifier：poscimfw/ppsmg/pareagr.cpp:322–331
- PosAreaGroup_i::setDescription：poscimfw/ppsmg/pareagr.cpp:361–373

SQL 表名样例：#RAREAGRP、#RPRIVGRP、#RUSER、#RUSERGRP、FRAREAGRP、FRAREAGRP_AREA、FRAREAGRP_UDATA、FRAREAGRP_USER、FRARGRP_NAUTHEQP、FRCAST。带 # 的名称为预编译符号候选，不能直接认定为物理表。

## poscimfw/pptsmg — BOM 与零部件

BOM 部件集合查找；未找到时未显式抛错的行为已核实

文件 8；方法定义候选 124；SQL 操作候选 34；表名/预编译符号候选 4。

IDL 契约证据：

- SPPartsManagementObjectFactory：poscimfw/include/partssp.idl:25
- PosBOM：poscimfw/include/pbom.idl:40
- PosPartsManager：poscimfw/include/pptsmg.idl:41

实现定位样例：

- SPPartsManagementObjectFactory_i::SPPartsManagementObjectFactory_i：poscimfw/pptsmg/partssp.cpp:35–47
- SPPartsManagementObjectFactory_i::newPosBOM：poscimfw/pptsmg/partssp.cpp:56–70
- SPPartsManagementObjectFactory_i::deleteCIMFWObject：poscimfw/pptsmg/partssp.cpp:75–125
- SPPartsManagementObjectFactory_i::deleteCIMFWObject：poscimfw/pptsmg/partssp.cpp:130–141

SQL 表名样例：#RBOM、FRBOM、FRBOM_PARTS、FRBOM_UDATA。带 # 的名称为预编译符号候选，不能直接认定为物理表。

## poscimfw/prcmg — 逻辑配方与设备配方

已核实按设置顺序、设备适用性、资源状态、Active 版本选配方

文件 15；方法定义候选 584；SQL 操作候选 192；表名/预编译符号候选 24。

IDL 契约证据：

- PosLogicalRecipe：poscimfw/include/plcrc.idl:46
- PosMachineRecipe：poscimfw/include/pmcrc.idl:42
- PosRecipeManager：poscimfw/include/prcmg.idl:39
- SPRecipeManagementObjectFactory：poscimfw/include/rcpmngsp.idl:31

实现定位样例：

- PosLogicalRecipe_i::PosLogicalRecipe_i：poscimfw/prcmg/plcrc.cpp:198–216
- PosLogicalRecipe_i::setIdentifier：poscimfw/prcmg/plcrc.cpp:500–514
- PosLogicalRecipe_i::getIdentifier：poscimfw/prcmg/plcrc.cpp:544–554
- PosLogicalRecipe_i::setDescription：poscimfw/prcmg/plcrc.cpp:670–684

SQL 表名样例：#RLRCP、#RMRCP、FRCAST、FRDRBL、FRDRBLPO、FRLOT、FRLOTPO、FRLRCP、FRLRCP_DSET、FRLRCP_DSET_FXTR。带 # 的名称为预编译符号候选，不能直接认定为物理表。

## ras — 日志与跟踪诊断

支撑代码/契约目录，运行部署与完整宏定义未知。

文件 5；方法定义候选 0；SQL 操作候选 0；表名/预编译符号候选 0。

实现定位样例：

- ras/makefile
- ras/mklib.mak
- ras/mkmain2.mak

## ras/tracelog — 日志与跟踪诊断

支撑代码/契约目录，运行部署与完整宏定义未知。

文件 9；方法定义候选 43；SQL 操作候选 0；表名/预编译符号候选 0。

实现定位样例：

- SPTraceLogControlObject_i::SPTraceLogControlObject_i：ras/tracelog/sptrclog.cpp:33–36
- SPTraceLogControlObject_i::setTraceLogVariables：ras/tracelog/sptrclog.cpp:56–124
- SPTraceLogControlObject_i::getTraceLogVariables：ras/tracelog/sptrclog.cpp:127–165
- StandardTrace::StandardTrace：ras/tracelog/stdtrc.cpp:43–67

## ras/tracelog/logger — 日志与跟踪诊断

支撑代码/契约目录，运行部署与完整宏定义未知。

文件 16；方法定义候选 169；SQL 操作候选 0；表名/预编译符号候选 0。

实现定位样例：

- LoggerOfBufferedLogger::init：ras/tracelog/logger/bufferedlogger.cpp:65–97
- LoggerOfBufferedLogger::flush：ras/tracelog/logger/bufferedlogger.cpp:99–126
- LoggerOfBufferedLogger::clear：ras/tracelog/logger/bufferedlogger.cpp:128–145
- LoggerOfBufferedLogger::cancel：ras/tracelog/logger/bufferedlogger.cpp:147–156

## smtchcmf/bllofmtr — 基础 CIM 对象实现

基础对象按目录命名定位，缺少基础 IDL/头文件，详见具体方法索引。

文件 4；方法定义候选 47；SQL 操作候选 0；表名/预编译符号候选 0。

实现定位样例：

- CIMFWBOMManagementObjectFactory_i::newBOMSpecification：smtchcmf/bllofmtr/bllofmof.cpp:33–38
- CIMFWBOMManagementObjectFactory_i::newBOMSpecificationManager：smtchcmf/bllofmtr/bllofmof.cpp:42–47
- CIMFWBOMManagementObjectFactory_i::newBOMBody：smtchcmf/bllofmtr/bllofmof.cpp:50–55
- CIMFWBOMManagementObjectFactory_i::CIMFWBOMManagementObjectFactory_i：smtchcmf/bllofmtr/bllofmof.cpp:71–76

## smtchcmf/drblmngm — 基础 CIM 对象实现

基础对象按目录命名定位，缺少基础 IDL/头文件，详见具体方法索引。

文件 7；方法定义候选 106；SQL 操作候选 0；表名/预编译符号候选 0。

实现定位样例：

- Cassette_i::addWafer_atPosition：smtchcmf/drblmngm/cassette.cpp:73–197
- Cassette_i::removeWafer_fromPosition：smtchcmf/drblmngm/cassette.cpp:232–358
- Cassette_i::allLots：smtchcmf/drblmngm/cassette.cpp:384–485
- Cassette_i::transferWafers_toCassette：smtchcmf/drblmngm/cassette.cpp:519–609

## smtchcmf/dsptchng — 基础 CIM 对象实现

基础对象按目录命名定位，缺少基础 IDL/头文件，详见具体方法索引。

文件 3；方法定义候选 28；SQL 操作候选 0；表名/预编译符号候选 0。

实现定位样例：

- Dispatcher_i::addDispatchableObject：smtchcmf/dsptchng/dsptcher.cpp:150–213
- Dispatcher_i::removeDispatchableObject：smtchcmf/dsptchng/dsptcher.cpp:237–261
- Dispatcher_i::allDispatchableObjects：smtchcmf/dsptchng/dsptcher.cpp:294–361
- Dispatcher_i::whatNextForMachine：smtchcmf/dsptchng/dsptcher.cpp:387–393

## smtchcmf/dtcllctn — 基础 CIM 对象实现

基础对象按目录命名定位，缺少基础 IDL/头文件，详见具体方法索引。

文件 4；方法定义候选 39；SQL 操作候选 0；表名/预编译符号候选 0。

实现定位样例：

- CIMFWDataCollectionManagementObjectFactory_i::newDataCollectionDefinition：smtchcmf/dtcllctn/dtcllcof.cpp:41–46
- CIMFWDataCollectionManagementObjectFactory_i::newDataCollectionSpecification：smtchcmf/dtcllctn/dtcllcof.cpp:50–55
- CIMFWDataCollectionManagementObjectFactory_i::newDataCollectionSpecificationManager：smtchcmf/dtcllctn/dtcllcof.cpp:58–63
- CIMFWDataCollectionManagementObjectFactory_i::CIMFWDataCollectionManagementObjectFactory_i：smtchcmf/dtcllctn/dtcllcof.cpp:74–79

## smtchcmf/fctrycmp — 基础 CIM 对象实现

基础对象按目录命名定位，缺少基础 IDL/头文件，详见具体方法索引。

文件 4；方法定义候选 74；SQL 操作候选 0；表名/预编译符号候选 0。

实现定位样例：

- Area_i::addProcessMachine：smtchcmf/fctrycmp/area.cpp:120–142
- Area_i::addStorageMachine：smtchcmf/fctrycmp/area.cpp:353–375
- Area_i::removeProcessMachine：smtchcmf/fctrycmp/area.cpp:454–475
- Area_i::removeStorageMachine：smtchcmf/fctrycmp/area.cpp:532–553

## smtchcmf/frmwrkgl — 基础 CIM 对象实现

基础对象按目录命名定位，缺少基础 IDL/头文件，详见具体方法索引。

文件 29；方法定义候选 145；SQL 操作候选 1；表名/预编译符号候选 1。

实现定位样例：

- AppErrLog::str：smtchcmf/frmwrkgl/apperrlog.cpp:153–156
- AppErrLog::_endl：smtchcmf/frmwrkgl/apperrlog.cpp:228–232
- AppErrLogWriter::GetAppErrLogWriter：smtchcmf/frmwrkgl/apperrlogwriter.cpp:56–64
- AppErrLogWriter::write：smtchcmf/frmwrkgl/apperrlogwriter.cpp:121–135

SQL 表名样例：SYSIBM.SYSDUMMY1。带 # 的名称为预编译符号候选，不能直接认定为物理表。

## smtchcmf/mchnmngm — 基础 CIM 对象实现

基础对象按目录命名定位，缺少基础 IDL/头文件，详见具体方法索引。

文件 9；方法定义候选 178；SQL 操作候选 0；表名/预编译符号候选 0。

实现定位样例：

- BufferResource_i::resourceLevel：smtchcmf/mchnmngm/bffrrsrc.cpp:65–74
- BufferResource_i::startUp：smtchcmf/mchnmngm/bffrrsrc.cpp:98–102
- BufferResource_i::shutdownNormal：smtchcmf/mchnmngm/bffrrsrc.cpp:129–133
- BufferResource_i::shutdownImmediate：smtchcmf/mchnmngm/bffrrsrc.cpp:160–164

## smtchcmf/mtrlmngm — 基础 CIM 对象实现

基础对象按目录命名定位，缺少基础 IDL/头文件，详见具体方法索引。

文件 2；方法定义候选 36；SQL 操作候选 0；表名/预编译符号候选 0。

实现定位样例：

- Material_i::materialGroups：smtchcmf/mtrlmngm/material.cpp:69–113
- Material_i::isMemberOf：smtchcmf/mtrlmngm/material.cpp:141–213
- Material_i::setLocation：smtchcmf/mtrlmngm/material.cpp:235–329
- Material_i::getLocation：smtchcmf/mtrlmngm/material.cpp:367–378

## smtchcmf/plnnngcm — 基础 CIM 对象实现

基础对象按目录命名定位，缺少基础 IDL/头文件，详见具体方法索引。

文件 3；方法定义候选 48；SQL 操作候选 0；表名/预编译符号候选 0。

实现定位样例：

- PlanManager_i::resourceLevel：smtchcmf/plnnngcm/plnmnger.cpp:140–149
- PlanManager_i::startUp：smtchcmf/plnnngcm/plnmnger.cpp:196–213
- PlanManager_i::shutdownNormal：smtchcmf/plnnngcm/plnmnger.cpp:260–277
- PlanManager_i::shutdownImmediate：smtchcmf/plnnngcm/plnmnger.cpp:317–326

## smtchcmf/prcssdfn — 基础 CIM 对象实现

基础对象按目录命名定位，缺少基础 IDL/头文件，详见具体方法索引。

文件 7；方法定义候选 76；SQL 操作候选 0；表名/预编译符号候选 0。

实现定位样例：

- ProcessDefinitionManager_i::removeProcessDefinition：smtchcmf/prcssdfn/prcdfmgr.cpp:483–572
- ProcessDefinitionManager_i::allProcessDefinitions：smtchcmf/prcssdfn/prcdfmgr.cpp:596–643
- ProcessDefinitionManager_i::findProcessDefinitionNamed：smtchcmf/prcssdfn/prcdfmgr.cpp:665–682
- ProcessDefinitionManager_i::createProcessFlowFor：smtchcmf/prcssdfn/prcdfmgr.cpp:713–788

## smtchcmf/prdctmng — 基础 CIM 对象实现

基础对象按目录命名定位，缺少基础 IDL/头文件，详见具体方法索引。

文件 8；方法定义候选 159；SQL 操作候选 0；表名/预编译符号候选 0。

实现定位样例：

- Die_i::Die_i：smtchcmf/prdctmng/die.cpp:97–101
- Die_i::Die_i：smtchcmf/prdctmng/die.cpp:104–108
- Lot_i::makeCreated：smtchcmf/prdctmng/lot.cpp:573–610
- Lot_i::makeReleased：smtchcmf/prdctmng/lot.cpp:632–707

## smtchcmf/prdctspc — 基础 CIM 对象实现

基础对象按目录命名定位，缺少基础 IDL/头文件，详见具体方法索引。

文件 3；方法定义候选 28；SQL 操作候选 0；表名/预编译符号候选 0。

实现定位样例：

- CIMFWProductSpecificationObjectFactory_i::newProductSpecificationManager：smtchcmf/prdctspc/prdctsof.cpp:31–36
- CIMFWProductSpecificationObjectFactory_i::newProductSpecification：smtchcmf/prdctspc/prdctsof.cpp:40–45
- CIMFWProductSpecificationObjectFactory_i::CIMFWProductSpecificationObjectFactory_i：smtchcmf/prdctspc/prdctsof.cpp:56–61
- ProductSpecification_i::isEqualTo：smtchcmf/prdctspc/prdctspc.cpp:63–113

## smtchcmf/prsnmngm — 基础 CIM 对象实现

基础对象按目录命名定位，缺少基础 IDL/头文件，详见具体方法索引。

文件 3；方法定义候选 34；SQL 操作候选 0；表名/预编译符号候选 0。

实现定位样例：

- Person_i::setIdentifier：smtchcmf/prsnmngm/person.cpp:243–257
- Person_i::setDepartment：smtchcmf/prsnmngm/person.cpp:294–308
- Person_i::getDepartment：smtchcmf/prsnmngm/person.cpp:342–354
- Person_i::setFullName：smtchcmf/prsnmngm/person.cpp:392–406

## smtchcmf/rcpmngmn — 基础 CIM 对象实现

基础对象按目录命名定位，缺少基础 IDL/头文件，详见具体方法索引。

文件 3；方法定义候选 31；SQL 操作候选 0；表名/预编译符号候选 0。

实现定位样例：

- MachineRecipe_i::addMachine：smtchcmf/rcpmngmn/mchnrcpe.cpp:175–203
- MachineRecipe_i::removeMachine：smtchcmf/rcpmngmn/mchnrcpe.cpp:225–252
- MachineRecipe_i::allMachines：smtchcmf/rcpmngmn/mchnrcpe.cpp:287–332
- MachineRecipe_i::setIdentifier：smtchcmf/rcpmngmn/mchnrcpe.cpp:557–571

## smtchcmf/rsrcclss — 基础 CIM 对象实现

基础对象按目录命名定位，缺少基础 IDL/头文件，详见具体方法索引。

文件 4；方法定义候选 43；SQL 操作候选 0；表名/预编译符号候选 0。

实现定位样例：

- ComponentManager_i::makeRegistered：smtchcmf/rsrcclss/cmpnntmn.cpp:138–177
- ComponentManager_i::makeNotRegistered：smtchcmf/rsrcclss/cmpnntmn.cpp:207–238
- ComponentManager_i::makeStartingUp：smtchcmf/rsrcclss/cmpnntmn.cpp:267–358
- ComponentManager_i::makeShuttingDown：smtchcmf/rsrcclss/cmpnntmn.cpp:384–422

## smtchcmf/tmsrvcsc — 基础 CIM 对象实现

基础对象按目录命名定位，缺少基础 IDL/头文件，详见具体方法索引。

文件 2；方法定义候选 52；SQL 操作候选 0；表名/预编译符号候选 0。

实现定位样例：

- DurationImpl::days_hours_minutes_seconds_milliseconds：smtchcmf/tmsrvcsc/duration.cpp:23–27
- DurationImpl::add：smtchcmf/tmsrvcsc/duration.cpp:31–35
- DurationImpl::substract：smtchcmf/tmsrvcsc/duration.cpp:38–46
- DurationImpl::days：smtchcmf/tmsrvcsc/duration.cpp:49–54

