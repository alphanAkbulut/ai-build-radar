# AI Build Radar · karar kaydı

**Durum:** 5 Ekim 2026. [English](DECISIONS.en.md) · [Ürün hafızası](PRODUCT-STRATEGY.md) · [Yol haritası](ROADMAP.md). Bu sayfa değişmeyen kanunlar değil, bugünkü tercihin **nedenini** ve neyin hâlâ açık olduğunu tutar. Kodun uygulamadığı karar açıkça “hedef” yazılır. Yeni kanıtla değişirse eski gerekçe silinmez; tarihli yeni satır eklenir.

| ID | Karar ve gerekçe | Bugünkü durum / açık nokta |
| --- | --- | --- |
| D01 | Private başla. Yanlış iddia ve veri haklarını küçük çevrede düzeltmeden public açma. | Yerel parola ve private GitHub var; hosted/private beta yok. |
| D02 | Tek ürünün **gündem** ve **öğrenme** yüzeyleri ayrı kalite kapılarıdır. Kullanıcı çok yeni şeyi görebilir, ancak az sayıda üründen derinlemesine öğrenir. | Uygulandı; sayfa ayrımının kullanıcıya daha anlaşılır anlatımı R04. |
| D03 | Kartın ilk eylemi **Dene**, ikinci eylemi **Bundan öğren**. Kod ve kanıt daha sonra gelir. | Akış kısmen var; gerçek demo ve kart anlaşılırlığı R03–R05. |
| D04 | AI kullanan, AI ile yapılan, ilgi gören ve yeni yayınlanan dört ayrı iddiadır. `Unknown` ayrı tutulur. | Kanıt modeli var; insan etiketli doğruluk ölçümü R01. |
| D05 | Her iddia kaynak/tarih/alıntı taşımalı; kişiden bahsedilmesi övgü değildir. | Uygulamada kaynaklar var; yorum bağlamı ve kişi anlatısı R08. |
| D06 | Gerçek görsel ve etkileşim gözlemi olmadan büyük vitrin kartı/öğrenme dersi verme. Statik görüntü canlı hareket değildir. | Editoryal önizlemeler var; otomatik demo kontrolü R03. |
| D07 | Yaklaşık 30 kapsamlı vaka, çok sayıda yüzeysel karttan değerlidir. “Seçilmiş” kalite iddiasıdır. | Hedef; ilk 5 vaka R05, üretim ölçeği R11. |
| D08 | Geliştiricinin kanıtlı yöntemi ile Radar'ın **önerdiği** yeniden uygulama yöntemi ayrı yazılır. | Derslerde kısmen var; gerçek uyarlama testi R10. |
| D09 | Başka AI sohbeti veya kod deposu site tarafından otomatik bilinmez. Prompt önce mevcut projeyi inceleyip uyumu sorar. | Prompt akışında sınır var; R10 kalite testi. |
| D10 | Kaynak sayısında en az 10 etkin bağımsız keşif kaynağı; public hedefi 25 **çalışan** bağımsız kaynak. Aynı GitHub'ın iki sayfası iki platform değildir. | Yerel registry 14 etkin keşif; fiilî son başarı `/sources` ile kontrol edilir. R06–R07. |
| D11 | Yerel worker yalnız Mac açıkken çalışır; başarısız tarama görünür kalır. “Son kontrol” ve “son başarı” farklıdır. | Uygulandı; hosted işletim R12. |
| D12 | İlk arayüz dili Türkçe, içerik sistemi gelecekte çok dilli. Olmayan özet çevrilmiş gibi görünmez. | Dil bazlı kayıt hazır, ücretli üretici kapalı; R09/R13. |
| D13 | Üyelik, yorum, follow, geliştirici vitrini ve monetizasyon bugünkü MVP kapısı değildir. Önce ziyaretçi değerini kanıtla. | Ürün fikri; R17 öncesi talep ve moderasyon incelemesi. |
| D14 | Coğrafya iddiası yapımcı/deploy şehir kanıtı gerektirir. Başkent yalnız harita için açık etiketli konum vekili olabilir. | Harita yok; R18 araştırması. |
| D15 | Mimari/ürün hafızası sürümlü repo belgelerinde, işleri GitHub Issues'da tut. Board aynı issue'ların görünümü. | 18 issue ve [private pano](https://github.com/users/alphanAkbulut/projects/2) açıldı; Notion şu an ikinci kopya üretir. |
| D16 | Research Gate, model duyurusu ve teorik makale çalışan uygulama kartı gibi sunulmaz. | Ayrı ekran yok; R16. |
| D17 | Kod biçiminden evrensel bir “AI imzası” çıkarma. Üretici beyanını, belirli agent commit kaydını ve AI özellikli ürünü ayrı iddialar olarak tut; tek commit'i tüm ürüne genelleme. | [Kanıt sınırları ve birincil kaynaklar](AI-DEVELOPMENT-EVIDENCE.md) yazıldı. Bugün otomatik kod yazarlığı tespiti veya sağlayıcı telemetrisi yok; R01 ile hatalar ölçülecek. |
| D18 | Kaynağa özel yayın iddiasında kanıt eksikse **gösterme**; ham geçmişi silme. Toplama geniş kalabilir, ziyaretçiye açık gündem daha sıkı ve aynı kuralı kullanan yüzeylerden üretilir. | Lobsters tartışması için ham kaynak/kayıt/hash eşleşmesi ve `ai`/`ml` etiketi gündem, detay kaynağı ve güncel kanıtta ortak kapı oldu. Diğer kaynaklarda yanlış pozitif ölçümü R01. |

## Açık kararlar

1. **Öncelikli niş:** AI ile *geliştirilmiş* ürünler varsayılan ana kitle; AI *kullanan* ilginç ürünler ayrı açıklanmış akışta kalır. Gerçek örneklem ve ziyaretçi testleriyle bu iki akışın bilgi mimarisi yeniden ölçülecek (R01/R04).
2. **Değerlendirmede otomasyon seviyesi:** Kaynak/toplama/ön eleme otomatik; etkileşim ve “öğretici mi?” yargısı bugün editoryal. R03/R05 testlerinden sonra hangi kısımların otomatik güvenilir olduğu kararlaştırılacak. AI sağlayıcısı ve bütçe seçilmedi.
3. **Public'a geçiş:** 25 sağlıklı kaynak, güvenilir seçki ve gizlilik/hak/maliyet kontrolü tamamlanmadan tarih verilmez (R07/R15). Public hesap ve ücret katmanının kapsamı daha sonra seçilir.

## Değişiklik yapma kuralı

Bir karar değiştiğinde sorun/kanıt, önceki kural, yeni kural, etkilenen ekran/veri ve doğrulama notu ekle. İlgili Türkçe/İngilizce mimari ve yol haritasını birlikte güncelle. Issue kapanması tek başına ürün kararını değiştirmez.
