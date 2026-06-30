'use client'

/**
 * NexusCore — Núcleo cognitivo central.
 *
 * Esfera interior ciano com emissão intensa.
 * Corona externa com additive blending.
 * 3 anéis orbitais (ouro + ciano) em ângulos diferentes.
 * Pulsação lenta + rotação contínua.
 * Point light central para iluminar planetas próximos.
 */

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { NEXUS_COLOR, NEXUS_GOLD } from '../hero-agents'

export default function NexusCore() {
  const coreRef = useRef<THREE.Mesh>(null!)
  const coronaRef = useRef<THREE.Mesh>(null!)
  const ring1Ref = useRef<THREE.Mesh>(null!)
  const ring2Ref = useRef<THREE.Mesh>(null!)
  const ring3Ref = useRef<THREE.Mesh>(null!)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const pulse = 1 + Math.sin(t * 1.5) * 0.05

    if (coreRef.current) {
      coreRef.current.scale.setScalar(pulse)
      coreRef.current.rotation.y = t * 0.2
    }
    if (coronaRef.current) {
      coronaRef.current.scale.setScalar(1 + Math.sin(t * 0.8) * 0.1)
      coronaRef.current.rotation.y = -t * 0.1
    }
    if (ring1Ref.current) ring1Ref.current.rotation.z = t * 0.3
    if (ring2Ref.current) ring2Ref.current.rotation.x = t * 0.2
    if (ring3Ref.current) ring3Ref.current.rotation.y = t * 0.15
  })

  return (
    <group>
      {/* ── Inner core — ciano brilhante ── */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshStandardMaterial
          color={NEXUS_COLOR}
          emissive={NEXUS_COLOR}
          emissiveIntensity={3}
        />
      </mesh>

      {/* ── Corona — glow externo ciano ── */}
      <mesh ref={coronaRef}>
        <sphereGeometry args={[1.0, 32, 32]} />
        <meshBasicMaterial
          color={NEXUS_COLOR}
          transparent
          opacity={0.08}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
        />
      </mesh>

      {/* ── Anel 1 — ouro, horizontal ── */}
      <mesh ref={ring1Ref} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.3, 0.02, 16, 100]} />
        <meshBasicMaterial
          color={NEXUS_GOLD}
          transparent
          opacity={0.6}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* ── Anel 2 — ouro, inclinado ── */}
      <mesh ref={ring2Ref} rotation={[0, 0, Math.PI / 3]}>
        <torusGeometry args={[1.6, 0.015, 16, 100]} />
        <meshBasicMaterial
          color={NEXUS_GOLD}
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* ── Anel 3 — ciano, diagonal ── */}
      <mesh ref={ring3Ref} rotation={[Math.PI / 4, Math.PI / 4, 0]}>
        <torusGeometry args={[1.9, 0.01, 16, 100]} />
        <meshBasicMaterial
          color={NEXUS_COLOR}
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* ── Point light central ── */}
      <pointLight position={[0, 0, 0]} intensity={3} distance={25} color={NEXUS_COLOR} />
    </group>
  )
}
