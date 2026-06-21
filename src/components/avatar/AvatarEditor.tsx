"use client";

import { useState, useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { motion } from "framer-motion";
import { Sparkles, Save, Loader2 } from "lucide-react";
import * as THREE from "three";

const SHAPES = [
  { id: "sphere", label: "Esfera", icon: "🔮" },
  { id: "cube", label: "Cubo", icon: "📦" },
  { id: "cone", label: "Cone", icon: "🔺" },
];

const BASE_COLORS = [
  "#00f0ff", "#a855f7", "#22c55e", "#f59e0b",
  "#ef4444", "#3b82f6", "#ec4899", "#ffffff",
];

function AuraMesh({ color, intensity }: { color: string; intensity: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.3;
      meshRef.current.rotation.x += delta * 0.1;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1.15, 32, 32]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={intensity * 0.25}
        depthWrite={false}
      />
    </mesh>
  );
}

function AvatarMesh({ shape, color }: { shape: string; color: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5;
    }
  });

  const geometry =
    shape === "cube" ? <boxGeometry args={[1, 1, 1]} /> :
    shape === "cone" ? <coneGeometry args={[0.6, 1.2, 32]} /> :
    <sphereGeometry args={[1, 32, 32]} />;

  return (
    <mesh ref={meshRef}>
      {geometry}
      <meshStandardMaterial
        color={color}
        roughness={0.3}
        metalness={0.7}
      />
    </mesh>
  );
}

export default function AvatarEditor() {
  const [shape, setShape] = useState("sphere");
  const [color, setColor] = useState("#00f0ff");
  const [auraColor, setAuraColor] = useState("#00f0ff");
  const [auraIntensity, setAuraIntensity] = useState(0.5);
  const [auraLabel, setAuraLabel] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/avatar", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        if (data.shape) {
          setShape(data.shape);
          setColor(data.color);
          setAuraColor(data.auraColor);
          setAuraIntensity(data.auraIntensity);
          setAuraLabel(data.auraLabel || "");
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/avatar", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shape, color }),
      });
      const data = await res.json();
      if (data.success) {
        setAuraColor(data.auraColor);
        setAuraIntensity(data.auraIntensity);
        setAuraLabel(data.auraLabel || "");
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } catch {
      // Silencioso
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#030712" }}>
        <Loader2 className="animate-spin text-gray-500" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-12" style={{ background: "#030712" }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Sparkles size={24} style={{ color: auraColor }} />
          <h1 className="text-2xl font-black text-white" style={{ fontFamily: "var(--font-display)" }}>
            Editor de Avatar
          </h1>
        </div>

        {/* 3D Preview */}
        <div className="rounded-2xl overflow-hidden mb-8 border" style={{ height: 320, borderColor: `${auraColor}20`, background: "#050510" }}>
          <Canvas camera={{ position: [0, 0.5, 3.5], fov: 50 }}>
            <ambientLight intensity={0.4} />
            <pointLight position={[3, 3, 3]} intensity={1} />
            <pointLight position={[-2, -1, -2]} intensity={0.5} color={auraColor} />
            <AvatarMesh shape={shape} color={color} />
            <AuraMesh color={auraColor} intensity={auraIntensity} />
            <OrbitControls enableZoom={false} enablePan={false} />
          </Canvas>
        </div>

        {/* Aura label */}
        {auraLabel && (
          <div className="text-center mb-6">
            <span className="text-xs px-3 py-1 rounded-full" style={{ background: `${auraColor}15`, color: auraColor, border: `1px solid ${auraColor}30` }}>
              Aura: {auraLabel} · {Math.round(auraIntensity * 100)}%
            </span>
          </div>
        )}

        {/* Shape picker */}
        <div className="mb-6">
          <p className="text-gray-400 text-xs mb-3">FORMA</p>
          <div className="flex gap-3">
            {SHAPES.map((s) => (
              <button
                key={s.id}
                onClick={() => setShape(s.id)}
                className="flex-1 py-3 rounded-xl text-sm font-bold transition-all"
                style={{
                  background: shape === s.id ? `${color}15` : "rgba(255,255,255,0.03)",
                  border: `1px solid ${shape === s.id ? color : "rgba(255,255,255,0.06)"}`,
                  color: shape === s.id ? color : "#888",
                }}
              >
                <span className="text-lg block mb-1">{s.icon}</span>
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Color picker */}
        <div className="mb-8">
          <p className="text-gray-400 text-xs mb-3">COR BASE</p>
          <div className="flex gap-3 flex-wrap">
            {BASE_COLORS.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className="w-10 h-10 rounded-full transition-all"
                style={{
                  background: c,
                  border: color === c ? "2px solid white" : "2px solid transparent",
                  boxShadow: color === c ? `0 0 16px ${c}60` : "none",
                  transform: color === c ? "scale(1.15)" : "scale(1)",
                }}
              />
            ))}
          </div>
        </div>

        {/* Save button */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-4 rounded-xl text-sm font-bold transition-all hover:scale-[1.02] disabled:opacity-50 flex items-center justify-center gap-2"
          style={{
            background: saved ? "#22c55e" : `linear-gradient(135deg, ${color}, ${auraColor})`,
            color: "#fff",
            boxShadow: `0 4px 24px ${auraColor}30`,
          }}
        >
          {saving ? <Loader2 className="animate-spin" size={16} /> : saved ? "✓ Salvo!" : <><Save size={16} /> Salvar Avatar</>}
        </button>
      </motion.div>
    </div>
  );
}
