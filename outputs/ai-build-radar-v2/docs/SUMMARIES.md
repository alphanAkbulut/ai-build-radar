# İstek üzerine çok dilli özetler

**Durum:** 5 Ekim 2026 kodu. [English](SUMMARIES.en.md). Kullanıcının seçimiyle harici AI sağlayıcısı şimdilik bağlı değildir; API anahtarı veya ücretli çağrı yoktur. Mevcut editoryal Türkçe özetler görünür. Başka bir dili seçmek Türkçe metni çeviri olarak yeniden etiketlemez; özeti olmayan diller menüde pasiftir.

Hazırlanan akışta oturumlu, aynı origin'den POST isteği yalnız kayıtlı yazı kimliği ve desteklenen dili kabul eder. Kaynak metin yalnız yazarın kayıtlı RSS akışından okunur; ziyaretçinin verdiği rastgele URL'ye gidilmez. Metin kısa veya erişilemezse yalnız başlıktan özet uydurulmaz. Kısmi feed içeriği kısmi diye gösterilir. Sonuç yürütülebilir HTML değil düz React metnidir.

Yerel üretilmiş özet klasörü `learning-data/summaries` Git dışındadır. Önbellek makale ve dile ayrılır, kaynak/sürüm bilgisi saklar; 24 saatten sonra kaynak tekrar okunur, değişmemiş içerik yeniden kullanılır. Çapraz süreç kilidi paralel üretimi sınırlar. Özel PoC sınırları: genel günlük 10 deneme, en çok 24.000 kaynak karakteri, sınırlı çıktı ve otomatik yeniden deneme yok. Çöken üretim kilidinin operatörce incelenmesi gerekir. Bu, dağıtık production kota servisi değildir.

Sağlayıcı açılmadan önce model ve ücret kararı, güvenilmeyen kaynak metnini talimattan ayıran sınırlı istek, sunucuda saklanan kimlik bilgileri, dil/kalite/hata ve maliyet testleri gerekecek. Mevcut testler girdi/çıktı sınırları, kapalı sağlayıcı, kaynak eşleşmesi, kısmi içerik etiketi ve XML reddini kapsar; canlı AI üretimi test edilmedi. Arayüz şimdilik Türkçe; özet hattı `tr/en/ja/ko/zh` dillerini tanır. Tüm ürünün çok dilli olması ayrı hedeftir.

Açık teknik borç: mimari belgede açıklandığı gibi kaynak hash'i ve prompt sürümü henüz tüm cache anahtarında tam uygulanmıyor; sağlayıcı bağlanmadan düzeltilmelidir.
