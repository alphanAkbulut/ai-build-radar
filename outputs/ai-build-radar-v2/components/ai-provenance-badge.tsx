import Link from 'next/link';

export function AiProvenanceBadge({buildId,evidenceUrl,agentVerified,builderStated}:{buildId?:string;evidenceUrl?:string;agentVerified:boolean;builderStated:boolean}){
 if(agentVerified&&buildId)return <Link className="ai-provenance-badge agent" href={'/builds/'+buildId+'#agent-contribution'} title="Belirli kod değişikliğinde agent katkısı doğrulandı; tüm ürün için iddia değildir.">✦ Agent katkısı kanıtlı</Link>;
 if(builderStated&&buildId)return <Link className="ai-provenance-badge stated" href={'/builds/'+buildId+'#ai-evidence'} title="AI geliştirme aracı kullanımı geliştiricinin beyanıdır; bağımsız doğrulama değildir.">✦ Geliştirici beyanı</Link>;
 if(builderStated&&evidenceUrl)return <a className="ai-provenance-badge stated" href={evidenceUrl} target="_blank" rel="noopener noreferrer" title="AI geliştirme aracı kullanımı geliştiricinin beyanıdır; bağımsız doğrulama değildir.">✦ Geliştirici beyanı</a>;
 return null;
}
