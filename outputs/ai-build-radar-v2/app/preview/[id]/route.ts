import {authenticated} from '@/lib/auth';
import {previewIndex} from '@/lib/previews';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
export const dynamic='force-dynamic';
export async function GET(_request:Request,{params}:{params:Promise<{id:string}>}){
 if(!await authenticated())return new Response('Unauthorized',{status:401});
 const {id}=await params;if(!/^build_[a-f0-9]{24}$/.test(id)||!(await previewIndex())[id])return new Response('Not found',{status:404});
 try{const image=await readFile(path.join(process.cwd(),'previews',id+'.png'));return new Response(new Uint8Array(image),{headers:{'Content-Type':'image/png','Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff'}});}catch{return new Response('Not found',{status:404});}
}
