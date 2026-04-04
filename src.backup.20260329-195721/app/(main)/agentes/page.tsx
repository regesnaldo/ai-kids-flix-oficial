import AgentCardCompact from "@/components/agents/AgentCardCompact";
import { agents, type AgentLevel } from "@/data/agents";

const levelOrder: AgentLevel[] = ["Fundamentos", "Intermediário", "Avançado", "Mestre"];

export default function AgentesPage() {
  const agentsByLevel = {
    Fundamentos: agents.filter((agent) => agent.level === "Fundamentos"),
    Intermediário: agents.filter((agent) => agent.level === "Intermediário"),
    Avançado: agents.filter((agent) => agent.level === "Avançado"),
    Mestre: agents.filter((agent) => agent.level === "Mestre"),
  } as const;

  return (
    <div className="min-h-screen bg-[#0a0a0f] py-8">
      <div className="mx-auto max-w-7xl px-4">
        <h1 className="text-center text-4xl font-bold text-white">Agentes MENTE.AI</h1>
        <p className="mb-10 mt-2 text-center text-gray-400">20 agentes em ordem de descoberta</p>

        {levelOrder.map((level) => (
          <section key={level} className="mb-12">
            <h2 className="mb-5 text-2xl font-bold text-purple-400">
              {level} ({agentsByLevel[level].length} agentes)
            </h2>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {agentsByLevel[level].map((agent) => (
                <div key={agent.id} className="flex justify-center">
                  <AgentCardCompact agent={agent} />
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
