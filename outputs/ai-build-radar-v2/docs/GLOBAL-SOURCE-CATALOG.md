# Küresel AI kaynak kataloğu

**Durum: 5 Ekim 2026.** Kullanıcının önerdiği kaynakların ürün stratejisine göre ayrımıdır; canlı tarama sonucu değildir. [English](GLOBAL-SOURCE-CATALOG.en.md). Son deneme, hata ve alınan kayıt sayısı `/sources` ekranındadır. Bir kaynağın listede olması tarandığı veya makalesindeki ürünün AI ile geliştirildiği anlamına gelmez.

**Terimler:** **Ürün keşfi** = açık repo/demo bağlantısından aday Build; **haber** = yayıncı başlığı, tarihi ve orijinal URL; **araştırma adayı** = ileride ayrı Research Gate; **bekliyor** = etkin collector yok. Aynı platformun farklı sayfaları bağımsız kaynak diye çoğaltılmaz. Haber akışları 25 çalışan bağımsız *ürün keşfi* hedefini karşılamaz. Çalışan haber akışı da “trend” veya “önerilen ürün” iddiası üretmez.

| Kullanıcının kaynağı | Uygun rol | Şimdiki durum / neden |
| --- | --- | --- |
| [TechCrunch AI](https://techcrunch.com/category/artificial-intelligence/) | Haber, ürün ipucu | **Haber etkin**; AI kategori RSS, tarihli başlık. Ürün bağlantısı ayrıca doğrulanır. |
| [The Verge AI](https://www.theverge.com/ai-artificial-intelligence) | Haber | **Haber etkin**; AI RSS. |
| [Ars Technica](https://arstechnica.com/rss-feeds/) | Teknik haber | **Haber etkin**; geniş Technology Lab akışında AI başlık filtresi. |
| [VentureBeat AI](https://venturebeat.com/category/ai/) | Enterprise haber | **Bekliyor**; denenen RSS isteği HTTP 429. İzin/erişim yolu doğrulanmalı. |
| [MIT Technology Review](https://www.technologyreview.com/topic/artificial-intelligence/) | Haber, araştırma | **Haber etkin**; AI akışı. |
| [KnowEntry](https://knowentry.com/) | İkinci el aggregator | **Bekliyor**; özgün yayın URL'si, tekrar oranı ve kullanım izni incelenecek. Kullanıcının güncelleme sıklığı iddiası doğrulanmış Radar metriği değildir. |
| [AI News Hub](https://www.ainewshub.io/home) | İkinci el aggregator | **Bekliyor**; ad/alan adı karışıklığı ve özgün kaynak eşleşmesi incelenecek. “200+ kaynak” iddiası kabul edilmedi. |
| [MarkTechPost](https://www.marktechpost.com/) | Ürün bağlantısı | **Ürün keşfi etkin**; son yazılardaki açık GitHub/Hugging Face bağlantıları, onay değil. |
| [Synced Review](https://syncedreview.com/) | Asya yayınları | **Bekliyor**; RSS yanıt verdi, fakat kontrol edilen son içerik 2025 tarihliydi; güncellik eşiği geçmedi. |
| [The Decoder](https://the-decoder.com/) | Avrupa/AI haberi | **Haber etkin**. |
| [The Rundown AI](https://www.therundown.ai/) | Haber bülteni | **Haber etkin**; yayın başlıkları. Bülten abone sayısı doğrulanmış değil. |
| [TLDR AI](https://tldr.tech/ai) | Haber bülteni | **Bekliyor**; denenen RSS adresi 404; resmi yeniden kullanım/akış adresi bulunmalı. |
| [Ben's Bites](https://www.bensbites.com/) | Ürün bağlantısı | **Ürün keşfi etkin**; açık repo/demo linki aranır. |
| [The Batch](https://www.deeplearning.ai/the-batch/) | Araştırma açıklaması | **Bekliyor**; denenen RSS yolu çalışmadı; resmi ve istikrarlı akış bulunmalı. |
| [Import AI](https://jack-clark.net/) | Ürün bağlantısı, araştırma | **Ürün keşfi etkin**; açık bağlantıdan aday, övgü değil. |
| [Latent Space](https://www.latent.space/) | Kişi/yayın bağlantısı | **Ürün keşfi etkin**; mevcut feed açık proje bağlantısı üretir, haber özeti değil. |
| [Last Week in AI](https://lastweekin.ai/) | Haftalık haber | **Haber etkin**; tarihli RSS başlıkları. |
| [Superhuman AI](https://www.superhuman.ai/) / [The Neuron](https://www.theneurondaily.com/) | Haber bülteni | **Bekliyor**; ilkinde yayın izni/akış, ikincisinde geçerli XML doğrulanmalı. |
| [arXiv cs.AI/cs.LG/cs.CL](https://info.arxiv.org/help/api/index.html) | Araştırma | **Bekliyor**; ayrı Research Gate ve makale→kod/demo doğrulaması gerekli. Üç kategori tek platformdur. |
| [Hugging Face Daily Papers](https://huggingface.co/papers) | Araştırma | **Bekliyor**; denenen RSS 401. Papers sayfası, Spaces veya Blog ile aynı platform ailesi. |
| [Hugging Face Blog](https://huggingface.co/blog) | Model/ürün haberi | **Haber etkin**; RSS başlığı ayrı, [Spaces](https://huggingface.co/spaces) **ürün keşfi etkin**. Tek platform olarak değerlendirilir. |
| [Papers with Code](https://paperswithcode.com/) | Makale↔kod adayı | **Bekliyor**; mevcut resmi adres/API ve veri kalitesi yeniden doğrulanmalı; ad benzeri siteler eşdeğer varsayılmaz. |
| [Google DeepMind Blog](https://deepmind.google/blog/) | Birinci el lab duyurusu | **Bekliyor**; denenen RSS yanıtı tutarsız/parse edilemedi. [Google Research](https://research.google/blog/) RSS'i **haber etkin** ama aynı kuruluşun başka akışıdır. |
| [OpenAI News/Research](https://openai.com/news/) | Birinci el lab duyurusu | **Bekliyor**; resmi geçerli feed/API ve kullanım koşulu doğrulanmalı. |
| [Anthropic Research](https://www.anthropic.com/research) | Birinci el lab duyurusu | **Bekliyor**; denenen haber RSS yolu 404. |
| [Reddit r/MachineLearning](https://www.reddit.com/r/MachineLearning/) / [r/LocalLLaMA](https://www.reddit.com/r/LocalLLaMA/) | Topluluk ilgi sinyali | **Bekliyor**; API erişimi/şartları, tarihli yorum ve proje eşleştirme gerekli. İki subreddit tek platform. |
| [Hacker News](https://news.ycombinator.com/) | Paylaşım ve tartışma | **Ürün keşfi etkin**, ayrıca ilgi zenginleştirmesi. Paylaşım övgü veya AI geliştirme kanıtı değildir. |
| [Hugging Face Forums](https://discuss.huggingface.co/) / Discord | Tartışma | **Bekliyor**; resmi erişim ve mahremiyet/izin ayrı değerlendirilecek; HF ile aynı platform ailesi. |
| [Kaggle Community](https://www.kaggle.com/discussions) | Araştırma/pratik | **Bekliyor**; ürün örneği ile veri yarışması ayrımı ve API/izin gerekli. |
| [OpenAI Developer Forum](https://community.openai.com/) | Geliştirici tartışması | **Bekliyor**; resmi erişim ve içerik kullanım şartı gerekli. |
| [X](https://x.com/) listeleri: @sama, @karpathy, @ylecun, @demishassabis, @DrJimFan | Kişi paylaşımı/ilgi | **X collector kapalı**; erişim ve platform şartı gerekir. Karpathy'nin ayrı açık blog feed'i etkindir; bu X takibi demek değildir. |
| [daily.dev #ai](https://app.daily.dev/tags/ai) | İkinci el geliştirici gündemi | **Bekliyor**; RSS denemesi makale öğesi vermedi, özgün bağlantı/API ve tekrar oranı incelenecek. |
| [GitHub](https://github.com/trending) + [Trending developers](https://github.com/trending/developers) | Kod/depo keşfi, platform içi ilgi | **Etkin** GitHub collector ve yerel Trending; iki Trending görünümü tek GitHub platformudur. Yıldız sayısı AI geliştirme kanıtı değildir. |

## Çalışan haber akışının sözleşmesi

`content/news-feeds.json` yalnız doğrulanmış RSS adreslerini içerir. Her akış 3 saatte bir en çok 20 öğe okur; tarihi eksik, gelecekte veya 7 günden eski öğeleri yayınlamaz. Geniş kaynaklarda AI başlık filtresi kullanır. URL ile tekrarları birleştirir, ilk görülme ve yayın zamanını ayrı tutar. `/briefing` haber başlığını kaynak ve tarihle **ayrı bölümde** gösterir; başlıktan Build Entity, AI-development etiketi, hit puanı veya otomatik özet üretmez. Her kaynak için başarı ve hata `/sources` altında görünür. İlk gerçek koşuda 10 akış tamamlandı; güncel sonuçlar için oraya bakılmalıdır.

## Sıradaki genişletme ölçütü

Yeni kaynak ancak **resmi/izinli erişim, tarih, özgün URL, tekrar analizi, örneklem kalite testi ve başarılı gerçek koşu** sonrası etkin sayılır. Öncelik: resmi lab duyuruları, Asya'da güncel birinci el yayınlar, Reddit/Product Hunt için meşru API erişimi; sonra araştırma makaleleri için ayrı Research Gate. Haber miktarı artarken ürün vitrini ve ders kalite kapısı gevşetilmez.
