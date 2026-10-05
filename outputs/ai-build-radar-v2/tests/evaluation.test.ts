import test from 'node:test';
import assert from 'node:assert/strict';
import {evaluateFeedBuild,evaluateFeed,feedByDevelopmentEvidence} from '../lib/evaluation';
import type {Build,Evidence,Store} from '../lib/schema';

const now=Date.parse('2026-10-05T15:00:00Z');
const build:Build={id:'b1',name:'Example',canonicalUrl:'https://example.com/demo',aliases:['https://github.com/example/demo'],description:'An interactive editor with a working public demo and reusable controls.',creator:null,category:'developer_tools',firstSeenAt:'2026-10-04T12:00:00Z',lastSeenAt:'2026-10-05T12:00:00Z',updatedAt:'2026-10-05T12:00:00Z',firstPublicRelease:null,sourceIds:[],reviewRequired:false,reviewReasons:[]};
function evidence(field:string,sourceId:string,value:string,at='2026-10-05T12:00:00Z'):Evidence{return {id:field+sourceId,buildId:'b1',sourceId,sourceRecordId:field,field,value,status:'Verified',sourceUrl:'https://example.com/source',quote:'72 puan · 35 yorum',locator:'test',observedAt:at,publishedAt:at,contentHash:'hash',rawId:'raw',extractorVersion:'test',rationale:'test',strength:1,supersedes:null};}
function store(rows:Evidence[]):Store{return {version:1,builds:[build],evidence:rows,raw:[],runs:[],reviews:[],sourceStates:{},dailySnapshots:[]};}

test('a fresh editorial mention is news, never proof of momentum',()=>{
 const result=evaluateFeedBuild(store([evidence('editorial_reference','feed-simon','https://example.com/article')]),build,now);
 assert.equal(result?.status,'mentioned');
 assert.equal(result?.signals[0].kind,'mention');
 assert.equal(evaluateFeedBuild(store([{...evidence('editorial_reference','feed-simon','https://example.com/old-article'),publishedAt:null}]),build,now),null);
});
test('old off-topic Lobsters records no longer appear as AI news',()=>{
 const row={...evidence('community_discussion','lobsters','https://lobste.rs/s/example'),rawId:'raw-lobsters'};
 const state=store([row]);
 state.raw.push({id:'raw-lobsters',sourceId:'lobsters',sourceRecordId:'example',url:'https://lobste.rs/s/example',fetchedAt:row.observedAt,hash:'h',payload:{tags:['haskell','show','web']}});
 assert.equal(evaluateFeedBuild(state,build,now),null);
 state.raw[0].payload={tags:['ai','show']};
 assert.equal(evaluateFeedBuild(state,build,now)?.status,'momentum');
});
test('platform trend is a platform-specific interest signal; likes alone are not',()=>{
 assert.equal(evaluateFeedBuild(store([evidence('space_likes','huggingface','200')]),build,now),null);
 const result=evaluateFeedBuild(store([evidence('platform_trending','huggingface','25')]),build,now);
 assert.equal(result?.status,'momentum');
 assert.match(result!.signals[0].label,/platform içi/);
 assert.equal(evaluateFeedBuild(store([evidence('platform_trending','huggingface','25','2026-10-01T12:00:00Z')]),build,now),null);
});
test('a repeated platform snapshot cannot renew an old trend as fresh news',()=>{
 const old={...evidence('platform_trending','huggingface','3','2026-09-20T12:00:00Z'),id:'old'};
 const fresh={...evidence('platform_trending','huggingface','25'),id:'fresh'};
 assert.equal(evaluateFeedBuild(store([old,fresh]),build,now),null);
});
test('a Spaces rank change is shown only with a 24-hour comparison',()=>{
 const old={...evidence('platform_rank','huggingface','9','2026-10-04T11:00:00Z'),id:'rank-old',sourceRecordId:'space'};
 const current={...evidence('platform_rank','huggingface','4'),id:'rank-current',sourceRecordId:'space'};
 const trend={...evidence('platform_trending','huggingface','25'),sourceRecordId:'space'};
 const result=evaluateFeedBuild(store([old,current,trend]),build,now);
 assert.match(result!.signals[0].label,/#4 · 5 sıra yükseldi/);
});
test('unavailable destinations and unsupported source summaries cannot enter the feed',()=>{
 const rows=[evidence('platform_trending','huggingface','25')];
 assert.equal(evaluateFeedBuild(store(rows),{...build,reviewRequired:true},now),null);
 assert.equal(evaluateFeedBuild(store(rows),{...build,description:'Hugging Face üzerinde yayımlanmış etkileşimli demo adayı; çalışma durumu henüz doğrulanmadı.'},now),null);
});
test('a recent builder statement is a discovery, never fabricated momentum',()=>{
 const claim={...evidence('ai_tools','github','Claude Code'),status:'Builder-stated' as const,quote:'Built with Claude Code.',publishedAt:null};
 const result=evaluateFeedBuild(store([claim]),build,now);
 assert.equal(result?.status,'discovered');
 assert.equal(result?.lastEventAt,build.firstSeenAt);
 assert.equal(result?.aiStatus,'Builder-stated');
 assert.equal(feedByDevelopmentEvidence(evaluateFeed(store([claim]),now),'ai').length,1);
 assert.equal(feedByDevelopmentEvidence(evaluateFeed(store([claim]),now),'uncertain').length,0);
 assert.equal(evaluateFeedBuild(store([claim]),{...build,firstSeenAt:'2026-09-01T12:00:00Z'},now),null);
});
test('an AI product trend without a builder claim stays in the uncertain group',()=>{
 const feed=evaluateFeed(store([evidence('platform_trending','huggingface','25')]),now);
 assert.equal(feedByDevelopmentEvidence(feed,'ai').length,0);
 assert.equal(feedByDevelopmentEvidence(feed,'uncertain').length,1);
});
test('obsolete false-positive tool evidence cannot promote a catalog to AI-built',()=>{
 const row={...evidence('ai_tools','github','Lovable'),status:'Builder-stated' as const,quote:'A checklist for apps built with Lovable, Cursor and other tools.',publishedAt:null};
 assert.equal(evaluateFeedBuild(store([row]),build,now),null);
});
test('a tool-only repo description is not a meaningful product explanation',()=>{
 const row={...evidence('ai_tools','github','Lovable'),status:'Builder-stated' as const,quote:'Built with Lovable for a hackathon.',publishedAt:null};
 assert.equal(evaluateFeedBuild(store([row]),{...build,description:'Built with Lovable for a hackathon.'},now),null);
});
