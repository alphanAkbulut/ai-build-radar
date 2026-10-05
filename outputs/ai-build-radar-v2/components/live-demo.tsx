'use client';
import {useState} from 'react';
export function LiveDemo({url,name}:{url:string;name:string}){
 const [open,setOpen]=useState(false);
 return <><button data-radar-action="try" className="demo-button" onClick={()=>setOpen(true)}>▶ Canlı demoyu dene</button>{open&&<div className="demo-overlay"><section role="dialog" aria-modal="true" aria-label={name+' canlı demo'} className="demo-dialog" onKeyDown={e=>{if(e.key==='Escape')setOpen(false);}}><header><div><strong>{name}</strong><small>Canlı site · Etkileşimli demo · Dış kaynak</small></div><a href={url} target="_blank" rel="noopener noreferrer">Ayrı sekmede aç ↗</a><button autoFocus onClick={()=>setOpen(false)}>Kapat ✕</button></header><iframe src={url} title={name+' canlı demo'} sandbox="allow-scripts" referrerPolicy="no-referrer"/><p>İçerik açılmazsa ayrı sekmede deneyebilirsin. Bu görüntü doğrudan ürünün sitesinden gelir.</p></section></div>}</>;
}
