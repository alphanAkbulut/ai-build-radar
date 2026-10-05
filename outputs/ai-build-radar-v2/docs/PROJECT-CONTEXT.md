# Koleksiyonun bağlam kuralı

Koleksiyondaki her proje `content/project-context.json` içinde kaynaklı bir açıklama taşır. Kartın ürün türü, başlığı ve kısa açıklaması bu kayıttan gelir; öğrenme egzersizinin başlığı ürün tanımı olarak kullanılmaz. Arama bu bağlam alanlarını da kapsar.

- `what`: somut işlev ve çıktı; birincil kaynağın Türkçe özeti.
- `why`: geliştiricinin açıklaması; `whyBasis=personal` açık kişisel çıkış noktası, `product` açıklanan ürün hedefidir. Ürün hedefi kişisel motivasyon olarak sunulmaz. Hikâye yoksa belirtilir.
- `source`, `checkedAt`, `excerpt`: incelenen kaynak, kontrol tarihi ve kısa orijinal alıntı.
- `audience`, `application`: Radar kullanım önerileri; geliştirici beyanı değildir.

Yeni seçilmiş kayıt eklemeden önce geliştirici README, resmi doküman veya açıklaması incelenir. Kaynak okunmadan amaç üretilmez. Test, kaynaklı bağlamı eksik koleksiyon kaydını reddeder. Bu bir editoryal yayın kontrolüdür; ingestion adaylarını otomatik olarak doğrulanmış koleksiyona dönüştürmez.

2026-10-05: 21 projenin README açıklaması incelendi. Ürün özellikleri geliştirici beyanıdır; tüm demoların çalıştığına veya kullanıcıların bunları beğendiğine ilişkin doğrulama değildir. AI ile yapılma kanıtı ayrı değerlendirilir.

## Keşif sırasında otomatik toplama

`project-context` kaynağı, ana ingestion kilidi altında her 15 dakikada en fazla 12 bekleyen adayı işler. İlk kez görülen kayıtlar önce gelir; başarıyla okunan veya açıklaması bulunamayan belge 24 saat sonra, ağ hatası 6 saat sonra tekrar denenir. Kaynak bazlı hatalar diğer adayları durdurmaz. Eski kayıtlar da aynı kuyrukla tamamlanır.

Repo bağlantısı varsa GitHub README API’si; yoksa kayıtlı proje URL’sindeki HTML açıklaması/paragrafları okunur. HN gönderisi, X, Reddit ve YouTube metni geliştirici açıklaması olarak otomatik kabul edilmez. Site okuması halka açık IP’lerle sınırlıdır; DNS sonucu bağlantıya sabitlenir, yönlendirmeler yeniden denetlenir, boyut ve zaman sınırı uygulanır. JavaScript çalıştırılmaz, oturum veya gizli anahtar proje sitelerine gönderilmez.

`Build.context`: complete (açıklama + amaç adayı), partial (yalnız açıklama), missing, failed, blocked. Complete, editoryal onay değildir. Son başarılı içerik, geçici hatada tarihiyle korunur. README ve HTML alıntıları kaynak dilindedir; başlık/ifade eşleştirmesi kullanılır, LLM değerlendirmesi veya otomatik Türkçe çeviri yoktur. Türkçe olmayan açık amaç ifadelerinin bir kısmı kaçabilir. HTML kaynağının geliştiriciyle ilişkisi bağımsız doğrulanmadığından kanıt Derived; repo açıklaması Builder-stated olarak saklanır.

Ham kaynak, içerik özeti, kanıt kimlikleri, kaynak URL’si, zaman ve extractor sürümü veri deposunda tutulur. Değişen metin yeni kanıt sürümü oluşturur; kaldırılan amaç eski güncel kanıt olarak sunulmaz. Tekrar okuma aynı içerik için yeni kanıt üretmez. Aday ekranı ve Build Detail otomatik bağlam durumunu gösterir. Ana öğrenme koleksiyonu ayrı bir editoryal seçkidir; toplanan metinler kendiliğinden kurs veya uygulanmış egzersiz sayılmaz.

Çalıştırma: v2 dizininde `pnpm worker`; tek seferlik kontrol: `pnpm ingest --source=project-context --force`. Aynı veri dizini için yalnızca tek worker çalıştırılmalıdır. Yerel işlem kapatılır veya bilgisayar uyursa tarama çalışmaz.
