'use client';
import {useState} from 'react';
import Link from 'next/link';
import type {FeedCard} from '@/lib/evaluation';
import {lessons} from '@/lib/lessons';
import {selectionFor} from '@/lib/selection';

export function NewsFeed({feed}:{feed:{momentum:FeedCard[];mentioned:FeedCard[]}}){
 const [limit,setLimit]=useState(8);
 // Evidence-backed momentum leads; a mention is visible but never promoted as a hit.
 const cards=[...feed.momentum,...feed.mentioned];
 return <section className="radar-feed-view" aria-label="Bu haftanın gündemi">
  <div className="radar-feed-intro">
   <p className="eyebrow">KAYNAKLI KEŞİF</p>
   <h2>Bu haftanın gündemi</h2>
   <p>Son 7 gündeki kaynaklı proje sinyalleri. <strong>İlgi gördü</strong> ölçülen etkileşimi, <strong>Bahsedildi</strong> ise yalnızca yeni bir bağlantıyı anlatır. Hazır dersi olan kartta “Bundan öğren” bulunur.</p>
   <p className="feed-tally">{feed.momentum.length} ölçülmüş ilgi · {feed.mentioned.length} yalnızca bahsedilme</p>
  </div>
  {cards.length===0?<div className="lesson-panel"><p>Bu hafta açıklaması, site bağlantısı ve güncel kaynak sinyali bulunan proje yok. Bu, kaynakların taranmadığı anlamına gelmeyebilir; son koşuları Kaynaklar ekranından kontrol edebilirsin.</p><Link href="/sources">Kaynak durumuna bak →</Link></div>:<div className="discovery-briefs">{cards.slice(0,limit).map(card=>{
   const lesson=lessons.find(l=>l.buildId===card.id);
   const reviewed=lesson&&selectionFor(lesson).featured?lesson:null;
   const relevantSignals=card.signals.filter(signal=>signal.kind===(card.status==='momentum'?'momentum':'mention')).slice(0,2);
   return <article key={card.id} className="discovery-brief">
    {reviewed&&<Link href={'/learn/'+reviewed.slug} className="radar-feed-preview"><img src={'/preview/'+card.id} alt={reviewed.name+' — '+(reviewed.media?.label||'Radar ekran görüntüsü')} loading="lazy"/></Link>}
    <span className="feed-signal-tag" data-kind={card.status}>{card.status==='momentum'?'İlgi gördü':'Bahsedildi'}</span>
    {reviewed&&<span className="feed-signal-tag" data-kind="lesson">Öğrenme dersi hazır</span>}
    <small>{card.category} · {card.aiStatus==='Verified'?'AI ile geliştirme doğrulandı':card.aiStatus==='Builder-stated'?'AI ile geliştirme: üretici beyanı':'AI ile geliştirildiği belirsiz'}</small>
    <h3><Link href={'/builds/'+card.id}>{card.name}</Link></h3>
    <p><strong>Ne yapıyor?</strong> {card.description}</p>
    <div className="discovery-reason"><strong>{card.status==='momentum'?'Neden ilgi gördü?':'Nerede bahsedildi?'}</strong>{relevantSignals.map((signal,i)=><p key={i}><a href={signal.url} target="_blank" rel="noopener noreferrer">{signal.source} · {signal.label} ↗</a><small> · {new Date(signal.eventAt).toLocaleDateString('tr-TR',{timeZone:'Europe/Istanbul'})}</small></p>)}</div>
    {card.tools.length>0&&<p className="feed-tools"><strong>Beyan edilen AI araçları:</strong> {card.tools.join(', ')}</p>}
    <nav><a data-radar-action="try" href={card.siteUrl} target="_blank" rel="noopener noreferrer">Siteyi aç ↗</a><Link data-radar-action={reviewed?'learn':undefined} href={reviewed?'/learn/'+reviewed.slug:'/builds/'+card.id}>{reviewed?'Bundan öğren →':'Açıklama ve kanıtlar →'}</Link></nav>
   </article>;
  })}</div>}
  {cards.length>0&&<p className="collection-note" role="status">{Math.min(limit,cards.length)} / {cards.length} kayıt gösteriliyor · Ölçülmüş ilgi önce, sonra yeni bahsedilme</p>}
  {limit<cards.length&&<button className="outline-button" onClick={()=>setLimit(n=>n+8)}>8 kayıt daha göster ↓</button>}
 </section>;
}
