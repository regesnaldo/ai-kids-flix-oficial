'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { Particles } from './Particles';

const SPACE_BLACK = new THREE.Color('#050505');

export function NexusScene() {
  console.log('🔦 NEXUS: componente renderizado');

  return (
    <div className="w-full h-screen border-4 border-red-500 relative z-50">
      <Canvas
        camera={{ position: [0, 0, 35], fov: 50 }}
        gl={{ antialias: true, alpha: false }}
        onCreated={() => console.log('🎨 CANVAS: montado com sucesso')}
      >
        <color attach="background" args={[SPACE_BLACK]} />
        <fog attach="fog" args={[SPACE_BLACK, 25, 55]} />

        <ambientLight intensity={0.1} />
        <pointLight position={[10, 10, 10]} intensity={0.5} color="#00FFFF" />
        <pointLight position={[-10, -10, -10]} intensity={0.3} color="#60A5FA" />

        <Particles size={0.15} />

        <OrbitControls
          enablePan={false}
          enableZoom={true}
          enableRotate={true}
          autoRotate={true}
          autoRotateSpeed={0.5}
          minDistance={5}
          maxDistance={50}
        />

        <Sparkles
          count={200}
          scale={50}
          size={0.5}
          speed={0.1}
          color="#94A3B8"
          opacity={0.3}
        />
      </Canvas>
    </div>
  );
}
