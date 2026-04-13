'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, PointMaterial, Points } from '@react-three/drei';
import * as THREE from 'three';
import { useNexusStore } from '@/store/useNexusStore';

const PARTICLE_COUNT = 2000;
const NEXUS_COLOR = new THREE.Color('#00FFFF');

function generateParticlePositions(count: number): Float32Array {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const radius = 20 + Math.random() * 30;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i3 + 2] = radius * Math.cos(phi);
  }
  return positions;
}

export function Particles({ size = 0.08 }: { size?: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const positions = useMemo(() => generateParticlePositions(PARTICLE_COUNT), []);
  const { particleSpeed } = useNexusStore();

  useFrame((state) => {
    if (!pointsRef.current) return;
    const time = state.clock.getElapsedTime();
    pointsRef.current.rotation.y = time * (particleSpeed * 0.1);
    pointsRef.current.rotation.x = Math.sin(time * (particleSpeed * 0.2)) * 0.1;
  });

  return (
    <Float speed={particleSpeed * 5} rotationIntensity={particleSpeed} floatIntensity={particleSpeed * 2}>
      <Points ref={pointsRef} positions={positions}>
        <PointMaterial
          transparent
          color={NEXUS_COLOR}
          size={size}
          sizeAttenuation
          depthWrite={false}
          opacity={0.6}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </Float>
  );
}

