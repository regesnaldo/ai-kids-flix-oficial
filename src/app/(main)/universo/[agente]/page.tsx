import { notFound } from "next/navigation";
import { UNIVERSOS } from "@/data/universos";
import NexusDialogLive from "@/components/universo/NexusDialogLive";
import UniversoCard from "@/components/universo/UniversoCard";

export default async function UniversoAgentePage({
  params,
}: {
  params: Promise<{ agente: string }>;
}) {
  const { agente } = await params;
  const universo = UNIVERSOS[(agente || "").toLowerCase() as keyof typeof UNIVERSOS];
  if (!universo) notFound();

  return (
    <main className="mx-auto max-w-5xl space-y-4 px-4 py-8">
      <UniversoCard universo={universo} />
      {universo.id === "nexus" ? (
        <NexusDialogLive />
      ) : (
        <section className="rounded-xl border border-white/10 bg-black/30 p-4 text-sm text-white/80">
          Este universo está ativo. O modo de chat dedicado existe no piloto do NEXUS.
        </section>
      )}
    </main>
  );
}

