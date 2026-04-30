'use client';
// Phase 0 stub — full LYRA synesthesia color flow scene planned for Era 1 / Phase 1
import { Sparkles } from '@react-three/drei';

export function LyraScene() {
  return (
    <>
      <color attach="background" args={['#000000']} />
      <ambientLight intensity={0.2} />
      <pointLight position={[3, 5, 3]} intensity={1.0} color="#EC4899" />
      <pointLight position={[-5, -3, 5]} intensity={0.6} color="#A855F7" />
      <Sparkles count={320} scale={22} size={2.2} speed={1.0} color="#EC4899" />
      <Sparkles count={130} scale={14} size={3.0} speed={1.5} color="#C084FC" />
    </>
  );
}
