import nextEnv from '@next/env';
import {randomUUID} from 'node:crypto';
import type {Run} from '../lib/schema';
nextEnv.loadEnvConfig(process.cwd());
const {readStore,writeStore,lockStore}=await import('../lib/store');
const {enrichContexts}=await import('../lib/context-enrichment');
const unlock=await lockStore();
try{
 const store=await readStore(),now=new Date().toISOString();
 const builds=store.builds.filter(b=>b.context&&store.raw.some(r=>r.sourceId==='project-context'&&r.sourceRecordId===b.id));
 for(const b of builds)b.context!.nextCheckAt=now;
 const run:Run={id:randomUUID(),sourceId:'project-context',startedAt:now,finishedAt:null,status:'running',fetched:0,accepted:0,filtered:0,invalid:0,created:0,matched:0,unchanged:0,evidenceAdded:0,conflicts:0,errors:[],scope:'Re-extract cached documents; original fetch timestamps preserved. No network.'};
 await enrichContexts({...store,builds},run,now,async b=>{const r=store.raw.filter(r=>r.sourceId==='project-context'&&r.sourceRecordId===b.id).at(-1)!;const raw=r.payload as {text:string;html:boolean};return {...raw,url:r.url,fetchedAt:r.fetchedAt};},builds.length);
 run.finishedAt=new Date().toISOString();run.status=run.errors.length?'partial':'completed';store.runs.push(run);await writeStore(store);console.log(JSON.stringify({processed:run.accepted,evidenceAdded:run.evidenceAdded,errors:run.errors}));
}finally{await unlock();}
