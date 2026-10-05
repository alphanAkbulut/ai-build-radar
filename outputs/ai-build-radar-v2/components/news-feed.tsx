'use client';
import {useState} from 'react';
import Link from 'next/link';
import {feedByDevelopmentEvidence,type FeedCard} from '@/lib/evaluation';
import {lessons} from '@/lib/lessons';
import {selectionFor} from '@/lib/selection';
import {developmentScope} from '@/lib/development-scope';

export function NewsFeed({feed}:{feed:{momentum:FeedCard[];discovered:FeedCard[];mentioned:FeedCard[]}}){
 const proven=feedByDevelopmentEvidence(feed,'ai');
 const uncertain=feedByDevelopmentEvidence(feed,'uncertain');
 const [group,setGroup]=useState<'ai'|'uncertain'>(proven.length?'ai':'uncertain');
 const [limit,setLimit]=useState(8);
 const cards=group==='ai'?proven:uncertain;
 const date=(at:string)=>new Date(at).toLocaleString('tr-TR',{timeZone:'Europe/Istanbul',day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'});
 return <section className="radar-feed-view" aria-label="Bu haftanın gündemi">
  <div className="radar-feed-intro">
   <p className="eyebrow">KAYNAKLI KEŞİF</p>
   <h2>Bu haftanın gündemi</h2>
   <p>Burada yalnızca açılıp temel etkileşimi denenmiş, gerçek önizlemesi kaydedilmiş ürünler görünür. <strong>İlgi gördü</strong> ölçülen etkileşimi, <strong>Yeni keşif</strong> Radar’ın ilk gördüğü üretici beyanını, <strong>Bahsedildi</strong> ise kaynak bağlantısını anlatır. Bunlar ürünün çıkış tarihi veya kalite puanı değildir.</p>
  </div>
  <div className="feed-groups" role="group" aria-label="AI ile geliştirilme kanıtı"><button type="button" className={group==='ai'?'selected':''} aria-pressed={group==='ai'} onClick={()=>{setGroup('ai');setLimit(8);}}>AI ile geliştirilenler <span>{proven.length}</span></button><button type="button" className={group==='uncertain'?'selected':''} aria-pressed={group==='uncertain'} onClick={()=>{setGroup('uncertain');setLimit(8);}}>Geliştirme yöntemi belirsiz <span>{uncertain.length}</span></button></div>
  <p className="feed-group-note">{group==='ai'?'AI geliştirme kanıtı veya üretici beyanı bulunan, demosu incelenmiş projeler. Beyan bağımsız doğrulama değildir.':'Demosu incelenmiş AI ürünleri. Bir AI ürünü olmak, AI ile geliştirilmiş olmak anlamına gelmez; bu projeler ayrı tutulur.'}</p>
  {cards.length===0?<div className="lesson-panel"><p>Bu grupta son 7 güne ait hem kaynaklı sinyali hem de denenmiş demosu bulunan ürün yok. Ham keşifler inceleme alanında kalır; açılmayan veya denenmemiş bir siteyi burada ürün diye göstermiyoruz.</p><Link href="/?view=learn">İncelenmiş örnekleri gör →</Link></div>:<div className="discovery-briefs">{cards.slice(0,limit).map(card=>{
   const lesson=lessons.find(l=>l.buildId===card.id);
   const reviewed=lesson&&selectionFor(lesson).featured?lesson:null;
   const relevantSignals=card.signals.filter(signal=>signal.kind===(card.status==='momentum'?'momentum':card.status==='mentioned'?'mention':'discovery')).slice(0,2);
   return <article key={card.id} className="discovery-brief">
    {reviewed&&<Link href={'/learn/'+reviewed.slug} className="radar-feed-preview"><img src={'/preview/'+card.id} alt={reviewed.name+' — '+(reviewed.media?.label||'Radar ekran görüntüsü')} loading="lazy"/></Link>}
    <span className="feed-signal-tag" data-kind={card.status}>{card.status==='momentum'?'İlgi gördü':card.status==='discovered'?'Yeni keşif':'Bahsedildi'}</span>
    {reviewed&&<span className="feed-signal-tag" data-kind="lesson">Öğrenme dersi hazır</span>}
    <small>{card.category} · {card.aiStatus==='Verified'?'AI ile geliştirme doğrulandı':card.aiStatus==='Builder-stated'?'AI ile geliştirme: üretici beyanı':'AI ile geliştirildiği belirsiz'}</small>
    <h3><Link href={'/builds/'+card.id}>{card.name}</Link></h3>
    <p><strong>Ne yapıyor?</strong> {card.description}</p>
    <div className="discovery-reason"><strong>{card.status==='momentum'?'Neden gündemde?':card.status==='discovered'?'Neden eklendi?':'Nerede bahsedildi?'}</strong>{relevantSignals.map((signal,i)=><p key={i}><a href={signal.url} target="_blank" rel="noopener noreferrer">{signal.source} · {signal.label} ↗</a><small> · Olay/gözlem: {date(signal.eventAt)}</small></p>)}<small>Radar ilk gördü: {date(card.firstSeenAt)} · Kanıt son kontrol: {date(relevantSignals[0]?.checkedAt||card.lastEventAt)}</small></div>
    {card.aiEvidence&&<details className="feed-proof"><summary>{card.aiStatus==='Builder-stated'?'AI geliştirme beyanı':'AI geliştirme kanıtı'}</summary><p>Üretici beyanı: “{card.aiEvidence.quote.slice(0,260)}”</p><a href={card.aiEvidence.sourceUrl} target="_blank" rel="noopener noreferrer">Kaynağı aç ↗</a></details>}
    {card.tools.length>0&&<p className="feed-tools"><strong>Beyan edilen AI araçları:</strong> {card.tools.join(', ')}</p>}
    {card.aiEvidence&&<p className="feed-tools"><strong>AI katkısının kapsamı:</strong> {developmentScope(card.aiEvidence.quote,card.aiEvidence.tool).summary}</p>}
    <nav><a data-radar-action="try" href={card.siteUrl} target="_blank" rel="noopener noreferrer">Siteyi aç ↗</a><Link data-radar-action={reviewed?'learn':undefined} href={reviewed?'/learn/'+reviewed.slug:'/builds/'+card.id}>{reviewed?'Bundan öğren →':'Açıklama ve kanıtlar →'}</Link></nav>
   </article>;
  })}</div>}
  {cards.length>0&&<p className="collection-note" role="status">{Math.min(limit,cards.length)} / {cards.length} kayıt gösteriliyor · Önce ölçülen ilgi, sonra yeni keşif ve bahsedilme</p>}
  {limit<cards.length&&<button className="outline-button" onClick={()=>setLimit(n=>n+8)}>8 kayıt daha göster ↓</button>}
 </section>;
}
