import 'server-only';
import {people} from './people';
import {readFile} from 'node:fs/promises';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import path from 'node:path';
import type {PeopleSnapshot} from './people';
const run=promisify(execFile);let pending:Promise<void>|undefined;
async function read():Promise<PeopleSnapshot>{try{return JSON.parse(await readFile(path.join(process.cwd(),'learning-data/people-feed.json'),'utf8'));}catch(e){if((e as NodeJS.ErrnoException).code==='ENOENT')return {checkedAt:null,sources:[],entries:[]};throw e;}}
export async function peopleSnapshot():Promise<PeopleSnapshot>{let snapshot=await read();if(people.some(p=>p.feed&&!snapshot.sources.some(s=>s.personId===p.id))||!snapshot.checkedAt||Date.now()-Date.parse(snapshot.checkedAt)>=45*60*1000){try{pending??=run('python3',[path.join(process.cwd(),'scripts/people_feed.py')],{timeout:25000,maxBuffer:100000}).then(()=>{}).finally(()=>{pending=undefined;});await pending;snapshot=await read();}catch{return {...snapshot,refreshError:true};}}return snapshot;}
