import AgentHero from "@/components/agents/AgentHero";

export const metadata = {
  title: "Agentes — MENTE.AI",
  description:
    "Conheça os 12 agentes especializados da plataforma MENTE.AI. Cada agente possui habilidades únicas para potencializar seu aprendizado.",
};

export default function AgentesPage() {
  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
      <AgentHero />
    </div>
  );
}
