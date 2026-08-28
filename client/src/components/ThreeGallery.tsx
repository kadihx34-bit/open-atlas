// STYLE: Signal Atlas — 3D art direction lab with cobalt/vermilion materials, measured motion, readable labels, and a single performant Canvas.
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { Component, type ReactNode, useMemo, useRef, useState } from "react";
import { ArrowUpRight, Copy, RotateCcw } from "lucide-react";
import { toast } from "sonner";

type ScenePreset = { id: string; title: string; label: string; description: string; recipe: string; source?: string; license?: string };
const presets: ScenePreset[] = [
  { id: "orbit", title: "Blue Orbit", label: "01 / ORBIT RIG", description: "Yörüngede kayan modüler çekirdekler.", recipe: "group rotation + emissive material" },
  { id: "liquid", title: "Liquid Field", label: "02 / LIQUID", description: "Sıvı metal hissi veren deformasyonlu yüzey.", recipe: "icosahedron + scale breathing" },
  { id: "particles", title: "Particle Weather", label: "03 / PARTICLES", description: "Pointer'a tepki veren parçacık hava durumu.", recipe: "point field + pointer drift" },
  { id: "crystal", title: "Signal Crystal", label: "04 / CRYSTAL", description: "Kırılgan ışığı taşıyan kristal istif.", recipe: "octahedron + additive light" },
  { id: "tunnel", title: "Red Tunnel", label: "05 / TUNNEL", description: "İçine doğru akan ritmik bir koridor.", recipe: "box array + depth scale" },
  { id: "terrain", title: "Data Terrain", label: "06 / TERRAIN", description: "Veriden topografyaya dönüşen grid.", recipe: "grid cells + sine height" },
  { id: "ribbons", title: "Orbit Ribbons", label: "07 / RIBBONS", description: "Birbirini kesen çizgisel yörüngeler.", recipe: "torus loops + cross rotation" },
  { id: "type", title: "Kinetic Type", label: "08 / TYPE", description: "Tipografik ritmi hacimle görünür kıl.", recipe: "box glyphs + staggered motion" },
  { id: "grid", title: "Kinetic Grid", label: "09 / GRID", description: "Kamera ile dalgalanan kontrollü sistem.", recipe: "instanced-like bars + wave" },
  { id: "product", title: "Product Stage", label: "10 / STAGE", description: "Bir ürün nesnesini sahne ışığıyla sun.", recipe: "bevel illusion + key lights", source: "Open Design Atlas", license: "Self-authored" },
  { id: "mesh3d-object", title: "Mesh3D Signal Object", label: "11 / MESH3D", description: "Mesh3D Gallery'den ilham alan, yeniden dağıtılmayan özgün geometrik obje.", recipe: "dodecahedron + signal ring + pointer", source: "Open Design Atlas / Mesh3D Gallery inspiration", license: "Self-authored · no external asset" },
];

const points = Array.from({ length: 34 }, (_, index) => { const angle = index * 2.399; const radius = 1.1 + (index % 7) * 0.18; return [Math.cos(angle) * radius, ((index % 9) - 4) * 0.22, Math.sin(angle) * radius] as [number, number, number]; });
export const threePresetIds = presets.map(preset => preset.id);
export const getThreePreset = (id: string) => presets.find(preset => preset.id === id) ?? presets[0];
export const getSceneRenderPlan = (id: string) => id === "particles" ? "buffer-geometry" : id === "mesh3d-object" ? "procedural-dodecahedron" : "primitive-composition";

class SceneBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() { return this.state.hasError ? this.props.fallback : this.props.children; }
}

function PresetScene({ id }: { id: string }) {
  const group = useRef<THREE.Group>(null);
  const elapsed = useRef(0);
  useFrame((state, delta) => {
    elapsed.current += delta;
    if (!group.current) return;
    group.current.rotation.y += delta * (id === "tunnel" ? 0.16 : 0.1);
    group.current.rotation.x = Math.sin(elapsed.current * 0.3) * 0.08 + state.pointer.y * 0.08;
    group.current.position.x = state.pointer.x * 0.14;
  });
  const material = id === "crystal" ? "#E6E2D6" : id === "tunnel" || id === "ribbons" ? "#F05A3C" : "#315CFF";
  if (id === "particles") { const particlePositions = useMemo(() => { const values = new Float32Array(points.length * 3); points.forEach((position, index) => { values[index * 3] = position[0]; values[index * 3 + 1] = position[1]; values[index * 3 + 2] = position[2]; }); return values; }, []); return <points ref={group as unknown as React.RefObject<THREE.Points>}><bufferGeometry><bufferAttribute attach="attributes-position" args={[particlePositions, 3]} /></bufferGeometry><pointsMaterial color="#315CFF" size={0.09} sizeAttenuation /><pointLight position={[0, 0, 1]} color="#F05A3C" intensity={2} /></points>; }
  if (id === "terrain" || id === "grid") return <group ref={group}>{Array.from({ length: 64 }, (_, index) => { const x = (index % 8) - 3.5; const z = Math.floor(index / 8) - 3.5; const height = id === "terrain" ? 0.15 + Math.abs(Math.sin(x * 0.8 + z * 0.6)) * 0.55 : 0.1 + Math.abs(Math.sin(x * 0.7 + z * 0.6 + elapsed.current)) * 0.7; return <mesh key={index} position={[x * 0.35, height / 2 - 0.7, z * 0.35]}><boxGeometry args={[0.24, height, 0.24]} /><meshStandardMaterial color={index % 9 === 0 ? "#F05A3C" : "#315CFF"} metalness={0.5} roughness={0.3} /></mesh>; })}</group>;
  if (id === "tunnel") return <group ref={group}>{Array.from({ length: 12 }, (_, index) => <mesh key={index} position={[0, 0, -index * 0.55 + 2.5]} rotation={[index * 0.15, index * 0.25, 0]} scale={1 - index * 0.045}><boxGeometry args={[2.9, 0.04, 0.04]} /><meshBasicMaterial color={index % 2 ? "#F05A3C" : "#315CFF"} /></mesh>)}</group>;
  if (id === "ribbons") return <group ref={group}>{[0, 1, 2].map((index) => <mesh key={index} rotation={[index * 0.6, index * 0.4, index * 0.7]}><torusGeometry args={[1.1 + index * 0.22, 0.025, 10, 80]} /><meshBasicMaterial color={index === 1 ? "#E6E2D6" : "#F05A3C"} /></mesh>)}</group>;
  if (id === "type") return <group ref={group}>{[0, 1, 2, 3, 4].map((index) => <mesh key={index} position={[(index - 2) * 0.58, Math.sin(elapsed.current * 1.4 + index) * 0.25, 0]}><boxGeometry args={[0.42, 1.2 - index * 0.1, 0.18]} /><meshStandardMaterial color={index % 2 ? "#315CFF" : "#F05A3C"} metalness={0.7} roughness={0.2} /></mesh>)}</group>;
  if (id === "product") return <group ref={group}><mesh rotation={[0.3, 0.45, 0]}><boxGeometry args={[1.8, 1.35, 0.52]} /><meshStandardMaterial color="#E6E2D6" metalness={0.7} roughness={0.24} /></mesh><mesh position={[0, 0, 0.3]} rotation={[0.3, 0.45, 0]}><torusGeometry args={[0.42, 0.035, 12, 48]} /><meshBasicMaterial color="#F05A3C" /></mesh></group>;
  if (id === "mesh3d-object") return <group ref={group}><mesh rotation={[0.35, 0.55, 0.1]}><dodecahedronGeometry args={[0.9, 1]} /><meshStandardMaterial color="#E6E2D6" metalness={0.82} roughness={0.16} /></mesh><mesh rotation={[0.1, 0.3, 0.5]} scale={1.35}><torusGeometry args={[0.82, 0.028, 12, 80]} /><meshBasicMaterial color="#315CFF" /></mesh><mesh rotation={[1.1, 0.3, 0]} scale={1.12}><torusGeometry args={[0.62, 0.022, 12, 80]} /><meshBasicMaterial color="#F05A3C" /></mesh></group>;
  return <group ref={group}>{[0, 1, 2, 3].map((index) => <mesh key={index} position={[Math.cos(index * Math.PI / 2) * 1.15, Math.sin(elapsed.current + index) * 0.18, Math.sin(index * Math.PI / 2) * 1.15]}><icosahedronGeometry args={[0.28 + index * 0.08, 1]} /><meshStandardMaterial color={index === 1 ? "#F05A3C" : material} metalness={0.75} roughness={0.2} /></mesh>)}</group>;
}

export default function ThreeGallery() {
  const [active, setActive] = useState(presets[0]);
  const [rotation, setRotation] = useState(0);
  const reset = () => { setRotation(0); toast.info("Sahne başlangıç durumuna döndü"); };
  return <section className="three-gallery" id="three-gallery"><div className="three-gallery-head"><div><span className="section-kicker">08 / THREE.JS LIBRARY</span><h2>{presets.length} sahne.<br /><em>on bir ayrı fikir.</em></h2><p>Three.js ve React Three Fiber yapı taşlarıyla hazırlanmış sanatsal deneyler. Her sahne aynı kütüphanenin farklı bir bileşeni gibi çalışır.</p></div><div className="three-gallery-meta"><b>{presets.length}</b><span>ART DIRECTED<br />SCENES</span></div></div><div className="three-gallery-layout"><div className="three-stage"><SceneBoundary fallback={<div className="three-canvas-fallback"><b>SCENE FALLBACK</b><span>Bu preset WebGL ortamında açılamadı.</span><button onClick={() => setActive(presets[0])}>İLK SAHNEYİ AÇ</button></div>}><Canvas key={active.id} camera={{ position: [0, 0.1, 4.8], fov: 45 }} dpr={[1, 1.25]} gl={{ antialias: false, powerPreference: "high-performance" }}><color attach="background" args={["#0b0c0e"]} /><ambientLight intensity={1.25} /><directionalLight position={[3, 4, 5]} intensity={3.2} /><pointLight position={[-3, 1, 2]} color="#315CFF" intensity={12} /><pointLight position={[2, -1, 1]} color="#F05A3C" intensity={9} /><PresetScene id={active.id} /></Canvas></SceneBoundary><div className="three-stage-label"><span>{active.label}</span><b>{active.title}</b><small>{active.recipe} · {active.source ?? "Open Design Atlas"} · {active.license ?? "Self-authored"}</small></div><button className="three-reset" onClick={reset} aria-label="Sahneyi sıfırla"><RotateCcw size={15} /></button></div><div className="three-preset-list">{presets.map((preset) => <button key={preset.id} className={active.id === preset.id ? "active" : ""} onClick={() => setActive(preset)}><span>{preset.label}</span><b>{preset.title}</b><small>{preset.description}</small></button>)}</div></div><div className="three-gallery-foot"><span>POINTER → SCENE / CLICK A PRESET TO CHANGE THE WORLD · PROCEDURAL / MESH3D-INSPIRED</span><small>Self-authored procedural asset · inspiration: mesh3d.gallery · no external asset redistributed</small><button onClick={() => { navigator.clipboard?.writeText(active.recipe); toast.success("Sahne tarifi kopyalandı"); }}><Copy size={14} /> RECIPE KOPYALA</button></div></section>;
}
