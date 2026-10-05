import type {Store} from './schema';
import {sources} from './sources';
import {latestEvidence} from './projections';
import {publishableEvidence} from './relevance';
export function sourceSignals(store:Store,buildId:string){
 const fields=['editorial_reference','community_discussion','platform_trending','github_trending_daily','github_trending_developer'];
 return latestEvidence(store.evidence.filter(e=>e.buildId===buildId)).filter(e=>fields.includes(e.field)&&publishableEvidence(store,e)).map(e=>({source:sources.find(s=>s.id===e.sourceId)?.name||e.sourceId,url:e.sourceUrl,label:e.field==='platform_trending'?'Platformun trend listesinde':e.field==='community_discussion'||e.field.startsWith('github_trending_')?e.quote:'Yayında proje bağlantısı',date:e.publishedAt||e.observedAt,checkedAt:e.observedAt,kind:e.field}));
}
