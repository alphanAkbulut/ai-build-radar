import nextEnv from '@next/env';
import {mkdir,writeFile,rm} from 'node:fs/promises';
import path from 'node:path';
nextEnv.loadEnvConfig(process.cwd());
const {ingest}=await import('../lib/pipeline');const {dataDir}=await import('../lib/store');
let stopping=false;process.on('SIGINT',()=>{stopping=true;});process.on('SIGTERM',()=>{stopping=true;});
await mkdir(dataDir(),{recursive:true});const heartbeat=path.join(dataDir(),'worker.json');
console.log('Local scheduler active; checks due sources every 30 seconds. Ctrl+C to stop.');
try{while(!stopping){await writeFile(heartbeat,JSON.stringify({pid:process.pid,lastHeartbeat:new Date().toISOString()}));try{const runs=await ingest();if(runs.length)console.log(JSON.stringify(runs.map(r=>({source:r.sourceId,status:r.status,new:r.created}))));}catch(e){console.error(e instanceof Error?e.message:'Worker error');}for(let i=0;i<30&&!stopping;i++)await new Promise(r=>setTimeout(r,1000));}}finally{await rm(heartbeat,{force:true});}
