# Open Design Atlas — Registry ve MCP Sözleşmesi

## Mevcut durum

Open Design Atlas'ın statik MVP'si, Uiverse Galaxy deposundan import edilen **3.802 MIT lisanslı bileşeni** `client/src/data/uiverse-registry.json` içinde machine-readable biçimde taşır. Arayüz bu registry'yi lazy-load eder; bileşenleri kategori ve metin aramasıyla süzer, güvenli sandbox iframe içinde önizler ve seçilen bileşenin HTML/CSS kodunu panoya kopyalar.

Bu proje şu anda bir MCP sunucusu değildir ve sitenin ziyaretçisinin kişisel MCP araçlarına doğrudan erişemez. MCP bağlantısı için sonraki teknik adım, bu registry dosyasını okuyan küçük bir backend veya ayrı bir remote MCP server expose etmektir. Statik MVP'de bunun yerine MCP'ye uygun bir veri sözleşmesi hazırlanmıştır.

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

## Önerilen MCP araçları

İleride backend/MCP katmanı eklendiğinde önerilen salt-okunur araçlar `search_components(query, category, limit)`, `get_component(id)`, `list_categories()` ve `get_registry_stats()` olarak tasarlanmalıdır. `get_component` sonucu lisans ve attribution alanlarını kodla birlikte döndürmeli; lisans bilgisi olmayan kayıtlar kopyalanabilir kod olarak yayımlanmamalıdır.

## Lisans politikası

Uiverse Galaxy deposu README'sinde arşivin MIT lisanslı olduğu ve bileşenlerin Uiverse platformundan otomatik kürate edilerek yüklendiği belirtilir. Bu proje kayıtlarda `MIT` ve `Uiverse.io community creator` attribution alanlarını korur. Başka bir kaynağın içeriği, lisansı ve yeniden dağıtım izni ayrı ayrı doğrulanmadan registry'ye kod olarak eklenmemelidir. Lisans belirsizse yalnızca kaynak kartı ve orijinal bağlantı eklenir.

## Özel kullanım notu

Kullanıcı bu atlası kişisel kullanım için çalıştırabilir; ancak “özel kullanım” üçüncü taraf lisanslarını otomatik olarak geçersiz kılmaz. Bu nedenle her import çalıştırmasında kaynak URL'si, lisans ve attribution korunmalı; registry'nin public deploy edilip edilmeyeceği Management UI görünürlük ayarından ayrıca belirlenmelidir.

## Kaynaklar

[1]: https://github.com/uiverse-io/galaxy "Uiverse Galaxy — MIT licensed component archive"
[2]: https://uiverse.io/ "Uiverse — original browsing platform"
