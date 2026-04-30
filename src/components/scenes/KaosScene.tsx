'use client';
// Phase 0 stub — full KAOS collapsing space scene planned for Era 1 / Phase 1
import { Sparkles } from '@react-three/drei';

export function KaosScene() {
  return (
    <>
      <color attach="background" args={['#000000']} />
      <ambientLight intensity={0.1} />
      <pointLight position={[4, 4, 4]} intensity={1.3} color="#F43F5E" />
      <pointLight position={[-4, -4, 4]} intensity={0.7} color="#C026D3" />
      <Sparkles count={400} scale={20} size={2.0} speed={2.5} color="#F43F5E" />
      <Sparkles count={150} scale={10} size={4.0} speed={3.5} color="#E879F9" />
    </>
  );
}
