import {z} from 'zod';
import {lessonBySlug} from './lessons';
export const analyticsEvent=z.object({id:z.string().uuid(),action:z.enum(['try','learn']),slug:z.string().max(80).refine(s=>!!lessonBySlug(s))}).strict();
export type AnalyticsEvent=z.infer<typeof analyticsEvent>;
export type SavedEvent=AnalyticsEvent & {at:string};
export function summarize(events:SavedEvent[]){const rows=new Map<string,{slug:string;try:number;learn:number}>();const seen=new Set<string>();for(const e of events){if(seen.has(e.id))continue;seen.add(e.id);const row=rows.get(e.slug)||{slug:e.slug,try:0,learn:0};row[e.action]++;rows.set(e.slug,row);}return [...rows.values()].sort((a,b)=>(b.try+b.learn)-(a.try+a.learn));}
