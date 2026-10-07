# Build Radar değerlendirme sözleşmesi

Bu belge 6 Ekim 2026 itibarıyla **önerilen ürün standardını** ve **bugün uygulanan kısmı** ayırır. [English](EVALUATION.en.md). Amaç, bir ürün yöneticisinin “AI ile neler yapılıyor, neden dikkat çekiyor, ben nasıl öğrenirim?” sorusuna doğrulanabilir bir yanıt vermektir. Yeni bir model, yaratıcı arayüz veya çözülen gerçek bir sorun aynı derecede seçilme nedeni olabilir. Popülerlik tek ölçüt değildir.

## İki ayrı yayın yüzeyi

1. **AI Build Gündemi**: AI ile geliştirme beyanı olan projeler varsayılan grupta, geliştirme yöntemi belirsiz AI ürünleri ayrı gruptadır. “Ölçülmüş ilgi”, “yeni keşif” ve “bahsedildi” ayrı olay türleridir. Kaynak, olay/gözlem, Radar'ın ilk görme ve son kontrol tarihi görünür. Ham kaynak sinyali tek başına yayın değildir: ana gündem ve özetin ürün kartları artık yalnız son 30 günde temel etkileşimi denenmiş, ilgili gerçek önizlemesi ve gerekçesi kaydedilmiş projeleri gösterir.
2. **Öğrenme koleksiyonu**: Geliştirici açıklaması, ayırt edici özellik, yakın zamanda denenmiş etkileşim ve uygulanabilir öğrenme adımları olan seçki. Ziyaretçi doğrudan ürünü deneyebilir, sonra neyi nasıl uyarlayabileceğini görür. AI ile geliştirme iddiası ayrıca kanıtlanır; AI kullanan ürün otomatik olarak AI ile geliştirilmiş sayılmaz.
3. **Araştırma**: Çalışan genel erişimli demosu bulunmayan makale, model ve yöntemler ayrı bir araştırma akışına aittir. Bunlar site vitrini veya çalışır demo diye gösterilmez. Bu akışın ayrı sayfası henüz geliştirilmedi.

## Karar zinciri

| Aşama | Gerekli kanıt | Çıktı / başarısızlık |
| --- | --- | --- |
| Keşif | Kaynak URL, kayıt zamanı, proje URL'si, ham içerik | Mükerrer kayıt birleştirilir; belirsiz eşleşme insan incelemesine gider. |
| Bağlam | Üreticinin açıklaması veya resmi ürün sayfası | Ne yaptığı tek cümlede anlatılamıyorsa gündem kartına alınmaz. Amaç açık değilse üreticinin niyeti uydurulmaz. |
| İlgi | Platformun kendi trend işareti, zamanlı oy/yorum veya en az 24 saat aralıklı yıldız değişimi | Sayılar kendi platformunda sunulur; platformlar arası toplam puan oluşturulmaz. Makalede bağlantı geçmesi övgü sayılmaz. |
| Demo | Açılabilir ürün adresi, gerçek arayüz ve kaydedilmiş etkileşim gözlemi | Sadece HTTP 200 veya ekran görüntüsü “çalışan demo” kanıtı değildir. Oturum, ödeme veya donanım gereksinimi belirtilir. |
| Öğrenme | Farkı gösteren somut davranış, kaynaklı teknik bilgi, Radar'ın önerdiği uyarlama adımları, kabul kontrolleri | Orijinal yöntem ile Radar'ın alternatif yöntemi ayrı yazılır. Bilinmeyen teknoloji “kullanılmış” diye sunulmaz. |
| Yayın | Önceki kontrollerin tarihi ve kaynağı, editoryal karar, geri çekme nedeni | **Hedef:** bozulan demo veya eski kanıt yeniden incelemeye taşınır. Bugün yalnız kayıtlı incelemenin 30 günlük yaş sınırı otomatik kontrol edilir. |

## Mevcut uygulama ve sınırlar

`lib/evaluation.ts` gündemi **canlı depodaki kanıttan** hesaplar. Şu an ilgi kaynakları Hacker News puan/yorum, Hugging Face Spaces trend işareti, Lobsters puan/yorum, GitHub'ın günlük Trending repo listesi ve en az 24 saat arayla ölçülen GitHub yıldız artışıdır. Eşikler şimdilik Hacker News ve Lobsters için 50 puan veya 20 yorum; bağımsız GitHub yıldız karşılaştırmasında +25 yıldızdır. GitHub Trending'deki “stars today” platformun kendi gösterimidir; Radar'ın yıldız farkı ölçümü değildir. Geliştirici Trending sayfasındaki “popular repo” yalnız bahsedilme olur, repo trendi sayılmaz. Hugging Face ve GitHub Trending işaretleri yalnız ilgili platform listesini ifade eder. Bunlar kalite veya AI ile geliştirilme kanıtı değildir. Toplam yıldız ve makale tepkileri hız/ürün memnuniyeti olarak yorumlanmaz.

Gündem için ayrı site bağlantısı ve anlamlı açıklama gerekir. İlgi veya atıf sinyali son 7 günde gerçekleşmiş ve son 48 saatte kontrol edilmiş olmalıdır. Yeni keşif ise Radar'ın son 7 günde ilk gördüğü doğrudan AI geliştirme beyanıdır; proje çıkış tarihi veya ilgi kanıtı değildir. Makale referansında gerçek yayın tarihi zorunludur; bugün taranan eski bir yazı “bugün bahsedildi” sayılmaz. Mükerrer taramalar son kayda indirgenir. Açıklama kaynağın ortasında kesilmişse yalnızca tamamlanmış cümle gösterilir. Desteklenmeyen veya süresi dolmuş kanıt güncel gündeme taşınmaz.

**Yayın kapısı (6 Ekim):** `evaluateFeed` kaynaklı aday sinyallerini üretir; [`lib/publication.ts`](../lib/publication.ts) ziyaretçiye gösterilecek ürünleri ayrıca seçer. Şimdilik `selectionFor` beş ders koşulunu geçen kayıt, aynı ürün URL'sine bağlı güncel etkileşim incelemesi ve `interactive` gerçek tarayıcı görüntüsü zorunludur. Aynı kural ana gündeme ve `/briefing` ürün bölümlerine uygulanır. `/builds` ve `/candidates` ham inceleme arşividir; denenmemiş siteyi “Dene” diye açtırmaz. Bu geçici dar kapı, ileride tam ders hazırlamadan da doğrulanmış canlı demoyu yayınlayacak ayrı akış kurulana kadar kullanılacak. HTTP 200, ekran görüntüsü veya AI geliştirme beyanı tek başına yeterli değildir. Günlük otomatik erişilebilirlik/etkileşim tekrar testi henüz yok; R03 açık kalır.

**Düzeltme örneği:** `younes-dev` GitHub açıklamasındaki “Built with Lovable” beyanıyla kaynak havuzuna girmişti. Kayıt anında 0 GitHub yıldızı vardı; başka ölçülmüş ilgi veya belirgin öğretici özellik kanıtı yoktu. Kayıtlı `preview--younes-dev.lovable.app` adresi 6 Ekim kontrolünde HTTP 401 döndü. Repo açılması, ziyaretçinin portföy demosunu kullanabildiği anlamına gelmez. Ham kaynak izi korunur; ana gündem/özet vitrini ve “Dene” eylemi verilmez. Bu örnek 401'in kalıcı olacağı iddiası değildir; üretici siteyi açar ve etkileşim incelemesi tamamlanırsa yeniden değerlendirilebilir.

**Yanlış pozitif koruması:** Lobsters tartışması güncel yüzeylere yalnız ilgili Evidence Object'in ham kaydı mevcutsa, kaynak/kayıt kimliği ve içerik özeti (hash) eşleşiyorsa ve ham kayıtta `ai` veya `ml` etiketi varsa çıkar. Ham kayıt eksik/uyuşmazsa yayın kapısı kapalıdır. Aynı kural gündem, proje detayındaki kaynak listesi ve güncel kanıt görünümünde kullanılır; eski gözlemler denetim geçmişinde kalır. Gerçek eski Haskell örneği, eksik/yanlış bağlanmış ham kayıt ve sonradan alakasızlaşan kayıt için regresyon testleri vardır. Bu, bütün kaynaklarda konu doğruluğunu otomatik garanti etmez; R01 insan etiketli örneklem denetimi hâlâ gerekir.

`lib/selection.ts` koleksiyona giriş için kaynaklı açıklama, son 30 günde gerçek etkileşim incelemesi, kaydedilmiş gerçek demo önizlemesi, ayırt edici gerekçe ve öğrenme adımları ister. Bu kontrol bugün **içeriğin mevcut olup olmadığını** doğrular; anlatının kalitesini veya yeni projelerdeki “vay be” değerini makineyle ölçmez. İncelemeler `content/lesson-reviews.json` içinde elle kaydedilmiştir. Önizleme üretimi, tarayıcıda otonom etkileşim incelemesi, alıntıların olumlu/olumsuz bağlam analizi ve yayın kararının kendi kendine alınması henüz otomatik değildir. Bağlı ücretli AI sağlayıcısı yoktur. 5 Ekim'de koddan hesaplanan 23 ders kaydından beşi seçki kapısını geçiyor; bu beşinin `ai` alanı `Unknown`. AI özelliği sunmaları farklı bir olgudur. Seçki sayısı 30 günlük inceleme süresi dolunca kendiliğinden değişebilir.

## Bir sonraki geliştirme için kabul ölçütleri

- Her gündem kartı “ne yapıyor”, “hangi kaynakta ne oldu”, olay tarihi ve doğrudan deneme adresini gösterir. Kaynağı açınca karttaki ölçüme ulaşılır.
- Seçilen her proje için masaüstü ve mobilde açılma, tek temel etkileşimin sonucu, ekran görüntüsü/uygun olduğunda kısa hareketli kanıt, test zamanı ve sınırlar saklanır. Bozuk demo kartı seçkiden düşer.
- Her öğrenme incelemesinde birincil üretici açıklaması, fark yaratan an, neden yararlı/ilginç olduğu, doğrulanmış orijinal araçlar ve ayrı etiketli Radar uygulama önerisi bulunur.
- Ziyaretçinin kendi projesine uyarlama eylemi yalnızca uyarlama adımları gerçek bir örnek projede denenip kabul kontrolleri geçince açılır. Başarı yüzdesi ölçülmedikçe “%90 başarı” iddiası gösterilmez.
- Haftalık kalite denetimi: yanlış AI iddiası, açılmayan demo, kaynakla desteklenmeyen ilgi iddiası, eksik amacı olan kart ve yanlış mükerrer birleştirme sayıları ayrı raporlanır. Başarı yalnızca kart/tıklama sayısıyla ölçülmez; “denedi → öğrendi → uyarlamaya geçti” akışı izlenir.

Kaynak davranışları: [Hacker News API](https://github.com/HackerNews/API), [Hacker News arama API'si](https://hn.algolia.com/api), [Hugging Face Hub API](https://huggingface.co/docs/hub/en/api), [GitHub yıldız API'si](https://docs.github.com/en/rest/activity/starring). GitHub depo trafiği yalnızca yetkili depo sahipleri için kullanılabilir; başkalarının ürünlerine ziyaret sayısı çıkarılmaz. Product Hunt API'si erişim anahtarı ve ticari kullanım izni şartlarına tabidir: [resmî belge](https://api.producthunt.com/v2/docs).
