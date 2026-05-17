'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

function Particles() {
  const ref = useRef<THREE.Points>(null!)
  const geometry = useRef<THREE.BufferGeometry | null>(null)

  if (!geometry.current) {
    const positions = new Float32Array(500 * 3)
    for (let i = 0; i < 500; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = Math.random() * 20
      positions[i * 3] = Math.sin(phi) * Math.cos(theta) * r
      positions[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * r
      positions[i * 3 + 2] = Math.cos(phi) * r
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.current = geo
  }

  useFrame(() => {
    if (ref.current) ref.current.rotation.y += 0.0005
  })

  return (
    <points ref={ref} geometry={geometry.current}>
      <pointsMaterial color="#ffffff" size={0.05} opacity={0.6} transparent sizeAttenuation />
    </points>
  )
}

function WorldScene() {
  const meshRef = useRef<THREE.Mesh>(null!)
  const { scene } = useThree()

  useEffect(() => {
    scene.background = new THREE.Color('#000005')
    scene.fog = new THREE.Fog('#000005', 10, 50)
  }, [scene])

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.003
      meshRef.current.rotation.x += 0.001
      const s = 1 + Math.sin(clock.getElapsedTime() * 2) * 0.025
      meshRef.current.scale.setScalar(s)
    }
  })

  return (
    <>
      <ambientLight intensity={0.1} />
      <pointLight color="#00f5ff" intensity={2} position={[0, 5, 0]} />

      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.5, 1]} />
        <meshBasicMaterial color="#00f5ff" wireframe opacity={0.6} transparent />
      </mesh>

      <Particles />
    </>
  )
}

function ArrivalFlash() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const id = setTimeout(() => {
      if (el) el.style.opacity = '0'
    }, 50)
    return () => clearTimeout(id)
  }, [])

  return (
    <div
      ref={ref}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: '#ffffff',
        opacity: 1,
        transition: 'opacity 300ms ease',
        pointerEvents: 'none',
      }}
    />
  )
}

export default function LabPage() {
  const router = useRouter()

  return (
    <main style={{ width: '100vw', height: '100vh', position: 'relative', background: '#000000', overflow: 'hidden' }}>
      <ArrivalFlash />

      <Canvas style={{ width: '100%', height: '100%', display: 'block' }}>
        <WorldScene />
        <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
      </Canvas>

      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      >
        <div style={{ position: 'absolute', top: '24px', left: '24px' }}>
          <p style={{ fontFamily: 'monospace', fontSize: '11px', color: '#00f5ff', opacity: 0.7, margin: 0 }}>
            NEXUS PRIME // MUNDO: LABORATÓRIO
          </p>
          <p style={{ fontFamily: 'monospace', fontSize: '11px', color: '#00f5ff', opacity: 0.7, margin: '4px 0 0' }}>
            AGENTE: NEXUS // STATUS: ONLINE
          </p>
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: '48px',
            left: '50%',
            transform: 'translateX(-50%)',
            fontFamily: 'monospace',
            fontSize: '13px',
            color: '#ffffff',
            opacity: 0.5,
            animation: 'labPulse 2s ease-in-out infinite',
          }}
        >
          SELECIONE UM EXPERIMENTO
        </div>

        <button
          onClick={() => router.back()}
          style={{
            position: 'absolute',
            top: '24px',
            right: '24px',
            fontFamily: 'monospace',
            fontSize: '11px',
            color: '#00f5ff',
            opacity: 0.7,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            transition: 'opacity 200ms ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = '1' }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.7' }}
        >
          ← VOLTAR AO NEXUS
        </button>
      </div>

      <style jsx>{`
        @keyframes labPulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
      `}</style>
    </main>
  )
}
