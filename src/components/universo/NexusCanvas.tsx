'use client'

import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { NexusScene } from './NexusScene'

export default function NexusCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0, 15], fov: 60 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
    >
      <Suspense fallback={null}>
        <NexusScene />
      </Suspense>
    </Canvas>
  )
}
