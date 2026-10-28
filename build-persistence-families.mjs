import fs from 'node:fs';
import crypto from 'node:crypto';
import {lexical} from './lexical.mjs';
const out='analysis/mes-cpp',load=f=>JSON.parse(fs.readFileSync(out+'/'+f)),methods=load('method-index.json').methods,inventory=load('inventory.json'),sql=load('sql-index.json'),reviews=load('deep-reviews.json').records;
const hash=s=>crypto.createHash('sha256').update(s).digest('hex');
const cache=new Map(),snapshot=new Map(inventory.files.map(f=>[f.path,f.sha256]));
const words=new Set('if else for while do switch case default break continue return throw try catch true false const volatile static virtual inline void bool char short int long signed unsigned float double struct class typedef typename template public private protected new delete sizeof namespace using enum union operator this auto extern register mutable friend nullptr'.split(' '));
// A token pattern deliberately loses literal values and identifier names; it is only a navigation candidate.
function fingerprints(s){const tokens=s.match(/"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|[A-Za-z_]\w*|(?:\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)[A-Za-z]*|::|->|==|!=|<=|>=|&&|\|\||\+\+|--|[^\s]/g)||[];const names=new Map();return {tokenHash:hash(JSON.stringify(tokens)),patternHash:hash(JSON.stringify(tokens.map(t=>{if(/^['"]/.test(t))return '<literal>';if(/^[A-Za-z_]\w*$/.test(t)&&!words.has(t)){if(!names.has(t))names.set(t,'id'+names.size);return names.get(t);}return t;}))),tokens:tokens.length};}
const families=new Map();let count=0;
for(const m of methods){const prefix=m.file.match(/(?:^|\/)([CRUK])_/);if(!prefix)continue;count++;
 if(!cache.has(m.file)){const raw=fs.readFileSync('fw_cpp_sqx/'+m.file);if(hash(raw)!==snapshot.get(m.file))throw Error('源码与清单变化 '+m.file);cache.set(m.file,lexical(raw.toString('utf8')).split('\n'));}
 const parts=m.qualified.split('::'),owner=parts.at(-2),name=parts.at(-1),role=owner.startsWith('Writer_')?'Writer':owner.startsWith('Reader_')?'Reader':owner.startsWith('CollectionHelper_')?'CollectionHelper':/_DO_i$/.test(owner)?'DO':'Other';
 const operation=name===owner?'constructor':name==='~'+owner?'destructor':name,key=prefix[1]+':'+role+':'+operation;
 const f=families.get(key)||{id:key,prefix:prefix[1],role,operation,members:[]};
 const statements=sql.filter(s=>s.file===m.file&&s.line>=m.line&&s.line<=m.end_line),review=reviews.find(r=>r.file===m.file&&r.qualified===m.qualified&&r.line===m.line);
 f.members.push({methodId:m.id,file:m.file,qualified:m.qualified,line:m.line,end_line:m.end_line,fileSha256:snapshot.get(m.file),...fingerprints(cache.get(m.file).slice(m.line-1,m.end_line).join('\n')),tables:[...new Set(statements.flatMap(s=>s.tables))],sqlOperations:[...new Set(statements.map(s=>s.operation))],reviewed:!!review,...(review?{report:review.report}:{})});families.set(key,f);
}
const list=[...families.values()].map(f=>({...f,count:f.members.length,reviewedCount:f.members.filter(m=>m.reviewed).length,patterns:new Set(f.members.map(m=>m.patternHash)).size,exactTokenForms:new Set(f.members.map(m=>m.tokenHash)).size})).sort((a,b)=>b.count-a.count||a.id.localeCompare(b.id));
const result={schemaVersion:'persistence-families/0.1',meaning:'按文件名前缀、限定类名角色和操作名分组；不是已验证生成器模板或编译器 AST。patternHash 丢弃字符串值并重命名标识符，仅用于导航，绝不证明语义等价。tokenHash 保留词法字面值和名称。',projectSemanticsComplete:false,totalMethods:count,files:cache.size,familyCount:list.length,reviewedMembers:list.reduce((n,f)=>n+f.reviewedCount,0),families:list};
fs.writeFileSync(out+'/persistence-families.json',JSON.stringify(result));
const rows=list.slice(0,45).map(f=>`| ${f.id} | ${f.count} | ${f.patterns} | ${f.reviewedCount} | ${f.members[0].file}:${f.members[0].line} |`).join('\n');
fs.writeFileSync(out+'/persistence-families.md',`# 生成持久化模板族候选\n\n全量定位 ${count} 个方法，${cache.size} 个文件，${list.length} 个名称族；完整方法体审阅 ${result.reviewedMembers} 个成员。分组没有增加语义已审阅数量。\n\n## 如何使用\n\n1. 按 C/R/U/K 文件名前缀及 Writer/Reader/CollectionHelper/DO 角色定位族。命名代表候选，未还原生成器。\n2. 在 persistence-families.json 中选择不同 patternHash 的代表，逐项阅读分支、SQL 和宏。\n3. patternHash 保留数字，丢弃字符串内容并一致重命名标识符；SQL 表名、字段、错误宏及业务常量可能被掩盖。因此同形方法也必须比较字面值、表/字段映射和宏，不自动继承审阅状态。\n4. tokenHash 对去 C++ 注释后的 token 完整保留名称及字面值，空白变化不影响；不执行预处理。文件哈希与现有源码清单校验。SQL 列表仍是文本候选，动态 SQL 和头文件隐藏逻辑不完整。\n\n## 最大的45个族\n\n| 族 | 方法数 | token模式候选数 | 已完整审阅成员 | 首个定位样本 |\n|---|---|---|---|---|\n${rows}\n\n## 下一批核实重点\n\nCollectionHelper 的 load/checkDirty/save，以及 Writer 的单行/批量插入和更新；随后核对 DO 锁、删除、成员数组绑定。已经读过的 Lot 队列和 LotHold FIFO 只是两个样板，不覆盖所有成员。\n\n索引只覆盖 method-index.json 的定义候选，不能据总数反推整个 C++ 编译单元已完整解析。\n`);
console.log(JSON.stringify({methods:count,files:cache.size,families:list.length,reviewedMembers:result.reviewedMembers,largest:list.slice(0,6).map(f=>({id:f.id,count:f.count,patterns:f.patterns}))}));
