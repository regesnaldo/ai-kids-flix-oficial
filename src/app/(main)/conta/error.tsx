"use client";

/**
 * error.tsx — Barreira de erros da seção /conta.
 *
 * Captura falhas em páginas de conta (assinatura, pagamento, perfis, etc).
 * O layout (main) com header/navegação é preservado.
 */

export default function ContaError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[calc(100vh-70px)] items-center justify-center bg-[#0a0a1a] px-4">
      <div className="w-full max-w-lg">
        <div className="rounded-modal border border-white/[0.06] bg-[rgba(20,20,50,0.5)] p-8 backdrop-blur-[12px]">
          <h2 className="mb-3 text-xl font-bold text-white">
            Erro ao carregar dados da conta
          </h2>

          <p className="mb-5 text-sm leading-relaxed text-white/50">
            {error.message || "Não foi possível acessar as informações da sua conta no momento."}
          </p>

          <button
            type="button"
            onClick={reset}
            className="rounded-[10px] border border-[#00f0ff]/30 bg-[#00f0ff]/10 px-6 py-2.5 text-sm font-semibold text-[#00f0ff] transition-all duration-200 hover:bg-[#00f0ff]/20 hover:shadow-[0_0_24px_rgba(0,240,255,0.25)]"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    </div>
  );
}
