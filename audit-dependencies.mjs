import fs from 'node:fs';
import path from 'node:path';
const base=process.cwd(), roots=['fw_cpp_sqx','xmes-framework','xmes-platform'];
const wanted=new Set(['lot.hpp','plot.hpp','lot.idl','mofw.idl','spmacro.hpp','dbmacros.h','pfwgls.hpp']);
const hits=[],archives=[];let count=0;
function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){if(e.isSymbolicLink())continue;const p=path.join(dir,e.name);if(e.isDirectory()){if(['.git','node_modules','target','build','.cimigraph','.idea'].includes(e.name))continue;walk(p);}else{count++;if(wanted.has(e.name.toLowerCase()))hits.push(path.relative(base,p));if(/\.(zip|7z|tar|gz|jar)$/i.test(e.name))archives.push(path.relative(base,p));}}}
for(const r of roots)walk(path.resolve(r));
const report={scope:roots,excludedDirectories:['.git','node_modules','target','build','.cimigraph','.idea'],scannedFiles:count,requested:[...wanted],matches:hits,archiveCandidates:archives,limits:'扫描可见普通文件，不跟随符号链接，不展开归档，不扫描工作区之外的 SDK。未找到不能证明其他位置不存在。'};
fs.writeFileSync('analysis/mes-cpp/dependency-audit.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
