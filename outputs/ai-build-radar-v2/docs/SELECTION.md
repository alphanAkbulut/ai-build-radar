# Seçki, ilgi ve öğrenme

Ana seçkide şu an 7 örnek var. Diğer 14 inceleme silinmedi; İnceleme arşivi filtresinde ve mevcut detay adreslerinde duruyor. `selectionFor` her öne çıkan örnek için somut seçilme gerekçesi taşır. Ürün açıklaması, ilgi kanıtı, AI geliştirme kanıtı ve Radar’ın uygulama önerisi birbirinin yerine geçmez.

## İlgi toplama

`attention` kaynağı her 15 dakikada en fazla 6 proje için çalışır; koleksiyon projeleri önce, diğer adaylar sonra gelir. Bir projeyi günlük, başarısız sorguyu 6 saat sonra yeniden kontrol eder. Hacker News Algolia araması her proje için en fazla iki URL sorgusu ve sorgu başına 50 hikâyeyle sınırlıdır. Sadece tam canonical URL eşleşmesi kabul edilir; benzer isimler, çatallar ve projenin adını içeren başka siteler otomatik onay sayılmaz. Sonuç yokluğu tüm internette ilgi olmadığı anlamına gelmez.

50 puan veya 20 yorum: Radar’ın açıklanan ilgi eşiği. Son 7 gündeki paylaşım ve son 48 saatte başarılı kontrol varsa güncel ilgi, eski tarihliyse geçmiş ilgi etiketi kullanılır. Başarısız veya eski kontrol güncel etiket üretemez. Yorum sayısı övgü anlamına gelmez. Duygu analizi, X/LinkedIn/YouTube ilgi taraması ve genel web makalesi eşleştirme henüz otomatik değil.

GitHub toplam yıldızı hız sayılmaz. En az 24 saat, en çok 8 gün aralıklı iki mevcut kanıt gözlemi varsa gerçek tarihler arasındaki net değişim gösterilir. Bu değer kendiliğinden trend veya bağımsız kullanıcı onayı sayılmaz.

Simon Willison’ın 13 Mart 2026 tarihli Autoresearch/Liquid yazısı elle okunmuş yöntem referansıdır; güncel trend etiketi üretmez. Geliştiricinin tam AI prompt geçmişi bilinmiyorsa uygulama reçetesi orijinal yöntem gibi sunulmaz.

## Yayın kontrolü

Otomatik açıklama ve ilgi toplamak, çalışan ürün veya uygulanmış kurs kanıtı değildir. Ana seçkiye girmek için somut öğrenme çıktısı, kaynak, egzersiz ve kabul kontrolleri bulunmalıdır. Mevcut rehberler Radar önerisidir; iki canlı demo gözlemi dışındaki projeler README incelemesidir. Otomatik adaylar koleksiyona kendiliğinden terfi etmez.

İlgi verisi yerel radar.json içindeki attention alanında saklanır. Private yerel PoC kapsamında çalışır; Supabase okuma/senkronizasyonuna bu alan henüz dahil edilmedi.

## Keşif kapsamı: en az 10, canlıya geçişte 25

Mevcut üç kaynağa Hugging Face Spaces ve altı bağımsız yayın bağlandı: Simon Willison, Ethan Mollick, Chip Huyen, Lilian Weng, Latent.Space, Andrej Karpathy. Böylece 4 platform/katalog ve 6 yayın, toplam 10 bağımsız keşif kaynağı vardır. Bunlar 10 sosyal platform değildir. Yayınların son 20 RSS/Atom girdisindeki açık GitHub depo ve Hugging Face Spaces bağlantıları alınır; metin içinde bağlantısız geçen isimler, genel web sitesi bağlantıları ve tam yazı sayfaları bu sürümde taranmaz. Kaynak yayının tarihi proje çıkış tarihi değildir. Her bağlantı kaynak yazıyla saklanır; atıf övgü sayılmaz. Hugging Face en çok toplam beğeni alan 30 Space döndürür; bu seçim yeni veya hızla yükselen projeler iddiası taşımaz.

Yayınlar 45 dakikada, Hugging Face 3 saatte kontrol edilir. Bunlar otomatik aday havuzuna eklenir; seçkiye yayın kontrolü devam eder. Kaynak başına fetched, yazılarda incelenen girdi sayısıdır; bir girdi birden çok proje bağlantısı içerebilir. Başarısız taramalar görünür kalır. 10 kaynak alt sınırı uygulama ve testle korunur; yeni yayın/kaynak eklemek mevcut kaynakların kaldırılmasına gerekçe değildir. Public açılış için 25 çalışan kaynak şarttır; bu hedef henüz tamamlanmamıştır.

## Çok kaynaklı ilgi ve araştırma

Hacker News eşiği yalnızca o platformun ölçüsüdür, genel kabul/red şartı değildir. Yeni keşifler artık güncel yayın atıfları, Lobsters tartışmaları ve Hugging Face platform trendlerini de gösterir. Kaynak türleri tek puanda toplanmaz: yazıdaki atıf öneri değildir, DEV tepkileri yazıya aittir, toplam beğeni büyüme değildir. DEV Community ve Lobsters eklenerek sürekli keşif 12 bağımsız kaynağa ulaştı. Hugging Face mevcut beğeni taramasını koruyarak 20 trend kaydı da alır.

Product Hunt ve web araştırmasıyla bulunan elle incelenmiş adaylar research-discoveries.json içinde tarihli kaynaklarıyla yer alır. Bu ayrı araştırma kaydı, Product Hunt'ın sürekli API taramasına bağlandığı anlamına gelmez. Demo ve egzersiz kontrolleri tamamlanmamış adaylar tam kurs olarak sunulmaz.
