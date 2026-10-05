import {lessons} from '@/lib/lessons';
import {selectionFor} from '@/lib/selection';
import Link from 'next/link';
import {ArrowRight,ArrowUpRight} from 'lucide-react';
import {dashboardStore} from '@/lib/data';
import {previewIndex} from '@/lib/previews';
import {cleanParams,destinations} from '@/lib/discovery';
import {DiscoveryFilters,BuildCards,discover} from '@/components/discovery';
import {Empty} from '@/components/ui';
export default async function Today({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}){
 const params=cleanParams(await searchParams),store=await dashboardStore(),previews=await previewIndex();
 const recent={...store,builds:store.builds.filter(b=>!lessons.some(l=>(l.buildId===b.id||b.aliases.includes(l.repo.toLowerCase()))&&selectionFor(l).featured))};const results=discover(recent,params);
 return <><div className="discovery-heading"><div><p className="eyebrow"><span className="signal-dot"/> TODAY / {new Intl.DateTimeFormat('tr-TR',{day:'numeric',month:'long',timeZone:'Europe/Istanbul'}).format(new Date())}</p><h1>İnceleme alanı<span className="orange">.</span></h1><p>Radar’ın iç inceleme kuyruğu. Buradaki ürünlerin demosu ve ayırt edici tarafı doğrulanmadı; süre dolduğu için kayıttan silinmezler.</p></div><div className="discovery-tally"><strong>{recent.builds.filter(b=>destinations(b).siteUrl).length}</strong><span>inceleme alanındaki<br/>site bağlantısı</span></div></div>
 <details className="lesson-panel"><summary>Öğrenme örneklerinde eksik kontroller</summary>{lessons.filter(l=>!selectionFor(l).featured).map(l=><p key={l.slug}><Link href={"/learn/"+l.slug+"#review"}>{l.name}</Link> · {selectionFor(l).missing.join("; ")}</p>)}</details><DiscoveryFilters base="/candidates" params={params} store={recent}/>
 <div className="discovery-section"><div><h2>{params.category?'Kategoride keşfet':'Radar’a yeni girenler'}</h2><span>{results.length} proje · Denenmiş demolar önce, ardından en yeni inceleme kayıtları</span></div><Link href={"/builds?group="+(params.group==='uncertain'?'uncertain':'ai')}>Tüm arşiv <ArrowRight size={16}/></Link></div>
 {results.length?<BuildCards store={store} ids={results.slice(0,24).map(b=>b.id)} previews={previews}/>:<Empty title="Bu seçimde yeni proje yok">Başka bir kategori deneyebilir veya tüm arşive bakabilirsin.</Empty>}
 <div className="discovery-bottom"><p><strong>Gör, dene, sonra derine in.</strong> Site bağlantıları kaynaklardan gelir. Ekran görüntüsü geçmiş bir anı gösterir; projenin kalitesi veya AI kullanımı için doğrulama değildir.</p><Link href="/sources">Kaynaklar & kanıt yöntemi <ArrowUpRight size={15}/></Link></div></>;
}
