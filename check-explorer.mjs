import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import crypto from 'node:crypto';
const out='analysis/mes-cpp',html=fs.readFileSync(out+'/explorer.html','utf8'),script=html.match(/<script>([\s\S]*)<\/script>/)?.[1];if(!script)throw Error('查询页缺少脚本');
class Element{constructor(id){this.id=id;this.value='';this.dataset={};this.innerHTML='';this.textContent='';this.listeners={};this.children=[];this.attributes={};}addEventListener(name,cb){this.listeners[name]=cb;}append(e){this.children.push(e);}setAttribute(k,v){this.attributes[k]=v;}fire(name){this.listeners[name]?.({target:this});}}
const elements=new Map([...html.matchAll(/\bid="([^"]+)"/g)].map(m=>[m[1],new Element(m[1])]));
const buttons=[...html.matchAll(/<button data-mode="([^"]+)"/g)].map(m=>{const e=new Element(m[1]);e.dataset.mode=m[1];return e;});
let jumps=[];const document={querySelector(selector){const e=elements.get(selector.slice(1));if(!e)throw Error('不存在控件 '+selector);return e;},querySelectorAll(selector){if(selector==='[data-mode]')return buttons;if(selector==='.nodejump'){jumps=[...elements.get('neighbors').innerHTML.matchAll(/class="nodejump" data-id="([^"]+)"/g)].map(m=>{const e=new Element(m[1]);e.dataset.id=m[1];return e;});return jumps;}throw Error('未覆盖的 DOM 选择器 '+selector);},createElement(){return new Element('created');}};
const context=vm.createContext({document,setTimeout:cb=>{cb();return 1;},clearTimeout:()=>{},console});new vm.Script(script,{filename:'generated-explorer.js'}).runInContext(context,{timeout:15000});
const checks=[];function check(ok,label){checks.push({label,passed:Boolean(ok)});if(!ok)throw Error(label);}
const search=value=>{elements.get('query').value=value;elements.get('query').fire('input');};
const expectedMethods=JSON.parse(fs.readFileSync(out+'/method-index.json')).methods.length;check(elements.get('count').textContent.includes(String(expectedMethods)),'初始化查询结果数量');
search('PosWhatNextFIFO_i');check(elements.get('results').innerHTML.includes('dispatchFor_inSQL')&&elements.get('results').innerHTML.includes('pwtfifodb'),'方法搜索命中普通 FIFO 的 SQX 实现');
buttons.find(b=>b.dataset.mode==='tables').fire('click');search('FRLOT');check(elements.get('results').innerHTML.includes('方法文本归属')&&elements.get('results').innerHTML.includes('FRLOT'),'按表反查展示 SQL 和归属方法');
buttons.find(b=>b.dataset.mode==='facts').fire('click');search('recipeSelect');check(elements.get('results').innerHTML.includes('4423')&&elements.get('results').innerHTML.includes('PosMachineRecipe_i::isUsedBy'),'业务事实搜索返回配方适用调用和来源');
const select=elements.get('concept');select.value='recipeSelect';select.fire('change');check(jumps.some(j=>j.dataset.id==='recipeApplicable'),'实体邻域包含实际相邻关系');jumps.find(j=>j.dataset.id==='recipeApplicable').fire('click');check(select.value==='recipeApplicable'&&elements.get('neighbors').innerHTML.includes('PosMachineRecipe_i::isUsedBy'),'邻域端点跳转更新当前实体');
search('__不存在的实体__');check(elements.get('count').textContent.includes('0'),'无匹配搜索结果');
const generated=[elements.get('results').innerHTML,elements.get('neighbors').innerHTML].join('');check([...generated.matchAll(/href="([^"]+)"/g)].every(m=>fs.existsSync(path.resolve(out,m[1].split('#')[0]))),'已测试动态结果中的源码链接存在');
const receipt={passed:true,htmlSha256:crypto.createHash('sha256').update(html).digest('hex'),mode:'generated-script-with-minimal-DOM-harness',checks,limits:'执行生成页面的真实脚本与交互回调；使用模拟 DOM，不是实际浏览器视觉或兼容性验证。浏览器控制工具的 file URL 策略阻止了现场 UI 检查。'};fs.writeFileSync(out+'/explorer-check.json',JSON.stringify(receipt,null,2));console.log(JSON.stringify(receipt,null,2));
