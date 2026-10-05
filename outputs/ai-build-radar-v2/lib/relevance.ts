import type {Evidence,Store} from './schema';

export function aiDiscussionTags(tags:unknown):boolean{
 return Array.isArray(tags)&&tags.some(tag=>typeof tag==='string'&&['ai','ml'].includes(tag.toLowerCase()));
}

// Historical evidence stays in the store, but unsupported source observations
// cannot be republished by any current-facing projection.
export function publishableEvidence(store:Store,evidence:Evidence):boolean{
 if(evidence.sourceId!=='lobsters'||evidence.field!=='community_discussion')return true;
 const raw=store.raw.find(row=>row.id===evidence.rawId);
 return !!raw&&raw.sourceId==='lobsters'&&raw.sourceRecordId===evidence.sourceRecordId&&raw.hash===evidence.contentHash&&aiDiscussionTags((raw.payload as {tags?:unknown}|null)?.tags);
}
