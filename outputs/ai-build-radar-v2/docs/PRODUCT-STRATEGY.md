# AI Build Radar · ürün hafızası

**Durum:** 6 Ekim 2026 ürün niyeti ve doğrulanan sınırlar. [English](PRODUCT-STRATEGY.en.md) · [Yol haritası](ROADMAP.md) · [Mimari](ARCHITECTURE.md). Bu belge bir konuşma dökümü değil, karar verirken korunacak gerekçelerdir. İşlerin güncel durumu GitHub Issues'dadır; çalışan kaynakların güncel durumu uygulamadaki `/sources` ekranındadır.

## Neden var?

Ürünün çıkış sorusu: **AI alanında ne gerçekten yapılabiliyor, hangi uygulama ilgi görüyor ve gördüğüm iyi fikri kendi ürünümde nasıl kullanabilirim?** Hedef ziyaretçi meraklı bir ürün yöneticisi, geliştirici veya AI ile ürün yapan kişidir. Bir haber başlığından veya yüzlerce araçlık dizinden fazlasını ister: çalışan şeyi görür, onu kimin/neden yaptığına bakar, ilginin kanıtını okur, kullanılan araçları gerçek kanıta göre öğrenir ve mümkünse belirli bir özelliği kendi bağlamına uyarlar.

Radar'ın vaadi iki katmanlıdır. **Gündem** güncel, kaynaklı keşif ve ilgi akışıdır. **Öğrenme koleksiyonu** daha az sayıda, denenmiş ve öğretici örneğin uygulama okuludur. 150 yüzeysel kart yerine yaklaşık 30 güçlü vaka hedeflenir; 30 sayı hedefi kalite kapısını gevşetmez. Bugünkü geçici yayın kapısı gündemdeki ürünlerden de hazır ders ister; ileride ayrı doğrulanmış demo kapısı, henüz derse dönüşmemiş çalışan ürünü gündeme alabilir. Ayrı `/news` sayfası haber başlığı, varsa yayıncının kısa açıklaması ve yazarını gösterir; `/briefing` haber başlıklarını kaynaklı listeler. Teorik makale veya model duyurusu çalışan demo kartına dönüşmez. Derin **Research Gate** hâlâ sonraki fazdır.

## Ziyaretçinin temel yolu

1. **Gör:** Tek kartta ne yapıldığı, ayırt edici tarafı ve hangi kaynakta ne zaman dikkat çektiği anlaşılır. “Yeni keşif”, “platformda ilgi”, “yazıda bahsedilme” ve “AI ile geliştirilme” birbirine karışmaz.
2. **Dene:** İlk eylem gerçek ürün/demoyu açar. Repo ikinci plandadır. Görsel ürünün kendisinden gelir; statik kapak canlı etkileşim diye sunulmaz. Çalışmayan, giriş gerektiren veya erişilemeyen demo açıkça işaretlenir.
3. **Öğren:** Geliştiricinin açıklaması ve kanıtları, dikkat çekici etkileşimin gözlemi, varsa kaynaklı övgü/eleştiri ve öğrenilebilecek teknik/ürün ilkesi gösterilir. “Geliştirici bunu kullandı” ile “Radar bunu kullanmanı öneriyor” ayrıdır.
4. **Uyarla:** Ancak denenmiş bir reçete varsa adımlar, kabul kontrolleri ve kendi AI geliştirme aracına aktarılabilen bağlam sunulur. Başka bir ChatGPT/Claude sohbetinin veya kullanıcının kod deposunun otomatik bilindiği iddia edilmez. Geçiş promptu önce mevcut proje bağlamını aramasını ve doğrulamasını ister. Başarı ölçülmeden “%90 çalışır” sözü verilmez.

## Korunacak ayrımlar

| İddia | Kanıt örneği | Yapılmayacak çıkarım |
| --- | --- | --- |
| Ürün AI kullanıyor | Ürünün belgelenmiş özelliği veya çalışan demo | AI ile geliştirildiği |
| AI ile geliştirildi | Açık üretici beyanı veya daha güçlü doğrudan kayıt | Belirli modelin bütün kodu yazdığı |
| İlgi görüyor | Kaynağa atfedilen güncel oy/yorum, Trending konumu veya zamanlı artış | Kaliteli olduğu veya herkesçe övüldüğü |
| Bir kişi bahsetti | Tarihli, doğrudan eşleşen yazı/paylaşım | Beğendiği veya önerdiği |
| Demo çalışıyor | Tarihli gerçek açılış ve etkileşim kontrolü | Ürünün tüm özelliklerinin çalıştığı |

`Verified`, `Builder-stated`, `Derived`, `Unknown` iddianın kapsamına uygulanır. Kaynak URL'si, yayın/olay tarihi, gözlem tarihi ve Radar'ın ilk görme tarihi ayrı tutulur. Eksik kanıt “olumsuz” değil `Unknown` olur. Sadece AI özellikli olması veya GitHub Trending'de görünmesi “AI ile build edildi” etiketi üretmez.

## Seçim standardı ve mevcut boşluk

Gündem adayı için ayrı ürün URL'si, anlamlı kaynaklı açıklama, çözümlenmiş kimlik ve doğru türde tarihli sinyal gerekir. **Yayınlanan** ürün kartına ayrıca gerçek, son 30 günde denenmiş etkileşim ve aynı siteye ait önizleme gerekir. Otomatik demo incelemesi hazır olmadığı için geçici kapı, kaynaklı fark ve öğrenme adımlarını da içeren `selectionFor` seçkisini kullanır; böylece haber gündemi ile ders koleksiyonu şimdilik aynı küçük incelenmiş ürün kümesinden beslenir, ama farklı soruları yanıtlar. Kaynak havuzu büyüyebilir; yayın sayısı sırf bu yüzden artmaz. İleride ayrı demo onayı, tam ders hazırlanmamış ama gerçekten denenebilir ilginç ürünleri de gündeme alabilir. Bugünkü kod kendi başına insan gibi demo gezip “wow” değeri, yorum bağlamı veya reçete başarısını doğrulamıyor. Bu farkı kapatmak yol haritasının ilk işidir.

Yayın kararı kaynaklı ve itiraz edilebilir olmalı: “Neden burada?”, “Neyi denediniz?”, “Ne biliyorsunuz, neyi bilmiyorsunuz?” soruları yanıtlanır. Olumsuz kanıt yokluğundan oluşan uzun metinler kartın ana anlatısı olmaz. Kaynak yoksa övgü veya popülerlik uydurulmaz. Birkaç platform sinyali tek bir yapay puana toplanmaz. Harici bir katalogdaki model etiketi Radar'ın bağımsız doğrulaması gibi sunulmaz.

## Ürün sınırı ve gelecekteki fikirler

- **Bugün:** private yerel Next.js sürümü, kaynak/kanıt deposu, otomatik aday toplama, tarihli ve kaynak açıklamalı haber akışı, gündem ve az sayıda editoryal ders. Worker yalnız çalıştığı bilgisayarda çalışır. Canlı Supabase projesi, ücretli AI değerlendirme sağlayıcısı ve public dağıtım bağlı değildir.
- **Bir sonraki değer:** daha iyi kaynak kapsamı ve kaynak sağlığı; örneklem üstünde yanlış pozitif denetimi; canlı demo ve etkileşim kaydı; 5 uçtan uca güçlü vaka; kartlarda “ne/neden/nerede/öğren” açıklığı.
- **Sonraki araştırma:** YouTube incelemeleri, sosyal tartışma ve yorum bağlamı, Asya dahil çok dilli kaynaklar, kişi yayınlarının kısa kaynaklı özeti, yeni model/özellik haberleri. X, Reddit, Product Hunt ve YouTube bugün çalışan sürekli collector değildir.
- **Daha sonra:** test edilmiş uyarlama, public hesaplar, follow/bookmark/comment, geliştirici vitrini, çok dilli üretim, açık API/RSS, abonelik katmanları ve coğrafi keşif. Bunlar mevcut ürün vaadi veya bugünkü mimariyi gereksiz büyütme gerekçesi değildir. Ülke/şehir kanıtı yoksa deploy sunucusunun konumu veya ülke başkenti yapımcının gerçek şehri diye etiketlenmez.

## Başarıyı nasıl anlayacağız?

Hacim değil güven ve kullanım ölçülür: yanlış AI geliştirme etiketi, bozuk demo, kaynağa uymayan ilgi iddiası, yanlış merge, karttan ürüne geçiş, “Dene → Öğren → Uyarla” adımlarına geçiş ve ziyaretçinin “neye bakıyorum?” sorusunu tek kartta yanıtlayabilmesi. Örneklem boyutu, kontrol tarihi ve eşikler raporlanmadan yüzde başarı iddiası yapılmaz. Yayından önce haklar, gizlilik, kaynak kullanım şartları ve maliyet ayrıca değerlendirilir.
