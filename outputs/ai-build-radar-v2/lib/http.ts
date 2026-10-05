export class FetchError extends Error { constructor(message:string,public retryAfterMs=0){super(message);} }
const allowedHosts=new Set(['dev.to','lobste.rs','huggingface.co','simonwillison.net','www.oneusefulthing.org','huyenchip.com','lilianweng.github.io','www.latent.space','karpathy.bearblog.dev','www.devas.life','eugeneyan.com','www.interconnects.ai','jack-clark.net','semianalysis.com','www.bensbites.com','thegradient.pub','www.ruder.io','www.aitidbits.ai','www.marktechpost.com','www.lennysnewsletter.com','newsletter.pragmaticengineer.com','hn.algolia.com','api.github.com','hacker-news.firebaseio.com','raw.githubusercontent.com']);
export async function getText(url:string):Promise<string> {
 const u=new URL(url);if(u.protocol!=='https:'||!allowedHosts.has(u.hostname)) throw new Error('Collector URL outside allowlist');
 const headers:Record<string,string>={'User-Agent':'AI-Build-Radar-Private-PoC','Accept':'application/json'};
 if(u.hostname==='api.github.com'&&process.env.GITHUB_TOKEN) headers.Authorization=`Bearer ${process.env.GITHUB_TOKEN}`;
 const response=await fetch(url,{headers,redirect:'error',signal:AbortSignal.timeout(20000)});
 if(!response.ok) {
  const retry=response.headers.get('retry-after'); const reset=response.headers.get('x-ratelimit-reset');
  const retryMs=retry?(Number.isFinite(Number(retry))?Number(retry)*1000:Math.max(0,Date.parse(retry)-Date.now())):0;
  const resetMs=reset?Math.max(0,Number(reset)*1000-Date.now()):0;
  throw new FetchError(`${u.hostname}: HTTP ${response.status}`,Math.max(retryMs,resetMs));
 }
 const length=Number(response.headers.get('content-length')||0); if(length>30_000_000) throw new Error('Response exceeds 30 MB bound');
 const text=await response.text();if(text.length>30_000_000) throw new Error('Response exceeds 30 MB bound');return text;
}

export async function getJson(url:string):Promise<unknown>{return JSON.parse(await getText(url));}
