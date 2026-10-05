'use client';
import {useEffect,useState} from 'react';
export function ThemeToggle(){
 const [dark,setDark]=useState(false);
 useEffect(()=>{setDark(document.documentElement.dataset.theme==='dark');},[]);
 function toggle(){const next=!dark;setDark(next);document.documentElement.dataset.theme=next?'dark':'light';try{localStorage.setItem('radar-theme',next?'dark':'light');}catch{}}
 return <button className="theme-toggle" aria-label="Koyu tema" aria-pressed={dark} onClick={toggle}>{dark?'☀ Açık tema':'☾ Koyu tema'}</button>;
}
