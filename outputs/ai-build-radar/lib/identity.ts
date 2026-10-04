import {createHash} from 'node:crypto';
export const hash=(value:unknown)=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
export const stableId=(kind:string,value:unknown)=>`${kind}_${hash(value).slice(0,24)}`;
export function canonicalize(input:string):string|null {
 try { const u=new URL(input); if(!['http:','https:'].includes(u.protocol)||u.username||u.password) return null;
  u.hash='';u.hostname=u.hostname.toLowerCase();
  // No URL fetching or redirects. Preserve identity-bearing query parameters and path case.
  for(const key of [...u.searchParams.keys()]) if(/^utm_/i.test(key)||['fbclid','gclid'].includes(key)) u.searchParams.delete(key);
  u.searchParams.sort();u.pathname=u.pathname.replace(/\/+$/,'')||'/';
  if(u.hostname==='github.com'||u.hostname==='www.github.com') {
   const parts=u.pathname.split('/').filter(Boolean); if(parts.length!==2) return null;
   u.hostname='github.com';u.protocol='https:';u.pathname='/'+parts.join('/').replace(/\.git$/i,'').toLowerCase();u.search='';
  }
  return u.toString().replace(/\/$/,'');
 } catch {return null;}
}
export const repoAlias=(aliases:string[])=>aliases.find(a=>new URL(a).hostname==='github.com');
