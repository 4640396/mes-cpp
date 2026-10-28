import fs from 'node:fs';
import crypto from 'node:crypto';
const out='analysis/mes-cpp';
const ontology={version:'0.1.0',scope:'fw_cpp_sqx 静态源码理解',description:'轻量应用本体；不是已完成的 OWL 推理系统，也不代表生产数据库模型。',entityTypes:{BusinessObject:'业务对象类型，如批次与工序，不是实际生产实例',Interface:'IDL 接口',Method:'源码方法',StateDimension:'对象状态维度',Table:'SQL 中出现的表名',Column:'SQL 列',SourceFile:'源码文件'},relationTypes:{HAS_STATE:['BusinessObject','StateDimension'],DECLARES:['Interface','Method'],CALLS:['Method','Method'],RETURNS_REFERENCE:['Method','BusinessObject'],READS:['Method','Table'],WRITES:['Method','Table'],STORES:['Table','Column'],SETS_CURRENT:['Method','BusinessObject']},evidenceLevels:['EXTRACTED','INFERRED','AMBIGUOUS'],requiredEvidenceFields:['path','line','end_line'],rules:['关系必须引用已存在实体，并满足关系类型的两端约束。','EXTRACTED 仅表示所引源码中直接可见；不证明运行时发生。','条件调用必须保留条件；不得把 IDL 契约或同名匹配当作确定调用。','正则提取候选不自动进入本事实集；需逐条核实。','本体中的 READS/WRITES 允许后续扩展，本轮没有证据的边不创建。']};
const nodes=[],edges=[];
ontology.version='0.2.0';
ontology.relationTypes.HAS_CONTRACT=['BusinessObject','Interface'];
ontology.relationTypes.CHECKS_APPLICABILITY=['Method','BusinessObject'];
ontology.relationTypes.INVOKES_VIRTUAL_CONTRACT=['Method','Method'];
ontology.entityTypes.Rule='方法级业务规则；描述条件和结果，不是执行引擎';
ontology.relationTypes.HAS_RULE=['Method','Rule'];
ontology.entityTypes.Collection='业务实现或 DO 侧的集合成员；不同对象侧不自动等同';
ontology.relationTypes.REPLACES_COLLECTION=['Method','Collection'];
ontology.relationTypes.READS_COLLECTION=['Method','Collection'];
ontology.relationTypes.SAVES_COLLECTION=['Method','Collection'];
ontology.sourceGraphModel={file:'source-graph.json',entityTypes:['Module','SourceFile','Implementation','Interface','Method','SQLStatement','Table'],relations:{CONTAINS:['Module','SourceFile'],DEFINES:['SourceFile','Method'],DECLARES_IMPLEMENTATION:['Implementation','Method'],DECLARES:['SourceFile','Interface'],INHERITS:['Interface','Interface'],NAME_MATCH:['Interface','Implementation'],CONTAINS_SQL:[['SourceFile','Method'],'SQLStatement'],REFERENCES_TABLE:['SQLStatement','Table'],WRITES_TABLE:['SQLStatement','Table']},limits:'结构图包含直接文本提取和名称/SQL 候选；不得把所有边当作业务事实或真实调用。'};
const node=(id,type,label)=>nodes.push({id,type,label});
for(const [id,label] of [['Lot','批次'],['Operation','工序实例'],['Context','流程上下文'],['Flow','工艺流程'],['Definition','工艺定义']])node(id,'BusinessObject',label);
for(const id of ['LotState','ProductionState','HoldState','FinishedState','ProcessState','InventoryState'])node(id,'StateDimension',id);
for(const id of ['makeOnHold','baseMakeOnHold','requestMakeOnHold','getResponsibleOperation','getCurrentOperation','getPreviousOperation','beginNextOperation','setCurrentOperation','createOperation','getNextSpecification','locateTo','getDefinition','getFlow'])node(id,'Method',id);
node('FRLOT','Table','FRLOT');node('LOT_HOLD_STATE','Column','LOT_HOLD_STATE');
node('Wafer','BusinessObject','晶圆');
for(const id of ['lotIncreaseRework','lotDecreaseRework','waferIncreaseRework','waferDecreaseRework','waferGetRework','lotCheckMaxRework','branchTo','cancelBranch','changeFlowTo'])node(id,'Method',id);
const evidence=(path,line,end_line)=>({path,line,end_line});
function edge(from,type,to,source,condition){edges.push({id:'fact-'+(edges.length+1),from,type,to,evidence:'EXTRACTED',sources:[source],...(condition?{condition}:{})});}
const p='poscimfw/pprmg/plot.cpp',c='poscimfw/ppcdf/ppcflwx.cpp';
for(const id of ['LotState','ProductionState','HoldState','FinishedState','ProcessState','InventoryState'])edge('Lot','HAS_STATE',id,evidence(p,3342,3410),'状态维度由 getter 投影中的成员访问及生产状态方法共同佐证；ProductionState 另见 makeWaiting:5553');
edge('makeOnHold','CALLS','baseMakeOnHold',evidence(p,6606,6617),'isInBank()!=TRUE');
edge('baseMakeOnHold','CALLS','requestMakeOnHold',evidence('smtchcmf/prdctmng/lot.cpp',1003,1034),'同族全部暂停且 ProductRequest 非空；被调用方还要求 InWork');
edge('getResponsibleOperation','CALLS','getCurrentOperation',evidence(p,3496,3502),'责任标志关闭');
edge('getResponsibleOperation','CALLS','getPreviousOperation',evidence(p,3504,3519),'责任标志开启且上下文非空');
edge('getCurrentOperation','RETURNS_REFERENCE','Operation',evidence('smtchcmf/prdctmng/lot.cpp',3471,3482));
edge('getPreviousOperation','RETURNS_REFERENCE','Operation',evidence(c,606,621),'通过 getBefore 查找，空值语义需宏定义补证');
edge('beginNextOperation','CALLS','getNextSpecification',evidence(c,4156,4160));
edge('beginNextOperation','CALLS','createOperation',evidence(c,4166,4187),'下一规格非空');
edge('beginNextOperation','CALLS','setCurrentOperation',evidence(c,4166,4187),'工序创建成功');
edge('setCurrentOperation','SETS_CURRENT','Operation',evidence(c,1377,1393));
edge('locateTo','CALLS','createOperation',evidence(c,5148,5161),'目标规格非空');
edge('locateTo','CALLS','setCurrentOperation',evidence(c,5156,5161),'目标工序创建成功');
edge('getDefinition','RETURNS_REFERENCE','Definition',evidence('poscimfw/ppcdf/ppcope.cpp',2247,2258));
edge('getFlow','RETURNS_REFERENCE','Flow',evidence('poscimfw/ppcdf/ppcope.cpp',4254,4264));
edge('FRLOT','STORES','LOT_HOLD_STATE',evidence('poscimfw/pprmg/U_plotdo.sqx',1018,1018));
edge('lotIncreaseRework','CALLS','waferIncreaseRework',evidence(p,15688,15699),'遍历批次晶圆，使用主工艺与前工序组成的 key');
edge('lotDecreaseRework','CALLS','waferDecreaseRework',evidence(p,15886,15897),'遍历批次晶圆，key 来源于备份返回点');
edge('lotCheckMaxRework','CALLS','waferGetRework',evidence(p,16038,16056),'产品上限为正数；任一晶圆计数达到上限即 TRUE');
edge('branchTo','CALLS','setCurrentOperation',evidence(c,5770,5782),'目标规格和创建工序非空');
edge('cancelBranch','CALLS','setCurrentOperation',evidence(c,6042,6060),'备份工序有效，否则 LotNotBranchedSignal');
edge('changeFlowTo','CALLS','setCurrentOperation',evidence(c,7247,7271),'目标流程、规格和创建工序有效');
const concepts=[['Lot','批次','PosLot'],['Wafer','晶圆','PosWafer'],['Operation','工序实例','PosProcessOperation'],['Context','流程上下文','PosProcessFlowContext'],['Flow','工艺流程','PosProcessFlow'],['Definition','工艺定义','PosProcessDefinition'],['OperationSpecification','工序规格','PosProcessOperationSpecification'],['Machine','设备','PosMachine'],['MachineState','设备状态','PosMachineState'],['LogicalRecipe','逻辑配方','PosLogicalRecipe'],['MachineRecipe','设备配方','PosMachineRecipe'],['Cassette','载具','PosCassette'],['DispatchManager','派工管理','PosDispatchingManager'],['EventManager','事件管理','PosEventManager'],['DCDefinition','数据采集定义','PosDataCollectionDefinition'],['DCSpecification','数据采集规格','PosDataCollectionSpecification'],['EntityInhibit','实体限制','PosEntityInhibit'],['ProductSpecification','产品规格','PosProductSpecification'],['LotSchedule','批次计划','PosLotSchedule'],['Person','人员','PosPerson'],['PrivilegeGroup','权限组','PosPrivilegeGroup'],['BOM','物料清单','PosBOM']];
const interfaces=JSON.parse(fs.readFileSync(out+'/business-map.json')).interfaces;
concepts.push(['FlowBatch','流程批','PosFlowBatch'],['FlowBatchDispatcher','流程批分发器','PosFlowBatchDispatcher']);
concepts.push(['ProductRequest','生产请求','PosProductRequest']);
concepts.push(['Bank','库区','PosBank'],['Area','区域（Location/WorkArea类别）','PosArea'],['StorageMachine','存储设备','PosStorageMachine']);
concepts.push(['MessageDistributionManager','消息分发管理','PosMessageDistributionManager'],['MessageDefinition','消息定义','PosMessageDefinition']);
nodes.find(n=>n.id==='requestMakeOnHold').label='ProductRequest_i::makeOnHold';
ontology.businessConcepts=[];
for(const [id,label,codeType] of concepts){if(!nodes.some(n=>n.id===id))node(id,'BusinessObject',label);const i=interfaces.find(i=>i.name===codeType);if(!i)throw Error('缺失概念契约 '+codeType);const contract='contract:'+codeType;node(contract,'Interface',codeType);const source=evidence(i.file,i.line,i.line);edge(id,'HAS_CONTRACT',contract,source);ontology.businessConcepts.push({id,label,codeType,sources:[source]});}
const extraMethods={machineSetState:'PosMachine_i::setCurrentMachineState',machineAvailable:'PosMachine_i::isAvailableState',stateAvailable:'PosMachineState_i::isMachineAvailable',machineOnline:'PosMachine_i::isOnline',recipeSelect:'PosLogicalRecipe_i::findMachineRecipeForSubLotType',recipeApplicable:'PosMachineRecipe_i::isUsedBy',recipeAllMachines:'MachineRecipe_i::allMachines',resourceMatch:'PosMachine_i::isSameProcessResourceStatesForSubLotType',dispatchEnqueue:'PosDispatchingManager_i::addToQueue',dispatcherEnqueue:'PosDispatcher_i::addToQueue',fifoDispatch:'PosWhatNextFIFO_i::dispatchFor_inSQL',eventCreate:'PosEventManager_i::createEvent',eventSetData:'PosEventBase_i::setEventData',dcSetDisabled:'PosDataCollectionDefinition_i::setDCDefinitionInfo',inhibitCreate:'PosEntityInhibitManager_i::createEntityInhibit',inhibitCheckDuplicate:'PosEntityInhibitManager_i::hasInhibitRecordFor'};
for(const [id,label] of Object.entries(extraMethods))node(id,'Method',label);
edge('machineSetState','CALLS','stateAvailable',evidence('poscimfw/pmcmg/pmc.cpp',11698,11702),'输入状态对象非空');
edge('machineAvailable','CALLS','stateAvailable',evidence('poscimfw/pmcmg/pmc.cpp',11822,11843),'当前状态非空；否则 FALSE');
edge('recipeSelect','CALLS','recipeApplicable',evidence('poscimfw/prcmg/plcrc.cpp',4423,4427),'逐项解析设备配方，配方引用非空');
edge('recipeSelect','CALLS','resourceMatch',evidence('poscimfw/prcmg/plcrc.cpp',4445,4463),'配方适用且该项资源状态列表非空');
edge('recipeApplicable','CHECKS_APPLICABILITY','Machine',evidence('poscimfw/prcmg/pmcrc.cpp',1353,1378),'按 allMachines 中的 identifier 匹配；非执行中配方判断');
edge('dispatchEnqueue','CALLS','dispatcherEnqueue',evidence('poscimfw/pdp/pdpmg.cpp',745,767),'普通路径：逐一向 findMachinesFor 返回的设备 dispatcher 入队');
edge('fifoDispatch','READS','FRLOT',evidence('poscimfw/pdp/pwtfifodb.sqx',60,67),'逐个输入候选读取 QUEUED_TIME，仅 SQLCODE==0 加入排序容器');
edge('eventCreate','INVOKES_VIRTUAL_CONTRACT','eventSetData',evidence('poscimfw/pevmg/pevmg.sqx',1762,1767),'工厂创建的具体事件对象非空；仅记录基类契约，具体覆写目标未在此边解析');
edge('inhibitCreate','CALLS','inhibitCheckDuplicate',evidence('poscimfw/penmg/peninmg.cpp',848,855),'发现相同记录时抛框架异常');
const rules=[
 ['onlineRule','在线模式独立于设备可用性','machineOnline',evidence('poscimfw/pmcmg/pmc.cpp',12800,12809),'比较 theOnlineMode 与 Online；不代表可派工'],
 ['recipeSelectionRule','首个满足设备与资源条件的配方设置优先','recipeSelect',evidence('poscimfw/prcmg/plcrc.cpp',4417,4486),'空资源列表可直接选中，否则须匹配；Active 版本解析后返回'],
 ['disabledDCEntry','此版本旧采集定义更新接口直接抛错','dcSetDisabled',evidence('poscimfw/pdcmg/pdcdf.cpp',700,707),'FrameworkErrorSignal；旧写入实现已注释'],
 ['waferCounterIncrease','晶圆按 key 计数：不存在从 1 开始，已存在加一','waferIncreaseRework',evidence('poscimfw/pprmg/pwafer.cpp',2319,2336),'标记对象与集合为脏；未证明已提交'],
 ['waferCounterDecrease','减计数：不存在异常，原为 1 则移除条目','waferDecreaseRework',evidence('poscimfw/pprmg/pwafer.cpp',2378,2396),'原次数大于 1 才重新添加减一后的条目'],
 ['reworkLimitRule','0 直接超限；负数不超限；正数按任一晶圆 >= 上限','lotCheckMaxRework',evidence(p,16021,16064),'产品工序给出上限，计数按工艺/工序 key 获取']
];
for(const [id,label,method,source,condition] of rules){node(id,'Rule',label);edge(method,'HAS_RULE',id,source,condition);}
node('cassetteMakeHold','Method','PosCassette_i::makeOnHold');node('cassetteHoldRule','Rule','在库或尚未暂停时允许暂停，否则状态异常');edge('cassetteMakeHold','HAS_RULE','cassetteHoldRule',evidence('poscimfw/pdrmg/pcas.cpp',9804,9816),'isInBank() || !isOnHold()');
node('authenticate','Method','PosAuthenticationManager_i::authenticate');node('authModeRule','Rule','Authserver 模式禁用此本地认证入口');edge('authenticate','HAS_RULE','authModeRule',evidence('poscimfw/patmg/pathmgr.cpp',312,320),'外部服务模式行为未在此处实现');
// The production dimension is evidenced by a write outside getState's projection.
edges.find(e=>e.to==='ProductionState').sources=[evidence(p,5547,5554)];
if(fs.existsSync(out+'/deep-facts.json')){const extra=JSON.parse(fs.readFileSync(out+'/deep-facts.json'));for(const n of extra.nodes){const existing=nodes.find(x=>x.id===n.id);if(existing&&existing.type!==n.type)throw Error('深入事实 ID 类型冲突 '+n.id);if(!existing)nodes.push(n);}for(const e of extra.edges)edges.push({id:'fact-'+(edges.length+1),evidence:'EXTRACTED',...e});}
const byId=new Map(nodes.map(n=>[n.id,n]));
const lockPath=out+'/evidence-lock.json',lock=fs.existsSync(lockPath)?JSON.parse(fs.readFileSync(lockPath)):{version:1,files:{},ranges:{}};
for(const e of edges){const rule=ontology.relationTypes[e.type];if(byId.get(e.from)?.type!==rule[0]||byId.get(e.to)?.type!==rule[1])throw Error('类型约束失败 '+e.id);for(const s of e.sources){const bytes=fs.readFileSync('fw_cpp_sqx/'+s.path),lines=bytes.toString('utf8').split('\n');if(s.line<1||s.end_line<s.line||s.end_line>lines.length)throw Error('证据范围错误 '+e.id);const hash=crypto.createHash('sha256').update(bytes).digest('hex'),key=s.path+':'+s.line+'-'+s.end_line,rangeHash=crypto.createHash('sha256').update(lines.slice(s.line-1,s.end_line).join('\n')).digest('hex');if(lock.files[s.path]&&lock.files[s.path]!==hash)throw Error('业务事实来源已变化，需要人工复核：'+s.path);if(lock.ranges[key]&&lock.ranges[key]!==rangeHash)throw Error('证据片段已变化：'+key);lock.files[s.path]=hash;lock.ranges[key]=rangeHash;s.fileSha256=hash;s.rangeSha256=rangeHash;}}
fs.writeFileSync(lockPath,JSON.stringify(lock,null,2));
fs.writeFileSync(out+'/ontology.json',JSON.stringify(ontology,null,2));fs.writeFileSync(out+'/verified-facts.json',JSON.stringify({scope:ontology.scope,generatedBy:'人工核实源码事实；未运行 graphify',nodes,edges,unknowns:['上层交易入口','BO/DO 完整绑定','事务调度与回滚','branchTo/cancelBranch/changeFlowTo 所有边界条件与返工调用顺序']},null,2));console.log(JSON.stringify({nodes:nodes.length,facts:edges.length,typeAndSourceRangeValidation:'passed'}));
