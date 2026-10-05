"use server";
import {cookies} from 'next/headers';
import {redirect} from 'next/navigation';
import {equal,localMode,LOCAL_SESSION_SECONDS,sessionToken,supabase} from '@/lib/auth';
const attempts=new Map<string,{count:number;until:number}>();
export async function signIn(_previous:{error:string},form:FormData){
 const key=localMode()?'local':String(form.get('email')||'').trim().toLowerCase();
 const prior=attempts.get(key);if(prior&&prior.until>Date.now()&&prior.count>=5)return {error:'Çok fazla deneme. 15 dakika sonra yeniden deneyin.'};
 const password=String(form.get('password')||'');let valid=false;
 if(localMode()) {valid=!!process.env.RADAR_LOCAL_PASSWORD&&equal(password,process.env.RADAR_LOCAL_PASSWORD);if(valid)(await cookies()).set('radar-session',sessionToken(),{httpOnly:true,sameSite:'strict',secure:false,path:'/',maxAge:LOCAL_SESSION_SECONDS});}
 else if(process.env.RADAR_AUTH_MODE==='supabase'){
  const allowed=(process.env.RADAR_ALLOWED_EMAILS||'').toLowerCase().split(',').map(s=>s.trim());
  if(allowed.includes(key)){const client=await supabase();const {data,error}=await client.auth.signInWithPassword({email:key,password});valid=!error&&!!data.user?.email&&allowed.includes(data.user.email.toLowerCase());if(!valid)await client.auth.signOut();}
 }
 if(!valid){const count=prior&&prior.until>Date.now()?prior.count+1:1;attempts.set(key,{count,until:Date.now()+15*60000});return {error:'Giriş doğrulanamadı. Erişim bilgilerini kontrol edin.'};}
 attempts.delete(key);redirect('/');
}
export async function signOut(){(await cookies()).delete('radar-session');if(!localMode()&&process.env.RADAR_AUTH_MODE==='supabase')await (await supabase()).auth.signOut();redirect('/login');}
