'use client';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import * as THREE from 'three';

const TOP    = 8;
const HEIGHT = 16;
// Deterministic pseudo-RNG — no Math.random(), stable across renders
const rng = (s: number) => Math.abs(Math.sin(s * 127.1 + 311.7));
const BIT_COLORS = ['#4ADE80', '#22C55E', '#10B981'] as const;

interface BitProps {
  x: number;
  z: number;
  speed: number;
  startOffset: number;
  color: string;
  size: number;
}

function DataBit({ x, z, speed, startOffset, color, size }: BitProps) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    // Cascade from TOP downward, wrap back to top
    ref.current.position.y = TOP - ((clock.elapsedTime * speed + startOffset) % HEIGHT);
  });
  return (
    <mesh ref={ref} position={[x, 0, z]}>
      <boxGeometry args={[size, size, size]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={4} />
    </mesh>
  );
}

// 20 columns × 3 bits per column = 60 cascading data bits
const BITS: BitProps[] = Array.from({ length: 20 }, (_, ci) => {
  const x     = (rng(ci * 3)  - 0.5) * 18;
  const z     = (rng(ci * 7)  - 0.5) * 12;
  const speed = 2 + rng(ci * 11) * 3;
  return [0, 1, 2].map((bi) => ({
    x,
    z,
    speed,
    startOffset: bi * (HEIGHT / 3),
    color: BIT_COLORS[bi],
    size: bi === 0 ? 0.16 : 0.10,
  }));
}).flat();

export function CipherScene() {
  return (
    <>
      <color attach="background" args={['#000a02']} />
      <ambientLight intensity={0.06} />
      <pointLight position={[0,  8, 0]} intensity={16} color="#4ADE80" />
      <pointLight position={[0, -4, 4]} intensity={8}  color="#10B981" />

      {BITS.map((b, i) => (
        <DataBit key={i} {...b} />
      ))}

      <Sparkles count={320} scale={22} size={1.5} speed={0.7} color="#4ADE80" />
      <Sparkles count={110} scale={12} size={2.5} speed={1.0} color="#10B981" />
    </>
  );
}

export default CipherScene;
