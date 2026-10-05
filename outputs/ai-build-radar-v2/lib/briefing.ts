import {evaluateFeed,type FeedCard,type FeedSignal} from './evaluation';
import {publishableFeed} from './publication';
import {discoverySources,sources} from './sources';
import type {Run,Store} from './schema';

const HOUR=3600000;
const within=(at:string,after:number,now:number)=>{const time=Date.parse(at);return Number.isFinite(time)&&time>=after&&time<=now;};
export type BriefingItem={card:FeedCard;signals:FeedSignal[]};
export function dailyBriefing(store:Store,now=Date.now(),hours=48,publishedOnly=false){
 const after=now-hours*HOUR;
 const candidates=evaluateFeed(store,now);
 const feed=publishedOnly?publishableFeed(candidates,store,now):candidates;
 const items=[...feed.momentum,...feed.mentioned,...feed.discovered].map(card=>({card,signals:card.signals.filter(signal=>within(signal.eventAt,after,now))})).filter(item=>item.signals.length);
 const measured=items.filter(item=>item.signals.some(s=>s.kind==='momentum')).sort((a,b)=>{
  const sourceDifference=new Set(b.signals.filter(s=>s.kind==='momentum').map(s=>s.source)).size-new Set(a.signals.filter(s=>s.kind==='momentum').map(s=>s.source)).size;
  return sourceDifference||Date.parse(b.card.lastEventAt)-Date.parse(a.card.lastEventAt);
 });
 const independentAttentionSources=(item:BriefingItem)=>new Set(item.signals.filter(s=>s.kind==='momentum').map(s=>s.source)).size;
 const crossPlatform=measured.filter(item=>independentAttentionSources(item)>=2);
 const singlePlatform=measured.filter(item=>independentAttentionSources(item)===1).sort((a,b)=>{
  const aSignal=a.signals.find(s=>s.kind==='momentum'),bSignal=b.signals.find(s=>s.kind==='momentum');
  if(aSignal?.source===bSignal?.source&&aSignal?.rank&&bSignal?.rank)return aSignal.rank-bSignal.rank;
  return Date.parse(b.card.lastEventAt)-Date.parse(a.card.lastEventAt);
 });
 const sourceConcentration=[...new Set(singlePlatform.flatMap(item=>item.signals.filter(s=>s.kind==='momentum').map(s=>s.source)))].map(source=>({source,projects:singlePlatform.filter(item=>item.signals.some(s=>s.kind==='momentum'&&s.source===source)).length})).sort((a,b)=>b.projects-a.projects);
 const discovered=items.filter(item=>item.signals.some(s=>s.kind==='discovery')&&!item.signals.some(s=>s.kind==='momentum')).sort((a,b)=>Date.parse(b.card.firstSeenAt)-Date.parse(a.card.firstSeenAt));
 const mentioned=items.filter(item=>item.signals.some(s=>s.kind==='mention')&&!item.signals.some(s=>s.kind==='momentum'||s.kind==='discovery')).sort((a,b)=>Date.parse(b.card.lastEventAt)-Date.parse(a.card.lastEventAt));
 const themes=[...new Set(crossPlatform.map(item=>item.card.category))].flatMap(category=>{
  if(category==='Diğer')return [];
  const group=crossPlatform.filter(item=>item.card.category===category);
  const sources=new Set(group.flatMap(item=>item.signals.filter(s=>s.kind==='momentum').map(s=>s.source)));
  return group.length>=3&&sources.size>=2?[{category,projects:group.length,sources:[...sources]}]:[];
 });
 const coverage=discoverySources.map(source=>{
  const runs=store.runs.filter(run=>run.sourceId===source.id&&within(run.startedAt,after,now));
  const lastRun=runs.reduce<Run|undefined>((latest,run)=>!latest||run.startedAt>latest.startedAt?run:latest,undefined);
  return {id:source.id,name:source.name,attempts:runs.length,lastRun:lastRun?{at:lastRun.startedAt,status:lastRun.status,fetched:lastRun.fetched,accepted:lastRun.accepted}:null};
 });
 const news=(store.newsEvents||[]).filter(event=>within(event.publishedAt,after,now)).sort((a,b)=>Date.parse(b.publishedAt)-Date.parse(a.publishedAt));
 const newsCoverage=sources.filter(source=>source.enabled&&source.adapter==='news').map(source=>{
  const runs=store.runs.filter(run=>run.sourceId===source.id&&within(run.startedAt,after,now));
  const lastRun=runs.reduce<Run|undefined>((latest,run)=>!latest||run.startedAt>latest.startedAt?run:latest,undefined);
  return {id:source.id,name:source.name,attempts:runs.length,lastRun:lastRun?{at:lastRun.startedAt,status:lastRun.status,fetched:lastRun.fetched,accepted:lastRun.accepted}:null};
 });
 return {hours,generatedAt:new Date(now).toISOString(),measured,crossPlatform,singlePlatform,sourceConcentration,discovered,mentioned,themes,coverage,news,newsCoverage,completedSources:coverage.filter(s=>s.lastRun?.status==='completed').length,attemptedSources:coverage.filter(s=>s.attempts>0).length};
}
