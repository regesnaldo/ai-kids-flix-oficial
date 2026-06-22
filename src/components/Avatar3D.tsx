'use client'

import { useRef, useMemo } from 'react'
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
  const innerRef = useRef<THREE.Mesh>(null)
  const midRef = useRef<THREE.Mesh>(null)
  const outerRef = useRef<THREE.Mesh>(null)
  const particlesRef = useRef<THREE.Points>(null)
  const lightRef = useRef<THREE.PointLight>(null)

  // Partículas: 20 pontos distribuídos numa esfera de raio 2.0
  const particleCount = 20
  const positions = useMemo(() => {
    const arr = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount; i++) {
      const r = 2.0 * Math.cbrt(Math.random())
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      arr[i * 3 + 2] = r * Math.cos(phi)
    }
    return arr
  }, [])

  useFrame((state) => {
    const t = state.clock.getElapsedTime()

    // Esfera interna: pulsa 0.97 ↔ 1.03 @ 0.8Hz; opacidade varia com intensity
    if (innerRef.current) {
      const pulseIn = 1 + Math.sin(t * 0.8 * Math.PI * 2) * 0.03
      innerRef.current.scale.set(pulseIn, pulseIn, pulseIn)
      const matIn = innerRef.current.material as THREE.MeshBasicMaterial
      matIn.opacity = intensity * (0.25 + (Math.sin(t * 0.8 * Math.PI * 2) + 1) * 0.1)
    }

    // Esfera média: pulsa 0.95 ↔ 1.05 @ 0.5Hz
    if (midRef.current) {
      const pulseMid = 1 + Math.sin(t * 0.5 * Math.PI * 2) * 0.05
      midRef.current.scale.set(pulseMid, pulseMid, pulseMid)
    }

    // Esfera externa: pulsa 0.95 ↔ 1.05 @ 0.3Hz (mais lenta)
    if (outerRef.current) {
      const pulseOut = 1 + Math.sin(t * 0.3 * Math.PI * 2) * 0.05
      outerRef.current.scale.set(pulseOut, pulseOut, pulseOut)
    }

    // Partículas: rotação lenta
    if (particlesRef.current) {
      particlesRef.current.rotation.y += 0.15 * 0.016
      particlesRef.current.rotation.x += 0.15 * 0.008
    }

    // Point light dinâmico
    if (lightRef.current) {
      lightRef.current.intensity = intensity * 3
    }
  })

  return (
    <group>
      {/* Point light dinâmico no centro */}
      <pointLight ref={lightRef} position={[0, 0, 0]} color={color} intensity={intensity * 3} distance={4} />

      {/* Esfera interna: raio 1.3, opacidade alta, sem wireframe */}
      <mesh ref={innerRef}>
        <sphereGeometry args={[1.3, 32, 32]} />
        <meshBasicMaterial color={color} transparent opacity={intensity * 0.35} depthWrite={false} />
      </mesh>

      {/* Esfera média: raio 1.7, opacidade média */}
      <mesh ref={midRef}>
        <sphereGeometry args={[1.7, 32, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.15} depthWrite={false} />
      </mesh>

      {/* Esfera externa: raio 2.2, opacidade baixa */}
      <mesh ref={outerRef}>
        <sphereGeometry args={[2.2, 32, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.06} depthWrite={false} />
      </mesh>

      {/* Partículas flutuantes */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
            count={particleCount}
          />
        </bufferGeometry>
        <pointsMaterial color={color} size={0.04} sizeAttenuation transparent opacity={0.9} depthWrite={false} />
      </points>
    </group>
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
