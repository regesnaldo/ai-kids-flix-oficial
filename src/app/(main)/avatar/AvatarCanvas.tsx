'use client'

import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import Avatar3D from '@/components/Avatar3D'

export default function AvatarCanvas() {
  return (
    <div style={{ width: 400, height: 400 }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }} gl={{ antialias: true, alpha: true }} dpr={[1, 2]}>
        <Suspense fallback={null}>
          <Avatar3D shape="humanoid" color="#3B82F6" auraColor="#60A5FA" auraIntensity={0.5} />
        </Suspense>
      </Canvas>
    </div>
  )
}
