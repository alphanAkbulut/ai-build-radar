import test from 'node:test';
import assert from 'node:assert/strict';
import {developmentScope} from '../lib/development-scope';

test('Glow Pulse statement attributes the project to Lovable without claiming every line was generated',()=>{
 const claim=developmentScope('Glow Pulse Health — A sleek, AI-generated health dashboard for tracking vital wellness metrics and trends. Built with Lovable AI and easily deployable via Lovable.','Lovable');
 assert.equal(claim.kind,'project-claimed');
 assert.match(claim.summary,/Hangi parçaların üretildiği/);
});

test('explicit whole-project and feature-specific statements retain their different scopes',()=>{
 assert.equal(developmentScope('Built entirely with Claude Code.','Claude Code').kind,'full-claimed');
 assert.equal(developmentScope('Used Claude Code for the mobile navigation.','Claude Code').kind,'part-claimed');
 assert.equal(developmentScope('The interface was built with Cursor.','Cursor').kind,'part-claimed');
});

test('a tool name without a development claim has unspecified scope',()=>{
 assert.equal(developmentScope('Lovable is mentioned in a list of design tools.','Lovable').kind,'unspecified');
 assert.equal(developmentScope('Built with Cursor.','Lovable').kind,'unspecified');
});
