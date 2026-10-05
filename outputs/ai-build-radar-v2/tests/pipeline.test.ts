import {test} from 'node:test';
import assert from 'node:assert/strict';
import {canonicalize} from '../lib/identity';
import {emptyStore} from '../lib/store';
import {ingestCandidate,due} from '../lib/pipeline';
import {buildView} from '../lib/projections';
import {sources} from '../lib/sources';
import type {Candidate,Run} from '../lib/schema';
const now='2026-10-04T12:00:00.000Z';
const run=():Run=>({id:'test',sourceId:'github',startedAt:now,finishedAt:null,status:'running',fetched:0,accepted:0,filtered:0,invalid:0,created:0,matched:0,unchanged:0,evidenceAdded:0,conflicts:0,errors:[],scope:'fixture'});
const candidate=(overrides:Partial<Candidate>={}):Candidate=>({recordId:'1',name:'Example',url:'https://github.com/Owner/Example',aliases:[],description:'Test fixture',creator:'Owner',category:'tools',publishedAt:null,sourceUrl:'https://github.com/Owner/Example',raw:{id:1,description:'Test fixture'},claims:[{field:'repository',value:'https://github.com/Owner/Example',status:'Verified',quote:'repository exists',locator:'$.html_url',rationale:'fixture',strength:1}],...overrides});
test('normalization drops tracking, preserves query identity and non-GitHub case',()=>{assert.equal(canonicalize('https://github.com/Owner/Repo.git/?utm_source=x'),'https://github.com/owner/repo');assert.notEqual(canonicalize('https://example.com/a?id=1'),canonicalize('https://example.com/a?id=2'));assert.notEqual(canonicalize('https://example.com/App'),canonicalize('https://example.com/app'));assert.equal(canonicalize('javascript:alert(1)'),null);assert.equal(canonicalize('https://u:p@example.com'),null);assert.equal(canonicalize('https://github.com/a/b/issues/2'),null);});
test('replaying identical input never duplicates entities or evidence',()=>{const store=emptyStore(),r=run();ingestCandidate(store,candidate(),'github',r,now);const count=store.evidence.length;ingestCandidate(store,candidate(),'github',r,'2026-10-04T13:00:00.000Z');assert.equal(store.builds.length,1);assert.equal(store.evidence.length,count);assert.equal(r.unchanged,1);assert.equal(store.builds[0].firstSeenAt,now);});
test('cross-source exact URLs join with separate provenance',()=>{const store=emptyStore(),r=run();ingestCandidate(store,candidate(),'github',r,now);ingestCandidate(store,candidate({recordId:'hn1'}),'hn',r,now);assert.equal(store.builds.length,1);assert.deepEqual(store.builds[0].sourceIds,['github','hn']);assert.equal(new Set(store.evidence.map(e=>e.sourceId)).size,2);});
test('same name is not sufficient to merge',()=>{const store=emptyStore(),r=run();ingestCandidate(store,candidate(),'github',r,now);ingestCandidate(store,candidate({url:'https://other.example.com',recordId:'2'}),'onesvibe',r,now);assert.equal(store.builds.length,2);});
test('two repositories sharing a homepage are quarantined',()=>{const store=emptyStore(),r=run();ingestCandidate(store,candidate({aliases:['https://common.example.com']}),'github',r,now);ingestCandidate(store,candidate({url:'https://github.com/other/another',recordId:'2',aliases:['https://common.example.com']}),'github',r,now);assert.equal(store.builds.length,1);assert.equal(store.reviews.length,1);assert.equal(r.conflicts,1);assert.equal(store.builds[0].reviewRequired,true);});
test('ambiguous bridge between existing entities is not auto-merged',()=>{const s=emptyStore(),r=run();ingestCandidate(s,candidate(),'github',r,now);ingestCandidate(s,candidate({url:'https://app.example.com',recordId:'2'}),'onesvibe',r,now);ingestCandidate(s,candidate({aliases:['https://app.example.com'],raw:{id:1,changed:true}}),'github',r,now);assert.equal(s.builds.length,2);assert.equal(s.reviews.length,1);});
test('changed source preserves evidence history and removes retracted current claims',()=>{const s=emptyStore(),r=run();const first=candidate();first.claims.push({field:'ai_tools',value:'Cursor',status:'Builder-stated',quote:'Built with Cursor',locator:'$.description',rationale:'statement',strength:.85});ingestCandidate(s,first,'github',r,now);const id=s.builds[0].id;assert.equal(buildView(s,id).aiStatus,'Builder-stated');const count=s.evidence.length;ingestCandidate(s,candidate({raw:{id:1,description:'changed'}}),'github',r,'2026-10-04T14:00:00.000Z');assert.ok(s.evidence.length>count);assert.equal(buildView(s,id).aiStatus,'Unknown');assert.ok(s.evidence.some(e=>e.field==='ai_tools'));});
test('verified repository does not establish AI tool or model',()=>{const s=emptyStore();ingestCandidate(s,candidate(),'github',run(),now);const view=buildView(s,s.builds[0].id);assert.equal(view.aiStatus,'Unknown');assert.deepEqual(view.tools,[]);assert.ok(view.verified>0);});
test('source schedules honor final intervals and disabled sources',()=>{assert.deepEqual(Object.fromEntries(sources.filter(s=>s.adapter!=='discovery').map(s=>[s.id,s.intervalMinutes])),{hn:15,github:45,'github-trending':180,builders:45,x:75,reddit:90,producthunt:180,onesvibe:360,communities:360,youtube:540,ecosystems:180,directories:1080,docs:1440,'project-context':15,attention:15});assert.equal(due(sources.find(s=>s.id==='hn')!,undefined,Date.now()),true);assert.equal(due(sources.find(s=>s.id==='builders')!,undefined,Date.now()),false);assert.equal(due(sources.find(s=>s.id==='hn')!,{lastAttemptAt:null,lastSuccessAt:null,nextRunAt:'2099-01-01T00:00:00Z',lastError:null,lastRunId:null,consecutiveFailures:0},Date.now()),false);});

import {toolClaims} from '../lib/collectors';
test('third-party tool mentions and negative statements are not maker receipts',()=>{
 assert.equal(toolClaims('24 checks for apps built with Lovable, Bolt and Cursor.','description').length,0);
 assert.equal(toolClaims('Not built with Claude Code.','description').length,0);
 assert.equal(toolClaims('Compare apps developed using Cursor.','description').length,0);
 assert.equal(toolClaims('A paint app. Built with Claude Code.','description')[0]?.value,'Claude Code');
 assert.equal(toolClaims('An offline companion, built with Claude Code.','description')[0]?.status,'Builder-stated');
});
test('content reversion A to B to A restores A while preserving every observation',()=>{
 const s=emptyStore(),r=run();ingestCandidate(s,candidate(),'github',r,now);
 ingestCandidate(s,candidate({description:'Changed',raw:{id:1,changed:true}}),'github',r,'2026-10-04T13:00:00.000Z');
 ingestCandidate(s,candidate(),'github',r,'2026-10-04T14:00:00.000Z');
 const v=buildView(s,s.builds[0].id);assert.equal(v.description,'Test fixture');assert.ok(v.evidence.every(e=>e.observedAt==='2026-10-04T14:00:00.000Z'));assert.equal(s.builds.length,1);
});
