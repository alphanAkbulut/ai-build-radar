import reviews from '../content/lesson-reviews.json';
import previews from '../previews/manifest.json';
import type {Lesson} from './lessons';
const reasons:Record<string,string>={
 'llm-council':'Tek model cevabı yerine anonim karşılaştırma ve sentez akışını gösteriyor; Karpathy’nin kendi denemesi ve AI geliştirme beyanı kaynaklı.',
 'autoresearch':'Ölç, değiştir, dene ve geri al döngüsünü AI ajanına devrediyor. Öğrenme değeri, sonucu ölçülebilen bir hedef tanımlamakta.',
 'motion-pad':'Açılır menüdeki animasyon seçeneklerini tek bir sürükleme yüzeyine dönüştürüyor. Canlı etkileşimi incelendi; Claude Code kullanımı geliştirici beyanı.',
 'metaballs':'Organik şekil üretimini parametrelerle kontrol edilen bir tasarım aracına dönüştürüyor. Görsel etkileşim örneği olarak seçildi; trend olduğu için değil.',
 'excalidraw':'Çizim, seçim ve geri alma akışlarını bir arada incelemek için somut bir arayüz referansı. AI ile üretildiği doğrulanmış değil.',
 'tldraw':'Bir tuvali özel şekiller ve araçlarla başka bir ürüne dönüştürme yöntemini belgeleyen geliştirici örneği.',
 'gradio':'Bir Python işlevini başkalarının deneyebileceği arayüze çevirme yolunu örnek kodla gösteriyor; model demosu yapmak isteyenler için uygulanabilir.',
 'web-llm':'Modeli sunucu yerine tarayıcıda çalıştırma yaklaşımını paket ve demo ile gösteriyor; yükleme ve cihaz sınırları öğrenme konusu.',
 'jev-9b-decision-demo':'Açık model ve çalışan demo, serbest metin üretimi yerine türü belirli kararın olasılığını görünür kılıyor. Radar kısa bir System 1 sorusunu gerçekten çalıştırdı; modelin başarı iddiaları geliştirici ölçümü.',
 'mimo-rl-explorer':'Bir AI ajanı görevinin yalnızca sonucunu değil, talimatını, çalışma ortamını ve puanlama rubriğini de açıyor. Türkçe filtre ve görev ayrıntısı denendi; ücretli rollout çalıştırılmadı.'
};
export type SelectionReview={level:string;url:string;finding:string;checkedAt:string};
export function selectionFor(l:Lesson,review:SelectionReview|undefined=(reviews as Record<string,SelectionReview>)[l.slug],now=Date.now()){
 const age=review?now-Date.parse(review.checkedAt):NaN;
 const checks=[
  {id:'purpose',label:'Ne yaptığı ve geliştirici açıklaması kaynaklı',passed:!!l.purpose.what.trim()&&/^https:\/\//.test(l.purpose.source)},
  {id:'demo',label:'Temel etkileşim son 30 günde denenmiş',passed:!!review&&review.level==='interaction'&&/^https:\/\//.test(review.url)&&review.finding.trim().length>0&&Number.isFinite(age)&&age>=0&&age<=30*86400000},
  {id:'preview',label:'Gerçek demo önizlemesi kaydedilmiş',passed:!!l.media?.url||!!(l.buildId&&(previews as Record<string,unknown>)[l.buildId])},
  {id:'difference',label:'Ayırt edici öğrenme gerekçesi yazılmış',passed:!!reasons[l.slug]},
  {id:'learning',label:'Öğrenme amacı, adımlar ve kabul kontrolleri hazır',passed:!!l.purpose.application.trim()&&l.exercise.length>=3&&l.checks.length>=2&&l.exercise.every(x=>!!x.trim())&&l.checks.every(x=>!!x.trim())}
 ];
 const missing=checks.filter(c=>!c.passed).map(c=>c.label);
 return {featured:missing.length===0,checks,missing,reason:reasons[l.slug]||'Ayırt edici öğrenme gerekçesi henüz hazırlanmadı.',learning:l.purpose.application};
}
export const methodReference={url:'https://simonwillison.net/2026/Mar/13/',publishedAt:'2026-03-13',label:'Simon Willison · Autoresearch yaklaşımının Liquid’de kullanımı',note:'Yazı, Tobias Lütke’nin Liquid optimizasyonunda benzer bir deney döngüsü kullanmasını inceliyor. Mart 2026 tarihli yöntem örneği; bugünün trend kanıtı değil.'};
