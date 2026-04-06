import { notFound } from "next/navigation";
import { UNIVERSOS } from "@/data/universos";
import UniverseFlowClient from "@/components/universo/UniverseFlowClient";

export default async function UniversoAgentePage({
  params,
}: {
  params: Promise<{ agente: string }>;
}) {
  const { agente } = await params;
  const universo = UNIVERSOS[(agente || "").toLowerCase() as keyof typeof UNIVERSOS];
  if (!universo) notFound();

  return <UniverseFlowClient universo={universo} />;
}

