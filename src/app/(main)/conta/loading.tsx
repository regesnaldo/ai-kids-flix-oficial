/**
 * loading.tsx — Fallback de carregamento da seção /conta.
 *
 * Atualizado para o tema escuro cyberpunk do MENTE.AI.
 */

export default function ContaLoading() {
  return (
    <div className="flex min-h-[calc(100vh-70px)] items-center justify-center bg-[#0a0a1a]">
      <div className="rounded-modal border border-white/[0.06] bg-[rgba(20,20,50,0.5)] p-8 backdrop-blur-[12px]">
        <div className="flex items-center gap-4">
          {/* Spinner sutil */}
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/10 border-t-[#00f0ff]" />
          <p className="text-sm text-white/40">Carregando dados da conta...</p>
        </div>
      </div>
    </div>
  );
}
