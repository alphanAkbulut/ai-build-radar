"use client";
import {useActionState} from 'react';
import {RefreshCw} from 'lucide-react';
import {scan} from './actions';
export function ScanButton(){const [state,action,pending]=useActionState(scan,{message:''});return <div className="scan-control"><form action={action}><button className="primary" disabled={pending}><RefreshCw size={16} className={pending?'spin':''}/>{pending?'Taranıyor…':'Zamanı gelenleri tara'}</button></form>{state.message&&<p role="status" className="small">{state.message}</p>}</div>;}
