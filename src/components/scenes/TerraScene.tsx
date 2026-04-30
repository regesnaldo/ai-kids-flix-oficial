'use client';
// Phase 0 stub — full TERRA bioluminescent forest scene planned for Era 1 / Phase 1
import { Sparkles } from '@react-three/drei';

export function TerraScene() {
  return (
    <>
      <color attach="background" args={['#000000']} />
      <ambientLight intensity={0.2} />
      <pointLight position={[2, 6, 4]} intensity={0.9} color="#84CC16" />
      <pointLight position={[-4, -2, 6]} intensity={0.5} color="#22C55E" />
      <Sparkles count={300} scale={24} size={1.6} speed={0.6} color="#84CC16" />
      <Sparkles count={100} scale={14} size={2.8} speed={0.9} color="#4ADE80" />
    </>
  );
}
