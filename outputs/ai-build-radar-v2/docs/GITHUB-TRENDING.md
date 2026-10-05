# GitHub Trending · kaynak denetimi ve işletim

**Durum:** 5 Ekim 2026 yerel private PoC. [English](GITHUB-TRENDING.en.md). Kod: `lib/github-trending.ts`, registry: `lib/sources.ts`, kanıt/gündem: `lib/evaluation.ts`. Anlık başarı ve sayı için `/sources` esas alınır.

## Neden eklendi?

Önceki GitHub collector yalnız Repository Search API'de “built with ...” ifadeleri ve `vibe-coding` konusunu sorguluyordu. [Trending repos](https://github.com/trending) ve [Trending developers](https://github.com/trending/developers) sayfalarını okumuyordu. Bu, popülerleşen AI araçlarını kaçırma nedenlerinden biridir; kullanıcıya daha önce açıkça söylenmeliydi. Trending sayfaları da tüm AI ürünleri veya AI ile üretilmiş siteler değildir. İkinci sayfa, trend geliştiricilerin yanındaki “popular repo” örneklerini gösterir; bu repoların bizzat repo trend listesine girdiği sonucu çıkarılamaz.

## Çalışan akış

Yerel modda `github-trending` her üç saatte bir iki günlük HTML sayfasını okur. 2 MB/20 saniye sınırı, sabit iki URL, yönlendirme reddi ve görünür başarısız koşu uygulanır. Başlık/açıklamada AI ile ilgili terim bulunan en çok 10 repo-listesi ve 6 geliştirici-listesi bağlantısı, GitHub Repository API'siyle metaveri ve varsa homepage için tamamlanır. HTML düzeni veya API okuması bozulursa `/sources` hata/kısmi koşu gösterir; boş başarılı tarama uydurulmaz. Geliştirici profili, takipçisi, kişisel verisi veya sayfanın bütün HTML'i depolanmaz.

Aynı repo iki listede veya eski GitHub aramasında geçse de kanonik repo URL'siyle tek Build Entity'ye bağlanır; her listeye ait kanıt ayrı kalır. Doğrudan repo listesi `github_trending_daily` ile **platform içi ilgi** üretir; gösterilen “stars today” GitHub'ın sayfa rakamıdır, Radar'ın iki tarihli yıldız farkı değildir. Geliştirici listesinde popüler repo bağlantısı `github_trending_developer` ile **bahsedilme** üretir. İkisi de AI ile geliştirilme, canlı site veya kullanıcı övgüsü kanıtı değildir. Repo sahibinin API açıklamasında ayrıca açık “built with ...” beyanı varsa bu bağımsız `Builder-stated` iddiası olabilir.

Gündem kartı için ayrıca repo dışı site URL'si, anlamlı ürün açıklaması ve çözümlenmiş kimlik gerekir. Böylece repo-only kayıt arşivde bulunabilir ama “Dene” kartı olarak sunulmaz. Adayın gerçekten çalışan demosu veya öğretici değeri editoryal inceleme olmadan onaylanmaz. İki Trending sayfası **GitHub adlı tek platformun iki görünümüdür**; 14 bağımsız keşif kaynağı sayısına yeni bir kaynak olarak eklenmez.

## İlk gerçek koşu ve sınır

5 Ekim 2026 19:27 UTC koşusu `completed` oldu: 48 okunan liste/API kaydı, 24 filtrelenen, 12 yeni Build Entity, 12 eşleşme (aynı koşudaki liste/metaveri çiftleri de dahil), 144 kanıt, 0 kimlik çatışması. Altı repo-listesi, altı geliştirici-listesi kanıtı üretildi. Bunlardan altısının yeterli site/açıklama bilgisi o anda gündem kartına uygundu. **Bu anlık ölçüm küresel kapsam, demo başarısı veya 12 bağımsız ürün trendi değildir.** Örneğin geliştirici listesindeki altı kayıt repo trendi sayılmaz. Sonraki çalışmada sayılar değişir; canlı durum `/sources` ekranındadır.

Bu HTML sayfaları için burada resmî bir Trending API kullanılmıyor; yapı değişimine duyarlı bir private PoC adaptörü var. İncelenen [GitHub REST Search API](https://docs.github.com/en/rest/search/search) aynı Trending sıralamasını sunmuyor. GitHub'ın [Acceptable Use Policies](https://docs.github.com/en/site-policy/acceptable-use-policies/github-acceptable-use-policies) otomatik erişim ve bilgi kullanımına koşullar koyuyor; HTML okumayı kategorik yasak saymıyoruz. Adapter yalnız `RADAR_AUTH_MODE=local` iken etkindir. Public/hosted kullanım ve yeniden kullanım yolu için açık karar, sayfa kırılması alarmı, limit kontrolü ve sinyalin doğru etiketlenmesi [risk kaydında](RISK-REGISTER.md) GH-01–GH-04 olarak, [R15 yayın öncesi işinde](https://github.com/alphanAkbulut/ai-build-radar/issues/15) ise kabul kapısı olarak izlenir. Bu bir hukuk görüşü veya GitHub'dan izin alınmış olduğu iddiası değildir.
