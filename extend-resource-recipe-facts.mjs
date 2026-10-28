import fs from 'node:fs';
const out='analysis/mes-cpp',read=f=>JSON.parse(fs.readFileSync(out+'/'+f)),write=(f,d)=>fs.writeFileSync(out+'/'+f,JSON.stringify(d,null,2));
const reviews=read('deep-reviews.json'),methods=read('method-index.json').methods,d=read('deep-facts.json');
const groups=[
 ['poscimfw/pmcmg/pmc.cpp','machine-resource-deep.md',['isSameProcessResourceStatesForSubLotType','addFlowBatch','removeFlowBatch','allFlowBatches','findFlowBatchNamed','setFlowBatchMaxCount','getFlowBatchMaxCount','getFlowBatch','setFlowBatch']],
 ['poscimfw/pcdmg/pmstat.cpp','machine-resource-deep.md',['isMachineAvailable','isConditionalAvailable','isConditionalAvailableFor','addAvailableSubLotType','removeAvailableSubLotType','allAvailableSubLotTypes','removeAllAvailableSubLotTypes','setEquipmentStateInfo','setEquipmentStateInfo__XXX']],
 ['smtchcmf/mchnmngm/machine.cpp','machine-resource-deep.md',['findProcessResourceNamed']],
 ['poscimfw/prcmg/plcrc.cpp','recipe-selection-deep.md',['setDefaultRecipeSettings','setMachineSpecificRecipeSettings','findMachineRecipeForSubLotType','findDefaultSettingForSubLotType','findDefaultSettingItemsForSubLotType','findMachineSpecificItemsForSubLotType','findProcessDCSpecificationForSubLotType','findDataCollectionDefinitionForSubLotType','findFixtureGroupsForSubLotType','findBinDefinitionForSubLotType','findRecipeParametersForSubLotType','findMachineRecipeFor','findDefaultSettingFor']],
 ['poscimfw/penmg/peninmg.cpp','recipe-selection-deep.md',['allEntityInhibitRecordsForLotEntities']],
 ['poscimfw/penmg/penin.cpp','recipe-selection-deep.md',['getExceptionLotRecord']],
 ['poscimfw/penmg/penindb.sqx','inhibit-query-deep.md',['getEntityInhibitRecordsFor','findEntityInhibitRecordByKey']]
];
for(const [file,report,names] of groups)for(const name of names){const matched=methods.filter(m=>m.file===file&&m.qualified.endsWith('::'+name));if(matched.length!==1)throw Error('方法登记非唯一 '+file+' '+name);const m=matched[0];if(!reviews.records.some(r=>r.file===file&&r.qualified===m.qualified&&r.line===m.line))reviews.records.push({file,qualified:m.qualified,line:m.line,end_line:m.end_line,status:'body_reviewed_with_external_unknowns',report,unknowns:['缺失宏及 SDK 实现','动态调用与部署配置','事务及运行验证未完成']});}
reviews.currentFocus='已核实设备资源状态、FlowBatch 设备存储模式、配方参数覆盖及带 Lot 选择的实体限制分支，并追到按 key 重新读取完整限制集合。限制查询存在阈值路径差异。接下来核实配置与调用者，拓展其他领域及生成模板族。';
const n=(id,type,label)=>{if(!d.nodes.some(v=>v.id===id))d.nodes.push({id,type,label});};
const e=(from,type,to,file,line,end_line,condition)=>{const v={from,type,to,sources:[{path:file,line,end_line}],...(condition?{condition}:{})};if(!d.edges.some(x=>JSON.stringify([x.from,x.type,x.to,x.sources])===JSON.stringify([v.from,v.type,v.to,v.sources])))d.edges.push(v);};
for(const [id,label] of Object.entries({conditionalState:'PosMachineState_i::isConditionalAvailable',conditionalSubtype:'PosMachineState_i::isConditionalAvailableFor',machineAddFlow:'PosMachine_i::addFlowBatch',machineRemoveFlow:'PosMachine_i::removeFlowBatch',machineSetFlowMax:'PosMachine_i::setFlowBatchMaxCount',recipeForLot:'PosLogicalRecipe_i::findMachineRecipeFor',settingForLot:'PosLogicalRecipe_i::findDefaultSettingFor',recipeParameters:'PosLogicalRecipe_i::findRecipeParametersForSubLotType',defaultItems:'PosLogicalRecipe_i::findDefaultSettingItemsForSubLotType',specificItems:'PosLogicalRecipe_i::findMachineSpecificItemsForSubLotType',inhibitForEntities:'PosEntityInhibitManager_i::allEntityInhibitRecordsForLotEntities',inhibitQuery:'PosEntityInhibitManager_i::getEntityInhibitRecordsFor',lotException:'PosEntityInhibit_i::getExceptionLotRecord',stateInfoDisabled:'PosMachineState_i::setEquipmentStateInfo'}))n(id,'Method',label);
for(const [id,label] of Object.entries({resourceTruthRule:'命名资源全部匹配；资源不存在总失败；条件可用按 subLotType 成员关系取正反',flowModeRule:'MaxCount 正数选择集合模式；addFlowBatch 本体无 count<max 校验',flowModeSwitchRule:'0 与正数互切且存在 FlowBatch 关联时拒绝',parameterOverlayRule:'按参数名覆盖：设备基础值 < 默认设置 < 设备专用设置',lotRecipeInhibitRule:'仅配置值1且非空资源要求匹配分支检查实体限制；任一限制无该 Lot 例外则跳过候选',inhibitThresholdRule:'阈值和实体候选行数决定逐条或动态 SQL 路径，时间及 subtype 筛选写法不同',stateInfoDisabledRule:'该版本 setEquipmentStateInfo 直接抛异常，不能以 __XXX 方法替代公开入口语义'}))n(id,'Rule',label);
const machine='poscimfw/pmcmg/pmc.cpp',recipe='poscimfw/prcmg/plcrc.cpp',query='poscimfw/penmg/penindb.sqx';
e('resourceMatch','HAS_RULE','resourceTruthRule',machine,13943,14009);
e('resourceMatch','INVOKES_VIRTUAL_CONTRACT','conditionalState',machine,13935,14016);
e('resourceMatch','INVOKES_VIRTUAL_CONTRACT','conditionalSubtype',machine,13935,14016);
e('machineAddFlow','HAS_RULE','flowModeRule',machine,21427,21536);
e('machineSetFlowMax','HAS_RULE','flowModeSwitchRule',machine,21851,21884);
e('machineAddFlow','INVOKES_VIRTUAL_CONTRACT','flowSetMachine',machine,21427,21536,'添加成功的相关分支维护反向关联');
e('machineRemoveFlow','INVOKES_VIRTUAL_CONTRACT','flowSetMachine',machine,21561,21649,'移除前按分支清空批次设备关联');
e('recipeParameters','HAS_RULE','parameterOverlayRule',recipe,6428,6528);
e('recipeParameters','CALLS','defaultItems',recipe,6428,6528);
e('recipeParameters','CALLS','specificItems',recipe,6428,6528);
for(const [id,a,b] of [['recipeForLot',4599,4876],['settingForLot',5677,5928]]){e(id,'HAS_RULE','lotRecipeInhibitRule',recipe,a,b);e(id,'INVOKES_VIRTUAL_CONTRACT','inhibitForEntities',recipe,a,b,'配置值1、非空资源匹配分支');e(id,'INVOKES_VIRTUAL_CONTRACT','lotException',recipe,a,b,'逐条返回限制查找该 Lot 例外');}
e('inhibitForEntities','CALLS','inhibitQuery','poscimfw/penmg/peninmg.cpp',2373,2422,'输入实体非空');
n('inhibitByKey','Method','PosEntityInhibitManager_i::findEntityInhibitRecordByKey');
e('inhibitQuery','CALLS','inhibitByKey',query,4124,4130,'仅动态 SQL 路径按 key 重新读取记录及完整集合');
e('inhibitQuery','HAS_RULE','inhibitThresholdRule',query,3138,4148,'SQL 字符串存在格式参数疑点，未做运行等价验证');
for(const table of ['FRENTINHBT','FRENTINHBT_ENTTY','FRENTINHBT_SLOTTP']){n(table,'Table',table);e('inhibitQuery','READS',table,query,3138,4148,'动态 SQL 和逐条路径，不是 DDL 外键证明');e('inhibitByKey','READS',table,query,4278,4492,'按主记录 key 组装实体和批次类型集合');}
e('stateInfoDisabled','HAS_RULE','stateInfoDisabledRule','poscimfw/pcdmg/pmstat.cpp',981,1000);
write('deep-reviews.json',reviews);write('deep-facts.json',d);console.log(JSON.stringify({reviews:reviews.records.length,deepNodes:d.nodes.length,deepEdges:d.edges.length}));
