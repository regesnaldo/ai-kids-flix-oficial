export default function ExperimentLoading() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center gap-5"
      style={{ background: "#0e1420" }}
    >
      <div className="relative h-14 w-14">
        <div
          className="absolute inset-0 animate-pulse rounded-full opacity-10"
          style={{ background: "var(--accent-cyan)", boxShadow: "0 0 30px rgba(0,245,255,0.2)" }}
        />
        <div className="absolute inset-1 animate-spin rounded-full border-2 border-transparent border-t-[var(--accent-cyan)] border-r-[#a78bfa]" />
        <span className="absolute inset-0 flex items-center justify-center text-xl">🧪</span>
      </div>
      <div className="text-center">
        <p className="text-base font-semibold text-white/50">Carregando experimento</p>
        <p className="mt-1 text-xs text-white/20 font-mono">Conectando agentes ao laboratório...</p>
      </div>
    </div>
  );
}
