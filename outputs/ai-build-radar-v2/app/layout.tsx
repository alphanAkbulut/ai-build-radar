import type {Metadata} from 'next';
import './globals.css';
export const metadata:Metadata={title:{default:'AI Build Radar',template:'%s · AI Build Radar'},description:'Private, evidence-based build intelligence',robots:{index:false,follow:false}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="tr" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{__html:`try{var t=localStorage.getItem("radar-theme");document.documentElement.dataset.theme=t==="dark"||(!t&&matchMedia("(prefers-color-scheme: dark)").matches)?"dark":"light"}catch{}`}}/></head><body>{children}</body></html>;}
