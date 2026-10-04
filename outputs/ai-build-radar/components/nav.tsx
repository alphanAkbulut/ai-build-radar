"use client";
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {Sun,Layers3,RadioTower} from 'lucide-react';
const items=[{href:'/',label:'Today',icon:Sun},{href:'/builds',label:'Builds',icon:Layers3},{href:'/sources',label:'Sources',icon:RadioTower}];
export function Nav(){const path=usePathname();return <nav aria-label="Ana menü">{items.map(({href,label,icon:Icon})=><Link key={href} href={href} className={'nav-item '+((href==='/'?path==='/':path.startsWith(href))?'active':'')} aria-current={(href==='/'?path==='/':path.startsWith(href))?'page':undefined}><Icon size={19}/>{label}</Link>)}</nav>;}
