import nextEnv from '@next/env';
nextEnv.loadEnvConfig(process.cwd());
const {ingest}=await import('../lib/pipeline');
const runs=await ingest({force:process.argv.includes('--force'),only:process.argv.find(a=>a.startsWith('--source='))?.split('=')[1]});
console.log(JSON.stringify(runs,null,2));if(runs.some(r=>r.status==='failed'||r.status==='partial'))process.exitCode=1;
