import test from 'node:test';
import assert from 'node:assert/strict';
import {articleMetadata,shortNewsText} from '../lib/news-metadata';
import {enrichNewsMetadata,ingestNewsArticles,parseNewsFeed} from '../lib/news-collector';
import {emptyStore} from '../lib/store';
import type {Run} from '../lib/schema';

const now='2026-10-05T12:00:00.000Z';
const run=():Run=>({id:'news-metadata',sourceId:'news-verge-ai',startedAt:now,finishedAt:null,status:'running',fetched:0,accepted:0,filtered:0,invalid:0,created:0,matched:0,unchanged:0,evidenceAdded:0,conflicts:0,errors:[],scope:'test'});

test('RSS author and publisher description survive ingestion',async()=>{
 const xml='<rss xmlns:dc="http://purl.org/dc/elements/1.1/"><channel><item><title>AI research update</title><link>https://www.theverge.com/story</link><pubDate>Mon, 05 Oct 2026 10:00:00 GMT</pubDate><dc:creator>Jane Doe</dc:creator><description>A new model helps people compare answers before they choose a tool.</description></item></channel></rss>';
 const parsed=await parseNewsFeed(xml),store=emptyStore();ingestNewsArticles(store,run(),parsed.articles,'news-verge-ai',false,now);
 assert.equal(store.newsEvents?.[0].author,'Jane Doe');
 assert.equal(store.newsEvents?.[0].excerptSource,'rss');
 assert.match(store.newsEvents?.[0].excerpt||'',/compare answers/);
});

test('article metadata fills missing context and a later empty RSS scan preserves it',async()=>{
 const store=emptyStore(),article={title:'AI research update',url:'https://www.theverge.com/story',publishedAt:now};
 ingestNewsArticles(store,run(),[article],'news-verge-ai',false,now);
 await enrichNewsMetadata(store,'news-verge-ai','www.theverge.com',now,async()=>({excerpt:'The article explains what the new system changes for users.',author:'Jane Doe'}));
 assert.equal(store.newsEvents?.[0].excerptSource,'article-meta');
 ingestNewsArticles(store,run(),[article],'news-verge-ai',false,now);
 assert.equal(store.newsEvents?.[0].excerpt,'The article explains what the new system changes for users.');
 assert.equal(store.newsEvents?.[0].author,'Jane Doe');
});

test('metadata parser accepts attribute order and refuses generic or unsourced claims',()=>{
 const html='<meta content="A new model compares choices before a user makes a decision." property="og:description"><meta content="Jane Doe" name="author">';
 assert.deepEqual(articleMetadata(html),{excerpt:'A new model compares choices before a user makes a decision.',author:'Jane Doe'});
 assert.deepEqual(articleMetadata('<meta name="description" content="A Blog post by Acme">'),{excerpt:'',author:''});
 assert.equal(shortNewsText('A short source sentence.'),'A short source sentence.');
 assert.equal(shortNewsText('The tool changed. People can try it now. A further detail […]'),'The tool changed. People can try it now.');
});

test('RSS description is not duplicated with full-content fields',async()=>{
 const xml='<rss xmlns:content="http://purl.org/rss/1.0/modules/content/"><channel><item><title>AI update</title><link>https://www.theverge.com/story</link><pubDate>Mon, 05 Oct 2026 10:00:00 GMT</pubDate><description>One source description.</description><content:encoded>One source description. More article text.</content:encoded></item></channel></rss>';
 const parsed=await parseNewsFeed(xml);
 assert.equal(parsed.articles[0].excerpt,'One source description.');
});
