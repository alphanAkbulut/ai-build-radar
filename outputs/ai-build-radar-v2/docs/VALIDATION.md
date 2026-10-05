# Phase 1 doğrulama raporu

**Tarihsel ölçüm:** 2026-10-04T17:04:38.263138+00:00 (UTC). [English](VALIDATION.en.md). Bu rapor sabit bir ilk faz anlık görüntüsüdür; bugünkü kaynak sayısını veya test durumunu anlatmaz. Güncel işleyiş için [mimari hafıza](ARCHITECTURE.md), gerçek tarama için `/sources` esas alınır.

## Gerçek kaynak verisi

| Ölçüm | Sonuç |
|---|---:|
| Build Entity | 171 |
| Tüm evidence gözlemleri, geçmiş dahil | 1390 |
| Güncel evidence gözlemleri | 1045 |
| Açık AI tool beyanı bulunan build | 10 |
| AI tool bilgisi Unknown olan build | 161 |
| Entity resolution review | 0 |

İlk kabul: 40 GitHub, 11 HN ve 120 One’s Vibe kaydı. Kaynaklar arası doğal duplicate ilk örneklemde yoktu. Bu yüzden gerçek hayattaki entity-resolution precision/recall ölçülmüş değildir.

GitHub’daki aynı 40 gerçek payload çevrimdışı tekrar işlendi: **40 match, 40 unchanged, 0 new entity, 0 new evidence**. İlgili koşu scope’u offline re-extraction olarak saklanır; source polling aralığını değiştirmez.

HN ilk koşusunda bir transient fetch hatası görüldü: koşu `partial` olarak korundu. Tekrar kontrolde `completed` elde edildi. Üç etkin kaynağın da başarılı koşusu var. Kaynak hata geçmişi silinmedi. Toplam matched yüzdesi tekrar işlem koşularını içerir; discovery precision değildir.

## Kanıt kalitesi bulgusu ve düzeltme

İlk regex, “checks for apps built with Lovable” metnini projenin kendi geliştirme aracı gibi etiketledi. Bu false positive elle örnek incelemede bulundu. `deterministic-v2` sadece cümle/yan cümle başındaki açık proje beyanlarını kabul ediyor; başkasının uygulamasını tarif eden kalıbı ve “not built with” ifadesini reddediyor. İlk 13 araç ataması konservatif olarak 10’a indi. Eski iddialar geçmişte saklandı, güncel görünüm v2’yi kullanıyor. Daha düşük recall pahasına belirsiz beyanlar Unknown kaldı; genel doğruluk yüzdesi iddia edilmiyor.

## Çalıştırılmış otomatik kontroller

- **12 test geçti:** URL normalizasyonu, identity-bearing query koruma, yinelenen kayıt idempotency, cross-source provenance, aynı isimli farklı ürünlerin ayrılması, homepage repo çatışması, belirsiz bridge, değişen/kaldırılan iddia geçmişi, AI tool Unknown ayrımı, tüm tarama aralıkları, üçüncü taraf/negatif beyan regresyonu, A→B→A içerik dönüşü; PostgreSQL migration/RLS/atomic import senaryosu bu 12 testin bir parçasıdır.
- PostgreSQL motoru testi PGlite üzerinde çalıştı. Migration uygulandı; anon denied, yetkisiz authenticated için 0 satır, allowlisted authenticated için okuma, authenticated write/RPC denied, service-role import, idempotent import, immutable evidence ve collision rollback doğrulandı. Supabase `auth.uid()`/rolleri test fixture’ında simüle edildi.
- Next.js production build ve TypeScript kontrolü geçti. Today, Builds, Build Detail, Sources ve login rotaları üretildi.
- Dört private rota için çerezsiz HTTP isteği 307 `/login` dönüşü verdi. Yerel parola/oturum sırrı `.next/static` dosyalarında bulunmadı.

## Tarayıcıda çalıştırılmış akışlar

- Geçerli parola → Today; yanlış parola → görünür hata; çıkış → login.
- Builds: GitHub + Builder-stated filtresi → 10 sonuç.
- Arama: bulunmayan sorgu → “Eşleşen build yok”.
- Build detayı: Colorbee → Builder-stated Claude Code, Model Unknown; kaynak izi açılarak kayıt ID/locator/hash/extractor doğrulandı.
- Sources: 3 etkin/12 kayıtlı kaynak, gerçek son/sonraki zamanlar ve çalışan yerel worker göstergesi.
- “Zamanı gelenleri tara”: due kaynak yokken açık sonuç mesajı, ek tarama yok.
- Mobil breakpoint kontrolünde belge genişliği viewport genişliğiyle aynıydı; ana içerikte yatay taşma görülmedi. Masaüstü ve dar ekran görünümü görsel olarak incelendi.

## Açık sınırlar

- Gerçek Supabase Auth, PostgREST ve hosted session yenileme testi yapılmadı; hesap/proje yok ve kullanıcı yerel PoC’yi seçti.
- Public deploy, ücretli API bağlantısı, hesap açma veya harici yazma yapılmadı.
- Worker yalnızca yerel süreç çalışırken ve Mac uyanıkken devam eder; işletim sistemi açılış servisi kurulmadı.
- X/Reddit/Product Hunt/YouTube/diğer registry kaynaklarının collector’ları henüz etkin değil.
- İnsan etiketli temsilî benchmark olmadan precision/recall veya tüm internet coverage iddiası yok.
- Ürünlerin gerçekten çalışması ve AI kullanımı bağımsız şekilde yürütülerek doğrulanmadı; belirtilen kanıt kapsamı dışına taşılmadı.

Detay sayımları: `quality-snapshot.json`. Tasarım ve yöntem: `MODEL.md`.
