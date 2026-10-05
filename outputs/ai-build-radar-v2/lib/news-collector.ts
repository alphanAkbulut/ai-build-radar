import {spawn} from 'node:child_process';
import path from 'node:path';
import {z} from 'zod';
import feeds from '../content/news-feeds.json';
import {getText} from './http';
import {canonicalize,stableId} from './identity';
import {loadArticleMetadata,shortNewsText} from './news-metadata';
import type {NewsEvent,NewsReference,Run,Store} from './schema';

const parsedFeed=z.object({fetched:z.number(),articles:z.array(z.object({title:z.string(),url:z.url(),publishedAt:z.string(),excerpt:z.string().optional(),author:z.string().optional(),references:z.array(z.object({url:z.url(),label:z.string()})).optional()}))});
const AI_TITLE=/\b(?:AI|LLM|GPT|Claude|Gemini|DeepSeek|ChatGPT|OpenAI|Anthropic|agent|machine learning|neural|model|robot|chip)\b|人工智能|大模型|智能体|机器人|芯片|模型/i;

export function parseNewsFeed(xml:string):Promise<z.infer<typeof parsedFeed>>{
 return new Promise((resolve,reject)=>{
  const child=spawn('python3',[path.join(process.cwd(),'scripts/news_feed.py')],{stdio:['pipe','pipe','pipe']});
  let output='',error='';const timer=setTimeout(()=>child.kill(),15000);
  child.stdout.on('data',chunk=>output+=chunk);child.stderr.on('data',chunk=>error+=chunk);
  child.on('error',reject);child.stdin.on('error',()=>{});
  child.on('close',code=>{clearTimeout(timer);if(code!==0){reject(new Error('News feed parser failed: '+error.slice(-300)));return;}try{resolve(parsedFeed.parse(JSON.parse(output)));}catch(e){reject(e);}});
  child.stdin.end(xml);
 });
}

export function ingestNewsArticles(store:Store,run:Run,articles:z.infer<typeof parsedFeed>['articles'],sourceId:string,topicGate:boolean,now=new Date().toISOString()){
 const nowMs=Date.parse(now),events=store.newsEvents??(store.newsEvents=[]);
 for(const article of articles){
  const published=Date.parse(article.publishedAt),url=canonicalize(article.url);
  if(!url||!Number.isFinite(published)){run.invalid++;continue;}
  if(published>nowMs||nowMs-published>7*86400000||(topicGate&&!AI_TITLE.test(article.title))){run.filtered++;continue;}
  run.accepted++;
  const references=normalizeNewsReferences(article.references||[],url);
  const id=stableId('news',url),previous=events.find(event=>event.id===id);
  const rssExcerpt=shortNewsText(article.excerpt||''),rssAuthor=(article.author||'').trim().slice(0,160);
  const excerpt=rssExcerpt||previous?.excerpt||'',author=rssAuthor||previous?.author||'';
  if(previous){
   const unchanged=previous.title===article.title&&(previous.excerpt||'')===excerpt&&(previous.author||'')===author&&JSON.stringify(previous.references||[])===JSON.stringify(references);
   previous.lastSeenAt=now;previous.title=article.title;previous.excerpt=excerpt;previous.references=references;
   previous.author=author;previous.excerptSource=rssExcerpt?'rss':previous.excerptSource;
   run.matched++;if(unchanged)run.unchanged++;continue;
  }
  events.push({id,sourceId,title:article.title,url,publishedAt:new Date(published).toISOString(),firstSeenAt:now,lastSeenAt:now,excerpt,excerptSource:rssExcerpt?'rss':undefined,author,references});run.created++;
 }
}

function normalizeNewsReferences(references:NewsReference[],articleUrl:string):NewsReference[]{
 const seen=new Set<string>(),out:NewsReference[]=[];
 for(const reference of references){
  const url=canonicalize(reference.url);
  if(!url||url===articleUrl||seen.has(url))continue;
  seen.add(url);out.push({url,label:reference.label.trim().slice(0,160)});
  if(out.length===12)break;
 }
 return out;
}

export function linkedNewsBuilds(event:NewsEvent,store:Store){
 const urls=new Set((event.references||[]).map(reference=>canonicalize(reference.url)).filter(Boolean));
 return store.builds.filter(build=>[build.canonicalUrl,...build.aliases].some(alias=>urls.has(canonicalize(alias))));
}

export async function enrichNewsMetadata(store:Store,sourceId:string,allowedHost:string,now=new Date().toISOString(),load=loadArticleMetadata,limit=12){
 const queue=(store.newsEvents||[]).filter(event=>event.sourceId===sourceId&&Date.parse(now)-Date.parse(event.publishedAt)<=7*86400000&&(!event.excerpt||!event.author)&&(!event.metadataCheckedAt||event.metadataError&&Date.parse(now)-Date.parse(event.metadataCheckedAt)>86400000)).sort((a,b)=>b.publishedAt.localeCompare(a.publishedAt)).slice(0,limit);
 for(let offset=0;offset<queue.length;offset+=4)await Promise.all(queue.slice(offset,offset+4).map(async event=>{
  try{
   const metadata=await load(event.url,allowedHost);
   if(!event.excerpt&&metadata.excerpt){event.excerpt=metadata.excerpt;event.excerptSource='article-meta';}
   if(!event.author&&metadata.author)event.author=metadata.author;
   event.metadataError=metadata.excerpt||metadata.author?undefined:'Publisher metadata has no useful description or author';
  }catch(error){event.metadataError=error instanceof Error?error.message.slice(0,160):'Metadata unavailable';}
  event.metadataCheckedAt=now;
 }));
}

export async function collectNews(store:Store,run:Run,sourceId:string,now=new Date().toISOString()){
 const feed=feeds.find(row=>'news-'+row.id===sourceId);
 if(!feed)throw new Error('Unknown news source');
 const parsed=await parseNewsFeed(await getText(feed.url));
 run.fetched=parsed.fetched;run.filtered+=parsed.fetched-parsed.articles.length;
 ingestNewsArticles(store,run,parsed.articles,sourceId,feed.topicGate,now);
 await enrichNewsMetadata(store,sourceId,feed.id==='ars-tech'?'arstechnica.com':new URL(feed.url).hostname,now);
}
