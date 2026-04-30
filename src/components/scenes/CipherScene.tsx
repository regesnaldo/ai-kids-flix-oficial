'use client';
// Phase 0 stub — full CIPHER procedural code maze scene planned for Era 1 / Phase 1
import { Sparkles } from '@react-three/drei';

export function CipherScene() {
  return (
    <>
      <color attach="background" args={['#000000']} />
      <ambientLight intensity={0.1} />
      <pointLight position={[4, 4, 4]} intensity={1.1} color="#818CF8" />
      <pointLight position={[-4, -4, 4]} intensity={0.6} color="#7C3AED" />
      <Sparkles count={320} scale={20} size={1.5} speed={0.7} color="#818CF8" />
      <Sparkles count={110} scale={12} size={2.5} speed={1.0} color="#A78BFA" />
    </>
  );
}
