-- Phase 1. Apply to a NEW Supabase project via reviewed migration.
-- No public or signup-based access. Add approved auth.users IDs to private_members.
begin;
create table public.private_members (user_id uuid primary key references auth.users(id) on delete cascade);
alter table public.private_members enable row level security;
revoke all on public.private_members from anon, authenticated;
create function public.is_radar_member() returns boolean language sql stable security definer set search_path = '' as $$
 select exists(select 1 from public.private_members where user_id = (select auth.uid()));
$$;
revoke all on function public.is_radar_member() from public;
grant execute on function public.is_radar_member() to authenticated;

create table public.source_registry (
 id text primary key,
 config jsonb not null,
 state jsonb,
 check ((config->>'intervalMinutes')::integer > 0),
 check (config->>'id' = id)
);
create table public.build_entities (
 id text primary key,
 payload jsonb not null,
 canonical_url text generated always as (payload->>'canonicalUrl') stored unique,
 first_seen_at text generated always as (payload->>'firstSeenAt') stored,
 check (payload->>'id'=id),
 check (payload ?& array['id','name','canonicalUrl','aliases','firstSeenAt','sourceIds'])
);
create table public.build_aliases (
 url text primary key,
 build_id text not null references public.build_entities(id) on delete restrict
);
create table public.source_records (
 id text primary key,
 source_id text not null references public.source_registry(id),
 payload jsonb not null,
 content_hash text generated always as (payload->>'hash') stored,
 check (payload->>'id'=id)
);
create table public.evidence_objects (
 id text primary key,
 build_id text not null references public.build_entities(id) on delete restrict,
 source_id text not null references public.source_registry(id),
 raw_id text not null references public.source_records(id),
 payload jsonb not null,
 field text generated always as (payload->>'field') stored,
 status text generated always as (payload->>'status') stored,
 observed_at text generated always as (payload->>'observedAt') stored,
 check (payload->>'id'=id and payload->>'buildId'=build_id and payload->>'sourceId'=source_id and payload->>'rawId'=raw_id),
 check (payload ?& array['status','field','value','contentHash','sourceUrl','observedAt','extractorVersion']),
 check (status in ('Verified','Builder-stated','Derived','Unknown'))
);
create index evidence_build_field on public.evidence_objects(build_id,field,observed_at);
create table public.ingestion_runs (id text primary key,source_id text not null references public.source_registry(id),payload jsonb not null,check(payload->>'status' in ('running','completed','partial','failed')));
create table public.resolution_reviews (id text primary key,payload jsonb not null);
create table public.daily_snapshots (build_id text not null references public.build_entities(id),day date not null,payload jsonb not null,primary key(build_id,day));

-- Read access only to explicitly admitted users. No client writes.
do $$ declare t text; begin
 foreach t in array array['source_registry','build_entities','build_aliases','source_records','evidence_objects','ingestion_runs','resolution_reviews','daily_snapshots'] loop
  execute format('alter table public.%I enable row level security',t);
  execute format('revoke all on public.%I from anon, authenticated',t);
  execute format('grant select on public.%I to authenticated',t);
  execute format('grant all on public.%I to service_role',t);
  execute format('create policy member_read on public.%I for select to authenticated using ((select public.is_radar_member()))',t);
 end loop;
end $$;
grant all on public.private_members to service_role;

-- Whole import is atomic; rejected aliases or broken references roll it back.
-- Evidence and raw source rows are immutable, even across repeated imports.
create function public.import_radar_snapshot(snapshot jsonb,registry jsonb) returns jsonb
language plpgsql security invoker set search_path = '' as $$
declare r jsonb; a text; begin
 if snapshot->>'version' <> '1' then raise exception 'Unsupported snapshot version'; end if;
 for r in select * from jsonb_array_elements(registry) loop
  insert into public.source_registry(id,config,state) values(r->>'id',r,snapshot->'sourceStates'->(r->>'id'))
  on conflict(id) do update set config=excluded.config,state=excluded.state;
 end loop;
 for r in select * from jsonb_array_elements(snapshot->'builds') loop
  insert into public.build_entities(id,payload) values(r->>'id',r) on conflict(id) do update set payload=excluded.payload;
  for a in select jsonb_array_elements_text(r->'aliases') loop
   if exists(select 1 from public.build_aliases where url=a and build_id<>r->>'id') then raise exception 'Alias belongs to another build'; end if;
   insert into public.build_aliases(url,build_id) values(a,r->>'id') on conflict(url) do nothing;
  end loop;
 end loop;
 for r in select * from jsonb_array_elements(snapshot->'raw') loop
  insert into public.source_records(id,source_id,payload) values(r->>'id',r->>'sourceId',r) on conflict(id) do nothing;
 end loop;
 for r in select * from jsonb_array_elements(snapshot->'evidence') loop
  insert into public.evidence_objects(id,build_id,source_id,raw_id,payload) values(r->>'id',r->>'buildId',r->>'sourceId',r->>'rawId',r) on conflict(id) do nothing;
 end loop;
 for r in select * from jsonb_array_elements(snapshot->'runs') loop
  insert into public.ingestion_runs(id,source_id,payload) values(r->>'id',r->>'sourceId',r) on conflict(id) do update set payload=excluded.payload;
 end loop;
 for r in select * from jsonb_array_elements(snapshot->'reviews') loop
  insert into public.resolution_reviews(id,payload) values(r->>'id',r) on conflict(id) do nothing;
 end loop;
 for r in select * from jsonb_array_elements(snapshot->'dailySnapshots') loop
  insert into public.daily_snapshots(build_id,day,payload) values(r->>'buildId',(r->>'day')::date,r) on conflict(build_id,day) do nothing;
 end loop;
 return jsonb_build_object('builds',(select count(*) from public.build_entities),'evidence',(select count(*) from public.evidence_objects));
end $$;
revoke all on function public.import_radar_snapshot(jsonb,jsonb) from public,anon,authenticated;
grant execute on function public.import_radar_snapshot(jsonb,jsonb) to service_role;
commit;
