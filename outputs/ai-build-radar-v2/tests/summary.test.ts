import test from 'node:test';
import assert from 'node:assert/strict';
import {summaryRequest,summaryOutput} from '../lib/summary-contract';
import {summaryProviderReady,generateSummary} from '../lib/summary-provider';
test('only registered IDs and supported languages enter summary requests',()=>{assert.ok(summaryRequest.safeParse({entryId:'a'.repeat(20),language:'ja'}).success);assert.equal(summaryRequest.safeParse({entryId:'a'.repeat(20),language:'tr',url:'http://localhost'}).success,false);assert.equal(summaryRequest.safeParse({entryId:'url',language:'tr'}).success,false);});
test('provider is explicitly disabled and never fabricates output',async()=>{assert.equal(summaryProviderReady(),false);await assert.rejects(()=>generateSummary('content','tr'),/NOT_CONFIGURED/);});
test('generated summaries are bounded and structured',()=>{assert.equal(summaryOutput.safeParse({summary:'x'.repeat(1601),points:['Point here']}).success,false);assert.equal(summaryOutput.safeParse({summary:'x'.repeat(40),points:[]}).success,false);});
