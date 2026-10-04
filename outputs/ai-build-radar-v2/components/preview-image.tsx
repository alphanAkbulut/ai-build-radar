"use client";
import {useState} from 'react';
import {ImageOff,ArrowUpRight} from 'lucide-react';
export function PreviewImage({id,name,hasPreview,hasSite,mark}:{id:string;name:string;hasPreview:boolean;hasSite:boolean;mark:string}){
 const [failed,setFailed]=useState(false);
 return <>{hasPreview&&!failed?<img src={'/preview/'+id} alt={`${name} — gerçek site ekran görüntüsü`} loading="lazy" onError={()=>setFailed(true)}/>:<div className="preview-fallback"><span className="preview-symbol" aria-hidden="true">{mark}</span><span>{hasSite?'Önizleme henüz yok':'Web demosu bulunamadı'}</span><small>{hasSite?'Site bağlantısından keşfedebilirsin':'Detay ve kaynak kodu mevcut olabilir'}</small></div>}{hasSite&&<span className="preview-open"><ArrowUpRight size={20}/></span>}</>;
}
