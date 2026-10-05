import {lookup} from 'node:dns/promises';
import {BlockList,isIP} from 'node:net';
import https from 'node:https';
import http from 'node:http';
const blocked=new BlockList();
for(const [ip,prefix] of [['0.0.0.0',8],['10.0.0.0',8],['100.64.0.0',10],['127.0.0.0',8],['169.254.0.0',16],['172.16.0.0',12],['192.168.0.0',16],['192.0.0.0',24],['192.0.2.0',24],['198.18.0.0',15],['198.51.100.0',24],['203.0.113.0',24],['224.0.0.0',4],['240.0.0.0',4]] as const)blocked.addSubnet(ip,prefix,'ipv4');
export function publicAddress(ip:string){const family=isIP(ip);return family===4?!blocked.check(ip,'ipv4'):family===6&&/^[23]/i.test(ip)&&!/^2001:(?:db8|0*:)/i.test(ip);}
export function pageUrl(input:string){const u=new URL(input);if(!['https:','http:'].includes(u.protocol)||u.username||u.password||u.port||u.hostname==='localhost'||u.hostname.endsWith('.local'))throw new Error('blocked: non-public URL');return u;}
// DNS is resolved once and pinned to the socket; every redirect is checked again.
export async function publicPage(input:string,redirects=0):Promise<{url:string;text:string}>{
 const u=pageUrl(input);const addresses=await lookup(u.hostname,{all:true});if(!addresses.length||addresses.some(a=>!publicAddress(a.address)))throw new Error('blocked: non-public address');
 const address=addresses[0];
 return new Promise((resolve,reject)=>{
  const req=(u.protocol==='https:'?https:http).get(u,{family:address.family,headers:{'User-Agent':'AI-Build-Radar-Context/1.0','Accept':'text/html, text/plain;q=0.9','Accept-Encoding':'identity'},lookup:(_host,_options,cb)=>cb(null,address.address,address.family)},res=>{
   if([301,302,303,307,308].includes(res.statusCode||0)){res.resume();if(redirects>=3||!res.headers.location){reject(new Error('redirect limit'));return;}publicPage(new URL(res.headers.location,u).href,redirects+1).then(resolve,reject);return;}
   if(res.statusCode!==200){res.resume();reject(new Error(`HTTP ${res.statusCode}`));return;}
   if(!/text\/(html|plain)/i.test(String(res.headers['content-type']))){res.resume();reject(new Error('unsupported content type'));return;}
   let size=0;const chunks:Buffer[]=[];res.on('data',(chunk:Buffer)=>{size+=chunk.length;if(size>300_000){res.destroy(new Error('page exceeds size limit'));return;}chunks.push(chunk);});res.on('error',reject);res.on('end',()=>resolve({url:u.href,text:Buffer.concat(chunks).toString('utf8')}));
  });const timeout=setTimeout(()=>req.destroy(new Error('request timeout')),12000);req.on('close',()=>clearTimeout(timeout));req.on('error',reject);
 });
}
