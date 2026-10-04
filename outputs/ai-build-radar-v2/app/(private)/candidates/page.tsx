import Link from 'next/link';
import {ArrowRight,ArrowUpRight} from 'lucide-react';
import {dashboardStore} from '@/lib/data';
import {previewIndex} from '@/lib/previews';
import {cleanParams,destinations} from '@/lib/discovery';
import {DiscoveryFilters,BuildCards,discover} from '@/components/discovery';
import {Empty} from '@/components/ui';
export default async function Today({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}){
 const params=cleanParams(await searchParams),store=await dashboardStore(),previews=await previewIndex();
 const recent={...store,builds:store.builds.filter(b=>Date.parse(b.firstSeenAt)>Date.now()-24*60*60*1000)};const results=discover(recent,params,previews);
 return <><div className="discovery-heading"><div><p className="eyebrow"><span className="signal-dot"/> TODAY / {new Intl.DateTimeFormat('tr-TR',{day:'numeric',month:'long',timeZone:'Europe/Istanbul'}).format(new Date())}</p><h1>Aday havuzu<span className="orange">?</span></h1><p>Otomatik bulunan kayıtlar. Öğrenme koleksiyonuna henüz alınmış sayılmazlar.</p></div><div className="discovery-tally"><strong>{recent.builds.filter(b=>destinations(b).siteUrl).length}</strong><span>son 24 saatte keşfedilen<br/>site bağlantısı</span></div></div>
 <DiscoveryFilters base="/candidates" params={params} store={recent}/>
 <div className="discovery-section"><div><h2>{params.category?'Kategoride keşfet':'Radar’a yeni girenler'}</h2><span>{results.length} proje · Önizlemeli önce, ardından en yeni</span></div><Link href={"/builds?group="+(params.group==='uncertain'?'uncertain':'ai')}>Tüm arşiv <ArrowRight size={16}/></Link></div>
 {results.length?<BuildCards store={store} ids={results.slice(0,12).map(b=>b.id)} previews={previews}/>:<Empty title="Bu seçimde yeni proje yok">Başka bir kategori deneyebilir veya tüm arşive bakabilirsin.</Empty>}
 <div className="discovery-bottom"><p><strong>Gör, dene, sonra derine in.</strong> Site bağlantıları kaynaklardan gelir. Ekran görüntüsü geçmiş bir anı gösterir; projenin kalitesi veya AI kullanımı için doğrulama değildir.</p><Link href="/sources">Kaynaklar & kanıt yöntemi <ArrowUpRight size={15}/></Link></div></>;
}
