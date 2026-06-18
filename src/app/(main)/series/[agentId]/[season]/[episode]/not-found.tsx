import Link from "next/link";

export default function SeriesNotFound() {
  return (
    <main
      className="min-h-screen flex items-center justify-center px-6"
      style={{ background: "var(--cyber-black)" }}
    >
      <div className="text-center max-w-md">
        <div className="text-5xl mb-4">🎬</div>
        <h1 className="text-2xl font-black text-white mb-2" style={{ fontFamily: "var(--font-display)" }}>
          Episódio Não Encontrado
        </h1>
        <p className="text-gray-400 text-sm mb-6 leading-relaxed">
          Este capítulo ainda não foi escrito. O agente pode estar preparando
          esta temporada ou o episódio pode não existir.
        </p>
        <div className="flex gap-3 justify-center">
          <Link
            href="/series"
            className="px-5 py-2.5 rounded-lg text-sm font-bold transition"
            style={{ background: "rgba(255,255,255,0.08)", color: "#fff", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            Ver todas as séries
          </Link>
          <Link
            href="/home"
            className="px-5 py-2.5 rounded-lg text-sm font-bold transition"
            style={{ background: "rgba(0,240,255,0.1)", color: "#00f0ff", border: "1px solid rgba(0,240,255,0.2)" }}
          >
            Voltar ao início
          </Link>
        </div>
      </div>
    </main>
  );
}
