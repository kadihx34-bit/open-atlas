// STYLE: Signal Atlas — editorial archive with fixed navigation, asymmetrical cards, blueprint coordinates, cobalt/vemilion signal accents.
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { ArrowUpRight, Bookmark, Check, ChevronRight, Code2, Copy, ExternalLink, Figma, Github, Grid2X2, Layers3, Menu, Orbit, Search, Sparkles, X } from "lucide-react";

const sources = [
  { name: "Uiverse", type: "UI ELEMENTS", title: "4,456 open-source pieces", desc: "CSS, Tailwind, React ve Figma çıktılarıyla düğmelerden loader'lara kadar hızlı başlangıç yüzeyleri.", href: "https://uiverse.io/", tag: "Copy-ready", color: "cobalt", icon: Sparkles },
  { name: "Awesome Design Systems", type: "GITHUB REPO", title: "Sistemleri tek rotada keşfet", desc: "Açık kaynak design system, token ve pattern kütüphanelerini düzenli bir indeks gibi tara.", href: "https://github.com/alexpate/awesome-design-systems", tag: "Curated list", color: "paper", icon: Github },
  { name: "shadcn/ui Registry", type: "COMPONENTS", title: "Kopyalanabilir sistem mantığı", desc: "Kendi registry'ni kur, parçaları projenin içine al ve markana göre bük.", href: "https://ui.shadcn.com/docs/directory", tag: "Composable", color: "vermilion", icon: Code2 },
  { name: "Three.js", type: "3D WEB", title: "Web yüzeyine hacim ekle", desc: "WebGL'in karmaşıklığını yaratıcı prototipler ve etkileşimli 3D sahneler için yönet.", href: "https://threejs.org/", tag: "Explore 3D", color: "blue", icon: Orbit },
];

const prompts = [
  { no: "01", label: "LANDING PAGE", title: "Bir fikri lansman yüzeyine çevir", text: "Create an editorial SaaS landing page with a split hero, tactile product preview, sticky proof bar and a clear conversion route. Use asymmetric spacing, no generic gradient." },
  { no: "02", label: "DASHBOARD", title: "Veriyi sessizce organize et", text: "Design a dense but calm analytics dashboard with a persistent sidebar, one dominant metric, modular chart cards and a purposeful empty state." },
  { no: "03", label: "3D EXPERIENCE", title: "Derinliği davranışa bağla", text: "Build a 3D product showcase where camera movement responds to scroll, materials stay restrained and each interaction reveals a product decision." },
];

const templates = [
  { name: "Studio Index", kind: "PORTFOLIO", number: "A—01", accent: "#315CFF", layout: "Editorial / split" },
  { name: "Orbit Commerce", kind: "COMMERCE", number: "A—02", accent: "#F05A3C", layout: "Catalog / immersive" },
  { name: "Signal Console", kind: "DASHBOARD", number: "A—03", accent: "#315CFF", layout: "Data / dense" },
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
  const filters = ["ALL", "UI ELEMENTS", "PROMPTS", "SYSTEMS", "3D WEB"];
  const filteredSources = useMemo(() => sources.filter((item) => {
    const matchesQuery = `${item.name} ${item.title} ${item.desc}`.toLowerCase().includes(query.toLowerCase());
    const matchesFilter = activeFilter === "ALL" || (activeFilter === "PROMPTS" ? false : item.type === activeFilter || (activeFilter === "SYSTEMS" && item.type === "GITHUB REPO"));
    return matchesQuery && matchesFilter;
  }), [query, activeFilter]);
  const toggleSave = (name: string) => setSaved((items) => items.includes(name) ? items.filter((item) => item !== name) : [...items, name]);

  return <div className="atlas-shell">
    <aside className={`atlas-sidebar ${mobileOpen ? "is-open" : ""}`}>
      <div className="brand-lockup"><div className="brand-mark"><span></span><span></span><span></span><span></span></div><div><strong>OPEN</strong><small>DESIGN ATLAS</small></div></div>
      <button className="close-mobile" onClick={() => setMobileOpen(false)} aria-label="Menüyü kapat"><X size={18} /></button>
      <div className="side-index"><span>INDEX / 2026</span><span>OD—001</span></div>
      <nav className="side-nav" aria-label="Ana navigasyon">
        <a className="active" href="#discover"><span>01</span>Discover <ChevronRight size={14} /></a>
        <a href="#prompts"><span>02</span>Prompts</a>
        <a href="#components"><span>03</span>Components</a>
        <a href="#templates"><span>04</span>Templates</a>
        <a href="#systems"><span>05</span>Systems</a>
      </nav>
      <div className="side-note"><span className="dot"></span><p>Bir sonraki yüzeyini<br /><b>buradan başlat.</b></p></div>
      <div className="side-footer"><span>CURATED BY OD</span><a href="https://github.com/alexpate/awesome-design-systems" target="_blank" rel="noreferrer">View source <ArrowUpRight size={12} /></a></div>
    </aside>

    <main className="atlas-main">
      <header className="topbar"><button className="menu-trigger" onClick={() => setMobileOpen(true)} aria-label="Menüyü aç"><Menu size={20} /></button><a className="top-brand" href="#discover"><div className="brand-mark"><span></span><span></span><span></span><span></span></div><strong>OPEN DESIGN ATLAS</strong></a><div className="breadcrumb"><span>ATLAS</span><ChevronRight size={13} /><b>DISCOVER</b></div><div className="top-actions"><span className="live-indicator"><i></i>LIVE INDEX</span><button className="saved-button" onClick={() => toast.info(`${saved.length} kaynak kaydedildi`)}><Bookmark size={15} /> {saved.length || "0"}</button></div></header>

      <section className="hero" id="discover">
        <div className="hero-copy"><div className="eyebrow"><span>OPEN SOURCE / DESIGN INTELLIGENCE</span><span>01—04</span></div><h1>Tasarımın<br /><em>kısa yolu.</em></h1><p>UI/UX kaynakları, prompt'lar, sistemler ve 3D web ilhamı. Dağınık sekmeleri tek bir küratörlü rotaya çevir.</p><div className="hero-search"><Search size={18} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Kaynak, bileşen veya fikir ara..." /><kbd>⌘ K</kbd></div><div className="hero-meta"><span><b>128</b> ROTASİZ KAYNAK</span><span><b>24</b> TASLAK</span><span><b>07</b> 3D REFERANS</span></div></div>
        <div className="hero-art"><img src="/manus-storage/atlas-hero_86b5734a.jpg" alt="Kobalt ve vermilyon 3D atlas kompozisyonu" /><div className="hero-stamp">FIELD<br /><b>NOTES</b><br /><small>DESIGN / 26</small></div><div className="hero-coord">41° 01' 54.2" N<br />28° 58' 33.4" E</div></div>
      </section>

      <section className="section-block source-section" id="components"><div className="section-head"><div><span className="section-kicker">01 / SOURCE INDEX</span><h2>Doğru parçayı<br /><em>doğru yerde</em> bul.</h2></div><a className="text-link" href="https://uiverse.io/elements" target="_blank" rel="noreferrer">Tüm kaynakları gör <ArrowUpRight size={15} /></a></div><div className="filter-row">{filters.map((filter) => <button key={filter} className={activeFilter === filter ? "selected" : ""} onClick={() => setActiveFilter(filter)}>{filter}</button>)}</div><div className="source-grid">{filteredSources.map((item, index) => { const Icon = item.icon; return <article className={`source-card ${item.color}`} key={item.name}><div className="card-top"><span className="card-number">0{index + 1} / ROUTE STOP</span><button className={saved.includes(item.name) ? "is-saved" : ""} onClick={() => toggleSave(item.name)} aria-label={`Kaydet: ${item.name}`}><Bookmark size={16} fill={saved.includes(item.name) ? "currentColor" : "none"} /></button></div><div className="source-icon"><Icon size={24} strokeWidth={1.5} /></div><span className="card-type">{item.type}</span><div className="source-name">{item.name}</div><h3>{item.title}</h3><p>{item.desc}</p><div className="card-foot"><span>{item.tag}</span><a href={item.href} target="_blank" rel="noreferrer" aria-label={`${item.name} kaynağını aç`}><ExternalLink size={15} /></a></div></article>})}</div></section>

      <section className="section-block prompt-section" id="prompts"><div className="route-line"><span>02</span><i></i><b>PROMPT ROUTE</b></div><div className="section-head"><div><span className="section-kicker">02 / PROMPT DECK</span><h2>Boş sayfayı<br /><em>bir hamlede</em> geç.</h2></div><span className="section-note">KOPYALA / BÜK / ÜRET</span></div><div className="prompt-list">{prompts.map((prompt) => <article className="prompt-card" key={prompt.no}><div className="prompt-no">{prompt.no}</div><div className="prompt-main"><span className="card-type">{prompt.label}</span><h3>{prompt.title}</h3><p>{prompt.text}</p></div><button className="copy-button" onClick={() => copyText(prompt.text)}><Copy size={15} /> KOPYALA</button></article>)}</div></section>

      <section className="split-feature" id="systems"><div className="route-badge">03 / SYSTEMS <span>◈</span></div><div className="feature-art"><img src="/manus-storage/atlas-signal_c663787d.jpg" alt="Katmanlı 3D tasarım sistemi objeleri" /><div className="feature-label">SYSTEM<br /><b>STACK / 04</b></div></div><div className="feature-copy"><span className="section-kicker">03 / DESIGN SYSTEMS</span><h2>Bir parçadan<br /><em>bir düzene.</em></h2><p>İyi bir bileşen tek başına güzel görünmez; aynı dili konuşan bir sistem içinde hız kazandırır. Atlas, ilhamı kullanım bağlamıyla birlikte gösterir.</p><div className="feature-links"><a href="https://primer.style/" target="_blank" rel="noreferrer"><Github size={17} /> Primer <ArrowUpRight size={14} /></a><a href="https://ui.shadcn.com/" target="_blank" rel="noreferrer"><Layers3 size={17} /> shadcn/ui <ArrowUpRight size={14} /></a><a href="https://www.figma.com/community/ui-kits" target="_blank" rel="noreferrer"><Figma size={17} /> Figma kits <ArrowUpRight size={14} /></a></div></div></section>

      <section className="section-block template-section" id="templates"><div className="route-line dark"><span>04</span><i></i><b>STARTING POINTS</b></div><div className="section-head"><div><span className="section-kicker">04 / STARTING POINTS</span><h2>İlk ekranı<br /><em>buradan kur.</em></h2></div><span className="section-note">WIREFRAMES / 2026</span></div><div className="template-grid">{templates.map((template, index) => <article className="template-card" key={template.name}><div className="template-visual"><MiniWireframe accent={template.accent} variant={index + 1} /><span>{template.number}</span></div><div className="template-info"><div><span className="card-type">{template.kind}</span><h3>{template.name}</h3></div><span className="template-layout">{template.layout}</span></div><button onClick={() => toast.info("Taslak önizlemesi yakında", { description: "Şimdilik bu wireframe'i başlangıç rotası olarak kaydedebilirsin." })}>EXPLORE <ArrowUpRight size={14} /></button></article>)}</div></section>

      <footer className="atlas-footer"><div className="footer-brand"><div className="brand-mark"><span></span><span></span><span></span><span></span></div><span>OPEN DESIGN ATLAS</span></div><p>Dağınık kaynaklar için sakin bir pusula.</p><span className="footer-code">OD—001 / END OF INDEX</span></footer>
    </main>
  </div>;
}
