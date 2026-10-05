import test from 'node:test';
import assert from 'node:assert/strict';
import {publishableDemoIds,publishableFeed} from '../lib/publication';
import type {Build,Store} from '../lib/schema';
import type {FeedCard} from '../lib/evaluation';

const now=Date.parse('2026-10-06T12:00:00Z');
function build(id:string,site:string):Build{return {id,name:id,canonicalUrl:site,aliases:[site],description:'A project with a distinct public interface and a documented purpose.',creator:null,category:'ai_agents',firstSeenAt:'2026-10-05T12:00:00Z',lastSeenAt:'2026-10-05T12:00:00Z',updatedAt:'2026-10-05T12:00:00Z',firstPublicRelease:null,sourceIds:['github'],reviewRequired:false,reviewReasons:[]};}
const tested=build('build_fb013c914eb7068cbc7a395e','https://huggingface.co/spaces/autotrust/jev-9b-decision-demo');
const inaccessible=build('build_dcce5037ed2cbbd9e72d52eb','https://preview--younes-dev.lovable.app');
function store(builds:Build[]):Store{return {version:1,builds,evidence:[],raw:[],runs:[],reviews:[],sourceStates:{},dailySnapshots:[]};}
function card(b:Build):FeedCard{return {id:b.id,name:b.name,description:b.description,category:'AI',siteUrl:b.canonicalUrl,signals:[],status:'discovered',lastEventAt:b.firstSeenAt,firstSeenAt:b.firstSeenAt,aiStatus:'Builder-stated',aiEvidence:null,tools:['Lovable']};}

test('a builder statement and URL cannot publish an untested or inaccessible product',()=>{
 const data=store([tested,inaccessible]);
 const ids=publishableDemoIds(data,now);
 assert.equal(ids.has(tested.id),true);
 assert.equal(ids.has(inaccessible.id),false);
 const feed=publishableFeed({momentum:[],mentioned:[],discovered:[card(tested),card(inaccessible)]},data,now);
 assert.deepEqual(feed.discovered.map(c=>c.id),[tested.id]);
});

test('a reviewed demo must match the build destination and have a current interaction check',()=>{
 assert.equal(publishableDemoIds(store([build(tested.id,'https://example.com/other')]),now).has(tested.id),false);
 assert.equal(publishableDemoIds(store([tested]),Date.parse('2026-11-10T12:00:00Z')).has(tested.id),false);
});
