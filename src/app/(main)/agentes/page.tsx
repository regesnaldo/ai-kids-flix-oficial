import { Plus_Jakarta_Sans } from "next/font/google";
import AgentHero from "@/components/agents/AgentHero";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata = {
  title: "Agentes — MENTE.AI",
  description:
    "Conheça os 12 agentes especializados da plataforma MENTE.AI. Cada agente possui habilidades únicas para potencializar seu aprendizado.",
};

export default function AgentesPage() {
  return (
    <div className={plusJakarta.className}>
      <AgentHero />
    </div>
  );
}
