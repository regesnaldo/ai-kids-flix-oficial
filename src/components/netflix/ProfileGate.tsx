"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, X, User } from "lucide-react";

// ─── Types ──────────────────────────────────────────────

interface Profile {
  id: string;
  name: string;
  avatar?: string;
  color: string;
  maturityLevel: string;
}

interface ProfileGateProps {
  profiles: Profile[];
  onSelect: (profile: Profile) => void;
  onAdd?: () => void;
  onEdit?: (profile: Profile) => void;
  maxProfiles?: number;
}

const COLORS = [
  "from-cyan-400 to-blue-500",
  "from-purple-400 to-pink-500",
  "from-orange-400 to-red-500",
  "from-green-400 to-emerald-500",
  "from-yellow-400 to-amber-500",
  "from-indigo-400 to-violet-500",
];

const MATURITY_LABELS: Record<string, string> = {
  L: "Livre",
  "10": "10+",
  "12": "12+",
  "14": "14+",
  "16": "16+",
  "18": "18+",
};

// ─── Component ──────────────────────────────────────────

export default function ProfileGate({
  profiles,
  onSelect,
  onAdd,
  onEdit,
  maxProfiles = 5,
}: ProfileGateProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cyber-black px-4">
      {/* Logo / Title */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tight"
      >
        Quem est{" "}
        <span
          className="bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent"
          style={{ WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
        >
          assistindo?
        </span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-zinc-400 text-sm mb-12"
      >
        Escolha seu perfil para continuar
      </motion.p>

      {/* Profiles grid */}
      <div className="flex flex-wrap justify-center gap-6 md:gap-8 max-w-3xl">
        <AnimatePresence>
          {profiles.map((profile, index) => (
            <motion.div
              key={profile.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 + 0.2, duration: 0.3 }}
              className="flex flex-col items-center gap-3 group"
            >
              {/* Avatar */}
              <button
                type="button"
                onClick={() => onSelect(profile)}
                onMouseEnter={() => setHoveredId(profile.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="relative w-28 h-28 md:w-36 md:h-36 rounded-xl overflow-hidden transition-all duration-200"
                style={{
                  border: hoveredId === profile.id ? "3px solid #00f0ff" : "3px solid transparent",
                  boxShadow: hoveredId === profile.id
                    ? "0 0 20px rgba(0,240,255,0.3), 0 8px 32px rgba(0,0,0,0.5)"
                    : "0 4px 16px rgba(0,0,0,0.3)",
                }}
              >
                {profile.avatar ? (
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className={`w-full h-full bg-gradient-to-br ${profile.color} flex items-center justify-center`}
                  >
                    <span className="text-3xl md:text-5xl font-black text-white">
                      {profile.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}

                {/* Edit button on hover */}
                {onEdit && (
                  <div
                    className="absolute inset-0 bg-black/60 flex items-center justify-center transition-opacity"
                    style={{ opacity: hoveredId === profile.id ? 1 : 0, pointerEvents: hoveredId === profile.id ? "auto" : "none" }}
                  >
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(profile);
                      }}
                      className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
                      aria-label={`Edit profile ${profile.name}`}
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </button>

              {/* Name */}
              <span
                className="text-sm font-medium transition-colors"
                style={{
                  color: hoveredId === profile.id ? "#fff" : "rgba(255,255,255,0.5)",
                }}
              >
                {profile.name}
              </span>

              {/* Maturity level */}
              <span className="text-[10px] text-zinc-500 font-semibold">
                {MATURITY_LABELS[profile.maturityLevel] ?? profile.maturityLevel}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Add profile */}
        {onAdd && profiles.length < maxProfiles && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: profiles.length * 0.1 + 0.2 }}
            className="flex flex-col items-center gap-3"
          >
            <button
              type="button"
              onClick={onAdd}
              className="w-28 h-28 md:w-36 md:h-36 rounded-xl border-2 border-dashed border-zinc-600 flex items-center justify-center hover:border-zinc-400 hover:bg-white/5 transition-colors"
            >
              <Plus className="w-8 h-8 text-zinc-500" />
            </button>
            <span className="text-sm text-zinc-500 font-medium">Adicionar Perfil</span>
          </motion.div>
        )}
      </div>

      {/* Manage profiles link */}
      <button
        type="button"
        className="mt-16 px-5 py-2 border border-zinc-600 text-zinc-400 text-sm rounded hover:border-zinc-400 hover:text-white transition-colors"
      >
        Gerenciar Perfis
      </button>
    </div>
  );
}
