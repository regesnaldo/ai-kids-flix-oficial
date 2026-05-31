'use client'

import { useRef, useMemo, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'

const PARTICLE_COUNT = 500
const SPHERE_RADIUS = 8

const NEXUS_RESPONSES = [
  'Você chegou ao núcleo do metaverso. Sua jornada começa aqui.',
  'Cada decisão sua alimenta o cosmos. O metaverso observa.',
  'Bem-vindo, participante. Estou processando sua presença.',
  'O conhecimento que você busca está distribuído em 12 universos.',
  'Sua consciência foi registrada. O NEXUS reconhece você.',
]

function generateSpherePositions(count: number, radius: number) {
  const pos = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    const r = Math.cbrt(Math.random()) * radius
    pos[i * 3] = r * Math.sin(phi) * Math.cos(theta)
    pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
    pos[i * 3 + 2] = r * Math.cos(phi)
  }
  return pos
}

function ParticleField({ positions }: { positions: Float32Array }) {
  const cyanRef = useRef<THREE.Points>(null!)
  const staticRef = useRef<THREE.Points>(null!)
  const count = PARTICLE_COUNT

  const { cyanColors, cyanPositions, staticPositions, staticColors } = useMemo(() => {
    const cPos = new Float32Array(400 * 3)
    const cCol = new Float32Array(400 * 3)
    const sPos = new Float32Array(100 * 3)
    const sCol = new Float32Array(100 * 3)
    for (let i = 0; i < count; i++) {
      if (i < 400) {
        cPos[i * 3] = positions[i * 3]
        cPos[i * 3 + 1] = positions[i * 3 + 1]
        cPos[i * 3 + 2] = positions[i * 3 + 2]
        cCol[i * 3] = 0; cCol[i * 3 + 1] = 1; cCol[i * 3 + 2] = 1
      } else {
        const j = i - 400
        sPos[j * 3] = positions[i * 3]
        sPos[j * 3 + 1] = positions[i * 3 + 1]
        sPos[j * 3 + 2] = positions[i * 3 + 2]
        if (i < 480) {
          sCol[j * 3] = 0; sCol[j * 3 + 1] = 0.53; sCol[j * 3 + 2] = 1
        } else {
          sCol[j * 3] = 1; sCol[j * 3 + 1] = 1; sCol[j * 3 + 2] = 1
        }
      }
    }
    return { cyanPositions: cPos, cyanColors: cCol, staticPositions: sPos, staticColors: sCol }
  }, [positions, count])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const pulse = 0.8 + 0.4 * Math.sin(t * (Math.PI * 2 / 3))
    if (cyanRef.current) {
      cyanRef.current.scale.setScalar(pulse)
      cyanRef.current.rotation.y += 0.0005
    }
    if (staticRef.current) staticRef.current.rotation.y += 0.0003
  })

  return (
    <group>
      <points ref={cyanRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[cyanPositions, 3]} />
          <bufferAttribute attach="attributes-color" args={[cyanColors, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.05} vertexColors transparent opacity={0.8} sizeAttenuation blending={THREE.AdditiveBlending} depthWrite={false} />
      </points>
      <points ref={staticRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[staticPositions, 3]} />
          <bufferAttribute attach="attributes-color" args={[staticColors, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.03} vertexColors transparent opacity={0.6} sizeAttenuation blending={THREE.AdditiveBlending} depthWrite={false} />
      </points>
    </group>
  )
}

function Nucleus({ onClick }: { onClick: () => void }) {
  const sphereRef = useRef<THREE.Mesh>(null!)
  const ring1Ref = useRef<THREE.Mesh>(null!)
  const ring2Ref = useRef<THREE.Mesh>(null!)

  useFrame(() => {
    if (sphereRef.current) sphereRef.current.rotation.x += 0.005
    if (ring1Ref.current) ring1Ref.current.rotation.x += 0.005
    if (ring2Ref.current) ring2Ref.current.rotation.z += 0.003
  })

  return (
    <group>
      <mesh
        ref={sphereRef}
        onClick={(e) => {
          e.stopPropagation()
          playNucleusClick().catch(console.error)
          onClick()
        }}
        onPointerOver={(e) => {
          document.body.style.cursor = 'pointer'
          e.stopPropagation()
          playNucleusHover().catch(console.error)
        }}
        onPointerOut={() => { document.body.style.cursor = 'default' }}
      >
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial color="#00FFFF" emissive="#00FFFF" emissiveIntensity={2} />
      </mesh>
      <mesh ref={ring1Ref} rotation-x={Math.PI / 2}>
        <torusGeometry args={[0.7, 0.02, 16, 64]} />
        <meshBasicMaterial color="#0088FF" transparent opacity={0.6} />
      </mesh>
      <mesh ref={ring2Ref} rotation-z={Math.PI / 3}>
        <torusGeometry args={[0.9, 0.02, 16, 64]} />
        <meshBasicMaterial color="#0088FF" transparent opacity={0.4} />
      </mesh>
    </group>
  )
}

function Scene({ onNucleusClick = () => {} }: { onNucleusClick?: () => void }) {
  const positions = useMemo(() => generateSpherePositions(PARTICLE_COUNT, SPHERE_RADIUS), [])
  return (
    <>
      <ParticleField positions={positions} />
      <Nucleus onClick={onNucleusClick} />
      <OrbitControls enableZoom minDistance={6} maxDistance={20} autoRotate autoRotateSpeed={0.3} />
    </>
  )
}

// ─── AUDIO ENGINE — NEXUS SOUND DESIGN ───────────────────────
// Direction: Damien Chazelle — sound as narrative, silence as impact

let toneStarted = false

async function createAmbientDrone() {
  const { Synth, Reverb, Volume, start } = await import('tone')
  if (!toneStarted) { await start(); toneStarted = true }
  const vol = new Volume(-20).toDestination()
  const reverb = new Reverb({ decay: 8, wet: 0.8 }).connect(vol)
  const drone1 = new Synth({
    oscillator: { type: 'sine' },
    envelope: { attack: 4, decay: 0, sustain: 1, release: 6 },
  }).connect(reverb)
  const drone2 = new Synth({
    oscillator: { type: 'sine' },
    envelope: { attack: 6, decay: 0, sustain: 1, release: 8 },
  }).connect(reverb)
  drone1.triggerAttack('C1')
  setTimeout(() => drone2.triggerAttack('G1'), 2000)
  return { drone1, drone2, vol }
}

async function playNucleusHover() {
  const { Synth, Reverb, start } = await import('tone')
  if (!toneStarted) { await start(); toneStarted = true }
  const reverb = new Reverb({ decay: 2, wet: 0.5 }).toDestination()
  const synth = new Synth({
    oscillator: { type: 'sine' },
    envelope: { attack: 0.1, decay: 0.3, sustain: 0.2, release: 1 },
    volume: -25,
  }).connect(reverb)
  synth.triggerAttackRelease('G2', '0.3')
}

async function playNucleusClick() {
  const { MetalSynth, Reverb, start } = await import('tone')
  if (!toneStarted) { await start(); toneStarted = true }
  const reverb = new Reverb({ decay: 6, wet: 0.9 }).toDestination()
  const metal = new MetalSynth({
    envelope: { attack: 0.001, decay: 0.4, release: 4 },
    harmonicity: 5.1,
    modulationIndex: 32,
    resonance: 4000,
    octaves: 1.5,
    volume: -18,
  }).connect(reverb)
  metal.triggerAttackRelease('G3', '32n')
}
// ──────────────────────────────────────────────────────────────

function CinematicIntro({ onComplete }: { onComplete: () => void }) {
  const lines = [
    '> INICIALIZANDO NEXUS...',
    '> SINCRONIZANDO 500 NÓS DE DADOS...',
    '> BEM-VINDO AO KERNEL DO METAVERSO.',
  ]
  const [visibleLines, setVisibleLines] = useState<string[]>([])
  const [fading, setFading] = useState(false)

  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      if (i < lines.length) {
        setVisibleLines(prev => [...prev, lines[i]])
        i++
      } else {
        clearInterval(interval)
        setTimeout(() => setFading(true), 800)
        setTimeout(() => onComplete(), 1600)
      }
    }, 1200)
    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{
      position: 'fixed', inset: 0, backgroundColor: '#000000',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 100, opacity: fading ? 0 : 1,
      transition: 'opacity 0.8s ease',
    }}>
      <div style={{ fontFamily: 'monospace', color: '#00FF88', fontSize: '14px', lineHeight: '2' }}>
        {visibleLines.map((line, i) => (
          <div key={i} style={{ animation: 'fadeIn 0.3s ease' }}>{line}</div>
        ))}
      </div>
    </div>
  )
}

function HUDOverlay({ onNucleusClick }: { onNucleusClick: () => void }) {
  const [time, setTime] = useState('')
  const [blink, setBlink] = useState(true)

  useEffect(() => {
    const tick = () => setTime(new Date().toUTCString().slice(0, 25))
    tick()
    const t = setInterval(tick, 1000)
    const b = setInterval(() => setBlink(v => !v), 1000)
    return () => { clearInterval(t); clearInterval(b) }
  }, [])

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 10 }}>
      <div style={{
        position: 'absolute', top: '80px', left: '16px',
        fontFamily: 'monospace', fontSize: '11px', lineHeight: '1.8',
      }}>
        <div style={{ color: '#00FF88' }}>NEXUS // KERNEL ORQUESTRADOR</div>
        <div style={{ color: '#00FFFF' }}>PARTÍCULAS ATIVAS: 500</div>
        <div style={{ color: '#00FF88' }}>STATUS: ONLINE</div>
      </div>
      <div style={{
        position: 'absolute', top: '80px', right: '16px',
        fontFamily: 'monospace', fontSize: '10px', color: '#0088FF', textAlign: 'right',
      }}>
        {time}
      </div>
      <div style={{
        position: 'absolute', bottom: '32px', left: '50%',
        transform: 'translateX(-50%)',
        fontFamily: 'monospace', fontSize: '11px',
        color: '#00FFFF', opacity: blink ? 0.7 : 0.2,
        transition: 'opacity 0.5s ease', pointerEvents: 'auto',
        cursor: 'pointer', letterSpacing: '0.1em',
      }} onClick={onNucleusClick}>
        [ CLIQUE NO NÚCLEO PARA INICIAR CONTATO ]
      </div>
    </div>
  )
}

function ChatPanel({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState([
    { role: 'nexus', text: 'Você chegou ao núcleo do metaverso. Sua jornada começa aqui.' }
  ])
  const [input, setInput] = useState('')
  const responseIndex = useRef(1)

  const send = () => {
    if (!input.trim()) return
    const userMsg = { role: 'user', text: input.trim() }
    const nexusMsg = { role: 'nexus', text: NEXUS_RESPONSES[responseIndex.current % NEXUS_RESPONSES.length] }
    responseIndex.current++
    setMessages(prev => [...prev, userMsg, nexusMsg])
    setInput('')
  }

  return (
    <div style={{
      position: 'absolute', top: 0, right: 0, bottom: 0, width: '380px',
      backgroundColor: 'rgba(0,0,0,0.92)',
      borderLeft: '1px solid rgba(0,255,255,0.15)',
      display: 'flex', flexDirection: 'column', zIndex: 20,
    }}>
      <div style={{
        padding: '16px', borderBottom: '1px solid rgba(0,255,255,0.1)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <span style={{ fontFamily: 'monospace', color: '#00FF88', fontSize: '13px' }}>
          // NEXUS PRIME
        </span>
        <button onClick={onClose} style={{
          background: 'none', border: 'none', color: '#00FFFF',
          cursor: 'pointer', fontSize: '18px', lineHeight: 1,
        }}>×</button>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {messages.map((m, i) => (
          <div key={i} style={{
            fontFamily: 'monospace', fontSize: '12px', lineHeight: '1.6',
            color: m.role === 'nexus' ? '#00FFFF' : '#ffffff',
            alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
            maxWidth: '85%',
            padding: '8px 12px',
            backgroundColor: m.role === 'nexus' ? 'rgba(0,255,255,0.05)' : 'rgba(255,255,255,0.05)',
            borderRadius: '4px',
          }}>
            {m.role === 'nexus' && <span style={{ color: '#00FF88', marginRight: '8px' }}>[NEXUS]</span>}
            {m.text}
          </div>
        ))}
      </div>
      <div style={{ padding: '12px', borderTop: '1px solid rgba(0,255,255,0.1)', display: 'flex', gap: '8px' }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="Transmitir mensagem..."
          style={{
            flex: 1, backgroundColor: 'rgba(0,255,255,0.05)',
            border: '1px solid rgba(0,255,255,0.2)', borderRadius: '4px',
            color: '#ffffff', fontFamily: 'monospace', fontSize: '12px',
            padding: '8px 12px', outline: 'none',
          }}
        />
        <button onClick={send} style={{
          backgroundColor: 'rgba(0,255,255,0.1)',
          border: '1px solid rgba(0,255,255,0.3)',
          color: '#00FFFF', fontFamily: 'monospace', fontSize: '11px',
          padding: '8px 12px', cursor: 'pointer', borderRadius: '4px',
          letterSpacing: '0.05em',
        }}>
          TRANSMITIR
        </button>
      </div>
    </div>
  )
}

export default function NexusCosmos({ onNucleusClick: _externalClick = () => {} }: { onNucleusClick?: () => void }) {
  const [introComplete, setIntroComplete] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const droneRef = useRef<any>(null)

  useEffect(() => {
    if (!introComplete) return
    const startDrone = async () => {
      const drone = await createAmbientDrone()
      droneRef.current = drone
    }
    startDrone().catch(console.error)
    return () => {
      if (droneRef.current) {
        droneRef.current.drone1.triggerRelease()
        droneRef.current.drone2.triggerRelease()
      }
    }
  }, [introComplete])

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh', backgroundColor: '#000000' }}>
      {!introComplete && <CinematicIntro onComplete={() => setIntroComplete(true)} />}
      <Canvas camera={{ position: [0, 0, 12], fov: 60 }} dpr={[1, 2]} gl={{ antialias: true }}>
        <color attach="background" args={['#000000']} />
        <Scene onNucleusClick={() => setChatOpen(true)} />
        <EffectComposer>
          <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={300} intensity={0.8} />
        </EffectComposer>
      </Canvas>
      {introComplete && <HUDOverlay onNucleusClick={() => setChatOpen(true)} />}
      {chatOpen && <ChatPanel onClose={() => setChatOpen(false)} />}
    </div>
  )
}
