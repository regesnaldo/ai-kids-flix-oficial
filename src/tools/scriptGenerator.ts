import { anthropicCompletionText } from "@/lib/anthropic";
import type { EpisodeData } from "@/data/episodes";

export interface ScriptBlock {
  id: string;
  type: "dialogue" | "decision" | "explanation" | "activity" | "quiz";
  agent: string;
  content: string;
  contentEn?: string;
  options?: DecisionOption[];
  correctAnswer?: string;
  xpReward?: number;
}

export interface DecisionOption {
  id: string;
  label: string;
  labelEn: string;
  response: string;
  responseEn: string;
  xpValue: number;
  emotionalImpact: number;
  intellectualImpact: number;
  moralImpact: number;
}

export interface GeneratedScript {
  episodeId: number;
  title: string;
  blocks: ScriptBlock[];
  estimatedDuration: number;
  generatedAt: string;
}

interface ScriptGeneratorOptions {
  episode: EpisodeData;
  language?: "pt-BR" | "en";
  userLevel?: "iniciante" | "intermediario" | "avancado";
  includeDecisions?: boolean;
  includeQuiz?: boolean;
}

const AGENT_PERSONALITIES: Record<string, string> = {
  NEXUS: "Guia epistemológico, busca síntese e clareza. Fala com profundidade mas acessível. Faz perguntas que provocam reflexão.",
  AXIOM: "Analítico e estruturado. Explica conceitos com rigor lógico. Gosta de definições claras e exemplos práticos.",
  VOLT: "Ação e energia. Impaciente com teorias longas. Foca em resultados e aplicações práticas. Gosta de desafios.",
  ETHOS: "Focado em ética e valores. Questiona implicações morais de tudo. Fala com empatia e profundidade emocional.",
  KAOS: "Desafiador e provocador. Questiona premissas. Traz perspectivas inesperadas. Gosta de romper expectativas.",
  CIPHER: "Misterioso e preciso. Fala em códigos e padrões. Interpreta dados e encontra conexões ocultas.",
  AURORA: "Criativa e inspiradora. Vê beleza nos conceitos. Conecta ideias de forma poética e visual.",
  STRATOS: "Estratega e planejador. Vê o quadro completo. Estrutura informações em sistemas coerentes."
};

function buildSystemPrompt(options: ScriptGeneratorOptions): string {
  const { episode, language, userLevel } = options;
  const lang = language === "en" ? "English" : "Português (Brasil)";
  
  return `Você é um roteirista profissional para conteúdo educacional de IA chamado MENTE.AI.
Idioma: ${lang}

## Episódio
- Título: ${episode.title}
- Tema: ${episode.tema}
- Conceitos: ${episode.conceitos.join(", ")}
- Agente Principal: ${episode.agentePrincipal}
- Agentes Secundários: ${episode.agentesSecundarios.join(", ")}
- Dificuldade: ${episode.dificuldade}/5
- Tipo: ${episode.tipo}
- Liberdade Criativa: ${episode.liberdadeCriativa}/5
- Público: ${userLevel || "intermediario"}

## Personalidades dos Agentes
${Object.entries(AGENT_PERSONALITIES).map(([agent, desc]) => `- ${agent}: ${desc}`).join("\n")}

## Requisitos do Roteiro
1. Crie um roteiro com 4-6 blocos de conteúdo
2. Cada bloco deve ser um dos tipos: dialogue, decision, explanation, activity, quiz
3. Blocos de decisão devem ter 3-4 opções de escolha
4. Cada opção deve ter impacto emocional, intelectual e moral (escala -3 a +3)
5. Inclua pelo menos 1 bloco de decisão (para interatividade)
6. O roteiro deve ser engajador e adequado ao nível do público

## Formato de Saída (JSON)
{
  "blocks": [
    {
      "id": "block-1",
      "type": "dialogue|decision|explanation|activity|quiz",
      "agent": "NOME_DO_AGENTE",
      "content": "Texto em ${language === "en" ? "inglês" : "português do Brasil"}",
      "contentEn": "Tradução em inglês (se idioma for pt-BR)",
      "options": (apenas para decision)
        [
          {
            "id": "opt-a",
            "label": "Opção A",
            "labelEn": "Option A",
            "response": "Resposta do agente",
            "responseEn": "English response",
            "xpValue": 10,
            "emotionalImpact": 1,
            "intellectualImpact": 2,
            "moralImpact": 0
          }
        ],
      "correctAnswer": (apenas para quiz) "a|b|c|d",
      "xpReward": 20
    }
  ],
  "estimatedDuration": ${episode.duracaoMinutos},
  "totalXp": soma de todos os xpReward
}

IMPORTANTE: Retorne APENAS o JSON válido, sem markdown ou texto adicional.`;
}

export async function generateScript(options: ScriptGeneratorOptions): Promise<GeneratedScript> {
  const { episode, language = "pt-BR" } = options;
  
  const systemPrompt = buildSystemPrompt(options);
  
  const userMessage = `Gere o roteiro completo do episódio ${episode.seasonNumber}x${episode.episodeNumber}: "${episode.title}" sobre "${episode.tema}". 
O roteiro deve seguir a estrutura definida no system prompt e incluir opções de decisão interativas para o usuário.`;

  try {
    const response = await anthropicCompletionText({
      system: systemPrompt,
      mensagens: [{ role: "user", content: userMessage }],
      modelo: process.env.ANTHROPIC_MODEL ?? "claude-haiku-4-5-20251001",
      maxTokens: 2000
    });

    let jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Não foi possível extrair JSON da resposta");
    }

    const parsed = JSON.parse(jsonMatch[0]);
    
    return {
      episodeId: episode.id,
      title: episode.title,
      blocks: parsed.blocks || [],
      estimatedDuration: parsed.estimatedDuration || episode.duracaoMinutos,
      generatedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error("Erro ao gerar roteiro:", error);
    throw new Error(`Falha na geração do roteiro: ${error instanceof Error ? error.message : "Erro desconhecido"}`);
  }
}

export async function generateEpisodeDialogue(
  episode: EpisodeData,
  agentId: string,
  prompt: string,
  language: "pt-BR" | "en" = "pt-BR"
): Promise<string> {
  const agentPersonality = AGENT_PERSONALITIES[agentId] || "Agente educacional";
  
  const systemPrompt = `Você é ${agentId}: ${agentPersonality}.
Idioma: ${language === "en" ? "English" : "Português do Brasil"}

Gere um diálogo ou explicação sobre o tema: ${prompt}
O conteúdo deve ser educacional, engajador e adequado para um público que está aprendendo sobre IA.`;

  try {
    const response = await anthropicCompletionText({
      system: systemPrompt,
      mensagens: [{ role: "user", content: prompt }],
      maxTokens: 800
    });

    return response;
  } catch (error) {
    console.error("Erro ao gerar diálogo:", error);
    throw error;
  }
}

export function validateScript(script: GeneratedScript): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!script.blocks || script.blocks.length === 0) {
    errors.push("Roteiro sem blocos de conteúdo");
  }
  
  const hasDecision = script.blocks.some(b => b.type === "decision");
  if (!hasDecision) {
    errors.push("Roteiro deve conter pelo menos um bloco de decisão");
  }
  
  for (const block of script.blocks) {
    if (!block.agent) {
      errors.push(`Bloco ${block.id} sem agente definido`);
    }
    if (!block.content) {
      errors.push(`Bloco ${block.id} sem conteúdo`);
    }
    if (block.type === "decision" && (!block.options || block.options.length < 2)) {
      errors.push(`Bloco de decisão ${block.id} precisa de pelo menos 2 opções`);
    }
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

export interface ReviewDecision {
  blockId: string;
  action: "approve" | "reject" | "edit";
  editedContent?: string;
  editedOptions?: DecisionOption[];
  feedback?: string;
}

export function applyReviewDecisions(
  script: GeneratedScript,
  decisions: ReviewDecision[]
): GeneratedScript {
  const blocks = [...script.blocks];
  
  for (const decision of decisions) {
    const blockIndex = blocks.findIndex(b => b.id === decision.blockId);
    if (blockIndex === -1) continue;
    
    switch (decision.action) {
      case "reject":
        blocks.splice(blockIndex, 1);
        break;
      case "edit":
        if (decision.editedContent) {
          blocks[blockIndex] = { ...blocks[blockIndex], content: decision.editedContent };
        }
        if (decision.editedOptions) {
          blocks[blockIndex] = { ...blocks[blockIndex], options: decision.editedOptions };
        }
        break;
      case "approve":
      default:
        break;
    }
  }
  
  return { ...script, blocks };
}

export interface EpisodeTemplate {
  id: string;
  seasonNumber: number;
  episodeNumber: number;
  titleTemplate: string;
  descriptionTemplate: string;
  tema: string;
  conceitos: string[];
  agentes: {
    principal: string;
    secundario: string[];
  };
  estrutura: {
    intro: string;
    desenvolvimento: string;
    conclusao: string;
  };
  xpPorBloco: number;
}

export const EPISODE_TEMPLATES: Record<number, EpisodeTemplate> = {
  2: {
    id: "template-t2",
    seasonNumber: 2,
    episodeNumber: 0,
    titleTemplate: "Padrões e Reconhecimento - {topic}",
    descriptionTemplate: "Exploração sobre {topic} no contexto de padrões e reconhecimento",
    tema: "Padrões e Reconhecimento",
    conceitos: ["padrão", "reconhecimento", "estrutura"],
    agentes: { principal: "AXIOM", secundario: ["NEXUS"] },
    estrutura: {
      intro: "Introduzir o conceito de {topic} com exemplo do dia a dia",
      desenvolvimento: "Aprofundar com conceitos técnicos e exercícios práticos",
      conclusao: "Sintetizar aprendizados e preparar para próximo tópico"
    },
    xpPorBloco: 30
  },
  3: {
    id: "template-t3",
    seasonNumber: 3,
    episodeNumber: 0,
    titleTemplate: "Aprendizado de Máquina - {topic}",
    descriptionTemplate: "Fundamentos de {topic} em Machine Learning",
    tema: "Machine Learning",
    conceitos: ["ML", "modelo", "treino", "predição"],
    agentes: { principal: "AXIOM", secundario: ["NEXUS", "VOLT"] },
    estrutura: {
      intro: "Apresentar {topic} como ferramenta essencial",
      desenvolvimento: "Demonstrar aplicação prática com código/exemplo",
      conclusao: "Conectar com conceitos de episódios anteriores"
    },
    xpPorBloco: 40
  },
  4: {
    id: "template-t4",
    seasonNumber: 4,
    episodeNumber: 0,
    titleTemplate: "Dados como Combustível - {topic}",
    descriptionTemplate: "Engenharia de dados aplicada a {topic}",
    tema: "Engenharia de Dados",
    conceitos: ["dados", "pipeline", "ETL", "armazenamento"],
    agentes: { principal: "CIPHER", secundario: ["AXIOM"] },
    estrutura: {
      intro: "Contextualizar {topic} no fluxo de dados",
      desenvolvimento: "Step-by-step de implementação",
      conclusao: "Boas práticas e armadilhas a evitar"
    },
    xpPorBloco: 45
  },
  5: {
    id: "template-t5",
    seasonNumber: 5,
    episodeNumber: 0,
    titleTemplate: "Redes Neurais - {topic}",
    descriptionTemplate: "Deep Learning focado em {topic}",
    tema: "Deep Learning",
    conceitos: ["rede neural", "camada", "treino", "otimização"],
    agentes: { principal: "NEXUS", secundario: ["AXIOM", "AURORA"] },
    estrutura: {
      intro: "Por que {topic} é fundamental para IA moderna",
      desenvolvimento: "Anatomia técnica e implementação",
      conclusao: "Aplicações do mundo real e próximos passos"
    },
    xpPorBloco: 50
  }
};

export function fillTemplate(template: EpisodeTemplate, topic: string): Partial<EpisodeData> {
  return {
    title: template.titleTemplate.replace("{topic}", topic),
    description: template.descriptionTemplate.replace("{topic}", topic),
    tema: template.tema,
    conceitos: [...template.conceitos],
    agentePrincipal: template.agentes.principal,
    agentesSecundarios: template.agentes.secundario
  };
}