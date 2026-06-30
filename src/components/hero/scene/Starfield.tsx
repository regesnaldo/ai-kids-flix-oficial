'use client'

/**
 * Starfield — Campo de estrelas com 3 camadas de parallax + nebulosas.
 *
 * Layer 1: 2000 estrelas distantes (r=80-120), rotação lenta
 * Layer 2:  800 estrelas médias  (r=40-70),  rotação média
 * Layer 3:  200 estrelas próximas (r=20-35), rotação rápida
 *
 * Nebulosas: esferas grandes com additive blending, cores profundas.
 */

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface StarLayerData {
  pos: Float32Array
  col: Float32Array
}

function generateStars(count: number, minR: number, maxR: number): StarLayerData {
  const pos = new Float32Array(count * 3)
  const col = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    const r = minR + Math.random() * (maxR - minR)
    pos[i * 3] = r * Math.sin(phi) * Math.cos(theta)
    pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
    pos[i * 3 + 2] = r * Math.cos(phi)

    const c = Math.random()
    if (c < 0.7) {
      col[i * 3] = 1; col[i * 3 + 1] = 1; col[i * 3 + 2] = 1
    } else if (c < 0.88) {
      col[i * 3] = 0; col[i * 3 + 1] = 0.94; col[i * 3 + 2] = 1
    } else {
      col[i * 3] = 1; col[i * 3 + 1] = 0.84; col[i * 3 + 2] = 0
    }
  }
  return { pos, col }
}

export default function Starfield() {
  const farRef = useRef<THREE.Points>(null!)
  const midRef = useRef<THREE.Points>(null!)
  const nearRef = useRef<THREE.Points>(null!)

  const { far, mid, near } = useMemo(
    () => ({
      far: generateStars(2000, 80, 120),
      mid: generateStars(800, 40, 70),
      near: generateStars(200, 20, 35),
    }),
    [],
  )

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (farRef.current) farRef.current.rotation.y = t * 0.005
    if (midRef.current) midRef.current.rotation.y = t * 0.01
    if (nearRef.current) nearRef.current.rotation.y = t * 0.02
  })

  return (
    <group>
      {/* ── Layer 1: distant stars ── */}
      <points ref={farRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[far.pos, 3]} />
          <bufferAttribute attach="attributes-color" args={[far.col, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.3}
          vertexColors
          transparent
          opacity={0.6}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          fog={false}
        />
      </points>

      {/* ── Layer 2: mid stars ── */}
      <points ref={midRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[mid.pos, 3]} />
          <bufferAttribute attach="attributes-color" args={[mid.col, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.2}
          vertexColors
          transparent
          opacity={0.7}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          fog={false}
        />
      </points>

      {/* ── Layer 3: near stars (parallax) ── */}
      <points ref={nearRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[near.pos, 3]} />
          <bufferAttribute attach="attributes-color" args={[near.col, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.15}
          vertexColors
          transparent
          opacity={0.9}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          fog={false}
        />
      </points>

      {/* ── Nebulosas — esferas grandes com additive blending ── */}
      <mesh position={[-30, 10, -50]}>
        <sphereGeometry args={[15, 16, 16]} />
        <meshBasicMaterial
          color="#0a0a3a"
          transparent
          opacity={0.12}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
          fog={false}
        />
      </mesh>
      <mesh position={[40, -15, -60]}>
        <sphereGeometry args={[20, 16, 16]} />
        <meshBasicMaterial
          color="#1a0a3a"
          transparent
          opacity={0.08}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
          fog={false}
        />
      </mesh>
      <mesh position={[10, 25, -70]}>
        <sphereGeometry args={[18, 16, 16]} />
        <meshBasicMaterial
          color="#0a2a3a"
          transparent
          opacity={0.06}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
          fog={false}
        />
      </mesh>
    </group>
  )
}
