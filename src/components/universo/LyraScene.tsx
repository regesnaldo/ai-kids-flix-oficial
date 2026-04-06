"use client";

import { useMemo } from "react";
import { Float, Sparkles } from "@react-three/drei";
import * as THREE from "three";

interface LyraSceneProps {
  audioLevel: number;
}

function colorFromAudio(audioLevel: number) {
  const hue = 0.75 + Math.min(0.2, audioLevel * 0.2);
  const color = new THREE.Color();
  color.setHSL(hue % 1, 0.75, 0.55);
  return color;
}

export function LyraScene({ audioLevel }: LyraSceneProps) {
  const reactiveColor = useMemo(() => colorFromAudio(audioLevel), [audioLevel]);
  const emissiveIntensity = 0.35 + Math.min(0.85, audioLevel * 1.5);

  return (
    <>
      <color attach="background" args={["#14081f"]} />
      <fog attach="fog" args={["#14081f", 8, 32]} />
      <ambientLight intensity={0.24} />
      <pointLight position={[4, 5, 2]} color={reactiveColor} intensity={1.8} />
      <pointLight position={[-5, -2, -3]} color="#fb7185" intensity={1.2} />

      <Float speed={1.8} rotationIntensity={0.6} floatIntensity={0.6}>
        <mesh>
          <torusKnotGeometry args={[2.1, 0.5, 160, 24]} />
          <meshStandardMaterial color={reactiveColor} emissive={reactiveColor} emissiveIntensity={emissiveIntensity} />
        </mesh>
      </Float>

      <Sparkles
        count={240}
        scale={24}
        size={2.3 + audioLevel * 2}
        speed={0.7 + audioLevel}
        color={reactiveColor}
      />
    </>
  );
}

