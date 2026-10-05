import {spawn} from 'node:child_process';
import path from 'node:path';
import {z} from 'zod';
import feeds from '../content/news-feeds.json';
import {getText} from './http';
import {canonicalize,stableId} from './identity';
import type {Run,Store} from './schema';

const parsedFeed=z.object({fetched:z.number(),articles:z.array(z.object({title:z.string(),url:z.url(),publishedAt:z.string()}))});
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
  const id=stableId('news',url),previous=events.find(event=>event.id===id);
  if(previous){previous.lastSeenAt=now;previous.title=article.title;run.matched++;run.unchanged++;continue;}
  events.push({id,sourceId,title:article.title,url,publishedAt:new Date(published).toISOString(),firstSeenAt:now,lastSeenAt:now});run.created++;
 }
}

export async function collectNews(store:Store,run:Run,sourceId:string,now=new Date().toISOString()){
 const feed=feeds.find(row=>'news-'+row.id===sourceId);
 if(!feed)throw new Error('Unknown news source');
 const parsed=await parseNewsFeed(await getText(feed.url));
 run.fetched=parsed.fetched;run.filtered+=parsed.fetched-parsed.articles.length;
 ingestNewsArticles(store,run,parsed.articles,sourceId,feed.topicGate,now);
}
