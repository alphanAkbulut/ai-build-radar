"use server";
import {revalidatePath} from 'next/cache';
import {requireAuth,localMode} from '@/lib/auth';
import {ingest} from '@/lib/pipeline';
export async function scan(_prev:{message:string}){await requireAuth();if(!localMode())return {message:'Hosted ingestion ayrı worker üzerinden çalışır.'};try{const runs=await ingest();revalidatePath('/','layout');return {message:runs.length?`${runs.length} kaynak tarandı. ${runs.reduce((n,r)=>n+r.created,0)} yeni build; ${runs.filter(r=>r.status!=='completed').length} eksik/başarısız tarama.`:'Tüm kaynaklar güncel. Bir sonraki tarama zamanı bekleniyor.'};}catch(e){return {message:e instanceof Error?e.message:'Tarama başarısız.'};}}
