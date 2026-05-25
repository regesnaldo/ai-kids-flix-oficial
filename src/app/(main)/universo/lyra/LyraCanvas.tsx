'use client'

import { Canvas } from '@react-three/fiber'
import { LyraScene } from '@/components/scenes/LyraScene'

/**
 * Separate file for Canvas + Scene.
 * The parent page lazy-loads this whole file via dynamic() with ssr:false,
 * so the loading <div> never enters the Canvas.
 */
export default function LyraCanvas() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        gl={{ antialias: true, alpha: false }}
        camera={{ fov: 45, near: 0.1, far: 100, position: [0, 2, 15] }}
        dpr={[1, 2]}
        style={{ width: '100%', height: '100%' }}
      >
        <LyraScene />
      </Canvas>
    </div>
  )
}
