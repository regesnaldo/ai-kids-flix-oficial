"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";

/**
 * DynamicScene — Carregador lazy universal para cenas Three.js.
 *
 * Cada cena 3D (~150-300 linhas, importa Three.js + @react-three/fiber/drei)
 * é carregada sob demanda APENAS quando o universo correspondente é visitado.
 *
 * Isso remove ~500KB (Three.js + drei) do bundle inicial e distribui
 * o custo entre as 12 rotas de universo.
 *
 * Uso:
 *   <DynamicScene scene="AuroraScene" />
 *   <DynamicScene scene="NexusScene" />
 */

const SCENE_MAP: Record<string, () => Promise<{ default: ComponentType }>> = {
  AuroraScene: () =>
    import("@/components/scenes/AuroraScene").then((m) => ({
      default: m.AuroraScene,
    })),
  AxiomScene: () =>
    import("@/components/scenes/AxiomScene").then((m) => ({
      default: m.AxiomScene,
    })),
  CipherScene: () =>
    import("@/components/scenes/CipherScene").then((m) => ({
      default: m.CipherScene,
    })),
  EthosScene: () =>
    import("@/components/scenes/EthosScene").then((m) => ({
      default: m.EthosScene,
    })),
  JanusScene: () =>
    import("@/components/scenes/JanusScene").then((m) => ({
      default: m.JanusScene,
    })),
  KaosScene: () =>
    import("@/components/scenes/KaosScene").then((m) => ({
      default: m.KaosScene,
    })),
  LyraScene: () =>
    import("@/components/scenes/LyraScene").then((m) => ({
      default: m.LyraScene,
    })),
  PrismScene: () =>
    import("@/components/scenes/PrismScene").then((m) => ({
      default: m.PrismScene,
    })),
  StratosScene: () =>
    import("@/components/scenes/StratosScene").then((m) => ({
      default: m.StratosScene,
    })),
  TerraScene: () =>
    import("@/components/scenes/TerraScene").then((m) => ({
      default: m.TerraScene,
    })),
  VoltScene: () =>
    import("@/components/scenes/VoltScene").then((m) => ({
      default: m.VoltScene,
    })),
  NexusScene: () =>
    import("@/components/universe/NexusScene").then((m) => ({
      default: m.NexusScene,
    })),
};

/**
 * Fallback exibido enquanto a cena 3D carrega.
 * Minimalista para não competir com o loading.tsx da rota.
 */
function SceneLoadingFallback() {
  return (
    <div className="flex h-full min-h-[300px] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/5 border-t-[#a855f7]/50" />
    </div>
  );
}

// Pré-cria os componentes lazy no nível do módulo para evitar
// criar componentes durante o render (react-hooks/static-components)
const LAZY_SCENES = Object.fromEntries(
  Object.entries(SCENE_MAP).map(([key, loader]) => [
    key,
    dynamic(loader, { ssr: false, loading: () => <SceneLoadingFallback /> }),
  ])
);

interface DynamicSceneProps {
  scene: keyof typeof SCENE_MAP;
  className?: string;
}

export function DynamicScene({ scene, className }: DynamicSceneProps) {
  const LazyScene = LAZY_SCENES[scene];
  if (!LazyScene) {
    console.warn(`[DynamicScene] Cena "${scene}" não encontrada no mapa.`);
    return null;
  }

  return (
    <div className={className}>
      <LazyScene />
    </div>
  );
}
