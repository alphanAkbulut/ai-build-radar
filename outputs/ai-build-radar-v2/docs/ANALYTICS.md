# Yerel kullanım analitiği

**Durum:** 5 Ekim 2026 yerel uygulaması. [English](ANALYTICS.en.md).

`/analytics` yetkili kullanıcılar için son 7/30 UTC takvim günündeki toplam Dene ve Bundan öğren tıklamalarını proje bazında gösterir. Koleksiyon kartlarının ana eylemleri ve ders sayfasındaki demo/dış proje eylemi ölçülür. Aday havuzu, kaynak kodu bağlantıları, kart görselleri, makaleler, sayfa görüntülemeleri ve tekil ziyaretçiler bu sürümün kapsamında değildir.

Client, açık data-radar-action işaretli gerçek kullanıcı click olaylarını gönderir. Yeni sekme ve klavye tıklamaları normal gezinmeyi engellemeden fetch keepalive kullanır. Orta tuş ve bağlam menüsü ölçülmez. GPC veya DNT etkinse gönderilmez; ağ hataları kullanıcı akışını bozmaz, kayıp olaylar mümkündür.

API oturum ve aynı origin gerektirir. Şema yalnızca UUID olay kimliği, izinli eylem ve koleksiyondaki slug'ı kabul eder; zaman sunucuda verilir. Aynı günlük olay kimliği exclusive write ile tekrar yazılmaz. Ortak yerel veri klasörü masaüstü ve LAN sunucularında kullanılır. IP, kullanıcı kimliği, çerez, URL parametreleri veya form içeriği saklanmaz. Rastgele olay kimliği kullanıcı takibi için kullanılmaz.

learning-data/analytics Git dışında tutulur. İlk sürümde otomatik silme yoktur; 30 gün yalnızca rapor penceresidir. Public dağıtımdan önce saklama/silme politikası, yönetici rolü, bot/rate limitleri ve ölçeklenebilir depolama kararı gerekir. Sayımlar yetkili kullanıcıların ve geliştiricilerin tıklamalarını kapsar; ürünün gerçekten kullanıldığını veya dönüşüm gerçekleştiğini kanıtlamaz.
