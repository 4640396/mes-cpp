# BOM、零部件规格与清单保存

完整阅读21个方法，路径相对 fw_cpp_sqx。清单配置、产品规格引用和实际领料/消耗是不同层次，当前未连接库存系统。

## 清单条目引用产品规格

PosBOM 的 IDL（poscimfw/include/pbom.idl:40）继承 NamedEntity 与 CachedManagedObject。已读入口没有 Document/Active 版本解析，不能把配方/工艺的 Active 版本规则自动套用到 BOM。标识字符串是否有外部版本约定仍未知。

PosBOM_i::setBOMInfo（pptsmg/pbom.cpp:723–810）标dirty、设置描述，先清空 theParts，再逐项通过 ProductSpecificationManager.findProductSpecificationNamed 解析 part，复制 quantity、serialControlFlag。按解析后 parts.identifier 去重，只保留首个同标识条目，不把数量相加。这里的 parts 指产品规格引用，不是已经领出的某个实体库存批或序列号对象。

addParts（402–435）则直接接受 posParts，按标识检查重复，重复显式抛 PartsDuplicate；与整体替换的“忽略后续重复”不同。两条入口本地均未见非负数量、循环BOM、序列号唯一性或可用库存校验；是否由上层保证待证。

setIdentifier（274–290）通过 SP_SET_IDENTIFIER 宏赋标识。removeParts（617–643）找不到抛异常，removeAllParts（672–692）清集合。findPartsFor（463–515）查不到时空分支，返回初始化记录，不能按命名补出 PartsNotFound；allParts（543–588）返回集合序列，没有本地消耗动作。

## 产品规格与 BOM 的关联

PosProductSpecification_i::setBOM/getBOM（pprsp/pprsp.cpp:4543–4557、4585–4596）保存/读取引用，未在这些方法复制BOM条目、冻结版本或计算所需总量。设置一个BOM不等于立即刷新所有在制Lot的物料需求。

## 管理器与数据库查找

createBOMNamed（pptsmg/pptsmg.cpp:283–326）将创建、系统key及重复检查等参数交给 SP_CREATE_OBJECT_WITH_SYSKEY_AND_RETURN；newPosBOM（partssp.cpp:56–70）也通过带systemKey宏创建，并附加用户数据集。宏工厂生命周期不能只凭宏名完整还原。

findBOMNamed/allBOMs（pptsmg.cpp:501–516、420–470）在非TRANSIENT读管理器集合，TRANSIENT调用数据库方法。_findBOMNamed（pptsmgdb.sqx:68–127）以 BOM_ID 查 FRBOM，并在SQL成功后额外比较输入长度与数据库 LENGTH(BOM_ID)，不同返回nil；SQL非成功分支没有本地显式初始化返回宿主缓冲/抛错逻辑，行为仍依赖 GET_OBJECT_FROM_HOST_VARIABLE。不能一概描述为“未找到总是nil”。

_allBOMs（158–217）先count、分配序列，再游标读取所有BOM_OBJ；while体没有显式break，结束/扩容依赖 GET_OBJECT_FROM_HOST_VARIABLE_IN_SEQUENCE。没有ORDER BY，不推定稳定顺序；count与游标之间的一致性依赖数据库隔离。

removeBOMNamed（356–391）非TRANSIENT先移列表，再 clear与删除；removeAllBOMs（552–618）逐个调用并忽略找不到。未在此方法显式检查仍有产品规格引用，也不证明删除时会自动解绑所有规格或级联生产库存。

## SQL 保存的是需求配置

CollectionHelper_FRBOM_PARTS::getHostVarsFromCollectionItem（pptsmg/C_pbomdo.cpp:980–1019）将 parts.identifier/ref 转宿主字段，quantity和serialControlFlag转sqlint32；实际列长和数值范围约束需生成头文件/DDL/输入证据。

Writer_FRBOM_PARTS::singleInsert（U_pbomdo.sqx:268–292）写 FRBOM_PARTS 的 systemKey、tableMarker、d_key、PARTS_ID、PARTS_OBJ、QUANTITY、SERIALCTRL_FLAG。update（346–367）按 systemKey+d_key 更新条目值。QUANTITY 这里是清单字段，不是已经发生的消耗流水数量。

CollectionHelper_FRBOM_PARTS::save（919–993）按更新配置选择差异删除/更新/插入或整体删除重插，并跳过None项；与已读字典样板一致，但此BOM的字段映射已单独核实。这里只证明DO集合到SQL Writer的路径，BO/DO数组交接、触发保存和事务提交仍未知，未自动建立BO集合与DO集合等价关系。

## 业务执行边界

当前 fw_cpp_sqx 检索到清单API、产品规格set/get关联和生成持久化，尚未找到完整的“选择BOM→乘批次数量→预留库存→领用/退料→消耗核销”交易链。serialControlFlag只是存储标志，不证明已逐件追踪序列号。不能把这些缺少证据的业务步骤补进本体事实。

后续需要外部交易/IDL或新增源码才能核实执行消耗；当前仍可继续分析其他现有领域，不以此局部未知阻断整个项目。
