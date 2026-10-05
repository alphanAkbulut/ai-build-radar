import {z} from 'zod';
import {githubCandidate,type Batch} from './collectors';
import {FetchError,getJson} from './http';
import type {Candidate,Claim} from './schema';

const PAGE_REPOS='https://github.com/trending';
const PAGE_DEVELOPERS='https://github.com/trending/developers';
const repoPath=/^\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/;
const aiTerms=/\b(?:ai|llms?|gpt|claude|codex|cursor|agentic|agents?|openai|anthropic|deepseek|qwen|gemini|neural|machine learning|artificial intelligence|text-to-[a-z]+|diffusion)\b/i;
const repoResponse=z.object({id:z.number(),html_url:z.url()});
export type TrendingLead={repo:string;rank:number;description:string;starsToday:number|null;page:'repositories'|'developers'};
const plain=(html:string)=>html.replace(/<[^>]*>/g,' ').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#(?:39|x27);/gi,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/\s+/g,' ').trim();
const blocks=(html:string)=>html.split(/<article class="Box-row(?: d-flex)?"[^>]*>/).slice(1);
export function parseGitHubTrending(html:string,page:TrendingLead['page']):TrendingLead[]{
 const rows=blocks(html);
 if(!rows.length)throw new Error(`GitHub Trending ${page} layout missing; no empty success`);
 const leads:TrendingLead[]=[];
 for(const [index,row] of rows.entries()){
  const path=page==='repositories'
   ?row.match(/<h2\b[^>]*>[\s\S]*?<a\b[^>]*\bhref="(\/[^"]+)"/)?.[1]
   :row.match(/data-ga-click="Explore, go to repository, location:trending developers"[^>]*\bhref="(\/[^"]+)"/)?.[1];
  if(!path||!repoPath.test(path))continue;
  const description=page==='repositories'
   ?plain(row.match(/<p class="col-9[^\"]*"[^>]*>([\s\S]*?)<\/p>/)?.[1]||'')
   :plain(row.match(/Popular repo[\s\S]*?<div class="f6 color-fg-muted mt-1"[^>]*>([\s\S]*?)<\/div>/)?.[1]||'');
  const daily=page==='repositories'?row.match(/([\d,]+)\s+stars today/)?.[1]:undefined;
  leads.push({repo:path.slice(1),rank:index+1,description,starsToday:daily?Number(daily.replaceAll(',','')):null,page});
 }
 if(page==='repositories'&&!leads.length)throw new Error('GitHub Trending repository links missing; layout may have changed');
 return leads;
}
export function relevantTrendingLeads(repos:TrendingLead[],developers:TrendingLead[]){
 const selected=[...repos.filter(row=>aiTerms.test(`${row.repo} ${row.description}`)).slice(0,10),...developers.filter(row=>aiTerms.test(`${row.repo} ${row.description}`)).slice(0,6)];
 return selected.filter((row,index)=>selected.findIndex(other=>other.repo.toLowerCase()===row.repo.toLowerCase()&&other.page===row.page)===index);
}
async function htmlPage(url:typeof PAGE_REPOS|typeof PAGE_DEVELOPERS){
 const response=await fetch(url,{headers:{'User-Agent':'AI-Build-Radar-Private-PoC','Accept':'text/html'},redirect:'error',signal:AbortSignal.timeout(20000)});
 if(!response.ok)throw new FetchError(`GitHub Trending: HTTP ${response.status}`);
 const size=Number(response.headers.get('content-length')||0);
 if(size>2_000_000)throw new Error('GitHub Trending HTML exceeds 2 MB');
 const text=await response.text();
 if(text.length>2_000_000)throw new Error('GitHub Trending HTML exceeds 2 MB');
 return text;
}
export async function githubTrending():Promise<Batch>{
 const [repoHtml,developerHtml]=await Promise.all([htmlPage(PAGE_REPOS),htmlPage(PAGE_DEVELOPERS)]);
 const repos=parseGitHubTrending(repoHtml,'repositories'),developers=parseGitHubTrending(developerHtml,'developers');
 const selected=relevantTrendingLeads(repos,developers);
 const batch:Batch={candidates:[],fetched:repos.length+developers.length,filtered:repos.length+developers.length-selected.length,invalid:0,errors:[]};
 const byRepo=new Map<string,TrendingLead[]>();
 for(const lead of selected)byRepo.set(lead.repo.toLowerCase(),[...(byRepo.get(lead.repo.toLowerCase())||[]),lead]);
 for(const leads of byRepo.values()){
  const repo=leads[0].repo,url=`https://github.com/${repo}`;
  let metadata:Candidate|null=null;
  try{
   const raw=await getJson(`https://api.github.com/repos/${repo}`);
   if(!repoResponse.safeParse(raw).success)throw new Error('GitHub repository metadata invalid');
   metadata=githubCandidate(raw);
   if(!metadata)throw new Error('GitHub repository metadata missing required fields');
   batch.fetched++;
  }catch(error){batch.errors.push(`${repo}: ${error instanceof Error?error.message:'metadata failed'}`);continue;}
  for(const lead of leads){
   const sourceUrl=lead.page==='repositories'?PAGE_REPOS:PAGE_DEVELOPERS;
   const field=lead.page==='repositories'?'github_trending_daily':'github_trending_developer';
   const quote=lead.page==='repositories'?`GitHub Trending günlük repo listesi #${lead.rank} · ${lead.starsToday??'bilinmiyor'} bugün yıldız`:`GitHub Trending geliştirici listesinde popüler repo #${lead.rank}`;
   const claim:Claim={field,value:String(lead.rank),status:'Verified',quote,locator:`${lead.page} list position`,rationale:lead.page==='repositories'?'Observed position and GitHub-displayed daily stars; not verified AI development or our own star-growth measurement.':'Repository shown beside a trending developer; not proof that the repository itself is trending or AI-built.',strength:.75};
   batch.candidates.push({recordId:`${repo.toLowerCase()}:${lead.page}`,name:metadata.name,url,aliases:[],description:metadata.description||lead.description,creator:metadata.creator,category:metadata.category,publishedAt:null,sourceUrl,raw:{repo,rank:lead.rank,starsToday:lead.starsToday,description:lead.description,page:lead.page,observedDay:new Date().toISOString().slice(0,10)},claims:[claim]});
  }
  batch.candidates.push({...metadata,recordId:`${metadata.recordId}:repository`});
 }
 return batch;
}
