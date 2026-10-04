import {networkInterfaces} from 'node:os';
import {spawn} from 'node:child_process';
const entries=Object.entries(networkInterfaces()).flatMap(([name,items])=>(items||[]).filter(i=>i.family==='IPv4'&&!i.internal&&/^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(i.address)).map(i=>({name,address:i.address})));
const preferred=entries.find(i=>i.name==='en0')||(entries.length===1?entries[0]:undefined);
if(!preferred){console.error('Yerel Wi-Fi adresi belirlenemedi. Wi-Fi bağlantısını kontrol edin.');process.exit(1);}
console.log(`Telefondan aynı Wi-Fi ile açın: http://${preferred.address}:3102`);
console.log('Mevcut Radar parolası gerekir. Bu pencereyi kapatınca telefon erişimi durur.');
const child=spawn(process.execPath,['node_modules/next/dist/bin/next','start','--hostname',preferred.address,'--port','3102'],{stdio:'inherit'});
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>child.kill(signal));
child.on('exit',code=>process.exit(code??0));child.on('error',e=>{console.error(e.message);process.exit(1);});
