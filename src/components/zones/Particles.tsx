'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial, Float } from '@react-three/drei';
import * as THREE from 'three';
import { useNexusStore } from '@/store/useNexusStore';

const PARTICLE_COUNT = 2000;
const NEXUS_COLOR = new THREE.Color('#00FFFF'); // Cyan/Neon

function generateParticlePositions(count: number): Float32Array {
  console.log('📊 Partículas count:', count);
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

export function Particles() {
  const pointsRef = useRef<THREE.Points>(null);
  const positions = useMemo(() => generateParticlePositions(PARTICLE_COUNT), []);
  const { particleSpeed } = useNexusStore();
  const { camera } = useThree();

  useEffect(() => {
    console.log('🎥 Câmera pos:', camera.position, 'lookAt:', camera.rotation);
    console.log('🧪 Material color:', `#${NEXUS_COLOR.getHexString()}`, 'emissive:', undefined, 'transparent:', true, 'opacity:', 0.6);
  }, [camera]);

  useFrame((state) => {
    if (!pointsRef.current) return;

    const time = state.clock.getElapsedTime();
    const positionsAttr = pointsRef.current.geometry.attributes.position;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      const baseX = positionsAttr.getX(i);
      const baseY = positionsAttr.getY(i);
      const baseZ = positionsAttr.getZ(i);

      const breath = Math.sin(time * particleSpeed + i * 0.01) * 0.02;
      const swirl = Math.cos(time * (particleSpeed * 0.3) + i * 0.005) * 0.01;

      positionsAttr.setX(i, baseX + breath);
      positionsAttr.setY(i, baseY + swirl);
      positionsAttr.setZ(i, baseZ + breath * 0.5);
    }

    positionsAttr.needsUpdate = true;

    pointsRef.current.rotation.y = time * (particleSpeed * 0.1);
    pointsRef.current.rotation.x = Math.sin(time * (particleSpeed * 0.2)) * 0.1;
  });

  return (
    <Float speed={particleSpeed * 5} rotationIntensity={particleSpeed} floatIntensity={particleSpeed * 2}>
      <Points ref={pointsRef} positions={positions}>
        <PointMaterial
          transparent
          color={NEXUS_COLOR}
          size={0.08}
          sizeAttenuation
          depthWrite={false}
          opacity={0.6}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </Float>
  );
}
