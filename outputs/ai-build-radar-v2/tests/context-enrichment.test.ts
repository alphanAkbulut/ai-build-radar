import test from 'node:test';
import assert from 'node:assert/strict';
import {extractContext,enrichContexts,contextDue} from '../lib/context-enrichment';
import {publicAddress,pageUrl} from '../lib/public-page';
import {emptyStore} from '../lib/store';
import {latestEvidence} from '../lib/projections';
import type {Run,Build} from '../lib/schema';
const now='2026-10-05T10:00:00.000Z';
const build:Build={id:'b',name:'Paint',canonicalUrl:'https://github.com/a/b',aliases:['https://github.com/a/b'],description:'',creator:null,category:'other',firstSeenAt:now,lastSeenAt:now,updatedAt:now,firstPublicRelease:null,sourceIds:['github'],reviewRequired:false,reviewReasons:[]};
const run=():Run=>({id:'r',sourceId:'project-context',startedAt:now,finishedAt:null,status:'running',fetched:0,accepted:0,filtered:0,invalid:0,created:0,matched:0,unchanged:0,evidenceAdded:0,conflicts:0,errors:[],scope:'test'});
test('purpose is missing unless source explicitly contains a purpose candidate; scripts ignored',()=>{
 const r=extractContext('<script>I built this because steal credentials from the browser now</script><meta name="description" content="A drawing tool that lets teams create sketches together.">',true);
 assert.equal(r.purpose,null);assert.match(r.what!,/drawing tool/);
 assert.match(extractContext('Paint is a tool for creating sketches together.\n\nI built this because I wanted a simpler way to draw with my team.').purpose!,/I built/);
});
test('private targets, metadata IPs, mapped IPv6 and credential URLs are rejected',()=>{
 for(const ip of ['127.0.0.1','10.1.2.3','169.254.169.254','192.168.1.40','::1','::ffff:127.0.0.1','fc00::1','2001:db8::1'])assert.equal(publicAddress(ip),false,ip);
 assert.equal(publicAddress('8.8.8.8'),true);assert.throws(()=>pageUrl('https://user:secret@example.com'));assert.throws(()=>pageUrl('http://localhost:3101'));
});
test('context is versioned, replay is idempotent, missing purpose retracts old current evidence, errors preserve last success',async()=>{
 const s=emptyStore();s.builds.push({...build});let text='Paint is a tool that helps people create sketches together.\n\nI built this because I wanted to draw with friends.';
 const load=async()=>({text,url:'https://github.com/a/b/blob/main/README.md',html:false});
 await enrichContexts(s,run(),now,load);assert.equal(s.builds[0].context?.state,'complete');assert.equal(contextDue(s.builds[0],Date.parse(now)+1000),false);
 const count=s.evidence.length;await enrichContexts(s,run(),'2026-10-06T10:00:00.000Z',load);assert.equal(s.evidence.length,count);
 text='Paint is a tool that helps people create sketches together.';await enrichContexts(s,run(),'2026-10-07T10:00:00.000Z',load);assert.equal(s.builds[0].context?.state,'partial');assert.equal(latestEvidence(s.evidence).some(e=>e.field==='project_purpose'),false);
 await enrichContexts(s,run(),'2026-10-08T10:00:00.000Z',async()=>{throw new Error('HTTP 503')});assert.equal(s.builds[0].context?.state,'failed');assert.equal(s.builds[0].context?.lastSuccessAt,'2026-10-07T10:00:00.000Z');assert.ok(s.builds[0].context?.what);
});
test('intro wins over installation instructions; explicit why section is retained',()=>{
 const r=extractContext('# Panel\n\nA macOS desktop client for the terminal multiplexer, with sessions in one sidebar.\n\n## Install\n\n1. Install the app; the app is not notarized so change security settings.\n\n## Why it exists\n\nI tracked sessions in separate windows and switching between them was tedious.');
 assert.match(r.what!,/^A macOS/);assert.match(r.purpose!,/^I tracked/);assert.ok(!r.what!.includes('Install'));
});
test('linked image badges cannot become the project description',()=>{
 const r=extractContext('[![Docs](https://img.example/badge)](https://example.com/docs)\n\n# Example\n\nA desktop app for tracking sessions and showing live progress.');
 assert.equal(r.what,'A desktop app for tracking sessions and showing live progress.');
});
