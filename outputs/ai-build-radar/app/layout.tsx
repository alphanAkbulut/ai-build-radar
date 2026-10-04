import type {Metadata} from 'next';
import './globals.css';
export const metadata:Metadata={title:{default:'AI Build Radar',template:'%s · AI Build Radar'},description:'Private, evidence-based build intelligence',robots:{index:false,follow:false}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="tr"><body>{children}</body></html>;}
