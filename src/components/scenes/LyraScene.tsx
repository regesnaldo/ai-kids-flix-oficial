'use client';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import * as THREE from 'three';

const NODE_COUNT = 22;
const SPREAD = 16;

// 4 wave strings: 2 pink, 2 cyan — different frequency & speed
const STRING_CONFIGS = [
  { z: -3.5, freq: 2.0, speed: 2.0, amplitude: 3.2, color: '#EC4899' },
  { z: -1.2, freq: 3.0, speed: 2.8, amplitude: 2.4, color: '#22D3EE' },
  { z:  1.2, freq: 2.5, speed: 1.8, amplitude: 2.8, color: '#F472B6' },
  { z:  3.5, freq: 4.0, speed: 3.2, amplitude: 1.8, color: '#06B6D4' },
];

interface NodeSpec {
  xBase: number;
  z: number;
  xFrac: number;
  freq: number;
  speed: number;
  amplitude: number;
  color: string;
}

// All node data pre-computed at module level — stable, deterministic, no Math.random
const ALL_NODES: NodeSpec[] = STRING_CONFIGS.flatMap((cfg) =>
  Array.from({ length: NODE_COUNT }, (_, ni) => {
    const xFrac = ni / (NODE_COUNT - 1);
    return {
      xBase: xFrac * SPREAD - SPREAD / 2,
      z: cfg.z,
      xFrac,
      freq: cfg.freq,
      speed: cfg.speed,
      amplitude: cfg.amplitude,
      color: cfg.color,
    };
  })
);

function WaveNode({ xBase, z, xFrac, freq, speed, amplitude, color }: NodeSpec) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    // Traveling wave: y = amplitude * sin(xFrac * freq * 2π − time * speed)
    ref.current.position.y =
      Math.sin(xFrac * freq * Math.PI * 2 - clock.elapsedTime * speed) * amplitude;
  });
  return (
    <mesh ref={ref} position={[xBase, 0, z]}>
      <sphereGeometry args={[0.1, 6, 6]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={4} />
    </mesh>
  );
}

export function LyraScene() {
  return (
    <>
      <color attach="background" args={['#030108']} />
      <ambientLight intensity={0.08} />
      <pointLight position={[0, 6, 0]} intensity={14} color="#EC4899" />
      <pointLight position={[0, -4, 4]} intensity={8} color="#06B6D4" />

      {ALL_NODES.map((n, i) => (
        <WaveNode key={i} {...n} />
      ))}

      <Sparkles count={350} scale={22} size={2.0} speed={1.5} color="#EC4899" />
      <Sparkles count={130} scale={14} size={3.5} speed={2.0} color="#22D3EE" />
    </>
  );
}

export default LyraScene;
