'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'

const PARTICLE_COUNT = 500
const SPHERE_RADIUS = 8

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
  }, [positions])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const pulse = 0.8 + 0.4 * Math.sin(t * (Math.PI * 2 / 3))
    if (cyanRef.current) {
      cyanRef.current.scale.setScalar(pulse)
      cyanRef.current.rotation.y += 0.0005
    }
    if (staticRef.current) {
      staticRef.current.rotation.y += 0.0003
    }
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
        onClick={(e) => { e.stopPropagation(); onClick() }}
        onPointerOver={(e) => { document.body.style.cursor = 'pointer'; e.stopPropagation() }}
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

function Scene({ onNucleusClick }: { onNucleusClick: () => void }) {
  const positions = useMemo(() => generateSpherePositions(PARTICLE_COUNT, SPHERE_RADIUS), [])

  return (
    <>
      <ParticleField positions={positions} />
      <Nucleus onClick={onNucleusClick} />
      <OrbitControls enableZoom minDistance={6} maxDistance={20} autoRotate autoRotateSpeed={0.3} />
    </>
  )
}

export default function NexusCosmos({ onNucleusClick }: { onNucleusClick: () => void }) {
  return (
    <Canvas camera={{ position: [0, 0, 12], fov: 60 }} dpr={[1, 2]} gl={{ antialias: true }}>
      <color attach="background" args={['#000000']} />
      <Scene onNucleusClick={onNucleusClick} />
      <EffectComposer>
        <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={300} intensity={0.8} />
      </EffectComposer>
    </Canvas>
  )
}
