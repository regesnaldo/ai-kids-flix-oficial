'use client';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import * as THREE from 'three';

function OrbitRing({
  radius,
  speed,
  tiltX = 0,
  tiltZ = 0,
  color,
}: {
  radius: number;
  speed: number;
  tiltX?: number;
  tiltZ?: number;
  color: string;
}) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    ref.current.rotation.y = clock.elapsedTime * speed;
    ref.current.rotation.x = tiltX;
    ref.current.rotation.z = tiltZ;
  });
  return (
    <mesh ref={ref}>
      <torusGeometry args={[radius, 0.045, 12, 80]} />
      <meshBasicMaterial color={color} />
    </mesh>
  );
}

function PulsingCore() {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    const s = 1 + Math.sin(clock.elapsedTime * 4) * 0.15;
    ref.current.scale.setScalar(s);
    ref.current.rotation.y = clock.elapsedTime * 0.5;
    ref.current.rotation.x = clock.elapsedTime * 0.3;
  });
  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[1.4, 1]} />
      <meshStandardMaterial
        color="#FDE047"
        emissive="#F59E0B"
        emissiveIntensity={4}
        wireframe
      />
    </mesh>
  );
}

export function VoltScene() {
  return (
    <>
      <color attach="background" args={['#030200']} />
      <ambientLight intensity={0.1} />
      <pointLight position={[0, 0, 6]} intensity={20} color="#F59E0B" />
      <pointLight position={[6, 6, 0]} intensity={10} color="#FB923C" />

      <PulsingCore />

      <OrbitRing radius={3.5} speed={0.6} tiltX={0.2} color="#F59E0B" />
      <OrbitRing radius={5.5} speed={-0.35} tiltX={Math.PI / 4} tiltZ={0.3} color="#FDE047" />
      <OrbitRing radius={8} speed={0.18} tiltX={Math.PI / 2.5} tiltZ={-0.2} color="#FB923C" />

      <Sparkles count={500} scale={24} size={2.2} speed={3} color="#F59E0B" />
      <Sparkles count={120} scale={10} size={5} speed={5} color="#FDE047" />
    </>
  );
}

export default VoltScene;
