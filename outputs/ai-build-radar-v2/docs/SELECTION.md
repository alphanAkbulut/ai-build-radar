# Seçki, ilgi ve öğrenme

**Durum:** 5 Ekim 2026 kodu; anlık sayılar inceleme tarihine göre değişebilir. [English](SELECTION.en.md). Ana kuralın teknik kaynağı `lib/selection.ts`, gündemin kaynağı `lib/evaluation.ts`, etkin kaynakların kaynağı `lib/sources.ts` dosyalarıdır.

## Gündeme girme

Gündem bir ürünün neden **şimdi** görünür olduğunu söyler. `evaluateFeed` ayrı site adresi, anlamlı açıklama, çözülmemiş kimlik çatışması olmaması, son yedi gündeki olay ve son 48 saatteki kanıt kontrolüyle aday sinyali çıkarır. Akış üç ayrı nedeni karıştırmaz: **ölçülen ilgi**, **AI ile geliştirme beyanıyla yeni keşif**, **kaynaklı bahsedilme**. Yeni keşif Radar'ın görme tarihidir; lansman veya popülerlik değildir. Kaynak adı, olay tarihi ve kanıt bağlantısı kartta görünür. Ancak bu sinyal **yayın izni değildir**: `lib/publication.ts` şimdilik beş ders koşulunu, aynı URL'ye ait güncel etkileşim incelemesini ve gerçek etkileşimli önizlemeyi arar. Yalnız kaynak beyanı olan veya demosu açılmayan kayıt inceleme arşivinde kalır. Bu geçici kapı güvenilir otomatik demo kontrolü yapılana kadar gündemi küçük tutabilir; R03/R04 bunu geliştirecek.

Hacker News ve Lobsters için bir projeyle ilişkilendirilmiş paylaşımda **en az 50 puan veya 20 yorum** platform içi ilgi eşiğidir. Yorum sayısı övgü demek değildir. Hugging Face'te yalnız gerçek ilk 20 trend yanıtı platform içi trend kanıtı üretir; en çok beğenilen 30 kaydın `trendingScore` alanı tek başına yetmez. Platform sırası saklanır; sıra değişimi için en az 24 saat aralıklı iki gözlem gerekir. GitHub'da toplam yıldız hız değildir: en az 24 saat aralıklı karşılaştırılabilir ölçümde **+25 yıldız** ve yakın tarihli son gözlem aranır. Kişi yazısında bir URL geçmesi övgü değil **bahsedilme** olur. Platformların sayıları tek bir global puanda toplanmaz.

`attention` zenginleştirmesi 15 dakikada bir en çok altı projeyi kontrol eder. Hacker News Algolia'da en çok iki kanonik URL sorgusu ve sorgu başına 50 hikâye kullanır; isim benzerliği eşleşme değildir. Proje bazında normal tekrar yaklaşık bir gün, hatada altı saattir. Bu yol X, LinkedIn veya YouTube'daki ilgiyi ölçmez. Güçlü Hacker News sonucu bulunmaması başka yerde ilgi yokluğu anlamına gelmez.

GitHub'ın günlük Trending repo listesinde görünmek ayrıca platform içi ilgi sayılır; “stars today” GitHub'ın gösterimidir, Radar'ın yıldız farkı ölçümü değildir. Trending geliştiricisinin yanında gösterilen “popular repo” yalnız kaynaklı bahsedilmedir. Her iki sinyal de AI ile geliştirme beyanı değildir. [Ayrıntılı kaynak sınırları](GITHUB-TRENDING.md).

## Öğrenme seçkisine girme

Öğrenme kartı, gündem kartının otomatik genişletilmiş hali değildir. `selectionFor` ancak şu beş koşul birlikte sağlanırsa `featured` verir:

1. Ne yaptığı kaynak URL'siyle açıklanmış.
2. Temel demo etkileşimi son 30 gün içinde denenmiş ve bulgu yazılmış.
3. Gerçek demo önizlemesi kaydedilmiş.
4. Projeye özgü bir öğrenme gerekçesi hazırlanmış.
5. Uyarlama amacı, en az üç adım ve iki kabul kontrolü mevcut.

5 Ekim'de koddan hesaplanan anlık durum **23 ders kaydı: 5 seçilmiş, 18 inceleme arşivinde**. Bu sayı zamanla, özellikle 30 günlük demo kontrolü eskidiğinde değişir; ekrandaki sayı esas alınır. Arşiv kaydı silinmiş veya kalitesiz sayılmaz, fakat seçilmiş ders diye sunulmaz. Demosu denenmemiş otomatik adayların derse dönüşmemesi bilinçli kapıdır.

Kontrol bugün içeriğin varlığı ve tarihe bakar; metnin doğruluğunu, gerçek kullanıcı övgüsünü veya “vay be” etkisini otomatik değerlendirmez. İnceleme kayıtları `content/lesson-reviews.json` içinde editoryaldir; otomatik tarayıcı gezintisi, yorum duygu analizi ve her aday için ders üretimi yoktur. `Projeme uyarla` düğmesinin ayrıca yeniden üretim testi kapısı vardır (`lib/adaptation.ts`). Radar'ın önerdiği araçlar geliştiricinin kullandığı araçlar diye sunulmaz.

Elle araştırılmış fakat henüz yayınlanmamış adaylar `content/research-discoveries.json` içinde, tarihli dışlama kararları `content/research-exclusions.json` içinde tutulur. Bir adayı seçkiye taşımadan önce dışlama kayıtlarını kontrol et. Bu dosyalar şu anda yayın kodunun otomatik kapısı değildir; yanlış olgusal iddiaların yeniden yayınlanmasını önleyen editoryal inceleme hafızasıdır.

## Kaynak kapsamı ve metrikler

`lib/sources.ts` içinde yerel modda **46 kayıtlı satır, 24 etkin bağımsız ürün keşif kaynağı, 10 haber akışı ve üç etkin zenginleştirme işi** vardır. Sekiz yazar yayını, on bağımsız yayın akışı ve GitHub, Hacker News, One’s Vibe, Hugging Face Spaces, DEV Community, Lobsters bu keşif kaynaklarını oluşturur. Yayın akışları yalnız tarihli açık proje bağlantısı verir; seçki kalitesini veya AI ile geliştirilme iddiasını kanıtlamaz. Kayıtlı/etkin kaynak başarılı taranmış kaynak sayılmaz; `/sources` son denemeyi ve son başarıyı ayrı gösterir. Kod en az 10 etkin bağımsız kaynağı şart koşar; public hedef 25 **çalışan** bağımsız kaynaktır. X, Reddit, Product Hunt ve YouTube satırları henüz etkin değildir. Elle incelenmiş Product Hunt/web adayları sürekli Product Hunt taraması sayılmaz.

Feed başına son 20 girdideki açık GitHub ve Hugging Face Space bağlantıları aday olur; yazıdaki tarih ürün lansmanı sayılmaz. Hugging Face beğeni sırası büyüme iddiası değildir. DEV reaksiyonu yazıya aittir. Lobsters'ın yalnız `ai` veya `ml` etiketli tartışmaları AI akışına girer. Geçmişte yanlış alınmış konu dışı kanıtlar tarihten silinmez, güncel akışa yansıtılmaz. Kaynağın `fetched` sayısı incelenen kayıt adedidir; benzersiz proje veya kalite puanı değildir.

İşletim kuralı, ekran sıraları ve yayın sınırları için [mimari hafıza](ARCHITECTURE.md) ve [değerlendirme sözleşmesi](EVALUATION.md) kullanılır.
