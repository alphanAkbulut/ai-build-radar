import test from 'node:test';
import assert from 'node:assert/strict';
import {sourceSignals} from '../lib/source-signals';
import {emptyStore} from '../lib/store';
import {projectLinks} from '../lib/community-collectors';
test('non-Hacker News references surface without a Hacker News score',()=>{const store=emptyStore();const evidence={buildId:'a',sourceId:'devcommunity',sourceRecordId:'1',field:'editorial_reference',sourceUrl:'https://dev.to/example',observedAt:'2026-10-05T12:00:00Z',publishedAt:'2026-10-04T12:00:00Z',quote:'Reference'};store.evidence.push(evidence as typeof store.evidence[number]);const result=sourceSignals(store,'a');assert.equal(result.length,1);assert.equal(result[0].source,'DEV Community');assert.equal(result[0].label,'Yayında proje bağlantısı');assert.equal(sourceSignals(store,'b').length,0);});
test('repository links are deduplicated; platform navigation is not a project',()=>{assert.deepEqual(projectLinks('https://github.com/a/b https://github.com/a/b/issues https://github.com/topics/ai'),['https://github.com/a/b']);});
