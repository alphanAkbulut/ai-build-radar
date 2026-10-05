# Günlük AI ürün promptu: kaynak denetimi ve entegrasyon sırası

**Durum:** 5 Ekim 2026 tarihli ilk kaynak denetimi; aşağıdaki “henüz bağlı değil” satırları o anın fotoğrafıdır. Sonradan eklenen haber akışları ve tüm önerilerin güncel ayrımı [küresel kaynak kataloğunda](GLOBAL-SOURCE-CATALOG.md), gerçek koşular `/sources` sayfasındadır. [English](SOURCE-EXPANSION.en.md).

## Prompttan alınan ürün kararı

Radar'ın ana konusu çalışan AI ürünlerini keşfetmek ve mümkünse nasıl geliştirildiklerini öğrenmektir. **AI kullanan ürün**, **AI ile geliştirilmiş ürün**, **yeni lansman** ve **ilgi gören ürün** dört farklı iddiadır. Kaynak bir iddiayı destekliyorsa yalnız o alana kanıt eklenir. Teorik makaleler ve lab duyuruları ayrı haber/araştırma akışına girer; çalışan demo kartına otomatik dönüşmez. İlk kaynaklı haber başlığı akışı artık `/briefing` içindedir; derin Research Gate henüz yoktur.

`/briefing` artık son 48 saat veya 7 günde mevcut kaynakların ürettiği ilgi, geliştirici beyanıyla yeni keşif ve gerçek tarama kapsamını ayrı gösterir. Ana kart için aynı üründe en az iki bağımsız ilgi platformu arar; tek platform ölçümlerini ayrı, küçük bir listede tutar. Top 5–8'i doldurmak için veri uydurmaz; kategori hareketinde “Diğer” etiketini kullanmaz ve en az üç çok kaynaklı ürün arar. Yenilik, fayda, ürün kalitesi ve “wrapper” değerlendirmesi otomatik hesaplanmıyor; bunlar demo incelemesi olmadan puanlanmamalı.

## Bağlanan on bağımsız yayın akışı

`content/publications.json` içindeki **Interconnects, Import AI, SemiAnalysis, Ben's Bites, The Gradient, Sebastian Ruder, AI Tidbits, MarkTechPost, Lenny's Newsletter ve The Pragmatic Engineer** doğrudan kendi RSS akışlarından okunur. Son 20 yazı içindeki açık GitHub repo / Hugging Face Space bağlantıları ayrıştırılır. Genel ürün/yazılım yayınları olan son ikisinde AI konulu başlık filtresi vardır. Yazı **45 günden eskiyse** bağlantı yeni keşif diye işlenmez; yayın tarihi ürünün çıkış tarihi değildir. Bağlantı, yazarın onayı veya AI ile geliştirme kanıtı değildir. Aynı URL diğer kaynaklarla kimlik üzerinden eşleşir; kaynak ayrı korunur.

**İlk gerçek koşu, 5 Ekim 2026:** on akışın onu da `completed`; toplam 160 yazı/kayıt okundu ve 39 proje bağlantısı kabul edildi. 34 bağlantı o sırada yeni Build kaydı açtı; bu **34 yeni çalışan demo** veya **34 AI ile geliştirilmiş ürün** iddiası değildir. SemiAnalysis, The Gradient, Sebastian Ruder ve AI Tidbits akışlarında son 20 yazıda sınırı geçen güncel proje bağlantısı bulunmadı; başarılı tarama ile yararlı yeni aday üretimi farklıdır. Sonraki koşular ve hatalar için `/sources` esas alınır. Akışların içerik ve yeniden kullanım koşulları public yayın öncesi ayrıca incelenmelidir.

Bu akışlar ilk kullanıcı promptundaki blog/bülten boşluğunu kapatır. Sonraki çalışmada ayrıca tarihli haber başlıkları için on RSS akışı bağlandı; bunlar ürün keşfi sayısını artırmaz. Product Hunt, X, Reddit ve YouTube hâlâ ayrı entegrasyon işleridir. GitHub Trending'in iki sayfası yine tek platform sinyalidir.

## Doğrulanmış fakat henüz bağlı olmayan kaynak adayları

| Kaynak | Doğrulanan durum | Radar'da doğru kullanım | Entegrasyon |
| --- | --- | --- | --- |
| [Product Hunt API](https://www.producthunt.com/v2/docs) | GraphQL token istiyor; varsayılan API izni ticari kullanım için değil. | Lansman ve platform içi oy/yorum; AI geliştirme kanıtı değil. | Ticari izin ve token olmadan kapalı. |
| [Superpower Daily Tool Drop](https://superpowerdaily.com/tools/daily) | Günlük editoryal beşli ve taranan lansman sayısı yayımlıyor. | Editoryal keşif ipucu; özgün ürün/lansman kaynağına geri izleme gerekir. | Yapılandırılmış erişim ve kullanım koşulu incelenmeli. |
| [AIToolDrop](https://aitooldrop.net/) | Product Hunt, Hacker News, GitHub ve Reddit'ten derlediğini belirtiyor. | İkinci el aday; tekrarlar ve özgün sinyal kaynağı ayrılmalı. | Doğrudan viralite kanıtı olarak bağlanmaz. |
| [Launch AI Jam](https://launchaijam.com/) | Ücretsiz listeleme ile ücretli kurucu denetimi sunuyor. | Lansman adayı; ödeme/yerleşim kalite veya popülerlik kanıtı değildir. | Önce örneklem ve tekrar oranı incelenmeli. |
| [AI Launch Watch](https://ailaunchwatch.com/submit-ai) | Ücretli, garanti yerleşim paketleri var. | Düşük öncelikli aday kaynağı; “verified” rozeti Radar doğrulaması değildir. | Şimdilik etkinleştirilmez. |
| [New Site Radar](https://newsiteradar.com/methodology) | Yeni site ve görünürlük sinyalleri izliyor. | Domain/ürün keşfi; kayıt tarihi lansman veya AI geliştirme tarihi değildir. | Kaynak bağlantısı ve canlı demo kontrolünden sonra aday olabilir. |
| [Futurepedia](https://www.futurepedia.io/) | Geniş kürasyonlu AI araç dizini. | Kategori ve ürün keşfi; eklenme tarihi dünya çapında yeni lansman değildir. | Güncelleme izi ve kullanım koşulu doğrulanmalı. |
| [OpenAI News](https://openai.com/news/), [Anthropic News](https://www.anthropic.com/news), [Google AI Blog](https://blog.google/innovation-and-ai/technology/ai/) | Birinci el ürün/model duyuruları yayımlıyorlar. | Ayrı “ürün/model/feature release” haber akışı; demo ve AI ile geliştirme iddiaları ayrı. | Sonraki bağımsız News Event sözleşmesiyle eklenmeli. |
| [arXiv API](https://info.arxiv.org/help/api/index.html) | Makale metaverisi için açık arayüz. | Araştırma gündemi; bağlantılı çalışan ürünü ayrıca doğrula. | Gelecek Research Gate; ana build akışına doğrudan eklenmez. |

Prompttaki `ai-tldr.dev`, `dailyaitools.ai` ve diğer dizin adları otomatik etkin kaynak yapılmadı: isim/erişim, kullanım koşulu, tarih alanı ve özgün kayıt bağlantısı tek tek doğrulanmalı. Aynı siteyi farklı sorgularla taramak bağımsız kaynak sayısını artırmaz.

## Öncelik ve kabul ölçütü

1. Birinci el lab/üretici duyuruları için ayrı **News Event** şeması; gerçek yayın zamanı, resmi URL, ürün/model/özellik türü ve varsa çalışan demo bağlantısı. Başlıklar bir Build Entity ile ancak doğrulanmış URL bağı varsa birleşir.
2. Product Hunt için açık ticari kullanım izni ve token; X/Reddit/YouTube için sağlayıcı erişimi. Başarısız kaynak saklanır, başarılıymış gibi sayılmaz.
3. İkinci el dizinler yalnız aday üretir. Aynı ürün farklı kaynaklardan gelirse URL ile tekilleştirilir; oy/sıra değerleri özgün platforma atfedilir.
4. İnsan etiketli örneklemde yanlış lansman tarihi, sahte AI geliştirme ataması, bozuk site ve tekrar oranı ölçülür. Kaynak başına alınan/kabul edilen/elenen kayıt ve son başarılı tarama gösterilir.

**Açık karar:** geniş AI haber akışı ile AI ile geliştirilmiş build akışının ürün içindeki görsel ilişkisi. Bugünkü `/briefing` yalnız mevcut build kanıtını özetler; resmi lab haberlerini veya promptta sayılan kapalı platformları taradığını iddia etmez.
