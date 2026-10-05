# İnsanlar & fikirler — yerel MVP

**Durum:** 5 Ekim 2026 kodu. [English](PEOPLE.en.md). Anlık feed başarısı için `/people` ve `/sources` kontrol edilir.

`/people`, 15 kişi profili ve bunların sekizindeki açık blog/bülten akışını tek ekranda sunar. Profil olmak otomatik izlenen yayın olmak değildir: feed URL’si olmayan yedi profil için yeni yazı taraması yapılmaz. Sekiz feed ayrıca `lib/sources.ts` içinde bağımsız keşif kaynağıdır; buradaki sayfa önbelleği ise ayrı çalışır. `content/people.json` kaynak kayıtları; `content/people-references.json` elle incelenmiş kişi-proje ilişkileridir. Kendi projesi, kullanım beyanı ve örnek gösterme ayrı etiketlenir. Başkasının alıntılanan görüşü, akış sahibinin onayı olarak yorumlanmaz. Latent.Space ortak yayındır; bilinen yazar adları ayrıca gösterilir.

Kullanıcının önerdiği 30 isim [`content/people-watchlist.json`](../content/people-watchlist.json) dosyasında **araştırma adayları** olarak ayrı tutulur ve `/people` altında açılır bir listede görünür. Kullanıcının verdiği zamana duyarlı unvanlar veya bölge iddiaları doğrulanmış veri olarak aktarılmadı. Bu listede yalnız Andrej Karpathy'nin kişisel blogu mevcut etkin `feed-karpathy` kaynağına bağlıdır. Diğer 29 isim için resmî/kişisel yayın URL'si, yazar kimliği, tarih ve kullanım koşulu doğrulanmadan otomatik post, paper, röportaj veya onay iddiası üretilmez. Genel bir yayında bir ismin geçmesi o kişinin paylaşımı sayılmaz. On bağımsız yayın akışı ayrıca [`content/publications.json`](../content/publications.json) ile taranır, fakat kurumsal veya ortak yayındaki her yazı listedeki bir kişiye atfedilmez.

`scripts/people_feed.py` RSS ve Atom okur; kişi başına en fazla sekiz başlık, bağlantı, yazar ve tarih tutar. Tam yazı gövdeleri saklanmaz veya gösterilmez. Simon'ın geniş akışı temel AI/yazılım kelime filtresiyle daraltılır. Bu anlamsal değerlendirme veya kalite puanı değildir. Kaynakların yayınladığı feed tüm sosyal medya etkinliğini kapsamaz; blog feed'i gecikmiş olabilir.

Güncelleme, yetkili kullanıcı sayfayı açtığında son denemenin üzerinden 45 dakika geçmişse yapılır. 45 dakika sürekli çalışan bir worker veya cron değildir. Yeni sayfa isteği yoksa tarama olmaz. Sayfa açık tutulduğunda yeni istek için yenilemek gerekir. Çalışma ortamında Python 3 ve internet gerekir. İlk veriler gerçek akışlardan 5 Ekim 2026'da alındı.

Sonuçlar orijinal ingestion deposundan ayrı `learning-data/people-feed.json` içinde tutulur. Kilit ve atomik dosya değişimi eşzamanlı yazmaları korur. Kaynak hatasında önceki başarılı kayıtlar korunur; son deneme ile son başarı ayrıdır. Boş yanıt eski dolu veriyi silmez. Ağ zaman aşımı, boyut sınırı, HTTPS bağlantı kontrolü ve feed yönlendirme izin listesi bulunur. XML entity/DOCTYPE kabul edilmez; HTML doğrudan render edilmez.

X/LinkedIn gönderileri ve beğenileri, ücretli içerikler, otomatik tavsiye çıkarımı, kişiye özel kalıcı takip listesi bu sürümde yoktur. Yayın başlığı otomatik olarak okunmuş, onaylanmış veya önerilmiş sayılmaz. Kullanıcı puanı ve takipçi sayısı uydurulmaz. Mevcut HN/GitHub worker ve öğrenme koleksiyonu değiştirilmedi.

Doğrulama: `python3 tests/people_feed_test.py`, `pnpm test`, `pnpm build`; tarayıcıda kişi filtresi, arama, proje referansları ve boş sonuç durumu.
