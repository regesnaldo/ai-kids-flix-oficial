"use client";
import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Line } from "@react-three/drei";
import * as THREE from "three";

function Neuron({ position, color, delay }: { position: [number,number,number]; color: string; delay: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime + delay;
    const pulse = 0.8 + Math.sin(t * 2) * 0.2;
    ref.current.scale.setScalar(pulse);
    (ref.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.3 + Math.sin(t * 2) * 0.3;
  });
  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.12, 12, 12]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} roughness={0.2} metalness={0.7} />
    </mesh>
  );
}

function NeuralConnections({ layers }: { layers: [number,number,number][][] }) {
  const connections = useMemo(() => {
    const result: { from: THREE.Vector3; to: THREE.Vector3; opacity: number }[] = [];
    for (let l = 0; l < layers.length - 1; l++) {
      for (const from of layers[l]) {
        for (const to of layers[l + 1]) {
          result.push({
            from: new THREE.Vector3(...from),
            to: new THREE.Vector3(...to),
            opacity: 0.08 + Math.random() * 0.15,
          });
        }
      }
    }
    return result;
  }, [layers]);

  return (
    <>
      {connections.map((c, i) => (
        <Line key={i} points={[c.from, c.to]} color="#06B6D4" lineWidth={0.4} transparent opacity={c.opacity} />
      ))}
    </>
  );
}

function NeuralNet({ numLayers, neuronsPerLayer }: { numLayers: number; neuronsPerLayer: number }) {
  const layers = useMemo(() => {
    const result: [number,number,number][][] = [];
    for (let l = 0; l < numLayers; l++) {
      const x = (l - (numLayers - 1) / 2) * 1.2;
      const layer: [number,number,number][] = [];
      for (let n = 0; n < neuronsPerLayer; n++) {
        const y = (n - (neuronsPerLayer - 1) / 2) * 0.6;
        layer.push([x, y, 0]);
      }
      result.push(layer);
    }
    return result;
  }, [numLayers, neuronsPerLayer]);

  const COLORS = ["#3B82F6", "#8B5CF6", "#EC4899", "#06B6D4", "#F59E0B"];

  return (
    <group>
      <NeuralConnections layers={layers} />
      {layers.map((layer, li) =>
        layer.map((pos, ni) => (
          <Neuron key={`${li}-${ni}`} position={pos} color={COLORS[li % COLORS.length]} delay={li * 0.3 + ni * 0.1} />
        ))
      )}
    </group>
  );
}

export default function RedesNeuraisScene({ numLayers = 4, neuronsPerLayer = 4 }: { numLayers?: number; neuronsPerLayer?: number }) {
  return (
    <div style={{ width: "100%", height: "100%", borderRadius: "12px", overflow: "hidden" }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }} style={{ background: "transparent" }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[5, 5, 5]} intensity={1.5} color="#06B6D4" />
        <pointLight position={[-5, -5, 5]} intensity={1} color="#8B5CF6" />
        <NeuralNet numLayers={numLayers} neuronsPerLayer={neuronsPerLayer} />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.8} />
      </Canvas>
    </div>
  );
}
