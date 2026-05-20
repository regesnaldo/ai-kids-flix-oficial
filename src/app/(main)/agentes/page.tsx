import AgentHero from "@/components/agents/AgentHero";

export const metadata = {
  title: "Agentes — MENTE.AI",
  description:
    "Conheça os 12 agentes conscientes do MENTE.AI: entidades com personalidade, memória, conflitos internos e objetivos próprios.",
};

export default function AgentesPage() {
  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
      <AgentHero />
    </div>
  );
}
