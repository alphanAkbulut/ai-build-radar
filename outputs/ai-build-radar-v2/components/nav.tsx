"use client";
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {Sun,Layers3,RadioTower,Users,ChartNoAxesColumn} from 'lucide-react';
const items=[{href:'/',label:'Öğrenme koleksiyonu',icon:Sun},{href:'/people',label:'İnsanlar & fikirler',icon:Users},{href:'/candidates',label:'Aday havuzu',icon:Layers3},{href:'/builds',label:'Tüm kayıtlar',icon:Layers3},{href:'/analytics',label:'Kullanım',icon:ChartNoAxesColumn},{href:'/sources',label:'Sources',icon:RadioTower}];
export function Nav(){const path=usePathname();return <nav aria-label="Ana menü">{items.map(({href,label,icon:Icon})=><Link key={href} href={href} className={'nav-item '+((href==='/'?path==='/':path.startsWith(href))?'active':'')} aria-current={(href==='/'?path==='/':path.startsWith(href))?'page':undefined}><Icon size={19}/>{label}</Link>)}</nav>;}

export function MobileNav({children}:{children:React.ReactNode}){const path=usePathname();return <details key={path} className="mobile-navigation" onKeyDown={e=>{if(e.key==='Escape'){e.currentTarget.removeAttribute('open');e.currentTarget.querySelector('summary')?.focus();}}}><summary>Menü <span aria-hidden="true">☰</span></summary><div className="mobile-menu-panel" onClick={e=>{if((e.target as HTMLElement).closest('a'))e.currentTarget.closest('details')?.removeAttribute('open');}}><Nav/>{children}</div></details>;}
