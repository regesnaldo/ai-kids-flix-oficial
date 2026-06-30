'use client'

/**
 * CognitiveHero — Orquestrador do Hero cinematográfico AAA.
 *
 * Estrutura:
 *  - <Suspense> fallback com loading cinematográfico
 *  - <Canvas> com 3 layers de estrelas, nebulosas, NEXUS core,
 *    planetas orbitais, energy links, camera rig, lighting
 *  - <EffectComposer> com Bloom para glow volumétrico
 *  - Overlays: Navbar + HUD + Overlay textual
 *
 * Performance:
 *  - dpr={[1, 2]} — pixel ratio clampado
 *  - frameloop="always" — animação contínua
 *  - Suspende o Canvas até montar (lazy)
 */

import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { motion } from 'framer-motion'
import Starfield from './scene/Starfield'
import NexusCore from './scene/NexusCore'
import AgentPlanet from './scene/AgentPlanet'
import EnergyLink from './scene/EnergyLink'
import CameraRig from './scene/CameraRig'
import SceneLighting from './scene/SceneLighting'
import HeroNavbar from './overlay/HeroNavbar'
import HeroHUD from './overlay/HeroHUD'
import HeroOverlay from './overlay/HeroOverlay'
import { HERO_AGENTS } from './hero-agents'

function LoadingScreen() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black z-50">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center gap-4"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full"
        />
        <span
          className="text-xs tracking-[0.3em] uppercase text-cyan-300/60"
          style={{ fontFamily: 'var(--font-space-grotesk)' }}
        >
          Inicializando Runtime Cognitivo
        </span>
      </motion.div>
    </div>
  )
}

export default function CognitiveHero() {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      <HeroNavbar />

      {/* ── 3D Canvas ── */}
      <Suspense fallback={<LoadingScreen />}>
        <Canvas
          camera={{ position: [0, 0, 14], fov: 60, near: 0.1, far: 200 }}
          dpr={[1, 2]}
          gl={{
            antialias: true,
            alpha: false,
            powerPreference: 'high-performance',
          }}
        >
          <color attach="background" args={['#000005']} />
          <SceneLighting />
          <Starfield />
          <NexusCore />
          {HERO_AGENTS.map((agent) => (
            <group key={agent.id}>
              <AgentPlanet agent={agent} />
              <EnergyLink agent={agent} />
            </group>
          ))}
          <CameraRig />
          <EffectComposer>
            <Bloom
              luminanceThreshold={0.15}
              luminanceSmoothing={0.9}
              height={300}
              intensity={1.2}
              radius={0.8}
            />
          </EffectComposer>
        </Canvas>
      </Suspense>

      {/* ── Overlays ── */}
      <HeroOverlay />
      <HeroHUD />
    </div>
  )
}
