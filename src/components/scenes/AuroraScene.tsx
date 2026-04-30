'use client';
// Phase 0 stub — full AURORA perpetual horizon skybox scene planned for Era 1 / Phase 1
import { Sparkles } from '@react-three/drei';

export function AuroraScene() {
  return (
    <>
      <color attach="background" args={['#000000']} />
      <ambientLight intensity={0.25} />
      <pointLight position={[0, 10, 0]} intensity={0.9} color="#38BDF8" />
      <pointLight position={[-6, 2, 6]} intensity={0.5} color="#2DD4BF" />
      <Sparkles count={280} scale={28} size={1.4} speed={0.5} color="#38BDF8" />
      <Sparkles count={100} scale={18} size={2.5} speed={0.8} color="#5EEAD4" />
    </>
  );
}
