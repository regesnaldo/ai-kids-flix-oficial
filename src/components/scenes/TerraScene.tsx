'use client';
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import * as THREE from 'three';

// Deterministic pseudo-RNG — no Math.random(), stable across renders
const rng = (s: number) => Math.abs(Math.sin(s * 127.1 + 311.7));

interface StoneProps {
  position: [number, number, number];
  size: number;
  speed: number;
  isAmber: boolean;
  floatPhase: number;
}

function FloatingStone({ position, size, speed, isAmber, floatPhase }: StoneProps) {
  const ref = useRef<THREE.Mesh>(null!);
  const col = isAmber ? '#F59E0B' : '#14B8A6';
  const em  = isAmber ? '#D97706' : '#0D9488';

  useFrame(({ clock }) => {
    ref.current.rotation.y = clock.elapsedTime * speed;
    ref.current.rotation.x = clock.elapsedTime * speed * 0.6;
    ref.current.position.y =
      position[1] + Math.sin(clock.elapsedTime * 0.5 + floatPhase) * 0.6;
  });

  return (
    <mesh ref={ref} position={position}>
      <icosahedronGeometry args={[size, 0]} />
      <meshStandardMaterial color={col} emissive={em} emissiveIntensity={1.8} />
    </mesh>
  );
}

// Hex ground platforms — 1 center + 6 ring
const HEX_CENTERS: [number, number][] = [
  [0, 0],
  [3, 0],
  [-3, 0],
  [1.5, 2.6],
  [-1.5, 2.6],
  [1.5, -2.6],
  [-1.5, -2.6],
];

function HexPlatform({ cx, cz }: { cx: number; cz: number }) {
  return (
    <mesh position={[cx, -3.5, cz]}>
      <cylinderGeometry args={[1.2, 1.2, 0.15, 6]} />
      <meshStandardMaterial
        color="#78350F"
        emissive="#92400E"
        emissiveIntensity={0.8}
      />
    </mesh>
  );
}

export function TerraScene() {
  const stones = useMemo<StoneProps[]>(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        position: [
          (rng(i * 3) - 0.5) * 14,
          rng(i * 7) * 5 - 1,
          (rng(i * 11) - 0.5) * 10,
        ] as [number, number, number],
        size: 0.3 + rng(i * 13) * 0.7,
        speed: 0.2 + rng(i * 17) * 0.4,
        isAmber: i % 3 !== 0,
        floatPhase: i * 0.7,
      })),
    []
  );

  return (
    <>
      <color attach="background" args={['#050a03']} />
      <ambientLight intensity={0.1} />
      <pointLight position={[0, 6, 0]} intensity={15} color="#F59E0B" />
      <pointLight position={[0, -2, 6]} intensity={8} color="#14B8A6" />

      {HEX_CENTERS.map(([cx, cz], i) => (
        <HexPlatform key={i} cx={cx} cz={cz} />
      ))}

      {stones.map((s, i) => (
        <FloatingStone key={i} {...s} />
      ))}

      <Sparkles count={250} scale={20} size={1.8} speed={0.6} color="#F59E0B" />
      <Sparkles count={80} scale={12} size={3.0} speed={1.0} color="#14B8A6" />
    </>
  );
}

export default TerraScene;
