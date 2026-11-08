# SocialPostEditor — Teknik Spike Doğrulama Raporu

## Sonuç

Fabric.js 6.9.1, mevcut React 19 + Vite uygulamasına bağımsız `SocialPostEditor` modülü olarak eklendi. OpenDesign/canva-clone fork edilmedi; klon yalnızca önceki fizibilite çalışmasında referans ve izole build kanıtı olarak kaldı. Yeni yüzey `/editor` rotasında çalışıyor ve mevcut auth, S3, MCP ve GLB akışlarına dokunmuyor.

![Desktop SocialPostEditor](/home/ubuntu/screenshots/webdev-preview-editor-1794130909610554426-2098.png)

![Mobile SocialPostEditor](/home/ubuntu/screenshots/webdev-preview-editor-1794130941125476326-7226.png)

## Uygulanan yüzeyler

`client/src/components/SocialPostEditor.tsx`, Fabric canvas’ı yalnızca client tarafında oluşturuyor; SSR/server bundle’a Fabric canvas runtime’ı taşınmıyor. Canvas mantıksal olarak 1080×1080 ve responsive zoom ile desktop/mobile viewport’a sığıyor. `/editor` rotası `client/src/pages/Editor.tsx` üzerinden App router’a bağlandı ve ana Atlas navigasyonuna görünür bir bağlantı eklendi.

`client/src/lib/odaDesign.ts`, `oda.design/1.0` sözleşmesini Zod ile tanımlıyor. Şema 1080×1080 belge ölçülerini, safe area’yı, allowlist font kataloğunu, strict nesne alanlarını, benzersiz ID’leri ve image asset referanslarını kontrol ediyor. İlk bileşen modeli `text`, `rect`, `ellipse`, `line`, `image` ve bileşik `group` türlerini içeriyor. Group; `typographic-block`, `card`, `frame`, `badge` veya `custom` rolüyle çocuk nesneler taşır. Böylece kart, rozet ve çerçeve gibi parçalar bitmap/flatten çıktı değil, tekrar düzenlenebilir nesne graph’ı olarak kalıyor. Bitmap görsel varlıkları ise ayrı `assets` koleksiyonunda `assetId`, `sourceKind` ve metadata ile tutuluyor.

Editör araçları metin, card, orb, frame ve badge ekleyebiliyor. Fabric’in doğrudan canvas etkileşimleriyle text seçimi/düzenleme, taşıma, ölçekleme ve döndürme kullanılabiliyor; Delete/Backspace nesne silebiliyor. State snapshot tabanlı command history ile toolbar ve `Ctrl/Cmd+Z`, `Ctrl/Cmd+Shift+Z` undo/redo sağlandı.

Save draft ve Open draft, `open-design-atlas-editor` IndexedDB store’unda local-first çalışıyor. Gerçek tarayıcı smoke testinde badge ve text eklenmiş belge kaydedildi, sayfa yenilendi ve aynı görsel nesne düzeni IndexedDB’den geri yüklendi.

Export düğmesi `document.fonts.load` tamamlanmadan etkin işleme geçmiyor. Fontlar hazırken Fabric `toDataURL({ multiplier: 2 })` ile `open-design-atlas-1080x1080@2x.png` oluşturuldu. Gerçek indirilen çıktı Pillow ile `2160×2160`, RGBA ve 182,401 byte olarak doğrulandı.

## Kanıtlanan testler

| Kontrol | Sonuç |
|---|---|
| `/editor` gerçek tarayıcı render’ı | Başarılı; Fabric canvas ve ODA başlangıç belgesi görünüyor |
| Font gate | Başarılı; arayüz `FONTS READY` durumuna geçti ve export hazırlandı |
| Text/Card/Orb/Frame/Badge ekleme | Başarılı; bileşik badge görsel olarak render edildi |
| IndexedDB save/open | Başarılı; refresh sonrası draft geri yüklendi |
| 2x PNG export | Başarılı; çıktı gerçek boyut `2160×2160` |
| Undo/redo | Başarılı; text ekleme undo ile kaldırıldı, redo ile geri geldi |
| ODA Zod geçerli belge | Başarılı |
| Duplicate object ID reddi | Başarılı |
| Eksik image asset reddi | Başarılı |
| `pnpm check` | Başarılı |
| `pnpm test` | Başarılı — 4 dosya, 8 test |
| `pnpm build` | Başarılı |

## Kalan DENENMELİ maddeleri

1. Gerçek kullanıcı akışında Fabric `IText` çift tıklama text editing, resize ve rotate davranışları masaüstü ve mobil dokunmatik cihazlarda ayrıca denenmeli.
2. Group içindeki tekil child nesnelerin seçilip düzenlenmesi/ungroup akışı henüz ürünleştirilmedi; spike’ta group taşıma ve ODA child graph korunumu kanıtlandı.
3. Image asset’in gerçek kullanıcı upload’ından `assets` koleksiyonuna alınması, Fabric image render’ı ve local draft reload akışı sonraki spike’ta eklenmeli. Bu değişiklik mevcut S3/auth akışına özellikle eklenmedi.
4. Ağ yavaşken `document.fonts.load` reddi, font fallback’i ve custom user font yükleme politikası denenmeli.
5. Safari, Firefox, iOS Safari ve farklı devicePixelRatio değerlerinde 2x export piksel doğruluğu ayrıca denenmeli.
6. IndexedDB quota, private browsing ve büyük bitmap draft senaryoları denenmeli.
7. Büyük Uiverse registry chunk’ının editör ilk yükleme süresine etkisi ayrıca ölçülmeli; editörün kendisi yeni `fabric` chunk’ını build’e ekledi ancak mevcut registry chunk uyarısı devam ediyor.
8. Bu aşamada MCP, LLM ve AI patch uygulama akışları bilinçli olarak eklenmedi; ODA sözleşmesi hazırlandıktan sonra ayrı bir entegrasyon kararı gerekiyor.

## Değişen ana dosyalar

- `client/src/components/SocialPostEditor.tsx`
- `client/src/lib/odaDesign.ts`
- `client/src/pages/Editor.tsx`
- `client/src/App.tsx`
- `client/src/pages/Home.tsx`
- `client/src/index.css`
- `server/odaDesign.test.ts`
- `package.json` / `pnpm-lock.yaml`
- `todo.md`

Bu spike yeni dış servis, ücretli API veya yeni deploy kullanmadı. Public `kadihx34-bit/open-atlas` repository’sine push için kullanıcı onayıyla anlamlı bir commit hazırlanacak.
