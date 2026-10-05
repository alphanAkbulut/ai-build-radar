import registry from '../content/people.json';
import watchlist from '../content/people-watchlist.json';
import references from '../content/people-references.json';
export const people=registry;
export const peopleWatchlist=watchlist;
export const peopleReferences=references;
export type FeedEntry={id:string;personId:string;title:string;url:string;publishedAt:string|null;author:string|null;kind:string;sourceUrl:string;excerpt?:string};
export type FeedSource={personId:string;lastAttempt:string;lastSuccess:string|null;status:'ok'|'failed';count:number;added:number;error?:string};
export type PeopleSnapshot={checkedAt:string|null;sources:FeedSource[];entries:FeedEntry[];refreshError?:boolean};
export function filterPeopleEntries(entries:FeedEntry[],person:string,q:string){const term=q.toLocaleLowerCase('tr-TR').trim();return entries.filter(e=>(!person||e.personId===person)&&(!term||`${e.title} ${e.author||''} ${people.find(p=>p.id===e.personId)?.name||''}`.toLocaleLowerCase('tr-TR').includes(term)));}
export function peopleDate(value:string|null){return value?new Intl.DateTimeFormat('tr-TR',{dateStyle:'medium',timeZone:'Europe/Istanbul'}).format(new Date(value)):'Yayın tarihi belirtilmemiş';}
