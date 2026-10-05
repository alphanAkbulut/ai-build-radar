import {z} from 'zod';
import {getJson} from './http';
import {publicPage} from './public-page';
import {hash,stableId,repoAlias} from './identity';
import {EvidenceSchema,type Build,type Store,type Run} from './schema';
const DAY=86400000;
const clean=(s:string)=>s.replace(/<[^>]*>/g,' ').replace(/!\[[^\]]*\]\([^)]*\)/g,'').replace(/\[([^\]]*)\]\([^)]*\)/g,'$1').replace(/[*_`#]/g,'').replace(/&(?:nbsp|amp|quot|lt|gt);/g,' ').replace(/\s+/g,' ').trim();
export function extractContext(text:string,html=false){
 const safe=text.replace(/<(script|style|nav|footer|header)\b[^>]*>[\s\S]*?<\/\1>/gi,'').replace(/<!--[\s\S]*?-->/g,'').replace(/```[\s\S]*?```/g,'');
 const paragraphs=(html?[...safe.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)].map(m=>m[1]):safe.replace(/^#{1,6} .+$/gm,'').split(/\n\s*\n/)).map(clean).filter(s=>s.length>=45&&s.length<1800&&!/^(npm |pip |git |curl |docker |copyright|license|installation|contributing|sponsors|\||\]|[-*] |\d+\. )/i.test(s)&&!/(cookie policy|privacy policy|all rights reserved)/i.test(s));
 let meta='';if(html){for(const m of safe.matchAll(/<meta\b[^>]*>/gi)){const attrs=Object.fromEntries([...m[0].matchAll(/([\w:-]+)\s*=\s*["']([^"']*)["']/g)].map(a=>[a[1].toLowerCase(),a[2]]));if(['description','og:description'].includes(attrs.name||attrs.property)){meta=clean(attrs.content||'');break;}}}
 const what=(meta.length>=35?meta:paragraphs[0]||'').slice(0,650);
 const purposeSection=!html?safe.match(/^#{1,6}\s+(?:Why(?: it exists| we built[^\n]*)?|Motivation|Purpose|Neden|Amaç)\s*\n+([\s\S]*?)(?=\n#{1,6} |$)/im)?.[1]:undefined;
 const sectionPurpose=purposeSection?.split(/\n\s*\n/).map(clean).find(p=>p.length>=45);
 const purpose=sectionPurpose?.slice(0,650)||paragraphs.find(p=>/\b(I|we) (?:built|created|made|wanted|started)|\b(our goal|the goal|the idea|designed to|built to|in order to)\b|amac[ıi]|için (?:yapt|geliştir)/i.test(p))?.slice(0,650)||null;
 return {what:what||null,purpose};
}
export type ContextDocument={text:string;url:string;html:boolean;fetchedAt?:string};
export async function loadContext(b:Build):Promise<ContextDocument>{
 const repo=repoAlias(b.aliases);
 if(repo){const [owner,name]=new URL(repo).pathname.split('/').filter(Boolean);const row=z.object({content:z.string(),encoding:z.literal('base64'),html_url:z.url(),size:z.number().max(200000)}).parse(await getJson(`https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(name)}/readme`));return {text:Buffer.from(row.content,'base64').toString('utf8'),url:row.html_url,html:false};}
 const url=b.canonicalUrl;const hostname=new URL(url).hostname;
 if(['news.ycombinator.com','x.com','twitter.com','youtube.com','www.youtube.com','reddit.com','www.reddit.com'].includes(hostname))throw new Error('blocked: third-party post is not a developer description');
 const result=await publicPage(url);return {...result,html:true};
}
export function contextDue(b:Build,now:number){return !b.context||Date.parse(b.context.nextCheckAt)<=now;}
export async function enrichContexts(store:Store,run:Run,now:string,load=loadContext,limit=12){
 const queue=store.builds.filter(b=>contextDue(b,Date.parse(now))).sort((a,b)=>Number(!!a.context)-Number(!!b.context)||b.firstSeenAt.localeCompare(a.firstSeenAt)).slice(0,limit);
 for(const b of queue){run.fetched++;const previous=b.context;try{
  const doc=await load(b);const extracted=extractContext(doc.text,doc.html);const state=extracted.what?(extracted.purpose?'complete':'partial'):'missing';
  const contentHash=hash({text:doc.text,version:'context-v3'}),rawId=stableId('raw-context',[b.id,contentHash]);
  if(!store.raw.some(r=>r.id===rawId))store.raw.push({id:rawId,sourceId:'project-context',sourceRecordId:b.id,url:doc.url,fetchedAt:doc.fetchedAt||now,hash:contentHash,payload:{text:doc.text,html:doc.html,version:'context-v3'}});
  const unchanged=previous?.contentHash===contentHash&&previous.sourceUrl===doc.url;
  let evidenceIds=previous?.evidenceIds||[];
  if(!unchanged){evidenceIds=[];for(const [field,value] of [['project_what',extracted.what],['project_purpose',extracted.purpose],['project_context_status',state]]){
   if(!value)continue;const prior=store.evidence.filter(e=>e.buildId===b.id&&e.sourceId==='project-context'&&e.field===field).at(-1);const id=stableId('ev-context',[b.id,field,contentHash,now]);
   store.evidence.push(EvidenceSchema.parse({id,buildId:b.id,sourceId:'project-context',sourceRecordId:b.id,field,value,status:field==='project_context_status'||doc.html?'Derived':'Builder-stated',sourceUrl:doc.url,quote:field==='project_context_status'?'':value,locator:doc.html?'page description / paragraph':'README paragraph',observedAt:now,publishedAt:null,contentHash,rawId,extractorVersion:'context-v3',rationale:'Automatic source-language excerpt. No independent product test, translation, or inferred developer intent. Publication needs editorial review.',strength:.65,supersedes:prior?.id||null}));evidenceIds.push(id);run.evidenceAdded++;}
  }else run.unchanged++;
  b.context={state,...extracted,sourceUrl:doc.url,checkedAt:now,lastSuccessAt:doc.fetchedAt||now,nextCheckAt:new Date(Date.parse(now)+DAY).toISOString(),reason:state==='complete'?'Kaynak açıklaması ve amaç adayı bulundu; editoryal kontrol bekliyor.':state==='partial'?'Açıklama bulundu; açık amaç ifadesi bulunamadı.':'Kullanılabilir açıklama bulunamadı.',contentHash,evidenceIds};
  b.updatedAt=now;run.accepted++;run.matched++;
 }catch(e){const message=e instanceof Error?e.message:'Unknown error';const state=message.startsWith('blocked:')?'blocked':'failed';b.context={...previous,state,what:previous?.what||null,purpose:previous?.purpose||null,sourceUrl:previous?.sourceUrl||null,checkedAt:now,lastSuccessAt:previous?.lastSuccessAt||null,nextCheckAt:new Date(Date.parse(now)+(state==='blocked'?DAY:6*3600000)).toISOString(),reason:message.slice(0,200),contentHash:previous?.contentHash||null,evidenceIds:previous?.evidenceIds||[]};run.errors.push(`${b.id}: ${message.slice(0,200)}`);}
 }
}
