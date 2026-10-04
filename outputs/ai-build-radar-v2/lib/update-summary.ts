import type {Run} from './schema';
import {sources} from './sources';
export function updateSummary(runs:Run[]){
 const ordered=[...runs].sort((a,b)=>(b.finishedAt||b.startedAt).localeCompare(a.finishedAt||a.startedAt));
 const format=(r:Run)=>({id:r.id,source:sources.find(s=>s.id===r.sourceId)?.name||r.sourceId,at:r.finishedAt||r.startedAt,status:r.status,created:r.created,evidenceAdded:r.evidenceAdded,unchanged:r.unchanged,matched:r.matched});
 return {latest:ordered[0]?format(ordered[0]):null,lastSuccess:ordered.find(r=>r.status==='completed')?.finishedAt||null,recent:ordered.slice(0,5).map(format)};
}
export type UpdateSummary=ReturnType<typeof updateSummary>;
