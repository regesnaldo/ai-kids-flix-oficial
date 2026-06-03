import type { Topic } from "@/types/topic";

const TOPICS: Topic[] = [
  {
    id: "como-ia-aprende",
    label: "Como a IA aprende?",
    question: "Como a inteligência artificial aprende a partir de dados? Explique de forma simples.",
    color: "#3B82F6",
  },
  {
    id: "deep-learning",
    label: "O que é deep learning?",
    question: "O que é deep learning e como ele se diferencia do machine learning tradicional?",
    color: "#10B981",
  },
  {
    id: "etica-ia",
    label: "Ética na IA",
    question: "Quais são os principais desafios éticos no desenvolvimento de inteligência artificial?",
    color: "#F59E0B",
  },
  {
    id: "futuro-ia",
    label: "Futuro da IA",
    question: "Como a inteligência artificial pode transformar a sociedade nos próximos 10 anos?",
    color: "#EC4899",
  },
  {
    id: "llms",
    label: "O que são LLMs?",
    question: "O que são Large Language Models e como eles funcionam?",
    color: "#8B5CF6",
  },
  {
    id: "ia-criativa",
    label: "IA é criativa?",
    question: "A inteligência artificial pode ser verdadeiramente criativa ou apenas imitar padrões?",
    color: "#06B6D4",
  },
  {
    id: "ia-meio-ambiente",
    label: "IA e meio ambiente",
    question: "Qual o impacto da inteligência artificial no meio ambiente e na sustentabilidade?",
    color: "#10B981",
  },
];

export function getTopics(): Topic[] {
  return TOPICS;
}
