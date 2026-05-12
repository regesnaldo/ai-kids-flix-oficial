'use client';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import * as THREE from 'three';

function Portal({
  posX,
  rotDir,
  color,
  emissive,
  tiltZ,
}: {
  posX: number;
  rotDir: number;
  color: string;
  emissive: string;
  tiltZ: number;
}) {
  const outerRef = useRef<THREE.Mesh>(null!);
  const innerRef = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    outerRef.current.rotation.y = clock.elapsedTime * 0.30 * rotDir;
    outerRef.current.rotation.z = tiltZ + Math.sin(clock.elapsedTime * 0.2) * 0.05;
    innerRef.current.rotation.y = clock.elapsedTime * 0.65 * -rotDir;
    innerRef.current.rotation.x = clock.elapsedTime * 0.40 * rotDir;
  });

  return (
    <>
      <mesh ref={outerRef} position={[posX, 0, 0]}>
        <torusGeometry args={[3.2, 0.10, 12, 80]} />
        <meshStandardMaterial color={color} emissive={emissive} emissiveIntensity={3} />
      </mesh>
      <mesh ref={innerRef} position={[posX, 0, 0]}>
        <torusGeometry args={[2.0, 0.07, 10, 60]} />
        <meshStandardMaterial color={color} emissive={emissive} emissiveIntensity={2} />
      </mesh>
    </>
  );
}

function Nexus() {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    ref.current.rotation.y = clock.elapsedTime * 0.5;
    ref.current.rotation.x = clock.elapsedTime * 0.25;
  });
  return (
    <mesh ref={ref}>
      <octahedronGeometry args={[0.8, 0]} />
      <meshStandardMaterial
        color="#E2E8F0"
        emissive="#CBD5E1"
        emissiveIntensity={3}
        wireframe
      />
    </mesh>
  );
}

export function JanusScene() {
  return (
    <>
      <color attach="background" args={['#030308']} />
      <ambientLight intensity={0.06} />
      <pointLight position={[-8, 0, 4]} intensity={14} color="#CBD5E1" />
      <pointLight position={[ 8, 0, 4]} intensity={14} color="#94A3B8" />
      <pointLight position={[ 0, 0, 6]} intensity={20} color="#F1F5F9" />

      {/* Silver portal — left, spins clockwise */}
      <Portal posX={-4} rotDir={1}  color="#E2E8F0" emissive="#94A3B8" tiltZ={0.3} />
      {/* Obsidian portal — right, spins counter-clockwise */}
      <Portal posX={4}  rotDir={-1} color="#475569" emissive="#334155" tiltZ={-0.3} />

      <Nexus />

      <Sparkles count={260} scale={22} size={1.8} speed={1.2} color="#CBD5E1" />
      <Sparkles count={100} scale={13} size={3.2} speed={1.8} color="#94A3B8" />
    </>
  );
}

export default JanusScene;
