'use client'

/**
 * EnergyLink — Feixe energético vivo entre NEXUS e cada agente.
 *
 * 6 partículas pequenas fluem do centro (NEXUS) até o planeta
 * em trajetória arqueada. Cada partícula fade-in/fade-out
 * ao longo do percurso. Com Bloom, parecem pulsos de energia.
 */

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { type HeroAgent, getOrbitPosition } from '../hero-agents'

const PARTICLE_COUNT = 6

export default function EnergyLink({ agent }: { agent: HeroAgent }) {
  const groupRef = useRef<THREE.Group>(null!)
  const particles = useMemo(
    () => Array.from({ length: PARTICLE_COUNT }, (_, i) => i),
    [],
  )

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const [px, py, pz] = getOrbitPosition(agent, t)

    if (groupRef.current) {
      groupRef.current.children.forEach((child, i) => {
        const progress = ((t * 0.3 + i / PARTICLE_COUNT) % 1)
        child.position.set(
          px * progress,
          py * progress + Math.sin(progress * Math.PI) * 0.5,
          pz * progress,
        )
        const scale = Math.sin(progress * Math.PI)
        child.scale.setScalar(scale)
      })
    }
  })

  return (
    <group ref={groupRef}>
      {particles.map((i) => (
        <mesh key={i}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshBasicMaterial
            color={agent.color}
            transparent
            opacity={0.8}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  )
}
