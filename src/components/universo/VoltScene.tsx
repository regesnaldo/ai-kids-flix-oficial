"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, Sparkles } from "@react-three/drei";
import * as THREE from "three";

function LightningRing() {
  const meshRef = useRef<THREE.Mesh>(null);
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uColorA: { value: new THREE.Color("#facc15") },
          uColorB: { value: new THREE.Color("#f97316") },
        },
        vertexShader: `
          varying vec2 vUv;
          uniform float uTime;
          void main() {
            vUv = uv;
            vec3 pos = position;
            float wave = sin((uv.x * 40.0) + uTime * 8.0) * 0.08;
            pos.z += wave;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `,
        fragmentShader: `
          varying vec2 vUv;
          uniform vec3 uColorA;
          uniform vec3 uColorB;
          uniform float uTime;
          float random (vec2 st) {
            return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
          }
          void main() {
            float bolt = smoothstep(0.45, 0.5, abs(sin(vUv.x * 60.0 + uTime * 10.0)));
            float noise = random(vUv + uTime * 0.2) * 0.3;
            vec3 color = mix(uColorA, uColorB, vUv.y + noise);
            float alpha = bolt * 0.9 + noise * 0.2;
            gl_FragColor = vec4(color, alpha);
          }
        `,
      }),
    [],
  );

  useFrame((state) => {
    if (!meshRef.current) return;
    material.uniforms.uTime.value = state.clock.getElapsedTime();
    meshRef.current.rotation.z += 0.004;
  });

  return (
    <mesh ref={meshRef} material={material}>
      <torusGeometry args={[3.5, 0.45, 32, 256]} />
    </mesh>
  );
}

function EnergyColumns() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    groupRef.current.children.forEach((child, i) => {
      child.position.y = Math.sin(t * 2 + i) * 0.6;
      child.scale.y = 1 + Math.sin(t * 3 + i * 0.7) * 0.4;
    });
    groupRef.current.rotation.y = t * 0.2;
  });

  return (
    <group ref={groupRef}>
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const r = 7.5;
        return (
          <mesh key={i} position={[Math.cos(angle) * r, 0, Math.sin(angle) * r]}>
            <cylinderGeometry args={[0.08, 0.18, 5, 8]} />
            <meshStandardMaterial color="#facc15" emissive="#fb923c" emissiveIntensity={1.2} />
          </mesh>
        );
      })}
    </group>
  );
}

export function VoltScene() {
  return (
    <>
      <color attach="background" args={["#050404"]} />
      <fog attach="fog" args={["#050404", 14, 38]} />
      <ambientLight intensity={0.2} />
      <pointLight position={[4, 7, 2]} color="#facc15" intensity={2.2} />
      <pointLight position={[-5, -3, -4]} color="#fb923c" intensity={1.3} />

      <Float speed={3} floatIntensity={0.8} rotationIntensity={0.8}>
        <LightningRing />
      </Float>
      <EnergyColumns />

      <Sparkles count={220} scale={24} size={2.4} speed={1.2} color="#fde047" />
    </>
  );
}

