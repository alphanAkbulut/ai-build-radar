# Risk kaydı · kaynak ve yayın kararları

**Durum:** 6 Ekim 2026. Yerel private MVP için açık riskler; public kullanım onayı değildir. [English](RISK-REGISTER.en.md). Canlı kaynak sağlığı `/sources`, uygulama ayrıntısı [GitHub Trending denetimi](GITHUB-TRENDING.md), iş sahibi [R15](https://github.com/alphanAkbulut/ai-build-radar/issues/15).

## Kayıt kuralı

Yeni dış kaynak, provider, veri akışı veya yayın biçimi önemli bir hak, güvenilirlik, maliyet, gizlilik ya da yanlış iddia riski doğuruyorsa aynı değişiklikte buraya tarihli kayıt açılır veya mevcut kayıt güncellenir. **Gözlem, belirsizlik, etki, bugün çalışan önlem, tetikleyici, yapılacak kontrol, karar ve bağlı iş** ayrı yazılır. Yerel PoC'de çalışması public izin veya dayanıklılık kanıtı sayılmaz. Risk kapanışı yalnız ilgili kontrolün kanıtı ve tarihli karar kaydedilince yapılır; kod değişikliği tek başına kapatmaz.

## GH-01 · GitHub Trending HTML erişimi ve yeniden kullanım hakkı — açık

- **Gözlem:** Adapter `RADAR_AUTH_MODE=local` koşuluyla etkin; [Trending repo](https://github.com/trending) ve [geliştirici](https://github.com/trending/developers) sayfalarının HTML'ini üç saatte bir okuyor. İncelenen [REST Search API](https://docs.github.com/en/rest/search/search) belgelerinde aynı Trending sıralaması için bir uç nokta bulunmadı. Bu, GitHub'ın hiçbir izin yolu olmadığı iddiası değildir.
- **Belirsizlik ve etki:** [Acceptable Use Policies](https://docs.github.com/en/site-policy/acceptable-use-policies/github-acceptable-use-policies) otomatik veri çıkarmayı tanımlar, bazı amaçlara izin verir, aşırı yükü ve hizmetin izinsiz yeniden sunulmasını kısıtlar. HTML okumak kategorik olarak yasak diye çıkarım yapamayız. Ancak ürün public/hosted veya ticari olduğunda erişim, görüntüleme ve yeniden kullanım hakkı ayrıca değerlendirilmeden güvenli varsayılamaz. Etki: kaynak kesintisi, kullanım kısıtı ve ürün/hak riski. Hukuk görüşü değildir.
- **Bugünkü önlem:** Yerel mod kapısı, sabit iki URL, üç saatlik aralık, yanıt boyutu/süre sınırı ve ham sayfanın depolanmaması. Bunlar hukuki izin yerine geçmez.
- **Tetikleyici / karar kapısı:** Hosted/public yayın, ticari kullanım, yeniden dağıtım veya sıklık/kapsam artışı öncesi [R15](https://github.com/alphanAkbulut/ai-build-radar/issues/15) kapsamında GitHub koşulları ve robots yönergeleri tekrar incelenir. API/Search ile elde edilebilen daha dar ama resmî sinyal seçeneği değerlendirilir; tam Trending sırası zorunluysa GitHub'dan uygun izin/rehberlik veya uzman hak incelemesi alınır. Sonuç, kaynak bazında **devam et / değiştir / kapat** kararı olarak tarihli kaydedilir. Açık karar olmadan HTML adaptörü public moda taşınmaz.

## GH-02 · HTML düzeni ve ölçüm kırılganlığı — açık

- **Gözlem:** Başlık ve bağlantılar sayfanın bugünkü işaretlemesinden ayrıştırılıyor. Test temsili HTML ve bozuk düzenin başarısız sayılmasını doğruluyor; canlı sayfanın gelecekte aynı kalacağını doğrulamaz.
- **Etki:** Sessiz boş sonuç, yanlış repo eşleşmesi veya trendin kaçırılması; kullanıcıya yanlış gündem sunulması.
- **Bugünkü önlem:** Düzen/API hatası `/sources` üzerinde başarısız/kısmi koşu olarak görünür; boş başarılı tarama uydurulmaz. URL ile dedupe ve sinyal türü ayrımı yapılır.
- **Tetikleyici / kontrol:** Sayfa düzeni değişikliği, ardışık başarısız koşu veya beklenmedik sıfır/keskin hacim değişimi. R15 öncesinde canlı uçtan uca gözlem, hata alarmı ve gerektiğinde adaptörü kapatıp son doğrulanmış veriyi tarihli gösterme akışı test edilir. Bir HTML fixture testi bu kabulün yerine geçmez.

## GH-03 · erişim hızı ve limitler — açık

- **Gözlem:** Bir koşu en çok iki HTML sayfası ve 16 repo API zenginleştirmesi yapabilir; üç saatlik planla teorik üst sınır günde yaklaşık 16 HTML ve 128 repo API isteğidir. Gerçek sayı koşu kayıtlarına bağlıdır; bu sınır başka GitHub adapter'larını içermez. Pipeline `FetchError` geri-deneme süresini ve artan beklemeyi kullanır; tüm GitHub hata türlerinde `Retry-After` davranışı ayrıca doğrulanmış değildir.
- **Etki:** [GitHub API limitleri](https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api) aşıldığında 403/429, geçici engel veya kaçan güncellemeler oluşabilir.
- **Tetikleyici / kontrol:** Aralık/kapsam artışı, hosted worker'a geçiş veya 403/429 görülmesi. Ortak istek bütçesi, yanıt başlıklarına göre geri çekilme, merkezi worker (ziyaretçi başına crawl yok), başarı/hata oranı ve limit alarmı test edilmeden ölçek büyütülmez.

## GH-04 · trend sinyalinin yanlış yorumlanması — açık

- **Gözlem:** Repo Trending sırası GitHub içi görünürlüktür; geliştirici sayfasındaki “popular repo” yalnız bahsedilmedir. İkisi de AI ile geliştirilme, çalışan demo, övgü veya küresel popülerlik kanıtı değildir.
- **Etki:** Kanıtın üstünde iddia üretmek Radar'ın güvenini zedeler.
- **Bugünkü önlem:** Ayrı `github_trending_daily` / `github_trending_developer` kanıtları, kanonik URL eşleme ve kart için ek site/açıklama koşulu. Geliştirme aracı iddiası ayrıca kaynak gerektirir.
- **Tetikleyici / kontrol:** Kart metni, sıralama veya otomatik özet bu sinyali “AI ile yapılmış” ya da “dünyada trend” diye yazarsa ilgili iddia yayına girmeden engellenir; [değerlendirme kuralları](EVALUATION.md) ve regresyon kontrolü güncellenir.

## NEWS-01 · RSS açıklaması, bağlantı kapsamı ve yeniden kullanım — açık

- **Gözlem (6 Ekim):** Son 48 saatteki 45 haberin yalnız 16'sında RSS açıklaması vardı. Aynı yayıncı host'undan sınırlı makale üstverisi okunduktan sonra 44'ünde kısa açıklama ve yazar adı var. Bu üstveri, haberin tamamının incelendiği veya özgün Türkçe özet üretildiği anlamına gelmez. İlk örneklemde Hugging Face Blog, TechCrunch AI ve The Rundown akışlarının 34 güncel haberinde açık dış RSS bağlantısı yoktu; tam yazıda proje bulunmadığı çıkarılamaz.
- **Belirsizlik / etki:** RSS ve makale üstverisinin yeniden gösterim hakkı yayıncıya göre değişebilir; yazar üstverisi kurum adı olabilir. Sınırlı HTML okumak bile ek istek ve kırılgan ayrıştırma getirir. RSS bağlantısı yokluğunu “yazıda proje yok” diye yorumlamak yanlış negatif üretir.
- **Bugünkü önlem:** En çok 420 karakterlik açıklama yayıncı adı ve RSS/üstveri kökeniyle verilir; tam metin saklanmaz. Makale okuması en yeni 12 kayıtla, aynı host ve 500 KB HTML başlangıcıyla sınırlıdır; kaynak hata verirse iddia üretilmez. Ürün bağlantıları yalnız açık RSS URL'sinden alınır ve onaya dönüşmez. RSS'te bulunmayan bahsetmeler için kullanıcıya sınırlılık söylenir.
- **Tetikleyici / kontrol / karar:** Public/hosted sunum veya daha derin makale taraması öncesi [R15](https://github.com/alphanAkbulut/ai-build-radar/issues/15) ile yayıncı bazında üstveri erişimi ve gösterim koşulları incelenir; [R16](https://github.com/alphanAkbulut/ai-build-radar/issues/16) ile gerçek yazılardan yanlış pozitif/negatif örneklemi çıkarılır. Her kaynak için **kısa açıklamayla devam et / yalnız başlık göster / erişimi kapat** kararı tarihli kaydedilir.

## OPS-01 · Kaynak listesi değişirken eski worker'ın çalışması — açık

- **Gözlem (6 Ekim):** Worker 5 Ekim 14:37'de başlatılmış, haber kaynakları daha sonra eklenmişti. Heartbeat ve başka kaynakların koşuları güncel görünürken 10 haber RSS kaynağının son başarılı koşusu 6 Ekim 01:20'de kalmıştı. Kontrollü yeniden başlatma ve gerçek ağ erişimiyle bir defalık tarama 10/10 kaynağı başarıyla kontrol edip iki yeni haber ekledi.
- **Belirsizlik / etki:** Her kaynak/adapter değişikliğinde yeniden başlatma unutulabilir. Genel “son tarama” göstergesi, haber akışının güncelliğine dair yanlış güven verebilir. Yerel Mac kapalıysa veya ağ erişimi yoksa üç saatlik plan fiilen işlemez.
- **Bugünkü önlem:** `/news` haber tarama planını ve yalnız haber kaynaklarının son başarılı kontrolünü gösterir; `/sources` kaynak bazında başarı/hata zamanlarını tutar. README ve mimari, tek worker'ı kontrollü yeniden başlatma gereğini kaydeder. Bu bir otomatik süreç denetimi veya alarm değildir.
- **Tetikleyici / kontrol / karar:** Kaynak registry'si değiştiğinde, üç saatten uzun haber gecikmesinde veya hosted worker'a geçerken [R12](https://github.com/alphanAkbulut/ai-build-radar/issues/12) kapsamında kaynak sürümü–worker sürümü uyumu, eski/yeniden başlayan süreç için tek-worker koruması ve gecikme alarmı test edilecek. Bu kabul kanıtı oluşana kadar operasyonel risk açık kalır.
