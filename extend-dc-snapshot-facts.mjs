import fs from 'node:fs';
const out='analysis/mes-cpp',read=f=>JSON.parse(fs.readFileSync(out+'/'+f)),write=(f,d)=>fs.writeFileSync(out+'/'+f,JSON.stringify(d,null,2));
const r=read('deep-reviews.json'),m=read('method-index.json').methods,d=read('deep-facts.json'),file='poscimfw/ppcdf/ppcope.cpp';
const names=['setAssignedDCDef','getAssignedDCDef','setAssignedDCSpec','getAssignedDCSpec','setDataCollectionInfo','setActualStartInfo','getActualStartInfo','setAssignedDataCollectionItemInfo','getAssignedDataCollectionItemInfo'];
for(const name of names){const qualified='PosProcessOperation_i::'+name,mm=m.filter(x=>x.file===file&&x.qualified===qualified);if(mm.length!==1)throw Error('方法不唯一 '+qualified);const v=mm[0];if(!r.records.some(x=>x.file===file&&x.qualified===qualified&&x.line===v.line))r.records.push({file,qualified,line:v.line,end_line:v.end_line,status:'body_reviewed_with_external_unknowns',report:'dc-snapshot-deep.md',unknowns:['对象引用及 dirty 宏','快照上层组装和刷新','setLotPO 数据库维护及事务回滚']});}
r.currentFocus='已追工序采集快照整体赋值、局部项目更新、定义 getter 首项回退及开工引用字段疑点。下一步核实 setLotPO 维护与快照组装，再扩展其他业务领域及持久化模板族。';
const n=(id,type,label)=>{if(!d.nodes.some(x=>x.id===id))d.nodes.push({id,type,label});};
const e=(from,type,to,line,end_line,condition)=>{const v={from,type,to,sources:[{path:file,line,end_line}],...(condition?{condition}:{})};if(!d.edges.some(x=>JSON.stringify([x.from,x.type,x.to,x.sources])===JSON.stringify([v.from,v.type,v.to,v.sources])))d.edges.push(v);};
for(const [id,name] of Object.entries({operationGetDCDef:'getAssignedDCDef',operationSetDCDef:'setAssignedDCDef',operationSetDCInfo:'setDataCollectionInfo',operationSetStartInfo:'setActualStartInfo',operationGetStartInfo:'getActualStartInfo',operationSetDCItems:'setAssignedDataCollectionItemInfo',operationGetDCItems:'getAssignedDataCollectionItemInfo'}))n(id,'Method','PosProcessOperation_i::'+name);
n('dcDefinitionGetterRule','Rule','定义 getter 按已分配采集列表第0项查定义，不读取 setter 写入的独立字段');
n('dcSnapshotRule','Rule','开工和采集信息 setter 保存调用者提供的快照，本方法未重新构建最新规格限值');
n('dcItemsUpdateRule','Rule','局部更新仅替换首个匹配定义的 dcItems，未匹配不追加也不显式抛错，不刷新规格');
e('operationGetDCDef','HAS_RULE','dcDefinitionGetterRule',2554,2605);e('operationSetStartInfo','HAS_RULE','dcSnapshotRule',6506,6672);e('operationSetDCInfo','HAS_RULE','dcSnapshotRule',6841,6848);e('operationSetDCItems','HAS_RULE','dcItemsUpdateRule',17114,17134);
for(const [id,a,b] of [['operationGetDCDef',2569,2595],['operationGetStartInfo',6791,6795],['operationGetDCItems',17184,17199]])e(id,'READS_COLLECTION','operationDCCollection',a,b);
e('operationSetDCInfo','REPLACES_COLLECTION','operationDCCollection',6846,6848);e('operationSetStartInfo','REPLACES_COLLECTION','operationDCCollection',6506,6672);e('operationSetDCItems','REPLACES_COLLECTION','operationDCCollection',17114,17132,'仅匹配的定义替换 dcItems，其他条目复制保留');
e('operationCollectedByWafer','CALLS','operationGetDCDef',7086,7089,'输入定义引用 nil');
write('deep-reviews.json',r);write('deep-facts.json',d);console.log(JSON.stringify({reviews:r.records.length,deepEdges:d.edges.length}));
