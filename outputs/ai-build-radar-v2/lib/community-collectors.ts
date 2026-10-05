import {z} from 'zod';
import {getJson} from './http';
import type {Batch} from './collectors';
export function projectLinks(text:string){return [...new Set(text.match(/https:\/\/github\.com\/[\w.-]+\/[\w.-]+/g)||[])].filter(u=>!/^https:\/\/github.com\/(topics|features|orgs|settings|sponsors)\//.test(u));}
export async function community(sourceId:string):Promise<Batch>{
 const batch:Batch={candidates:[],fetched:0,filtered:0,invalid:0,errors:[]};
 if(sourceId==='lobsters'){
 const rows=z.array(z.object({short_id:z.string(),title:z.string(),url:z.string(),score:z.number(),comment_count:z.number(),comments_url:z.url(),created_at:z.string(),tags:z.array(z.string())})).parse(await getJson('https://lobste.rs/hottest.json'));
 batch.fetched=rows.length;
 for(const r of rows){if(!r.tags.some(t=>['ai','ml','show','release','web','graphics'].includes(t))){batch.filtered++;continue;}let u;try{u=new URL(r.url);}catch{batch.filtered++;continue;}if(u.protocol!=='https:'){batch.filtered++;continue;}
 batch.candidates.push({recordId:r.short_id,name:r.title,url:u.href,aliases:[],description:r.title,creator:null,category:'uncategorized',publishedAt:r.created_at,sourceUrl:r.comments_url,raw:r,claims:[{field:'community_discussion',value:r.comments_url,status:'Verified',quote:`${r.score} puan · ${r.comment_count} yorum`,locator:'Lobsters API',rationale:'Observed discussion, not endorsement or AI-development proof.',strength:.8}]});}
 }else{
 const rows=z.array(z.object({id:z.number(),url:z.url(),title:z.string(),published_timestamp:z.string(),public_reactions_count:z.number(),comments_count:z.number()})).parse(await getJson('https://dev.to/api/articles?tag=ai&top=7&per_page=20'));batch.fetched=rows.length;
 for(const r of rows){try{const article=z.object({body_html:z.string()}).parse(await getJson('https://dev.to/api/articles/'+r.id));const links=projectLinks(article.body_html);if(!links.length)batch.filtered++;for(const url of links)batch.candidates.push({recordId:r.id+'#'+url,name:url.split('/').at(-1)!,url,aliases:[],description:`DEV Community yazısında bağlantısı geçen proje: ${r.title}`,creator:null,category:'uncategorized',publishedAt:r.published_timestamp,sourceUrl:r.url,raw:{...r,url},claims:[{field:'editorial_reference',value:r.url,status:'Verified',quote:r.title,locator:'article body hyperlink',rationale:'Project mentioned in article; reactions apply to article, not project.',strength:.7},{field:'article_reactions',value:String(r.public_reactions_count),status:'Verified',quote:`${r.public_reactions_count} tepki · ${r.comments_count} yorum`,locator:'DEV API',rationale:'Article-level engagement, not product rating.',strength:.8}]});}catch(e){batch.errors.push(String(e));}}
 }return batch;
}
