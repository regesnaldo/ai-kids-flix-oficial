'use client';
// Phase 0 stub — full JANUS situational humor scene planned for Era 1 / Phase 1
import { Sparkles } from '@react-three/drei';

export function JanusScene() {
  return (
    <>
      <color attach="background" args={['#000000']} />
      <ambientLight intensity={0.2} />
      <pointLight position={[3, 5, 3]} intensity={1.0} color="#FDE047" />
      <pointLight position={[-5, -3, 5]} intensity={0.6} color="#F472B6" />
      <Sparkles count={260} scale={22} size={1.8} speed={1.2} color="#FDE047" />
      <Sparkles count={100} scale={13} size={3.2} speed={1.8} color="#F9A8D4" />
    </>
  );
}
