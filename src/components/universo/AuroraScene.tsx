"use client";

import { Float, Sphere } from "@react-three/drei";
import * as THREE from "three";
import { useMemo } from "react";

interface AuroraSceneProps {
  mood: "curioso" | "neutro" | "reflexivo";
}

function moodGradient(mood: AuroraSceneProps["mood"]) {
  if (mood === "curioso") return ["#1e293b", "#7c3aed", "#22d3ee"] as const;
  if (mood === "reflexivo") return ["#1f2937", "#db2777", "#f59e0b"] as const;
  return ["#0f172a", "#2563eb", "#14b8a6"] as const;
}

export function AuroraScene({ mood }: AuroraSceneProps) {
  const [bg, glowA, glowB] = useMemo(() => moodGradient(mood), [mood]);
  const colorA = useMemo(() => new THREE.Color(glowA), [glowA]);
  const colorB = useMemo(() => new THREE.Color(glowB), [glowB]);

  return (
    <>
      <color attach="background" args={[bg]} />
      <fog attach="fog" args={[bg, 9, 38]} />
      <ambientLight intensity={0.28} />
      <pointLight position={[5, 6, 3]} color={colorA} intensity={1.5} />
      <pointLight position={[-6, 2, -4]} color={colorB} intensity={1.3} />

      <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.35}>
        <Sphere args={[3.2, 64, 64]} position={[0, 0.8, 0]}>
          <meshStandardMaterial color={colorA} emissive={colorB} emissiveIntensity={0.5} transparent opacity={0.8} />
        </Sphere>
      </Float>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.8, 0]}>
        <circleGeometry args={[18, 72]} />
        <meshStandardMaterial color="#111827" emissive={colorB} emissiveIntensity={0.2} />
      </mesh>
    </>
  );
}

