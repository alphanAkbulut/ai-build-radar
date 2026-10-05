import {Suspense} from 'react';
import {attentionKind} from '@/lib/attention';
import Collection from '@/components/collection';
import {dashboardStore} from '@/lib/data';
export default async function Page(){const store=await dashboardStore();const pendingSignals=store.builds.flatMap(b=>{const key=b.aliases.find(a=>a.startsWith('https://github.com/'))||b.canonicalUrl;const attention=store.attention?.[key];return attention&&attentionKind(attention)==='recent'?[{id:b.id,name:b.name,attention}]:[];}).slice(0,3);return <Suspense fallback={<p>Koleksiyon yükleniyor…</p>}><Collection pendingSignals={pendingSignals} attention={store.attention}/></Suspense>;}
