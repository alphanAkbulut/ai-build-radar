# Veri sözleşmesi ve yöntem

Bu belge 5 Ekim 2026 itibarıyla uygulanmış **yerel PoC** davranışını anlatır; hosted production sistem iddiası değildir. Makine tarafından doğrulanan sözleşmeler `lib/schema.ts` ve `schemas/*.schema.json` içindedir. Anlık kaynak/koşu sayıları için `/sources` esas alınır. [English](MODEL.en.md).

## İlişkiler

```
Source registry → Source record (immutable payload + SHA-256)
                         ↓
                    Candidate
                         ↓ normalized exact URL / explicit repo homepage
                    Build Entity ← unique aliases
                         ↓
                    Evidence Objects (immutable observations)

Ingestion Run → counts, errors, scope, status
Ambiguous match → Resolution Review (not auto-merged)
Daily Snapshot → UTC day / source count / evidence count
```

## Build Entity

| Alan | İş anlamı |
|---|---|
| `id` | İlk canonical URL’den üretilen kararlı kimlik |
| `name`, `description`, `category`, `creator` | İlk kaynak öncelikli gösterim; aynı kaynak güncellenirse yenilenir, metadata kanıt geçmişi korunur |
| `canonicalUrl`, `aliases` | Tam URL kimliği ve kaynakta açıkça belirtilen diğer adresler |
| `firstSeenAt` | Radar’a ilk kabul |
| `lastSeenAt`, `updatedAt` | Son yerel işleme ve yeni kanıt sürümü zamanı |
| `firstPublicRelease` | Gerçek yayın kanıtı yoksa null; repo oluşturma/directory yayın tarihi kullanılmaz |
| `sourceIds` | Kaydın gözlendiği kaynaklar |
| `reviewRequired`, `reviewReasons` | Belirsiz kimlik eşleşmesi |

AI tool, model, AI role, stack, capability gibi alanlar canonical entity’de kanıtsız string’ler olarak çoğaltılmaz. `Evidence Object.field` üzerinden tutulur ve görünüm üretir. Collector’lar kaynak türüne göre `ai_tools`, `tech_stack`, `primary_language`, `repository`, `github_stars`, `hn_mention`, `discovery_reason`, `catalog_membership`, `community_discussion`, `editorial_reference`, `platform_trending`, `platform_rank`, `github_trending_daily`, `github_trending_developer` ve metadata alanlarını üretebilir. Bir platform sırası veya yıldız sayısı AI ile geliştirme kanıtı değildir. `models`, `ai_roles`, `capabilities` için alan kanıtı üreten collector henüz yoktur; model bilinmiyorsa UI Unknown gösterir.

## Evidence Object

| Alan | Açıklama |
|---|---|
| `id`, `buildId` | İddia kimliği ve ilgili build |
| `sourceId`, `sourceRecordId` | Kaynak grubu ve kaynak içindeki kalıcı kayıt kimliği |
| `field`, `value` | İddianın tam konusu ve değeri |
| `status` | Verified / Builder-stated / Derived / Unknown |
| `sourceUrl`, `quote`, `locator` | Açılabilir kaynak, kanıt parçası ve JSON alanı/kayıt konumu |
| `observedAt` | Çıkarımın Radar’da işlendiği zaman; çevrimdışı reprocess yeni gözlem sürümü üretir |
| `publishedAt` | Varsa kaynak kaydının yayın zamanı; ürün lansmanı değildir |
| `rawId`, `contentHash` | Saklanan kaynak payload’ına referans ve SHA-256 |
| `extractorVersion`, `supersedes` | Çıkarım kural sürümü ve önceki ilgili gözlem |
| `rationale`, `strength` | Neden bu durumun atandığı ve yöntemsel kaynak ağırlığı; olasılık/kalibre edilmiş güven skoru değildir |

Kaynağın gerçekten çekildiği zaman `SourceRecord.fetchedAt` alanındadır ve detayda ayrıca görünür. Snapshot hash’i `JSON.stringify(payload)` üzerinden hesaplanır; HTTP ham byte hash’i veya timestamp imzası değildir. Ham veri kaydedilmiş özgün JSON nesnesidir. Mutable kaynak URL’si değişse de yerel payload kalır.

**Verified:** doğrudan kaynağın gösterdiği sınırlı olgu. Örnek: GitHub API’nin repo URL’si veya yıldız sayısı. Bu, projenin doğru çalıştığı veya AI ile geliştirildiği anlamına gelmez. Dil, GitHub’ın raporladığı dil olarak doğrulanır; framework kanıtı değildir.

**Builder-stated:** repo sahibinin metadata’sındaki kendi projesine ilişkin açık beyan. Cümle/yan cümle başındaki “Built with Claude Code” gibi sınırlı kalıplar. “Apps built with Lovable için checklist” gibi üçüncü taraf cümlesi araç kanıtı sayılmaz. Beyanın doğruluğu bağımsız olarak yeniden üretilmemiştir. Bir araçla uyumlu çalışmak, o araçla geliştirilmiş olmak değildir.

**Derived:** directory sınıflandırması, curator fingerprint’i veya seçim gerekçesi. Kaynak ağırlığı görünür nedenin yerine geçmez. One’s Vibe’ın kendi liveness iddiası Radar’ın canlılık doğrulaması gibi sunulmaz.

**Unknown:** ilgili alan için yeterli kanıt yok. Bir “bilinmiyor” kaydı üretmek için sahte source URL/quote uydurulmaz; kanıt yokluğu görünümde Unknown olarak hesaplanır. Status enum’u ileride gerekçeli unknown tespitlerini de destekler.

## Entity resolution ve sürümler

- HTTP/HTTPS dışında URL kabul edilmez; username/password içeren URL reddedilir.
- Fragment ve belirli takip parametreleri kaldırılır; kimlik taşıyan query parametreleri ve normal path harf büyüklüğü korunur.
- GitHub owner/repo harfleri normalize edilir ve `.git` kaldırılır. Issue/commit gibi alt URL’ler repo diye birleştirilmez.
- Sadece tam URL veya açık repo-homepage alias eşleşir; domain benzerliği, ürün ismi, fuzzy matching ve LLM tahmini kullanılmaz.
- Aynı homepage’i paylaşan farklı repolar ve iki entity’yi köprüleyen aday incelemeye ayrılır. Hiçbir entity sessizce silinmez.
- Aynı payload + aynı extractor tekrar gelirse entity/evidence çoğalmaz. Son görülme ilerler.
- Payload veya extractor değişirse yeni observation set eklenir. Kaynağın kaldırdığı iddia güncel görünümden düşer, geçmişte kalır. A→B→A içerik dönüşü de yeni sürüm olarak doğru görünür.
- Güncel görünüm her kaynak kaydının en yeni observation set’ini seçer. Farklı kaynakların iddiaları birlikte saklanır. Kaynaklar arası anlamsal çelişki çözümü insan incelemesine bırakılmıştır; otomatik truth arbitration yoktur.

## Tarama, hatalar ve güvenlik

Worker 30 saniyede bir registry’nin etkin ve zamanı gelen kaynaklarını kontrol eder. Bu **30 saniyede kaynak taraması** değildir. Her kaynak için son başarı/deneme/sonraki zaman saklanır. Önceki plandaki sıklıklar kullanıcı tarafından verilmiş son değerlerle değiştirildi.

Registry collector HTTP isteklerinde zaman aşımı 20 saniyedir. `lib/http.ts` yalnız açık izin listesindeki kaynak host’larına gider ve yönlendirmeyi izlemez; liste üç host’la sınırlı değildir. Public proje sayfası okuma ayrı `lib/public-page.ts` sınırından geçer: adresin halka açık IP’ye çözümlenmesi, bağlantıya sabitlenmesi ve her yönlendirmenin yeniden denetlenmesi gerekir. Sağlayıcı 429/403 geri dönüşündeki bekleme/reset sınırı ve exponential backoff sonraki kaynak denemesini geciktirir. Parse hataları `invalid`, bilinçli kapsam dışı kayıtlar `filtered`, kısmen alınan batch `partial`, kaynak başarısızlığı `failed` olarak ayrılır. Sayımlar örneklem kapsamıyla birlikte okunmalıdır.

Yerel mod: uzun rastgele parola, imzalı **180 günlük** HttpOnly/SameSite=Strict oturum çerezi, başarısız giriş sınırlaması ve private okuma/yazma yollarında yetki kontrolü kullanır. Masaüstü sunucusu `127.0.0.1:3101` üzerinde dinler; ayrı LAN başlatıcısı aynı Wi-Fi için `3102` portunu açabilir. Yerel HTTP oturumu internet yayını için uygun değildir. `robots.txt` ve noindex erişim kontrolü olarak kullanılmaz.

Supabase: authenticated olması tek başına yetmez; `private_members` UUID üyeliği RLS okuma koşuludur. Dashboard user JWT ile okur; client insert/update/delete yetkisi yoktur. Snapshot importer yalnızca service role için açıktır; transaction içindeki tüm referanslar ve alias’lar doğrulanır. DB sahibi/service role operasyonel olarak güçlü rollerdir; append-only garantisi importer’ın çalışma davranışıdır, DB yöneticisini engelleme iddiası değildir.

## Kalite ölçümünün sınırı

İlk otomatik ölçümler: source success/partial/failed, fetched/filtered/invalid/accepted, created/matched/unchanged, eklenen evidence ve resolution review. Match oranı gerçek doğruluk metriği değildir. İlk batch’te farklı kaynaklar arasında doğal overlap çıkmaması birleştirme algoritmasının precision/recall’ını kanıtlamaz; bu akış synthetic testlerle doğrulanmıştır.

Önerilen sonraki değerlendirme: her kaynaktan dengeli bir insan etiketli örneklem, “gerçek build mi / AI development beyanı var mı / araç ataması doğru mu / aynı entity mi” etiketleri. Precision/recall ancak bu ground truth üzerinden raporlanabilir. Mevcut veriye böyle bir doğruluk yüzdesi atanmamıştır.
