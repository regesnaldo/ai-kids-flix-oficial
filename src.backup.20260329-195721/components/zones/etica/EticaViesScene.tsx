"use client";
import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

const BUBBLES = [
  { label:"Gênero", bias:0.85, color:"#E50914" },
  { label:"Raça", bias:0.78, color:"#F97316" },
  { label:"Idade", bias:0.62, color:"#F59E0B" },
  { label:"Renda", bias:0.55, color:"#EAB308" },
  { label:"Região", bias:0.40, color:"#84CC16" },
  { label:"Educação", bias:0.35, color:"#10B981" },
  { label:"Idioma", bias:0.28, color:"#06B6D4" },
  { label:"Neutro", bias:0.10, color:"#3B82F6" },
];

function BiasBubble({ position, size, color, bias, index }:{ position:[number,number,number]; size:number; color:string; bias:number; index:number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state)=>{
    if(!ref.current) return;
    const t = state.clock.elapsedTime + index * 0.5;
    ref.current.position.x = position[0] + Math.sin(t*0.4)*0.2;
    ref.current.position.y = position[1] + Math.cos(t*0.6)*0.2;
    ref.current.position.z = position[2] + Math.sin(t*0.3)*0.1;
    (ref.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.3 + bias * 0.4 + Math.sin(t*1.5)*0.1;
  });
  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[size, 24, 24]} />
      <meshStandardMaterial
        color={color} emissive={color} emissiveIntensity={0.4}
        transparent opacity={0.55} roughness={0.1} metalness={0.3}
        wireframe={false}
      />
    </mesh>
  );
}

export default function EticaViesScene() {
  const positions = useMemo<[number,number,number][]>(()=>
    BUBBLES.map((_,i)=>[
      Math.sin(i * (Math.PI*2/BUBBLES.length)) * 2.2,
      Math.cos(i * (Math.PI*2/BUBBLES.length)) * 1.4,
      Math.sin(i * 0.8) * 0.8,
    ]), []);

  return (
    <div style={{ width:"100%", height:"100%", borderRadius:"12px", overflow:"hidden" }}>
      <Canvas camera={{ position:[0,0,6], fov:50 }} style={{ background:"transparent" }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[5,5,5]} intensity={1.5} color="#E50914" />
        <pointLight position={[-5,-5,5]} intensity={1} color="#3B82F6" />
        {BUBBLES.map((b,i)=>(
          <BiasBubble key={b.label}
            position={positions[i]}
            size={0.2 + b.bias * 0.5}
            color={b.color}
            bias={b.bias}
            index={i}
          />
        ))}
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  );
}
