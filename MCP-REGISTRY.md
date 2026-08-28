# Open Design Atlas — Registry ve MCP Sözleşmesi

## Mevcut durum

Open Design Atlas, Uiverse Galaxy deposundan import edilen **3.802 MIT lisanslı bileşeni** `client/src/data/uiverse-registry.json` içinde machine-readable biçimde taşır. Registry lazy-load edilir; `03A / UIVERSE REGISTRY EXPLORER` ekranında arama, kategori filtreleri, kademeli listeleme, sandbox iframe önizlemesi, HTML/CSS kopyalama ve MCP-ready JSON görünür.

Backend tarafında `/api/mcp` üzerinde gerçek **MCP Streamable HTTP transport** aktiftir. Ayrıca tarayıcı ve basit script kullanımı için read-only GET rotaları yayınlanır.

## Bileşen kaydı

Her kayıt aşağıdaki alanları taşır:

| Alan | Tür | Açıklama |
|---|---|---|
| `id` | string | Atlas içindeki sabit kayıt kimliği. |
| `name` | string | Bileşenin okunabilir adı. |
| `category` | string | Kaynak klasöründen gelen kategori. |
| `slug` | string | Kaynak dosyanın slug değeri. |
| `source` | string | Kaynağın adı. |
| `license` | string | Kayıt için doğrulanan lisans. |
| `attribution` | string | Kaynak sahibine atıf bilgisi. |
| `sourceUrl` | string | Orijinal platform bağlantısı. |
| `code.html` | string | Sandbox önizlemesinde ve kopyalama akışında kullanılan markup. |
| `code.css` | string | Sandbox önizlemesinde ve kopyalama akışında kullanılan stil. |

## Streamable HTTP MCP

MCP istemcisi `POST /api/mcp` ile initialize isteği göndererek oturum açar. Yanıtın `Mcp-Session-Id` değerini sonraki isteklerde aynı header ile taşımak gerekir. Sunucu `tools/list` ve `tools/call` yöntemlerini destekler.

| Araç | Girdi | Amaç |
|---|---|---|
| `search_components` | `query?`, `category?`, `limit?` | Registry içinde arama yapar; limit 1–100 arasındadır. |
| `get_component` | `id` | ID veya slug ile tek kayıt döndürür. |
| `list_categories` | yok | Registry’deki kategori listesini döndürür. |
| `get_registry_stats` | yok | Toplam kayıt, kaynak ve lisans metadatasını döndürür. |

Örnek MCP initialize gövdesi:

```json
{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-03-26","capabilities":{},"clientInfo":{"name":"atlas-client","version":"1.0.0"}}}
```

## Read-only GET rotaları

| Rota | Davranış |
|---|---|
| `GET /api/mcp/registry?query=&category=&limit=` | `search_components` eşdeğeri JSON yanıtı. |
| `GET /api/mcp/registry/categories` | `list_categories` eşdeğeri JSON yanıtı. |
| `GET /api/mcp/registry/stats` | `get_registry_stats` eşdeğeri JSON yanıtı. |
| `GET /api/mcp/registry/:id-or-slug` | `get_component` eşdeğeri JSON yanıtı. |

Tüm hızlı yanıtlar `protocol: open-design-atlas-mcp/v1` alanını taşır. Kayıt bulunamazsa tekil kayıt rotası HTTP 404 döndürür. Streamable MCP oturumu bulunmayan tool çağrıları güvenli şekilde HTTP 400 ile reddedilir.

## Lisans politikası

Uiverse Galaxy deposunun README ve lisans bilgileri arşivin MIT kapsamında olduğunu belirtir. Bu proje kayıtlarda `MIT` ve `Uiverse.io community creator` attribution alanlarını korur. Başka bir kaynağın içeriği, lisansı ve yeniden dağıtım izni ayrı ayrı doğrulanmadan registry’ye kod olarak eklenmemelidir. Lisans belirsizse yalnızca kaynak kartı ve orijinal bağlantı eklenir.

## Özel kullanım ve güvenlik

Atlas kişisel veya kapalı bir çalışma alanı olarak çalıştırılabilir; ancak “özel kullanım” üçüncü taraf lisanslarını geçersiz kılmaz. MCP endpoint’i registry verisini read-only olarak sunar ve kullanıcı yüklemelerini yayınlamaz. Production ortamında endpoint’i erişim katmanı, rate limiting ve uygun origin politikasıyla korumak önerilir. Environment değişkenleri ve kullanıcıya ait gizli veriler repository’ye commit edilmemelidir.

## Kaynaklar

[1]: https://github.com/uiverse-io/galaxy "Uiverse Galaxy — MIT licensed component archive"
[2]: https://uiverse.io/ "Uiverse — original browsing platform"
[3]: https://modelcontextprotocol.io/specification/2025-03-26/basic/transports "Model Context Protocol — Streamable HTTP transport"
