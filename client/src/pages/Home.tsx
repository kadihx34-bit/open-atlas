// STYLE: Signal Atlas — editorial archive with fixed navigation, asymmetrical cards, blueprint coordinates, cobalt/vemilion signal accents.
import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { ArrowUpRight, Bookmark, Check, ChevronRight, Code2, Copy, ExternalLink, Figma, Github, Grid2X2, Layers3, Menu, Orbit, Search, Sparkles, X } from "lucide-react";
import type uiverseRegistryType from "../data/uiverse-registry.json";
import UIPlayground from "../components/UIPlayground";
import TemplatePreviewModal from "../components/TemplatePreviewModal";
import ComponentExplorer from "../components/ComponentExplorer";
import ThreeGallery from "../components/ThreeGallery";

const ThreeShowcase = lazy(() => import("../components/ThreeShowcase"));

const sources = [
  { name: "Uiverse", type: "UI ELEMENTS", title: "3,802 local open-source pieces", desc: "CSS, Tailwind, React ve Figma çıktılarıyla düğmelerden loader'lara kadar hızlı başlangıç yüzeyleri.", href: "https://uiverse.io/", tag: "Copy-ready", color: "cobalt", icon: Sparkles },
  { name: "Awesome Design Systems", type: "GITHUB REPO", title: "Sistemleri tek rotada keşfet", desc: "Açık kaynak design system, token ve pattern kütüphanelerini düzenli bir indeks gibi tara.", href: "https://github.com/alexpate/awesome-design-systems", tag: "Curated list", color: "paper", icon: Github },
  { name: "shadcn/ui Registry", type: "COMPONENTS", title: "Kopyalanabilir sistem mantığı", desc: "Kendi registry'ni kur, parçaları projenin içine al ve markana göre bük.", href: "https://ui.shadcn.com/docs/directory", tag: "Composable", color: "vermilion", icon: Code2 },
  { name: "Three.js", type: "3D WEB", title: "Web yüzeyine hacim ekle", desc: "WebGL'in karmaşıklığını yaratıcı prototipler ve etkileşimli 3D sahneler için yönet.", href: "https://threejs.org/", tag: "Explore 3D", color: "blue", icon: Orbit },
  { name: "Liquid Gooey", type: "MOTION", title: "Arayüzü akışkanlaştır", desc: "React için sıvı morph ve move efektleri; mikro etkileşimleri daha dokunsal hale getirmek için.", href: "https://gooey.jakubantalik.com/", tag: "React effect", color: "cobalt", icon: Orbit },
  { name: "Border Beam", type: "MOTION", title: "Dikkati kenarda dolaştır", desc: "Kart ve buton çevresinde hareket eden ışınla dikkat hiyerarşisi kur.", href: "https://beam.jakubantalik.com/", tag: "React effect", color: "paper", icon: Sparkles },
  { name: "Liquid Metal", type: "SHADERS", title: "Metali sıvı bir sinyale çevir", desc: "Parlak metal yüzeyleri ve kenar ışığını deneysel landing page'lere taşı.", href: "https://metal.jakubantalik.com/", tag: "WebGL effect", color: "vermilion", icon: Orbit },
  { name: "Thinking Orbs", type: "MOTION", title: "Düşünceyi kürelerle göster", desc: "Yükleme, bekleme veya üretim durumları için animasyonlu düşünce küreleri.", href: "https://orbs.jakubantalik.com/", tag: "Loader", color: "blue", icon: Orbit },
  { name: "Magic UI", type: "COMPONENTS", title: "150+ hareketli parça", desc: "React, Tailwind ve Motion ile hazırlanmış ücretsiz açık kaynak bileşenler ve efektler.", href: "https://magicui.design/", tag: "Open source", color: "cobalt", icon: Sparkles },
  { name: "Aceternity UI", type: "COMPONENTS", title: "Kopyala, sonra derinleştir", desc: "Animated cards, hero'lar, shader arka planları ve landing page blokları için güçlü katalog.", href: "https://ui.aceternity.com/components", tag: "Copy-paste", color: "paper", icon: Layers3 },
  { name: "React Three Fiber", type: "3D WEB", title: "Three.js'i React'e bağla", desc: "Yeniden kullanılabilir, etkileşimli Three.js sahnelerini React ekosistemi içinde kur.", href: "https://docs.pmnd.rs/react-three-fiber/", tag: "Renderer", color: "vermilion", icon: Orbit },
  { name: "GSAP", type: "MOTION", title: "Her şeyi zamanla", desc: "JavaScript'in dokunabildiği her şeyi yüksek performanslı timeline'larla hareket ettir.", href: "https://gsap.com/", tag: "Animation", color: "blue", icon: Sparkles },
  { name: "Rive", type: "MOTION", title: "Animasyonu duruma bağla", desc: "Etkileşimli animasyonları tasarla, state'lerle kontrol et ve web runtime'ında çalıştır.", href: "https://rive.app/", tag: "Interactive", color: "cobalt", icon: Orbit },
  { name: "Codrops Creative Hub", type: "INSPIRATION", title: "Deneysel yüzeyleri incele", desc: "Açık kaynak web demoları, creative coding deneyleri ve etkileşimli konseptler.", href: "https://tympanus.net/codrops/hub/", tag: "Experiments", color: "paper", icon: Grid2X2 },
  { name: "Motion", type: "MOTION", title: "Arayüz hareketini sadeleştir", desc: "React, JavaScript ve Vue için production-grade animasyon kütüphanesi.", href: "https://motion.dev/", tag: "React motion", color: "vermilion", icon: Sparkles },
];

const prompts = [
  { no: "01", label: "LANDING PAGE", title: "Bir fikri lansman yüzeyine çevir", text: "Create an editorial SaaS landing page with a split hero, tactile product preview, sticky proof bar and a clear conversion route. Use asymmetric spacing, no generic gradient." },
  { no: "02", label: "DASHBOARD", title: "Veriyi sessizce organize et", text: "Design a dense but calm analytics dashboard with a persistent sidebar, one dominant metric, modular chart cards and a purposeful empty state." },
  { no: "03", label: "3D EXPERIENCE", title: "Derinliği davranışa bağla", text: "Build a 3D product showcase where camera movement responds to scroll, materials stay restrained and each interaction reveals a product decision." },
];

const templates = [
  { name: "Studio Index", kind: "PORTFOLIO", number: "A—01", accent: "#315CFF", layout: "Editorial / split", description: "A sharp home for an independent studio and its working archive.", components: ["Button", "Tabs", "Card"] },
  { name: "Orbit Commerce", kind: "COMMERCE", number: "A—02", accent: "#F05A3C", layout: "Catalog / immersive", description: "A product route that gives every object its own orbit.", components: ["Badge", "Dialog", "Pagination"] },
  { name: "Signal Console", kind: "DASHBOARD", number: "A—03", accent: "#315CFF", layout: "Data / dense", description: "A calm command center for metrics, states and next actions.", components: ["Table", "Progress", "Tooltip"] },
  { name: "Field Notes", kind: "EDITORIAL", number: "A—04", accent: "#E6E2D6", layout: "Reading / offset", description: "A quiet editorial surface for research, notes and references.", components: ["Input", "Accordion", "Avatar"] },
  { name: "Afterimage", kind: "CREATIVE", number: "A—05", accent: "#F05A3C", layout: "Gallery / motion", description: "A visual gallery with tactile transitions and sharp captions.", components: ["Carousel", "Hover card", "Toast"] },
  { name: "Northstar", kind: "STARTUP", number: "A—06", accent: "#315CFF", layout: "Conversion / proof", description: "A direct product story built around one confident signal.", components: ["Button", "Form", "Alert"] },
  { name: "Mono Archive", kind: "ARCHIVE", number: "A—07", accent: "#16171A", layout: "Index / grid", description: "A searchable index for a large collection of things.", components: ["Select", "Checkbox", "Pagination"] },
  { name: "Soft Circuit", kind: "PRODUCT", number: "A—08", accent: "#E6E2D6", layout: "Product / soft", description: "A product page balancing warmth, utility and a clear next step.", components: ["Switch", "Slider", "Sheet"] },
  { name: "Data Bloom", kind: "ANALYTICS", number: "A—09", accent: "#F05A3C", layout: "Charts / modular", description: "A data surface where dense information still has room to breathe.", components: ["Chart", "Tabs", "Skeleton"] },
  { name: "Deep Orbit", kind: "3D WEB", number: "A—10", accent: "#315CFF", layout: "Canvas / immersive", description: "A spatial landing page where the interface becomes a scene.", components: ["Canvas", "Pointer", "Scroll"] },
];

function copyText(text: string) {
  navigator.clipboard?.writeText(text);
  toast.success("Prompt panoya kopyalandı", { description: "Kendi sistemine göre düzenlemeye başlayabilirsin." });
}

function MiniWireframe({ accent, variant }: { accent: string; variant: number }) {
  return <div className={`mini-wireframe variant-${variant}`} style={{ "--accent": accent } as React.CSSProperties}>
    <div className="wire-top"><span></span><span></span><span></span><b>{variant === 1 ? "STUDIO" : variant === 2 ? "ORBIT" : "SIGNAL"}</b></div>
    <div className="wire-body"><div className="wire-copy"><i></i><i></i><i></i><em></em></div><div className="wire-shape"></div></div>
    <div className="wire-foot"><span></span><span></span><span></span></div>
  </div>;
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [saved, setSaved] = useState<string[]>([]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [componentQuery, setComponentQuery] = useState("");
  const [componentCategory, setComponentCategory] = useState("ALL");
  type RegistryComponent = (typeof uiverseRegistryType.components)[number];
  const [registry, setRegistry] = useState<{ total: number; components: RegistryComponent[] } | null>(null);
  const [selectedComponent, setSelectedComponent] = useState<RegistryComponent | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<(typeof templates)[number] | null>(null);
  useEffect(() => { import("../data/uiverse-registry.json").then((module) => setRegistry(module.default)); }, []);
  const filters = ["ALL", "UI ELEMENTS", "SYSTEMS", "MOTION", "3D WEB", "SHADERS"];
  const filteredSources = useMemo(() => sources.filter((item) => {
    const matchesQuery = `${item.name} ${item.title} ${item.desc}`.toLowerCase().includes(query.toLowerCase());
    const matchesFilter = activeFilter === "ALL" || item.type === activeFilter || (activeFilter === "SYSTEMS" && item.type === "GITHUB REPO");
    return matchesQuery && matchesFilter;
  }), [query, activeFilter]);
  const toggleSave = (name: string) => setSaved((items) => items.includes(name) ? items.filter((item) => item !== name) : [...items, name]);
  const componentCategories = registry ? ["ALL", ...Array.from(new Set(registry.components.map((item) => item.category)))] : ["ALL"];
  const visibleComponents = registry ? registry.components.filter((item) => (componentCategory === "ALL" || item.category === componentCategory) && `${item.name} ${item.category}`.toLowerCase().includes(componentQuery.toLowerCase())).slice(0, 12) : [];

  return <div className="atlas-shell">
    <aside className={`atlas-sidebar ${mobileOpen ? "is-open" : ""}`}>
      <div className="brand-lockup"><div className="brand-mark"><span></span><span></span><span></span><span></span></div><div><strong>OPEN</strong><small>DESIGN ATLAS</small></div></div>
      <button className="close-mobile" onClick={() => setMobileOpen(false)} aria-label="Menüyü kapat"><X size={18} /></button>
      <div className="side-index"><span>INDEX / 2026</span><span>OD—001</span></div>
      <nav className="side-nav" aria-label="Ana navigasyon">
        <a className="active" href="#discover"><span>01</span>Discover <ChevronRight size={14} /></a>
        <a href="#prompts"><span>02</span>Prompts</a>
        <a href="#explorer"><span>03</span>Libraries / Explorer</a>
        <a href="#templates"><span>04</span>Templates</a>
        <a href="#systems"><span>05</span>Systems</a>
        <a href="#playground"><span>06</span>UI Playground</a>
        <a href="#three-gallery"><span>07</span>3D Library</a>
        <a href="#three-lab"><span>08</span>3D Lab</a>
      </nav>
      <div className="side-note"><span className="dot"></span><p>Bir sonraki yüzeyini<br /><b>buradan başlat.</b></p></div>
      <div className="side-footer"><span>CURATED BY OD</span><a href="https://github.com/alexpate/awesome-design-systems" target="_blank" rel="noreferrer">View source <ArrowUpRight size={12} /></a></div>
    </aside>

    <main className="atlas-main">
      <header className="topbar"><button className="menu-trigger" onClick={() => setMobileOpen(true)} aria-label="Menüyü aç"><Menu size={20} /></button><a className="top-brand" href="#discover"><div className="brand-mark"><span></span><span></span><span></span><span></span></div><strong>OPEN DESIGN ATLAS</strong></a><div className="breadcrumb"><span>ATLAS</span><ChevronRight size={13} /><b>DISCOVER</b></div><div className="top-actions"><span className="live-indicator"><i></i>LIVE INDEX</span><button className="saved-button" onClick={() => toast.info(`${saved.length} kaynak kaydedildi`)}><Bookmark size={15} /> {saved.length || "0"}</button></div></header>

      <section className="hero" id="discover">
        <div className="hero-copy"><div className="eyebrow"><span>OPEN SOURCE / DESIGN INTELLIGENCE</span><span>01—04</span></div><h1>Tasarımın<br /><em>kısa yolu.</em></h1><p>UI/UX kaynakları, prompt'lar, sistemler ve 3D web ilhamı. Dağınık sekmeleri tek bir küratörlü rotaya çevir.</p><a className="library-jump" href="#explorer"><Grid2X2 size={15} /> KÜTÜPHANELERİ KEŞFET <ArrowUpRight size={14} /></a><div className="hero-search"><Search size={18} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Kaynak, bileşen veya fikir ara..." /><kbd>⌘ K</kbd></div><div className="hero-meta"><span><b>128</b> ROTASİZ KAYNAK</span><span><b>24</b> TASLAK</span><span><b>07</b> 3D REFERANS</span></div></div>
        <div className="hero-art"><img src="/manus-storage/atlas-hero_86b5734a.jpg" alt="Kobalt ve vermilyon 3D atlas kompozisyonu" /><div className="hero-stamp">FIELD<br /><b>NOTES</b><br /><small>DESIGN / 26</small></div><div className="hero-coord">41° 01' 54.2" N<br />28° 58' 33.4" E</div></div>
      </section>

      <section className="section-block source-section" id="library"><div className="section-head"><div><span className="section-kicker">01 / LIBRARY INDEX</span><h2>Kütüphaneleri<br /><em>burada gör.</em></h2></div><a className="text-link" href="https://uiverse.io/elements" target="_blank" rel="noreferrer">Tüm kaynakları gör <ArrowUpRight size={15} /></a></div><div className="library-scope"><span className="scope-pin">i</span><p><b>Bu bölüm bir kaynak kataloğudur.</b> Diğer sitelerdeki tüm bileşenleri içeri aktarmıyoruz; ücretsiz kütüphaneleri kategori, teknoloji ve kullanım amacıyla küratörlü şekilde listeliyor, seni orijinal demoya yönlendiriyoruz.</p><span className="scope-count">14 KÜTÜPHANE</span></div><div className="filter-row">{filters.map((filter) => <button key={filter} className={activeFilter === filter ? "selected" : ""} onClick={() => setActiveFilter(filter)}>{filter}</button>)}</div><div className="source-grid">{filteredSources.map((item, index) => { const Icon = item.icon; return <article className={`source-card ${item.color}`} key={item.name}><div className="card-top"><span className="card-number">0{index + 1} / ROUTE STOP</span><button className={saved.includes(item.name) ? "is-saved" : ""} onClick={() => toggleSave(item.name)} aria-label={`Kaydet: ${item.name}`}><Bookmark size={16} fill={saved.includes(item.name) ? "currentColor" : "none"} /></button></div><div className="source-icon"><Icon size={24} strokeWidth={1.5} /></div><span className="card-type">{item.type}</span><div className="source-name">{item.name}</div><h3>{item.title}</h3><p>{item.desc}</p><div className="card-foot"><span>{item.tag}</span><a href={item.name === "Uiverse" ? "#explorer" : item.href} target={item.name === "Uiverse" ? undefined : "_blank"} rel="noreferrer" aria-label={`${item.name} kaynağını aç`}><ExternalLink size={15} /></a></div></article>})}</div></section>

      <section className="component-library" id="components"><div className="section-head"><div><span className="section-kicker">02 / LOCAL COMPONENT LIBRARY</span><h2>3.802 bileşen.<br /><em>tek atlas.</em></h2></div><div className="component-stat"><b>Uiverse Galaxy</b><span>MIT / HTML + CSS / MCP-READY JSON</span></div></div><div className="component-toolbar"><div className="component-search"><Search size={16} /><input value={componentQuery} onChange={(e) => setComponentQuery(e.target.value)} placeholder="Bileşen adı veya kategori ara..." /></div><div className="component-categories">{componentCategories.map((category) => <button key={category} className={componentCategory === category ? "selected" : ""} onClick={() => setComponentCategory(category)}>{category}</button>)}</div></div>{!registry && <div className="component-loading">LOCAL REGISTRY YÜKLENİYOR / 3.802 BİLEŞEN HAZIRLANIYOR...</div>}<div className="component-grid">{visibleComponents.map((item) => <button className="component-card" key={item.id} onClick={() => setSelectedComponent(item)}><div className="component-preview"><iframe title={`${item.name} önizleme`} sandbox="" srcDoc={`<style>body{margin:0;min-height:100%;display:grid;place-items:center;background:#17181b;overflow:hidden}*{box-sizing:border-box}${item.code.css}</style>${item.code.html}`} /></div><div className="component-meta"><span>{item.category}</span><b>{item.name}</b><small>MIT · {item.source}</small></div></button>)}</div><div className="component-foot"><span>Arama sonucu: {visibleComponents.length} / {registry?.total ?? "…"} gösteriliyor</span><a href="https://github.com/uiverse-io/galaxy" target="_blank" rel="noreferrer">Kaynak arşivini gör <ArrowUpRight size={14} /></a></div></section>

      {selectedComponent && <div className="component-modal-backdrop" role="presentation" onClick={() => setSelectedComponent(null)}><section className="component-modal" role="dialog" aria-modal="true" aria-label={`${selectedComponent.name} bileşeni`} onClick={(e) => e.stopPropagation()}><div className="modal-head"><div><span className="section-kicker">{selectedComponent.category} / {selectedComponent.license}</span><h3>{selectedComponent.name}</h3></div><button onClick={() => setSelectedComponent(null)} aria-label="Bileşen panelini kapat"><X size={18} /></button></div><div className="modal-preview"><iframe title={`${selectedComponent.name} büyük önizleme`} sandbox="" srcDoc={`<style>body{margin:0;min-height:100%;display:grid;place-items:center;background:#17181b;overflow:hidden}*{box-sizing:border-box}${selectedComponent.code.css}</style>${selectedComponent.code.html}`} /></div><div className="modal-code"><div><span>HTML / CSS</span><button onClick={() => copyText(`${selectedComponent.code.html}\n\n${selectedComponent.code.css}`)}><Copy size={14} /> KOPYALA</button></div><pre>{`${selectedComponent.code.html}\n\n${selectedComponent.code.css}`.slice(0, 700)}{(`${selectedComponent.code.html}\n\n${selectedComponent.code.css}`).length > 700 ? "\n…" : ""}</pre></div><div className="modal-foot"><span>Attribution: {selectedComponent.attribution}</span><a href={selectedComponent.sourceUrl} target="_blank" rel="noreferrer">Uiverse kaynağı <ExternalLink size={13} /></a></div></section></div>}

      <section className="section-block prompt-section" id="prompts"><div className="route-line"><span>02</span><i></i><b>PROMPT ROUTE</b></div><div className="section-head"><div><span className="section-kicker">02 / PROMPT DECK</span><h2>Boş sayfayı<br /><em>bir hamlede</em> geç.</h2></div><span className="section-note">KOPYALA / BÜK / ÜRET</span></div><div className="prompt-list">{prompts.map((prompt) => <article className="prompt-card" key={prompt.no}><div className="prompt-no">{prompt.no}</div><div className="prompt-main"><span className="card-type">{prompt.label}</span><h3>{prompt.title}</h3><p>{prompt.text}</p></div><button className="copy-button" onClick={() => copyText(prompt.text)}><Copy size={15} /> KOPYALA</button></article>)}</div></section>

      <section className="split-feature" id="systems"><div className="route-badge">03 / SYSTEMS <span>◈</span></div><div className="feature-art"><img src="/manus-storage/atlas-signal_c663787d.jpg" alt="Katmanlı 3D tasarım sistemi objeleri" /><div className="feature-label">SYSTEM<br /><b>STACK / 04</b></div></div><div className="feature-copy"><span className="section-kicker">03 / DESIGN SYSTEMS</span><h2>Bir parçadan<br /><em>bir düzene.</em></h2><p>İyi bir bileşen tek başına güzel görünmez; aynı dili konuşan bir sistem içinde hız kazandırır. Atlas, ilhamı kullanım bağlamıyla birlikte gösterir.</p><div className="feature-links"><a href="https://primer.style/" target="_blank" rel="noreferrer"><Github size={17} /> Primer <ArrowUpRight size={14} /></a><a href="https://ui.shadcn.com/" target="_blank" rel="noreferrer"><Layers3 size={17} /> shadcn/ui <ArrowUpRight size={14} /></a><a href="https://www.figma.com/community/ui-kits" target="_blank" rel="noreferrer"><Figma size={17} /> Figma kits <ArrowUpRight size={14} /></a></div></div></section>

      <section className="section-block template-section" id="templates"><div className="route-line dark"><span>04</span><i></i><b>STARTING POINTS</b></div><div className="section-head"><div><span className="section-kicker">04 / STARTING POINTS</span><h2>İlk ekranı<br /><em>buradan kur.</em></h2></div><span className="section-note">WIREFRAMES / 2026</span></div><div className="template-grid">{templates.map((template, index) => <article className="template-card" key={template.name}><div className="template-visual"><MiniWireframe accent={template.accent} variant={(index % 3) + 1} /><span>{template.number}</span></div><div className="template-info"><div><span className="card-type">{template.kind}</span><h3>{template.name}</h3></div><span className="template-layout">{template.layout}</span></div><button onClick={() => setSelectedTemplate(template)}>EXPLORE <ArrowUpRight size={14} /></button></article>)}</div></section>

      <ComponentExplorer />
      <ThreeGallery />
      <UIPlayground />
      <Suspense fallback={<section className="three-showcase three-loading"><div><span className="section-kicker">05 / MOTION LAB</span><p>3D sahne hazırlanıyor / CSS fallback aktif...</p></div></section>}><ThreeShowcase /></Suspense>
      <TemplatePreviewModal template={selectedTemplate} onClose={() => setSelectedTemplate(null)} />

      <footer className="atlas-footer"><div className="footer-brand"><div className="brand-mark"><span></span><span></span><span></span><span></span></div><span>OPEN DESIGN ATLAS</span></div><p>Dağınık kaynaklar için sakin bir pusula.</p><span className="footer-code">OD—001 / END OF INDEX</span></footer>
    </main>
  </div>;
}
