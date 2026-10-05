import type {Lesson} from './lessons';
const reasons:Record<string,string>={
 'llm-council':'Tek model cevabı yerine anonim karşılaştırma ve sentez akışını gösteriyor; Karpathy’nin kendi denemesi ve AI geliştirme beyanı kaynaklı.',
 'autoresearch':'Ölç, değiştir, dene ve geri al döngüsünü AI ajanına devrediyor. Öğrenme değeri, sonucu ölçülebilen bir hedef tanımlamakta.',
 'motion-pad':'Açılır menüdeki animasyon seçeneklerini tek bir sürükleme yüzeyine dönüştürüyor. Canlı etkileşimi incelendi; Claude Code kullanımı geliştirici beyanı.',
 'metaballs':'Organik şekil üretimini parametrelerle kontrol edilen bir tasarım aracına dönüştürüyor. Görsel etkileşim örneği olarak seçildi; trend olduğu için değil.',
 'excalidraw':'Çizim, seçim ve geri alma akışlarını bir arada incelemek için somut bir arayüz referansı. AI ile üretildiği doğrulanmış değil.',
 'tldraw':'Bir tuvali özel şekiller ve araçlarla başka bir ürüne dönüştürme yöntemini belgeleyen geliştirici örneği.',
 'gradio':'Bir Python işlevini başkalarının deneyebileceği arayüze çevirme yolunu örnek kodla gösteriyor; model demosu yapmak isteyenler için uygulanabilir.',
 'web-llm':'Modeli sunucu yerine tarayıcıda çalıştırma yaklaşımını paket ve demo ile gösteriyor; yükleme ve cihaz sınırları öğrenme konusu.'
};
export function selectionFor(l:Lesson){return {featured:!!reasons[l.slug],reason:reasons[l.slug]||'Temel kaynak incelemesi var; ana seçki için ayırt edici özellik ve uygulanabilir öğrenme incelemesi henüz yeterince derinleştirilmedi.',learning:l.purpose.application};}
export const methodReference={url:'https://simonwillison.net/2026/Mar/13/',publishedAt:'2026-03-13',label:'Simon Willison · Autoresearch yaklaşımının Liquid’de kullanımı',note:'Yazı, Tobias Lütke’nin Liquid optimizasyonunda benzer bir deney döngüsü kullanmasını inceliyor. Mart 2026 tarihli yöntem örneği; bugünün trend kanıtı değil.'};
