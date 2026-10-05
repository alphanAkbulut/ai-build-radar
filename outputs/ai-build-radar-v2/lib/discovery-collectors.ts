import {community} from './community-collectors';
import {spawn} from 'node:child_process';
import path from 'node:path';
import {z} from 'zod';
import people from '../content/people.json';
import publications from '../content/publications.json';
import {getJson,getText} from './http';
import type {Batch} from './collectors';
import type {Candidate} from './schema';
const reference=z.object({url:z.url(),label:z.string(),article:z.url(),title:z.string(),publishedAt:z.string().nullable()});
const space=z.object({id:z.string(),likes:z.number().optional(),lastModified:z.string().optional(),trendingScore:z.number().optional()});
export function huggingFaceCandidates(popularInput:unknown,trendingInput:unknown):Batch{
 const popular=z.array(space).parse(popularInput),trending=z.array(space).parse(trendingInput);
 const trendRank=new Map(trending.map((row,index)=>[row.id,index+1]));
 const rows=new Map(popular.map(row=>[row.id,row]));
 for(const row of trending)rows.set(row.id,{...rows.get(row.id),...row});
 const batch:Batch={candidates:[],fetched:rows.size,filtered:0,invalid:0,errors:[]};
 for(const row of rows.values()){
  const rank=trendRank.get(row.id),url='https://huggingface.co/spaces/'+row.id;
  batch.candidates.push({recordId:row.id,name:row.id.split('/').at(-1)!,url,aliases:[],description:'Hugging Face üzerinde yayımlanmış etkileşimli demo adayı; çalışma durumu ve AI ile geliştirilmesi henüz doğrulanmadı.',creator:row.id.split('/')[0],category:'uncategorized',publishedAt:null,sourceUrl:url,raw:{...row,trendRank:rank??null},claims:[...(rank?[{field:'platform_rank',value:String(rank),status:'Verified' as const,quote:`Hugging Face Spaces trend listesi: #${rank}`,locator:'trending list position',rationale:'Observed rank in the top-20 Spaces trend response; not a global popularity rank.',strength:1}]:[]),...(rank&&row.trendingScore!==undefined&&row.trendingScore>0?[{field:'platform_trending',value:String(row.trendingScore),status:'Verified' as const,quote:`Hugging Face trendingScore: ${row.trendingScore}`,locator:'$.trendingScore',rationale:'Only a member of the top-20 trend response receives this platform-specific signal.',strength:1}]:[]),{field:'space_likes',value:String(row.likes||0),status:'Verified',quote:String(row.likes||0),locator:'$.likes',rationale:'Observed total likes, not growth or AI development evidence.',strength:1}]});
 }
 return batch;
}
export function parseFeed(text:string):Promise<{fetched:number;references:z.infer<typeof reference>[]} >{
 return new Promise((resolve,reject)=>{const child=spawn('python3',[path.join(process.cwd(),'scripts/discovery_feed.py')],{stdio:['pipe','pipe','pipe']});let output='',error='';const timer=setTimeout(()=>child.kill(),10000);child.stdout.on('data',b=>output+=b);child.stderr.on('data',b=>error+=b);child.on('error',reject);child.stdin.on('error',()=>{});child.on('close',code=>{clearTimeout(timer);if(code!==0){reject(new Error('Feed parser failed: '+error.slice(-300)));return;}try{resolve(z.object({fetched:z.number(),references:z.array(reference)}).parse(JSON.parse(output)));}catch(e){reject(e);}});child.stdin.end(text);});
}
export function publicationReferenceAllowed(title:string,topicGate:boolean){return !topicGate||/\b(?:AI|LLM|agent|model|prompt|eval|Claude|GPT|Gemini|machine learning)\b/i.test(title);}
export function recentPublicationReference(publishedAt:string|null,now=Date.now()){
 const age=now-Date.parse(publishedAt||'');
 return Number.isFinite(age)&&age>=0&&age<=45*86400000;
}
export async function discover(sourceId:string):Promise<Batch>{
 if(['devcommunity','lobsters'].includes(sourceId))return community(sourceId);
 const batch:Batch={candidates:[],fetched:0,filtered:0,invalid:0,errors:[]};
 if(sourceId==='huggingface'){
  const popular=await getJson('https://huggingface.co/api/spaces?sort=likes&direction=-1&limit=30');
  const trending=await getJson('https://huggingface.co/api/spaces?sort=trendingScore&direction=-1&limit=20');
  return huggingFaceCandidates(popular,trending);
 }
 const person=people.find(p=>'feed-'+p.id===sourceId);
 const publication=publications.find(p=>'publication-'+p.id===sourceId);
 const feed=person?.feed||publication?.url;
 if(!feed)throw new Error('Unknown discovery source');
 const parsed=await parseFeed(await getText(feed));batch.fetched=parsed.fetched;
 const publisher=person?.name||publication!.name;
 for(const r of parsed.references){
  if(publication&&(!recentPublicationReference(r.publishedAt)||!publicationReferenceAllowed(r.title,publication.topicGate))){batch.filtered++;continue;}
  const c:Candidate={recordId:r.article+'#'+r.url,name:r.url.split('/').at(-1)!,url:r.url,aliases:[],description:`${publisher} yayınında bağlantısı geçen aday. Yazı: ${r.title}. Bağlantı verilmesi övgü veya AI ile geliştirme kanıtı değildir.`,creator:null,category:'uncategorized',publishedAt:r.publishedAt,sourceUrl:r.article,raw:r,claims:[{field:'editorial_reference',value:r.article,status:'Verified',quote:r.label||r.url,locator:'feed article hyperlink',rationale:'Explicit project link in feed content; not endorsement, authorship or AI development evidence.',strength:.8}]};batch.candidates.push(c);
 }
 return batch;
}
