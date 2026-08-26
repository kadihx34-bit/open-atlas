# Open Design Atlas — Tasarım Kararları

## Üç olası yön

### Theme Name: Archive Brutalism
Very Brief Intro: Tasarım kaynaklarını bir arşiv / yayın kataloğu gibi sunan, keskin tipografili ve yüksek kontrastlı bir yön. Güven ve editoryal ciddiyet üretir.
Probability: 0.037

### Theme Name: Soft Systems Garden
Very Brief Intro: UI parçalarını sakin, katmanlı ve dokunsal bir görsel bahçe gibi düzenleyen açık tonlu yaklaşım. Keşif hissini öne çıkarır.
Probability: 0.082

### Theme Name: Signal Atlas
Very Brief Intro: Koyu grafit zemin, kobalt işaretler, vermilyon sinyaller ve 3D orbitlerle dijital bir tasarım navigasyonu kuran yaklaşım. Ürünün küratörlü ve çağdaş karakterini görünür kılar.
Probability: 0.014

## Seçilen yaklaşım: Signal Atlas

### Design Movement
Neo-editorial digital brutalism: yayıncılık sistemlerinin net hiyerarşisini, yaratıcı kodlama estetiğinin 3D sinyalleri ve hafif teknik gridleriyle birleştirir.

### Core Principles
1. Kaynaklar bir içerik listesi değil, yön bulma sistemi gibi davranır.
2. Her ekranın tek bir güçlü görsel odağı ve net bir sonraki adımı olur.
3. Koyu zemin yalnızca kontrast için değil, seçilmiş içerikleri sergilemek için kullanılır.
4. Hareket, dekoratif gösteri değil, keşif ve durum geri bildirimi işlevi görür.

### Color Philosophy
Grafit siyah, tasarım notlarının ve 3D objelerin sergilendiği sessiz bir arşiv duvarıdır. Kobalt mavi yön, teknoloji ve güven duygusunu; vermilyon ise dikkat edilmesi gereken sinyali temsil eder. Kemik beyazı metin, ekranı sertleştirmeden okunabilirliği korur.

### Layout Paradigm
Sol tarafta sabit bir atlas navigasyonu, sağ tarafta asimetrik içerik akışı kullanılır. Ana sayfa bir dashboard gibi değil, editoryal bir çalışma masası gibi ilerler: büyük hero, yüzen kaynak kartları, yatay kaydırılabilir koleksiyonlar ve numaralı bölümler.

### Signature Elements
- Kobalt ve vermilyon kesişimlerinden oluşan orbit / rota çizgileri.
- İnce blueprint grid, koordinat işaretleri ve bölüm numaraları.
- Cam, krom ve kağıt hissini aynı kompozisyonda birleştiren 3D atlas objeleri.

### Interaction Philosophy
Kullanıcı arama yaptığında sistem yalnızca filtrelemez; ilgili kaynakları komşu fikirler olarak da gösterir. Hover durumları kartı büyütmek yerine eksenini ve sinyal çizgisini değiştirir. Kopyalama, açma ve favorileme eylemleri kısa, görünür ve geri alınabilir bildirimler verir.

### Animation
Giriş animasyonları 30–70 ms kademeli gecikmeli, 180–260 ms aralığında ve transform/opacity tabanlı olur. 3D dekorlar düşük frekansta orbit eder; kart etkileşimleri 2–4 derece mikro-rotasyon ve 1–2 px translate ile sınırlıdır. Reduced-motion kullanıcıları için tüm sürekli hareketler durur.

### Typography System
Başlıklarda Space Grotesk veya Sora: sıkı, karakterli ve teknik. Gövde metninde IBM Plex Sans: uzun açıklamalarda yüksek okunabilirlik. Mono etiketlerde IBM Plex Mono: kaynak türü, sayı ve teknik durumlar için. H1 72/0.94, bölüm başlıkları 34/1.0, gövde 16/1.55, meta 11/1.1 uppercase tracking.

### Brand Essence
Tasarımcıların fikirden arayüze geçerken ihtiyaç duyduğu açık kaynak UI, prompt ve ilham atlası; dağınık kaynakları küratörlü rotalara dönüştürür. Kişilik: meraklı, seçici, enerjik.

### Brand Voice
Başlıklar kısa, iddialı ve fiil odaklıdır; CTA'ler ne vaat ettiğini açıkça söyler; mikro metinler katalog diliyle değil, tasarımcı arkadaşın pratik notu gibi konuşur.

Örnek 1: “Bir sonraki yüzeyini buradan başlat.”
Örnek 2: “Kopyala, bağla, kendi sistemine göre bük.”

### Wordmark & Logo
Logo, dört kobalt bıçağın küçük vermilyon merkez etrafında birbirini keserek oluşturduğu pusula / atlas markıdır. Kelime işareti ayrı bir geometrik yazı karakteriyle kullanılır; ikon tek başına favicon ve bölüm imzası olarak çalışır.

### Signature Brand Color
Signal Cobalt — #315CFF. Atlasın yön gösteren, kolay tanınan imza rengi.

## Araştırma notları

Ürün, Uiverse'in açık kaynak element yaklaşımını ve kategori mantığını; GitHub Awesome Design Systems listesinin kaynak dizini fikrini; shadcn registry kavramının dağıtılabilir bileşen yaklaşımını; Three.js ve Awwwards Three.js sayfalarının 3D web ilhamını referans alır. Proje, bu kaynaklardan içerik kopyalamak yerine bağlantıları ve kısa editoryal özetleri küratörlü biçimde sunar. Lisans ve sahiplik bilgileri kaynak kartlarında görünür tutulur.

## Uygulama kapsamı

İlk sürümde tek sayfalı bir kaynak atlası, canlı arama, kategori filtreleri, prompt kartları, UI bileşen galerisi, 3D ilham kartları, site taslakları ve her kartta kaynak bağlantısı bulunur. “Kopyala” eylemi, örnek prompt veya kod parçasını panoya alır; dış kaynak bağlantıları yeni sekmede açılır. Tam GitHub deposu indirme ve gerçek içerik senkronizasyonu statik sürümün dışında tutulur.

## References

[1]: https://uiverse.io/ "Uiverse — Open-source UI elements"
[2]: https://github.com/alexpate/awesome-design-systems "Awesome Design Systems"
[3]: https://ui.shadcn.com/docs/directory "shadcn/ui Registry Directory"
[4]: https://threejs.org/ "Three.js"
[5]: https://www.awwwards.com/websites/three-js/ "Awwwards Three.js websites"
[6]: https://github.com/uiverse-io/galaxy "Uiverse Galaxy repository"
[7]: https://www.figma.com/community/ui-kits "Figma Community UI kits"

## Style Decisions

- Signal Atlas yönü tüm bileşenlerde korunacak; mor gradient, genel amaçlı Inter ve sürekli neon glow kullanılmayacak.
- Üçüncü taraf kaynaklar içerik sahibi gibi gösterilmeyecek; kartlarda kaynak adı ve doğrudan bağlantı bulunacak.
- Görsel çeşitlilik için ana hero, 3D dekorlar ve marka sembolü üretilmiş görsellerle; yardımcı görseller ise CSS kompozisyonlarıyla çözülecek.
- Kullanıcı tarafından sağlanmayan yorum, puan veya testimonial üretilmeyecek.

- Primary navigation ve footer aynı pusula markasını taşıyacak; wordmark üst navigasyonda kalıcı olacak.
- Signal Cobalt #315CFF yön ve ana aksiyonları, vermilyon dikkat/sinyal anlarını, kemik ve grafit editoryal zemini taşıyacak; ayrı bir lime aksanı kullanılmayacak.
- Her ana bölüm route line, koordinat işareti, bölüm indeksi veya pusula imzasından en az birini gösterecek.
- Kaynak kartlarında kaynak adı, türü ve pratik değer önerisi daha görünür olacak; kartlar kategori tanıtımı değil, rota durağı gibi okunacak.
