import type {Build} from './schema';
export const categories=[
 {id:'design',label:'Tasarım & deneyler',mark:'✳'},
 {id:'games',label:'Oyunlar',mark:'◈'},
 {id:'productivity',label:'Üretkenlik',mark:'▤'},
 {id:'developer',label:'Geliştirici araçları',mark:'⌘'},
 {id:'ai',label:'AI & asistanlar',mark:'◎'},
 {id:'business',label:'İş & finans',mark:'▥'},
 {id:'community',label:'İçerik & topluluk',mark:'↗'},
 {id:'other',label:'Diğer',mark:'◌'},
] as const;
export type CategoryId=typeof categories[number]['id'];
const excludedHosts=new Set(['github.com','gitlab.com','bitbucket.org','news.ycombinator.com','reddit.com','www.reddit.com','x.com','twitter.com','youtube.com','www.youtube.com']);
export function destinations(build:Pick<Build,'canonicalUrl'|'aliases'|'reviewRequired'>){
 const urls=[...new Set([build.canonicalUrl,...build.aliases])].filter(s=>{try{const u=new URL(s);return ['https:','http:'].includes(u.protocol)&&!u.username&&!u.password;}catch{return false;}});
 const codeUrl=urls.find(s=>['github.com','gitlab.com','bitbucket.org'].includes(new URL(s).hostname))||null;
 // An identity conflict must not send the visitor to an ambiguous homepage.
 const siteUrl=build.reviewRequired?null:urls.find(s=>!excludedHosts.has(new URL(s).hostname))||null;
 return {siteUrl,codeUrl};
}
export function categoryFor(build:Pick<Build,'name'|'description'|'category'>){
 const text=`${build.name} ${build.description}`.toLowerCase();
 const rules:[CategoryId,RegExp][]=[
  ['games',/\b(games?|arcade|puzzle|heist|slime patrol|chess|trivia)\b/],
  ['design',/\b(metaballs|motion.pad|motion.primer|orbital|voronoi|particle|particles|spheregen|orb.atom|motion.primer|sunburst|3d|animation|paint|design|creative|visualization)\b/],
  ['business',/\b(finance|financial|invoice|business document|payment|accounting|revenue|marketing|stock market)\b/],
  ['productivity',/\b(itinerary|trip companion|notes|translate|translation|calendar|to.do|shopping list|pdf|organize)\b/],
  ['developer',/\b(android apk|private link|hosting|coding agent|code review|developer|package manager|debug|api|database|code editor|deployment)\b/],
  ['ai',/\b(ai assistant|chatbot|voice agent|ai agent|agentic|llm)\b/],
 ];
 const match=rules.find(([,pattern])=>pattern.test(text));
 const mapping:Record<string,CategoryId>={creative_tools:'design',games_play:'games',productivity:'productivity',developer_tools:'developer',ai_agents:'ai',finance_business:'business',social_community:'community'};
 const id=match?.[0]||mapping[build.category]||'other';
 return {...categories.find(c=>c.id===id)!,basis:match?'Açıklama ve başlıktan Radar önerisi':'Kaynak kategorisinin üst grubu',sourceCategory:build.category};
}
export function cleanParams(input:Record<string,string|string[]|undefined>){return Object.fromEntries(Object.entries(input).map(([k,v])=>[k,Array.isArray(v)?v[0]:v])) as Record<string,string|undefined>;}
export function discoveryUrl(base:string,params:Record<string,string|undefined>,patch:Record<string,string|undefined>){const merged:Record<string,string|undefined>={...params,...patch,page:undefined};const query=new URLSearchParams(Object.entries(merged).filter(([,v])=>!!v) as [string,string][]);return base+(query.size?'?'+query.toString():'');}

export function aiGroup(status:string){return status==="Verified"||status==="Builder-stated"?"ai":"uncertain";}
