import test from 'node:test';
import assert from 'node:assert/strict';
import {parseNewsFeed,ingestNewsArticles,linkedNewsBuilds} from '../lib/news-collector';
import {emptyStore} from '../lib/store';
import {dailyBriefing} from '../lib/briefing';
import type {Run} from '../lib/schema';

const now='2026-10-05T12:00:00.000Z';
const run=():Run=>({id:'news-run',sourceId:'news-techcrunch-ai',startedAt:now,finishedAt:null,status:'running',fetched:0,accepted:0,filtered:0,invalid:0,created:0,matched:0,unchanged:0,evidenceAdded:0,conflicts:0,errors:[],scope:'test'});

test('RSS news preserves publisher date, deduplicates rescans, and never creates builds',async()=>{
 const xml='<rss><channel><item><title>AI model update</title><link>https://example.com/article?utm_source=feed</link><pubDate>Mon, 05 Oct 2026 10:00:00 GMT</pubDate></item></channel></rss>';
 const parsed=await parseNewsFeed(xml);assert.equal(parsed.fetched,1);
 const store=emptyStore(),first=run();ingestNewsArticles(store,first,parsed.articles,first.sourceId,false,now);
 assert.equal(first.created,1);assert.equal(store.builds.length,0);assert.equal(store.newsEvents?.[0]?.publishedAt,'2026-10-05T10:00:00.000Z');
 const second=run();ingestNewsArticles(store,second,parsed.articles,second.sourceId,false,'2026-10-06T12:00:00.000Z');
 assert.equal(second.created,0);assert.equal(second.matched,1);assert.equal(second.unchanged,1);assert.equal(store.newsEvents?.length,1);
 assert.equal(dailyBriefing(store,Date.parse('2026-10-08T12:00:00.000Z')).news.length,0);
});

test('stale, future, and unrelated broad-feed articles do not become current news',()=>{
 const store=emptyStore(),r=run();ingestNewsArticles(store,r,[
  {title:'AI news',url:'https://example.com/old',publishedAt:'2026-09-01T10:00:00Z'},
  {title:'AI news',url:'https://example.com/future',publishedAt:'2026-10-06T10:00:00Z'},
  {title:'Database internals',url:'https://example.com/unrelated',publishedAt:'2026-10-05T10:00:00Z'},
 ],r.sourceId,true,now);
 assert.equal(r.created,0);assert.equal(r.filtered,3);
});

test('article links are preserved, exact existing builds are linked, and unknown links do not create builds',async()=>{
 const xml='<rss><channel><item><title>New AI tools</title><link>https://publisher.example/story</link><pubDate>Mon, 05 Oct 2026 10:00:00 GMT</pubDate><description><![CDATA[<p>Two teams release AI tools.</p><a href="https://github.com/team/known/blob/main/readme.md">Known project</a><a href="https://github.com/team/new">New project</a><a href="https://publisher.example/about">Publisher</a>]]></description></item></channel></rss>';
 const parsed=await parseNewsFeed(xml);
 assert.deepEqual(parsed.articles[0].references?.map(ref=>ref.url),['https://github.com/team/known','https://github.com/team/new']);
 assert.match(parsed.articles[0].excerpt||'',/Two teams release AI tools/);
 const store=emptyStore();store.builds.push({id:'known',name:'Known',canonicalUrl:'https://github.com/team/known',aliases:[],description:'Demo',creator:null,category:'Tools',firstSeenAt:now,lastSeenAt:now,updatedAt:now,firstPublicRelease:null,sourceIds:[],reviewRequired:false,reviewReasons:[]});
 ingestNewsArticles(store,run(),parsed.articles,'news-techcrunch-ai',false,now);
 assert.equal(store.builds.length,1);
 assert.deepEqual(linkedNewsBuilds(store.newsEvents![0],store).map(build=>build.id),['known']);
 assert.equal(store.newsEvents?.[0].references?.length,2);
 assert.match(store.newsEvents?.[0].excerpt||'',/Two teams release AI tools/);
 const updated=run();ingestNewsArticles(store,updated,[{...parsed.articles[0],excerpt:'A corrected publisher description'}],updated.sourceId,false,now);
 assert.equal(updated.matched,1);assert.equal(updated.unchanged,0);
});
