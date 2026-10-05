# Mobil kullanım

**Durum:** uygulama davranışı ve 5 Ekim 2026 tarihli tarayıcı testi. [English](MOBILE.en.md).

Arayüz 850 px ve altında açılır menü kullanır. Menüden sayfa seçilince kapanır; Escape de kapatır. Telefonlarda koleksiyon ve dersler tek sütun, tablolar kendi alanında yatay kaydırılabilir. Form alanlarında 16 px metin ve önemli eylemlerde en az 44 px dokunma alanı vardır.

5 Ekim 2026 doğrulaması: tarayıcının ölçtüğü 320 ve 390 CSS px genişliklerde koleksiyon / kişi akışı, 390 px ders ve kaynak sayfalarında sayfa genişliği ekranı aşmadı. 767 px tablet koleksiyonu da taşmadı. Menüden sayfa geçişi, otomatik kapanma ve canlı demo aç/kapat denendi. Production derlemesi başarılı. Fiziksel telefon testi kullanıcı tarafında yapılacak.

## Aynı Wi-Fi

`Start-Radar-Mobile.command` dosyasını açın. Mevcut derlenmiş uygulamayı bilgisayarın özel yerel IPv4 adresinde 3102 portunda çalıştırır; adresi terminalde gösterir. Aynı Wi-Fi ağına bağlı telefonda bu adresi açın. Mevcut parola `LOCAL-ACCESS.txt` dosyasındadır. Parolayı bu belgeye veya Git'e eklemeyin.

Bilgisayar açık, uyanık ve sunucu çalışır durumda olmalıdır. Ağ adresi değişirse başlatıcıyı yeniden çalıştırıp yeni adresi kullanın. Telefonun VPN'i, misafir Wi-Fi izolasyonu veya bilgisayar güvenlik duvarı erişimi engelleyebilir. Bu yerel HTTP erişimidir; internet yayını / HTTPS kurulumu değildir. Router port yönlendirmesi veya public tunnel kurulmadı. 127.0.0.1:3101 masaüstü sunucusu değişmedi. Ingestion için ikinci worker başlatılmaz.

Başlatıcı özel IP bulamazsa geniş ağ arayüzüne açılmak yerine durur. 5 Ekim kontrolünde LAN üzerinden /people isteği giriş sayfasına 307 ile yönlendi; /login 200 döndü.
