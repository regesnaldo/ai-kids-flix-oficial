'use client';
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import * as THREE from 'three';

// Deterministic pseudo-RNG — no Math.random() in JSX, stable across renders
const rng = (seed: number) => Math.abs(Math.sin(seed * 127.1 + 311.7));

interface FragmentProps {
  position: [number, number, number];
  size: number;
  speed: number;
  rotAxis: [number, number, number];
}

function Fragment({ position, size, speed, rotAxis }: FragmentProps) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime * speed;
    ref.current.rotation.x = rotAxis[0] * t;
    ref.current.rotation.y = rotAxis[1] * t;
    ref.current.rotation.z = rotAxis[2] * t;
    ref.current.position.y = position[1] + Math.sin(t * 0.4) * 0.9;
  });
  return (
    <mesh ref={ref} position={position}>
      <octahedronGeometry args={[size, 0]} />
      <meshStandardMaterial
        color="#F43F5E"
        emissive="#E11D48"
        emissiveIntensity={1.5}
        wireframe
      />
    </mesh>
  );
}

export function KaosScene() {
  const fragments = useMemo<FragmentProps[]>(() =>
    Array.from({ length: 20 }, (_, i) => ({
      position: [
        (rng(i * 3) - 0.5) * 18,
        (rng(i * 3 + 1) - 0.5) * 10,
        (rng(i * 3 + 2) - 0.5) * 14,
      ] as [number, number, number],
      size: 0.35 + rng(i * 7) * 0.9,
      speed: 0.4 + rng(i * 11) * 1.6,
      rotAxis: [
        rng(i * 13) - 0.5,
        rng(i * 17) - 0.5,
        rng(i * 19) - 0.5,
      ] as [number, number, number],
    })),
  []);

  return (
    <>
      <color attach="background" args={['#0a0005']} />
      <ambientLight intensity={0.08} />
      <pointLight position={[0, 5, 5]} intensity={18} color="#F43F5E" />
      <pointLight position={[-6, -3, 0]} intensity={9} color="#D946EF" />

      {fragments.map((f, i) => (
        <Fragment key={i} {...f} />
      ))}

      <Sparkles count={380} scale={24} size={2.5} speed={4} color="#F43F5E" />
      <Sparkles count={140} scale={12} size={5} speed={6} color="#D946EF" />
    </>
  );
}

export default KaosScene;
