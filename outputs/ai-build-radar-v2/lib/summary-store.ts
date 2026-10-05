import {readFile,writeFile,mkdir,rename,unlink} from 'node:fs/promises';
import {createHash,randomUUID} from 'node:crypto';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import path from 'node:path';
import {summaryOutput,type ArticleSummary,type SummaryLanguage} from './summary-contract';
import {generateSummary,summaryProviderReady} from './summary-provider';
import type {FeedEntry} from './people';
const root=path.join(process.cwd(),'learning-data/summaries');const run=promisify(execFile);
export async function cachedSummary(entry:FeedEntry,language:SummaryLanguage):Promise<ArticleSummary|null>{try{const s=JSON.parse(await readFile(path.join(root,entry.id+'-'+language+'.json'),'utf8')) as ArticleSummary;return s.version===1&&s.sourceUrl===entry.url&&s.language===language&&Date.now()-Date.parse(s.createdAt)<86400000?s:null;}catch{return null;}}
export async function summarize(entry:FeedEntry,language:SummaryLanguage){
 const cached=await cachedSummary(entry,language);if(cached)return cached;
 if(!summaryProviderReady())throw new Error('NOT_CONFIGURED');
 await mkdir(root,{recursive:true});const lock=path.join(root,'generation.lock');
 // One cross-process generation at a time; stale locks fail closed until inspected.
 try{await writeFile(lock,new Date().toISOString(),{flag:'wx'});}catch{throw new Error('BUSY');}
 try{
  const found=await cachedSummary(entry,language);if(found)return found;
  let result;try{result=await run('python3',[path.join(process.cwd(),'scripts/summary_source.py'),entry.personId,entry.url],{timeout:20000,maxBuffer:200000});}catch{throw new Error('SOURCE_UNAVAILABLE');}
  const source=JSON.parse(result.stdout) as {text:string;coverage:string};const hash=createHash('sha256').update(source.text).digest('hex');
  const file=path.join(root,entry.id+'-'+language+'.json');
  try{const old=JSON.parse(await readFile(file,'utf8')) as ArticleSummary;if(old.sourceHash===hash&&old.version===1&&old.language===language&&old.sourceUrl===entry.url){old.createdAt=new Date().toISOString();await writeFile(file,JSON.stringify(old));return old;}}catch{}
  const quota=path.join(root,'quota-'+new Date().toISOString().slice(0,10)+'.json');let count=0;try{count=JSON.parse(await readFile(quota,'utf8')).count;}catch(e){if((e as NodeJS.ErrnoException).code!=='ENOENT')throw e;}
  if(!Number.isInteger(count)||count>=10)throw new Error('LIMIT');await writeFile(quota,JSON.stringify({count:count+1}));
  const output=summaryOutput.parse(await generateSummary(source.text,language));
  const summary:ArticleSummary={...output,language,sourceUrl:entry.url,sourceHash:hash,coverage:source.coverage,createdAt:new Date().toISOString(),version:1};
  const temp=file+'.'+randomUUID()+'.tmp';await writeFile(temp,JSON.stringify(summary));await rename(temp,file);return summary;
 }finally{await unlink(lock);}
}
