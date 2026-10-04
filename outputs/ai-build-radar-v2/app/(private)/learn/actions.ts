'use server';
import {requireAuth} from '@/lib/auth';
import {learningInput} from '@/lib/learning-input';
import {mkdir,writeFile} from 'node:fs/promises';
import {randomUUID} from 'node:crypto';
import path from 'node:path';
export async function saveLearningInput(input:unknown){await requireAuth();const parsed=learningInput.safeParse(input);if(!parsed.success)return {ok:false,message:parsed.error.issues[0].message};const folder=path.join(process.cwd(),'learning-data','inbox');await mkdir(folder,{recursive:true});const id=randomUUID();await writeFile(path.join(folder,id+'.json'),JSON.stringify({...parsed.data,id,createdAt:new Date().toISOString(),status:'pending-review'}),{mode:0o600,flag:'wx'});return {ok:true,message:'Kaydedildi. İnceleme bekliyor; doğrulanmış kanıt olarak yayımlanmadı.'};}
