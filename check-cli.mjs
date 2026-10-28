import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
const run=(mode,q)=>{const r=spawnSync(process.execPath,['analysis/mes-cpp/query.mjs',mode,q],{encoding:'utf8',maxBuffer:8*1024*1024});if(r.status!==0)throw Error(r.stderr||'CLI 失败');return JSON.parse(r.stdout);};
const method=run('search','PosWhatNextFIFO_i::dispatchFor_inSQL');if(!method.nodes.some(n=>n.path==='poscimfw/pdp/pwtfifodb.sqx'&&n.line===34))throw Error('CLI 方法定位不正确');
const table=run('table','FRLOT');if(!table.statements.some(s=>s.path==='poscimfw/pdp/pwtfifodb.sqx'&&s.line===60))throw Error('CLI 表引用定位不正确');
const facts=run('facts','recipeSelect');if(!facts.some(e=>e.to==='recipeApplicable'&&e.sources.some(s=>s.line===4423)))throw Error('CLI 业务事实查询不正确');
const inhibit=run('facts','inhibitQuery');if(!inhibit.some(e=>e.to==='inhibitByKey'&&e.condition.includes('仅动态 SQL'))||!inhibit.some(e=>e.to==='FRENTINHBT_SLOTTP'))throw Error('CLI 限制查询路径与集合表关系缺失');
const receipt={passed:true,commands:[{mode:'search',q:'PosWhatNextFIFO_i::dispatchFor_inSQL',matches:method.total},{mode:'table',q:'FRLOT',statements:table.count},{mode:'facts',q:'recipeSelect',relations:facts.length},{mode:'facts',q:'inhibitQuery',relations:inhibit.length}]};fs.writeFileSync('analysis/mes-cpp/cli-check.json',JSON.stringify(receipt,null,2));console.log(JSON.stringify(receipt));
