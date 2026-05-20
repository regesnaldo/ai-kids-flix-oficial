'use client'

import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import Avatar3D from '@/components/Avatar3D'

export default function AvatarPage() {
  return (
    <div style={{ backgroundColor: '#0a0a1a', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ width: 400, height: 400 }}>
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }} gl={{ antialias: true, alpha: true }} dpr={[1, 2]}>
          <Suspense fallback={null}>
            <Avatar3D shape="humanoid" color="#3B82F6" auraColor="#60A5FA" auraIntensity={0.5} />
          </Suspense>
        </Canvas>
      </div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '1rem' }}>NEXUS</h1>
      <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Arquetipo: Conector · Facção: Balance</p>
    </div>
  )
}
