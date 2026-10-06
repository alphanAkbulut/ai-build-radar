import {Suspense} from 'react';
import Collection from '@/components/collection';
import {dashboardStore} from '@/lib/data';
import {evaluateFeed} from '@/lib/evaluation';
import {publishableFeed} from '@/lib/publication';
import {sourceSignals} from '@/lib/source-signals';
import {verifiedAgentContribution} from '@/lib/agent-contribution';
export default async function Page(){
 const store=await dashboardStore();
 const feed=publishableFeed(evaluateFeed(store),store);
 const externalSignals=Object.fromEntries(store.builds.flatMap(b=>b.aliases.map(a=>[a,sourceSignals(store,b.id)])));
 const agentVerifiedIds=store.builds.filter(b=>verifiedAgentContribution(store,b.id)).map(b=>b.id);
 return <Suspense fallback={<p>Koleksiyon yükleniyor…</p>}><Collection feed={feed} externalSignals={externalSignals} attention={store.attention} agentVerifiedIds={agentVerifiedIds}/></Suspense>;
}
