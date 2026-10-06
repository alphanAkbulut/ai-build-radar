# AI ile geliştirilme iddiası: kanıt ve sınırlar

**Durum:** 6 Ekim 2026 tarihli ürün kararı ve araştırma notu. [English](AI-DEVELOPMENT-EVIDENCE.en.md) · [Veri sözleşmesi](MODEL.md) · [Karar kaydı](DECISIONS.md). Bu belge bugünkü Radar davranışını hedef araştırmadan ayırır; yeni bir collector'ın veya sağlayıcı bağlantısının çalıştığını iddia etmez.

## Asıl soru

“Bu ürün AI kullanıyor mu?”, “Geliştirici AI aracını kullandı mı?”, “Belirli kod değişikliğini hangi agent yaptı?” ve “Ürünün tamamı AI tarafından mı geliştirildi?” farklı iddialardır. Birinin kanıtı diğerine taşınmaz. İnsan ve AI katkısı aynı dosyada ve commit zincirinde karışabilir; bu nedenle tüm ürün için ikili “insan/AI kodu” damgası tasarlamıyoruz.

## Araştırmanın söylediği ve söylemediği

[Suh ve arkadaşlarının ampirik çalışması](https://arxiv.org/abs/2411.04299) incelediği mevcut AI kod dedektörlerinin zayıf performans ve pratik kullanıma yetmeyen genellenebilirlik gösterdiğini bildiriyor; kendi en iyi yöntemleri de F1=82,55 raporluyor. Bu, **her** dedektörün **her** koşulda başarısız olduğu anlamına gelmez. [CoDet-M4 çalışması](https://arxiv.org/abs/2503.13733) çok dil, üretici ve alan arasında daha iyi ayrım raporluyor; bu araştırma sonucu da Radar'ın rastgele açık kaynak repo için kalibre edilmiş, ürün düzeyinde doğrulaması değildir. Sonuç: yalnız kod biçimi, dosya adları, yorum stili veya tahmini “gizli AI imzası” public bir “AI ile geliştirildi” etiketi üretmez. Böyle bir sınıflandırıcı ileride yalnız **inceleme kuyruğu için aday sinyali** olabilir; insan etiketli, farklı araç/dil/zaman örnekleminde yanlış pozitifler ölçülmeden yayın kanıtı olamaz.

## Doğrudan izler de kapsamlı değildir

| İz | Destekleyebildiği dar iddia | Desteklemediği iddia / erişim sınırı |
| --- | --- | --- |
| Proje sahibinin açık README, site veya paylaşım beyanı | Sahibin belirttiği geliştirme aracı/yöntemi (`Builder-stated`) | Bağımsız doğrulama; bütün kodun AI tarafından yazıldığı; belirtilmeyen model. |
| [GitHub Copilot cloud agent](https://docs.github.com/en/copilot/how-tos/copilot-on-github/use-copilot-agents/manage-and-track-agents) tarafından yazılmış, oturum kaydına bağlı imzalı commit | Erişilebilir kayıt doğrulanırsa **o commit** için agent katkısı | İlişkili olmayan commit'ler veya ürünün tamamı. GitHub'daki genel “Verified” imza rozeti tek başına “AI yazdı” demek değildir. |
| [Cursor AI Code Tracking API](https://prod.cursor.com/docs/account/teams/ai-code-tracking-api) | Yetkili ekibin, araca kaydedilmiş kabul edilmiş değişiklikleri ve commit düzeyindeki kullanım ölçümleri | Tüm IDE'ler, tüm insan/AI emeği veya halka açık bütün repolar. [Cursor'ın güncel ürün belgesi](https://prod.cursor.com/docs/enterprise) bu API'yi Enterprise özelliği olarak listeler; Radar'ın bugün erişimi/entegrasyonu yoktur. |
| `.cursor`, `CLAUDE.md`, agent yönergeleri, bağımlılık veya üretilmiş dosya izi | O repo içinde araca ilişkin bir ipucu (`Derived`) | Aracın gerçekten o ürünü geliştirdiği; dosyalar kopyalanabilir veya hiç kullanılmamış olabilir. |
| GitHub yıldızı/Trending, Hugging Face Space, dizin kategorisi, ürünün AI özelliği | Kendi alanındaki ilgi, katalog veya işlev iddiası | AI ile geliştirilme kanıtı. |

## Radar'ın yayın kuralı

1. Evidence Object belirli **alan + değer + kaynak + alıntı/konum + gözlem tarihi** için tutulur. `Verified` bütün ürüne yayılan bir güven mührü değildir; doğrudan gözlenen **sınırlı iddiadır**. Repo URL'si `Verified` iken `ai_tools` aynı projede `Unknown` kalabilir.
2. Açık üretici beyanı `Builder-stated` olur ve kimin, nerede, ne zaman söylediği gösterilir. Repo sahibi dışındaki katalog beyanı onun yerine geçmez. Kaldırılan beyan güncel projeksiyondan düşer; geçmiş gözlem saklanır.
3. Yetkili provider kayıtları ileride alınırsa **commit/değişiklik kapsamı** ve sağlayıcı adıyla ayrı kanıtlanır. Tek bir agent commit'inden “ürünün tamamı AI ile yapıldı” sonucu çıkarılmaz. Özel ekip telemetrisi izin, gizlilik, maliyet ve erişim kararı olmadan toplanmaz.
4. Kod benzerliği veya dosya işareti `Derived` aday sinyali olarak iç incelemeye gidebilir; üretici beyanı yerine geçmez. Eksik kanıt `Unknown` kalır; “AI kullanılmadı” anlamına gelmez.
5. AI ile geliştirildi, AI özellikli, hangi model kullanıldı ve ne kadar AI katkısı var soruları ayrı alanlardır. Yüzdelik katkı veya “%90 kesin” etiketi, tanımlı örneklem ve kalibrasyon olmadan gösterilmez.

## Çapraz kontrol ve beyan manipülasyonu · hedef kural

README veya proje açıklamasındaki “AI ile yapıldı” ifadesi, sahibin kendi iddiasıdır; otomatik olarak bağımsız doğrulama değildir. Hacker News, Product Hunt ve blogların aynı README'yi veya basın metnini aktarması **üç bağımsız kanıt** sayılmaz. Kaynakları `özgün iddia → bağımlı tekrarlar` ilişkisiyle grupla; proje/repo/site kimliğini eşleştir, özgün yayın tarihini ve doğrudan alıntının kapsamını sakla. Bağımsız yazarın ürünü denemesi demo işlevini doğrulayabilir, fakat yalnız geliştiriciden duyduğu araç adını tekrar etmesi geliştirme yöntemini doğrulamaz. Çelişen kaynakları ve kaldırılan beyanları incelemeye çıkar.

AI ile geliştirme için güçlü doğrulama, ilgili **değişikliğe** bağlı erişilebilir agent oturumu, imzalı agent commit'i veya yetkili sağlayıcı kaydı gibi doğrudan iz gerektirir; kapsam bütün ürüne genişletilmez. Geliştirici beyanı yine değerli `Builder-stated` kanıtıdır ve görünür biçimde öyle etiketlenir. Kod benzerliği, araç yönerge dosyası veya AI dedektörü en fazla `Derived` inceleme sinyali olabilir. Birden fazla platformdaki tarihli güçlü ilgi, projeyi **Gündem incelemesinde öne alabilir**; AI geliştirme kanıtı olmadan “AI ile geliştirildi” grubuna taşıyamaz. Çalışan demo ve kaynaklı açıklama varsa “AI alanında ilgi gören, geliştirme yöntemi bilinmiyor” olarak ayrı gösterilebilir.

Instagram benzetmesinin sınırı: Meta, AI içerik etiketlerinde üretici araçların dosyaya koyduğu C2PA/IPTC işaretleri, görünmez filigranlar ve kişinin kendi bildirimini kullanıyor; tüm AI içeriklerini tanıyabildiğini söylemiyor. Hafif AI düzenlemesinin bile yanlış kapsamda “Made with AI” etiketine yol açtığını açıkladı. [Meta'nın açıklaması](https://about.fb.com/news/2024/04/metas-approach-to-labeling-ai-generated-content-and-manipulated-media/) ve [C2PA'nın köken sınırları](https://spec.c2pa.org/specifications/specifications/2.4/explainer/Explainer.html), bir medya dosyasının izinin bütün bir yazılımın kod yazarlığına taşınamayacağını gösterir. Yazılım için evrensel, zorunlu ve aynı şekilde taşınan bir üretim işareti elimizde yok.

**Uygulama öncesi kontrol:** R01'de birinci taraf beyanı, kopya/yankı haber, bağımsız demo gözlemi, doğrudan agent izi ve kanıtsız viral örneklerden etiketli bir örneklem oluştur. Her iddia için kapsam, özgün kaynak, bağımlı tekrarlar, tarih ve karşı kanıt kaydedilsin. Yanlış pozitifler ölçülmeden kaynak sayısına göre “Verified” yükseltmesi veya otomatik yayın yapılmasın. Bu bağımlılık grafiği ve yeni kapı bugün **uygulanmış değildir**.

**Bugünkü uygulama:** GitHub açıklaması veya bağlı README'nin ilk bölümündeki doğrudan geliştirme aracı beyanı `Builder-stated` üretebilir. Radar bugün kod yazarlığı dedektörü, Copilot oturum doğrulayıcısı veya Cursor yönetici API'si çalıştırmıyor. `Verified` AI geliştirme aracı ataması otomatik üretilmiyor. İlk sonraki iş, [R01 örneklem denetiminde](https://github.com/alphanAkbulut/ai-build-radar/issues/1) pozitif/negatif etiketleri elle kontrol etmek; yanlış pozitif ve kanıt kapsamını kaynak bazında raporlamak. Daha geniş otomasyon ancak bu hata ölçümüne göre seçilir.

## Belge kaynakları

- Suh ve arkadaşları, [*An Empirical Study on Automatically Detecting AI-Generated Source Code*](https://arxiv.org/abs/2411.04299), ICSE 2025 için kabul edilen çalışma.
- Orel ve arkadaşları, [*CoDet-M4*](https://arxiv.org/abs/2503.13733), 2025 araştırması.
- GitHub, [Copilot agent oturumlarını ve commit'lerini izleme](https://docs.github.com/en/copilot/how-tos/copilot-on-github/use-copilot-agents/manage-and-track-agents).
- Cursor, [AI Code Tracking API](https://prod.cursor.com/docs/account/teams/ai-code-tracking-api) ve [Enterprise özellikleri](https://prod.cursor.com/docs/enterprise).
