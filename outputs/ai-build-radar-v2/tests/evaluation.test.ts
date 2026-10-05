import test from 'node:test';
import assert from 'node:assert/strict';
import {evaluateFeedBuild} from '../lib/evaluation';
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
test('platform trend is a platform-specific interest signal; likes alone are not',()=>{
 assert.equal(evaluateFeedBuild(store([evidence('space_likes','huggingface','200')]),build,now),null);
 const result=evaluateFeedBuild(store([evidence('platform_trending','huggingface','25')]),build,now);
 assert.equal(result?.status,'momentum');
 assert.match(result!.signals[0].label,/platform içi/);
 assert.equal(evaluateFeedBuild(store([evidence('platform_trending','huggingface','25','2026-10-01T12:00:00Z')]),build,now),null);
});
test('unavailable destinations and unsupported source summaries cannot enter the feed',()=>{
 const rows=[evidence('platform_trending','huggingface','25')];
 assert.equal(evaluateFeedBuild(store(rows),{...build,reviewRequired:true},now),null);
 assert.equal(evaluateFeedBuild(store(rows),{...build,description:'Hugging Face üzerinde yayımlanmış etkileşimli demo adayı; çalışma durumu henüz doğrulanmadı.'},now),null);
});
