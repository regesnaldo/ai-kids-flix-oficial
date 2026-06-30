'use client'

/**
 * SceneLighting — Iluminação cinematográfica.
 *
 * 1 ambient light baixa (não preto total)
 * 1 directional light dourada (lateral)
 * 1 point light ciano central (já no NexusCore, mas reforçada aqui)
 * Fog exponencial para profundidade
 */

import { NEXUS_COLOR, NEXUS_GOLD } from '../hero-agents'

export default function SceneLighting() {
  return (
    <>
      <ambientLight intensity={0.08} color="#0a0a1a" />
      <directionalLight
        position={[10, 5, 5]}
        intensity={0.3}
        color={NEXUS_GOLD}
      />
      <pointLight
        position={[-8, -3, -5]}
        intensity={0.5}
        distance={30}
        color={NEXUS_COLOR}
      />
      <fog attach="fog" args={['#000005', 15, 80]} />
    </>
  )
}
