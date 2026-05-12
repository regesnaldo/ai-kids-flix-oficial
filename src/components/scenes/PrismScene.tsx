'use client';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import * as THREE from 'three';

// Deterministic pseudo-RNG — no Math.random(), stable across renders
const rng = (s: number) => Math.abs(Math.sin(s * 127.1 + 311.7));

// Full rainbow spectrum + white — 12 shards
const SPECTRUM = [
  '#FF4444', '#FF7700', '#FFD700', '#44FF66',
  '#00FFFF', '#4488FF', '#AA44FF', '#FF44CC',
  '#FF6644', '#44FFAA', '#CC44FF', '#FFFFFF',
] as const;

interface ShardProps {
  position: [number, number, number];
  baseRot: [number, number, number];
  color: string;
  speed: number;
  w: number;
  h: number;
  floatPhase: number;
}

function GlassShard({ position, baseRot, color, speed, w, h, floatPhase }: ShardProps) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    ref.current.rotation.x = baseRot[0] + t * speed * 0.30;
    ref.current.rotation.y = baseRot[1] + t * speed;
    ref.current.rotation.z = baseRot[2] + t * speed * 0.50;
    ref.current.position.y = position[1] + Math.sin(t * 0.4 + floatPhase) * 0.6;
  });
  return (
    <mesh ref={ref} position={position}>
      <boxGeometry args={[w, 0.06, h]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={2.5}
        transparent
        opacity={0.88}
      />
    </mesh>
  );
}

// All shard data pre-computed at module level — deterministic, no re-computation
const SHARDS: ShardProps[] = SPECTRUM.map((color, i) => ({
  position: [
    (rng(i * 3)  - 0.5) * 16,
    (rng(i * 7)  - 0.5) * 8,
    (rng(i * 11) - 0.5) * 10,
  ] as [number, number, number],
  baseRot: [
    rng(i * 13) * Math.PI,
    rng(i * 17) * Math.PI,
    rng(i * 19) * Math.PI,
  ] as [number, number, number],
  color,
  speed:      0.30 + rng(i * 23) * 0.50,
  w:          1.4  + rng(i * 29) * 1.60,
  h:          0.9  + rng(i * 31) * 1.20,
  floatPhase: i * 0.6,
}));

export function PrismScene() {
  return (
    <>
      <color attach="background" args={['#050205']} />
      <ambientLight intensity={0.12} />
      <pointLight position={[ 0,  6,  4]} intensity={30} color="#FFFFFF" />
      <pointLight position={[-5, -3,  0]} intensity={10} color="#A78BFA" />
      <pointLight position={[ 5, -3,  0]} intensity={10} color="#22D3EE" />

      {SHARDS.map((s, i) => (
        <GlassShard key={i} {...s} />
      ))}

      <Sparkles count={300} scale={24} size={1.6} speed={0.9} color="#FFFFFF" />
      <Sparkles count={120} scale={14} size={2.8} speed={1.3} color="#A78BFA" />
    </>
  );
}

export default PrismScene;
