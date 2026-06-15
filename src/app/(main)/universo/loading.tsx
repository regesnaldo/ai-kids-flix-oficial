/**
 * loading.tsx — Fallback de carregamento para páginas de universo.
 *
 * Exibido ao navegar entre universos (nexus, aurora, axiom, etc.).
 * Cada universo carrega seu próprio Scene 3D e chat — merece um fallback.
 */

export default function UniversoLoading() {
  return (
    <div className="flex min-h-[calc(100vh-70px)] items-center justify-center bg-[#0a0a1a]">
      <div className="flex flex-col items-center gap-4">
        {/* Portal giratório */}
        <div className="relative h-14 w-14">
          <div className="absolute inset-0 animate-[spin_3s_linear_infinite] rounded-full border border-white/10" />
          <div className="absolute inset-1 animate-[spin_2s_linear_infinite] rounded-full border border-[#00f0ff]/20 [animation-direction:reverse]" />
          <div className="absolute inset-2 animate-[spin_1.5s_linear_infinite] rounded-full border border-[#a855f7]/30" />
          <span className="absolute inset-0 flex items-center justify-center text-lg">
            🌌
          </span>
        </div>

        <p className="text-sm text-white/40">
          Atravessando o portal...
        </p>
      </div>
    </div>
  );
}
