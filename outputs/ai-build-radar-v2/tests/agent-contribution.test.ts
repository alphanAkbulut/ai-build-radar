import test from 'node:test';
import assert from 'node:assert/strict';
import {verifiedAgentContribution} from '../lib/agent-contribution';
import {buildView} from '../lib/projections';
import type {Evidence,Store} from '../lib/schema';

const at='2026-10-06T10:00:00Z';
const commit='https://github.com/example/demo/commit/'+'a'.repeat(40);
const trace:Evidence={id:'agent-1',buildId:'demo',sourceId:'github',sourceRecordId:'agent-change',field:'agent_contribution',value:'GitHub Copilot cloud agent',status:'Verified',sourceUrl:commit,quote:'The agent authored this commit; the linked session shows this change.',locator:'https://github.com/example/demo/agents/sessions/123',observedAt:at,publishedAt:at,contentHash:'hash',rawId:'raw',extractorVersion:'reviewed',rationale:'Commit author and linked agent session checked.',strength:1,supersedes:null};
const build={id:'demo',name:'Demo',canonicalUrl:'https://example.com',aliases:[],description:'Demo',creator:null,category:'other',firstSeenAt:at,lastSeenAt:at,updatedAt:at,firstPublicRelease:null,sourceIds:['github'],reviewRequired:false,reviewReasons:[]};
function store(evidence:Evidence[]):Store{return {version:1,builds:[build],evidence,raw:[],runs:[],reviews:[],sourceStates:{},dailySnapshots:[]};}

test('a scoped direct agent trace makes a contribution visible',()=>{
 assert.equal(verifiedAgentContribution(store([trace]),'demo')?.id,trace.id);
 assert.equal(buildView(store([trace]),'demo').aiStatus,'Verified');
});

test('generic signed commits, statements, and incomplete traces never get the agent badge',()=>{
 assert.equal(verifiedAgentContribution(store([{...trace,field:'repository'}]),'demo'),null);
 assert.equal(verifiedAgentContribution(store([{...trace,status:'Builder-stated'}]),'demo'),null);
 assert.equal(verifiedAgentContribution(store([{...trace,locator:'Verified signature'}]),'demo'),null);
 assert.equal(verifiedAgentContribution(store([{...trace,locator:'https://github.com/example/demo'}]),'demo'),null);
 assert.equal(verifiedAgentContribution(store([{...trace,sourceUrl:'https://github.com/example/demo'}]),'demo'),null);
 assert.equal(buildView(store([{...trace,field:'repository'}]),'demo').aiStatus,'Unknown');
});

test('a later observation that removes the direct trace removes the badge',()=>{
 const withdrawn={...trace,id:'agent-2',status:'Unknown' as const,observedAt:'2026-10-06T11:00:00Z'};
 assert.equal(verifiedAgentContribution(store([trace,withdrawn]),'demo'),null);
});
