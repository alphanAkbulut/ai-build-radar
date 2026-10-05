import {Suspense} from 'react';
import Collection from '@/components/collection';
import {dashboardStore} from '@/lib/data';
import {evaluateFeed} from '@/lib/evaluation';
import {sourceSignals} from '@/lib/source-signals';
export default async function Page(){
 const store=await dashboardStore();
 const feed=evaluateFeed(store);
 const externalSignals=Object.fromEntries(store.builds.flatMap(b=>b.aliases.map(a=>[a,sourceSignals(store,b.id)])));
 return <Suspense fallback={<p>Koleksiyon yükleniyor…</p>}><Collection feed={feed} externalSignals={externalSignals} attention={store.attention}/></Suspense>;
}
