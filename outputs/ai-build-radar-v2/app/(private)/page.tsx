import {sourceSignals} from '@/lib/source-signals';
import {Suspense} from 'react';
import {attentionKind,type Attention} from '@/lib/attention';
import Collection from '@/components/collection';
import {dashboardStore} from '@/lib/data';
export default async function Page(){const store=await dashboardStore();const pendingSignals=store.builds.flatMap<{id:string;name:string;attention?:Attention;signal?:ReturnType<typeof sourceSignals>[number]}>(b=>{const key=b.aliases.find(a=>a.startsWith('https://github.com/'))||b.canonicalUrl;const attention=store.attention?.[key];const signal=sourceSignals(store,b.id).find(s=>{const age=Date.now()-Date.parse(s.date);return age>=0&&age<=7*86400000;});return signal?[{id:b.id,name:b.name,signal,attention:undefined}]:attention&&attentionKind(attention)==='recent'?[{id:b.id,name:b.name,attention,signal:undefined}]:[];}).slice(-6);const externalSignals=Object.fromEntries(store.builds.flatMap(b=>b.aliases.map(a=>[a,sourceSignals(store,b.id)])));return <Suspense fallback={<p>Koleksiyon yükleniyor…</p>}><Collection externalSignals={externalSignals} pendingSignals={pendingSignals} attention={store.attention}/></Suspense>;}
