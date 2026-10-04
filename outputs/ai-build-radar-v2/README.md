# AI Build Radar v2 — keşif arayüzü

Yerel adres: http://127.0.0.1:3101. `Start-Radar.command` ile açılır. Önceki sürüm 3100 portunda korunur.

Bu sürüm `.env.local` içindeki RADAR_DATA_DIR ile v1’in gerçek verilerini okur. Ayrı worker başlatmaz; güncellemeler v1 worker çalıştığı sürece gelir.

- Kart görseli, başlığı ve Siteyi aç doğrudan kaynakta bulunan siteye gider. Kod ve Detay ayrı bağlantılardır.
- Varsayılan görünüm site adresi olan projeler; sitesiz kayıtlar ayrı sekmede korunur.
- Sekiz keşif kategorisi açıklama kuralları ve kaynak kategorilerinden türetilir. Kesin sınıflandırma değildir; orijinal veri korunur.
- İlk dört önizleme gerçek tarayıcı ekran görüntüsüdür. Fieldbook görüntüsü uygulamanın kendi örnek demosudur. `previews/manifest.json` kaynak ve çekim zamanını tutar. Henüz otomatik görüntü yenileme yoktur.
- Önizlemeler oturum gerektiren rota üzerinden sunulur. Diğer projeler açıkça önizlemesiz gösterilir.
- Today ve Builds en üstte iki AI grubuna ayrılır. Varsayılan AI ile geliştirilenler: ai_tools kanıtı Verified veya Builder-stated. Derived ve Unknown, AI kullanımı belirsiz grubundadır. Genel repo Verified statüsü AI grubuna kabul sağlamaz. Konu ve site filtreleri seçilen grup içinde uygulanır; grup değişimi kanıt filtresini temizler. Trend/hit sıralaması henüz uygulanmadı.
- 18 test ve production build geçti. Aşağıdaki bölüm önceki altyapı kurulum notlarıdır; bu sürümün portu 3101’dir.

---

# AI Build Radar — Phase 1 private PoC

Gerçek kaynak verisini build kimliklerine dönüştüren, her iddiayı kendi kanıtıyla gösteren yerel çalışma alanı. **Public değildir. Supabase projesi henüz bağlanmadı.**

## Açılış

- Adres: http://127.0.0.1:3100
- Yerel parola: aynı klasördeki **LOCAL-ACCESS.txt**. Parola veya `.env.local` dosyasını paylaşmayın.
- Uygulama durmuşsa **Start-Radar.command** dosyasını çalıştırın. Arayüz ve zamanlayıcı terminal açık kaldığı sürece çalışır; Ctrl+C ile durur.
- Mac uyurken/kapalıyken tarama yapılmaz. Yeniden başlayınca zamanı geçmiş etkin kaynaklar bir kez taranır; kaçırılmış tüm aralıklar topluca tekrarlanmaz.

## Ekranlar

**Today:** son 24 saatte sistemde ilk kez görülen projeler, iddia durumları, kaynak kapsamı. İlk görülme tarihi ürünün lansman tarihi değildir.

**Builds:** metin, kaynak ve AI geliştirme kanıtı filtresi; 30 kayıtlık sayfalama. Filtrelenmiş adres paylaşılabilir, fakat giriş yine gerekir.

**Build Detail:** açıklama, kaynak linkleri, model/araç belirsizlikleri, güncel kanıtlar, kaynak alıntısı, JSON alan konumu, SHA-256, çıkarım sürümü ve korunan geçmiş. Harici proje linkleri ziyaret edildiğinde üçüncü taraf site açılır; PoC bu projelerin kodunu çalıştırmaz.

**Sources:** 12 kayıtlı kaynak grubu, 3 etkin collector, belirtilen son tarama aralıkları, başarı/eksik/başarısız durumlar, sonraki tarama, koşu kapsamı ve kalite sayımları. “Zamanı gelenleri tara” aralıkları atlamaz.

## Kaynak aralıkları

| Kaynak | Aralık | Yaklaşık/gün | Phase 1 |
|---|---:|---:|---|
| Hacker News | 15 dk | 96 | Etkin |
| GitHub | 45 dk | 32 | Etkin |
| Watched builders / experts | 45 dk | 32 | Watchlist bekliyor |
| X | 60–90 dk; yapılandırmada 75 dk | 16–24 | API erişimi bekliyor |
| Reddit | 90 dk | 16 | Pasif |
| Product Hunt | 3 saat | 8 | Pasif |
| Directories / One’s Vibe | 6 saat | 4 | One’s Vibe etkin |
| Tool communities | 6 saat | 4 | Pasif |
| YouTube | 9 saat | 2,7 | Pasif |
| Official ecosystems | 3 saat | 8 | Pasif |
| Low-change directories | 18 saat | 1,3 | Pasif |
| Static docs | Günlük | 1 | Pasif |

Bu değerler kullanıcının verdiği **nihai aralıklardır**; tekrar 1,5 ile çarpılmaz. Pasif kaynaklarda tarama varmış gibi gösterilmez. Hata ve sağlayıcı bekleme sınırları normal aralığı uzatabilir. Aralıklar başarılı koşunun bitişinden itibaren hesaplanır.

## Gerçek veri kapsamı

- GitHub: iki watched repository search, her birinden güncellenme zamanına göre 20 kayıt. Sayfalama/genel internet kapsaması yoktur. GitHub token isteğe bağlıdır; token yoksa public API limitleri uygulanır.
- HN: resmi API üzerinden en yeni 80 Show HN kaydı; AI geliştirme anahtar sözcükleriyle aday seçimi. Bu anahtar sözcük tek başına AI ile geliştirildiğinin kanıtı sayılmaz. Gönderi yazarı ürün sahibi kabul edilmez.
- One’s Vibe: CC0 JSON kataloğu indirilir, şema kontrol edilir, kaynak yayın zamanına göre en yeni 120 kayıt seçilir. Üçüncü taraf stack tespiti **Derived** kalır. Dataset yayın tarihi ürün lansmanı olarak kullanılmaz.
- Kalıcı yerel veri: `data/radar.json`. Atomik dosya değiştirme ve tek yazarlı kilit kullanılır. Bu klasör web’in statik dosya alanında değildir.
- Kaynakta alıntılanan pazarlama ifadeleri ürün onayı değildir. Tüm metin React tarafından escape edilir. Arbitrary URL fetching veya proje kodu çalıştırma yoktur.

Kaynaklar: [HN resmi API](https://github.com/HackerNews/API), [GitHub search API](https://docs.github.com/en/rest/search/search), [One’s Vibe CC0 dataset](https://github.com/JefferyLee/awesome-vibe-coded-apps).

## Geliştirme ve tekrar üretim

Node.js 22+ ve pnpm gerekir. Bu bilgisayardaki başlatıcı, PATH içinde bulunmazsa Codex’in kurulu Node/pnpm paketini kullanır.

```sh
pnpm install --frozen-lockfile
pnpm ingest                    # yalnızca zamanı gelen etkin kaynaklar
pnpm worker                    # her 30 saniyede due kontrolü
pnpm build
pnpm start                     # 127.0.0.1:3100; dış ağda dinlemez
pnpm dev                       # yerel geliştirme, aynı port
pnpm test
pnpm typecheck
pnpm schema:export
pnpm reprocess                 # en son kaydedilmiş GitHub verisini çevrimdışı yeniden çıkarır
```

`ingest --force --source=hn` yalnızca bilinçli teşhis/yeniden üretim içindir; normal worker ve UI force kullanmaz. `RADAR_DATA_DIR` ile testler için ayrı veri yolu seçilebilir. Koşu başarısız/eksikse ingestion komutu sıfırdan farklı çıkış kodu verir.

`.env.local` yoksa `.env.example` alanlarını yerel dosyaya kopyalayın; `RADAR_LOCAL_PASSWORD` ve `RADAR_SESSION_SECRET` için iki ayrı uzun rastgele değer üretin. Ayar yoksa giriş fail-closed davranır. Test verileri yalnızca test içinde tutulur; dashboard’a sahte kayıt eklenmez.

Kilit bir çökme sonrası kalırsa `data/.ingest-lock/owner.json` içindeki sürecin gerçekten durduğunu doğrulayın. Yalnızca bundan sonra kilit klasörünü kaldırın; `radar.json` silinmez. Eşzamanlı birden fazla worker çalıştırmak desteklenmez.

## Supabase’e hazırlanan yol

`supabase/migrations/001_radar.sql`: relational foreign key’ler, unique alias’lar, iddia durum sınırları, append-only importer davranışı, üyelik tablosu, tüm veri tablolarında RLS ve service-role-only transaction importer.

Hosted bağlantı için daha sonra:

1. Yeni private Supabase projesinde migration uygulanır; public signup kapatılır.
2. Gerçek kullanıcı Supabase Auth’da oluşturulur. Kullanıcı UUID’si `private_members` tablosuna yetkili yönetici tarafından eklenir. Kullanıcıların kendilerini allowlist’e ekleme yetkisi yoktur.
3. `.env.local`: `RADAR_AUTH_MODE=supabase`, URL, anon key, `RADAR_ALLOWED_EMAILS` ayarlanır. Service role yalnızca worker ortamında kalır; UI JWT + RLS kullanır.
4. `pnpm sync:supabase` yerel snapshot’ı tek transaction’da aktarır ve build sayısını tekrar okur. Alias/FK hatasında işlem geri alınır.
5. Gerçek Supabase üzerinde sign-in, token yenileme, üyelik iptali ve anon/member RLS testleri yapılır. Ardından hosting/24 saat worker kurulumuna ayrı karar verilir.

**Bu adımlar henüz dış sistemde uygulanmadı.** Yerel PostgreSQL motorunda migration/RLS/importer testleri, gerçek Supabase Auth ve PostgREST entegrasyon testlerinin yerine geçmez. Hosted mode iskeleti hazırdır; oturum yenileme için production proxy/session-refresh katmanı ve dağıtık rate limiting sonraki hosted kurulum doğrulamasına dahildir.

## Kapsam sınırları

İlk sürüm: deterministic aday keşfi, konservatif URL eşleştirme, provenance, durumlar ve kalite gözlemi. Henüz global tarama, LLM enrichment, bağımsız canlı uygulama doğrulaması, insan onaylı precision/recall ölçümü, review queue çözümleme arayüzü, eski bütün entity’lerin periyodik tam refresh’i veya public yayın yoktur. Unknown oranı sistemin bildiği sınırı gösterir; otomatik olarak bir kalite başarısızlığı değildir.

Tasarım: açık zemin, ink `#101414`, signal orange `#ED522C`, verification green `#177657`. Model, araç, ürünün AI özelliği ve AI ile geliştirilmiş olması ayrı kavramlardır.

Ayrıntılar: [Veri ve evidence modeli](docs/MODEL.md), [Doğrulama raporu](docs/VALIDATION.md).

## Görsel keşif güncellemesi

Önizlemesiz kayıtlar büyük placeholder kartlar yerine kompakt “Görsel keşfe hazırlanacaklar” listesinde gösterilir. Dört gerçek ekran görüntüsü korunur; çekim zamanı saat bilgisiyle görünür. Metaballs ve Motion Pad için kullanıcı düğmeye bastığında açılan sandbox iframe demosu eklendi ve tarayıcıda açılma/kapatılma kontrol edildi. Video kaydı veya otomatik ekran görüntüsü üretimi henüz yoktur. Dış site canlı olarak yüklenir; erişilemezse ayrı sekme bağlantısı kullanılabilir.

Worker durumu 4 Ekim 2026 23:26 İstanbul saatinde ilerleyen heartbeat ve son başarılı taramalarla doğrulandı. Yerel worker bilgisayarın uyanık kalmasına, ağ bağlantısına ve sürecin açık olmasına bağlıdır. Açık ekran kendiliğinden yenilenmez; yeni veriyi sayfayı yenileyerek görürsünüz. Today ilk görülme zamanına göre son 24 saattir, ürün lansman tarihi değildir. Önizlemeler önce, ardından en yeni firstSeenAt; trend sıralaması değildir.
