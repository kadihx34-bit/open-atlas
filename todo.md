

## SocialPostEditor increment 2
- [x] Properties panelinde seçili nesnenin text/font/size/color/position/size özelliklerini düzenle; ODA JSON ve undo/redo ile bağla.
- [x] Group içi text child’larını ungroup olmadan açık bir double-click/eşdeğer etkileşimle düzenle; açık `Edit group children` fallback’i koru.
- [x] Local image upload ile ODA assets assetId/sourceKind metadata ekle; canvas render, taşıma/ölçekleme/silme çalışsın.
- [x] Basit image crop/replace akışını ve IndexedDB draft davranışını ekle; büyük bitmap quota riskini raporla.
- [x] Unit/integration/browser testlerini, save/open/export ve yeni akış ekran görüntülerini doğrula; raporu güncelle.
- [x] Anlamlı commit(ler) ile public `open-atlas` repository’sine push et.


## Brand Kit + AI Patch preparation
- [x] ODA şemasına marka tokenları ekle: renkler, font setleri, logo/görsel asset referansları.
- [x] Editörde marka presetlerini uygula; tokenları editable nesnelere dönüştür, flatten kullanma.
- [x] JSON AI patch sözleşmesini Zod ile tanımla; allowlist ve güvenlik kurallarını ekle.
- [x] Deterministik mock patch üretici ve güvenli undo’lu uygulama katmanı ekle; gerçek LLM/API bağlama.
- [x] Patch üret → doğrula → uygula → geri al uçtan uca testini unit ve browser’da kanıtla.
- [x] Testler, ekran görüntüleri ve kalan DENENMELİ maddeleri rapora ekle.
- [x] Anlamlı commit ile public `open-atlas` repository’sine push et.
