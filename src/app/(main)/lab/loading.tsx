export default function LabLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center" style={{ background: "#0e1420" }}>
      <div className="flex flex-col items-center gap-5">
        <div className="relative h-16 w-16">
          <div
            className="absolute inset-0 animate-pulse rounded-full opacity-10"
            style={{ background: "var(--accent-cyan)", boxShadow: "0 0 24px rgba(0,245,255,0.2)" }}
          />
          <div className="absolute inset-2 animate-spin rounded-full border-2 border-transparent border-t-[var(--accent-cyan)] border-r-[#a78bfa]" />
          <span className="absolute inset-0 flex items-center justify-center text-xl">🧪</span>
        </div>
        <div className="text-center">
          <p className="text-base font-semibold text-white/60">Preparando o Laboratório</p>
          <p className="mt-1 text-xs text-white/25 font-mono">NEXUS · CIPHER · KAOS · AURORA</p>
        </div>
        <div className="h-0.5 w-48 overflow-hidden rounded-full bg-white/5">
          <div className="h-full w-1/3 animate-[shimmer_2s_linear_infinite] rounded-full bg-gradient-to-r from-transparent via-[var(--accent-cyan)] to-transparent [background-size:200%_100%]" />
        </div>
      </div>
    </div>
  );
}
