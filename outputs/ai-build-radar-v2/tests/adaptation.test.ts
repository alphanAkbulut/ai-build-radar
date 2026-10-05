import test from 'node:test';
import assert from 'node:assert/strict';
import {adaptationState,type AdaptationCheck} from '../lib/adaptation';
import {lessons} from '../lib/lessons';
test('demo observation alone never enables adaptation',()=>{for(const l of lessons)assert.equal(adaptationState(l).enabled,false);});
test('only complete matching reproduction evidence enables adaptation',()=>{const l=lessons[0];const record:AdaptationCheck={recipe:JSON.stringify([l.title,l.exercise,l.checks,l.tools]),environment:'React desktop and mobile',testedAt:'2026-10-01',reportUrl:'/reports/example',checks:l.checks.map(name=>({name,passed:true}))};assert.equal(adaptationState(l,record).enabled,true);assert.equal(adaptationState(l,{...record,checks:[]}).enabled,false);assert.equal(adaptationState(l,{...record,recipe:'old'}).enabled,false);assert.equal(adaptationState(l,{...record,reportUrl:''}).enabled,false);assert.equal(adaptationState(l,{...record,checks:[...record.checks,{name:'Regression',passed:false}]}).enabled,false);});
