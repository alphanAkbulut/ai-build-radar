import { z } from 'zod';
import { getJson } from './http';
import type { Candidate, Claim } from './schema';
export type Batch={candidates:Candidate[];fetched:number;filtered:number;invalid:number;errors:string[]};
const claim=(field:string,value:string,status:Claim['status'],quote:string,locator:string,rationale:string,strength:number):Claim=>({field,value,status,quote,locator,rationale,strength});
const signals=/\b(vibe[- ]?cod(?:ed|ing)|claude code|cursor|codex|lovable|bolt\.new|replit agent)\b/i;
// Only sentence/clause-level statements about the repository itself.
// Do not label "checks for apps built with X" as proof that this tool was built with X.
const toolPattern=/(?:^|[.!?;,—]\s*)(?:vibe-)?(?:built|created|developed|coded|made)\s+(?:entirely\s+)?(?:with|using|by)\s+(?:the\s+)?(Claude Code|Cursor|Codex|Lovable|Replit Agent|Bolt(?:\.new)?|GitHub Copilot)\b/i;
export function toolClaims(text:string,locator:string):Claim[]{
 const match=text.match(toolPattern); return match?[claim('ai_tools',match[1],'Builder-stated',text,locator,'Explicit development-tool statement in repository owner metadata; not independently reproduced.',.85)]:[];
}
const ghSchema=z.object({id:z.number(),name:z.string(),html_url:z.url(),description:z.string().nullable(),homepage:z.string().nullable().optional(),owner:z.object({login:z.string()}),language:z.string().nullable(),stargazers_count:z.number(),created_at:z.string(),topics:z.array(z.string()).optional()});
export function githubCandidate(row:unknown):Candidate|null{
 const validated=ghSchema.safeParse(row);if(!validated.success)return null;const r=validated.data;
   const desc=r.description||'';
   const claims:Claim[]=[claim('repository',r.html_url,'Verified',r.html_url,'$.html_url','Repository URL returned by GitHub API.',1),claim('github_stars',String(r.stargazers_count),'Verified',String(r.stargazers_count),'$.stargazers_count','Observed GitHub counter, not a quality score.',1),...toolClaims(desc,'$.description')];
   if(r.language) claims.push(claim('primary_language',r.language,'Verified',r.language,'$.language','GitHub-reported primary language; not a framework or AI tool.',1));
   return {recordId:String(r.id),name:r.name,url:r.html_url,aliases:r.homepage?[r.homepage]:[],description:desc,creator:r.owner.login,category:'developer_tools',publishedAt:null,sourceUrl:r.html_url,raw:row,claims};
}
export async function github():Promise<Batch>{
 const result:Batch={candidates:[],fetched:0,filtered:0,invalid:0,errors:[]};
 for(const query of ['topic:vibe-coding archived:false is:public','"built with" "Claude Code" in:description archived:false is:public']) {
  const raw=await getJson(`https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=updated&order=desc&per_page=20`);
  const parsed=z.object({items:z.array(z.unknown()),incomplete_results:z.boolean()}).parse(raw);
  if(parsed.incomplete_results) result.errors.push('GitHub reports incomplete search results');
  for(const row of parsed.items) {
   result.fetched++;const candidate=githubCandidate(row);if(candidate)result.candidates.push(candidate);else result.invalid++;
  }
 }
 return result;
}
const hnSchema=z.object({id:z.number(),type:z.string(),title:z.string().optional(),url:z.string().optional(),text:z.string().optional(),by:z.string().optional(),time:z.number(),score:z.number().optional(),dead:z.boolean().optional(),deleted:z.boolean().optional()});
export async function hn():Promise<Batch>{
 const ids=z.array(z.number()).parse(await getJson('https://hacker-news.firebaseio.com/v0/showstories.json')).slice(0,80);
 const result:Batch={candidates:[],fetched:0,filtered:0,invalid:0,errors:[]};
 for(let i=0;i<ids.length;i+=8){
  const rows=await Promise.allSettled(ids.slice(i,i+8).map(id=>getJson(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)));
  for(const row of rows){
   result.fetched++;if(row.status==='rejected'){result.errors.push(String(row.reason));continue;}
   const parsed=hnSchema.safeParse(row.value);if(!parsed.success){result.invalid++;continue;}const r=parsed.data;
   if(r.dead||r.deleted||r.type!=='story'||!r.url||!signals.test(`${r.title} ${r.text||''}`)){result.filtered++;continue;}
   const sourceUrl=`https://news.ycombinator.com/item?id=${r.id}`;
   // A Show HN author is not automatically an authenticated product owner.
   const claims=[claim('hn_mention',sourceUrl,'Verified',r.title||'',`item/${r.id}.title`,'The post exists; product claims and author ownership are not independently verified.',.7),claim('discovery_reason','AI-development keyword in Show HN','Derived',r.title||'',`item/${r.id}`,'Candidate selection only; this does not establish AI-assisted development.',.4)];
   result.candidates.push({recordId:String(r.id),name:(r.title||'Untitled').replace(/^Show HN:\s*/i,''),url:r.url,aliases:[],description:r.title||'',creator:null,category:'uncategorized',publishedAt:new Date(r.time*1000).toISOString(),sourceUrl,raw:row.value,claims});
  }
 }
 return result;
}
const datasetSchema=z.object({slug:z.string(),title:z.string(),short_description:z.string().nullable(),live_url:z.url(),primary_category:z.string().nullable(),detected_stack:z.array(z.string()).nullable(),published_at:z.string().nullable()});
export async function onesvibe():Promise<Batch>{
 const url='https://raw.githubusercontent.com/JefferyLee/awesome-vibe-coded-apps/main/data/projects.json';
 const rows=z.array(z.unknown()).parse(await getJson(url));
 const valid=rows.map(row=>({row,parsed:datasetSchema.safeParse(row)}));
 const selected=valid.filter(r=>r.parsed.success).sort((a,b)=>(b.parsed.data!.published_at||'').localeCompare(a.parsed.data!.published_at||'')).slice(0,120);
 const result:Batch={candidates:[],fetched:rows.length,invalid:valid.filter(r=>!r.parsed.success).length,filtered:valid.filter(r=>r.parsed.success).length-selected.length,errors:[]};
 for(const {row,parsed} of selected){
  const r=parsed.data!;const claims:Claim[]=[claim('catalog_membership',"One’s Vibe AI-built catalog",'Derived',r.title,`slug=${r.slug}`,'Curator classification; no independent proof of AI development or liveness.',.45)];
  for(const stack of r.detected_stack||[]) claims.push(claim('tech_stack',stack,'Derived',stack,`slug=${r.slug}.detected_stack`,'Imported curator fingerprint; not independently inspected by Build Radar.',.4));
  result.candidates.push({recordId:r.slug,name:r.title,url:r.live_url,aliases:[],description:r.short_description||'',creator:null,category:r.primary_category||'uncategorized',publishedAt:r.published_at,sourceUrl:'https://github.com/JefferyLee/awesome-vibe-coded-apps/blob/main/data/projects.json',raw:row,claims});
 }
 return result;
}
