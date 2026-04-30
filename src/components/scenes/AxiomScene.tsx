'use client';
// Phase 0 stub — full AXIOM holographic data lab scene planned for Era 1 / Phase 1
import { Sparkles } from '@react-three/drei';

export function AxiomScene() {
  return (
    <>
      <color attach="background" args={['#000000']} />
      <ambientLight intensity={0.15} />
      <pointLight position={[4, 6, 4]} intensity={1.0} color="#22D3EE" />
      <pointLight position={[-4, -4, 4]} intensity={0.6} color="#3B82F6" />
      <Sparkles count={280} scale={22} size={1.3} speed={0.5} color="#22D3EE" />
      <Sparkles count={90} scale={12} size={2.2} speed={0.7} color="#60A5FA" />
    </>
  );
}
