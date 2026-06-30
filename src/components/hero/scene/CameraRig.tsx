'use client'

/**
 * CameraRig — Movimento cinematográfico de câmera.
 *
 * Micro-orbit + drift + breathing.
 * A câmera nunca fica totalmente parada.
 * Movimentos extremamente suaves baseados em seno/cosseno.
 */

import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

export default function CameraRig() {
  const { camera } = useThree()
  const targetPos = useRef(new THREE.Vector3(0, 0, 14))
  const targetLook = useRef(new THREE.Vector3(0, 0, 0))

  useFrame(({ clock, pointer }) => {
    const t = clock.getElapsedTime()

    // Micro-orbit + drift + breathing
    const orbitX = Math.sin(t * 0.08) * 1.5
    const orbitY = Math.cos(t * 0.06) * 0.8
    const drift = Math.sin(t * 0.03) * 0.5
    const breath = Math.sin(t * 0.4) * 0.1

    // Parallax sutil baseado no mouse
    const mouseInfluence = 0.8
    const mouseX = pointer.x * mouseInfluence
    const mouseY = pointer.y * mouseInfluence * 0.5

    targetPos.current.set(
      orbitX + drift + mouseX,
      orbitY + breath + mouseY,
      14 + Math.sin(t * 0.05) * 0.5,
    )

    // Lerp suave
    camera.position.lerp(targetPos.current, 0.03)

    // Look at center com leve offset
    targetLook.current.set(
      Math.sin(t * 0.04) * 0.2,
      Math.cos(t * 0.03) * 0.1,
      0,
    )
    camera.lookAt(targetLook.current)
  })

  return null
}
