import {discover} from './discovery-collectors';
import {collectAttention} from './attention-collector';
import {enrichContexts} from './context-enrichment';
import {randomUUID} from 'node:crypto';
import {BuildSchema,EvidenceSchema,type Candidate,type Store,type Run,type Source} from './schema';
import {canonicalize,hash,stableId,repoAlias} from './identity';
import {readStore,writeStore,lockStore} from './store';
import {sources} from './sources';
import * as collectors from './collectors';
import {FetchError} from './http';
import {githubTrending} from './github-trending';
import {collectNews} from './news-collector';
export const EXTRACTOR_VERSION='deterministic-v2';
export function ingestCandidate(store:Store,c:Candidate,sourceId:string,run:Run,now:string){
 const url=canonicalize(c.url);if(!url){run.invalid++;return;}
 const aliases=[...new Set([url,...c.aliases.map(canonicalize).filter((v):v is string=>!!v)])];
 const contentHash=hash(c.raw),rawId=stableId('raw',[sourceId,c.recordId,contentHash]);
 if(!store.raw.some(r=>r.id===rawId))store.raw.push({id:rawId,sourceId,sourceRecordId:c.recordId,url:c.sourceUrl,fetchedAt:now,hash:contentHash,payload:c.raw});
 const matches=store.builds.filter(b=>b.aliases.some(a=>aliases.includes(a)));
 const incomingRepo=repoAlias(aliases);
 const conflictingRepo=matches.some(b=>incomingRepo&&repoAlias(b.aliases)&&repoAlias(b.aliases)!==incomingRepo);
 if(matches.length>1||conflictingRepo){
  run.conflicts++;const reason='Ambiguous alias or different repositories sharing a homepage; no automatic merge';
  const id=stableId('review',[sourceId,c.recordId,contentHash]);if(!store.reviews.some(r=>r.id===id))store.reviews.push({id,sourceId,recordId:c.recordId,reason,candidateBuildIds:matches.map(b=>b.id),observedAt:now});
  for(const b of matches){b.reviewRequired=true;if(!b.reviewReasons.includes(reason))b.reviewReasons.push(reason);}return;
 }
 run.accepted++;
 let b=matches[0];
 if(!b){b=BuildSchema.parse({id:stableId('build',url),name:c.name,canonicalUrl:url,aliases,description:c.description,creator:c.creator,category:c.category,firstSeenAt:now,lastSeenAt:now,updatedAt:now,firstPublicRelease:null,sourceIds:[sourceId],reviewRequired:false,reviewReasons:[]});store.builds.push(b);run.created++;}
 else {run.matched++;b.lastSeenAt=now;if(b.sourceIds[0]===sourceId){b.name=c.name;b.description=c.description;b.category=c.category;b.creator=c.creator;}b.aliases=[...new Set([...b.aliases,...aliases])];b.sourceIds=[...new Set([...b.sourceIds,sourceId])];}
 const latest=store.evidence.filter(e=>e.buildId===b.id&&e.sourceId===sourceId&&e.sourceRecordId===c.recordId).at(-1);
 if(latest?.contentHash===contentHash&&latest.extractorVersion===EXTRACTOR_VERSION){run.unchanged++;return;}
 const metadata=[{field:'name',value:c.name},{field:'description',value:c.description},{field:'category',value:c.category},...(c.creator?[{field:'creator',value:c.creator}]:[])].filter(x=>x.value).map(x=>({...x,status:sourceId==='github'?'Builder-stated' as const:'Derived' as const,quote:x.value,locator:`normalized.${x.field}`,rationale:'Attributed source metadata; the canonical label is a display projection.',strength:sourceId==='github'?.85:.45}));
 let added=0;
 for(const claim of [...metadata,...c.claims]){
  const id=stableId('ev',[b.id,sourceId,c.recordId,claim.field,claim.value,contentHash,EXTRACTOR_VERSION,latest?.id||null,now]);if(store.evidence.some(e=>e.id===id))continue;
  const previous=store.evidence.filter(e=>e.buildId===b.id&&e.sourceId===sourceId&&e.sourceRecordId===c.recordId&&e.field===claim.field&&e.observedAt!==now).at(-1);
  const e=EvidenceSchema.parse({id,buildId:b.id,sourceId,sourceRecordId:c.recordId,...claim,sourceUrl:c.sourceUrl,observedAt:now,publishedAt:c.publishedAt,contentHash,rawId,extractorVersion:EXTRACTOR_VERSION,supersedes:previous?.id||null});
  store.evidence.push(e);added++;
 }
 if(added){b.updatedAt=now;run.evidenceAdded+=added;}else run.unchanged++;
}
export const due=(source:Source,state:Store['sourceStates'][string]|undefined,now:number)=>source.enabled&&(!state?.nextRunAt||Date.parse(state.nextRunAt)<=now);
export async function ingest(options:{force?:boolean;only?:string}={}){
 const unlock=await lockStore();
 try{
  const store=await readStore();const completed:Run[]=[];
  for(const source of sources.filter(s=>s.enabled&&(!options.only||options.only===s.id))){
   if(!options.force&&!due(source,store.sourceStates[source.id],Date.now()))continue;
   const now=new Date().toISOString();const run:Run={id:randomUUID(),sourceId:source.id,startedAt:now,finishedAt:null,status:'running',fetched:0,accepted:0,filtered:0,invalid:0,created:0,matched:0,unchanged:0,evidenceAdded:0,conflicts:0,errors:[],scope:source.scope};
   const state=store.sourceStates[source.id]||{lastAttemptAt:null,lastSuccessAt:null,nextRunAt:null,consecutiveFailures:0,lastError:null,lastRunId:null};
   store.sourceStates[source.id]=state;state.lastAttemptAt=now;state.lastRunId=run.id;store.runs.push(run);await writeStore(store);
   let retryAfter=0;
   try{
    if(source.adapter==='attention'){await collectAttention(store,run);}else if(source.adapter==='context'){await enrichContexts(store,run,new Date().toISOString());}else if(source.adapter==='news'){await collectNews(store,run,source.id,new Date().toISOString());}else{
    const batch=source.adapter==='discovery'?await discover(source.id):source.adapter==='github-trending'?await githubTrending():await collectors[source.adapter as 'hn'|'github'|'onesvibe']();run.fetched=batch.fetched;run.filtered=batch.filtered;run.invalid=batch.invalid;run.errors=batch.errors;
    for(const candidate of batch.candidates)ingestCandidate(store,candidate,source.id,run,new Date().toISOString());
    }
    run.status=run.errors.length||run.invalid?'partial':'completed';
    if(run.status==='completed'){state.lastSuccessAt=new Date().toISOString();state.consecutiveFailures=0;state.lastError=null;}
    else {state.consecutiveFailures=run.fetched>0?0:state.consecutiveFailures+1;state.lastError=run.errors[0]||`${run.invalid} invalid records`;}
   }catch(e){run.status='failed';run.errors.push(e instanceof Error?e.message:'Unknown collector error');state.consecutiveFailures++;state.lastError=run.errors[0];if(e instanceof FetchError)retryAfter=e.retryAfterMs;}
   run.finishedAt=new Date().toISOString();
   const backoff=state.consecutiveFailures&&!['context','attention'].includes(source.adapter||'')?Math.min(24*60,source.intervalMinutes*2**Math.min(state.consecutiveFailures,6))*60000:source.intervalMinutes*60000;
   state.nextRunAt=new Date(Date.now()+Math.max(backoff,retryAfter)).toISOString();
   completed.push(run);await writeStore(store);
  }
  const day=new Date().toISOString().slice(0,10);
  for(const b of store.builds)if(!store.dailySnapshots.some(s=>s.day===day&&s.buildId===b.id))store.dailySnapshots.push({day,buildId:b.id,sourceCount:b.sourceIds.length,evidenceCount:store.evidence.filter(e=>e.buildId===b.id).length});
  await writeStore(store);return completed;
 }finally{await unlock();}
}
