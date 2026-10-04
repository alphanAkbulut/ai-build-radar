import {redirect} from 'next/navigation';
import {authenticated,localMode} from '@/lib/auth';
import {LoginForm} from './form';
import {Radar,LockKeyhole} from 'lucide-react';
export default async function Login(){if(await authenticated())redirect('/');return <main className="login-screen"><div className="login-card"><Radar size={42} className="orange"/><p className="eyebrow">AI BUILD RADAR / PRIVATE INTELLIGENCE</p><h1>Kanıtın peşinden.</h1><p className="muted">Gerçek projeler. İzlenebilir kaynaklar.<br/>Yalnızca size açık bir çalışma alanı.</p><LoginForm local={localMode()}/><p className="small muted"><LockKeyhole size={14}/> {localMode()?'Yerel PoC · Bu bilgisayarda çalışır':'Yalnızca izin verilen hesaplar'}</p></div><div className="login-art" aria-hidden="true"><span/><span/><span/><i/></div></main>;}
