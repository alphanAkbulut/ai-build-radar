import {Suspense} from 'react';
import Collection from '@/components/collection';
export default function Page(){return <Suspense fallback={<p>Koleksiyon yükleniyor…</p>}><Collection/></Suspense>;}
