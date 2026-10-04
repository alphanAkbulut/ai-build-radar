'use client';
import {useEffect,useState} from 'react';
import type {UpdateSummary} from '@/lib/update-summary';
const stamp=(v:string)=>new Intl.DateTimeFormat('tr-TR',{dateStyle:'medium',timeStyle:'short',timeZone:'Europe/Istanbul'}).format(new Date(v));
const status={completed:'Tamamlandı',partial:'Kısmen tamamlandı',failed:'Başarısız',running:'Sürüyor'};
export function UpdateBanner({initial}:{initial:UpdateSummary}){
 const [data,setData]=useState(initial),[stale,setStale]=useState(false);
 useEffect(()=>{const controller=new AbortController();const poll=async()=>{try{const r=await fetch('/api/update-summary',{cache:'no-store',signal:controller.signal});if(!r.ok)throw Error();setData(await r.json());setStale(false);}catch{if(!controller.signal.aborted)setStale(true);}};const timer=setInterval(poll,60000);return()=>{controller.abort();clearInterval(timer);};},[]);
 const r=data.latest;
 return <details className="update-indicator" onKeyDown={e=>{if(e.key==='Escape')e.currentTarget.open=false;}}><summary aria-label="Güncelleme geçmişini aç"><i className={stale||r?.status==='failed'||r?.status==='partial'?'attention':''}/><span>{stale?'Durum alınamadı':r?`Son tarama · ${stamp(r.at)}`:'Henüz tarama yok'}</span><span aria-hidden="true">⌄</span></summary><div className="update-popover"><strong>Güncelleme geçmişi</strong>{r&&<p>{r.source} · {status[r.status]}<br/>{r.created} yeni proje · {r.evidenceAdded} yeni kanıt</p>}{stale&&<p>Son alınan bilgi gösteriliyor; durum yenilenemedi.</p>}{r&&r.status!=='completed'&&<p>Son başarılı tarama: {data.lastSuccess?stamp(data.lastSuccess):'Henüz yok'}</p>}{data.recent.map(run=><p className="update-entry" key={run.id}><b>{run.source}</b> · {status[run.status]}<small>{stamp(run.at)} · İstanbul</small><span>{run.created} yeni proje · {run.evidenceAdded} yeni kanıt · {run.unchanged} değişmeyen kayıt</span></p>)}<a href="/sources">Tüm kaynaklar ve ayrıntılar ↗</a><small>Kanıt sayısı proje sayısı değildir. Özet dakikada bir yenilenir; liste için sayfayı yenile.</small></div></details>;
}
