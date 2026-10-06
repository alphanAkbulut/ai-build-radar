import type {Evidence,Store} from './schema';
import {publishableEvidence} from './relevance';

// This claim is about one change, never the whole product. Generic signed
// commits and repository metadata cannot produce this badge.
export function verifiedAgentContribution(store:Store,buildId:string):Evidence|null{
 const rows=store.evidence.filter(e=>e.buildId===buildId);
 const newest=new Map<string,string>();
 for(const e of rows){const key=`${e.sourceId}:${e.sourceRecordId}`;if(!newest.has(key)||e.observedAt>newest.get(key)!)newest.set(key,e.observedAt);}
 const current=rows.filter(e=>e.observedAt===newest.get(`${e.sourceId}:${e.sourceRecordId}`));
 return current.find(e=>e.field==='agent_contribution'&&e.status==='Verified'&&
  /^https:\/\/github\.com\/[^/]+\/[^/]+\/commit\/[0-9a-f]{40}(?:[?#].*)?$/i.test(e.sourceUrl)&&
  /^https:\/\/github\.com\/[^\s]+\/(?:agents|sessions)\/[^\s]+$/i.test(e.locator)&&
  e.quote.trim().length>0&&publishableEvidence(store,e))||null;
}
