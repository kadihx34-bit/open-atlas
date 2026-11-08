# Open Design Atlas MVP genişletme

- [x] Kullanıcının verdiği gooey.jakubantalik.com kaynağını sıvı React efektleri kategorisine ekle.
- [x] Kullanıcının verdiği beam.jakubantalik.com kaynağını animasyonlu kenarlık ışını kategorisine ekle.
- [x] Kullanıcının verdiği metal.jakubantalik.com kaynağını sıvı metal kenarlık kategorisine ekle.
- [x] Kullanıcının verdiği orbs.jakubantalik.com kaynağını animasyonlu küre kategorisine ekle.
- [x] En az 10 ek ücretsiz UI, motion, 3D ve shader kaynağını doğrula.
- [x] Kaynak kartlarına kategori filtresi, kaynak adı, kısa değer önerisi ve doğrudan bağlantı ekle.
- [x] Yer imi durumunu yeni kaynaklarla uyumlu hale getir.
- [x] Mobil ve masaüstü görünümünü doğrula.
- [x] Genişletilmiş sürüm için checkpoint oluştur.

## Kütüphane keşif görünürlüğü

- [x] Üst navigasyona görünür bir Libraries / Kütüphaneler bağlantısı ekle.
- [x] Kaynak indeksini ayrı bir kütüphane keşif bölümüne dönüştür; toplam kütüphane sayısını ve kategori dağılımını göster.
- [x] Her kütüphane için “ne içerir”, “hangi teknoloji”, “ücretsiz kapsam” ve “kaynağa git” bilgilerini görünür kıl.
- [x] Kullanıcıya tüm bileşenlerin otomatik çekilmediğini; mevcut listenin küratörlü kaynak kataloğu olduğunu açıkça belirt.
- [x] Bileşenleri tek tek içeri aktarma yerine, kaynak sitelere yönlendiren MVP sınırını arayüzde belirt.
- [x] Kütüphane keşif alanını masaüstü ve mobilde doğrula.
- [x] Güncellenmiş sürüm için checkpoint oluştur.

## Yerel component registry

- [x] Uiverse Galaxy deposunun README ve lisans koşullarını denetle.
- [x] Bileşenlerin kaynak, kategori, teknoloji, lisans, attribution, HTML/CSS/React/Tailwind kodu ve önizleme alanlarını tanımlayan registry modelini oluştur.
- [x] Uiverse ve uygun açık lisanslı kaynaklardan kopyalanabilir örnek bileşenleri yerel veri dosyasına aktar.
- [x] Lisansı belirsiz veya yeniden dağıtım izni olmayan içerikleri kod olarak içeri alma; yalnızca kaynak bağlantısı göster.
- [x] Kaynak kartı tıklamasını harici site yerine dahili bileşen detay paneline bağla.
- [x] Kod önizleme, framework sekmeleri, kopyalama ve attribution alanlarını ekle.
- [x] MCP için registry endpoint/format sözleşmesini ve sitenin kişisel MCP araçlarına doğrudan erişemediğini belgelemek.
- [x] Özel kullanım, erişim kontrolü ve dağıtım kararlarını proje dokümantasyonuna yaz.
- [x] Güncellenmiş registry deneyimini test et ve checkpoint oluştur.

## UI Playground, örnek siteler ve 3D vitrin

- [x] Ücretsiz UI bileşenlerinin temel durumlarını tek ekranda gösteren UI Playground bölümü oluştur.
- [x] Buton, input, select, checkbox, radio, switch, slider, tabs, accordion, tooltip, dialog, toast, badge, card, pagination, table, avatar, progress, skeleton ve dropdown örnekleri ekle.
- [x] 10 ayrı çalışan örnek site görünümü oluştur ve her birinde ortak bileşenleri kullan.
- [x] Taslak kartlarındaki EXPLORE aksiyonlarını gerçek dahili önizleme rotalarına bağla.
- [x] Taslak önizlemelerinde responsive ekran, kullanılan bileşen listesi ve kopyalanabilir başlangıç kodu göster.
- [x] Three.js / React Three Fiber / drei / GSAP / Lenis gibi uygun 3D web kaynaklarını resmi doküman ve repo düzeyinde doğrula.
- [x] Bir güçlü 3D animasyonlu vitrin ekranı oluştur; kamera, pointer parallax, orbiting geometry, scroll reveal ve reduced-motion desteği ekle.
- [x] Kaynak/lisans/attribution bilgisini 3D vitrin ve UI Playground içinde görünür tut.
- [x] TypeScript, production build, masaüstü ve mobil görünümü doğrula.
- [x] Güncellenmiş sürüm için checkpoint oluştur.

## Component Explorer düzeltmesi

- [x] Kaynak kartlarındaki ana tıklamayı harici repo yerine dahili Component Explorer'a bağla.
- [x] Küçük iframe kartlarını büyüt; kare içinde bileşenin tamamı okunur ve görünür olsun.
- [x] Tüm temel UI kontrollerini tek bir genel Explorer ekranında grupla ve görünür kıl.
- [x] Her bileşen için büyük etkileşimli önizleme, isim, kategori, teknoloji ve kod paneli oluştur.
- [x] Bileşen detayına kopyalama, varyant/değişken ve kaynak bilgisi aksiyonlarını ekle.
- [x] Kaynak/repo linklerini yalnızca ikincil “kaynağı gör” aksiyonu olarak tut.
- [x] Mobil görünümde kart ve detay panelini kullanılabilir hale getir.
- [x] Etkileşimleri, TypeScript ve production build'i doğrula; checkpoint oluştur.

## Three.js ve motion sistemi genişletmesi

- [x] Three.js, React Three Fiber, drei, postprocessing, GSAP/Motion ve Lenis kaynaklarını resmi repo/doküman ve lisans bilgileriyle araştır.
- [x] 3D bileşen veri modelini oluştur: primitive, material, camera, control, lighting, postprocessing, interaction ve motion alanları.
- [x] 10 ayrı sanatsal Three.js sahnesi tasarla: orbit, liquid, particle, typography, crystal, tunnel, terrain, ribbons, kinetic grid ve product stage.
- [x] 3D Explorer ekranında sahneleri büyük canlı önizleme, kategori filtreleri, teknoloji etiketleri ve dahili detay paneliyle göster.
- [x] Yeniden kullanılabilir 3D bileşenleri oluştur: orbit rig, floating object, pointer camera, particle field, shader material, scroll reveal, camera rail ve signal lighting.
- [x] Motion design katmanını oluştur; giriş, hover, scroll, transition ve reduced-motion durumlarını ortak tokenlarla yönet.
- [x] Bu sistemi kullanarak normal UI + motion + 3D birleşimi olan tek parça tamamlanmış showcase site üret.
- [x] Harici kaynakları ikincil referans olarak tut; lisans/attribution bilgilerini görünür göster.
- [x] Canvas lazy-load, düşük DPR, WebGL fallback, mobil kalite profili ve prefers-reduced-motion desteğini doğrula.
- [x] TypeScript, production build ve temsilî masaüstü/mobil ekranları test et.
- [x] Geliştirilmiş 3D sistem için checkpoint oluştur.

## Local Library ve 12 dahili site MVP'si

- [x] 02 / LOCAL COMPONENT LIBRARY bölümünü 07 / COMPONENT EXPLORER ile aynı genel arayüze bağla.
- [x] Local Library içinde tüm bileşenleri görünür, büyük önizlemeli, arama/filtre/kategori ve dahili detay paneliyle sun.
- [x] İnternetten lisans kontrollü birkaç örnek bileşeni, kaynak ve attribution alanlarıyla ekle.
- [x] 10 UI tabanlı siteyi mevcut shared component sistemiyle dahili site deneyimlerine dönüştür.
- [x] Ayrı bir 3D landing site ve scroll-driven 3D ürün hikâyesi oluştur; toplam deneyim sayısını 12 yap.
- [x] 12 site arasında dahili site seçici, önizleme, kullanılan bileşen listesi ve kod/recipe aksiyonu ekle.
- [x] Çalışmayan Three.js presetlerinde render loop, geometry, material ve fallback sorunlarını düzelt.
- [x] 3D Library'de her sahne için reset, pointer, reduced-motion ve mobil performans durumlarını doğrula.
- [x] TypeScript, production build, dahili tıklama akışları ve mobil ekranları test et.
- [x] Tam güncelleme için checkpoint oluştur.

## Sonraki MVP adımları

- [x] 12 site taslağı için gerçek dahili URL rotaları ve ortak showcase kabuğu oluştur.
- [x] Site seçicide route, geri dönüş ve aktif taslak durumlarını bağla.
- [x] Component Explorer'a HTML/CSS, React/Tailwind ve Vue/Tailwind kod sekmeleri ekle.
- [x] Kod sekmelerinde kopyalama ve lisans/attribution bilgisini koru.
- [x] 3D ürün hikâyesinde scroll ilerlemesine bağlı kamera, ölçek, ışık ve içerik adımları oluştur.
- [x] GLB kullanımı için güvenli fallback ve mobil kalite profilini ekle.
- [x] 12 rota, kod sekmeleri ve 3D story akışını test et.
- [x] Güncel sürüm için checkpoint oluştur.

## GLB, hotspot, 12 tema ve backend registry

- [x] Full-stack özellik yükseltmesini tamamla ve mevcut frontend uyumluluğunu koru.
- [x] GLB dosyası yükleme ve güvenli depolama akışını ekle.
- [x] GLB önizlemesine hotspot veri modeli ve tıklanabilir açıklama işaretleri ekle.
- [x] 12 template rotasının her birine ayrı tema tokenları ve bileşen varyasyonları uygula.
- [x] Registry için list/search/get-category backend prosedürleri oluştur.
- [x] MCP uyumlu registry manifest ve endpoint sözleşmesini backend ile bağla.
- [x] İstek doğrulama, erişim kontrolü ve hata durumlarını ekle.
- [x] GLB, hotspot, 12 rota ve registry endpoint akışlarını test et.
- [x] Güncel full-stack sürümü checkpoint ile kaydet.

## Mesh3D, gerçek upload ve MCP transport turu

- [x] mesh3d.gallery ana sayfasını ve erişilebilir model/kaynak sayfalarını araştır; lisans ve yeniden kullanım koşullarını not et.
- [x] İzin verilen Mesh3D kaynağını veya kaynağa dayalı kendi üretim varlığını 3D Library'ye attribution ile ekle.
- [x] GLB upload akışını gerçek Box.glb dosyasıyla local-first önizleme, IndexedDB kayıt ve hotspot doğrulamasıyla test et; korumalı sunucu kaydı kullanıcı oturumu erişimine bağlı bırakıldı.
- [x] Registry için MCP JSON-RPC veya Streamable HTTP transport katmanı oluştur; tools/list ve tools/call desteği ekle.
- [x] MCP transport için search_components, get_component, list_categories ve get_registry_stats araçlarını bağla.
- [x] 12 template'in içerik hiyerarşisini, hero görselini, UI varyantlarını ve rota bazlı metinlerini derinleştir.
- [x] Yeni Mesh3D/GLB kaynağını 3D landing veya ürün story rotasında gerçek kullanım olarak göster.
- [x] E2E upload, hotspot, MCP transport ve tüm template rotalarını doğrula; upload'ın korumalı sunucu varyantı için kullanıcı girişinin gerekli olduğu arayüzde belirtildi.
- [x] Yeni sürüm için checkpoint oluştur.

## 3D Library preset stabilizasyonu

- [x] Particle preset hatasını gerçek browser console stack trace ile izole et.
- [x] Diğer hata veren 3D presetleri aynı akışta sınıflandır ve ortak hata sınırını belirle.
- [x] Her preset için güvenli Canvas içi scene wrapper, error boundary ve CSS fallback ekle.
- [x] Particle sahnesini düşük yoğunluklu BufferGeometry veya güvenli mesh fallback ile yeniden kur.
- [x] 10 sahnenin tamamını seçim akışıyla doğrula; hata verenleri kullanıcıya boş Canvas olarak bırakma.
- [x] 3D Library preset testlerini yaz ve TypeScript/build kontrolü yap.
- [x] Stabilizasyon sonrası checkpoint oluştur.

## Girişsiz GLB fallback

- [x] IndexedDB tabanlı local-first GLB kaydı ekle.
- [x] Kaydedilmiş GLB ve hotspotları sayfa açılışında geri yükle.
- [x] Sunucu kaydını ikincil, isteğe bağlı buton olarak ayır.
- [x] Görünür dosya seçiciyi ve responsive aksiyon grubunu ekle.
- [x] TypeScript kontrolü ve Asset Lab görsel doğrulamasını tamamla.

## Follow-up: resolve 3D verification gaps

- [x] Add an allowed or self-authored Mesh3D-derived asset to the actual 3D Library with visible attribution/license.
- [x] Use the Mesh3D/GLB asset in Prism Landing or Aperture Object and verify the route-level rendering.
- [x] Refactor the particle preset explicitly around low-density BufferGeometry or a dedicated safe mesh fallback.
- [x] Add automated 3D Library preset tests for selection and fallback behavior, then run them.
- [x] Save a new checkpoint after these stabilization fixes.

## Follow-up: Uiverse registry Explorer ve GitHub/MCP aktarımı

- [x] 3.802 Uiverse bileşenini 18 primitive demosundan ayrı bir Registry Explorer menüsünde göster.
- [x] Registry Explorer’da arama, kategori, lisans filtreleri, kademeli listeleme ve dahili detay paneli ekle.
- [x] Uiverse Galaxy başlığındaki 3.802 bileşen / MIT / HTML + CSS / MCP-READY JSON bilgisini gerçek registry ekranına taşı.
- [x] Local Component Library bölümünü 18 primitive ile sınırlı tutup 3.802 registry’ye açık geçiş ekle.
- [x] MCP endpoint kullanımını dokümante et ve registry Explorer’dan MCP-ready JSON/manifest erişimini görünür kıl.
- [x] GitHub aktarımı için README, MCP kullanım dokümanı, lisans/attribution ve güvenli env yönergelerini hazırla.
- [x] Registry Explorer, MCP yüzeyi ve mevcut rotaları test edip checkpoint oluştur.
- [x] Uiverse Registry Explorer’a gerçek ALL / MIT lisans filtresi ekle ve arama+kategori ile birlikte çalıştır.
- [x] Local Component Library başlığına veya footer’ına 3.802 Uiverse Registry Explorer’a giden görünür CTA ekle.
- [x] Bu düzeltmelerden sonra Registry Explorer akışını yeniden test edip checkpoint oluştur.
- [x] GitHub hesabında CreateRepository yetkisi sağlandıktan sonra public `kadihx34-bit/open-atlas` repository’sine mevcut `main` dalını push et.


## Fizibilite raporu ve açık kaynak paylaşımı
- [x] Proje yapısını, rotaları, bileşenleri, stilleri ve build akışını kod değiştirmeden incele.
- [x] Fabric.js/canva-clone yolunu ve hafif sıfırdan editör yolunu kanıtlarla karşılaştır; izole klon build testi yapıldı ve seçim raporda açıklandı.
- [x] AI tasarım nesnesi JSON sözleşmesini, izinli türleri, fontları ve doğrulama/reddetme kurallarını raporla.
- [x] Build, TypeScript ve mevcut test durumunu doğrula; belirsiz noktaları DENENMELİ olarak işaretle.
- [x] GitHub açık kaynak paylaşımı için mevcut remote, repo erişimi ve push yetkisini kontrol et.
- [x] Kullanıcı onayı olmadan dış servise yayınlama veya push yapma; kullanıcı onayı alındı ve public push tamamlandı.


## Fabric.js SocialPostEditor spike
- [x] Fabric.js client-only bağımlılığını mevcut React 19 + Vite uygulamasına ekle ve `/editor` rotasını oluştur.
- [x] `oda.design/1.0` şemasını, Zod doğrulamasını ve açık bitmap/editable object ayrımını ekle.
- [x] 1080x1080 canvas için JSON serialize/deserialize ve IndexedDB local draft kaydet/aç döngüsünü bağla.
- [x] Font yükleme tamamlanmadan export’u kilitle; doğrulanmış 2x PNG export ekle.
- [x] Metin düzenleme, taşıma, ölçekleme, döndürme, silme ve undo/redo command history ekle.
- [x] Tipografik blok, kart, çerçeve ve rozet gibi düzenlenebilir bileşik object grupları ekle.
- [x] Unit/integration/browser doğrulamalarını çalıştır; ekran görüntüsü ve kalan DENENMELİ maddeleri `EDITOR-SPIKE-REPORT.md` içinde raporla.
- [ ] Anlamlı commit(ler) ile public `open-atlas` repository’sine push et.
