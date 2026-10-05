# Öğrenme koleksiyonu — tarihsel pilot kaydı

**Belge türü:** 4–5 Ekim 2026 pilotunun geçmişi. Güncel yayın kuralı [SELECTION.md](SELECTION.md), ürün değerlendirmesi [EVALUATION.md](EVALUATION.md), ekran akışları [ARCHITECTURE.md](ARCHITECTURE.md) içindedir. [English](LEARNING-COLLECTION.en.md). Buradaki eski sayılar güncel seçki veya canlı demo sağlığı değildir.

## Pilotun evrimi

İlk iki örnek Motion Pad ve Metaballs'tı; yerel tarayıcı gözlemi ve gerçek ekran görüntüsüyle hazırlanmıştı. Bunlar daha sonra başka kaynaklı örneklerle genişletildi. 5 Ekim'deki 21 kayıtlı ara sürümde 19 açık kaynak projenin README/GitHub metaverisi incelendi; yıldız/fork değerleri ölçüm anına aitti, puan veya büyüme hızı değildi. O tarihte README incelemesi yapılan kayıtların çoğunda canlı ürün etkileşimi denenmemişti. Bazı kaynak bağlantıları ve önerilen egzersizler eklendi; bunlar tam kurs veya geliştiricinin özgün prompt/stack bilgisi sayılmadı.

Daha sonra kayıt sayısı 23'e çıktı ve `lib/selection.ts` beş ayrı giriş kontrolünü uygulamaya başladı. 5 Ekim kodundan hesaplanan anlık sonuç **5 seçilmiş / 18 inceleme arşivi** idi; sayılar değişebilir. Ana sayfanın varsayılan sekmesi **Gündem**dir; **Bundan öğren** ayrı sekmedir. `/candidates` son 24 saat listesi değildir: seçkiyi geçmeyen keşifler için sınırlı bir inceleme görünümüdür. `/builds` tekilleştirilmiş tam arşivdir. Otomatik ingestion bir adayı derse yükseltmez.

İlk pilotta ders sayfasında kullanıcı puanı ve ek kaynak önerisi formları denenmişti. 5 Ekim güncellemesinde bu formlar ziyaretçi arayüzünden kaldırıldı. `app/(private)/learn/actions.ts` içinde eski, oturum gerektiren kayıt yolu ve private inbox verisi kalmış olabilir; bunlar etkin kullanıcı akışı veya otomatik kaynak doğrulaması değildir. Eski test sonuçları kendi tarihindeki davranışı kanıtlar, bugünkü ekranı değil.

## Bugün korunması gereken ayrımlar

- Demo gözlemi, README okuması, geliştirici beyanı ve Radar yorumu ayrı kaynak statüleridir.
- Önizleme statik görüntüdür; canlı site veya animasyon kanıtı değildir.
- AI kullanan ürünün AI ile geliştirildiği sonucu çıkarılamaz. Motion Pad/Metaballs hakkında geliştirici beyanı vardır; seçki dışına düşmüş olmaları beyanı geçersiz kılmaz.
- Radar'ın uyarlama önerisi orijinal kod veya üretim yöntemi diye gösterilmez. `Projeme uyarla` ayrıca yeniden üretim kontrolüne bağlıdır.
- Video bağlantısı izlenmiş bölüm veya kullanıcı övgüsü sayılmaz. YouTube transkript/yorum analizi bağlı değildir.

Bu geçmişi yeniden üretmek için dönemin commit ve içerik kayıtları gerekir. Güncel durum için kodla birlikte `/sources`, ana sayfa ve seçki kontrolü okunmalıdır.
