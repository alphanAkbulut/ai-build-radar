import test from 'node:test';
import assert from 'node:assert/strict';
import {parseGitHubTrending,relevantTrendingLeads} from '../lib/github-trending';
import {evaluateFeedBuild} from '../lib/evaluation';
import type {Build,Evidence,Store} from '../lib/schema';

const repoHtml=`<article class="Box-row"><h2 class="h3 lh-condensed"><a href="/maker/agent-canvas">agent-canvas</a></h2><p class="col-9 color-fg-muted my-1 tmp-pr-4">An AI agent canvas for teams.</p><span>1,234 stars today</span></article><article class="Box-row"><h2><a href="/team/weather">weather</a></h2><p class="col-9 color-fg-muted my-1">Weather app</p><span>24 stars today</span></article>`;
const developerHtml=`<article class="Box-row d-flex"><h1><a href="/maker">Maker</a></h1><article>Popular repo<h1><a data-ga-click="Explore, go to repository, location:trending developers" href="/maker/agent-canvas">agent-canvas</a></h1><div class="f6 color-fg-muted mt-1">An AI agent canvas for teams.</div></article></article><article class="Box-row d-flex"><h1><a href="/other">Other</a></h1><article>Popular repo<h1><a data-ga-click="Explore, go to repository, location:trending developers" href="/other/terminal">terminal</a></h1><div class="f6 color-fg-muted mt-1">Terminal colors</div></article></article>`;

test('GitHub Trending keeps repository rank, daily stars, and developer-associated repo distinct',()=>{
 const repos=parseGitHubTrending(repoHtml,'repositories');
 const developers=parseGitHubTrending(developerHtml,'developers');
 assert.deepEqual(repos.map(x=>[x.repo,x.rank,x.starsToday]),[['maker/agent-canvas',1,1234],['team/weather',2,24]]);
 assert.equal(developers[0].repo,'maker/agent-canvas');
 assert.equal(developers[0].starsToday,null);
 const selected=relevantTrendingLeads(repos,developers);
 assert.deepEqual(selected.map(x=>x.page),['repositories','developers']);
 assert.throws(()=>parseGitHubTrending('<html>changed layout</html>','repositories'),/layout missing/);
});

test('GitHub daily listing is attention, developer listing is only a mention, neither proves AI-built',()=>{
 const now=Date.parse('2026-10-05T15:00:00Z');
 const build:Build={id:'b',name:'Agent Canvas',canonicalUrl:'https://example.com',aliases:['https://github.com/maker/agent-canvas'],description:'A usable visual canvas for controlling several AI agents together.',creator:'maker',category:'developer_tools',firstSeenAt:'2026-10-05T10:00:00Z',lastSeenAt:'2026-10-05T12:00:00Z',updatedAt:'2026-10-05T12:00:00Z',firstPublicRelease:null,sourceIds:['github-trending'],reviewRequired:false,reviewReasons:[]};
 const evidence=(field:string,value:string):Evidence=>({id:field,buildId:'b',sourceId:'github-trending',sourceRecordId:field,field,value,status:'Verified',sourceUrl:field==='github_trending_daily'?'https://github.com/trending':'https://github.com/trending/developers',quote:field==='github_trending_daily'?'GitHub Trending günlük repo listesi #1 · 1,234 bugün yıldız':'GitHub Trending geliştirici listesinde popüler repo #1',locator:'test',observedAt:'2026-10-05T12:00:00Z',publishedAt:null,contentHash:'h',rawId:'r',extractorVersion:'test',rationale:'test',strength:.75,supersedes:null});
 const store=(rows:Evidence[]):Store=>({version:1,builds:[build],evidence:rows,raw:[],runs:[],reviews:[],sourceStates:{},dailySnapshots:[]});
 const daily=evaluateFeedBuild(store([evidence('github_trending_daily','1')]),build,now);
 assert.equal(daily?.status,'momentum');assert.equal(daily?.aiStatus,'Unknown');
 const developer=evaluateFeedBuild(store([evidence('github_trending_developer','1')]),build,now);
 assert.equal(developer?.status,'mentioned');assert.equal(developer?.aiStatus,'Unknown');
 assert.equal(evaluateFeedBuild(store([evidence('github_trending_daily','1')]),{...build,canonicalUrl:'https://github.com/maker/agent-canvas',aliases:[]},now),null);
});
