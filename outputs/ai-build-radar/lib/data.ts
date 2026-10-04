import 'server-only';
import {requireAuth,localMode,supabase} from './auth';
import {readStore,emptyStore} from './store';
export async function dashboardStore(){
 await requireAuth();if(localMode())return readStore();
 const client=await supabase();const store=emptyStore();
 // Server-side reads use the signed-in user's JWT. RLS remains authoritative.
 for(const [table,key] of [['build_entities','builds'],['evidence_objects','evidence'],['ingestion_runs','runs'],['resolution_reviews','reviews'],['source_records','raw']] as const){
  let offset=0;while(true){const {data,error}=await client.from(table).select('payload').order('id').range(offset,offset+499);if(error)throw new Error(`Database read failed: ${table}`);(store[key] as unknown[]).push(...data.map(row=>row.payload));if(data.length<500)break;offset+=500;}
 }
 const {data,error}=await client.from('source_registry').select('id,state');if(error)throw new Error('Cannot read source registry');
 for(const row of data||[])if(row.state)store.sourceStates[row.id]=row.state;
 return store;
}
