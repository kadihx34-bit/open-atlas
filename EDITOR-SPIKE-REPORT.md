# SocialPostEditor — Teknik Spike Doğrulama Raporu

## Sonuç

Fabric.js 6.9.1, mevcut React 19 + Vite uygulamasına bağımsız `SocialPostEditor` modülü olarak eklendi. OpenDesign/canva-clone fork edilmedi; klon yalnızca önceki fizibilite çalışmasında referans ve izole build kanıtı olarak kaldı. Yeni yüzey `/editor` rotasında çalışıyor ve mevcut auth, S3, MCP ve GLB akışlarına dokunmuyor.

![Desktop SocialPostEditor](/home/ubuntu/screenshots/webdev-preview-editor-1794130909610554426-2098.png)

![Mobile SocialPostEditor](/home/ubuntu/screenshots/webdev-preview-editor-1794130941125476326-7226.png)

## Uygulanan yüzeyler

`client/src/components/SocialPostEditor.tsx`, Fabric canvas’ı yalnızca client tarafında oluşturuyor; SSR/server bundle’a Fabric canvas runtime’ı taşınmıyor. Canvas mantıksal olarak 1080×1080 ve responsive zoom ile desktop/mobile viewport’a sığıyor. `/editor` rotası `client/src/pages/Editor.tsx` üzerinden App router’a bağlandı ve ana Atlas navigasyonuna görünür bir bağlantı eklendi.

`client/src/lib/odaDesign.ts`, `oda.design/1.0` sözleşmesini Zod ile tanımlıyor. Şema 1080×1080 belge ölçülerini, safe area’yı, allowlist font kataloğunu, strict nesne alanlarını, benzersiz ID’leri ve image asset referanslarını kontrol ediyor. İlk bileşen modeli `text`, `rect`, `ellipse`, `line`, `image` ve bileşik `group` türlerini içeriyor. Group; `typographic-block`, `card`, `frame`, `badge` veya `custom` rolüyle çocuk nesneler taşır. Böylece kart, rozet ve çerçeve gibi parçalar bitmap/flatten çıktı değil, tekrar düzenlenebilir nesne graph’ı olarak kalıyor. Bitmap görsel varlıkları ise ayrı `assets` koleksiyonunda `assetId`, `sourceKind` ve metadata ile tutuluyor.

Editör araçları metin, typographic block, card, orb, frame ve badge ekleyebiliyor. Fabric’in doğrudan canvas etkileşimleriyle text seçimi/düzenleme, taşıma, ölçekleme ve döndürme kullanılabiliyor; Delete/Backspace nesne silebiliyor. State snapshot tabanlı command history ile toolbar ve `Ctrl/Cmd+Z`, `Ctrl/Cmd+Shift+Z` undo/redo sağlandı. Group seçildiğinde `Edit group children` akışı group’u geçici olarak child nesnelere ayırıyor; child’lar ayrı editable Fabric/ODA nesneleri olarak kalıyor ve `Regroup last` ile tekrar aynı bileşik group’a dönüyor. Bu döngü gerçek tarayıcıda typographic block ile doğrulandı.

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
| Compound group child edit | Başarılı; typographic block ungroup → child graph → regroup döngüsü browser’da doğrulandı |
| ODA Zod geçerli belge | Başarılı |
| Duplicate object ID reddi | Başarılı |
| Eksik image asset reddi | Başarılı |
| `pnpm check` | Başarılı |
| `pnpm test` | Başarılı — 4 dosya, 8 test |
| `pnpm build` | Başarılı |

## Kalan DENENMELİ maddeleri

1. Gerçek kullanıcı akışında Fabric `IText` çift tıklama text editing, resize ve rotate davranışları masaüstü ve mobil dokunmatik cihazlarda ayrıca denenmeli.
2. Group child’larının Fabric canvas üzerinde tek tıkla seçilmesi yerine güvenilir ve açık bir `Edit group children`/`Regroup last` akışı kullanılıyor; nested group, keyboard shortcut ve daha ayrıntılı layer paneli sonraki ürünleştirme adımında denenmeli.
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

Bu spike yeni dış servis, ücretli API veya yeni deploy kullanmadı. Kullanıcı onayıyla public `kadihx34-bit/open-atlas` repository’sine push tamamlandı; son GitHub commit’i `26a5b01`dir.


## Increment 2 — Properties, direct child editing, local image assets

The Properties panel is now driven by the selected ODA object. Text content, font family, font size, fill color, X/Y position, width/height and rotation update the validated ODA document and create history entries. A render-version guard prevents overlapping async Fabric renders from duplicating canvas objects.

Group text remains editable without flattening. A double-click on a group routes the target text child into the same editable ODA object flow; the existing explicit child-edit/regroup controls remain available as a clear fallback. Child nodes remain separate objects in the group graph.

Local image upload is client-only. The selected file is resized to a bounded JPEG data URL, stored in `assets` with `assetId`, `source: "user-upload"`, dimensions and alt text, and represented on canvas as an editable `image` object. The object supports selection, moving, scaling, deletion, crop/cover scale, reset crop and replace-local-image. Auth, S3 and external upload are untouched. IndexedDB save/open was verified after an image-bearing draft reload; the image rendered again from the saved ODA asset. A failed IndexedDB write reports a quota-oriented message rather than silently losing the draft.

### Increment 2 browser evidence

| Flow | Result |
|---|---|
| Properties selection panel | Passed; text fields for content/font/size/color/X/Y/W/H/rotation rendered for selected object |
| Properties content update | Passed; browser input changed content and command count advanced from 4 to 25 |
| Local image upload | Passed; fixture rendered and Properties showed `assetId` plus replace/crop controls |
| Replace image | Passed; second fixture visibly replaced the first image and toast reported `Görsel değiştirildi` |
| Crop/cover | Passed; range changed from `1` to `1.7`, image visibly zoomed and history advanced |
| Save draft | Passed; IndexedDB toast reported `ODA taslağı IndexedDB'ye kaydedildi` |
| Open draft after reload | Passed; image-bearing draft reopened and rendered from the local asset data URL |
| Font-ready export | Passed; browser reported `2x PNG export hazırlandı` |
| Exported PNG | Passed; `/home/ubuntu/Downloads/open-design-atlas-1080x1080@2x (1).png` measured `2160×2160`, RGBA, 184,677 bytes |
| ODA local image contract | Passed; Vitest now covers declared user-upload asset plus crop metadata |

### Increment 2 remaining DENENMELİ items

1. Safari/iOS and Firefox behavior for file input, IndexedDB quota and 2x export still needs device-level verification.
2. Very large images, private browsing and near-quota IndexedDB behavior should be tested with representative files; the implementation currently bounds the decoded image to 1400px and reports write failures.
3. Crop currently stores a deterministic cover scale, not a freeform focal-point crop; a richer crop UI can follow without changing the asset/object split.
4. Nested groups and a dedicated layers panel remain a later productization step.
5. MCP/LLM patch application remains intentionally out of scope for this increment.


Latest browser captures for this increment include `/home/ubuntu/screenshots/3000-il9yojhtwmwpktl_2026-11-08_10-51-58_8236.webp` for replace, `/home/ubuntu/screenshots/3000-il9yojhtwmwpktl_2026-11-08_10-52-07_8933.webp` for crop scale `1.7`, and `/home/ubuntu/screenshots/3000-il9yojhtwmwpktl_2026-11-08_10-49-21_2194.webp` plus the subsequent Open draft capture for image-bearing persistence. The explicit `Edit group children` fallback was browser-verified; exact pointer targeting of nested Fabric subTargets for a double-click should still be tested across device/browser combinations.


Final group-intact verification: the selected typographic group exposed `Edit text child in place`; clicking it produced `Group child text editing — group intact`, selected the nested `type-kicker-*` child, opened its Content/Font/Size/Color Properties fields, and left the group rendered as a group. This is the supported equivalent interaction for browsers where Fabric sub-target double-click hit testing varies.
