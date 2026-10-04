import test from 'node:test';
import assert from 'node:assert/strict';
import {updateSummary} from '../lib/update-summary';
import type {Run} from '../lib/schema';
const run=(id:string,status:Run['status'],at:string):Run=>({id,status,sourceId:'github',startedAt:at,finishedAt:at,fetched:10,accepted:10,filtered:0,invalid:0,created:2,matched:8,unchanged:6,evidenceAdded:12,conflicts:0,errors:[],scope:'test'});
test('latest failed attempt does not replace last successful timestamp',()=>{const s=updateSummary([run('ok','completed','2026-10-04T10:00:00Z'),run('fail','failed','2026-10-04T11:00:00Z')]);assert.equal(s.latest?.status,'failed');assert.equal(s.lastSuccess,'2026-10-04T10:00:00Z');assert.equal(s.recent[1].evidenceAdded,12);});
test('empty history has no invented update date',()=>{assert.deepEqual(updateSummary([]),{latest:null,lastSuccess:null,recent:[]});});
