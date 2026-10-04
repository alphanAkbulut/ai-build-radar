import { mkdir, readFile, writeFile, rename, rm } from 'node:fs/promises';
import path from 'node:path';
import type { Store } from './schema';
export const dataDir = () => process.env.RADAR_DATA_DIR || path.join(process.cwd(),'data');
export const emptyStore = ():Store => ({version:1,builds:[],evidence:[],raw:[],runs:[],reviews:[],sourceStates:{},dailySnapshots:[]});
export async function readStore():Promise<Store> {
 try { const data=JSON.parse(await readFile(path.join(dataDir(),'radar.json'),'utf8')); if(data.version!==1) throw new Error('Unsupported store version'); return data; }
 catch(e) { if((e as NodeJS.ErrnoException).code==='ENOENT') return emptyStore(); throw e; }
}
export async function writeStore(store:Store) {
 await mkdir(dataDir(),{recursive:true}); const tmp=path.join(dataDir(),`radar.${process.pid}.tmp`);
 await writeFile(tmp,JSON.stringify(store),{mode:0o600}); await rename(tmp,path.join(dataDir(),'radar.json'));
}
export async function lockStore() {
 await mkdir(dataDir(),{recursive:true}); const lock=path.join(dataDir(),'.ingest-lock');
 try { await mkdir(lock); } catch(e) {if((e as NodeJS.ErrnoException).code==='EEXIST') throw new Error('Another ingestion is running. If it crashed, inspect data/.ingest-lock before removing it.');throw e;}
 await writeFile(path.join(lock,'owner.json'),JSON.stringify({pid:process.pid,startedAt:new Date().toISOString()}));
 return async()=>{await rm(lock,{recursive:true,force:true});};
}
