import type {Store,Evidence} from './schema';
export function latestEvidence(evidence:Evidence[]):Evidence[]{
 const versions=new Map<string,string>();
 for(const e of evidence){const key=`${e.sourceId}:${e.sourceRecordId}`;const prior=versions.get(key);if(!prior||e.observedAt>prior)versions.set(key,e.observedAt);}
 return evidence.filter(e=>e.observedAt===versions.get(`${e.sourceId}:${e.sourceRecordId}`));
}
export function buildView(store:Store,id:string){
 const b=store.builds.find(b=>b.id===id)!;const all=store.evidence.filter(e=>e.buildId===id);const evidence=latestEvidence(all);
 const tools=evidence.filter(e=>e.field==='ai_tools');
 return {...b,evidence,history:all,aiStatus:tools[0]?.status||'Unknown',tools:[...new Set(tools.map(e=>e.value))],stack:[...new Set(evidence.filter(e=>e.field==='tech_stack'||e.field==='primary_language').map(e=>e.value))],verified:evidence.filter(e=>e.status==='Verified').length};
}
