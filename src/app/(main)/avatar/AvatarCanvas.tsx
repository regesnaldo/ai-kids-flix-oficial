'use client'

import { Suspense, useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import Avatar3D from '@/components/Avatar3D'

// Valores padrão — também são o fallback de carregamento e de erro.
const DEFAULT_COLOR = '#3B82F6'
const DEFAULT_AURA_COLOR = '#00f0ff' // ciano = usuário novo / sem perfil
const DEFAULT_AURA_INTENSITY = 0.3

interface AuraResponse {
  color?: string
  colorHex?: string
  intensity?: number
  pattern?: string
  score?: number
  phase?: string
  nextMilestone?: number
}

interface AvatarCanvasProps {
  /** ID do usuário cuja aura deve ser carregada. Se ausente, usa a aura padrão (ciano). */
  userId?: number
}

export default function AvatarCanvas({ userId }: AvatarCanvasProps) {
  const [auraColor, setAuraColor] = useState<string>(DEFAULT_AURA_COLOR)
  const [auraIntensity, setAuraIntensity] = useState<number>(DEFAULT_AURA_INTENSITY)

  useEffect(() => {
    // Sem userId (ex.: usuário novo / página de preview) → mantém aura padrão.
    if (userId == null) return

    let active = true

    fetch(`/api/aura/${userId}`)
      .then((res) => {
        if (!res.ok) throw new Error(`status ${res.status}`)
        return res.json() as Promise<AuraResponse>
      })
      .then((data) => {
        if (!active) return
        if (typeof data.colorHex === 'string' && data.colorHex) setAuraColor(data.colorHex)
        if (typeof data.intensity === 'number' && !Number.isNaN(data.intensity)) setAuraIntensity(data.intensity)
      })
      .catch(() => {
        // Em caso de erro: mantém valores padrão silenciosamente.
      })

    return () => {
      active = false
    }
  }, [userId])

  return (
    <div style={{ width: 400, height: 400 }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }} gl={{ antialias: true, alpha: true }} dpr={[1, 2]}>
        <Suspense fallback={null}>
          <Avatar3D
            shape="humanoid"
            color={DEFAULT_COLOR}
            auraColor={auraColor}
            auraIntensity={auraIntensity}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}
