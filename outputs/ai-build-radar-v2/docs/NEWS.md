# Haber akışı · çalışma sözleşmesi

**Durum:** 6 Ekim 2026 yerel private MVP uygulaması. [English](NEWS.en.md) · [Mimari hafıza](ARCHITECTURE.md) · [Kaynak kataloğu](GLOBAL-SOURCE-CATALOG.md). Bu belge planlanan davranışla gerçekten çalışan davranışı ayırır; anlık başarı ve haber sayısı için `/sources` ile `/news` ekranları esas alınır.

## Neden ayrı bir ekran?

`/news` AI alanındaki **yayıncı yazılarını** gösterir. `/?view=feed` ise kaynaklı ilgi veya keşif sinyali bulunan ve ayrıca gerçek demosu incelenmiş **ürünleri** gösterir. `/briefing` ikisinden kısa, tarihli bir kesit sunar; haberleri ayrı başlıkta listeler. Bir haberin yayımlanması ürünün AI ile geliştirildiğini, ilgi gördüğünü, çalıştığını veya önerildiğini kanıtlamaz. Bu ayrım, teorik model duyurularının “Dene” kartına dönüşmesini önler.

## Kaynak ve işlem sırası

1. Etkin 10 RSS kaynağı [`content/news-feeds.json`](../content/news-feeds.json) içinde; her biri [`lib/sources.ts`](../lib/sources.ts) kayıtlarında **180 dakika** aralıkla tanımlıdır. Bunlar 25 çalışan bağımsız **ürün keşif kaynağı** hedefi yerine sayılmaz. `pnpm worker` zamanı gelen işleri bilgisayar/worker açıkken kontrol eder; aralık, her üç saatte mutlaka yeni haber çıkacağı sözü değildir.
2. [`scripts/news_feed.py`](../scripts/news_feed.py) her kaynağın en yeni **20 RSS/Atom girdisini** okur. HTTPS URL ve geçerli zaman yoksa kayıt alınmaz. Gelecek tarihli veya yedi günden eski yazı elenir; geniş yayınlarda başlıkta AI ile ilgili sözcük aranır. Başlık filtresi yanlış negatif üretebilir.
3. [`lib/news-collector.ts`](../lib/news-collector.ts) kanonik makale URL'siyle tekrarları birleştirir; gerçek `publishedAt` ile Radar'ın `firstSeenAt`/`lastSeenAt` alanlarını ayrı tutar. Yeniden tarama eski makaleyi yeni yayımlanmış gibi göstermez. RSS açıklaması boş geldi diye önceki geçerli açıklama silinmez.
4. Kartta yayıncının başlığı, yayın tarihi, varsa yazar ve en çok **420 karakterlik kaynak açıklaması** bulunur. Açıklama RSS'ten gelebilir. Açıklama veya yazar eksikse kaynak başına en yeni **12** uygun makalenin yalnız kayıtlı yayıncı host'undaki sınırlı HTML başlangıcından açıklama/yazar üstverisi denenir; tam haber metni saklanmaz. Köken `rss` veya `article-meta` olarak tutulur. Başarısızlıkta açıklama uydurulmaz.
5. RSS içeriğindeki en çok **12 açık dış bağlantı** saklanır. Mevcut Build URL/alias'ıyla kanonik tam eşleşme varsa ilgili kayıt açılabilir. Eşleşmeyen GitHub repo veya Hugging Face Space bağlantıları yalnız **inceleme bekleyen bağlantı** olarak görünür. RSS'te bağlantı yoksa tam makalede de yoktur sonucu çıkarılmaz; tam metin proje çıkarımı bugün yapılmıyor.

## Ziyaretçinin gördüğü durumlar

`/news` varsayılan olarak son **48 saat**, seçimle son **7 gün** haberlerini **yayın tarihine** göre sıralar ve **12'li sayfalar** halinde gösterir. Kart açıklaması yayıncının dilindedir; Radar'ın özgün AI özeti veya Türkçe çevirisi değildir. Güvenilir açıklama bulunamadıysa bu açıkça yazılır. Başlık özgün makaleyi açar. Mevcut Radar kaydıyla eşleşen açık bağlantı, incelenmemiş proje bağlantısı ve diğer dış bağlantılar farklı etiketlenir.

Ekran haber tarama planını, etkin haber kaynağı sayısını ve bu kaynaklar arasındaki **en son başarılı kontrolü** gösterir. Bu zaman yalnız bir kaynağın başarısı olabilir; bütün kaynakların sağlığı anlamına gelmez. Kaynak bazındaki son deneme, son başarı, `completed`/`partial`/`failed` durumları ve alınan/elenen/kabul edilen kayıtlar `/sources` üzerindedir. Boş haber listesi “dünyada AI haberi yok” anlamına gelmez: pencere, kaynak kapsamı, filtre, hata, durmuş worker veya eski registry ile çalışan worker olabilir. Yeni kaynak/adapter eklenince tek-worker ve kilit kuralı korunarak süreç yeniden başlatılır.

## Veri ve yayın sınırları

`NewsEvent`, [`lib/schema.ts`](../lib/schema.ts) içinde Build Entity ve Evidence Object'ten ayrı tanımlıdır; yerel JSON deposunda isteğe bağlı `newsEvents` alanındadır. Haber için hosted Supabase tablosu/senkronizasyonu yoktur. Haber bağlantısı Build kaydı açmaz, AI geliştirme rozeti vermez, ürün gündemi veya öğrenme koleksiyonunun demo kapısını geçirmez. `/briefing` haberleri kısa başlık listesinde gösterir; ayrıntılı açıklama ve yazar `/news` içindedir.

**Açık işler:** tam makalede RSS'te bulunmayan ürün bağlantılarını güvenilir çıkarma; kaynak metninden farklı dillerde özgün kısa özet üretme; yayıncı bazında yeniden kullanım hakkı; haber kapsamı ve yanlış pozitif/negatif örneklemi; hosted worker ve gecikme alarmı. Bunlar [R09](ROADMAP.md), [R12](ROADMAP.md), [R15](ROADMAP.md), [R16](ROADMAP.md) ve [NEWS-01 / OPS-01](RISK-REGISTER.md) altında izlenir. Bugünkü UI bunları tamamlandı diye sunmaz.
