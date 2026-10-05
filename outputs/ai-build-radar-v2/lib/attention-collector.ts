import {getJson} from './http';
import {lessons} from './lessons';
import {matchingDiscussions,type Attention} from './attention';
import {destinations} from './discovery';
import {toolClaims} from './collectors';
import {latestEvidence} from './projections';
import type {Store,Run} from './schema';
export function attentionTargets(store:Store,now=Date.now()){
 const targets=new Map<string,string[]>();
 const recentAI=store.builds.filter(b=>{
  const age=now-Date.parse(b.firstSeenAt);
  return age>=0&&age<=7*86400000&&!!destinations(b).siteUrl&&latestEvidence(store.evidence.filter(e=>e.buildId===b.id)).some(e=>e.field==='ai_tools'&&['Verified','Builder-stated'].includes(e.status)&&(e.sourceId!=='github'||toolClaims(e.quote,e.locator).some(claim=>claim.value===e.value)));
 }).sort((a,b)=>b.firstSeenAt.localeCompare(a.firstSeenAt));
 for(const b of recentAI){const key=b.aliases.find(a=>a.startsWith('https://github.com/'))||b.canonicalUrl;targets.set(key,b.aliases);}
 for(const l of lessons)targets.set(l.repo,[l.repo,l.site]);
 for(const b of store.builds){const key=b.aliases.find(a=>a.startsWith('https://github.com/'))||b.canonicalUrl;if(!targets.has(key))targets.set(key,b.aliases);}
 return targets;
}
export async function collectAttention(store:Store,run:Run,limit=6){
 store.attention??={};const targets=attentionTargets(store);
 const due=[...targets].filter(([key])=>!store.attention![key]||Date.parse(store.attention![key].nextCheckAt)<=Date.now()).slice(0,limit);
 for(const [key,aliases] of due){run.fetched++;const now=new Date().toISOString();try{
  const hits=new Map<string,Attention['discussions'][number]>();
  for(const url of [...new Set(aliases)].slice(0,2)){
   const parsed=new URL(url);const query=parsed.host==='github.com'?parsed.pathname.slice(1):parsed.host+parsed.pathname.replace(/\/$/,'');
   const response=await getJson(`https://hn.algolia.com/api/v1/search?tags=story&restrictSearchableAttributes=url&hitsPerPage=50&query=${encodeURIComponent(query)}`);
   for(const d of matchingDiscussions(response,aliases))hits.set(d.id,d);
  }
  store.attention[key]={checkedAt:now,nextCheckAt:new Date(Date.now()+86400000).toISOString(),status:'completed',discussions:[...hits.values()].sort((a,b)=>b.points-a.points||b.comments-a.comments)};run.accepted++;run.matched++;
 }catch(e){const error=e instanceof Error?e.message:'Search failed';store.attention[key]={...store.attention[key],checkedAt:now,nextCheckAt:new Date(Date.now()+6*3600000).toISOString(),status:'failed',error,discussions:store.attention[key]?.discussions||[]};run.errors.push(`${key}: ${error}`);}
 }
}
