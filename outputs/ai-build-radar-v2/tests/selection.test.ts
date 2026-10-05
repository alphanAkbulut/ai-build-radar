import test from 'node:test';
import assert from 'node:assert/strict';
import {lessons} from '../lib/lessons';
import {selectionFor} from '../lib/selection';
const l=lessons.find(l=>l.slug==='excalidraw')!;
const now=Date.parse('2026-10-05T18:00:00Z');
const review={level:'interaction',url:l.site,finding:'Shape creation and undo checked',checkedAt:'2026-10-05T13:00:00Z'};
test('selection needs actual recent interaction evidence',()=>{
 assert.equal(selectionFor(l,review,now).featured,true);
 for(const r of [{...review,level:'source'},{...review,checkedAt:'2025-01-01'},{...review,checkedAt:'2027-01-01'},{...review,finding:''}])assert.equal(selectionFor(l,r,now).featured,false);
});
test('demo evidence does not compensate for missing learning content',()=>{
 assert.equal(selectionFor({...l,exercise:[]},review,now).featured,false);
 assert.equal(selectionFor({...l,purpose:{...l.purpose,source:''}},review,now).featured,false);
 assert.equal(selectionFor({...l,media:undefined,buildId:undefined},review,now).featured,false);
 assert.equal(selectionFor({...l,media:{url:'https://example.com/hero.png',label:'Repo görseli',sourceUrl:'https://example.com'}},review,now).featured,false);
});
