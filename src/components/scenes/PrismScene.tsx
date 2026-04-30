'use client';
// Phase 0 stub — full PRISM multi-viewport reality split scene planned for Era 1 / Phase 1
import { Sparkles } from '@react-three/drei';

export function PrismScene() {
  return (
    <>
      <color attach="background" args={['#000000']} />
      <ambientLight intensity={0.15} />
      <pointLight position={[5, 5, 5]} intensity={1.0} color="#A78BFA" />
      <pointLight position={[-5, -5, 5]} intensity={0.6} color="#22D3EE" />
      <Sparkles count={300} scale={24} size={1.6} speed={0.9} color="#A78BFA" />
      <Sparkles count={120} scale={14} size={2.8} speed={1.3} color="#67E8F9" />
    </>
  );
}
