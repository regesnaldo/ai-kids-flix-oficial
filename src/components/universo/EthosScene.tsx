"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

function FloatingBooks() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    groupRef.current.children.forEach((child, i) => {
      child.position.y = Math.sin(t * 0.7 + i * 0.6) * 1.1;
      child.position.x = Math.cos(t * 0.3 + i) * (4 + (i % 3));
      child.position.z = Math.sin(t * 0.3 + i) * (4 + (i % 3));
      child.rotation.y += 0.004;
    });
  });

  return (
    <group ref={groupRef}>
      {Array.from({ length: 14 }).map((_, i) => (
        <mesh key={i}>
          <boxGeometry args={[1.1, 0.2, 0.8]} />
          <meshStandardMaterial color="#fcd34d" emissive="#b45309" emissiveIntensity={0.35} />
        </mesh>
      ))}
    </group>
  );
}

function CandleHalo() {
  return (
    <group>
      {Array.from({ length: 18 }).map((_, i) => {
        const angle = (i / 18) * Math.PI * 2;
        const r = 6;
        return (
          <mesh key={i} position={[Math.cos(angle) * r, -2.9, Math.sin(angle) * r]}>
            <cylinderGeometry args={[0.08, 0.08, 0.8, 10]} />
            <meshStandardMaterial color="#fde68a" emissive="#f59e0b" emissiveIntensity={1.4} />
          </mesh>
        );
      })}
    </group>
  );
}

export function EthosScene() {
  return (
    <>
      <color attach="background" args={["#120804"]} />
      <fog attach="fog" args={["#120804", 8, 38]} />
      <ambientLight intensity={0.22} />
      <pointLight position={[0, 7, 0]} color="#f59e0b" intensity={1.4} />
      <pointLight position={[-7, -2, -3]} color="#b45309" intensity={0.9} />
      <Float speed={1} rotationIntensity={0.2} floatIntensity={0.2}>
        <FloatingBooks />
      </Float>
      <CandleHalo />
    </>
  );
}

