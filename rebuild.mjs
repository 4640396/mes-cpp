import {spawnSync} from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';
const cwd=process.cwd();
if(!cwd.replaceAll('\\','/').endsWith('/xmes'))throw Error('请在 xmes 工作区根目录运行');
function run(command,args){const r=spawnSync(command,args,{cwd,stdio:'inherit'});if(r.error)throw r.error;if(r.status!==0)throw Error(command+' 退出码 '+r.status);}
if(process.argv.includes('--doxygen'))run('C:/Program Files/doxygen/bin/doxygen.exe',['analysis/mes-cpp/Doxyfile']);
const stages=['extract','business-map','build-source-graph','build-knowledge','build-semantic-coverage','build-domain-coverage','build-concept-catalog','build-persistence-families','build-catalog','audit-dependencies','sync-metrics','build-report','check-explorer','check-cli','validate'];
for(const file of stages){console.log('运行 '+file);run(process.execPath,[path.join('analysis/mes-cpp',file+'.mjs')]);}
fs.writeFileSync('analysis/mes-cpp/rebuild-state.json',JSON.stringify({passed:true,finishedAt:new Date().toISOString(),stages,doxygenRerun:process.argv.includes('--doxygen')},null,2));
