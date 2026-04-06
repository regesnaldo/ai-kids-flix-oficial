"use client";

import { useMemo } from "react";
import { Float } from "@react-three/drei";

interface TerraSceneProps {
  empathyScore: number;
}

export function TerraScene({ empathyScore }: TerraSceneProps) {
  const growth = useMemo(() => 0.8 + Math.min(1.6, empathyScore * 0.45), [empathyScore]);
  const glow = useMemo(() => 0.2 + Math.min(0.9, empathyScore * 0.35), [empathyScore]);

  return (
    <>
      <color attach="background" args={["#03110a"]} />
      <fog attach="fog" args={["#03110a", 8, 34]} />
      <ambientLight intensity={0.25} />
      <pointLight position={[3, 6, 4]} color="#22c55e" intensity={1.4} />
      <pointLight position={[-5, 2, -3]} color="#84cc16" intensity={1.1} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.5, 0]}>
        <circleGeometry args={[16, 64]} />
        <meshStandardMaterial color="#14532d" emissive="#166534" emissiveIntensity={0.2} />
      </mesh>

      {Array.from({ length: 18 }).map((_, i) => {
        const angle = (i / 18) * Math.PI * 2;
        const r = 4 + (i % 3) * 1.2;
        const x = Math.cos(angle) * r;
        const z = Math.sin(angle) * r;
        return (
          <Float key={i} speed={1 + (i % 4) * 0.2} floatIntensity={0.25} rotationIntensity={0.1}>
            <mesh position={[x, -2 + (growth * (0.4 + (i % 4) * 0.15)), z]} scale={[0.3, growth, 0.3]}>
              <cylinderGeometry args={[0.12, 0.2, 2, 8]} />
              <meshStandardMaterial color="#16a34a" emissive="#22c55e" emissiveIntensity={glow} />
            </mesh>
            <mesh position={[x, -1 + growth * 0.95, z]}>
              <sphereGeometry args={[0.34 + (growth - 0.8) * 0.15, 12, 12]} />
              <meshStandardMaterial color="#86efac" emissive="#4ade80" emissiveIntensity={glow} />
            </mesh>
          </Float>
        );
      })}
    </>
  );
}

