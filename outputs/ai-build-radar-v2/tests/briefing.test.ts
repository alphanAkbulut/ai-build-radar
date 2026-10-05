import test from 'node:test';
import assert from 'node:assert/strict';
import {dailyBriefing} from '../lib/briefing';
import {emptyStore} from '../lib/store';
import type {Build,Evidence,Run} from '../lib/schema';

const now=Date.parse('2026-10-05T15:00:00Z');
const build:Build={id:'b1',name:'Example',canonicalUrl:'https://example.com/demo',aliases:['https://github.com/example/demo'],description:'An interactive editor with a working public demo and reusable controls.',creator:null,category:'developer_tools',firstSeenAt:'2026-10-05T10:00:00Z',lastSeenAt:'2026-10-05T10:00:00Z',updatedAt:'2026-10-05T10:00:00Z',firstPublicRelease:null,sourceIds:['github'],reviewRequired:false,reviewReasons:[]};
const claim:Evidence={id:'e',buildId:'b1',sourceId:'github',sourceRecordId:'repo',field:'ai_tools',value:'Claude Code',status:'Builder-stated',sourceUrl:'https://github.com/example/demo',quote:'Built with Claude Code.',locator:'$.description',observedAt:'2026-10-05T10:00:00Z',publishedAt:null,contentHash:'h',rawId:'r',extractorVersion:'test',rationale:'test',strength:.8,supersedes:null};
const run:Run={id:'run',sourceId:'github',startedAt:'2026-10-05T11:00:00Z',finishedAt:'2026-10-05T11:01:00Z',status:'partial',fetched:100,accepted:80,filtered:0,invalid:0,created:10,matched:70,unchanged:0,evidenceAdded:1,conflicts:0,errors:['rate limit'],scope:'test'};

test('a new builder statement is a discovery, never a viral highlight',()=>{
 const store=emptyStore();store.builds.push(build);store.evidence.push(claim);store.runs.push(run);
 const brief=dailyBriefing(store,now);
 assert.equal(brief.measured.length,0);
 assert.equal(brief.discovered.length,1);
 assert.equal(dailyBriefing(store,now,48,true).discovered.length,0);
 assert.equal(brief.themes.length,0);
 assert.equal(brief.attemptedSources,1);
 assert.equal(brief.completedSources,0);
 assert.deepEqual(brief.coverage.find(s=>s.id==='github')?.lastRun&&{status:brief.coverage.find(s=>s.id==='github')!.lastRun!.status,fetched:brief.coverage.find(s=>s.id==='github')!.lastRun!.fetched},{status:'partial',fetched:100});
});
test('48-hour window uses signal event time, not the time it was checked',()=>{
 const store=emptyStore();store.builds.push({...build,firstSeenAt:'2026-09-01T10:00:00Z'});
 store.evidence.push({...claim,id:'old',sourceId:'huggingface',sourceRecordId:'space',field:'platform_trending',value:'25',quote:'trend',observedAt:'2026-10-01T10:00:00Z',publishedAt:null});
 store.evidence.push({...claim,id:'fresh',sourceId:'huggingface',sourceRecordId:'space',field:'platform_trending',value:'30',quote:'trend',observedAt:'2026-10-05T10:00:00Z',publishedAt:null});
 const brief=dailyBriefing(store,now);
 assert.equal(brief.measured.length,0);
 assert.equal(brief.discovered.length,0);
});
test('one platform trend stays out of the cross-platform headline',()=>{
 const store=emptyStore();store.builds.push(build);
 store.evidence.push({...claim,id:'trend',sourceId:'huggingface',field:'platform_trending',value:'25',quote:'Spaces trend list',observedAt:'2026-10-05T10:00:00Z'});
 const brief=dailyBriefing(store,now);
 assert.equal(brief.measured.length,1);
 assert.equal(brief.singlePlatform.length,1);
 assert.equal(brief.crossPlatform.length,0);
 assert.deepEqual(brief.sourceConcentration,[{source:'Hugging Face',projects:1}]);
 assert.equal(brief.themes.length,0);
});
