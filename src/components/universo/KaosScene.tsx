"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, Sparkles } from "@react-three/drei";
import * as THREE from "three";

function FragmentedCore() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    groupRef.current.children.forEach((child, i) => {
      const mesh = child as THREE.Mesh;
      const burst = 1 + Math.sin(t * 2.3 + i * 1.7) * 0.35;
      mesh.position.x = Math.cos(i * 1.2) * burst * 2.2;
      mesh.position.y = Math.sin(t * 1.7 + i) * 1.2;
      mesh.position.z = Math.sin(i * 1.6) * burst * 2.2;
      mesh.rotation.x += 0.008;
      mesh.rotation.y += 0.01;
    });
    groupRef.current.rotation.y += 0.004;
  });

  return (
    <group ref={groupRef}>
      {Array.from({ length: 20 }).map((_, i) => (
        <mesh key={i}>
          <icosahedronGeometry args={[0.45 + (i % 3) * 0.14, 0]} />
          <meshStandardMaterial color="#e879f9" emissive="#a21caf" emissiveIntensity={0.8} />
        </mesh>
      ))}
    </group>
  );
}

export function KaosScene() {
  return (
    <>
      <color attach="background" args={["#07010f"]} />
      <fog attach="fog" args={["#07010f", 8, 30]} />
      <ambientLight intensity={0.18} />
      <pointLight position={[0, 5, 0]} color="#d946ef" intensity={1.7} />
      <pointLight position={[-6, -3, -2]} color="#ec4899" intensity={1.2} />
      <Float speed={2.2} rotationIntensity={1} floatIntensity={0.7}>
        <FragmentedCore />
      </Float>
      <Sparkles count={260} scale={25} size={2.2} speed={1.5} color="#f0abfc" />
    </>
  );
}

