import test from 'node:test';
import assert from 'node:assert/strict';
import contexts from '../content/project-context.json';
import {lessons} from '../lib/lessons';
test('every curated lesson has source-backed context for cards and details',()=>{
 assert.deepEqual(Object.keys(contexts).sort(),lessons.map(l=>l.slug).sort());
 for(const l of lessons){
  for(const field of ['kind','headline','what','why','excerpt','audience','application','checkedAt'] as const)assert.ok(l.purpose[field].trim(),`${l.slug}: ${field}`);
  assert.ok(['personal','product'].includes(l.purpose.whyBasis));
  assert.equal(new URL(l.purpose.source).protocol,'https:');
  assert.ok(l.purpose.source===l.site||l.purpose.source.startsWith(l.repo+'/')||l.sources?.some(s=>s.url===l.purpose.source),l.slug);
  assert.ok(Number.isFinite(Date.parse(l.purpose.checkedAt)));
 }
});
