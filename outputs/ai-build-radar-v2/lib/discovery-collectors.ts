import {community} from './community-collectors';
import {spawn} from 'node:child_process';
import path from 'node:path';
import {z} from 'zod';
import people from '../content/people.json';
import {getJson,getText} from './http';
import type {Batch} from './collectors';
import type {Candidate} from './schema';
const reference=z.object({url:z.url(),label:z.string(),article:z.url(),title:z.string(),publishedAt:z.string().nullable()});
export function parseFeed(text:string):Promise<{fetched:number;references:z.infer<typeof reference>[]} >{
 return new Promise((resolve,reject)=>{const child=spawn('python3',[path.join(process.cwd(),'scripts/discovery_feed.py')],{stdio:['pipe','pipe','pipe']});let output='',error='';const timer=setTimeout(()=>child.kill(),10000);child.stdout.on('data',b=>output+=b);child.stderr.on('data',b=>error+=b);child.on('error',reject);child.stdin.on('error',()=>{});child.on('close',code=>{clearTimeout(timer);if(code!==0){reject(new Error('Feed parser failed: '+error.slice(-300)));return;}try{resolve(z.object({fetched:z.number(),references:z.array(reference)}).parse(JSON.parse(output)));}catch(e){reject(e);}});child.stdin.end(text);});
}
export async function discover(sourceId:string):Promise<Batch>{
 if(['devcommunity','lobsters'].includes(sourceId))return community(sourceId);
 const batch:Batch={candidates:[],fetched:0,filtered:0,invalid:0,errors:[]};
 if(sourceId==='huggingface'){
  const schema=z.array(z.object({id:z.string(),likes:z.number().optional(),lastModified:z.string().optional(),trendingScore:z.number().optional()}));
  const popular=schema.parse(await getJson('https://huggingface.co/api/spaces?sort=likes&direction=-1&limit=30'));
  const trending=schema.parse(await getJson('https://huggingface.co/api/spaces?sort=trendingScore&direction=-1&limit=20'));
  const rows=[...new Map([...popular,...trending].map(r=>[r.id,r])).values()];
  batch.fetched=rows.length;
  for(const r of rows){const url='https://huggingface.co/spaces/'+r.id;batch.candidates.push({recordId:r.id,name:r.id.split('/').at(-1)!,url,aliases:[],description:'Hugging Face üzerinde yayımlanmış etkileşimli demo adayı; çalışma durumu ve AI ile geliştirilmesi henüz doğrulanmadı.',creator:r.id.split('/')[0],category:'uncategorized',publishedAt:null,sourceUrl:url,raw:r,claims:[...(r.trendingScore!==undefined?[{field:'platform_trending',value:String(r.trendingScore),status:'Verified' as const,quote:'Hugging Face trendingScore: '+r.trendingScore,locator:'$.trendingScore',rationale:'Platform-specific trending score; not comparable to votes elsewhere.',strength:1}]:[]),{field:'space_likes',value:String(r.likes||0),status:'Verified',quote:String(r.likes||0),locator:'$.likes',rationale:'Observed total likes, not growth or AI development evidence.',strength:1}]});}
  return batch;
 }
 const person=people.find(p=>'feed-'+p.id===sourceId);if(!person?.feed)throw new Error('Unknown discovery source');
 const parsed=await parseFeed(await getText(person.feed));batch.fetched=parsed.fetched;
 for(const r of parsed.references){const c:Candidate={recordId:r.article+'#'+r.url,name:r.url.split('/').at(-1)!,url:r.url,aliases:[],description:`${person.name} yayınında bağlantısı geçen aday. Yazı: ${r.title}. Bağlantı verilmesi övgü veya AI ile geliştirme kanıtı değildir.`,creator:null,category:'uncategorized',publishedAt:r.publishedAt,sourceUrl:r.article,raw:r,claims:[{field:'editorial_reference',value:r.article,status:'Verified',quote:r.label||r.url,locator:'feed article hyperlink',rationale:'Explicit project link in feed content; not endorsement, authorship or AI development evidence.',strength:.8}]};batch.candidates.push(c);}
 return batch;
}
