"use client";
import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Line } from "@react-three/drei";
import * as THREE from "three";

const WORDS = ["rei","rainha","homem","mulher","paris","franca","amor","odio","quente","frio","rapido","lento"];
const COLORS = ["#3B82F6","#8B5CF6","#EC4899","#10B981","#F59E0B","#06B6D4","#E50914","#34D399","#A855F7","#FB923C","#6366F1","#84CC16"];

function EmbeddingPoint({ position, color, index }: { position: [number,number,number]; color: string; index: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime + index * 0.4;
    ref.current.position.x = position[0] + Math.sin(t * 0.5) * 0.15;
    ref.current.position.y = position[1] + Math.cos(t * 0.7) * 0.15;
    ref.current.position.z = position[2] + Math.sin(t * 0.3) * 0.1;
    (ref.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.4 + Math.sin(t * 2) * 0.3;
  });
  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.1, 12, 12]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} roughness={0.1} metalness={0.8} />
    </mesh>
  );
}

function ClusterLines({ positions }: { positions: [number,number,number][] }) {
  const pairs = useMemo(() => {
    const related = [[0,2],[1,3],[4,5],[6,7],[8,9],[10,11]];
    return related
      .filter(([a,b]) => positions[a] && positions[b])
      .map(([a,b]) => ({
        from: new THREE.Vector3(...positions[a]),
        to: new THREE.Vector3(...positions[b]),
      }));
  }, [positions]);

  return (
    <>
      {pairs.map((p, i) => (
        <Line key={i} points={[p.from, p.to]} color="#ffffff" lineWidth={0.3} transparent opacity={0.12} />
      ))}
    </>
  );
}

export default function EmbeddingsScene() {
  const positions = useMemo<[number,number,number][]>(() =>
    WORDS.map((_, i) => [
      Math.sin(i * 1.3) * 2.2,
      Math.cos(i * 1.1) * 1.8,
      Math.sin(i * 0.7) * 1.5,
    ]), []);

  return (
    <div style={{ width:"100%", height:"100%", borderRadius:"12px", overflow:"hidden" }}>
      <Canvas camera={{ position:[0,0,6], fov:50 }} style={{ background:"transparent" }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[5,5,5]} intensity={1.5} color="#EC4899" />
        <pointLight position={[-5,-5,5]} intensity={1} color="#8B5CF6" />
        <ClusterLines positions={positions} />
        {WORDS.map((word, i) => (
          <EmbeddingPoint key={word} position={positions[i]} color={COLORS[i % COLORS.length]} index={i} />
        ))}
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.6} />
      </Canvas>
    </div>
  );
}
