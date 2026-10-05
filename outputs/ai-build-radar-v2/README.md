# AI Build Radar

**Dil:** Türkçe · [English](README.en.md)

**Durum:** private, yerel MVP. Radar, AI alanındaki çalışan ürünleri keşfeder; haklarında gerçekten ne bilindiğini gösterir; seçilmiş örneklerden uygulanabilir dersler çıkarır. Bir ürünün AI kullanması, AI ile geliştirilmiş olması ve popüler olması ayrı iddialardır. Her biri ayrı kanıt ister.

Ürünün iki katmanı vardır: güncel ve kaynaklı **keşif/haber akışı** ile demosu incelenmiş az sayıdaki örnekten oluşan **öğrenme koleksiyonu**. Kaynakta bulunmak veya yüksek yıldız almak tek başına koleksiyona giriş sağlamaz.

## Belgeler

- [Ürün hafızası](docs/PRODUCT-STRATEGY.md) ([English](docs/PRODUCT-STRATEGY.en.md)): kim için, neden, ziyaretçi akışı, korunacak ayrımlar ve başarı tanımı. [Fazlı yol haritası](docs/ROADMAP.md) ([English](docs/ROADMAP.en.md)) iş sırasını ve kabul ölçütlerini; [karar kaydı](docs/DECISIONS.md) ([English](docs/DECISIONS.en.md)) tercihlerin gerekçesini tutar. Yaşayan 18 iş [private GitHub panosunda](https://github.com/users/alphanAkbulut/projects/2) ve depo Issues'da izlenir.
- [Mimari hafıza](docs/ARCHITECTURE.md) ([English](docs/ARCHITECTURE.en.md)): veri akışı, karar kuralları, her ekranın ve alanın görevi, listeleme, dosya sahipliği, mevcut sınırlar. Ürün mantığı için ana başvuru.
- Konu belgeleri (her biri Türkçe/İngilizce): [veri ve kanıt](docs/MODEL.md), [proje bağlamı](docs/PROJECT-CONTEXT.md), [değerlendirme](docs/EVALUATION.md), [seçki](docs/SELECTION.md), [insanlar ve fikirler](docs/PEOPLE.md), [özetler](docs/SUMMARIES.md), [analitik](docs/ANALYTICS.md), [mobil](docs/MOBILE.md). Her sayfadaki dil bağlantısı eş belgesine götürür.
- [AI ile geliştirilme iddiasının sınırları](docs/AI-DEVELOPMENT-EVIDENCE.md) ([English](docs/AI-DEVELOPMENT-EVIDENCE.en.md)): kod stili araştırması, üretici beyanı, agent commit izleri ve ürün düzeyi etiket arasındaki ayrım.
- [Öğrenme koleksiyonu pilotu](docs/LEARNING-COLLECTION.md) ve [ilk faz doğrulaması](docs/VALIDATION.md) tarihsel kayıtlardır; güncel sayı veya davranış raporu olarak kullanılmaz.
- [Günlük AI ürün promptu için kaynak denetimi](docs/SOURCE-EXPANSION.md) ([English](docs/SOURCE-EXPANSION.en.md)): doğrulanan kaynak adayları, erişim/lisans sınırları ve entegrasyon sırası. Mevcut veriden üretilen kısa okuma `/briefing` ekranındadır.
- [TrendRadar karşılaştırması](docs/TRENDRADAR-BENCHMARK.md) ([English](docs/TRENDRADAR-BENCHMARK.en.md)): gerçek çalışma durumu, kaynak bağımlılığı ve Radar'a uyarlanan sıra/kaynak görünürlüğü.
- [GitHub Trending kaynak denetimi](docs/GITHUB-TRENDING.md) ([English](docs/GITHUB-TRENDING.en.md)): repo/geliştirici sinyalleri, ilk gerçek koşu ve private PoC sınırları.
- [AGENTS.md](AGENTS.md) agent çalışma kurallarıdır; ürün mimarisinin yerine geçmez.

**Doküman güncelleme kuralı:** Her ürün/kod değişikliğinde etkilenen ekran ve iş kuralını [mimari hafızada](docs/ARCHITECTURE.md) ve ilgili Türkçe/İngilizce konu belgelerinde birlikte düzeltin. “Şu an” sayıları koddan doğrulayın; işleyen kaynak ve yeni kayıt sayıları için `/sources` koşu kaydına bakın. Eski ölçümü tarihli pilot belgesinde koruyun, bugünkü durum diye sunmayın. Kodun kendisi sözleşmenin uygulamasıdır; GitHub’a push canlı ingestion verisini veya yerel parolayı yedeklemez.

## Bugünkü sınır

| Alan | Mevcut durum |
| --- | --- |
| Kaynak | Yerel modda 26 kayıtlı satırdan 14 bağımsız keşif kaynağı, ayrıca 3 zenginleştirme işi etkin (GitHub Trending yalnız yerel modda açılır). Etkin olmak başarılı tarama demek değildir; son durum `/sources` ekranındadır. Public hedefi 25 **çalışan bağımsız keşif kaynağıdır**. |
| Veri | GitHub araması, Hacker News, One’s Vibe, Hugging Face Spaces, DEV Community, Lobsters ve sekiz kişi yayını üzerinden adaylar; ayrıca GitHub Trending repo/geliştirici listeleri aynı platformun ayrı sinyali olarak okunur. Bütün internet taranmıyor. |
| Seçki | Kaynaklı amaç, yakın zamanda denenmiş demo, gerçek önizleme, fark ve öğrenme adımları gerekir. Bu kapı otomatik “wow” değerlendirmesi yapmaz. |
| Erişim | Yerel parola ve oturumla private. Supabase şeması hazır; bağlı hosted proje/public dağıtım yok. |
| AI özet | Harici AI API’si bağlı değil. Hazır olmayan dilde özet üretilmiş gibi gösterilmez. |

## Yerelde çalıştırma

macOS’ta `Start-Radar.command` arayüzü `http://127.0.0.1:3101` adresinde açar. `Start-Radar-Mobile.command`, aynı Wi-Fi üzerindeki telefon için ayrı private LAN oturumu açar; Mac’in açık kalması gerekir. `.env.example` gerekli ayarları gösterir. Parola ve oturum sırrı `.env.local` içinde yerel kalır; depoya koymayın. Mevcut erişim parolasını bilgisayarındaki `LOCAL-ACCESS.txt` dosyasında bulabilirsin. Yerel giriş bu tarayıcıda 180 gün hatırlanır; çıkış yapmak veya tarayıcı çerezlerini silmek oturumu bitirir.

Node.js ve pnpm ile:

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm test
pnpm typecheck
pnpm build
```

`pnpm ingest` zamanı gelen etkin kaynakları bir defa işler. `pnpm worker` yaklaşık 30 saniyede bir kontrol eder. Mevcut yerel kurulum `RADAR_DATA_DIR` ile önceki sürümün verisini paylaşabilir; **aynı veri dizinine iki worker başlatmayın.** Başlatıcı ikinci worker açmaz. Bilgisayar uyurken veya worker durmuşken güncelleme olmaz. Son deneme, başarı, eklenen kayıt ve hatalar `/sources` ekranında görünür.

## Dizin haritası

| Yer | İçerik |
| --- | --- |
| `app/`, `components/` | Private Next.js ekranları ve etkileşimler |
| `lib/`, `scripts/` | Kaynaklar, toplama, kimlik, kanıt, değerlendirme ve worker |
| `content/` | Editoryal ders, inceleme, kişi ve referans kayıtları |
| `previews/`, `public/spotlights/` | Gerçek demo görüntüleri ve kayıtları |
| `data/` veya `RADAR_DATA_DIR` | Yerel canlı ingestion verisi; Git dışında |
| `learning-data/` | Kişi akışı önbelleği ve yerel analitik |
| `supabase/` | Hosted şema ve erişim kuralları hazırlığı |
| `docs/` | Ürün ve sistem kararları |

`snapshots/ingestion-initial.json` sabit başlangıç kopyasıdır, canlı yedek değildir. Repo özel tutulmalıdır. Harici projelerin kodu ve içerikleri kendi haklarına tabidir.
