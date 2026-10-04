import {dashboardStore} from '@/lib/data';
import {previewIndex} from '@/lib/previews';
import {cleanParams} from '@/lib/discovery';
import {DiscoveryFilters,BuildCards,discover} from '@/components/discovery';
import {Empty} from '@/components/ui';
export const metadata={title:'Builds'};
export default async function Builds({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}){
 const params=cleanParams(await searchParams),store=await dashboardStore(),previews=await previewIndex();const results=discover(store,params,previews);
 const pages=Math.max(1,Math.ceil(results.length/18));const page=Math.min(pages,Math.max(1,Math.floor(Number(params.page))||1));
 const pageUrl=(n:number)=>'/builds?'+new URLSearchParams({...Object.fromEntries(Object.entries(params).filter(([,v])=>v) as [string,string][]),page:String(n)});
 return <><div className="discovery-heading"><div><p className="eyebrow">THE BUILD COLLECTION</p><h1>Bir sonraki keşfin<span className="orange">.</span></h1><p>AI ile yapılanları ve aday projeleri gez. İlgini çekeni doğrudan aç.</p></div><span className="total-label">{store.builds.length} kayıt · Gerçek kaynak verisi</span></div><DiscoveryFilters base="/builds" params={params} store={store}/><div className="discovery-section"><div><h2>{results.length} proje</h2><span>Önizlemeli önce, ardından en yeni</span></div></div>{results.length?<BuildCards store={store} ids={results.slice((page-1)*18,page*18).map(b=>b.id)} previews={previews}/>:<Empty title="Eşleşen proje yok">Aramanı veya kategori seçimini değiştirebilirsin.</Empty>}<div className="pagination">{page>1?<a href={pageUrl(page-1)}>← Önceki</a>:<span/>}<span>{page} / {pages}</span>{page<pages?<a href={pageUrl(page+1)}>Sonraki →</a>:<span/>}</div><p className="category-note">Kategoriler keşif için önerilen gruplardır. Özgün kaynak kategorisi ve kanıtları proje detayında korunur.</p></>;
}
