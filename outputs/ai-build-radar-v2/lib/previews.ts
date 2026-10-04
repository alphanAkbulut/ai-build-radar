import 'server-only';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
export type Preview={url:string;capturedAt:string;method:'browser-screenshot';label:string;interactive?:boolean};
export async function previewIndex():Promise<Record<string,Preview>>{try{return JSON.parse(await readFile(path.join(process.cwd(),'previews/manifest.json'),'utf8'));}catch(e){if((e as NodeJS.ErrnoException).code==='ENOENT')return {};throw e;}}
