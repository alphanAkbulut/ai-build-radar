# Öğrenme koleksiyonu — önceki pilot notları

Bu belge ilk pilotun tarihsel kaydıdır. Güncel yayın koşulları, gündem/öğrenme ayrımı ve doğrulanmış sınırlar için [EVALUATION.md](EVALUATION.md) esas alınır. 5 Ekim güncellemesinde ziyaretçiden puan veya kaynak isteme formları ders sayfasından kaldırıldı; önceki private kayıtlar korunuyor. Seçkide beş gerçek demo incelemesi ve bunların canlı ekran görüntüleri bulunuyor.

Ana sayfa editoryal koleksiyondur. /candidates son 24 saatte bulunan adaylar; /builds tüm arşivdir. Ingestion hiçbir adayı otomatik öğrenme incelemesine dönüştürmez. Eski v1 korunur.

İlk iki pilot Motion Pad ve Metaballs: mevcut tarayıcı gözlemleri ve gerçek ekran görüntüleriyle oluşturuldu. AI geliştirme statüleri Unknown. Tam kurs, doğrulanmış özgün stack veya topluluk tarafından beğenilmiş ürün iddiası yoktur. Uygulama reçeteleri öneridir, ayrı bir projede uçtan uca uygulanıp doğrulanmadı.

## Editoryal kabul kontrolü
- Gösterilebilir deneyim ve zaman damgalı gözlem.
- Belirli bir öğrenme hedefi ve somut etkileşim.
- Gözlem, yorum, geliştirici beyanı, çıkarım ayrımı.
- Kaynak bağlantısı ve bilinmeyenler.
- Uyarlama adımları ve kabul kontrolleri.
- Kullanıcı değerlendirmesiyle yeniden inceleme.

Statüler: aday → ön inceleme → derin inceleme → pilot → gözden geçirilmiş öğrenme içeriği. Bu sürümde geçişler otomatik değil; lessons.ts editoryal kaydıyla yönetilir. İlk iki kayıt pilot düzeyindedir.

## Kaynak ve geri bildirim
Ders sayfasında YouTube/geliştirici/doküman/kullanıcı incelemesi/kod önerisi alınır. URL, ilgili saniye, ilişki (bağımsız/geliştirici/sponsorlu/bilinmiyor), not ve kayıt zamanı saklanır. Kaynaklar pending-review durumuyla learning-data/inbox altında, oturum gerektiren Server Action ile yazılır. Her öneri ayrı dosyadır; ingestion verisini değiştirmez. Form gönderimi sonrası kuyruk yenilenir.

YouTube arama, transkript indirme ve otomatik video analizi henüz bağlı değildir. Video bağlantısı tek başına içeriğin izlendiğini, görsel davranışın doğrulandığını veya lisans iznini kanıtlamaz. İleride onaylanan bölüm için başlık, yayın tarihi, kontrol zamanı, alıntı sınırı ve özellik bağlantısı korunmalı.

Promptlar kullanıcının proje bağlamı ile oluşturulur ve kopyalanır. Orijinal prompt/stack gibi sunulmaz. Kaynak kod lisansı bilinmiyorsa davranıştan özgün uygulama istenir.

## Doğrulama
Production build ve learning.test.ts geçti. Tarayıcıda dersin açılması, prompt kopyalama, değerlendirme kaydı ve kuyruğun güncellenmesi doğrulandı. Yalnızca test için oluşturulan işaretli geri bildirim kaydı test sonrası kaldırıldı.

## 5 Ekim 2026 — 21 örneklik başlangıç koleksiyonu

2 önceki canlı demo gözlemine, 19 uluslararası açık kaynak proje için README ve GitHub API incelemesi eklendi. Kaynak anlık görüntüleri `work/research/`, kullanıcıya gösterilen kaynaklar ve ölçümler `content/researched-lessons.json` içindedir. GitHub yıldız/fork değerleri ölçüm tarihiyle gösterilir; rating, trend hızı veya kalite puanı değildir. Flowise arşivli olduğu için seçkiye alınmadı.

Karpathy'nin LLM Council, Autoresearch ve nanochat projeleri yazar ilişkisiyle etiketlendi; başka ürünlere onay verdiği iddia edilmez. LLM Council README'sindeki vibe coding beyanı Builder-stated olarak işaretlendi. Diğer 20 örnekte AI geliştirme yöntemi Unknown. AI özelliği ile AI tarafından geliştirilme ayrı kavramlardır.

Her yeni örnek için özgün uygulama egzersizi, önerilen araçlar ve kabul kontrolleri var. Bunlar uygulanıp doğrulanmış tam kurslar değildir. 19 yeni projenin canlı kullanım testi yapılmadı. Repo görselleri güncel ekran görüntüsü olarak etiketlenmez. AnythingLLM YouTube bağlantısı ve JSON Crack HN tartışması kaynak olarak eklenmiştir; video içeriği ve yorum analizi henüz yapılmadı. Kaynak incelemeleri otomatik tarama robotunun güncelleme tarihinden bağımsız anlık görüntülerdir.

Ana sayfa varsayılan olarak tüm 21 örneği gösterir. AI durumu, öğrenme alanı ve metin araması ile daraltılabilir. Kaynak ve geri bildirim formları koleksiyondaki tüm slug'ları kabul eder, bilinmeyen slug'ları reddeder.
