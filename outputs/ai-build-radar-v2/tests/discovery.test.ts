import test from 'node:test';
import assert from 'node:assert/strict';
import {destinations,categoryFor,discoveryUrl,aiGroup} from '../lib/discovery';
test('homepage is primary and repository remains separate',()=>{assert.deepEqual(destinations({canonicalUrl:'https://github.com/example/project',aliases:['https://example.org'],reviewRequired:false}),{siteUrl:'https://example.org',codeUrl:'https://github.com/example/project'});});
test('repository only does not masquerade as a website',()=>{assert.equal(destinations({canonicalUrl:'https://github.com/example/project',aliases:[],reviewRequired:false}).siteUrl,null);});
test('ambiguous entity and unsafe URLs cannot become homepage actions',()=>{assert.equal(destinations({canonicalUrl:'https://example.org',aliases:[],reviewRequired:true}).siteUrl,null);assert.equal(destinations({canonicalUrl:'javascript:alert(1)',aliases:['https://user:secret@example.org'],reviewRequired:false}).siteUrl,null);});
test('discovery categories preserve original classification',()=>{const b={name:'A puzzle game',description:'Play together',category:'other'};assert.equal(categoryFor(b).id,'games');assert.equal(categoryFor(b).sourceCategory,'other');assert.equal(b.category,'other');});
test('category navigation preserves search and resets pagination',()=>{assert.equal(discoveryUrl('/builds',{q:'puzzle',page:'3',source:'github'},{category:'games'}),'/builds?q=puzzle&source=github&category=games');});

test("only direct AI evidence or maker statements enter AI group",()=>{assert.equal(aiGroup("Verified"),"ai");assert.equal(aiGroup("Builder-stated"),"ai");assert.equal(aiGroup("Derived"),"uncertain");assert.equal(aiGroup("Unknown"),"uncertain");});
