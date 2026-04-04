"use client";
import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, Line } from "@react-three/drei";
import * as THREE from "three";

function AttentionHead({ position, color, speed }: { position: [number,number,number]; color: string; speed: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * speed;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * speed * 0.5) * 0.3;
    const s = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.08;
    ref.current.scale.setScalar(s);
  });
  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.18, 16, 16]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} roughness={0.2} metalness={0.8} />
    </mesh>
  );
}

function TokenNode({ position, label }: { position: [number,number,number]; label: string }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.05;
  });
  return (
    <mesh ref={ref} position={position}>
      <boxGeometry args={[0.35, 0.18, 0.08]} />
      <meshStandardMaterial color="#1e293b" emissive="#3B82F6" emissiveIntensity={0.3} roughness={0.3} metalness={0.6} />
    </mesh>
  );
}

function AttentionLines() {
  const tokens = [-1.2, -0.4, 0.4, 1.2];
  const heads = [
    { pos: [0, 1.2, 0] as [number,number,number], color: "#3B82F6" },
    { pos: [0, 0.6, 0] as [number,number,number], color: "#8B5CF6" },
    { pos: [0, 0, 0] as [number,number,number], color: "#EC4899" },
  ];

  return (
    <>
      {heads.map((head, hi) =>
        tokens.map((tx, ti) => {
          const opacity = 0.1 + (ti === hi ? 0.6 : 0.15);
          const points = [
            new THREE.Vector3(tx, -1.2, 0),
            new THREE.Vector3(head.pos[0], head.pos[1], head.pos[2]),
          ];
          return (
            <Line key={`${hi}-${ti}`} points={points}
              color={head.color} lineWidth={opacity > 0.4 ? 1.5 : 0.5}
              transparent opacity={opacity} />
          );
        })
      )}
    </>
  );
}

function Scene() {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.15;
  });

  const tokens = ["O", "gato", "é", "rápido"];
  const heads = [
    { pos: [-0.6, 1.2, 0] as [number,number,number], color: "#3B82F6", speed: 0.8 },
    { pos: [0, 1.2, 0.5] as [number,number,number], color: "#8B5CF6", speed: 1.1 },
    { pos: [0.6, 1.2, 0] as [number,number,number], color: "#EC4899", speed: 0.6 },
    { pos: [0, 1.2, -0.5] as [number,number,number], color: "#06B6D4", speed: 0.9 },
  ];

  return (
    <group ref={groupRef}>
      {tokens.map((t, i) => (
        <TokenNode key={t} position={[(i - 1.5) * 0.8, -1.2, 0]} label={t} />
      ))}
      {heads.map((h, i) => (
        <AttentionHead key={i} position={h.pos} color={h.color} speed={h.speed} />
      ))}
      <AttentionLines />
      <mesh position={[0, 0, 0]}>
        <torusGeometry args={[1.5, 0.02, 8, 64]} />
        <meshStandardMaterial color="#3B82F6" emissive="#3B82F6" emissiveIntensity={0.3} transparent opacity={0.4} />
      </mesh>
    </group>
  );
}

export default function TransformerScene() {
  return (
    <div style={{ width: "100%", height: "100%", borderRadius: "12px", overflow: "hidden" }}>
      <Canvas camera={{ position: [0, 0, 4.5], fov: 50 }} style={{ background: "transparent" }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[5, 5, 5]} intensity={1.5} color="#3B82F6" />
        <pointLight position={[-5, -5, 5]} intensity={1} color="#8B5CF6" />
        <Scene />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate={false} />
      </Canvas>
    </div>
  );
}
