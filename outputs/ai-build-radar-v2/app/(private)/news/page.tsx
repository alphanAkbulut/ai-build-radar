import Link from 'next/link';
import {dashboardStore} from '@/lib/data';
import {linkedNewsBuilds} from '@/lib/news-collector';
import {canonicalize} from '@/lib/identity';
import {sources} from '@/lib/sources';

const date=(at:string)=>new Intl.DateTimeFormat('tr-TR',{dateStyle:'medium',timeStyle:'short',timeZone:'Europe/Istanbul'}).format(new Date(at));
const isProjectLink=(url:string)=>{
 const parsed=new URL(url);
 return parsed.hostname==='github.com'&&parsed.pathname.split('/').filter(Boolean).length===2||parsed.hostname==='huggingface.co'&&parsed.pathname.startsWith('/spaces/');
};

export default async function NewsPage({searchParams}:{searchParams:Promise<{period?:string;page?:string}>}){
 const params=await searchParams,store=await dashboardStore();
 const period=params.period==='week'?'week':'recent';
 const hours=period==='week'?168:48,now=Date.now(),after=now-hours*3600000;
 const all=(store.newsEvents||[]).filter(event=>{
  const published=Date.parse(event.publishedAt);
  return Number.isFinite(published)&&published>=after&&published<=now;
 }).sort((a,b)=>Date.parse(b.publishedAt)-Date.parse(a.publishedAt));
 const pages=Math.max(1,Math.ceil(all.length/12));
 const requested=Number(params.page),page=Number.isInteger(requested)&&requested>0?Math.min(requested,pages):1;
 const visible=all.slice((page-1)*12,page*12);
 const href=(next:number)=>`/news?period=${period}&page=${next}`;
 return <>
  <div className="discovery-heading"><div><p className="eyebrow">KAYNAĞINDAN YAPAY ZEKA HABERLERİ</p><h1>News<span className="orange">.</span></h1><p>Başlığı, yayıncının kısa açıklamasını ve varsa yazarı okuyup habere geç. RSS açıklamasında açık proje bağlantısı varsa ayrıca gösterilir; bir bağlantı ürünün çalıştığına veya AI ile geliştirildiğine kanıt değildir.</p></div><span className="total-label">{all.length} haber · {hours===48?'Son 48 saat':'Son 7 gün'}</span></div>
  <nav className="people-tabs" aria-label="Haber zaman aralığı"><Link className={period==='recent'?'active':''} href="/news">Son 48 saat</Link><Link className={period==='week'?'active':''} href="/news?period=week">Son 7 gün</Link></nav>
  <p className="collection-note">Yayın tarihine göre sıralanır. Kısa açıklamalar yayıncının kendi dilindedir; Radar henüz AI ile Türkçe özet veya övgü değerlendirmesi üretmiyor. RSS'te bağlantı yoksa tam makaledeki bağlantılar tespit edilemez.</p>
  {!visible.length&&<div className="lesson-panel"><h2>Bu aralıkta haber yok</h2><p>Son tarama durumunu Kaynaklar ekranında görebilirsin. Kayıtlı bir akışın çalıştığı varsayılmaz.</p><Link href="/sources">Kaynak durumunu gör →</Link></div>}
  <div className="news-list">{visible.map(event=>{
   const matched=linkedNewsBuilds(event,store),matchedUrls=new Set(matched.flatMap(build=>[build.canonicalUrl,...build.aliases].map(url=>canonicalize(url))));
   const projectLinks=(event.references||[]).filter(reference=>isProjectLink(reference.url)&&!matchedUrls.has(reference.url)).slice(0,3);
   return <article className="news-item" key={event.id}>
    <div className="news-item-meta"><span>{sources.find(source=>source.id===event.sourceId)?.name||event.sourceId}</span>{event.author&&<span>Yazan: {event.author}</span>}<time dateTime={event.publishedAt}>{date(event.publishedAt)}</time></div>
    <h2><a href={event.url} target="_blank" rel="noopener noreferrer">{event.title} ↗</a></h2>
    {event.excerpt?<p className="news-excerpt"><strong>{event.excerptSource==='article-meta'?'Makalenin kısa açıklaması':'Yayıncının kısa açıklaması'}:</strong> {event.excerpt}</p>:<p className="news-excerpt news-excerpt-missing">Kaynakta güvenilir bir kısa açıklama bulunamadı; içeriği okumak için başlığı aç.</p>}
    {matched.length>0&&<div className="news-item-links"><strong>Yazıdan Radar kaydıyla eşleşenler</strong>{matched.slice(0,3).map(build=><Link key={build.id} href={'/builds/'+build.id}>{build.name} · kaynak ve demo durumu →</Link>)}<small>Yalnızca yazıdaki açık adresle eşleşti; öneri veya olumlu yorum anlamına gelmez.</small></div>}
    {projectLinks.length>0&&<div className="news-item-links"><strong>Yazıda geçen proje bağlantıları · inceleme bekliyor</strong>{projectLinks.map(reference=><a key={reference.url} href={reference.url} target="_blank" rel="noopener noreferrer">{reference.label||new URL(reference.url).hostname} ↗</a>)}<small>Bu adreslerin demo ve geliştirme yöntemi doğrulanmadı.</small></div>}
    {(event.references||[]).length>matched.length+projectLinks.length&&<details className="news-other-links"><summary>Yazıdaki diğer dış bağlantılar</summary><ul>{(event.references||[]).filter(reference=>!matchedUrls.has(reference.url)&&!projectLinks.some(link=>link.url===reference.url)).slice(0,8).map(reference=><li key={reference.url}><a href={reference.url} target="_blank" rel="noopener noreferrer">{reference.label||new URL(reference.url).hostname} ↗</a></li>)}</ul><small>Bağlantı türü incelenmedi; ürün veya öneri olarak sınıflandırılmadı.</small></details>}
   </article>;
  })}</div>
  {all.length>12&&<nav className="pagination" aria-label="Haber sayfaları">{page>1?<Link href={href(page-1)}>← Önceki</Link>:<span/>}<span>{page} / {pages}</span>{page<pages?<Link href={href(page+1)}>Sonraki →</Link>:<span/>}</nav>}
  <p className="collection-note">Kaynak kapsamı ve son başarılı tarama: <Link href="/sources">Kaynaklar →</Link> · Ürün ilgisinin ayrı özeti: <Link href="/briefing">Radar özeti →</Link></p>
 </>;
}
