# AI Build Radar · fazlar ve iş sırası

**Durum:** 5 Ekim 2026 planı; fazlar takvim sözü değildir. [English](ROADMAP.en.md) · [Ürün hafızası](PRODUCT-STRATEGY.md) · [Kararlar](DECISIONS.md). Bu belge **hedef ve kabul ölçütlerini** anlatır. İşin gerçekten başlaması/bitmesi GitHub Issues'da, çalışan tarama `/sources` ekranında doğrulanır. `Rxx` kodları iş kimliğidir; “hazır” etiketi değildir.

## Öncelik kararı

İlk yayın değeri, yüzlerce kayıt veya yeni özellik değil, **güvenilir gündem + beş gerçekten öğretici ürün**dür. Önce yanlış iddia ve boş kart sorununu düzeltiriz; sonra kaynak sayısını ve ders üretimini artırırız. Bir seferde en çok iki uygulama işi açık tutar, her işi gözlenebilir kabul ölçütüyle kapatırız.

| Faz | Kullanıcıya görünen sonuç | Çıkış kapısı |
| --- | --- | --- |
| **0 · Temel (mevcut)** | Private yerel arayüz; Build/Evidence kayıtları; dedupe; kaynak ekranı; gündem, aday ve ders yüzeyleri | Kod ve belgeler var. **Otomatik insan benzeri değerlendirme tamamlanmış sayılmaz.** |
| **1 · Güvenilir keşif (şimdi)** | Ziyaretçi tek kartta ne/neden/kaynak/zamanı anlar; gerçek ürün adresine gider; seçilen ilk 5 vaka gerçekten incelenmiştir | `R01–R06` tamam, örneklem hata raporu ve 5 uçtan uca vaka gözden geçirilmiş |
| **2 · Derinlik ve kapsam** | Daha geniş küresel kaynak, tarihlenmiş ürün/model haberleri ve 20→30 seviyesine doğru kalitesi korunan dersler | `R07–R11`; her yeni kaynağın sağlığı, hakları ve yanlış-pozitif oranı görünür; ders kapısı değişmez |
| **3 · Private beta** | Mac kapalıyken de çalışan, güvenli, çok dilli genişleyebilen ve ölçülebilen davetli deneyim | `R12–R15`; gerçek hosted erişim ve worker, yedek/geri dönüş, maliyet ve gizlilik denetimi |
| **4 · Public ürün (sonraki karar)** | Araştırma, dış sistemleri besleyen akış ve topluluk/vitrin özellikleri | `R16–R18` için kullanıcı ihtiyacı, haklar ve gelir hipotezi doğrulanır; yayın kararı ayrıca alınır |

## Faz 1 · şimdi yapılacaklar

| İş | Neden / çıktı | Bitti sayılma koşulu |
| --- | --- | --- |
| **R01 · İnsan etiketli kalite örneklemi** | Mevcut aday/gündem/seçkiden temsilî örneklemde AI geliştirme iddiası, canlı demo, açıklama, ilgi ve duplicate hatalarını bul. | Örneklem yöntemi, sayılar, yanlış pozitif/negatif adayları, kaynak ve düzeltme önceliği raporlu. “%90” ancak uygun testle ölçülür. |
| **R02 · Gündem olay sözleşmesi** | Keşif, gerçek lansman, platform ilgisi, bahsedilme ve resmi ürün/model haberi için zaman/kaynak ayrımı. | Aynı taramanın eski haberi yenilemediği, geliştirici Trending'in repo Trending sayılmadığı, tek platformun küresel trend yapılmadığı test edilir. |
| **R03 · Demo kontrolü ve kanıt** | Öncelikli adayların gerçek URL, yükleme, mobil/masaüstü ve temel etkileşim kontrolü; görüntü veya kısa hareket kaydı. | Test zamanı/sonuç/sınır saklanır; bozuk veya giriş gerektiren demo seçkide hazır diye sunulmaz; otomasyon başarısızsa görünür. |
| **R04 · Kart ve sayfa anlatısı** | Gündem, aday ve öğrenme alanlarını açık rollerle düzenle; kartta “ne yapıyor / neden burada / ne öğrenilir / Dene” sırası. | Beş kullanıcı senaryosu masaüstü+mobilde test edilir; repo birincil eylem değildir; aynı adayın iki listede niçin göründüğü açıklanır. |
| **R05 · Beş amiral vaka** | Mevcut adaylardan gerçekten farklı ve öğretici beş ürün için kaynaklı hikâye, ilgi, demo anı ve öğrenme yolu. | Her vakada üretici açıklaması, iddia/kaynak/tarih, gerçek önizleme ve etkileşim, özgün yöntem–Radar önerisi ayrımı, açık sınırlar var. Zayıf örnek sayıyı doldurmaz. |
| **R06 · Kaynak sağlığı ve kapsam hesabı** | Kayıtlı/etkin/son koşusu başarılı/gerçek aday üreten kaynakları ayır; hatayı görünür kıl. | Günlük raporda kaynak bazında son başarı, alınan/elenen/yeni/eşleşen, gerekçe ve başarısızlık gösterilir; 10 altına düşme gizlenmez. |

**Faz 1 geçiş ölçümü:** 5 vaka gerçek tarayıcı kontrolüyle açılır; en az bir ayırt edici etkileşim gösterilir; kartı okuyan kişi neye baktığını ve neden listelendiğini anlayabilir. R01 örneklemindeki iddia hataları açıkça raporlanıp yüksek riskli yanlış etiketler düzeltilir. Metrik tek başına kart sayısı veya tıklama değildir.

## Faz 2 · sistemin öğrenme kapasitesi

| İş | Sonuç ve sınır |
| --- | --- |
| **R07 · Küresel kaynak genişletme** | 25 **çalışan bağımsız** keşif kaynağı hedefi; platform, blog, ürün sitesi ve Çin/Japonya/Kore/Güneydoğu Asya kaynakları. Hak, dil, tarih, erişim ve duplicate örneklemi olmadan yeni kaynağı “çalışıyor” sayma. X/Product Hunt/Reddit/YouTube için resmi erişim koşulları ayrı. |
| **R08 · İlgi ve kişi izleme** | Birden çok platformdaki ölçülen sinyaller ile insan yayınlarının tarihli bağlamı. Kimin ne zaman *bahsettiği*, ne söylediği ve gerçekten övüp övmediği ayrı; alıntı limiti ve bağlantı korunur. YouTube incelemeleri kaynak olabilir, otomatik onay değildir. |
| **R09 · Kaynaklı çok dilli kısa özet** | Özet article+dil+source version+prompt version ile önbelleğe alınır; kaynak bağlantısı gösterilir. API kapalıyken hazır olmayan diller görünür ama pasiftir. Sağlayıcı, güvenlik ve maliyet sınırı onaylanmadan ücretli üretim yok. |
| **R10 · Test edilmiş uyarlama** | Tek özelliğin uygulama adımı, başlangıç promptu ve kabul kontrolü örnek projede gerçekten denenir. Başka bir açık sohbet/proje kendiliğinden bilinmez; prompt bunu önce sorgular. Belirsiz orijinal kod/model kesin diye yazılmaz. |
| **R11 · Ders üretim kapasitesi** | İlk beşten sonra 20, sonra yaklaşık 30 güçlü vaka. Otomatik ajan adayları ve kaynakları hazırlar; demo/teaching kalite kapısı insan denetimi veya ölçülmüş güvenilir değerlendirme gerektirir. Hacim için kapı gevşetilmez. |

## Faz 3 · private beta işletimi

| İş | Sonuç ve sınır |
| --- | --- |
| **R12 · Hosted private işletim** | Supabase/alternatif veri yedekleme, secret yönetimi, davetli auth, sürekli scheduler/worker, hata alarmı ve geri dönüş testi. Bugünkü yerel şifre veya canlı veri körlemesine taşınmaz. |
| **R13 · Dil ve erişilebilirlik** | Arayüz metinleri ve içerik dilleri ayrılır; eksik çeviri gerçek durumuyla gösterilir; responsive ve klavye/ekran okuyucu akışları test edilir. |
| **R14 · Kullanım ve kalite analitiği** | Dene → Öğren → Uyarla hunisi, arama, kaydetme niyeti ve terk noktası; düşük veri toplama, silme ve gizlilik sınırları. GitHub repo trafiği site tıklaması yerine geçmez. |
| **R15 · Yayın öncesi denetim** | Kaynak/lisans koşulları, görüntü kullanım hakkı, güvenlik, maliyet tavanı, yanlış iddia geri çekme ve beta geri bildirim akışı incelenir. Public yayın ayrı karardır. |

## Faz 4 · yalnızca doğrulanan talep üzerine

**R16:** Research Gate ve resmi model/özellik haberleri, çalışan build akışından ayrı. **R17:** kullanıcı hesabı, bookmark/follow/comment, üretici vitrini ve monetizasyon hipotezleri; moderasyon/kimlik yükü ölçülür. **R18:** başka ajanların kullanabileceği tarihli, kaynaklı RSS/API ve belki coğrafi keşif; kaynak hakları ve lokasyon kanıtı ön koşuldur. Ülke biliniyorsa haritada başkent yalnız *görsel konum vekili* olarak, açık etiketle kullanılabilir; gerçek yapım/deploy şehri diye sunulmaz.

## İş yönetimi ve güncelleme kuralı

- **Repo belgeleri = kalıcı ürün hafızası.** Bu plan, [ürün hafızası](PRODUCT-STRATEGY.md), [kararlar](DECISIONS.md), [mimari](ARCHITECTURE.md) ve konu belgeleri kodla birlikte sürümlenir. Chat veya Notion tek gerçek kaynak değildir.
- **GitHub Issues = yaşayan yapılacaklar listesi.** Her `Rxx` işi bir issue; açıklamada problem, mevcut kanıt, kapsam, kabul ölçütü, bağımlılık ve ilgili belge bağlantısı bulunur. Başlamadan “şimdi”, tamamlayınca test/ekran/commit kanıtı eklenir. Issue kapanması belgeyi otomatik güncellemez; ilgili doküman değişikliği aynı işte yapılır.
- **GitHub Projects = isteğe bağlı görünüm.** Issues olgunlaşınca Backlog / Next / Doing / Review / Done sütunları eklenebilir. Board kopya hafıza değil, aynı issue'ların görünümüdür. Private görünürlük ayrıca doğrulanır.
- **Notion şimdilik gerekli değil.** Görsel atölye, dış paydaş araştırması veya teknik olmayan ekip için ayrı ihtiyaç doğarsa bağlanır; ürün kararlarının kanonik kopyası yine repo dosyaları olur. İki sistem arasında otomatik senkron yoksa kopya yol haritası tutulmaz.
- Haftalık kısa gözden geçirme: kaynak sağlığı, 1–2 tamamlanan iş, yeni kanıtla değişen karar, sıradaki iki iş. Güncel sayılar `/sources` ve testlerden okunur; eski rakamlar yeni gerçek gibi kopyalanmaz.
