# Open Design Atlas

Open Design Atlas, UI/UX kaynaklarını, kopyalanabilir bileşenleri, motion pattern’lerini, Three.js sahnelerini ve 12 dahili site şablonunu tek bir görsel çalışma alanında birleştiren full-stack bir tasarım atlasıdır.

## Öne çıkan yüzeyler

| Yüzey | Kapsam |
|---|---|
| Local Component Library | 18 canlı primitive: button, input, dialog, tabs, table, tooltip, accordion ve daha fazlası |
| Uiverse Registry Explorer | Uiverse Galaxy’den gelen 3.802 kayıt; kategori arama, kademeli listeleme, sandbox preview, HTML/CSS ve MCP JSON |
| 3D Library | Three.js / React Three Fiber tabanlı art-directed sahneler, fallback ve reduced-motion davranışları |
| Asset Lab | Girişsiz local-first GLB önizleme, IndexedDB kalıcılığı ve hotspot yerleşimi |
| Templates | Gerçek rotalara sahip 12 tema ve 3D product-story deneyimi |
| MCP | Streamable HTTP transport ve registry araçları |

## Yerel geliştirme

```bash
pnpm install
pnpm dev
```

TypeScript, production build ve Vitest kontrolleri için:

```bash
pnpm exec tsc --noEmit
pnpm run build
pnpm test
```

Full-stack çalışma için Manus tarafından sağlanan environment değişkenleri gerekir. `.env` dosyalarını veya gizli anahtarları repository’ye commit etmeyin.

## Registry Explorer

`03A / UIVERSE REGISTRY` menüsü, 18 canlı primitive demosundan ayrıdır. Explorer; 3.802 kaydı kategoriye göre filtreler, metin araması yapar, ilk 24 kaydı yükler ve “DAHA FAZLA GÖSTER” ile ilerlemeli olarak genişler. Her kayıt sandbox iframe içinde önizlenir; detay paneli HTML/CSS kodunu, attribution bilgisini ve MCP-ready JSON kaydını gösterir.

Arşiv kaynağı ve lisans bilgisi: [Uiverse Galaxy](https://github.com/uiverse-io/galaxy). Import edilen kayıtlar için `MIT` ve `Uiverse.io community creator` attribution alanları korunur.

## MCP kullanımı

Makine istemcileri için Streamable HTTP endpoint:

```text
POST /api/mcp
GET  /api/mcp/registry?query=button&category=Buttons&limit=24
GET  /api/mcp/registry/categories
GET  /api/mcp/registry/stats
GET  /api/mcp/registry/:id-or-slug
```

MCP oturumu initialize isteğiyle başlatılır. Sunucu `tools/list` ve `tools/call` üzerinden `search_components`, `get_component`, `list_categories` ve `get_registry_stats` araçlarını sunar. Hızlı REST-benzeri GET rotaları tarayıcı, script ve sağlık kontrolü için kullanılabilir.

```bash
curl "$ATLAS_URL/api/mcp/registry/stats"
curl "$ATLAS_URL/api/mcp/registry?query=loader&limit=12"
```

Ayrıntılı sözleşme için [`MCP-REGISTRY.md`](./MCP-REGISTRY.md) dosyasına bakın.

## Lisans ve kullanım

Bu repository’deki registry kayıtları kaynak, lisans ve attribution bilgileriyle birlikte tutulur. Başka kaynaklardan içerik eklemeden önce yeniden dağıtım iznini doğrulayın. Sunucuya ait environment değerlerini, kullanıcı yüklemelerini veya kişisel verileri GitHub’a göndermeyin.
