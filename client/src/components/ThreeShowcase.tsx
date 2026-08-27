// STYLE: Signal Atlas — high-contrast 3D lab, cobalt light, vermilion signal, editorial labels, reduced-motion fallback.
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";

function AtlasObject({ position, color, scale = 1, phase = 0 }: { position: [number, number, number]; color: string; scale?: number; phase?: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.x += delta * 0.22;
    ref.current.rotation.y += delta * 0.36;
    ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 1.2 + phase) * 0.12;
    const hovered = state.pointer.x > -0.2 && state.pointer.x < 0.45;
    const target = hovered ? scale * 1.12 : scale;
    ref.current.scale.lerp(new THREE.Vector3(target, target, target), 0.08);
  });
  return <mesh ref={ref} position={position} scale={scale} castShadow receiveShadow><icosahedronGeometry args={[0.82, 1]} /><meshStandardMaterial color={color} roughness={0.22} metalness={0.72} /></mesh>;
}

function Scene() {
  const group = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (!group.current) return;
    group.current.rotation.y += delta * 0.08;
    state.camera.position.x += (state.pointer.x * 0.65 - state.camera.position.x) * 0.025;
    state.camera.position.y += (-state.pointer.y * 0.35 - state.camera.position.y) * 0.025;
    state.camera.lookAt(0, 0, 0);
  });
  return <group ref={group}><AtlasObject position={[-1.35, 0.2, 0]} color="#315CFF" scale={1.05} phase={0} /><AtlasObject position={[1.2, 0.55, -0.25]} color="#F05A3C" scale={0.68} phase={1.5} /><AtlasObject position={[0.15, -0.95, 0.2]} color="#E6E2D6" scale={0.55} phase={3} /><mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.55, 0]} receiveShadow><circleGeometry args={[3.7, 64]} /><meshStandardMaterial color="#111214" roughness={0.78} metalness={0.2} /></mesh></group>;
}

export default function ThreeShowcase() {
  return <section className="three-showcase" id="three-lab"><div className="three-copy"><span className="section-kicker">05 / MOTION LAB</span><h2>Arayüz değil.<br /><em>bir alan.</em></h2><p>Pointer hareketi kamerayı yönlendirir; yüzeyler kendi yörüngesinde döner. React Three Fiber ve drei ile kurulan bu sahne, 3D web'in temel yapı taşlarını canlı gösterir.</p><div className="three-pills"><span>R3F / Canvas</span><span>DREI / FLOAT</span><span>POINTER PARALLAX</span></div><a href="https://r3f.docs.pmnd.rs/" target="_blank" rel="noreferrer">Tekniği incele <span>↗</span></a></div><div className="three-canvas"><Canvas camera={{ position: [0, 0.1, 5.2], fov: 42 }} dpr={[1, 1.5]} shadows fallback={<div className="three-fallback">3D fallback / CSS surface</div>}><color attach="background" args={["#0b0c0e"]} /><ambientLight intensity={1.15} /><directionalLight position={[3, 4, 4]} intensity={3.6} castShadow /><pointLight position={[-3, -1, 3]} color="#315CFF" intensity={16} distance={8} /><pointLight position={[3, 2, 1]} color="#F05A3C" intensity={10} distance={7} /><Scene /></Canvas><div className="three-coord">POINTER → CAMERA<br />SCENE / 05—26</div></div></section>;
}
