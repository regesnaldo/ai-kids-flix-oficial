'use client';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import * as THREE from 'three';

const GRID_COORDS = [-4, -2, 0, 2, 4] as const;

function GridNode({ x, z, phase }: { x: number; z: number; phase: number }) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    ref.current.scale.y = 0.6 + Math.sin(clock.elapsedTime * 1.2 + phase) * 0.5;
  });
  return (
    <mesh ref={ref} position={[x, -4, z]}>
      <boxGeometry args={[0.12, 0.6, 0.12]} />
      <meshStandardMaterial color="#60A5FA" emissive="#3B82F6" emissiveIntensity={1.5} />
    </mesh>
  );
}

function PlatonicSolid({
  position,
  speed,
  color,
  emissive,
  geoType,
}: {
  position: [number, number, number];
  speed: number;
  color: string;
  emissive: string;
  geoType: 'tetra' | 'octa' | 'dodeca' | 'icosa';
}) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    ref.current.rotation.y = clock.elapsedTime * speed;
    ref.current.rotation.x = clock.elapsedTime * speed * 0.5;
    ref.current.position.y =
      position[1] + Math.sin(clock.elapsedTime * 0.4 + speed * 2) * 0.7;
  });
  return (
    <mesh ref={ref} position={position}>
      {geoType === 'tetra'  && <tetrahedronGeometry  args={[1.1, 0]} />}
      {geoType === 'octa'   && <octahedronGeometry   args={[0.9, 0]} />}
      {geoType === 'dodeca' && <dodecahedronGeometry args={[0.9, 0]} />}
      {geoType === 'icosa'  && <icosahedronGeometry  args={[0.9, 0]} />}
      <meshStandardMaterial
        color={color}
        emissive={emissive}
        emissiveIntensity={2.5}
        wireframe
      />
    </mesh>
  );
}

export function AxiomScene() {
  return (
    <>
      <color attach="background" args={['#020510']} />
      <ambientLight intensity={0.08} />
      <pointLight position={[0, 8, 0]} intensity={18} color="#3B82F6" />
      <pointLight position={[0, -2, 6]} intensity={8} color="#F1F5F9" />

      {GRID_COORDS.flatMap((x) =>
        GRID_COORDS.map((z) => (
          <GridNode key={`${x}-${z}`} x={x} z={z} phase={(x + z) * 0.4} />
        ))
      )}

      <PlatonicSolid
        position={[-4, 1, -2]} speed={0.40} geoType="tetra"
        color="#3B82F6" emissive="#1D4ED8"
      />
      <PlatonicSolid
        position={[4, 2, 1]} speed={0.30} geoType="octa"
        color="#F1F5F9" emissive="#CBD5E1"
      />
      <PlatonicSolid
        position={[-2, 0.5, 3]} speed={0.20} geoType="dodeca"
        color="#60A5FA" emissive="#2563EB"
      />
      <PlatonicSolid
        position={[3, -1, -3]} speed={0.50} geoType="icosa"
        color="#F8FAFC" emissive="#E2E8F0"
      />

      <Sparkles count={280} scale={22} size={1.3} speed={0.5} color="#3B82F6" />
      <Sparkles count={90}  scale={12} size={2.5} speed={0.8} color="#F1F5F9" />
    </>
  );
}

export default AxiomScene;
