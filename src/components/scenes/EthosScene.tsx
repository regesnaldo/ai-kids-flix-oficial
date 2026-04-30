'use client';
// Phase 0 stub — full ETHOS infinite floating library scene planned for Era 1 / Phase 1
import { Sparkles } from '@react-three/drei';

export function EthosScene() {
  return (
    <>
      <color attach="background" args={['#000000']} />
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 6, 4]} intensity={0.8} color="#06B6D4" />
      <pointLight position={[6, -4, 6]} intensity={0.5} color="#6366F1" />
      <Sparkles count={250} scale={26} size={1.0} speed={0.3} color="#06B6D4" />
      <Sparkles count={80} scale={16} size={1.8} speed={0.5} color="#818CF8" />
    </>
  );
}
