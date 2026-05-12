'use client';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import * as THREE from 'three';

const PILLAR_COUNT = 8;
const ORBIT_R = 5.5;

function LogicCore() {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    ref.current.rotation.y = clock.elapsedTime * 0.3;
    ref.current.rotation.x = clock.elapsedTime * 0.15;
  });
  return (
    <mesh ref={ref}>
      <dodecahedronGeometry args={[1.3, 0]} />
      <meshStandardMaterial
        color="#FDE047"
        emissive="#F59E0B"
        emissiveIntensity={3.5}
        wireframe
      />
    </mesh>
  );
}

function Pillar({
  angle,
  phase,
  isGold,
}: {
  angle: number;
  phase: number;
  isGold: boolean;
}) {
  const ref = useRef<THREE.Mesh>(null!);
  const x = Math.cos(angle) * ORBIT_R;
  const z = Math.sin(angle) * ORBIT_R;
  const col = isGold ? '#F59E0B' : '#F1F5F9';
  const em = isGold ? '#D97706' : '#CBD5E1';

  useFrame(({ clock }) => {
    const sy = 1 + Math.sin(clock.elapsedTime * 0.8 + phase) * 0.45;
    ref.current.scale.y = sy;
    ref.current.position.y = (sy - 1) * 2;
  });

  return (
    <mesh ref={ref} position={[x, 0, z]}>
      <cylinderGeometry args={[0.14, 0.22, 4, 6]} />
      <meshStandardMaterial color={col} emissive={em} emissiveIntensity={2.5} />
    </mesh>
  );
}

const PILLARS = Array.from({ length: PILLAR_COUNT }, (_, i) => ({
  angle: (i / PILLAR_COUNT) * Math.PI * 2,
  phase: (i / PILLAR_COUNT) * Math.PI * 2,
  isGold: i % 2 === 0,
}));

export function EthosScene() {
  return (
    <>
      <color attach="background" args={['#050308']} />
      <ambientLight intensity={0.08} />
      <pointLight position={[0, 8, 0]} intensity={20} color="#F59E0B" />
      <pointLight position={[0, -5, 0]} intensity={8} color="#F1F5F9" />

      <LogicCore />

      {PILLARS.map((p, i) => (
        <Pillar key={i} {...p} />
      ))}

      <Sparkles count={300} scale={22} size={1.5} speed={0.5} color="#F59E0B" />
      <Sparkles count={100} scale={14} size={3.0} speed={0.8} color="#F1F5F9" />
    </>
  );
}

export default EthosScene;
