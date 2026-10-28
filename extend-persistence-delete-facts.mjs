import fs from 'node:fs';
const out='analysis/mes-cpp',read=f=>JSON.parse(fs.readFileSync(out+'/'+f)),write=(f,d)=>fs.writeFileSync(out+'/'+f,JSON.stringify(d,null,2));
const r=read('deep-reviews.json'),d=read('deep-facts.json'),f=read('persistence-families.json').families.find(f=>f.id==='U:Writer:deleteFrom'),seen=new Set();
const n=(id,type,label)=>{if(!d.nodes.some(x=>x.id===id))d.nodes.push({id,type,label});};
const e=(from,type,to,m,condition)=>{const v={from,type,to,sources:[{path:m.file,line:m.line,end_line:m.end_line}],...(condition?{condition}:{})};if(!d.edges.some(x=>JSON.stringify([x.from,x.type,x.to,x.sources])===JSON.stringify([v.from,v.type,v.to,v.sources])))d.edges.push(v);};
let index=0;for(const m of f.members){if(seen.has(m.patternHash))continue;seen.add(m.patternHash);index++;
 if(!r.records.some(x=>x.file===m.file&&x.qualified===m.qualified&&x.line===m.line))r.records.push({file:m.file,qualified:m.qualified,line:m.line,end_line:m.end_line,status:'body_reviewed_with_external_unknowns',report:'persistence-delete-deep.md',unknowns:['SQL 错误映射宏','父key/表标记/序号输入约束','调用者及事务']});
 const id='persistenceDeleteSample'+index;n(id,'Method',m.qualified+' @'+m.file+':'+m.line);for(const table of m.tables){n(table,'Table',table);e(id,'WRITES',table,m,'七种模式首个完整阅读代表；不自动推广同形成员');}
}
if(index!==7)throw Error('deleteFrom 模式代表发生变化，需重新核实');
r.currentFocus='持久化全量候选分为387名称族；完整阅读 deleteFrom 七种模式代表，区分主对象/平集合/序列/嵌套父键删除，其他成员未自动标记已审阅。接下来追 CollectionHelper 及其差异，再推进其他业务领域。';
write('deep-reviews.json',r);write('deep-facts.json',d);console.log(JSON.stringify({reviews:r.records.length,reviewedRepresentatives:index}));
