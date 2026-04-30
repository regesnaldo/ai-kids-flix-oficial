'use client';
// Phase 0 stub — full VOLT electric arena scene planned for Era 1 / Phase 1
import { Sparkles } from '@react-three/drei';

export function VoltScene() {
  return (
    <>
      <color attach="background" args={['#000000']} />
      <ambientLight intensity={0.15} />
      <pointLight position={[5, 5, 5]} intensity={1.2} color="#F59E0B" />
      <pointLight position={[-5, -3, 3]} intensity={0.6} color="#FB923C" />
      <Sparkles count={350} scale={22} size={1.8} speed={1.4} color="#F59E0B" />
      <Sparkles count={120} scale={12} size={3.5} speed={2.0} color="#FDE047" />
    </>
  );
}
