import {lexical} from './lexical.mjs';
// SQL terminators must be outside strings and SQL -- comments; source offsets stay intact.
export function embeddedSQL(raw){
 const text=lexical(raw),visible=lexical(raw,{maskStrings:true}),re=/\bEXEC\s+SQL\b/gi,results=[];let m;
 while((m=re.exec(visible))){let p=re.lastIndex,quote=null,statement='';
  for(;p<text.length;p++){const ch=text[p];if(quote){statement+=ch;if(ch===quote){if(text[p+1]===quote)statement+=text[++p];else quote=null;}continue;}
   if(ch==='\''||ch==='"'){quote=ch;statement+=ch;continue;}if(ch==='-'&&text[p+1]==='-'){while(p<text.length&&text[p]!=='\n')p++;statement+='\n';continue;}if(ch===';')break;statement+=ch;
  }
  if(p===text.length){results.push({index:m.index,statement:statement.trim(),terminated:false});break;}
  results.push({index:m.index,statement:statement.trim(),terminated:true});re.lastIndex=p+1;
 }
 return results;
}
const reserved=new Set(['SET','WITH','SELECT','TABLE','FINAL','OLD','NEW','WHERE','VALUES','LATERAL','ONLY']);
export function sqlTables(statement){
 const clean=statement.replace(/'(?:''|[^'])*'/g,"''"),tokens=[...clean.matchAll(/[#A-Za-z_][\w$#]*(?:\.[#A-Za-z_][\w$#]*)?|[(),]/g)].map(m=>m[0].toUpperCase()),tables=new Set(),contexts=new Map();let depth=0;
 const add=t=>{if(t&&/^[#A-Z_]/.test(t)&&!reserved.has(t))tables.add(t);};
 for(let i=0;i<tokens.length;i++){const token=tokens[i];if(token==='('){if(contexts.get(depth)?.expect)contexts.get(depth).expect=false;depth++;continue;}if(token===')'){contexts.delete(depth);depth--;continue;}
  if(token==='FROM'){contexts.set(depth,{expect:true});continue;}
  if(['WHERE','GROUP','HAVING','ORDER','UNION','EXCEPT','INTERSECT','FOR','FETCH','OFFSET'].includes(token)){contexts.delete(depth);continue;}
  if(token==='JOIN'){contexts.set(depth,{expect:true});continue;}
  const context=contexts.get(depth);if(context&&token===','){context.expect=true;continue;}if(context?.expect){add(token);context.expect=false;}
 }
 const write=clean.match(/^(?:INSERT\s+INTO|UPDATE|DELETE\s+FROM|MERGE\s+INTO)\s+([#A-Za-z_][\w$#]*(?:\.[#A-Za-z_][\w$#]*)?)/i)?.[1]?.toUpperCase();add(write);
 if(/^MERGE\b/i.test(clean))add(clean.match(/\bUSING\s+([#A-Za-z_][\w$#]*(?:\.[#A-Za-z_][\w$#]*)?)/i)?.[1]?.toUpperCase());
 return [...tables];
}
