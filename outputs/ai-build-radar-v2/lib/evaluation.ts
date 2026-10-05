import type {Store,Build} from './schema';
import {attentionKind,starChange} from './attention';
import {categoryFor,destinations} from './discovery';
import {sources} from './sources';
import {toolClaims} from './collectors';
import {latestEvidence} from './projections';
import {publishableEvidence} from './relevance';

export type FeedSignal={kind:'momentum'|'mention'|'discovery';source:string;label:string;url:string;eventAt:string;checkedAt:string;rank?:number};
export type FeedCard={id:string;name:string;description:string;category:string;siteUrl:string;signals:FeedSignal[];status:'momentum'|'mentioned'|'discovered';lastEventAt:string;firstSeenAt:string;aiStatus:'Verified'|'Builder-stated'|'Derived'|'Unknown';aiEvidence:{sourceUrl:string;quote:string;tool:string;observedAt:string}|null;tools:string[]};
const WEEK=7*86400000, DAY=86400000;
function recent(at:string,now:number,limit:number){const age=now-Date.parse(at);return Number.isFinite(age)&&age>=0&&age<=limit;}
function sourceName(id:string){return sources.find(s=>s.id===id)?.name||id;}
function meaningfulDescription(build:Build){
 const raw=(build.context?.what||build.description||'').trim().replace(/&#?39;|&39;/g,"'").replace(/&amp;/g,'&');
 const withoutMethod=raw.replace(/(?:[.!?]\s*)?(?:built|made|created|developed|coded)\s+(?:entirely\s+)?(?:with|using|by)\s+(?:the\s+)?(?:Claude Code|Cursor|Codex|Lovable|Replit Agent|Bolt(?:\.new)?|GitHub Copilot).*$/i,'').trim();
 const text=withoutMethod.endsWith('...')?withoutMethod.match(/^.{35,}?[.!?](?=\s|$)/)?.[0]||'':withoutMethod;
 return text.length>=35&&!/Hugging Face üzerinde yayımlanmış etkileşimli demo adayı|yayınında bağlantısı geçen aday|DEV Community yazısında bağlantısı geçen proje/i.test(text)?text:null;
}
export function evaluateFeedBuild(store:Store,build:Build,now=Date.now()):FeedCard|null{
 const siteUrl=destinations(build).siteUrl,description=meaningfulDescription(build);
 if(!siteUrl||!description||build.reviewRequired)return null;
 if(['lobste.rs','dev.to','medium.com','www.medium.com'].includes(new URL(siteUrl).hostname))return null;
 const signals:FeedSignal[]=[];
 const key=build.aliases.find(a=>a.startsWith('https://github.com/'))||build.canonicalUrl;
 const attention=store.attention?.[key];
 if(attentionKind(attention,now)==='recent')for(const d of attention!.discussions){
  if(!recent(d.publishedAt,now,WEEK)||(d.points<50&&d.comments<20))continue;
  signals.push({kind:'momentum',source:'Hacker News',label:`${d.points} puan · ${d.comments} yorum`,url:d.url,eventAt:d.publishedAt,checkedAt:attention!.checkedAt});
 }
 const evidence=latestEvidence(store.evidence.filter(e=>e.buildId===build.id)).filter(e=>publishableEvidence(store,e));
 const growth=starChange(store.evidence.filter(e=>e.buildId===build.id&&e.field==='github_stars').map(e=>({at:e.observedAt,stars:Number(e.value)})));
 if(growth&&growth.change>=25&&recent(growth.to,now,2*DAY)){
  const repo=evidence.find(e=>e.field==='github_stars');
  if(repo)signals.push({kind:'momentum',source:'GitHub',label:`En az 24 saat arayla ölçülen +${growth.change} yıldız`,url:repo.sourceUrl,eventAt:growth.to,checkedAt:growth.to});
 }
 for(const e of evidence){
  if(!recent(e.observedAt,now,2*DAY))continue;
  // A repeated platform snapshot is a fresh check, not a fresh trend event.
  const firstTrendAt=e.field==='platform_trending'&&e.sourceId==='huggingface'
   ?store.evidence.filter(row=>row.buildId===build.id&&row.sourceId==='huggingface'&&row.field==='platform_trending').reduce((first,row)=>row.observedAt<first?row.observedAt:first,e.observedAt)
   :null;
  const eventAt=firstTrendAt||e.publishedAt||e.observedAt;
  if(!recent(eventAt,now,WEEK))continue;
  if(e.field==='platform_trending'&&e.sourceId==='huggingface'&&Number(e.value)>0){
   const rankEvidence=evidence.find(row=>row.sourceId===e.sourceId&&row.sourceRecordId===e.sourceRecordId&&row.field==='platform_rank');
   const rank=Number(rankEvidence?.value);
   const validRank=!!rankEvidence&&Number.isInteger(rank)&&rank>=1&&rank<=20;
   const older=rankEvidence&&validRank?store.evidence.filter(row=>row.buildId===build.id&&row.sourceId===e.sourceId&&row.sourceRecordId===e.sourceRecordId&&row.field==='platform_rank'&&Date.parse(rankEvidence.observedAt)-Date.parse(row.observedAt)>=DAY&&Date.parse(rankEvidence.observedAt)-Date.parse(row.observedAt)<=8*DAY).sort((a,b)=>a.observedAt.localeCompare(b.observedAt)).at(-1):undefined;
   const priorRank=Number(older?.value),movement=older&&Number.isInteger(priorRank)&&priorRank>=1&&priorRank<=20?priorRank-rank:null;
   const rankLabel=validRank?`#${rank}${movement===null?'':movement>0?` · ${movement} sıra yükseldi`:movement<0?` · ${-movement} sıra geriledi`:' · sıra değişmedi'} · `:'';
   signals.push({kind:'momentum',source:'Hugging Face',label:`Spaces trend listesinde ${rankLabel}platform içi sinyal`,url:e.sourceUrl,eventAt,checkedAt:e.observedAt,rank:validRank?rank:undefined});
  }else if(e.field==='github_trending_daily'&&e.sourceId==='github-trending'&&Number(e.value)>=1&&Number(e.value)<=25){
   signals.push({kind:'momentum',source:'GitHub Trending',label:e.quote,url:e.sourceUrl,eventAt:e.observedAt,checkedAt:e.observedAt,rank:Number(e.value)});
  }else if(e.field==='github_trending_developer'&&e.sourceId==='github-trending'){
   signals.push({kind:'mention',source:'GitHub Trending developers',label:e.quote,url:e.sourceUrl,eventAt:e.observedAt,checkedAt:e.observedAt});
  }else if(e.field==='community_discussion'){
   const match=e.quote.match(/(\d+) puan\s*·\s*(\d+) yorum/);
   const points=Number(match?.[1]||0),comments=Number(match?.[2]||0);
   signals.push({kind:points>=50||comments>=20?'momentum':'mention',source:sourceName(e.sourceId),label:e.quote,url:e.sourceUrl,eventAt,checkedAt:e.observedAt});
  }else if(e.field==='editorial_reference'&&e.publishedAt){
   signals.push({kind:'mention',source:sourceName(e.sourceId),label:'Yayında proje bağlantısı',url:e.sourceUrl,eventAt,checkedAt:e.observedAt});
  }
 }
 const aiClaims=evidence.filter(e=>e.field==='ai_tools'&&(e.sourceId!=='github'||toolClaims(e.quote,e.locator).some(claim=>claim.value===e.value)));
 const directClaim=aiClaims.find(e=>e.status==='Verified')||aiClaims.find(e=>e.status==='Builder-stated');
 if(!signals.length&&directClaim&&recent(build.firstSeenAt,now,WEEK))signals.push({kind:'discovery',source:sourceName(directClaim.sourceId),label:'Radar yeni keşfetti · AI geliştirme beyanı kaynaklı',url:directClaim.sourceUrl,eventAt:build.firstSeenAt,checkedAt:directClaim.observedAt});
 if(!signals.length)return null;
 signals.sort((a,b)=>Date.parse(b.eventAt)-Date.parse(a.eventAt));
 const status=signals.some(s=>s.kind==='momentum')?'momentum':signals.some(s=>s.kind==='mention')?'mentioned':'discovered';
 const kind=status==='momentum'?'momentum':status==='mentioned'?'mention':'discovery';
 return {id:build.id,name:build.name,description,category:categoryFor(build).label,siteUrl,signals,status,lastEventAt:signals.find(s=>s.kind===kind)!.eventAt,firstSeenAt:build.firstSeenAt,aiStatus:directClaim?.status||aiClaims[0]?.status||'Unknown',aiEvidence:directClaim?{sourceUrl:directClaim.sourceUrl,quote:directClaim.quote,tool:directClaim.value,observedAt:directClaim.observedAt}:null,tools:[...new Set(aiClaims.map(e=>e.value))]};
}
export function evaluateFeed(store:Store,now=Date.now()){
 const cards=store.builds.flatMap(b=>{const result=evaluateFeedBuild(store,b,now);return result?[result]:[]});
 const byRecency=(a:FeedCard,b:FeedCard)=>Date.parse(b.lastEventAt)-Date.parse(a.lastEventAt);
 return {momentum:cards.filter(c=>c.status==='momentum').sort(byRecency),discovered:cards.filter(c=>c.status==='discovered').sort(byRecency),mentioned:cards.filter(c=>c.status==='mentioned').sort(byRecency)};
}
export function feedByDevelopmentEvidence(feed:ReturnType<typeof evaluateFeed>,group:'ai'|'uncertain'){
 const cards=[...feed.momentum,...feed.discovered,...feed.mentioned];
 return cards.filter(c=>group==='ai'?c.aiStatus==='Verified'||c.aiStatus==='Builder-stated':c.aiStatus==='Derived'||c.aiStatus==='Unknown');
}
