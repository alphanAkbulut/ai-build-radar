'use client';
import {useState} from 'react';
import Link from 'next/link';
import type {FeedCard} from '@/lib/evaluation';
import {lessons} from '@/lib/lessons';
import {selectionFor} from '@/lib/selection';

function FeedSection({title,description,cards,kind}:{title:string;description:string;cards:FeedCard[];kind:'momentum'|'mentioned'}){
 const [limit,setLimit]=useState(6);
 const sourceCounts=new Map<string,number>();for(const card of cards)for(const source of new Set(card.signals.filter(signal=>signal.kind===kind).map(signal=>signal.source)))sourceCounts.set(source,(sourceCounts.get(source)||0)+1);
 return <section className="lesson-panel radar-feed" aria-label={title}>
  <div className="radar-feed-heading"><div><p className="eyebrow">{kind==='momentum'?'ÖLÇÜLMÜŞ İLGİ':'YENİ PAYLAŞIMLAR'}</p><h2>{title}</h2><p>{description}</p></div><strong>{cards.length}</strong></div>
  {sourceCounts.size>0&&<p className="collection-note">Listedeki kaynaklar: {[...sourceCounts].map(([source,count])=>`${source} ${count}`).join(' · ')}</p>}
  {cards.length===0?<p>Bu ölçütleri karşılayan, açıklaması ve açılabilir sitesi bulunan proje henüz yok.</p>:<div className="discovery-briefs">{cards.slice(0,limit).map(card=>{const lesson=lessons.find(l=>l.buildId===card.id);const reviewed=lesson&&selectionFor(lesson).featured?lesson:null;return <article key={card.id} className="discovery-brief">
   {reviewed&&<Link href={'/learn/'+reviewed.slug} className="radar-feed-preview"><img src={'/preview/'+card.id} alt={reviewed.name+' canlı demo ekran görüntüsü'} loading="lazy"/></Link>}
   <small>{card.category} · {card.aiStatus==='Verified'?'AI ile geliştirme doğrulandı':card.aiStatus==='Builder-stated'?'AI ile geliştirme: üretici beyanı':'AI ile geliştirildiği belirsiz'} · {reviewed?'Demo denendi':'Demo henüz denenmedi'}</small>
   <h3><Link href={'/builds/'+card.id}>{card.name}</Link></h3>
   <p>{card.description}</p>
   <div className="discovery-reason"><strong>{kind==='momentum'?'İlgi kanıtı':'Nerede bahsedildi?'}</strong>{card.signals.slice(0,2).map((signal,i)=><p key={i}><a href={signal.url} target="_blank" rel="noopener noreferrer">{signal.source} · {signal.label} ↗</a><small> · {new Date(signal.eventAt).toLocaleDateString('tr-TR',{timeZone:'Europe/Istanbul'})}</small></p>)}</div>
   {card.tools.length>0&&<p className="feed-tools"><strong>AI araçları:</strong> {card.tools.join(', ')}</p>}
   <nav><a href={card.siteUrl} target="_blank" rel="noopener noreferrer">Siteyi aç ↗</a><Link href={reviewed?'/learn/'+reviewed.slug:'/builds/'+card.id}>{reviewed?'Nasıl çalışıyor? →':'Açıklama ve kanıtlar →'}</Link></nav>
  </article>})}</div>}
  {cards.length>0&&<p className="collection-note">{Math.min(limit,cards.length)} / {cards.length} kayıt · Son 7 gün</p>}
  {limit<cards.length&&<button className="outline-button" onClick={()=>setLimit(n=>n+6)}>6 kayıt daha göster ↓</button>}
 </section>;
}
export function NewsFeed({feed}:{feed:{momentum:FeedCard[];mentioned:FeedCard[]}}){
 return <div id="radar-feed"><div className="radar-feed-intro"><p className="eyebrow">AI UYGULAMA GÜNDEMİ</p><h2>Bu hafta neler dikkat çekiyor?</h2><p>Kaynaklarda ölçülen ilgiyle yalnızca bahsedilen projeleri ayrı gösteriyoruz. Bir bağlantı veya toplam yıldız sayısı tek başına “hit” kanıtı değildir. Demo testi olanlar aşağıdaki öğrenme seçkisinde yer alır.</p></div><FeedSection title="Bu hafta ilgi görenler" description="Hacker News ve diğer topluluklardaki ölçülen etkileşim, Hugging Face trend listesi veya en az 24 saat arayla görülen GitHub yıldız artışı." cards={feed.momentum} kind="momentum"/>{feed.mentioned.length>0&&<FeedSection title="Yeni bahsedilenler" description="Yazılarda ve topluluk paylaşımlarında bağlantısı geçenler. Bu kayıtlar övgü veya yükseliş kanıtı sayılmaz." cards={feed.mentioned} kind="mentioned"/>}</div>;
}
