import test from 'node:test';
import assert from 'node:assert/strict';
import {attentionKind,matchingDiscussions,starChange,type Attention} from '../lib/attention';
import {selectionFor} from '../lib/selection';
import {lessons} from '../lib/lessons';
import {attentionTargets} from '../lib/attention-collector';
import type {Store} from '../lib/schema';
const now=Date.parse('2026-10-05T12:00:00Z');
const hit={objectID:'123',title:'Example',url:'https://github.com/owner/repo',created_at:'2026-10-04T12:00:00Z',points:100,num_comments:25};
const attention:Attention={checkedAt:'2026-10-05T10:00:00Z',nextCheckAt:'2026-10-06T10:00:00Z',status:'completed',discussions:matchingDiscussions({hits:[hit]},['https://github.com/owner/repo'])};
test('only exact project URLs establish a discussion link, not same names or third-party articles',()=>{
 assert.equal(matchingDiscussions({hits:[hit,{...hit,url:'https://github.com/other/repo'},{...hit,url:'https://example.com/article'}]},['https://github.com/owner/repo']).length,1);
});
test('old popularity, missing checks and failed searches cannot become current trends',()=>{
 assert.equal(attentionKind(attention,now),'recent');
 assert.equal(attentionKind({...attention,discussions:[{...attention.discussions[0],publishedAt:'2026-03-07T12:00:00Z'}]},now),'historical');
 assert.equal(attentionKind({...attention,status:'failed'},now),'unverified');
 assert.equal(attentionKind(attention,now+3*86400000),'unverified');
 assert.equal(attentionKind({...attention,discussions:[{...attention.discussions[0],points:4,comments:0}]},now),'none');
});
test('single or same-day star observations cannot prove growth',()=>{
 assert.equal(starChange([{at:'2026-10-05T10:00:00Z',stars:25000}]),null);
 assert.equal(starChange([{at:'2026-10-05T09:00:00Z',stars:24000},{at:'2026-10-05T10:00:00Z',stars:25000}]),null);
 assert.equal(starChange([{at:'2026-10-04T09:00:00Z',stars:24000},{at:'2026-10-05T10:00:00Z',stars:25000}])?.change,1000);
});
test('selection retains concrete lessons without calling every imported project featured',()=>{
 assert.deepEqual(lessons.filter(l=>selectionFor(l).featured).map(l=>l.slug).sort(),['excalidraw','tldraw','web-llm','jev-9b-decision-demo','mimo-rl-explorer'].sort());
 assert.match(selectionFor(lessons.find(l=>l.slug==='metaballs')!).reason,/trend olduğu için değil/);
 assert.equal(selectionFor(lessons.find(l=>l.slug==='motion-pad')!).featured,false);
 for(const l of lessons.filter(l=>selectionFor(l).featured)){assert.ok(l.exercise.length&&l.checks.length&&l.tools.length&&l.purpose.source);}
});
test('fresh source-backed AI builds reach the attention queue before the older general pool',()=>{
 const build={id:'new-build',name:'Example',canonicalUrl:'https://github.com/test/new-build',aliases:['https://github.com/test/new-build','https://example.com/demo'],description:'An interactive editor with a public website and clear product description.',creator:'test',category:'developer_tools',firstSeenAt:'2026-10-05T10:00:00Z',lastSeenAt:'2026-10-05T10:00:00Z',updatedAt:'2026-10-05T10:00:00Z',firstPublicRelease:null,sourceIds:['github'],reviewRequired:false,reviewReasons:[]};
 const claim={id:'claim',buildId:build.id,sourceId:'github',sourceRecordId:'repo',field:'ai_tools',value:'Claude Code',status:'Builder-stated',sourceUrl:build.canonicalUrl,quote:'Built with Claude Code.',locator:'$.description',observedAt:'2026-10-05T10:00:00Z',publishedAt:null,contentHash:'hash',rawId:'raw',extractorVersion:'test',rationale:'test',strength:.85,supersedes:null};
 const store:Store={version:1,builds:[build],evidence:[{...claim,status:'Builder-stated'}],raw:[],runs:[],reviews:[],sourceStates:{},dailySnapshots:[]};
 assert.equal([...attentionTargets(store,now).keys()][0],build.canonicalUrl);
});
