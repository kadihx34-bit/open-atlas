# 3D Web Araştırma Notları

## Karar

Bu MVP için React Three Fiber + Three.js kullanılacak. React Three Fiber, Three.js için deklaratif bir React renderer'ıdır; React 19 ile R3F v9 eşleşir ve `Canvas`, `useFrame`, pointer eventleri gibi yapı taşları resmi dokümantasyonda yer alır. Drei, R3F için hazır kamera, kontrol, `Float`, `Sparkles`, `Environment`, `MeshDistortMaterial`, `ScrollControls` ve performans yardımcıları sunar. Bu proje için ağır harici model yüklemek yerine geometrik primitive'ler ve shader benzeri materyal hareketleri kullanılacak; böylece 3D vitrin hızlı açılır ve mobilde daha güvenli ölçeklenir.

## Uygulanacak etkileşimler

Sahne içinde pointer hareketi kamera/parallax yönünü değiştirir, geometriler sürekli düşük yoğunluklu bir render loop ile döner, pointer-over durumunda ölçek ve renk tepkisi verir, scroll ilerlemesi içerik katmanını açar. `prefers-reduced-motion` açık olduğunda sürekli hareket azaltılır; Canvas yüklenemezse CSS tabanlı fallback görünür.

## Doğrulanmış kaynaklar

| Kaynak | Rol | URL |
|---|---|---|
| Three.js | WebGL/3D çekirdeği ve temel sahne modeli | https://threejs.org/docs/ |
| React Three Fiber | React renderer, Canvas ve useFrame | https://r3f.docs.pmnd.rs/getting-started/introduction |
| R3F GitHub | MIT lisanslı kaynak repo ve ekosistem | https://github.com/pmndrs/react-three-fiber |
| Drei | R3F hazır yardımcıları ve kontroller | https://drei.docs.pmnd.rs/ |
| GSAP | İsteğe bağlı timeline/scroll orchestration | https://gsap.com/docs/v3/ |
| Lenis | İsteğe bağlı smooth scroll | https://github.com/darkroomengineering/lenis |

## Not

Mevcut proje statik React frontend'dir. 3D paketleri eklemeden önce bundle etkisi ve mobile fallback birlikte doğrulanmalıdır. Kaynakların lisansları ve attribution bilgileri proje içinde korunmalıdır.

## Genişletme için doğrulanan ek bulgular

React Three Fiber resmi GitHub deposu, Three.js'i React içinde deklaratif, yeniden kullanılabilir ve etkileşimli bileşenlerle kullanmayı tanımlıyor; README'de R3F v9'un React 19 ile eşleştiği ve MIT lisans bilgisinin repo içinde bulunduğu görülüyor. Drei dokümantasyonu, R3F için hazır soyutlamalar ve yardımcılar sunuyor; sahne kütüphanesinde kamera, kontrol, ışık, environment, materyal ve scroll yardımcıları ayrı kategoriler olarak ele alınacak. Bu doğrulama sonucunda atlasın 3D sistemi doğrudan kaynak sitelere yönlendirme yerine kendi primitive ve motion registry'sini sunacak; harici repo bağlantısı yalnızca kaynak/attribution için ikincil kalacak.

| Kaynak | Atlas'ta kullanılacak rol | Lisans / kullanım kararı |
|---|---|---|
| Three.js docs/examples | Primitive, camera, material ve shader referansları | Kendi uygulama kodumuz; örneklerin lisansını ayrıca kontrol et |
| pmndrs/react-three-fiber | React Canvas ve render loop katmanı | MIT repo; proje bağımlılığı olarak kullan |
| pmndrs/drei | Hazır 3D yardımcılarının referansı | Bağımlılığı bundle boyutuna göre seç; kullanılmayan yardımcıları içeri alma |
| postprocessing | Bloom, noise, vignette ve renk katmanı referansı | Sürüm/lisans kontrolü sonrası opsiyonel katman |
| GSAP / Motion | Timeline ve UI geçişleri için referans | Sadece gerçekten kullanılan motion primitive'lerini ekle |
| Lenis | Smooth scroll referansı | Varsayılan değil; erişilebilirlik ve performans testinden sonra opsiyonel |

## Dahili rota doğrulaması

İlk testte R3F `useFrame` hook'u Canvas dışındaki wrapper içinde çağrıldığı için dahili 3D rota hata veriyordu. `RouteObjectScene` ve `ProductScene` ayrıştırılarak hook'lar Canvas ağacının içine taşındı. Yeniden testte `/templates/prism-landing` rotası başarıyla açıldı; Canvas, ürün geometrisi, orbit halkası ve geri dönüş/başlangıç promptu aksiyonları görünür durumda.
