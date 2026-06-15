'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'

interface Avatar3DProps {
  shape?: 'humanoid' | 'geometric' | 'animal'
  color?: string
  auraColor?: string
  auraIntensity?: number
}

function HumanoidBody({ color }: { color: string }) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((_, delta) => {
    if (!groupRef.current) return
    groupRef.current.rotation.y += delta * 0.3
  })

  return (
    <group ref={groupRef}>
      <mesh position={[0, 1.2, 0]}>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.3} />
      </mesh>
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[0.8, 0.8, 0.5]} />
        <meshStandardMaterial color={color} roughness={0.5} metalness={0.2} />
      </mesh>
      <mesh position={[-0.5, 0.1, 0]} rotation={[0, 0, -0.2]}>
        <cylinderGeometry args={[0.15, 0.15, 0.6, 8]} />
        <meshStandardMaterial color={color} roughness={0.6} metalness={0.1} />
      </mesh>
      <mesh position={[0.5, 0.1, 0]} rotation={[0, 0, 0.2]}>
        <cylinderGeometry args={[0.15, 0.15, 0.6, 8]} />
        <meshStandardMaterial color={color} roughness={0.6} metalness={0.1} />
      </mesh>
      <mesh position={[-0.25, -0.5, 0]} rotation={[0.1, 0, 0]}>
        <cylinderGeometry args={[0.18, 0.2, 0.7, 8]} />
        <meshStandardMaterial color={color} roughness={0.6} metalness={0.1} />
      </mesh>
      <mesh position={[0.25, -0.5, 0]} rotation={[-0.1, 0, 0]}>
        <cylinderGeometry args={[0.18, 0.2, 0.7, 8]} />
        <meshStandardMaterial color={color} roughness={0.6} metalness={0.1} />
      </mesh>
    </group>
  )
}

function GeometricBody({ color }: { color: string }) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((_, delta) => {
    if (!groupRef.current) return
    groupRef.current.rotation.y += delta * 0.5
    groupRef.current.rotation.x = Math.sin(Date.now() * 0.001) * 0.1
  })

  return (
    <group ref={groupRef}>
      <mesh position={[0, 1, 0]}>
        <octahedronGeometry args={[0.5, 0]} />
        <meshStandardMaterial color={color} roughness={0.2} metalness={0.8} emissive={color} emissiveIntensity={0.2} />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <icosahedronGeometry args={[0.6, 0]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.6} wireframe />
      </mesh>
      <mesh position={[0, -0.8, 0]}>
        <boxGeometry args={[0.4, 0.4, 0.4]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.7} emissive={color} emissiveIntensity={0.1} />
      </mesh>
    </group>
  )
}

function AnimalBody({ color }: { color: string }) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((_, delta) => {
    if (!groupRef.current) return
    groupRef.current.rotation.y += delta * 0.25
  })

  return (
    <group ref={groupRef}>
      <mesh position={[0, 0.5, 0]}>
        <sphereGeometry args={[0.45, 16, 16]} />
        <meshStandardMaterial color={color} roughness={0.7} metalness={0.1} />
      </mesh>
      <mesh position={[0, -0.2, 0]}>
        <sphereGeometry args={[0.55, 16, 16]} />
        <meshStandardMaterial color={color} roughness={0.7} metalness={0.1} />
      </mesh>
      <mesh position={[0.35, 0.7, 0.3]} rotation={[0, 0, -0.3]}>
        <coneGeometry args={[0.08, 0.25, 6]} />
        <meshStandardMaterial color={color} roughness={0.6} metalness={0.1} />
      </mesh>
      <mesh position={[-0.35, 0.7, 0.3]} rotation={[0, 0, 0.3]}>
        <coneGeometry args={[0.08, 0.25, 6]} />
        <meshStandardMaterial color={color} roughness={0.6} metalness={0.1} />
      </mesh>
      <mesh position={[0.25, -0.7, 0]} rotation={[0.2, 0, 0]}>
        <cylinderGeometry args={[0.06, 0.08, 0.4, 6]} />
        <meshStandardMaterial color={color} roughness={0.7} metalness={0.1} />
      </mesh>
      <mesh position={[-0.25, -0.7, 0]} rotation={[-0.2, 0, 0]}>
        <cylinderGeometry args={[0.06, 0.08, 0.4, 6]} />
        <meshStandardMaterial color={color} roughness={0.7} metalness={0.1} />
      </mesh>
    </group>
  )
}

function Aura({ color, intensity }: { color: string; intensity: number }) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.getElapsedTime()
    const pulse = 1 + Math.sin(t * 0.8) * 0.08
    meshRef.current.scale.set(pulse, pulse, pulse)
    const mat = meshRef.current.material as THREE.MeshBasicMaterial
    mat.opacity = intensity * (0.15 + Math.sin(t * 0.6) * 0.05)
  })

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1.5, 32, 32]} />
      <meshBasicMaterial color={color} transparent opacity={0.2} depthWrite={false} />
    </mesh>
  )
}

const shapeComponents = {
  humanoid: HumanoidBody,
  geometric: GeometricBody,
  animal: AnimalBody,
}

export default function Avatar3D({ shape = 'humanoid', color = '#3B82F6', auraColor = '#60A5FA', auraIntensity = 0.5 }: Avatar3DProps) {
  const BodyComponent = shapeComponents[shape]

  return (
    <Float speed={1} rotationIntensity={0.1} floatIntensity={0.5}>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <directionalLight position={[-3, 2, -3]} intensity={0.3} />
      <pointLight position={[0, 3, 2]} intensity={0.5} color={auraColor} />
      <Aura color={auraColor} intensity={auraIntensity} />
      <BodyComponent color={color} />
    </Float>
  )
}
