import {z} from 'zod';
export const summaryLanguages={tr:'Türkçe',en:'English',ja:'日本語',ko:'한국어',zh:'中文'} as const;
export type SummaryLanguage=keyof typeof summaryLanguages;
export const summaryRequest=z.object({entryId:z.string().regex(/^[a-f0-9]{20}$/),language:z.enum(['tr','en','ja','ko','zh'])}).strict();
export const summaryOutput=z.object({summary:z.string().min(30).max(1600),points:z.array(z.string().min(5).max(500)).min(1).max(3)}).strict();
export type ArticleSummary={summary:string;points:string[];language:SummaryLanguage;sourceUrl:string;sourceHash:string;coverage:string;createdAt:string;version:number};
