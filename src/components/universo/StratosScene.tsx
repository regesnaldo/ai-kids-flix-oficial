"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

function ChessTower() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    groupRef.current.rotation.y = t * 0.15;
  });

  return (
    <group ref={groupRef}>
      {Array.from({ length: 16 }).map((_, i) => (
        <mesh key={`segment-${i}`} position={[0, i * 0.9 - 7, 0]}>
          <cylinderGeometry args={[2.5 - (i % 2) * 0.15, 2.7 - (i % 2) * 0.15, 0.8, 16]} />
          <meshStandardMaterial
            color={i % 2 === 0 ? "#1f2937" : "#06b6d4"}
            emissive={i % 2 === 0 ? "#0f172a" : "#0e7490"}
            emissiveIntensity={0.35}
          />
        </mesh>
      ))}
      <mesh position={[0, 8.2, 0]}>
        <coneGeometry args={[1.2, 2.1, 8]} />
        <meshStandardMaterial color="#67e8f9" emissive="#06b6d4" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

function SlowOrbitCamera() {
  useFrame(({ camera, clock }) => {
    const t = clock.getElapsedTime();
    const radius = 12;
    camera.position.x = Math.sin(t * 0.2) * radius;
    camera.position.z = Math.cos(t * 0.2) * radius;
    camera.position.y = 2 + Math.sin(t * 0.07) * 0.8;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

export function StratosScene() {
  return (
    <>
      <color attach="background" args={["#020617"]} />
      <fog attach="fog" args={["#020617", 10, 42]} />
      <ambientLight intensity={0.28} />
      <directionalLight position={[4, 9, 1]} intensity={1.1} color="#67e8f9" />
      <pointLight position={[-8, -2, -6]} intensity={0.8} color="#0ea5e9" />

      <Float speed={1.1} rotationIntensity={0.1} floatIntensity={0.2}>
        <ChessTower />
      </Float>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -8.2, 0]}>
        <circleGeometry args={[18, 64]} />
        <meshStandardMaterial color="#0f172a" emissive="#0b1120" emissiveIntensity={0.2} />
      </mesh>

      <SlowOrbitCamera />
    </>
  );
}

