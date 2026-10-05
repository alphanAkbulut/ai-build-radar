# TrendRadar incelemesi ve Radar'a uyarlanan fikirler

**İnceleme tarihi:** 5 Ekim 2026. **Referans:** [SANSAN0/TrendRadar](https://github.com/SANSAN0/TrendRadar), incelenen `master` commit'i `792bcc3`. [English](TRENDRADAR-BENCHMARK.en.md).

## TrendRadar ne yapıyor?

TrendRadar genel haber/gündem izleyicisidir. [NewsNow](https://github.com/newsnext/newsnow) API'sinden yapılandırılmış popüler listeleri, ayrıca RSS/Atom/JSON akışlarını okur. Varsayılan yapılandırmasında Toutiao, Baidu, Bilibili, Weibo, Zhihu gibi Çin platformları bulunur. Aynı başlığın listelerdeki sırasını ve tekrar görünmesini depolar; anahtar sözcükler veya **isteğe bağlı** model API'siyle ilgi alanına göre filtreler. Rapor, bildirim ve MCP araçları üretir. Yerel SQLite ve isteğe bağlı uzak depolama seçenekleri vardır. Saatlik GitHub Actions örneği ve Docker çalıştırma yolu sunar. [Toplayıcı](https://github.com/SANSAN0/TrendRadar/blob/master/trendradar/crawler/fetcher.py), [yapılandırma](https://github.com/SANSAN0/TrendRadar/blob/master/config/config.en.yaml), [AI filtre akışı](https://github.com/SANSAN0/TrendRadar/blob/master/trendradar/ai/filter_pipeline.py), [zamanlayıcı](https://github.com/SANSAN0/TrendRadar/blob/master/.github/workflows/crawler.yml).

Buradaki “AI”, öncelikle **haber filtreleme ve yorumlama** aracıdır. Bir bağlantının AI ile geliştirildiğini, canlı demo olduğunu, hangi kodla yapıldığını veya öğretici olduğunu doğrulamaz. Yapılandırılmış birçok sıcak liste tek bir NewsNow API'sine dayanır; Radar'da bunları 11 bağımsız sağlayıcı bağlantısı diye saymak yanlış olur.

## Gerçekten çalışıyor mu?

- Kodda veri alma, durum kontrolü, alan adı doğrulaması, saklama, filtreleme ve raporlama akışları var. Veri alma fonksiyonuna denetimli örnek API yanıtı verildiğinde kayıt başarıyla işlendi. Bu, gerçek uçtan uca çalışmanın kanıtı değildir.
- Bu deponun `Get Hot News` GitHub Actions iş akışı inceleme anında GitHub API'sinde `disabled_manually` durumundaydı. Ayrıca örnek iş akışı yedi gün sonra duracak şekilde tasarlanmış; sürekli çalışan servis göstergesi sayılamaz. [İş akışı](https://github.com/SANSAN0/TrendRadar/blob/master/.github/workflows/crawler.yml).
- Varsayılan `newsnow.busiyi.world` API'sine bu çalışma ortamından yapılan tek istek HTTP 403 döndürdü. Bu, erişim yolumuzun engellendiğini gösterir; dünyanın her yerinde servis kapalı demek değildir.
- Depodaki `output/news` örnek verileri Aralık 2025 tarihlidir. Bunlar ürün demosu olabilir, güncel tarama kanıtı değildir. Bu incelemede tam kurulum, gerçek zamanlı tarama ve bildirim gönderimi doğrulanmadı.

## Radar için alınan ve alınmayan kararlar

| Fikir | Karar ve gerekçe |
| --- | --- |
| Sıra geçmişi | **Uyarlandı.** Hugging Face'in en çok beğenilenler sorgusu trend kanıtı vermez; yalnız trend yanıtındaki ilk 20 kayıt bu iddiayı alır. Gerçek liste sırası kaydedilir; en az 24 saat aralıklı iki sıra varsa değişim gösterilir. Farklı platformların sıraları toplanmaz. |
| Kaynak yoğunluğu | **Uyarlandı.** `/briefing`, tek platformlu ilgi kayıtlarının hangi kaynaklardan geldiğini sayı ile gösterir. Böylece bir platformun akışı “dünya gündemi” gibi görünmez. |
| Konu filtresi | **Sıkılaştırıldı.** Lobsters'ın genel `web/show/release` etiketleri artık AI gündemi için yeterli değil; yalnız `ai` veya `ml` etiketi geçer. Eski yanlış kayıtlar kanıt geçmişinden silinmez, fakat akışta yeniden yayımlanmaz. |
| Sağlık ve başarısızlık | **Zaten vardı.** `/sources` son başarılı taramayı, son denemeyi, hatayı ve sıradaki zamanı ayrı tutar. Başarısız tarama başarı sayılmaz. |
| Tekrar ayıklama | **Zaten vardı.** Radar ürün URL'si/alias ve kaynak kanıtını ayrı tutar; aynı isim tek başına eşleşme değildir. |
| Genel haber API'sini doğrudan build kaynağı yapma | **Alınmadı.** Genel başlık bir Build Entity veya AI geliştirme kanıtı değildir. NewsNow burada HTTP 403 verdi ve tek toplayıcı bağımlılığı oluşturur. Gelecek ayrı News Event akışı için kaynak adayı olabilir. |
| Bildirimler, MCP ve ücretli AI filtre | **Bu işin dışında.** Önce aday kalitesi, kaynak çeşitliliği ve çalışan demo incelemesi doğrulanmalı. Model API'si henüz bağlı değildir. |

TrendRadar [GPL-3.0](https://github.com/SANSAN0/TrendRadar/blob/master/LICENSE) lisanslıdır. Radar'a onun kodu taşınmadı; yukarıdaki fikirler mevcut veri sözleşmesiyle bağımsız olarak uygulandı.
