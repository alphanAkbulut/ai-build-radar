import {mkdir,writeFile} from 'node:fs/promises';
import {z} from 'zod';
import {sources} from '../lib/sources';
import {BuildSchema,EvidenceSchema} from '../lib/schema';
await mkdir('schemas',{recursive:true});
await writeFile('schemas/build-entity.schema.json',JSON.stringify(z.toJSONSchema(BuildSchema),null,2)+'\n');
await writeFile('schemas/evidence-object.schema.json',JSON.stringify(z.toJSONSchema(EvidenceSchema),null,2)+'\n');
await writeFile('schemas/source-registry.json',JSON.stringify(sources,null,2)+'\n');
