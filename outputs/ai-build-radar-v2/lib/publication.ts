import {destinations} from './discovery';
import {lessons} from './lessons';
import {selectionFor} from './selection';
import reviews from '../content/lesson-reviews.json';
import previews from '../previews/manifest.json';
import type {FeedCard} from './evaluation';
import type {Store} from './schema';

type Feed={momentum:FeedCard[];discovered:FeedCard[];mentioned:FeedCard[]};
const sameUrl=(a:string,b:string)=>{try{return new URL(a).href.replace(/\/$/,'')===new URL(b).href.replace(/\/$/,'');}catch{return false;}};

// A discovered URL is a lead, not a tested public demo. Keep leads in the
// private review archive; the visitor-facing feed requires an actual trial.
export function publishableDemoIds(store:Store,now=Date.now()){
 const ids=new Set<string>();
 for(const lesson of lessons){
  if(!lesson.buildId||!selectionFor(lesson,undefined,now).featured)continue;
  const build=store.builds.find(b=>b.id===lesson.buildId);
  const site=build&&destinations(build).siteUrl;
  const review=(reviews as Record<string,{url:string}>)[lesson.slug];
  const preview=(previews as Record<string,{url:string;interactive?:boolean}>)[lesson.buildId];
  if(site&&review&&preview?.interactive&&sameUrl(site,lesson.site)&&sameUrl(site,review.url)&&sameUrl(site,preview.url))ids.add(build.id);
 }
 return ids;
}

export function publishableFeed(feed:Feed,store:Store,now=Date.now()):Feed{
 const ids=publishableDemoIds(store,now);
 return {momentum:feed.momentum.filter(c=>ids.has(c.id)),discovered:feed.discovered.filter(c=>ids.has(c.id)),mentioned:feed.mentioned.filter(c=>ids.has(c.id))};
}
