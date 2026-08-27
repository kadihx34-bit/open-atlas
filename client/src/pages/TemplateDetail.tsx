// STYLE: Signal Atlas template routes — each starting point is a full internal surface, not a dead-end modal or external link.
import { ArrowLeft, ArrowUpRight, Check, Copy, Layers3 } from "lucide-react";
import { Link, useRoute } from "wouter";
import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import type { Mesh } from "three";
import { toast } from "sonner";

type Site = { slug: string; name: string; kind: string; number: string; accent: string; layout: string; description: string; components: string[] };
type RouteTheme = { surface: string; foreground: string; accent: string; shadow: string; font: string; radius: string };
const routeThemes: Record<string, RouteTheme> = {
  "studio-index": { surface: "#111214", foreground: "#f2f0e9", accent: "#315CFF", shadow: "#F05A3C", font: "Space Grotesk", radius: "0px" },
  "orbit-commerce": { surface: "#171019", foreground: "#fff8f0", accent: "#F05A3C", shadow: "#ffc857", font: "IBM Plex Sans", radius: "18px" },
  "signal-console": { surface: "#0b1421", foreground: "#e6f1ff", accent: "#64a8ff", shadow: "#193a66", font: "IBM Plex Mono", radius: "4px" },
  "field-notes": { surface: "#e6e2d6", foreground: "#171717", accent: "#9b5de5", shadow: "#f15bb5", font: "IBM Plex Serif", radius: "2px" },
  "afterimage": { surface: "#160b1f", foreground: "#fff4ff", accent: "#ff4ecd", shadow: "#5b2cff", font: "Space Grotesk", radius: "28px" },
  "northstar": { surface: "#f4f5ef", foreground: "#111214", accent: "#315CFF", shadow: "#9be564", font: "Space Grotesk", radius: "10px" },
  "mono-archive": { surface: "#0e0e0e", foreground: "#f6f6f6", accent: "#f6f6f6", shadow: "#555", font: "IBM Plex Mono", radius: "0px" },
  "soft-circuit": { surface: "#e9f2ef", foreground: "#17312d", accent: "#2a9d8f", shadow: "#e9c46a", font: "IBM Plex Sans", radius: "24px" },
  "data-bloom": { surface: "#191311", foreground: "#fff3e8", accent: "#F05A3C", shadow: "#f6bd60", font: "IBM Plex Mono", radius: "6px" },
  "deep-orbit": { surface: "#080e20", foreground: "#eaf0ff", accent: "#315CFF", shadow: "#53d8fb", font: "Space Grotesk", radius: "50%" },
  "prism-landing": { surface: "#150f0a", foreground: "#fff4e7", accent: "#F05A3C", shadow: "#f7c59f", font: "Space Grotesk", radius: "12px" },
  "aperture-object": { surface: "#0d111c", foreground: "#f0f4ff", accent: "#6d7cff", shadow: "#F05A3C", font: "IBM Plex Sans", radius: "14px" },
};
const sites: Site[] = [
  { slug: "studio-index", name: "Studio Index", kind: "PORTFOLIO", number: "A—01", accent: "#315CFF", layout: "Editorial / split", description: "A sharp home for an independent studio and its working archive.", components: ["Button", "Tabs", "Card"] },
  { slug: "orbit-commerce", name: "Orbit Commerce", kind: "COMMERCE", number: "A—02", accent: "#F05A3C", layout: "Catalog / immersive", description: "A product route that gives every object its own orbit.", components: ["Badge", "Dialog", "Pagination"] },
  { slug: "signal-console", name: "Signal Console", kind: "DASHBOARD", number: "A—03", accent: "#315CFF", layout: "Data / dense", description: "A calm command center for metrics, states and next actions.", components: ["Table", "Progress", "Tooltip"] },
  { slug: "field-notes", name: "Field Notes", kind: "EDITORIAL", number: "A—04", accent: "#E6E2D6", layout: "Reading / offset", description: "A quiet editorial surface for research, notes and references.", components: ["Input", "Accordion", "Avatar"] },
  { slug: "afterimage", name: "Afterimage", kind: "CREATIVE", number: "A—05", accent: "#F05A3C", layout: "Gallery / motion", description: "A visual gallery with tactile transitions and sharp captions.", components: ["Carousel", "Hover card", "Toast"] },
  { slug: "northstar", name: "Northstar", kind: "STARTUP", number: "A—06", accent: "#315CFF", layout: "Conversion / proof", description: "A direct product story built around one confident signal.", components: ["Button", "Form", "Alert"] },
  { slug: "mono-archive", name: "Mono Archive", kind: "ARCHIVE", number: "A—07", accent: "#16171A", layout: "Index / grid", description: "A searchable index for a large collection of things.", components: ["Select", "Checkbox", "Pagination"] },
  { slug: "soft-circuit", name: "Soft Circuit", kind: "PRODUCT", number: "A—08", accent: "#E6E2D6", layout: "Product / soft", description: "A product page balancing warmth, utility and a clear next step.", components: ["Switch", "Slider", "Sheet"] },
  { slug: "data-bloom", name: "Data Bloom", kind: "ANALYTICS", number: "A—09", accent: "#F05A3C", layout: "Charts / modular", description: "A data surface where dense information still has room to breathe.", components: ["Chart", "Tabs", "Skeleton"] },
  { slug: "deep-orbit", name: "Deep Orbit", kind: "3D WEB", number: "A—10", accent: "#315CFF", layout: "Canvas / immersive", description: "A spatial landing page where the interface becomes a scene.", components: ["Canvas", "Pointer", "Scroll"] },
  { slug: "prism-landing", name: "Prism Landing", kind: "3D LANDING", number: "A—11", accent: "#F05A3C", layout: "Hero / generative", description: "A high-impact landing page where a product signal floats through space.", components: ["Canvas", "Orbit", "Motion"] },
  { slug: "aperture-object", name: "Aperture Object", kind: "3D PRODUCT", number: "A—12", accent: "#315CFF", layout: "Scroll / story", description: "A product story that reveals material, detail and use through the scroll.", components: ["Scroll", "Camera rail", "Hotspots"] },
];

function RouteObjectScene({ product }: { product: boolean }) {
  const mesh = useRef<Mesh>(null);
  useFrame((_, delta) => { if (mesh.current) { mesh.current.rotation.x += delta * 0.18; mesh.current.rotation.y += delta * 0.42; mesh.current.position.y = Math.sin(Date.now() * 0.001) * 0.09; } });
  return <><mesh ref={mesh}><boxGeometry args={product ? [1.25, 1.25, 1.25] : [1.05, 1.05, 1.05]} /><meshStandardMaterial color="#e6e2d6" metalness={0.78} roughness={0.2} /></mesh><mesh rotation={[0.35, 0.2, 0]} scale={1.35}><torusGeometry args={[1, 0.025, 12, 64]} /><meshBasicMaterial color="#F05A3C" /></mesh></>;
}

function RouteObject({ accent, product }: { accent: string; product: boolean }) {
  return <Canvas camera={{ position: [0, 0, 3.4], fov: 42 }} dpr={[1, 1.2]} gl={{ antialias: false }}><ambientLight intensity={1.5} /><pointLight position={[2, 2, 3]} intensity={10} color={accent} /><RouteObjectScene product={product} /></Canvas>;
}

export default function TemplateDetail() {
  const [, params] = useRoute("/templates/:slug");
  const site = sites.find((item) => item.slug === params?.slug) ?? sites[0];
  const [storyStep, setStoryStep] = useState(0);
  const is3D = site.kind.includes("3D");
  const isProduct3D = site.kind === "3D PRODUCT";
  const storyWords = ["in material.", "in detail.", "in use."];
  const theme = routeThemes[site.slug] ?? routeThemes["studio-index"];
  useEffect(() => {
    if (!isProduct3D) return;
    const onScroll = () => setStoryStep(Math.min(2, Math.floor(window.scrollY / 180)));
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isProduct3D]);
  return <main className="template-detail-page"><header className="template-detail-nav"><Link href="/#templates"><ArrowLeft size={16} /> Atlas'a dön</Link><span>{site.number} / {site.kind}</span><b>OPEN DESIGN ATLAS</b></header><section className={`template-detail-hero ${is3D ? "is-3d" : ""}`} style={{ "--site-surface": theme.surface, "--site-foreground": theme.foreground, "--site-accent": theme.accent, "--site-shadow": theme.shadow, "--site-font": theme.font, "--site-radius": theme.radius } as React.CSSProperties}><div className="template-detail-copy"><span className="section-kicker">{site.number} / {site.layout.toUpperCase()}</span><h1>{site.name}<br /><em>{isProduct3D ? storyWords[storyStep] : is3D ? "in dimensional motion." : "in a working system."}</em></h1><p>{site.description}</p><div className="template-detail-actions"><button onClick={() => { navigator.clipboard?.writeText(`Build ${site.name} using ${site.components.join(", ")}.`); toast.success("Site promptu kopyalandı"); }}><Copy size={15} /> STARTER PROMPT</button><Link href="/#templates">Diğer taslaklar <ArrowUpRight size={14} /></Link></div></div><div className="template-detail-stage">{is3D ? <RouteObject accent={site.accent} product={site.kind === "3D PRODUCT"} /> : <div className="route-ui"><div className="route-ui-bar"><i></i><i></i><i></i><span>{site.name.toLowerCase().replaceAll(" ", "-")}.atlas</span></div><div className="route-ui-body"><small>OPEN DESIGN / 2026</small><b>{site.name}</b><div style={{ background: site.accent }}></div><p>Built from the Atlas component system.</p></div></div>}<span className="template-detail-coordinate">41° 01' / {site.number}</span>{isProduct3D && <div className="story-rail"><span className={storyStep === 0 ? "active" : ""}>01 MATERIAL</span><span className={storyStep === 1 ? "active" : ""}>02 DETAIL</span><span className={storyStep === 2 ? "active" : ""}>03 USE</span></div>}</div></section><section className="template-detail-grid"><div><span className="section-kicker">SYSTEM MAP</span><h2>Bu yüzey nasıl<br /><em>çalışıyor?</em></h2></div><div className="template-detail-info"><p><strong>{site.layout}</strong> düzeni; {site.components.join(", ")} varyantlarıyla bu rotaya özel tema tokenları üzerinden çalışır. Bu taslak, Open Design Atlas içindeki ortak UI, motion ve 3D primitive'leri kullanır. Kendi projen için başlangıç noktası olarak kopyalayabilir ve bükebilirsin.</p><div className="detail-component-list">{site.components.map((component) => <span key={component}><Check size={14} /> {component}</span>)}</div><button onClick={() => toast.info("Bileşen Explorer'a bağlandı")}>Kullanılan bileşenleri gör <Layers3 size={15} /></button></div></section></main>;
}
