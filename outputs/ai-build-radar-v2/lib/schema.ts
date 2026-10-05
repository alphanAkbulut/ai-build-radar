import { z } from 'zod';
export const Status = z.enum(['Verified','Builder-stated','Derived','Unknown']);
export type EvidenceStatus = z.infer<typeof Status>;
export const EvidenceSchema = z.object({
 id:z.string(), buildId:z.string(), sourceId:z.string(), sourceRecordId:z.string(),
 field:z.string(), value:z.string(), status:Status, sourceUrl:z.url(),
 quote:z.string(), locator:z.string(), observedAt:z.iso.datetime(), publishedAt:z.string().nullable(),
 contentHash:z.string(), rawId:z.string(), extractorVersion:z.string(), rationale:z.string(),
 strength:z.number().min(0).max(1), supersedes:z.string().nullable()
});
export type Evidence = z.infer<typeof EvidenceSchema>;
export const ContextSchema=z.object({state:z.enum(['complete','partial','missing','failed','blocked']),what:z.string().nullable(),purpose:z.string().nullable(),sourceUrl:z.url().nullable(),checkedAt:z.iso.datetime(),lastSuccessAt:z.iso.datetime().nullable(),nextCheckAt:z.iso.datetime(),reason:z.string(),contentHash:z.string().nullable(),evidenceIds:z.array(z.string())});
export type Context=z.infer<typeof ContextSchema>;
export const BuildSchema = z.object({
 context:ContextSchema.optional(), id:z.string(), name:z.string(), canonicalUrl:z.url(), aliases:z.array(z.url()),
 description:z.string(), creator:z.string().nullable(), category:z.string(),
 firstSeenAt:z.iso.datetime(), lastSeenAt:z.iso.datetime(), updatedAt:z.iso.datetime(),
 firstPublicRelease:z.string().nullable(), sourceIds:z.array(z.string()),
 reviewRequired:z.boolean(), reviewReasons:z.array(z.string())
});
export type Build = z.infer<typeof BuildSchema>;
export type Source = {id:string;name:string;kind:string;intervalMinutes:number;intervalLabel:string;enabled:boolean;url:string;license:string;scope:string;adapter:string|null};
export type SourceState = {lastAttemptAt:string|null;lastSuccessAt:string|null;nextRunAt:string|null;consecutiveFailures:number;lastError:string|null;lastRunId:string|null};
export type Run = {id:string;sourceId:string;startedAt:string;finishedAt:string|null;status:'running'|'completed'|'partial'|'failed';fetched:number;accepted:number;filtered:number;invalid:number;created:number;matched:number;unchanged:number;evidenceAdded:number;conflicts:number;errors:string[];scope:string};
export type RawRecord = {id:string;sourceId:string;sourceRecordId:string;url:string;fetchedAt:string;hash:string;payload:unknown};
export type Review = {id:string;sourceId:string;recordId:string;reason:string;candidateBuildIds:string[];observedAt:string};
export type Store = {version:1;builds:Build[];evidence:Evidence[];raw:RawRecord[];runs:Run[];reviews:Review[];sourceStates:Record<string,SourceState>;dailySnapshots: {day:string;buildId:string;sourceCount:number;evidenceCount:number}[]};
export type Claim = Pick<Evidence,'field'|'value'|'status'|'quote'|'locator'|'rationale'|'strength'>;
export type Candidate = {recordId:string;name:string;url:string;aliases:string[];description:string;creator:string|null;category:string;publishedAt:string|null;sourceUrl:string;raw:unknown;claims:Claim[]};
