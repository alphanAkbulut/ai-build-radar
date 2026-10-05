import {test} from 'node:test';
import assert from 'node:assert/strict';
import {parseFeed,huggingFaceCandidates,publicationReferenceAllowed,recentPublicationReference} from '../lib/discovery-collectors';
import {discoverySources,discoveryMinimum,launchDiscoveryTarget} from '../lib/sources';
import {aiDiscussionTags} from '../lib/relevance';
import publications from '../content/publications.json';
import watchlist from '../content/people-watchlist.json';
test('independent discovery coverage never drops below ten and launch target is 25',()=>{assert.equal(discoveryMinimum,10);assert.equal(launchDiscoveryTarget,25);assert.ok(discoverySources.length>=10);assert.equal(new Set(discoverySources.map(s=>s.url)).size,discoverySources.length);for(const id of ['github','hn','onesvibe'])assert.ok(discoverySources.some(s=>s.id===id));});
test('RSS extracts explicit project references without treating articles or social links as builds',async()=>{const r=await parseFeed('<rss><channel><item><title>Example</title><link>https://blog.example/post</link><description><![CDATA[<a href="https://github.com/user/repo/tree/main">Project</a><a href="https://github.com/user/repo">Again</a><a href="https://x.com/person">Author</a><a href="https://huggingface.co/spaces/u/demo">Demo</a>]]></description></item></channel></rss>');assert.equal(r.fetched,1);assert.equal(r.references.length,2);assert.equal(r.references[0].article,'https://blog.example/post');assert.equal(r.references[0].url,'https://github.com/user/repo');});
test('Atom namespace and CDATA work; empty source is valid, malformed input is failure',async()=>{const r=await parseFeed('<feed xmlns="http://www.w3.org/2005/Atom"><entry><title>X</title><link href="https://example.com/a"/><content type="html">&lt;a href="https://github.com/a/b"&gt;B&lt;/a&gt;</content></entry></feed>');assert.equal(r.references.length,1);assert.equal((await parseFeed('<rss><channel/></rss>')).references.length,0);await assert.rejects(parseFeed('<html/>'));await assert.rejects(parseFeed('<!DOCTYPE rss><rss/>'));});
test('new publication sources are independent and broad publications exclude unrelated links',()=>{
 assert.equal(publications.length,10);
 for(const publication of publications)assert.ok(discoverySources.some(source=>source.id==='publication-'+publication.id&&source.url===publication.url));
 assert.equal(publicationReferenceAllowed('Distributed databases with Peter Mattis',true),false);
 assert.equal(publicationReferenceAllowed('A business model for small teams',true),false);
 assert.equal(publicationReferenceAllowed('Advanced evals: AI failures in your product',true),true);
 assert.equal(publicationReferenceAllowed('Designing an AI agent interface',true),true);
 const now=Date.parse('2026-10-05T12:00:00Z');
 assert.equal(recentPublicationReference('2024-10-05T12:00:00Z',now),false);
 assert.equal(recentPublicationReference(null,now),false);
 assert.equal(recentPublicationReference('2026-09-22T12:00:00Z',now),true);
});
test('RSS dates survive RFC 822 day names containing T',async()=>{
 const r=await parseFeed('<rss><channel><item><title>AI tools</title><link>https://example.com/a</link><pubDate>Thu, 01 Oct 2026 10:00:00 +0000</pubDate><description><![CDATA[<a href="https://github.com/a/b">Project</a>]]></description></item></channel></rss>');
 assert.equal(r.references[0].publishedAt,'2026-10-01T10:00:00+00:00');
});
test('the user research watchlist has thirty unique names and only verified feeds claim active monitoring',()=>{
 const names=watchlist.groups.flatMap(group=>group.names);assert.equal(names.length,30);assert.equal(new Set(names).size,30);
 for(const feed of watchlist.verifiedPublicationFeeds)assert.ok(names.includes(feed.name)&&discoverySources.some(source=>source.id===feed.sourceId));
});
test('popular Spaces never inherit a trend claim unless present in the trend response',()=>{
 const batch=huggingFaceCandidates([{id:'a/popular',likes:900,trendingScore:5}],[{id:'b/trending',likes:30,trendingScore:12}]);
 const popular=batch.candidates.find(c=>c.recordId==='a/popular')!;
 const trending=batch.candidates.find(c=>c.recordId==='b/trending')!;
 assert.equal(popular.claims.some(c=>c.field==='platform_trending'),false);
 assert.equal(trending.claims.find(c=>c.field==='platform_rank')?.value,'1');
 assert.equal(trending.claims.find(c=>c.field==='platform_trending')?.value,'12');
});
test('general technology labels do not establish AI relevance',()=>{
 assert.equal(aiDiscussionTags(['show','web','haskell']),false);
 assert.equal(aiDiscussionTags(['show','AI']),true);
 assert.equal(aiDiscussionTags(['ml','programming']),true);
});
