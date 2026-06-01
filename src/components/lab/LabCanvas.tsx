'use client'

import { useRef, useMemo, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, PointMaterial, Points } from '@react-three/drei'
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing'
import * as THREE from 'three'
import { useLabStore } from '@/store/useLabStore'
import { AGENTS, type AgentId } from '@/canon/agents/canon'

const PARTICLE_COUNT = 500
const SPHERE_RADIUS = 20

function LabScene() {
  const meshRef = useRef<THREE.Mesh>(null!)
  const pointsRef = useRef<THREE.Points>(null!)
  const sceneColor = useLabStore((s) => s.sceneColor)
  const chatIntensity = useLabStore((s) => s.chatIntensity)
  const activeAgent = useLabStore((s) => s.activeAgent)

  const targetColor = useMemo(() => new THREE.Color(sceneColor), [sceneColor])
  const [positions, sizes] = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3)
    const siz = new Float32Array(PARTICLE_COUNT)
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = SPHERE_RADIUS * (0.6 + Math.random() * 0.4)
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      pos[i * 3 + 2] = r * Math.cos(phi)
      siz[i] = 0.5 + Math.random() * 1.5
    }
    return [pos, siz]
  }, [])

  useFrame((state, delta) => {
    const elapsed = state.clock.getElapsedTime()
    const intensity = Math.max(0, 1 - (Date.now() - chatIntensity) / 1000)

    if (meshRef.current) {
      meshRef.current.rotation.x += delta * (0.15 + intensity * 0.3)
      meshRef.current.rotation.y += delta * (0.2 + intensity * 0.4)
      const scale = 1 + Math.sin(elapsed * 2) * 0.02 + intensity * 0.05
      meshRef.current.scale.setScalar(scale)
      const mat = meshRef.current.material as THREE.MeshStandardMaterial
      mat.color.lerp(targetColor, delta * 2)
      mat.emissiveIntensity = 0.3 + intensity * 0.5
    }

    if (pointsRef.current) {
      const geo = pointsRef.current.geometry
      const posAttr = geo.attributes.position
      const array = posAttr.array as Float32Array
      const speed = delta * (0.05 + intensity * 0.2)
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const idx = i * 3
        const x = array[idx]
        const y = array[idx + 1]
        const z = array[idx + 2]
        const theta = Math.atan2(z, x) + speed
        const r = Math.sqrt(x * x + z * z)
        array[idx] = r * Math.cos(theta)
        array[idx + 2] = r * Math.sin(theta)
        array[idx + 1] += Math.sin(elapsed * 0.5 + i) * delta * 0.1
      }
      posAttr.needsUpdate = true
    }
  })

  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={0.5} color={targetColor} />
      <Float speed={0.5} rotationIntensity={0.1} floatIntensity={0.5}>
        <mesh ref={meshRef}>
          <icosahedronGeometry args={[2, 0]} />
          <meshStandardMaterial
            color="#00f5ff"
            emissive="#00f5ff"
            emissiveIntensity={0.3}
            wireframe={false}
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>
      </Float>
      <Points ref={pointsRef} positions={positions} sizes={sizes}>
        <PointMaterial
          size={0.15}
          color={targetColor}
          transparent
          opacity={0.6}
          sizeAttenuation
          depthWrite={false}
        />
      </Points>
      <EffectComposer>
        <Bloom luminanceThreshold={0.3} luminanceSmoothing={0.9} intensity={0.5} />
        <ChromaticAberration offset={[0.002, 0.002]} />
      </EffectComposer>
    </>
  )
}

export default function LabCanvas() {
  const [hasWebGL, setHasWebGL] = useState(true)

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl')
      if (!gl) setHasWebGL(false)
    } catch {
      setHasWebGL(false)
    }
  }, [])

  if (!hasWebGL) return null

  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ background: '#0a0a14' }}
    >
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      >
        <LabScene />
      </Canvas>
    </div>
  )
}
