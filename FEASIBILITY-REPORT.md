# Open Design Atlas — Fizibilite Raporu

## 1. Mevcut yapı

### Ürün omurgası

Open Design Atlas şu anda 1080×1080 sosyal medya editörü değil; UI/UX kaynaklarını, yerel bileşen registry’sini, Three.js sahnelerini, GLB Asset Lab’ı ve 12 dahili site taslağını tek bir görsel atlas içinde sunan full-stack bir showcase uygulamasıdır. Çalışma kopyasının son commit’i `45bd93c7` ve mevcut branch `main`dir.

Uygulama ana olarak iki rota kullanıyor:

- `/`: `Home.tsx` içinde atlas navigasyonu, kaynak indeksi, prompt bölümü, 18 primitive’li Local Component Library, 3.802 kayıtlı Uiverse Registry Explorer, 3D Library, Asset Lab ve 12 site taslağını birleştiriyor.
- `/templates/:slug`: `TemplateDetail.tsx` içinde 12 dahili taslağın ortak showcase kabuğunu, rota bazlı tema tokenlarını ve 3D taslaklarda çalışan R3F Canvas’ı sunuyor.

`/404` ve fallback route’ları `NotFound.tsx` ile ele alınıyor. `App.tsx`, Wouter `Switch`, `ErrorBoundary`, `ThemeProvider`, Radix `TooltipProvider` ve Sonner `Toaster` ile uygulama kabuğunu kuruyor.

### Bileşen düzeni

`client/src/components/` altında tekrar kullanılabilir UI ve atlas modülleri bulunuyor. İncelemede öne çıkanlar `UIPlayground`, `ComponentExplorer`, `UiverseRegistryExplorer`, `ThreeGallery`, `ThreeShowcase`, `GlbAssetLab`, `TemplatePreviewModal` ve hata sınırı bileşenidir. Radix/shadcn tabanlı primitive dosyaları da aynı dizinde duruyor. Büyük Uiverse datası `client/src/data/uiverse-registry.json` içinde lazy import ile yükleniyor; bu, başlangıç JS yükünü ayırıyor ama registry chunk’ını büyütüyor.

Backend tarafında:

- `server/registry.ts`: registry yükleme ve sorgulama.
- `server/mcpRegistry.ts`: read-only JSON rotaları ve gerçek MCP Streamable HTTP transport.
- `server/routers.ts`: tRPC registry prosedürleri, kimlik doğrulama ve korumalı GLB metadata kaydı.
- `server/db.ts` ve `server/storage.ts`: veritabanı ve S3 uyumlu metadata/file akışları.
- `drizzle/`: şema ve migration.

MCP yüzeyi `search_components`, `get_component`, `list_categories` ve `get_registry_stats` araçlarını sunuyor. GLB akışında girişsiz kullanım local-first IndexedDB önizleme olarak kalıyor; korumalı sunucu yüklemesi oturum gerektiriyor.

### Stil sistemi

Global stil `client/src/index.css` içinde Tailwind v4, `tw-animate-css` ve CSS değişkenleriyle kurulmuş. Görsel dil “Signal Atlas” neo-editorial digital brutalism: grafit arka plan, bone/paper yüzey, Signal Cobalt `#315CFF`, Vermilion `#F05A3C`, blueprint grid ve düşük süreli micro-interaction’lar.

Tema tokenları global olarak `--background`, `--foreground`, `--card`, `--primary`, `--border` ve `--ring` üzerinden yönetiliyor. Template rotalarında buna ek olarak surface, foreground, accent, shadow, font ve radius tokenları inline CSS değişkenlerine dönüştürülüyor. Motion ilkeleri CSS transition, transform/opacity ağırlığı ve reduced-motion desteği etrafında şekillenmiş.

### Build ve doğrulama akışı

`package.json` şu akışı tanımlıyor:

```text
pnpm dev    → tsx watch ile full-stack development server
pnpm check  → tsc --noEmit
pnpm test   → vitest run
pnpm build  → Vite production build + esbuild server bundle
pnpm start  → production server
```

Bu inceleme sırasında sonuçlar:

- `pnpm check`: başarılı.
- `pnpm test`: başarılı; 3 test dosyası, 5 test.
- `pnpm build`: başarılı.
- Build sırasında Tailwind’in `:has(*:is(:last))` seçicisi için bir CSS optimizasyon uyarısı görüldü; build’i durdurmuyor ve bu rapor aşamasında kod değiştirilmedi.
- Ana uygulama build’i, Uiverse registry chunk’ının minified olarak yaklaşık 12 MB olması nedeniyle büyük chunk uyarısı veriyor. Bu teknik borçtir; işlevsel hata değildir.

### Bu yapının editör açısından anlamı

Mevcut `package.json` içinde Fabric.js yok; doğrudan bir canvas editör state modeli, undo/redo geçmişi, layer paneli, seçim modeli, text editing, image asset lifecycle’ı veya 1080×1080 export pipeline’ı da bulunmuyor. R3F Canvas ve GLB preview var, ancak bunlar 2D sosyal medya tasarım nesnesi editörünün yerine geçmiyor. Dolayısıyla editör, mevcut atlasın içine yeni bir ürün yüzeyi olarak eklenmelidir; mevcut `Home` ve template rotalarının editöre dönüştürülmesi risklidir.

## 2. 1080×1080 editör temeli: iki yol

### A. Fabric.js tabanlı açık kaynak editör entegrasyonu

Fabric.js interaktif canvas, seçim, sürükleme, ölçekleme, döndürme, skew, çizim, gruplama, viewport dönüşümü, text editing, image filtering ve JSON/SVG/image export için hazır bir nesne modeli sağlar. Resmi dokümantasyon, canvas state’inin JSON’a serialize/deserialize edilebildiğini; ancak custom controls ve handler’ların state’e değil uygulama koduna ait olduğunu açıkça belirtiyor. Bu ayrım, AI çıktısının sonradan elle düzenlenebilir kalması için önemlidir. [1] [2]

İzole testte `clawnify/OpenDesign` klonlandı, bağımlılıkları kuruldu ve production build başarıyla tamamlandı. Bu repository MIT lisanslı, Preact + Fabric.js + Tailwind + Hono + SQLite kullanıyor; 1080×1080 LinkedIn Square canvas preset’i, text/shapes/images, template fields, undo/redo, auto-save, 2x PNG export ve JSON export içeriyor. README’deki mimari, Fabric canvas state’ini doğrudan kaydetme ve template field’larını isimlendirilmiş text/image nesneleri olarak doldurma yaklaşımını gösteriyor. [3]

İkinci bir referans olan `Davronov-Alimardon/canva-clone`, Fabric.js’i Next.js, Drizzle, Auth.js, Replicate, Unsplash ve Stripe ile birleştiren daha geniş bir SaaS örneği. Bu örnek Apache-2.0 lisanslıdır, ancak kurulumda birçok dış servis ve hesap gerektirir; Open Design Atlas’a olduğu gibi taşınması yüksek entegrasyon maliyeti yaratır. [4]

**Maliyet:** Orta-yüksek. Canvas çekirdeği, seçim ve serialize/deserialize hazır gelir; fakat mevcut React 19 + Vite + Express/tRPC + Drizzle omurgasına Preact/Hono/SQLite tabanlı klonu komple taşımak yerine yalnızca editor katmanını almak gerekir. Template, layer, command history, image upload, font loading, export, keyboard shortcuts ve accessibility entegrasyonu yine yapılmalıdır.

**Bakım:** Orta. Fabric.js sürüm yükseltmeleri ve custom object serialization dikkat ister. JSON state ile UI state’in ayrılması, font/image kaynaklarının yeniden yüklenmesi ve custom properties için tip güvenliği gerekir. Açık kaynak klonun tamamını fork etmek, upstream değişiklikleri almak ve mevcut stack ile çatışmaları çözmek daha pahalıdır; editör motorunu referans alıp yeni bir `SocialPostEditor` modülü olarak entegre etmek daha sağlıklıdır.

**Görsel kalite:** En yüksek başlangıç kalitesi. Drag/resize/rotate, metin düzenleme, image filters, grouping ve export gibi temel davranışlar sıfırdan yazılmaz. Ancak “Canva kalitesi” yalnızca Fabric’den gelmez; snapping, rulers, guides, keyboard UX, template system, typography, asset management ve responsive editor chrome ayrıca tasarlanmalıdır.

**Risk:** Açık kaynak bir “Canva clone”u komple projeye yapıştırmak. OpenDesign’ın Preact/Hono/SQLite mimarisi ve Davronov örneğinin Next.js/çoklu dış servis mimarisi mevcut full-stack proje ile aynı değildir. Klon test edilmiş olsa da Open Design Atlas’a doğrudan merge edilebilirliği **DENENMELİ**; bu rapor bunu yapmadı çünkü kullanıcı açıkça mevcut kodun değiştirilmemesini istedi.

### B. Mevcut yapının içinde hafif editörü sıfırdan kurmak

Bu yaklaşımda editör, `client/src/components/SocialPostEditor/` altında uygulamaya özel bir state modeli ve HTML/SVG/canvas render katmanı olarak yazılır. İlk sürümde yalnızca `text`, `rect`, `ellipse`, `image`, `line`, `group` ve `background` nesneleri desteklenir. Her nesne 1080×1080 logical coordinate space içinde tutulur; ekranda CSS transform ile zoom uygulanır. Basit seçim kutusu, drag, resize handle, rotate handle ve property paneli yazılabilir.

**Maliyet:** İlk prototip için düşük-orta; üretim kalitesi için yüksek. Basit bir proof-of-concept birkaç gün içinde kurulabilir, ancak text editing, image crop, high-DPI export, undo/redo, multi-select, snapping, keyboard navigation, accessibility, font loading ve browser edge-case’leri birikince Fabric.js’in hazır sunduğu alan yeniden yazılır.

**Bakım:** Nesne türleri az tutulursa kontrol yüksektir. Fakat ileride brush, SVG, masks, filters, rich text, grouping, custom controls ve export eklenirse bakım maliyeti hızla artar. AI’ın her değişikliğini güvenli şekilde doğrulamak daha kolay olabilir; çünkü izin verilen şema baştan bizim kontrolümüzde olur.

**Görsel kalite:** Dar bir sosyal post kapsamı için iyi olabilir. Atlas’ın mevcut art-directed CSS kimliğiyle daha doğal bütünleşir. Buna karşılık genel amaçlı bir Canva deneyimi, Fabric.js veya benzeri bir canvas motorunun yardımı olmadan daha geç ve daha pahalı elde edilir.

**Risk:** “Hafif” kapsamın zamanla tam editöre dönüşmesi. Kullanıcı 3.802 bileşen, 12 site ve 3D sistemden sonra editörde de genel amaçlı bir ürün bekleyeceği için scope creep olasılığı yüksektir.

### Karar

Klonu gerçek kurulum/build testiyle doğruladıktan sonra bile iki seçeneğin sonucu şudur: Open Design Atlas için **tam klon fork’u değil, Fabric.js motorunu bağımsız bir `SocialPostEditor` modülüne entegre etmek** daha dengeli yoldur. Bu, A yolunun nesne manipülasyonu ve serileştirme avantajını alır; B yolunun mevcut stack’e uygun ürün sınırını korur.

Ancak bu bir uygulama kararıdır ve kullanıcı onayı olmadan kodlanmamalıdır. Önce küçük bir teknik spike ile şu maddeler **DENENMELİ**:

1. Fabric.js 6’nın mevcut React 19/Vite bundle’ı ve SSR’siz client-only yüklemesi.
2. `1080×1080` logical canvas’ın responsive editor shell içinde retina export davranışı.
3. Font yükleme ve export sırasında fontların gerçekten hazır olması.
4. Fabric JSON’un hedef AI sözleşmesine dönüştürülmesi ve tekrar yüklenmesi.
5. IndexedDB local draft + mevcut auth/S3 asset akışının birlikte çalışması.
6. Büyük Uiverse registry chunk’ının editör ilk yükünü yavaşlatmaması.

## 3. AI tasarım nesnesi sözleşmesi

### Hedef

LLM yalnızca izin verilen nesne türleriyle, 1080×1080 koordinat uzayında, tekrar yüklenebilir ve elle düzenlenebilir bir belge üretmelidir. LLM doğrudan HTML/CSS, arbitrary JavaScript, SVG filter, data URI veya Fabric’in kontrol/runtime alanlarını yazmamalıdır. Render katmanı JSON’u doğruladıktan sonra Fabric nesnelerine dönüştürür.

### Önerilen belge şeması

```json
{
  "schemaVersion": "oda.design/1.0",
  "document": {
    "id": "design_01HXYZ",
    "name": "Atlas Launch Post",
    "width": 1080,
    "height": 1080,
    "background": { "type": "solid", "color": "#111214" },
    "safeArea": { "x": 64, "y": 64, "width": 952, "height": 952 }
  },
  "fonts": [
    { "family": "Inter", "weight": 700, "style": "normal" }
  ],
  "assets": [
    {
      "id": "asset_logo",
      "kind": "image",
      "src": "https://example.invalid/logo.png",
      "alt": "Open Design Atlas logo",
      "width": 512,
      "height": 512,
      "source": "user-upload"
    }
  ],
  "objects": [
    {
      "id": "obj_title",
      "type": "text",
      "name": "headline",
      "x": 96,
      "y": 148,
      "width": 820,
      "height": 180,
      "rotation": 0,
      "opacity": 1,
      "locked": false,
      "visible": true,
      "zIndex": 2,
      "content": "Design the next signal",
      "style": {
        "fontFamily": "Inter",
        "fontSize": 88,
        "fontWeight": 700,
        "lineHeight": 1.05,
        "letterSpacing": -1.5,
        "textAlign": "left",
        "fill": "#F2F0E9"
      }
    },
    {
      "id": "obj_card",
      "type": "rect",
      "name": "accent-card",
      "x": 96,
      "y": 420,
      "width": 888,
      "height": 390,
      "rotation": 0,
      "opacity": 1,
      "locked": false,
      "visible": true,
      "zIndex": 1,
      "style": {
        "fill": "#315CFF",
        "stroke": null,
        "strokeWidth": 0,
        "radius": 16
      }
    }
  ],
  "metadata": {
    "createdBy": "human-or-ai",
    "lastOperation": "create",
    "editable": true
  }
}
```

### İzinli nesne türleri

İlk sürümde allowlist şu türlerle sınırlandırılmalı: `background`, `text`, `rect`, `ellipse`, `line`, `image` ve isteğe bağlı olarak `group`. `group` yalnızca child object referanslarıyla ve derinlik sınırıyla kabul edilmelidir. İlk sürümde `path`, arbitrary SVG, video, iframe, HTML embed, raw CSS, script, shader, external font file ve executable URL reddedilmelidir.

Tüm nesnelerde zorunlu kimlik, `x/y/width/height`, rotation, opacity, visible, locked ve zIndex alanları bulunmalı; koordinatlar belge sınırlarına göre kontrol edilmelidir. `width` ve `height` pozitif ve makul üst sınır içinde olmalıdır. `opacity` 0–1, rotation finite number, renkler parse edilebilir hex/rgb/hsl biçiminde olmalıdır. `image.src` yalnızca önceden yüklenmiş asset ID veya izin verilen asset URL sınıfından gelebilmelidir; LLM’in keyfi uzak URL çağırmasına izin verilmemelidir.

### İzinli font listesi

İlk güvenli liste: `Inter`, `IBM Plex Sans`, `IBM Plex Mono`, `Space Grotesk`, `Source Sans 3`, `Roboto`, `Open Sans`, `Montserrat`, `Poppins`, `Playfair Display`, `Lora`, `Merriweather` ve `Raleway`. Bu liste, mevcut Atlas görsel dili ile izole Fabric klonunda görülen açık font seçeneklerini birleştirir. Font dosyaları uygulama tarafından bilinen katalogdan yüklenmeli; AI yalnızca `family`, `weight` ve `style` seçmelidir. Kullanıcı font yükleme özelliği istenirse ayrı bir asset/font izin akışı gerekir; bu durum **DENENMELİ**.

### Geçersiz çıktıyı reddetme

LLM çıktısı önce JSON parse, sonra Zod/JSON Schema doğrulamasından geçmelidir. Doğrulama sırası şu şekilde olmalı:

1. JSON object değilse reddet.
2. `schemaVersion` desteklenen sürüm değilse reddet.
3. Bilinmeyen top-level veya object alanları varsa `strict` schema ile reddet.
4. Object ID’leri benzersiz değilse reddet.
5. Nesne türü allowlist’te değilse reddet.
6. Sayısal alanlar finite değilse, negatif veya üst sınır dışındaysa reddet.
7. Font family allowlist’te değilse reddet.
8. Asset referansı mevcut değilse veya kaynak politikaya uymuyorsa reddet.
9. Metin uzunluğu, group derinliği, nesne sayısı ve toplam payload limitini aşarsa reddet.
10. `script`, `on*` event, `javascript:`, `data:text/html`, arbitrary HTML/CSS/SVG filter veya external executable içerik görülürse reddet.
11. Belge safe area ve collision kuralları ihlal ediyorsa sert hata veya kullanıcıya gösterilen düzeltme uyarısı üret.

LLM değişiklikleri tam belge yerine patch olarak üretiyorsa patch sözleşmesi ayrıca allowlist’lenmelidir:

```json
{
  "schemaVersion": "oda.patch/1.0",
  "operations": [
    { "op": "add", "path": "/objects/-", "value": { "type": "text", "id": "obj_new" } },
    { "op": "replace", "path": "/objects/obj_title/content", "value": "New headline" },
    { "op": "move", "id": "obj_card", "x": 120, "y": 450 }
  ]
}
```

Uygulama patch’i önce mevcut belgeye karşı uygular, sonra tam belgeyi tekrar validate eder. Başarısız işlem atomik olarak geri alınır; kısmi, bozuk veya doğrudan render edilmiş bir çıktı canvas’a uygulanmaz. Her kabul edilen işlem undo/redo geçmişine bir command olarak yazılmalıdır. Böylece AI değişikliği insan tarafından geri alınabilir, nesne seçilebilir ve property panelinden düzenlenebilir kalır.

### Edit edilebilirliği koruyan mimari kural

AI hiçbir zaman son PNG/JPEG/SVG çıktısını “asıl kaynak” olarak kaydetmemelidir. Kaynak gerçeklik doğrulanmış ODA JSON belgesidir. Fabric.js kullanılırsa Fabric nesneleri bu şemadan üretilir; Fabric’in ham JSON’u persistence formatı değil, render adapter state’i olarak tutulmalıdır. Export yalnızca türetilmiş çıktı olmalıdır.

## GitHub paylaşımı durumu

`kadihx34-bit/open-atlas` repository’si bulundu, açık (public) durumda ve GitHub hesabı için `ADMIN` yetkisi mevcut. Repository şu anda boş; default branch adı boş görünüyor ve Contents API “This repository is empty” döndürüyor.

Yerel çalışma kopyasının `origin` remote’u GitHub değil, Manus artifact remote’udur. Bu nedenle doğrudan push yapılırsa hedef GitHub repository’sine gitmez. GitHub’a paylaşmak için hedef remote’un `https://github.com/kadihx34-bit/open-atlas.git` olarak eklenmesi/değiştirilmesi ve mevcut `main` branch’inin push edilmesi gerekir.

Bu rapor ve `todo.md` dışında hiçbir proje kodu değiştirilmedi. GitHub’a henüz push yapılmadı. Push işlemi dış serviste kalıcı, herkese açık bir yayınlama olduğu için son adım olarak açık onay beklemektedir. Ayrıca `todo.md` içinde kalan GitHub maddesi, push başarılı olana kadar tamamlanmamıştır.

## Sonuç

Teknik olarak proje sağlam bir atlas/showcase temeline sahip: type check, 5 test ve production build başarılıdır. 1080×1080 editör için en düşük toplam risk, tam bir Canva clone’u fork etmek değil, Fabric.js motorunu izole bir `SocialPostEditor` modülüne almak ve AI sözleşmesini Fabric’in üzerinde uygulamaktır. Bu seçim kullanıcı onayı olmadan uygulanmamalıdır; ilk kod adımı bir spike ve yukarıdaki **DENENMELİ** maddelerinin doğrulanması olmalıdır.

### References

[1]: https://fabricjs.com/docs/core-concepts/ "Fabric.js Core Concepts"
[2]: https://fabricjs.com/ "Fabric.js official features"
[3]: https://github.com/clawnify/OpenDesign "OpenDesign — MIT open-source Canva alternative"
[4]: https://github.com/Davronov-Alimardon/canva-clone "Davronov-Alimardon canva-clone — Apache-2.0"
