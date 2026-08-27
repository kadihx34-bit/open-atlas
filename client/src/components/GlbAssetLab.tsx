// STYLE: Signal Atlas Asset Lab — private model workspace with local preview first, optional persisted upload.
import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ArrowUpRight, Crosshair, FileUp, MousePointer2, UploadCloud } from "lucide-react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import type { Group, Object3D } from "three";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

type Hotspot = { id: string; label: string; description: string; position: [number, number, number] };
const defaultHotspots: Hotspot[] = [
  { id: "material", label: "Material", description: "Surface, roughness and light response.", position: [0.65, 0.35, 0.35] },
  { id: "detail", label: "Detail", description: "A close-up point for a product decision.", position: [-0.55, 0.1, 0.45] },
  { id: "use", label: "Use", description: "The interaction zone that explains the object.", position: [0, -0.55, 0.5] },
];

function LoadedModel({ url, hotspots, onHotspot }: { url: string; hotspots: Hotspot[]; onHotspot: (hotspot: Hotspot) => void }) {
  const group = useRef<Group>(null);
  const { camera } = useThree();
  const [model, setModel] = useState<Object3D | null>(null);
  useEffect(() => { let alive = true; const loader = new GLTFLoader(); loader.load(url, (gltf) => { if (alive) setModel(gltf.scene); }, undefined, () => { if (alive) setModel(null); }); return () => { alive = false; }; }, [url]);
  useFrame((_, delta) => { if (group.current) { group.current.rotation.y += delta * 0.24; group.current.rotation.x = Math.sin(Date.now() * 0.00045) * 0.06; } });
  useEffect(() => { camera.position.set(0, 0, 4); }, [camera]);
  return <group ref={group}>{model ? <primitive object={model} scale={1.55} /> : <mesh><icosahedronGeometry args={[1, 1]} /><meshStandardMaterial color="#315CFF" wireframe /></mesh>}{hotspots.map((hotspot) => <mesh key={hotspot.id} position={hotspot.position} onClick={(event) => { event.stopPropagation(); onHotspot(hotspot); }}><sphereGeometry args={[0.07, 12, 12]} /><meshBasicMaterial color="#F05A3C" /></mesh>)}</group>;
}

export default function GlbAssetLab() {
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState("");
  const [active, setActive] = useState<Hotspot | null>(null);
  const [hotspots] = useState(defaultHotspots);
  const upload = trpc.assets.uploadGlb.useMutation({ onSuccess: () => toast.success("GLB özel kütüphanene kaydedildi"), onError: (error) => toast.error(error.message) });
  const fileSize = useMemo(() => file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : "Yerel önizleme bekliyor", [file]);
  const readFile = (next: File | null) => { if (!next) return; if (next.size > 50 * 1024 * 1024) { toast.error("GLB dosyası 50 MB altında olmalı"); return; } if (next.type && next.type !== "model/gltf-binary" && next.type !== "application/octet-stream") { toast.error("Sadece GLB dosyası yükleyebilirsin"); return; } setFile(next); setUrl(URL.createObjectURL(next)); setActive(null); };
  const persist = async () => { if (!file) return; const dataBase64 = await new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result).split(",")[1] ?? ""); reader.onerror = reject; reader.readAsDataURL(file); }); upload.mutate({ name: file.name, mimeType: "model/gltf-binary", dataBase64, hotspots }); };
  return <section className="asset-lab-section" id="asset-lab"><div className="route-line"><span>09</span><i></i><b>PRIVATE ASSET LAB</b></div><div className="section-head"><div><span className="section-kicker">09 / GLB + HOTSPOTS</span><h2>Kendi modelini<br /><em>buraya bırak.</em></h2></div><span className="section-note">50 MB MAX · LOCAL FIRST</span></div><div className="asset-lab-grid"><div className="asset-lab-stage"><Canvas camera={{ position: [0, 0, 4], fov: 42 }} dpr={[1, 1.25]} gl={{ antialias: false }}><ambientLight intensity={1.5} /><pointLight position={[2, 2, 3]} intensity={8} color="#315CFF" /><pointLight position={[-2, -1, 2]} intensity={5} color="#F05A3C" />{url ? <LoadedModel url={url} hotspots={hotspots} onHotspot={setActive} /> : <mesh rotation={[0.35, 0.2, 0]}><boxGeometry args={[1.2, 1.2, 1.2]} /><meshStandardMaterial color="#e6e2d6" metalness={0.8} roughness={0.2} /></mesh>}</Canvas><div className="asset-lab-stage-label"><MousePointer2 size={14} /> {active ? active.label : "Noktaları görmek için kırmızı işaretlere tıkla"}</div></div><div className="asset-lab-panel"><label className="asset-dropzone"><FileUp size={19} /><strong>{file ? file.name : "GLB dosyanı seç"}</strong><span>{fileSize}</span><input type="file" accept=".glb,model/gltf-binary,application/octet-stream" onChange={(event) => readFile(event.target.files?.[0] ?? null)} /></label><button className="asset-upload-button" onClick={persist} disabled={!file || upload.isPending}><UploadCloud size={15} /> {upload.isPending ? "KAYDEDİLİYOR" : "ÖZEL KÜTÜPHANEYE KAYDET"}</button><div className="hotspot-list">{hotspots.map((hotspot) => <button key={hotspot.id} onClick={() => setActive(hotspot)} className={active?.id === hotspot.id ? "active" : ""}><Crosshair size={14} /><span><b>{hotspot.label}</b><small>{active?.id === hotspot.id ? hotspot.description : "3D işaret noktası"}</small></span><ArrowUpRight size={14} /></button>)}</div><p className="asset-lab-footnote">Dosya tarayıcıda önce yerel olarak açılır. Kaydetme işlemi oturum açmış kullanıcı için S3 metadata kaydı ve hotspot JSON'u oluşturur.</p></div></div></section>;
}
