'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

const PARTICLE_COUNT = 2000;
const NEXUS_COLOR = new THREE.Color('#3B82F6');
const SPACE_BLACK = new THREE.Color('#000000');

function generateParticlePositions(count: number): Float32Array {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const radius = 20 + Math.random() * 30;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i3]     = radius * Math.sin(phi) * Math.cos(theta);
    positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i3 + 2] = radius * Math.cos(phi);
  }
  return positions;
}

function FloatingParticles() {
  const pointsRef = useRef<THREE.Points>(null);
  const positions = useMemo(() => generateParticlePositions(PARTICLE_COUNT), []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const time = state.clock.getElapsedTime();
    pointsRef.current.rotation.y = time * 0.02;
    pointsRef.current.rotation.x = Math.sin(time * 0.05) * 0.1;
  });

  return (
    <Points ref={pointsRef} positions={positions}>
      <PointMaterial transparent color={NEXUS_COLOR} size={0.08} sizeAttenuation depthWrite={false} opacity={0.6} blending={THREE.AdditiveBlending} />
    </Points>
  );
}

function NexusCore() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();
    const pulse = 1 + Math.sin(time * 0.8) * 0.05;
    meshRef.current.scale.set(pulse, pulse, pulse);
    meshRef.current.rotation.y = time * 0.1;
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <sphereGeometry args={[1.5, 64, 64]} />
        <meshStandardMaterial color="#1E40AF" emissive={NEXUS_COLOR} emissiveIntensity={0.8} roughness={0.2} metalness={0.9} transparent opacity={0.95} />
      </mesh>
      <Sparkles count={50} scale={4} size={2} speed={0.3} color={NEXUS_COLOR} opacity={0.4} />
    </Float>
  );
}

function AutoCamera() {
  useFrame((state) => {
    const { camera, clock } = state;
    const time = clock.getElapsedTime();
    const radius = 15 + Math.sin(time * 0.1) * 0.5;
    const x = Math.sin(time * 0.05) * radius * 0.3;
    const y = Math.cos(time * 0.07) * radius * 0.1;
    const z = radius + Math.sin(time * 0.03) * 0.3;
    camera.position.lerp(new THREE.Vector3(x, y, z), 0.005);
    camera.lookAt(0, 0, 0);
  });
  return null;
}

export function NexusScene() {
  return (
    <>
      <color attach="background" args={[SPACE_BLACK]} />
      <fog attach="fog" args={[SPACE_BLACK, 25, 55]} />
      <ambientLight intensity={0.1} />
      <pointLight position={[10, 10, 10]} intensity={0.5} color={NEXUS_COLOR} />
      <pointLight position={[-10, -10, -10]} intensity={0.3} color="#60A5FA" />
      <NexusCore />
      <FloatingParticles />
      <AutoCamera />
      <Sparkles count={200} scale={50} size={0.5} speed={0.1} color="#94A3B8" opacity={0.3} />
    </>
  );
}
