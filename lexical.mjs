// Preserve source offsets and line endings. This is a C++/SQX lexical aid, not a preprocessor.
export function lexical(text,{maskStrings=false}={}){
 const out=text.split('');const blank=i=>{if(out[i]!=='\r'&&out[i]!=='\n')out[i]=' ';};
 let i=0;
 while(i<text.length){
  if(text[i]==='/'&&text[i+1]==='/'){while(i<text.length&&text[i]!=='\n')blank(i++);continue;}
  if(text[i]==='/'&&text[i+1]==='*'){blank(i++);blank(i++);while(i<text.length&&!(text[i]==='*'&&text[i+1]==='/'))blank(i++);if(i<text.length){blank(i++);blank(i++);}continue;}
  if(text[i]==='"'||text[i]==="'"){const quote=text[i];if(maskStrings)blank(i);i++;while(i<text.length){if(text[i]==='\n'||text[i]==='\r')break;const ch=text[i];if(maskStrings)blank(i);i++;if(ch==='\\'&&i<text.length){if(maskStrings)blank(i);i++;continue;}if(ch===quote)break;}continue;}
  i++;
 }
 return out.join('');
}
