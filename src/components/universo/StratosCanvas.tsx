'use client'

import React, { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'

function ChessGrid() {
  const gridRef = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (gridRef.current) {
      gridRef.current.rotation.y = state.clock.elapsedTime * 0.02
    }
  })

  const squares: React.ReactNode[] = []
  for (let x = -5; x <= 5; x++) {
    for (let z = -5; z <= 5; z++) {
      const isWhite = (x + z) % 2 === 0
      squares.push(
        <mesh key={`${x}-${z}`} position={[x * 0.8, 0, z * 0.8]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.75, 0.75]} />
          <meshBasicMaterial color={isWhite ? "#8B5CF6" : "#1a1025"} transparent opacity={0.3} />
        </mesh>
      )
    }
  }
  
  return <group ref={gridRef}>{squares}</group>
}

function FloatingPieces() {
  const piecesRef = useRef<THREE.Group>(null)
  
  const pieces = useMemo(() => {
    const positions: { pos: [number, number, number]; type: string }[] = [
      { pos: [-3, 2, -2], type: 'tower' },
      { pos: [3, 3, 1], type: 'horse' },
      { pos: [0, 4, 0], type: 'king' },
      { pos: [-2, 2.5, 3], type: 'pawn' },
      { pos: [2, 3.5, -1], type: 'queen' },
    ]
    return positions
  }, [])

  useFrame((state) => {
    if (piecesRef.current) {
      piecesRef.current.children.forEach((child, i) => {
        child.position.y = pieces[i].pos[1] + Math.sin(state.clock.elapsedTime + i) * 0.3
        child.rotation.y = state.clock.elapsedTime * 0.3
      })
    }
  })

  return (
    <group ref={piecesRef}>
      {pieces.map((p, i) => (
        <mesh key={i} position={p.pos}>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshBasicMaterial color="#A78BFA" transparent opacity={0.8} />
        </mesh>
      ))}
    </group>
  )
}

function GlowingParticles() {
  const ref = useRef<THREE.Points>(null)
  
  const particles = useMemo(() => {
    const positions = new Float32Array(2000 * 3)
    for (let i = 0; i < 2000; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 15
      positions[i * 3 + 1] = Math.random() * 10
      positions[i * 3 + 2] = (Math.random() - 0.5) * 15
    }
    return positions
  }, [])

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.03
    }
  })

  return (
    <Points ref={ref} positions={particles} stride={3} frustumCulled={false}>
      <PointMaterial transparent color="#8B5CF6" size={0.05} sizeAttenuation={true} depthWrite={false} blending={THREE.AdditiveBlending} />
    </Points>
  )
}

export default function StratosCanvas() {
  return (
    <Canvas camera={{ position: [8, 6, 8], fov: 50 }} style={{ background: 'linear-gradient(180deg, #1a1025 0%, #0a0510 100%)' }}>
      <ChessGrid />
      <FloatingPieces />
      <GlowingParticles />
      <ambientLight intensity={0.2} />
    </Canvas>
  )
}