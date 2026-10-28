import fs from 'node:fs';
import crypto from 'node:crypto';
import {lexical} from './lexical.mjs';
const out='analysis/mes-cpp',root='fw_cpp_sqx';
const inventory=JSON.parse(fs.readFileSync(`${out}/inventory.json`)), sql=JSON.parse(fs.readFileSync(`${out}/sql-index.json`)), business=JSON.parse(fs.readFileSync(`${out}/business-map.json`));
const nodes=new Map(),edges=[],methods=[],coverage=[];
const add=(id,type,label,extra={})=>{if(!nodes.has(id))nodes.set(id,{id,type,label,...extra});return id;};
const relate=(from,type,to,sources,extra={})=>edges.push({id:'source-edge-'+(edges.length+1),from,type,to,evidence:'EXTRACTED_TEXT',sources,...extra});
const mask=t=>lexical(t,{maskStrings:true});
for(const f of inventory.files){const file=add('file:'+f.path,'SourceFile',f.path,{sha256:f.sha256}),dir=f.path.split('/').slice(0,-1).join('/');const module=add('module:'+dir,'Module',dir);relate(module,'CONTAINS',file,[{path:f.path,line:1,end_line:1}]);if(!['.cpp','.sqx','.hpp'].includes(f.extension))continue;
const raw=fs.readFileSync(root+'/'+f.path,'utf8'),t=mask(raw),newlines=[-1];for(let i=0;i<t.length;i++)if(t[i]==='\n')newlines.push(i);
const line=i=>{let a=0,b=newlines.length;while(a<b){const m=(a+b)>>1;if(newlines[m]<i)a=m+1;else b=m;}return a;};
const re=/\b([A-Za-z_]\w*)\s*::\s*(~?[A-Za-z_]\w*)\s*\(/g;let m,count=0;
while((m=re.exec(t))){let p=re.lastIndex,depth=1;while(depth&&p<t.length){if(t[p]==='(')depth++;if(t[p]===')')depth--;p++;}while(p<t.length&&/\s/.test(t[p]))p++;if(t[p]!=='{')continue;const start=p;depth=1;p++;while(depth&&p<t.length){if(t[p]==='{')depth++;if(t[p]==='}')depth--;p++;}if(depth)continue;
const a=line(m.index),b=line(p-1),signature=raw.slice(m.index,start).replace(/\s+/g,' ').trim(),qualified=m[1]+'::'+m[2];const id='method:'+f.path+':'+a+':'+crypto.createHash('sha256').update(signature).digest('hex').slice(0,12);
const owner=add('class:'+m[1],'Implementation',m[1],{resolution:'词法限定名，类声明缺失时不保证类型唯一性'});add(id,'Method',qualified,{signature,path:f.path,line:a,end_line:b});const sources=[{path:f.path,line:a,end_line:b}];relate(file,'DEFINES',id,sources);relate(owner,'DECLARES_IMPLEMENTATION',id,sources);methods.push({id,file:f.path,line:a,end_line:b,qualified,signature});count++;re.lastIndex=p;
}coverage.push({file:f.path,definitions:count,mode:'balanced-braces-after-qualified-name',limits:'不覆盖所有模板、尾置返回类型、构造初始化列表、宏生成与自由函数；不是编译器 AST。'});}
for(const i of business.interfaces){const id=add('interface:'+i.name,'Interface',i.name,{path:i.file,line:i.line});relate('file:'+i.file,'DECLARES',id,[{path:i.file,line:i.line,end_line:i.line}]);for(const base of i.bases){const parent=add('interface:'+base,'Interface',base,{declarationMayBeMissing:true});relate(id,'INHERITS',parent,[{path:i.file,line:i.line,end_line:i.line}]);}for(const dir of i.implementationCandidates){const impl=add('class:'+i.name+'_i','Implementation',i.name+'_i');relate(id,'NAME_MATCH',impl,[{path:i.file,line:i.line,end_line:i.line}],{evidence:'NAME_MATCH_CANDIDATE',directory:dir});}}
const declaredNames=new Set(business.interfaces.map(i=>i.name));for(const n of nodes.values())if(n.type==='Interface'&&declaredNames.has(n.label))delete n.declarationMayBeMissing;
const byFile=new Map();for(const m of methods){if(!byFile.has(m.file))byFile.set(m.file,[]);byFile.get(m.file).push(m);}
let attributed=0;
for(let k=0;k<sql.length;k++){const s=sql[k],sid=add('sql:'+s.file+':'+s.line+':'+k,'SQLStatement',s.operation,{path:s.file,line:s.line,operation:s.operation,statement:s.statement});const source=[{path:s.file,line:s.line,end_line:s.line}];relate('file:'+s.file,'CONTAINS_SQL',sid,source);const owners=(byFile.get(s.file)||[]).filter(m=>m.line<=s.line&&m.end_line>=s.line);if(owners.length===1){relate(owners[0].id,'CONTAINS_SQL',sid,source);attributed++;}
for(const table of s.tables){const tid=add('table:'+table,'Table',table);relate(sid,'REFERENCES_TABLE',tid,source,{evidence:'SQL_REFERENCE_CANDIDATE'});}
// Only the immediate write target is classified; SELECT source lists remain candidates.
const target=s.statement.match(/^(?:INSERT\s+INTO|UPDATE|DELETE\s+FROM|MERGE\s+INTO)\s+([#A-Za-z_][\w$#]*(?:\.[#A-Za-z_][\w$#]*)?)/i)?.[1]?.toUpperCase();if(target){const tid=add('table:'+target,'Table',target);relate(sid,'WRITES_TABLE',tid,source,{condition:'静态 SQL 语句目标；未求值条件编译、运行分支与事务；# 名称是预编译符号候选'});}}
const graph={schemaVersion:'source-graph/0.1',scope:root,description:'静态源码结构图，与人工核实业务事实分开；未运行 graphify。',evidenceLevels:{EXTRACTED_TEXT:'源文本直接提取，不保证完整 C++ 语义',NAME_MATCH_CANDIDATE:'IDL 与 _i 名称关联候选',SQL_REFERENCE_CANDIDATE:'SQL 文本表引用候选'},nodes:[...nodes.values()],edges,coverage:{sourceFiles:inventory.files.length,methodDefinitions:methods.length,sqlStatements:sql.length,sqlAttributedToSingleMethod:attributed,limits:['未建立自动 CALLS 边，避免动态派发和同名函数误判','不将目录包含或表引用当作业务因果关系','未执行条件编译、宏展开、SQL schema 验证或运行验证']}};
for(const e of edges)if(!nodes.has(e.from)||!nodes.has(e.to))throw Error('悬空关系 '+e.id);
fs.writeFileSync(out+'/source-graph.json',JSON.stringify(graph));fs.writeFileSync(out+'/method-index.json',JSON.stringify({coverage,methods},null,2));console.log(JSON.stringify({...graph.coverage,nodes:nodes.size,edges:edges.length},null,2));
