# Proje seçimi: mevcut sistem ve gözden geçirme önerisi

## Bugün gerçekten çalışan düzen

10 bağımsız kaynak → aday toplama → tam URL / repo eşleştirme → kaynak ve iddia kaydı → açıklama / ilgi kontrolü → editoryal öğrenme incelemesi → ana seçki.

İlk toplama ve zenginleştirme otomatik. Son inceleme ve ana seçki kararı henüz uçtan uca otomatik değil. Ana seçki, lib/selection.ts içindeki açık listeyle belirleniyor; hesaplanan toplam puan veya öğrenilmiş sıralama modeli yok. Listede olmak test edilmiş bir kurs olduğu anlamına gelmiyor.

- GitHub: iki arama, her birinde son güncellenen 20 depo; trend sıralaması değil.
- Hacker News: son 80 proje tanıtımı, AI geliştirme anahtar kelimesi filtresi.
- One’s Vibe: katalogdaki son 120 kayıt.
- Hugging Face: toplam beğeniye göre 30 Space; büyüme hızı değil.
- Altı bağımsız yayın: son 20 girdideki açık GitHub / Hugging Face bağlantıları. Genel web sitesi bağlantıları ve bağlantısız proje isimleri kapsam dışında.
- Kaynak sayısı en az 10; canlıya geçiş hedefi en az 25 çalışan bağımsız kaynak. Aynı platformdaki sorgular ve zenginleştirme işleri ayrı kaynak sayılmaz.

## Mevcut parametreler

| Kontrol | Bugünkü kural | Ne kanıtlamaz? |
|---|---|---|
| İlgi | Hacker News üzerinde en az 50 puan VEYA 20 yorum | Kalite veya olumlu görüş |
| Güncel ilgi | Paylaşım son 7 günde, başarılı kontrol son 48 saatte | İnternetin tamamındaki trend |
| Geçmiş ilgi | Eşiği geçen daha eski paylaşım | Bugün yeniden yükseliş |
| Yıldız değişimi | En az 24 saat, en fazla 8 gün aralıklı iki gözlem | Tek başına trend veya kullanıcı memnuniyeti |
| AI kullanımı | Verified / Builder-stated / Derived / Unknown | AI kullanan ürünün AI ile geliştirilmiş olması |
| Kimlik eşleştirme | Normalize edilmiş tam URL / repo eşleşmesi; belirsiz eşleşme incelemeye | İsim benzerliğiyle aynı ürün |
| Seçki | Açık editoryal liste; gerekçe, kaynak, egzersiz, araç ve kabul kontrolleri | Otomatik kalite puanı veya uygulanmış egzersiz |

Ana sayfa filtreleri AI durumu, öğrenme alanı ve metin aramasıdır. Liste yıldız sayısına göre otomatik sıralanmaz. Motion Pad arşive alındı; şu anda 7 seçilmiş örnek ve 14 arşiv kaydı var. Diğer 7 örnek aşağıdaki daha sıkı öneriye göre yeniden onaylanmış sayılmaz.

## Önerilen yayın kapısı — henüz uygulanmış kural değil

Önce tüm zorunlu koşullar:

1. Kullanıcı neye baktığını ve projenin ne yaptığını tek cümlede anlamalı.
2. Anlatılan özellik gerçek ürün, çalışan demo veya açıkça tanımlanmış kaynak incelemesiyle desteklenmeli. Erişilemeyen demo çalışıyor gibi gösterilmemeli.
3. Yazarın amacı, gözlem ve Radar yorumu birbirinden ayrılmalı; her iddianın kaynağı olmalı.
4. Kullanıcının kendi projesine taşıyabileceği somut bir davranış veya yöntem bulunmalı.
5. Araç, adım, sınır ve başarı kontrolü hazır olmalı. Denenmemiş tarif, denenmiş rehber gibi yayımlanmamalı.
6. AI kullanım durumu bilinmiyorsa belirsiz grubunda kalmalı.

Ardından en az bir güçlü seçilme nedeni:

- Güncel ilgi: tarihli tartışma veya aynı zaman aralığında ölçülen büyüme. Olumlu/olumsuz tartışma ayrımı kaynak okunarak yapılmalı.
- Öğrenme değeri: denenmiş, yeniden uygulanabilir yöntem veya etkileşim.
- Özgün deneyim: kısa demo ile gösterilebilen belirgin fark ve bunun nerede işe yarayacağı.

Herkes için tek toplam puan önermiyoruz: çok yıldız eksik öğrenme içeriğini telafi etmemeli. İlk sürümde bu kontroller geçildi / eksik / başarısız olarak tutulabilir; sıralama ancak yayın kapısından geçenlerde güncellik ve öğrenme alanına göre yapılır.

## Otomasyonun tamamlanması için gerekenler

Keşif → kaynak metnini oku → gerçek ürünü incele → iddiaları kanıta bağla → kısa özet / demo / uygulama rehberi hazırla → kontrolleri çalıştır → yayımla veya inceleme kuyruğunda tut → güncel değilse yeniden incele.

Mevcut sistemde bu zincirin ürün denemesi, içerik sentezi, egzersiz uygulaması ve yayın kararı bölümleri tam otomatik değildir. Kaynak sayısını artırmak tek başına bu açığı kapatmaz. Kullanıcıdan değerlendirme veya kaynak girmesini beklemek yayın şartı olmamalıdır.

## Gözden geçirilecek karar

Önerim: bu zorunlu yayın kapısını kabul edip mevcut 7 örneğe de uygulamak. Ana seçkideki adet hedefini kalite şartlarının önüne koymamak. Eksik projeleri silmeden inceleme arşivinde tutmak. Motion Pad ancak gösterilebilir demo ve denenmiş rehberle yeniden aday olmalı.
