import {z} from 'zod';
import {canonicalize} from './identity';
export type Discussion={id:string;title:string;url:string;targetUrl:string;publishedAt:string;points:number;comments:number};
export type Attention={checkedAt:string;nextCheckAt:string;status:'completed'|'failed';error?:string;discussions:Discussion[]};
const hit=z.object({objectID:z.string().regex(/^\d+$/),title:z.string(),url:z.string().nullable(),created_at:z.string(),points:z.number().nonnegative().nullable(),num_comments:z.number().nonnegative().nullable()});
export function matchingDiscussions(raw:unknown,aliases:string[]):Discussion[]{
 const keys=new Set(aliases.map(canonicalize).filter(Boolean));const rows=z.object({hits:z.array(z.unknown())}).parse(raw).hits;
 return rows.flatMap(row=>{const p=hit.safeParse(row);if(!p.success)return [];const h=p.data;const url=h.url&&canonicalize(h.url);if(!url||!keys.has(url)||!Number.isFinite(Date.parse(h.created_at)))return [];return [{id:h.objectID,title:h.title,url:`https://news.ycombinator.com/item?id=${h.objectID}`,targetUrl:h.url!,publishedAt:h.created_at,points:h.points??0,comments:h.num_comments??0}];});
}
export function attentionKind(a:Attention|undefined,now=Date.now()){
 if(!a||a.status!=='completed'||now-Date.parse(a.checkedAt)>2*86400000)return 'unverified' as const;
 const strong=a.discussions.filter(d=>d.points>=50||d.comments>=20);
 return strong.some(d=>{const age=now-Date.parse(d.publishedAt);return age>=0&&age<=7*86400000;})?'recent' as const:strong.length?'historical' as const:'none' as const;
}
export function starChange(points:{at:string;stars:number}[]){
 const sorted=points.filter(p=>Number.isFinite(Date.parse(p.at))&&Number.isFinite(p.stars)).sort((a,b)=>a.at.localeCompare(b.at));const end=sorted.at(-1);if(!end)return null;
 const start=sorted.filter(p=>Date.parse(end.at)-Date.parse(p.at)>=86400000&&Date.parse(end.at)-Date.parse(p.at)<=8*86400000).at(-1);if(!start)return null;
 return {from:start.at,to:end.at,change:end.stars-start.stars};
}
