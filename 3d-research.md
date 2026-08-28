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

## 2026-08-27 route verification

All 12 internal template routes opened through the live preview. The route-specific theme contract is visible in the screenshots: Data Bloom uses warm analytics tokens, Deep Orbit uses a deep cobalt spatial surface, Prism Landing uses vermilion generative lighting, and Aperture Object shows the three-step Material / Detail / Use rail. Shared route shell remains intact while typography, surfaces, accents, radius and shadow tokens vary by slug.

The GLB Asset Lab is visible on the main page with local-first file input, 50 MB guard, Canvas fallback, red clickable hotspot markers, hotspot list, and protected persistence mutation. Registry stats/search are verified via /api/mcp/registry endpoints and the focused registry unit test passes. Full Vitest suite is memory-constrained in the sandbox; targeted registry test passes.

## Particle preset browser check

The live page was opened at the 3D Library section and the Particle Weather button was selected programmatically. The selection succeeded and no new runtime exception appeared in the browser console after the click. A previous console evaluation syntax error came from the test expression itself, not the preset. The stage still needs a stronger visual fallback for environments where WebGL is unavailable.

## 2026-08-27 R3F failure diagnosis

Selecting Particle Weather revealed the concrete runtime failure: `R3F: Cannot set "data-loc". Ensure it is an object before setting "loc"`. The error occurs in React Three Fiber's `applyProps`, indicating the development JSX location attribute is being passed to Three.js intrinsic nodes as if it were a Three property. The fix is to disable the JSX location injection plugin for the R3F build (or otherwise prevent `data-loc` from reaching Canvas children), then reload and retest every preset.

## 2026-08-27 preset retest

After removing the JSX location plugin from Vite and restarting the server, the 3D Library renders normally. The live screenshot shows Blue Orbit Canvas content, all preset cards are present, and selecting Particle Weather succeeds without a new console exception. The prior `data-loc` crash is resolved at the configuration layer rather than masked in the scene component.

## Mesh3D Gallery research

Mesh3D Gallery is a curated showcase of interactive, real-time Three.js experiences rather than a component or model download library. Its homepage exposes Websites, Experiments, Makers, Blog and About navigation, plus a curated feed with experience title, maker, detail page and external visit link. The visible homepage claims 480+ experiences and 230+ makers. No downloadable GLB assets or reuse license for the showcased websites was exposed in the homepage content; therefore the safe integration is a Mesh3D-inspired gallery/curation route with attribution and external visit links, not copying showcased site assets or code.

Reference: https://mesh3d.gallery/

## GLB upload smoke-test note

The official Khronos `Box.glb` sample downloaded successfully (1.7 KB, glTF binary v2). The Asset Lab exposes one file input, but the browser upload helper could not locate it while the input was below the current viewport/section render state. The next test step is to scroll the `#three-lab` section into view, then target the file input and verify local preview before attempting the protected save mutation.

## Upload automation follow-up

The file control is now visibly rendered in Asset Lab and the Khronos Box.glb is ready, but the sandbox browser upload helper still cannot target the React file input. The UI is visible and the local preview path is implemented; a manual browser takeover is required for the final authenticated file-selection and protected save mutation test.

## Local-first GLB verification

The browser-side smoke test successfully fetched the Khronos Box.glb sample (1,664 bytes), assigned it to the visible Asset Lab file input via DataTransfer, dispatched the real change event, and triggered the `TARAYICIDA SAKLA` action. This validates the no-login local-first path up to IndexedDB persistence; protected server persistence remains a separate account-gated action.

The no-login Asset Lab verification now shows `Box.glb` after page reload with a local save timestamp and the IndexedDB notice. The Canvas preview is visible and the hotspot list contains Material, Detail, and Use entries. A browser-side click on the first hotspot completed without a runtime exception; the stage remains interactive and the hotspot instruction stays visible.
