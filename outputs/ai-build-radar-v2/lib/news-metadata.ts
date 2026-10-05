import {getTextPrefix} from './http';

const decode=(value:string)=>value.replace(/&(#(?:x[0-9a-f]+|\d+)|amp|quot|apos|lt|gt|nbsp);/gi,(_match,entity:string)=>{
 const named:Record<string,string>={amp:'&',quot:'"',apos:"'",lt:'<',gt:'>',nbsp:' '};
 if(entity[0]!=='#')return named[entity.toLowerCase()]||' ';
 const code=entity[1].toLowerCase()==='x'?parseInt(entity.slice(2),16):parseInt(entity.slice(1),10);
 return Number.isFinite(code)&&code>0&&code<=0x10ffff?String.fromCodePoint(code):' ';
});
const clean=(value:string)=>decode(value.replace(/<[^>]*>/g,' ')).replace(/\s+/g,' ').trim();
export function shortNewsText(value:string){
 let text=clean(value);
 const clipped=text.search(/\s*(?:\[\s*…\s*\]|\[\s*\.\.\.\s*\]|…)/u);
 if(clipped>=0){
  const before=text.slice(0,clipped).trim(),end=Math.max(before.lastIndexOf('. '),before.lastIndexOf('! '),before.lastIndexOf('? '));
  text=end>=20?before.slice(0,end+1):before;
 }
 if(text.length<=420)return text;
 const prefix=text.slice(0,420),sentence=Math.max(prefix.lastIndexOf('. '),prefix.lastIndexOf('! '),prefix.lastIndexOf('? '));
 return sentence>=100?prefix.slice(0,sentence+1):prefix.slice(0,prefix.lastIndexOf(' '))+'…';
}
export function articleMetadata(html:string){
 const values=new Map<string,string>();
 for(const tag of html.match(/<meta\b[^>]*>/gi)||[]){
  const attrs=new Map<string,string>();
  for(const match of tag.matchAll(/([\w:-]+)\s*=\s*(["'])([\s\S]*?)\2/g))attrs.set(match[1].toLowerCase(),match[3]);
  const key=(attrs.get('name')||attrs.get('property')||'').toLowerCase(),content=clean(attrs.get('content')||'');
  if(key&&content&&!values.has(key))values.set(key,content);
 }
 const description=['description','og:description','twitter:description'].map(key=>values.get(key)||'').find(value=>(value.length>=55||/[\u3400-\u9fff]/u.test(value)&&value.length>=15)&&!/^(a blog post by|read more|subscribe to|sign up)/i.test(value))||'';
 const author=['author','article:author','parsely-author'].map(key=>values.get(key)||'').find(value=>value.length>=2&&value.length<=160&&!/^https?:\/\//i.test(value))||'';
 return {excerpt:shortNewsText(description),author};
}

export async function loadArticleMetadata(url:string,allowedHost:string){
 const parsed=new URL(url);
 if(parsed.protocol!=='https:'||parsed.hostname!==allowedHost||parsed.username||parsed.password||parsed.port)throw new Error('Article host is outside registered publisher');
 return articleMetadata(await getTextPrefix(url,500_000));
}
