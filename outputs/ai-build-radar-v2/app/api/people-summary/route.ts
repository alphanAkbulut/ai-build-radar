import {authenticated} from '@/lib/auth';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {summaryRequest} from '@/lib/summary-contract';
import {summarize} from '@/lib/summary-store';
import type {PeopleSnapshot} from '@/lib/people';
export async function POST(request:Request){
 if(!await authenticated())return Response.json({error:'AUTH'},{status:401});
 try{if(new URL(request.headers.get('origin')||'').host!==request.headers.get('host'))throw Error();}catch{return Response.json({error:'ORIGIN'},{status:403});}
 const body=await request.text();if(body.length>512)return Response.json({error:'INPUT'},{status:413});
 let input;try{input=summaryRequest.parse(JSON.parse(body));}catch{return Response.json({error:'INPUT'},{status:400});}
 try{const snapshot:PeopleSnapshot=JSON.parse(await readFile(path.join(process.cwd(),'learning-data/people-feed.json'),'utf8'));const entry=snapshot.entries.find(e=>e.id===input.entryId);if(!entry)return Response.json({error:'NOT_FOUND'},{status:404});return Response.json({summary:await summarize(entry,input.language)});}catch(e){const code=e instanceof Error?e.message:'';return Response.json({error:['NOT_CONFIGURED','BUSY','SOURCE_UNAVAILABLE','LIMIT'].includes(code)?code:'FAILED'},{status:code==='BUSY'||code==='LIMIT'?429:503});}
}
