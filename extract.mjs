import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {lexical} from './lexical.mjs';
import {embeddedSQL,sqlTables} from './embedded-sql.mjs';
const root=path.resolve('fw_cpp_sqx'), out=path.resolve('analysis/mes-cpp');
fs.mkdirSync(out,{recursive:true});
const files=[];
function walk(p){for(const e of fs.readdirSync(p,{withFileTypes:true})){const f=path.join(p,e.name);if(e.isDirectory())walk(f);else files.push(f);}}
walk(root);
// Preserve line numbers while excluding comments; strings remain intact.
const uncomment=t=>lexical(t);
const inventory=[],sql=[],includes=[]; const names=new Map();
for(const f of files){const base=path.basename(f).toLowerCase();if(!names.has(base))names.set(base,[]);names.get(base).push(path.relative(root,f).replaceAll('\\','/'));}
for(const f of files){const bytes=fs.readFileSync(f), rel=path.relative(root,f).replaceAll('\\','/'), ext=path.extname(f).toLowerCase();inventory.push({path:rel,module:rel.split('/')[0],extension:ext,bytes:bytes.length,sha256:crypto.createHash('sha256').update(bytes).digest('hex')});if(!['.cpp','.hpp','.h','.sqx','.idl'].includes(ext))continue;
const text=uncomment(bytes.toString('utf8'));const lineAt=i=>text.slice(0,i).split('\n').length;
for(const m of text.matchAll(/^\s*#\s*include\s*([<"])([^>"\r\n]+)[>"]/gm)){const target=m[2]; includes.push({file:rel,line:lineAt(m.index),target,kind:m[1]==='"'?'quoted':'system',candidates:names.get(path.basename(target).toLowerCase())||[]});}
for(const m of embeddedSQL(bytes.toString('utf8'))){
 const stmt=m.statement;let op=stmt.match(/^(SELECT|INSERT|UPDATE|DELETE|MERGE)\b/i)?.[1]?.toUpperCase();if(!op&&/^DECLARE\b[\s\S]*?\bCURSOR\s+FOR\s+SELECT\b/i.test(stmt))op='CURSOR_SELECT';if(!op)continue;
 const tables=sqlTables(stmt);
 sql.push({file:rel,line:lineAt(m.index),operation:op,tables,symbolicTables:tables.filter(t=>t.includes('#')),terminated:m.terminated,statement:stmt.replace(/\s+/g,' ').trim()});}}
const modules={};for(const f of inventory){const m=modules[f.module]??={files:0,bytes:0,extensions:{}};m.files++;m.bytes+=f.bytes;m.extensions[f.extension]=(m.extensions[f.extension]||0)+1;}
const missing=[...new Set(includes.filter(i=>i.kind==='quoted'&&!i.candidates.length).map(i=>i.target))].sort();
for(const [name,data] of Object.entries({'inventory.json':{root,generatedAt:new Date().toISOString(),modules,files:inventory},'sql-index.json':sql,'include-index.json':includes,'missing-includes.json':missing}))fs.writeFileSync(path.join(out,name),JSON.stringify(data,null,2));
const rows=Object.entries(modules).map(([k,v])=>`| ${k} | ${v.files} | ${Object.entries(v.extensions).map(([x,n])=>`${x||'(无扩展名)'}: ${n}`).join(', ')} |`).join('\n');
fs.writeFileSync(path.join(out,'inventory.md'),`# 源码盘点\n\n扫描根目录：${root}\n\n| 模块 | 文件数 | 类型 |\n|---|---:|---|\n${rows}\n\n共 ${inventory.length} 个文件；提取 ${sql.length} 条嵌入式 SQL 操作候选；${missing.length} 个引号 include 目标在扫描目录内无同名文件。\n\nSQL 索引使用去注释后的文本匹配，不是 SQL/C++ 语义解析。未计算预处理分支，包含条件编译候选；不覆盖动态 SQL、逗号连接的完整表清单、宏展开或所有方言。include 同名候选不代表编译器实际解析结果。不得据此认定运行调用链、事务提交或数据库外键。文件 SHA-256 保存在 inventory.json，用于核对本地源码快照。\n`);
console.log(JSON.stringify({files:inventory.length,modules,sqlStatements:sql.length,uniqueTables:new Set(sql.flatMap(x=>x.tables)).size,missingQuotedIncludes:missing.length},null,2));
