'use client';
// Phase 0 stub — full STRATOS infinite chess tower scene planned for Era 1 / Phase 1
import { Sparkles } from '@react-three/drei';

export function StratosScene() {
  return (
    <>
      <color attach="background" args={['#000000']} />
      <ambientLight intensity={0.15} />
      <pointLight position={[0, 8, 5]} intensity={1.0} color="#10B981" />
      <pointLight position={[5, -5, 5]} intensity={0.5} color="#38BDF8" />
      <Sparkles count={300} scale={24} size={1.2} speed={0.4} color="#10B981" />
      <Sparkles count={100} scale={14} size={2.0} speed={0.6} color="#38BDF8" />
    </>
  );
}
