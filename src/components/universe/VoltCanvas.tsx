'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'

function ElectricParticles() {
  const ref = useRef<THREE.Points>(null)
  
  const particles = useMemo(() => {
    const positions = new Float32Array(3000 * 3)
    for (let i = 0; i < 3000; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20
    }
    return positions
  }, [])

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.elapsedTime * 0.05
      ref.current.rotation.y = state.clock.elapsedTime * 0.08
    }
  })

  return (
    <Points ref={ref} positions={particles} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#FFD700"
        size={0.08}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  )
}

function LightningBolts() {
  const groupRef = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.children.forEach((child, i) => {
        child.position.x = Math.sin(state.clock.elapsedTime * 2 + i) * 3
        child.position.y = Math.cos(state.clock.elapsedTime * 3 + i) * 2
      })
    }
  })

  return (
    <group ref={groupRef}>
      {[...Array(5)].map((_, i) => (
        <mesh key={i} position={[i * 2 - 4, 0, -5]}>
          <cylinderGeometry args={[0.02, 0.05, 3, 8]} />
          <meshBasicMaterial color="#FF4500" transparent opacity={0.6} />
        </mesh>
      ))}
    </group>
  )
}

function GlowSphere() {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (meshRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1
      meshRef.current.scale.set(scale, scale, scale)
    }
  })

  return (
    <mesh ref={meshRef} position={[0, 0, -8]}>
      <sphereGeometry args={[2, 32, 32]} />
      <meshBasicMaterial color="#FFD700" transparent opacity={0.15} />
    </mesh>
  )
}

export default function VoltCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0, 10], fov: 60 }}
      style={{ background: 'linear-gradient(180deg, #1a0a00 0%, #0a0500 100%)' }}
    >
      <ElectricParticles />
      <LightningBolts />
      <GlowSphere />
      <ambientLight intensity={0.1} />
    </Canvas>
  )
}