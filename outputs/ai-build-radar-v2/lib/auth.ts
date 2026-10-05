import 'server-only';
import {cookies} from 'next/headers';
import {redirect} from 'next/navigation';
import {createHmac,timingSafeEqual} from 'node:crypto';
import {createServerClient} from '@supabase/ssr';
export const localMode=()=>process.env.RADAR_AUTH_MODE==='local';
// The private local MVP should remember a signed-in device across work sessions.
export const LOCAL_SESSION_SECONDS=180*24*60*60;
const digest=(text:string)=>createHmac('sha256',process.env.RADAR_SESSION_SECRET||'unconfigured').update(text).digest('hex');
export function equal(a:string,b:string){const aa=Buffer.from(a),bb=Buffer.from(b);return aa.length===bb.length&&timingSafeEqual(aa,bb);}
export function sessionToken(){if(!process.env.RADAR_SESSION_SECRET)throw new Error('Session secret not configured');const exp=String(Date.now()+LOCAL_SESSION_SECONDS*1000);return `${exp}.${digest(exp)}`;}
export function validToken(token:string){if(!process.env.RADAR_SESSION_SECRET||!process.env.RADAR_LOCAL_PASSWORD)return false;const [exp,sig]=token.split('.');return !!sig&&Number(exp)>Date.now()&&equal(sig,digest(exp));}
export async function supabase(){
 const jar=await cookies();const url=process.env.NEXT_PUBLIC_SUPABASE_URL,key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
 if(!url||!key)throw new Error('Supabase environment is not configured');
 return createServerClient(url,key,{cookies:{getAll:()=>jar.getAll(),setAll:(values)=>{try{values.forEach(({name,value,options})=>jar.set(name,value,options));}catch{/* Read-only server component; sign-in/action refresh persists cookies. */}}}});
}
export async function authenticated(){
 if(localMode())return validToken((await cookies()).get('radar-session')?.value||'');
 if(process.env.RADAR_AUTH_MODE!=='supabase')return false;
 const client=await supabase();const {data:{user},error}=await client.auth.getUser();
 const allowed=(process.env.RADAR_ALLOWED_EMAILS||'').toLowerCase().split(',').map(s=>s.trim()).filter(Boolean);
 return !error&&!!user?.email&&allowed.includes(user.email.toLowerCase());
}
export async function requireAuth(){if(!await authenticated())redirect('/login');}
