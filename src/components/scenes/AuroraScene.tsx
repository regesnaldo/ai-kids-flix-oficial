'use client';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import * as THREE from 'three';

const STRIP_COUNT = 16;
const SPREAD = 18;
// Deterministic pseudo-RNG — no Math.random(), stable across renders
const rng = (s: number) => Math.abs(Math.sin(s * 127.1 + 311.7));

interface StripProps {
  baseX: number;
  phase: number;
  color: string;
  height: number;
  swayAmp: number;
}

function CurtainStrip({ baseX, phase, color, height, swayAmp }: StripProps) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    ref.current.position.x = baseX + Math.sin(t * 0.35 + phase) * swayAmp;
    ref.current.rotation.z = Math.sin(t * 0.25 + phase) * 0.05;
  });
  return (
    <mesh ref={ref} position={[baseX, 0, 0]}>
      <boxGeometry args={[0.45, height, 0.05]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={1.8}
        transparent
        opacity={0.75}
      />
    </mesh>
  );
}

// Pre-computed at module level — deterministic, no re-computation on re-render
const STRIPS: StripProps[] = Array.from({ length: STRIP_COUNT }, (_, i) => ({
  baseX: (i / (STRIP_COUNT - 1)) * SPREAD - SPREAD / 2,
  phase: i * 0.55,
  color: i % 2 === 0 ? '#10B981' : '#8B5CF6',
  height: 8 + rng(i * 3) * 6,
  swayAmp: 0.8 + rng(i * 7) * 1.4,
}));

export function AuroraScene() {
  return (
    <>
      <color attach="background" args={['#010509']} />
      <ambientLight intensity={0.05} />
      <pointLight position={[0, 10, 4]} intensity={12} color="#10B981" />
      <pointLight position={[0, -4, 4]} intensity={6} color="#8B5CF6" />

      {STRIPS.map((s, i) => (
        <CurtainStrip key={i} {...s} />
      ))}

      <Sparkles count={200} scale={24} size={1.2} speed={0.4} color="#10B981" />
      <Sparkles count={80} scale={14} size={2.5} speed={0.7} color="#8B5CF6" />
    </>
  );
}

export default AuroraScene;
