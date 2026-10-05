import test from 'node:test';
import assert from 'node:assert/strict';
import {attentionKind,matchingDiscussions,starChange,type Attention} from '../lib/attention';
import {selectionFor} from '../lib/selection';
import {lessons} from '../lib/lessons';
const now=Date.parse('2026-10-05T12:00:00Z');
const hit={objectID:'123',title:'Example',url:'https://github.com/owner/repo',created_at:'2026-10-04T12:00:00Z',points:100,num_comments:25};
const attention:Attention={checkedAt:'2026-10-05T10:00:00Z',nextCheckAt:'2026-10-06T10:00:00Z',status:'completed',discussions:matchingDiscussions({hits:[hit]},['https://github.com/owner/repo'])};
test('only exact project URLs establish a discussion link, not same names or third-party articles',()=>{
 assert.equal(matchingDiscussions({hits:[hit,{...hit,url:'https://github.com/other/repo'},{...hit,url:'https://example.com/article'}]},['https://github.com/owner/repo']).length,1);
});
test('old popularity, missing checks and failed searches cannot become current trends',()=>{
 assert.equal(attentionKind(attention,now),'recent');
 assert.equal(attentionKind({...attention,discussions:[{...attention.discussions[0],publishedAt:'2026-03-07T12:00:00Z'}]},now),'historical');
 assert.equal(attentionKind({...attention,status:'failed'},now),'unverified');
 assert.equal(attentionKind(attention,now+3*86400000),'unverified');
 assert.equal(attentionKind({...attention,discussions:[{...attention.discussions[0],points:4,comments:0}]},now),'none');
});
test('single or same-day star observations cannot prove growth',()=>{
 assert.equal(starChange([{at:'2026-10-05T10:00:00Z',stars:25000}]),null);
 assert.equal(starChange([{at:'2026-10-05T09:00:00Z',stars:24000},{at:'2026-10-05T10:00:00Z',stars:25000}]),null);
 assert.equal(starChange([{at:'2026-10-04T09:00:00Z',stars:24000},{at:'2026-10-05T10:00:00Z',stars:25000}])?.change,1000);
});
test('selection retains concrete lessons without calling every imported project featured',()=>{
 assert.equal(lessons.filter(l=>selectionFor(l).featured).length,7);
 assert.match(selectionFor(lessons.find(l=>l.slug==='metaballs')!).reason,/trend olduğu için değil/);
 assert.equal(selectionFor(lessons.find(l=>l.slug==='motion-pad')!).featured,false);
 for(const l of lessons.filter(l=>selectionFor(l).featured)){assert.ok(l.exercise.length&&l.checks.length&&l.tools.length&&l.purpose.source);}
});
