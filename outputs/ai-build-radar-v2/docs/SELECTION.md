# Seçki, ilgi ve öğrenme

Ana seçki 8 örnekle sınırlandı. Diğer 13 inceleme silinmedi; İnceleme arşivi filtresinde ve mevcut detay adreslerinde duruyor. `selectionFor` her öne çıkan örnek için somut seçilme gerekçesi taşır. Ürün açıklaması, ilgi kanıtı, AI geliştirme kanıtı ve Radar’ın uygulama önerisi birbirinin yerine geçmez.

## İlgi toplama

`attention` kaynağı her 15 dakikada en fazla 6 proje için çalışır; koleksiyon projeleri önce, diğer adaylar sonra gelir. Bir projeyi günlük, başarısız sorguyu 6 saat sonra yeniden kontrol eder. HN Algolia araması her proje için en fazla iki URL sorgusu ve sorgu başına 50 hikâyeyle sınırlıdır. Sadece tam canonical URL eşleşmesi kabul edilir; benzer isimler, çatallar ve projenin adını içeren başka siteler otomatik onay sayılmaz. Sonuç yokluğu tüm internette ilgi olmadığı anlamına gelmez.

50 puan veya 20 yorum: Radar’ın açıklanan ilgi eşiği. Son 7 gündeki paylaşım ve son 48 saatte başarılı kontrol varsa güncel ilgi, eski tarihliyse geçmiş ilgi etiketi kullanılır. Başarısız veya eski kontrol güncel etiket üretemez. Yorum sayısı övgü anlamına gelmez. Duygu analizi, X/LinkedIn/YouTube ilgi taraması ve genel web makalesi eşleştirme henüz otomatik değil.

GitHub toplam yıldızı hız sayılmaz. En az 24 saat, en çok 8 gün aralıklı iki mevcut kanıt gözlemi varsa gerçek tarihler arasındaki net değişim gösterilir. Bu değer kendiliğinden trend veya bağımsız kullanıcı onayı sayılmaz.

Simon Willison’ın 13 Mart 2026 tarihli Autoresearch/Liquid yazısı elle okunmuş yöntem referansıdır; güncel trend etiketi üretmez. Geliştiricinin tam AI prompt geçmişi bilinmiyorsa uygulama reçetesi orijinal yöntem gibi sunulmaz.

## Yayın kontrolü

Otomatik açıklama ve ilgi toplamak, çalışan ürün veya uygulanmış kurs kanıtı değildir. Ana seçkiye girmek için somut öğrenme çıktısı, kaynak, egzersiz ve kabul kontrolleri bulunmalıdır. Mevcut rehberler Radar önerisidir; iki canlı demo gözlemi dışındaki projeler README incelemesidir. Otomatik adaylar koleksiyona kendiliğinden terfi etmez.

İlgi verisi yerel radar.json içindeki attention alanında saklanır. Private yerel PoC kapsamında çalışır; Supabase okuma/senkronizasyonuna bu alan henüz dahil edilmedi.
