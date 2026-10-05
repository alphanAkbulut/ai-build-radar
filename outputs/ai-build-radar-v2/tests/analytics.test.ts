import test from 'node:test';
import assert from 'node:assert/strict';
import {analyticsEvent,summarize} from '../lib/analytics';
const event={id:'ad9e6a16-7ec7-4c81-8ad7-a2cc55b1dc8b',action:'try' as const,slug:'motion-pad',at:'2026-10-05T00:00:00Z'};
test('analytics rejects arbitrary identifiers and sensitive extra fields',()=>{const {at,...input}=event;assert.equal(analyticsEvent.safeParse(input).success,true);assert.equal(analyticsEvent.safeParse({...input,ip:'127.0.0.1'}).success,false);assert.equal(analyticsEvent.safeParse({...input,slug:'../../secret'}).success,false);assert.equal(analyticsEvent.safeParse({...input,action:'password'}).success,false);});
test('replayed event ids are counted once and actions remain separate',()=>{const rows=summarize([event,event,{...event,id:'b',action:'learn'}]);assert.deepEqual(rows,[{slug:'motion-pad',try:1,learn:1}]);assert.deepEqual(summarize([]),[]);});
