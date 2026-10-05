# Build Radar değerlendirme sözleşmesi

Bu belge **önerilen ürün standardını** ve **bugün uygulanan kısmı** ayırır. Amaç, bir ürün yöneticisinin “AI ile neler yapılıyor, neden dikkat çekiyor, ben nasıl öğrenirim?” sorusuna doğrulanabilir bir yanıt vermektir. Yeni bir model, yaratıcı arayüz veya çözülen gerçek bir sorun aynı derecede seçilme nedeni olabilir. Popülerlik tek ölçüt değildir.

## İki ayrı yayın yüzeyi

1. **AI Build Gündemi**: Son 7 günde kaynaklarda görünen projeler. “Ölçülmüş ilgi” ile “yeni bahsedilenler” ayrıdır. Kaynak bağlantısı, ölçüm ve olay tarihi görünür. Bu yüzey keşif içindir; taranan her sitenin demosu denenmiş sayılmaz.
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
| Yayın | Önceki kontrollerin tarihi ve kaynağı, editoryal karar, geri çekme nedeni | Bozulan demo veya eski kanıt seçkiyi otomatik yeniden inceleme durumuna taşır. |

## Mevcut uygulama ve sınırlar

`lib/evaluation.ts` gündemi **canlı depodaki kanıttan** hesaplar. Şu an doğrulanabilir ilgi kaynakları Hacker News puan/yorum, Hugging Face Spaces trend işareti, Lobsters puan/yorum ve en az 24 saat arayla ölçülen GitHub yıldız artışıdır. Eşikler şimdilik Hacker News için 50 puan veya 20 yorum; Lobsters için 50 puan veya 20 yorum; GitHub için +25 yıldızdır. Hugging Face işareti yalnızca o platformdaki trend listesini ifade eder. Eşikler kalite puanı değildir ve kaynak kapsamı genişledikçe kaynak bazında gözden geçirilmelidir. Toplam yıldız ve makale tepkileri hız/ürün memnuniyeti olarak yorumlanmaz.

Gündem için site bağlantısı, anlamlı açıklama, son 7 günlük olay ve en çok 48 saat önce kontrol edilmiş kaynak gerekir. Makale referansında gerçek yayın tarihi zorunludur; bugün taranan eski bir yazı “bugün bahsedildi” sayılmaz. Mükerrer taramalar son kayda indirgenir. Açıklama kaynağın ortasında kesilmişse yalnızca tamamlanmış cümle gösterilir. Desteklenmeyen veya süresi dolmuş kanıt güncel gündeme taşınmaz.

`lib/selection.ts` koleksiyona giriş için kaynaklı açıklama, son 30 günde gerçek etkileşim incelemesi, kaydedilmiş gerçek demo önizlemesi, ayırt edici gerekçe ve öğrenme adımları ister. Bu kontrol bugün **içeriğin mevcut olup olmadığını** doğrular; anlatının kalitesini veya yeni projelerdeki “vay be” değerini makineyle ölçmez. İncelemeler `content/lesson-reviews.json` içinde elle kaydedilmiştir. Önizleme üretimi, tarayıcıda otonom etkileşim incelemesi, alıntıların olumlu/olumsuz bağlam analizi ve yayın kararının kendi kendine alınması henüz otomatik değildir. Bağlı ücretli AI sağlayıcısı yoktur. Şu an beş seçilmiş örneğin hiçbirinde AI ile geliştirme kanıtı doğrulanmış değildir; AI özelliği sunmaları farklı bir olgudur.

## Bir sonraki geliştirme için kabul ölçütleri

- Her gündem kartı “ne yapıyor”, “hangi kaynakta ne oldu”, olay tarihi ve doğrudan deneme adresini gösterir. Kaynağı açınca karttaki ölçüme ulaşılır.
- Seçilen her proje için masaüstü ve mobilde açılma, tek temel etkileşimin sonucu, ekran görüntüsü/uygun olduğunda kısa hareketli kanıt, test zamanı ve sınırlar saklanır. Bozuk demo kartı seçkiden düşer.
- Her öğrenme incelemesinde birincil üretici açıklaması, fark yaratan an, neden yararlı/ilginç olduğu, doğrulanmış orijinal araçlar ve ayrı etiketli Radar uygulama önerisi bulunur.
- Ziyaretçinin kendi projesine uyarlama eylemi yalnızca uyarlama adımları gerçek bir örnek projede denenip kabul kontrolleri geçince açılır. Başarı yüzdesi ölçülmedikçe “%90 başarı” iddiası gösterilmez.
- Haftalık kalite denetimi: yanlış AI iddiası, açılmayan demo, kaynakla desteklenmeyen ilgi iddiası, eksik amacı olan kart ve yanlış mükerrer birleştirme sayıları ayrı raporlanır. Başarı yalnızca kart/tıklama sayısıyla ölçülmez; “denedi → öğrendi → uyarlamaya geçti” akışı izlenir.

Kaynak davranışları: [Hacker News API](https://github.com/HackerNews/API), [Hacker News arama API'si](https://hn.algolia.com/api), [Hugging Face Hub API](https://huggingface.co/docs/hub/en/api), [GitHub yıldız API'si](https://docs.github.com/en/rest/activity/starring). GitHub depo trafiği yalnızca yetkili depo sahipleri için kullanılabilir; başkalarının ürünlerine ziyaret sayısı çıkarılmaz. Product Hunt API'si erişim anahtarı ve ticari kullanım izni şartlarına tabidir: [resmî belge](https://api.producthunt.com/v2/docs).
