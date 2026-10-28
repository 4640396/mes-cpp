import fs from 'node:fs';
import {lexical} from './lexical.mjs';
const [file,pattern='.',mode='outline']=process.argv.slice(2);
if(!file)throw Error('用法: node source-methods.mjs <源码路径> <方法名正则> [outline|body]');
const raw=fs.readFileSync(file,'utf8');
// Mask comments and strings for structural scanning, retaining UTF-16 positions/newlines.
const masked=lexical(raw,{maskStrings:true});
const select=new RegExp(pattern,'i'), lines=(mode==='clean'?lexical(raw):raw).split('\n');
const re=/\b([A-Za-z_]\w*)\s*::\s*(~?[A-Za-z_]\w*)\s*\(/g;
let match;
while((match=re.exec(masked))){const id=match[1]+'::'+match[2];if(!select.test(id))continue;let p=re.lastIndex,depth=1;while(depth&&p<masked.length){if(masked[p]==='(')depth++;if(masked[p]===')')depth--;p++;}while(/\s/.test(masked[p]||'')&&p<masked.length)p++;if(masked[p]!== '{')continue;const body=p;depth=1;p++;while(depth&&p<masked.length){if(masked[p]==='{')depth++;if(masked[p]==='}')depth--;p++;}const a=raw.slice(0,match.index).split('\n').length,b=raw.slice(0,p).split('\n').length;console.log(`${file}:${a}-${b} ${id}`);for(let i=a-1;i<b;i++){const row=lines[i].replace(/\r$/,'');if(mode==='body'||mode==='clean'&&row.trim()&&!/SPFW_(TRACE|METHODTRACE)/.test(row)||(/\b(if|else|throw|return)\b|SET_|GET_|->|\.add\(|\.remove\(|\.sort\(/.test(row)&&!/^\s*\/\//.test(row)&&!/SPFW_(TRACE|METHODTRACE)/.test(row)))console.log(`${i+1}: ${row}`);}re.lastIndex=p;}
