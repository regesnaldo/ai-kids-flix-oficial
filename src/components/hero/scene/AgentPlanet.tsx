'use client'

/**
 * AgentPlanet — Planeta cognitivo orbital.
 *
 * Cada agente possui:
 *  - Esfera com emissão própria (cor do canon)
 *  - Halo externo com additive blending
 *  - Anel orbital fino
 *  - Rotação própria + órbita ao redor do NEXUS
 *  - Pulsação sutil do halo
 */

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { type HeroAgent, getOrbitPosition } from '../hero-agents'

export default function AgentPlanet({ agent }: { agent: HeroAgent }) {
  const groupRef = useRef<THREE.Group>(null!)
  const planetRef = useRef<THREE.Mesh>(null!)
  const haloRef = useRef<THREE.Mesh>(null!)
  const ringRef = useRef<THREE.Mesh>(null!)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const [x, y, z] = getOrbitPosition(agent, t)

    if (groupRef.current) {
      groupRef.current.position.set(x, y, z)
    }
    if (planetRef.current) {
      planetRef.current.rotation.y = t * 0.5
    }
    if (haloRef.current) {
      const pulse = 1 + Math.sin(t * 1.2 + agent.orbitPhase) * 0.08
      haloRef.current.scale.setScalar(pulse)
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.3
    }
  })

  return (
    <group ref={groupRef}>
      {/* ── Planet sphere ── */}
      <mesh ref={planetRef}>
        <sphereGeometry args={[agent.planetSize, 32, 32]} />
        <meshStandardMaterial
          color={agent.color}
          emissive={agent.color}
          emissiveIntensity={1.5}
        />
      </mesh>

      {/* ── Halo ── */}
      <mesh ref={haloRef}>
        <sphereGeometry args={[agent.planetSize * 1.5, 16, 16]} />
        <meshBasicMaterial
          color={agent.color}
          transparent
          opacity={0.12}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
        />
      </mesh>

      {/* ── Orbital ring ── */}
      <mesh ref={ringRef} rotation={[Math.PI / 2.5, 0, 0]}>
        <torusGeometry args={[agent.planetSize * 1.8, 0.008, 8, 64]} />
        <meshBasicMaterial
          color={agent.colorSecondary}
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  )
}
