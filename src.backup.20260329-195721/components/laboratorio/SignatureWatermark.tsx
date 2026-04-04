import { Info } from "lucide-react";

import { nexus } from "@/data/agents";

export default function SignatureWatermark() {
  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-40">
      <div className="group pointer-events-auto inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-1.5 text-xs text-gray-400 backdrop-blur-md transition-all duration-300 hover:border-cyan-400/40 hover:text-gray-200 hover:shadow-[0_0_24px_rgba(6,182,212,0.25)]">
        <span className="opacity-80">{nexus.signature}</span>
        <Info className="h-3.5 w-3.5 opacity-70" />

        <div className="pointer-events-none absolute bottom-10 right-0 w-72 translate-y-2 rounded-lg border border-cyan-400/25 bg-[#0b1020]/95 p-3 text-[11px] leading-relaxed text-gray-300 opacity-0 shadow-[0_8px_30px_rgba(59,130,246,0.25)] transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <p className="font-semibold text-cyan-300">
            {nexus.technicalName} &quot;{nexus.nickname}&quot;
          </p>
          <p className="mt-1">{nexus.description}</p>
        </div>
      </div>
    </div>
  );
}
