import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {PGlite} from '@electric-sql/pglite';
import {emptyStore} from '../lib/store';
import {sources} from '../lib/sources';
import {ingestCandidate} from '../lib/pipeline';
import type {Run} from '../lib/schema';
test('migration, atomic sync, immutable evidence and private RLS on PostgreSQL engine',async()=>{
 const db=new PGlite();
 try{
 await db.exec(`create role anon; create role authenticated; create role service_role bypassrls; create schema auth; create table auth.users(id uuid primary key); create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$; grant usage on schema auth to authenticated; grant execute on function auth.uid() to authenticated;`);
 await db.exec(await readFile('supabase/migrations/001_radar.sql','utf8'));
 const s=emptyStore(),now=new Date().toISOString();const r:Run={id:'r',sourceId:'github',startedAt:now,finishedAt:now,status:'completed',fetched:1,accepted:0,filtered:0,invalid:0,created:0,matched:0,unchanged:0,evidenceAdded:0,conflicts:0,errors:[],scope:'synthetic test fixture'};
 ingestCandidate(s,{recordId:'1',name:'Example',url:'https://github.com/example/repo',aliases:[],description:'Fixture',creator:null,category:'tools',publishedAt:null,sourceUrl:'https://github.com/example/repo',raw:{id:1},claims:[]},'github',r,now);s.runs.push(r);
 await db.exec('set role service_role');
 const sync=()=>db.query('select public.import_radar_snapshot($1::jsonb,$2::jsonb)',[JSON.stringify(s),JSON.stringify(sources)]);
 await sync();await sync();
 assert.equal((await db.query<{count:number}>('select count(*)::int as count from public.build_entities')).rows[0].count,1);
 assert.equal((await db.query<{count:number}>('select count(*)::int as count from public.evidence_objects')).rows[0].count,s.evidence.length);
 s.evidence[0].value='overwrite attempt';await sync();assert.notEqual((await db.query<{payload:{value:string}}>('select payload from public.evidence_objects where id=$1',[s.evidence[0].id])).rows[0].payload.value,'overwrite attempt');
 const clone=structuredClone(s.builds[0]);clone.id='build_collision';clone.canonicalUrl='https://other.example';s.builds.push(clone);await assert.rejects(sync(),/Alias belongs/);assert.equal((await db.query<{count:number}>('select count(*)::int as count from public.build_entities')).rows[0].count,1);
 await db.exec('reset role; set role anon');await assert.rejects(db.query('select * from public.build_entities'),/permission denied/);
 await db.exec('reset role; set role authenticated');assert.equal((await db.query('select * from public.build_entities')).rows.length,0);
 await assert.rejects(db.query('select public.import_radar_snapshot($1::jsonb,$2::jsonb)',[JSON.stringify(s),JSON.stringify(sources)]),/permission denied/);
 await db.exec(`reset role; insert into auth.users(id) values ('11111111-1111-1111-1111-111111111111'); insert into public.private_members values ('11111111-1111-1111-1111-111111111111'); set role authenticated; select set_config('request.jwt.claim.sub','11111111-1111-1111-1111-111111111111',false);`);
 assert.equal((await db.query('select * from public.build_entities')).rows.length,1);
 await assert.rejects(db.query("delete from public.build_entities"),/permission denied/);
 }finally{await db.close();}
});
