import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, Copy, Database, ExternalLink, Search, X } from "lucide-react";
import { toast } from "sonner";
import type registryType from "../data/uiverse-registry.json";

type RegistryComponent = (typeof registryType.components)[number];

const PAGE_SIZE = 24;
const categoryOrder = ["ALL", "Buttons", "Loaders", "Inputs", "Cards", "Checkboxes", "Forms", "Text", "Toggle switches"];

function previewFor(item: RegistryComponent, large = false) {
  return `<style>body{margin:0;min-height:100%;display:grid;place-items:center;background:#17181b;overflow:hidden;padding:${large ? "28px" : "12px"}}*{box-sizing:border-box}${item.code.css}</style>${item.code.html}`;
}

function RegistryDetail({ item, onClose }: { item: RegistryComponent; onClose: () => void }) {
  const snippet = `${item.code.html}\n\n${item.code.css}`;
  const mcpRecord = JSON.stringify({ id: item.id, name: item.name, category: item.category, slug: item.slug, source: item.source, license: item.license, attribution: item.attribution, sourceUrl: item.sourceUrl, code: item.code }, null, 2);
  return <div className="component-modal-backdrop" role="presentation" onClick={onClose}><section className="component-modal registry-detail" role="dialog" aria-modal="true" aria-label={`${item.name} registry bileşeni`} onClick={(event) => event.stopPropagation()}><div className="modal-head"><div><span className="section-kicker">{item.category} / {item.license}</span><h3>{item.name}</h3></div><button onClick={onClose} aria-label="Bileşen panelini kapat"><X size={18} /></button></div><div className="modal-preview"><iframe title={`${item.name} büyük önizleme`} sandbox="" srcDoc={previewFor(item, true)} /></div><div className="registry-detail-meta"><span><b>MIT</b> {item.source}</span><span>ATTRIBUTION: {item.attribution}</span></div><div className="modal-code"><div><span>HTML / CSS</span><button onClick={() => { navigator.clipboard?.writeText(snippet); toast.success("Uiverse kodu kopyalandı"); }}><Copy size={14} /> KOPYALA</button></div><pre>{snippet.slice(0, 1300)}{snippet.length > 1300 ? "\n…" : ""}</pre></div><div className="registry-json"><div><span>MCP-READY JSON</span><button onClick={() => { navigator.clipboard?.writeText(mcpRecord); toast.success("MCP JSON kopyalandı"); }}><Copy size={14} /> JSON KOPYALA</button></div><pre>{mcpRecord.slice(0, 900)}{mcpRecord.length > 900 ? "\n…" : ""}</pre></div><div className="modal-foot"><span>Kaynak: {item.sourceUrl}</span><a href={item.sourceUrl} target="_blank" rel="noreferrer">Uiverse kaynağı <ExternalLink size={13} /></a></div></section></div>;
}

export default function UiverseRegistryExplorer() {
  const [registry, setRegistry] = useState<{ total: number; components: RegistryComponent[] } | null>(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("ALL");
  const [license, setLicense] = useState("ALL");
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<RegistryComponent | null>(null);

  useEffect(() => { import("../data/uiverse-registry.json").then((module) => setRegistry(module.default)); }, []);
  const categories = useMemo(() => {
    if (!registry) return categoryOrder;
    const available = Array.from(new Set(registry.components.map((item) => item.category)));
    return ["ALL", ...categoryOrder.slice(1).filter((item) => available.includes(item)), ...available.filter((item) => !categoryOrder.includes(item)).sort()];
  }, [registry]);
  const filtered = useMemo(() => registry?.components.filter((item) => (category === "ALL" || item.category === category) && (license === "ALL" || item.license === license) && `${item.name} ${item.category} ${item.slug}`.toLowerCase().includes(query.toLowerCase())) ?? [], [registry, category, license, query]);
  const visible = filtered.slice(0, (page + 1) * PAGE_SIZE);
  const resetFilters = (nextCategory = category) => { setCategory(nextCategory); setPage(0); };

  return <section className="component-library registry-library" id="uiverse-registry"><div className="section-head"><div><span className="section-kicker">03 / UIVERSE REGISTRY EXPLORER</span><h2>3.802 bileşen.<br /><em>tek atlas.</em></h2><p className="registry-intro">18 canlı primitive demosundan ayrı olarak Uiverse Galaxy arşivinin tamamını burada ara, kategoriye göre daralt ve bileşeni dahili panelde aç.</p></div><div className="component-stat"><b>Uiverse Galaxy</b><span>MIT / HTML + CSS / MCP-READY JSON</span><small><Database size={13} /> {registry?.total ?? "3.802"} kayıt</small></div></div><div className="registry-toolbar"><label className="component-search"><Search size={16} /><input value={query} onChange={(event) => { setQuery(event.target.value); setPage(0); }} placeholder="3.802 bileşende ara..." /></label><div className="registry-toolbar-note">{filtered.length.toLocaleString("tr-TR")} sonuç / {registry?.total.toLocaleString("tr-TR") ?? "3.802"} kayıt</div></div><div className="registry-mcp-strip"><div><span>MCP READY</span><b>/api/mcp</b></div><p>Streamable HTTP · tools/list · tools/call · search_components · get_component</p><a href="/api/mcp/registry/stats" target="_blank" rel="noreferrer">STATS JSON <ArrowUpRight size={13} /></a></div><div className="registry-filter-row"><span>LİSANS</span>{["ALL", "MIT"].map((item) => <button key={item} className={license === item ? "selected" : ""} onClick={() => { setLicense(item); setPage(0); }}>{item}</button>)}</div><div className="component-categories registry-categories">{categories.map((item) => <button key={item} className={category === item ? "selected" : ""} onClick={() => resetFilters(item)}>{item}</button>)}</div>{!registry && <div className="component-loading">LOCAL REGISTRY YÜKLENİYOR / 3.802 BİLEŞEN HAZIRLANIYOR...</div>}<div className="component-grid registry-grid">{visible.map((item) => <button className="component-card" key={item.id} onClick={() => setSelected(item)}><div className="component-preview"><iframe title={`${item.name} önizleme`} sandbox="" srcDoc={previewFor(item)} /></div><div className="component-meta"><span>{item.category}</span><b>{item.name}</b><small>MIT · {item.source}</small></div></button>)}</div>{registry && visible.length < filtered.length && <button className="registry-load-more" onClick={() => setPage((current) => current + 1)}>DAHA FAZLA GÖSTER <span>{visible.length} / {filtered.length}</span></button>}<div className="component-foot"><span>{visible.length.toLocaleString("tr-TR")} sonuç görünür · sayfa başına {PAGE_SIZE}</span><a href="https://github.com/uiverse-io/galaxy" target="_blank" rel="noreferrer">Galaxy arşivini gör <ArrowUpRight size={14} /></a></div>{selected && <RegistryDetail item={selected} onClose={() => setSelected(null)} />}</section>;
}
