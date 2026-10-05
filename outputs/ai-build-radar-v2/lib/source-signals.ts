import type {Store} from './schema';
import {sources} from './sources';
export function sourceSignals(store:Store,buildId:string){
 const fields=['editorial_reference','community_discussion','platform_trending','github_trending_daily','github_trending_developer'];
 const latest=new Map<string,Store['evidence'][number]>();
 for(const e of store.evidence.filter(e=>e.buildId===buildId&&fields.includes(e.field)))latest.set(e.sourceId+'|'+e.sourceRecordId+'|'+e.field,e);
 return [...latest.values()].map(e=>({source:sources.find(s=>s.id===e.sourceId)?.name||e.sourceId,url:e.sourceUrl,label:e.field==='platform_trending'?'Platformun trend listesinde':e.field==='community_discussion'||e.field.startsWith('github_trending_')?e.quote:'Yayında proje bağlantısı',date:e.publishedAt||e.observedAt,checkedAt:e.observedAt,kind:e.field}));
}
