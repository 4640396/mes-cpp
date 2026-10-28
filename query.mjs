import fs from 'node:fs';
const [mode='search',...rest]=process.argv.slice(2),graph=JSON.parse(fs.readFileSync('analysis/mes-cpp/source-graph.json')),facts=JSON.parse(fs.readFileSync('analysis/mes-cpp/verified-facts.json'));
const q=rest.join(' ').toLowerCase();
if(!q){console.log('用法: node analysis/mes-cpp/query.mjs search PosLot\n      node analysis/mes-cpp/query.mjs table FRLOT\n      node analysis/mes-cpp/query.mjs facts rework\n所有查询结果区分结构提取、候选与人工核实，不代表运行轨迹。');process.exit(0);}
if(mode==='facts'){const byId=new Map(facts.nodes.map(n=>[n.id,n]));console.log(JSON.stringify(facts.edges.filter(e=>JSON.stringify([byId.get(e.from),e.type,byId.get(e.to),e.condition]).toLowerCase().includes(q)),null,2));}
else if(mode==='table'){const name=q.toUpperCase(),id='table:'+name;const sqlIds=new Set(graph.edges.filter(e=>e.to===id).map(e=>e.from));const statements=graph.nodes.filter(n=>sqlIds.has(n.id));console.log(JSON.stringify({table:name,count:statements.length,statements},null,2));}
else {const matched=graph.nodes.filter(n=>n.label.toLowerCase().includes(q));console.log(JSON.stringify({total:matched.length,shown:Math.min(80,matched.length),nodes:matched.slice(0,80),notice:'文本匹配；完整结果可查 source-graph.json；facts 模式查询人工核实关系。'},null,2));}
