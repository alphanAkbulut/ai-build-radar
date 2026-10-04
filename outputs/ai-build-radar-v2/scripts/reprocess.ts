import nextEnv from '@next/env';
import {randomUUID} from 'node:crypto';
import {readStore,writeStore,lockStore} from '../lib/store';
import {githubCandidate} from '../lib/collectors';
import {ingestCandidate} from '../lib/pipeline';
import type {Run} from '../lib/schema';
nextEnv.loadEnvConfig(process.cwd());
const unlock=await lockStore();
try{
 const store=await readStore();const records=new Map(store.raw.filter(r=>r.sourceId==='github').map(r=>[r.sourceRecordId,r]));
 const now=new Date().toISOString();const run:Run={id:randomUUID(),sourceId:'github',startedAt:now,finishedAt:null,status:'running',fetched:0,accepted:0,filtered:0,invalid:0,created:0,matched:0,unchanged:0,evidenceAdded:0,conflicts:0,errors:[],scope:'Offline re-extraction of last captured GitHub records; no network fetch; source cadence unchanged'};
 for(const raw of records.values()){const c=githubCandidate(raw.payload);run.fetched++;if(c)ingestCandidate(store,c,'github',run,now);else run.invalid++;}
 run.status=run.invalid?'partial':'completed';run.finishedAt=new Date().toISOString();store.runs.push(run);await writeStore(store);console.log(JSON.stringify(run,null,2));
}finally{await unlock();}
