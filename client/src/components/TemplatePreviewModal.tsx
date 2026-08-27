// STYLE: Signal Atlas — template preview as a focused product surface, paper canvas, cobalt/vermilion UI signals, no dead-end CTA.
import { ArrowUpRight, Check, X } from "lucide-react";
import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import type { Mesh } from "three";

type Template = { name: string; kind: string; number: string; accent: string; layout: string; description: string; components: string[] };

function ProductScene({ step }: { step: number }) {
  const mesh = useRef<Mesh>(null);
  useFrame((_, delta) => { if (mesh.current) { mesh.current.rotation.x += delta * 0.22; mesh.current.rotation.y += delta * (0.42 + step * 0.08); mesh.current.position.y = Math.sin(Date.now() * 0.001) * 0.08; } });
  return <><mesh ref={mesh} scale={1 + step * 0.08}><boxGeometry args={[1.05, 1.05, 1.05]} /><meshStandardMaterial color="#e6e2d6" metalness={0.82} roughness={0.18} /></mesh><mesh rotation={[0.4, 0.2, 0]} scale={1.34 + step * 0.06}><torusGeometry args={[0.95, 0.025, 12, 64]} /><meshBasicMaterial color="#F05A3C" /></mesh></>;
}

function ProductCanvas({ accent, step }: { accent: string; step: number }) {
  return <Canvas camera={{ position: [0, 0, 3.5], fov: 42 }} dpr={[1, 1.2]} gl={{ antialias: false }}><ambientLight intensity={1.8} /><pointLight position={[2, 2, 3]} color={accent} intensity={10} /><ProductScene step={step} /></Canvas>;
}

export default function TemplatePreviewModal({ template, onClose }: { template: Template | null; onClose: () => void }) {
  const [storyStep, setStoryStep] = useState(0);
  if (!template) return null;
  const isProduct3D = template.kind === "3D PRODUCT";
  const isLanding3D = template.kind === "3D LANDING";
  return <div className="template-modal-backdrop" onClick={onClose}><section className="template-modal" role="dialog" aria-modal="true" aria-label={`${template.name} önizlemesi`} onClick={(e) => e.stopPropagation()}><header><div><span>{template.number} / {template.kind}</span><h2>{template.name}</h2></div><button onClick={onClose} aria-label="Önizlemeyi kapat"><X size={18} /></button></header><div className="template-browser"><div className="browser-bar"><i></i><i></i><i></i><b>{template.name.toLowerCase().replaceAll(" ", "-")}.atlas</b></div><div className="browser-body" style={{ "--template-accent": template.accent } as React.CSSProperties}><div className="browser-nav"><strong>{template.name.split(" ")[0].toUpperCase()}</strong><span>Index</span><span>About</span><button>Explore <ArrowUpRight size={12} /></button></div><div className={`browser-hero ${isLanding3D ? "browser-3d-landing" : ""} ${isProduct3D ? "browser-3d-product" : ""}`}><small>OPEN DESIGN / 2026</small><h3>{template.name}<br /><em>{isProduct3D ? ["in material.", "in detail.", "in use."][storyStep] : "in motion."}</em></h3><p>{template.description}</p><button className="browser-cta" onClick={() => isProduct3D ? setStoryStep((step) => (step + 1) % 3) : undefined}>{isProduct3D ? "Continue story" : "Enter the route"} <ArrowUpRight size={14} /></button><div className="browser-shape"></div>{(isLanding3D || isProduct3D) && <div className="browser-canvas"><ProductCanvas accent={template.accent} step={storyStep} /></div>}<div className="browser-product-orbit"><i></i><i></i><i></i></div></div><div className="browser-proof"><span>{isProduct3D ? `0${storyStep + 1} / SCROLL STORY` : "01 / BUILT WITH"}</span>{template.components.map((component) => <b key={component}><Check size={12} /> {component}</b>)}</div></div></div><footer><span>Bu gerçek bir dahili önizlemedir; artık “yakında” placeholder'ı yok.</span><button onClick={() => navigator.clipboard?.writeText(`Build ${template.name} using ${template.components.join(", ")}.`)}>BAŞLANGIÇ PROMPT'UNU KOPYALA <ArrowUpRight size={13} /></button></footer></section></div>;
}
