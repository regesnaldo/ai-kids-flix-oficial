"use client";

export default function ContaError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen bg-[#f5f5f5] px-4 py-10 text-zinc-900 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-3xl rounded-2xl bg-white p-6 shadow-sm ring-1 ring-zinc-200 sm:p-8">
        <h2 className="text-xl font-bold text-zinc-950">Não foi possível carregar a página de conta</h2>
        <p className="mt-2 text-sm text-zinc-600">{error.message || "Erro inesperado ao carregar dados da conta."}</p>
        <button
          type="button"
          onClick={reset}
          className="mt-4 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-zinc-700"
        >
          Tentar novamente
        </button>
      </div>
    </div>
  );
}
