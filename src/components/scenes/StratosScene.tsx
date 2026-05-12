'use client';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import * as THREE from 'three';

function ChessTile({
  x,
  z,
  phase,
  isDark,
}: {
  x: number;
  z: number;
  phase: number;
  isDark: boolean;
}) {
  const ref = useRef<THREE.Mesh>(null!);
  const color = isDark ? '#10B981' : '#0EA5E9';
  useFrame(({ clock }) => {
    ref.current.position.y = Math.sin(clock.elapsedTime * 0.7 + phase) * 1.2 - 1.5;
  });
  return (
    <mesh ref={ref} position={[x * 2.6, -1.5, z * 2.6]}>
      <boxGeometry args={[2.3, 0.1, 2.3]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} />
    </mesh>
  );
}

function Pillar({ x, z, phase }: { x: number; z: number; phase: number }) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    ref.current.scale.y = 0.6 + Math.sin(clock.elapsedTime * 0.5 + phase) * 0.35;
    ref.current.position.y = Math.sin(clock.elapsedTime * 0.5 + phase) * 1.2 - 0.5;
  });
  return (
    <mesh ref={ref} position={[x * 5.2, 0, z * 5.2]}>
      <cylinderGeometry args={[0.1, 0.1, 4, 6]} />
      <meshStandardMaterial color="#0EA5E9" emissive="#0EA5E9" emissiveIntensity={2} />
    </mesh>
  );
}

const GRID = [-2, -1, 0, 1, 2] as const;
const CORNERS: [number, number][] = [[-1, -1], [1, -1], [-1, 1], [1, 1]];

export function StratosScene() {
  return (
    <>
      <color attach="background" args={['#010a07']} />
      <ambientLight intensity={0.15} />
      <pointLight position={[0, 12, 0]} intensity={8} color="#10B981" />
      <pointLight position={[0, -4, 10]} intensity={4} color="#0EA5E9" />

      {GRID.flatMap((x) =>
        GRID.map((z) => (
          <ChessTile
            key={`${x}-${z}`}
            x={x}
            z={z}
            phase={(x + z) * 0.4}
            isDark={(Math.abs(x) + Math.abs(z)) % 2 === 0}
          />
        ))
      )}

      {CORNERS.map(([x, z]) => (
        <Pillar key={`p${x}${z}`} x={x} z={z} phase={x * z * 0.5} />
      ))}

      <Sparkles count={200} scale={22} size={1.5} speed={0.6} color="#10B981" />
      <Sparkles count={70} scale={12} size={3.5} speed={1.2} color="#0EA5E9" />
    </>
  );
}

export default StratosScene;
