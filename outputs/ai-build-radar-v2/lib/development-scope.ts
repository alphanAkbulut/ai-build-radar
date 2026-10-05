// Interpret only the scope of an explicit first-party statement. This does not
// measure generated-code percentage or independently verify tool usage.
export type DevelopmentScope='full-claimed'|'part-claimed'|'project-claimed'|'unspecified';
export function developmentScope(quote:string,tool:string):{kind:DevelopmentScope;summary:string}{
 const name=tool.trim()||'AI aracı';
 const escaped=name.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
 const toolName=new RegExp(`\\b${escaped}\\b`,'i');
 if(!toolName.test(quote))return {kind:'unspecified',summary:`${name} kullanımının kapsamı bu kaynakta açıklanmıyor.`};
 const full=new RegExp(`\\b(?:built|created|developed|coded|made)\\s+(?:entirely|completely|fully|100%)\\s+(?:with|using|by)\\s+(?:the\\s+)?${escaped}\\b`,'i');
 if(full.test(quote))return {kind:'full-claimed',summary:`Üretici tüm projeyi ${name} ile yaptığını söylüyor; bu bağımsız doğrulama veya insan katkısının yokluğu anlamına gelmez.`};
 const part=new RegExp(`\\b(?:used|using)\\s+(?:the\\s+)?${escaped}\\s+(?:only\\s+|specifically\\s+)?(?:for|to)\\b|\\b(?:UI|interface|front[ -]?end|back[ -]?end|API|tests?|documentation|animation|design)\\s+(?:was|is)?\\s*(?:built|created|designed|coded|made)\\s+(?:with|using)\\s+(?:the\\s+)?${escaped}\\b`,'i');
 if(part.test(quote))return {kind:'part-claimed',summary:`Üretici ${name} kullanımını belirli bir özellik veya aşamayla ilişkilendiriyor; ürünün tamamına genellenemez.`};
 const project=new RegExp(`\\b(?:built|created|developed|coded|made)\\s+(?:with|using|by)\\s+(?:the\\s+)?${escaped}\\b|\\bAI[- ]generated\\b[\\s\\S]{0,100}\\b${escaped}\\b`,'i');
 if(project.test(quote))return {kind:'project-claimed',summary:`Üretici projeyi ${name} ile geliştirdiğini söylüyor. Hangi parçaların üretildiği ve insan katkısının miktarı belirtilmiyor.`};
 return {kind:'unspecified',summary:`${name} kullanımı beyan edilmiş; hangi özellik veya aşamada kullanıldığı belirtilmiyor.`};
}
