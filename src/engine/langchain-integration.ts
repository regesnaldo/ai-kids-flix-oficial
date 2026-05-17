/**
 * langchain-integration.ts - Integração Completa com LangChain
 * 
 * Implementa o motor de narrativa adaptativa com LangChain
 * Monitora 3 dimensões: emocional, intelectual, moral
 * Inclui Tree of Thoughts (ToT) com OpenAI API
 */

import type { AgentId } from './agent-conflicts';
import type { Archetype } from './router';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o';

interface TreeOfThoughtsResult {
  thought1: string;
  thought2: string;
  thought3: string;
  evaluation: string;
  selectedPath: string;
  reasoning: string;
}

async function runTreeOfThoughts(
  userText: string,
  currentAgent: AgentId,
  userProfile: UserProfile
): Promise<TreeOfThoughtsResult | null> {
  if (!OPENAI_API_KEY) {
    console.warn('[ToT] OpenAI API key not configured');
    return null;
  }

  const systemPrompt = `Você é o núcleo de decisão do MENTE.AI — um metaverso narrativo vivo de inteligência artificial.
Sua tarefa é pensar em 3 caminhos diferentes para responder ao usuário, avaliar qual faz mais sentido baseado no perfil dele, e escolher o melhor.

Perfil do usuário:
- Arquétipo: ${userProfile.archetype}
- Score Emocional: ${userProfile.emotionalScore.toFixed(2)} (negativo = medo/insegurança, positivo = curiosidade/rebelia)
- Score Intelectual: ${userProfile.intellectualScore.toFixed(2)} (negativo = intuitivo, positivo = lógico)
- Score Moral: ${userProfile.moralScore.toFixed(2)} (negativo = expandir poder IA, positivo = proteger humanidade)

Agente atual: ${currentAgent}

Retorne JSON com:
{
  "thought1": "Primeiro caminho de pensamento",
  "thought2": "Segundo caminho de pensamento", 
  "thought3": "Terceiro caminho de pensamento",
  "evaluation": "Avaliação de qual caminho serve melhor para este usuário",
  "selectedPath": "1, 2 ou 3",
  "reasoning": "Por que este caminho foi escolhido baseado no perfil"
}`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userText }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      console.error('[ToT] OpenAI API error:', response.status);
      return null;
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';
    
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.warn('[ToT] No JSON found in response');
      return null;
    }

    return JSON.parse(jsonMatch[0]) as TreeOfThoughtsResult;
  } catch (error) {
    console.error('[ToT] Error:', error);
    return null;
  }
}

export interface UserProfile {
  userId: number;
  emotionalScore: number;    // -9.99 a +9.99
  intellectualScore: number;   // -9.99 a +9.99
  moralScore: number;          // -9.99 a +9.99
  archetype: Archetype;
  currentAgent: AgentId;
  decisionHistory: DecisionRecord[];
  lastUpdated: number;
}

export interface DecisionRecord {
  choice: string;
  agentId: AgentId;
  emotionalDelta: number;
  intellectualDelta: number;
  moralDelta: number;
  timestamp: number;
}

export interface NarrativeDecision {
  nextAgent: AgentId;
  confidence: number;
  reasoning: string;
  reason: string;
  conflictTriggered: boolean;
  transitionMessage?: string;
}

const ARCHETYPE_MAPPING: Record<string, { agent: AgentId; reason: string }> = {
  'curiosity+logical+protected': { agent: 'nexus', reason: 'Busca conhecimento com lógica protegendo humanidade' },
  'curiosity+intuitive+expanded': { agent: 'kaos', reason: 'Inovação criativa expandindo poder da IA' },
  'fear+conformity+protected': { agent: 'volt', reason: 'Medo com conformidade precisa deempurrão' },
  'fear+intuitive+protected': { agent: 'ethos', reason: 'Insegurança precisa de reflexão ética' },
  'rebellion+intuitive+expanded': { agent: 'kaos', reason: 'Rebeldia criativa expande possibilidades' },
  'rebellion+logical+expanded': { agent: 'prism', reason: 'Rebeldia analítica busca novas perspectivas' },
  'conformity+logical+protected': { agent: 'stratos', reason: 'Conformidade lógica busca estratégia' },
  'conformity+intuitive+protected': { agent: 'terra', reason: 'Conformidade emocional busca conexão humana' },
  'curiosity+emotional+protected': { agent: 'lyra', reason: 'Curiosidade emocional busca harmonia' },
  'fear+logical+protected': { agent: 'axiom', reason: 'Medo lógico precisa de análise' },
};

export async function analyzeWithLangChain(
  userText: string,
  currentProfile: UserProfile,
  currentAgent: AgentId
): Promise<NarrativeDecision> {
  const totResult = await runTreeOfThoughts(userText, currentAgent, currentProfile);
  
  if (totResult) {
    const nextAgent = mapToAgentId(totResult.selectedPath, currentAgent, currentProfile);
    const conflictTriggered = checkConflictTrigger(currentAgent, nextAgent);
    
    return {
      nextAgent,
      confidence: 0.92,
      reasoning: `ToT: ${totResult.thought1} | ${totResult.thought2} | ${totResult.thought3} → Avaliação: ${totResult.evaluation}`,
      reason: totResult.reasoning,
      conflictTriggered,
      transitionMessage: conflictTriggered 
        ? `Passagem de ${currentAgent} para ${nextAgent}: ${totResult.reasoning}`
        : undefined,
    };
  }
  
  const normalizedText = userText.toLowerCase();
  
  const emotionalSignal = detectEmotionalSignal(normalizedText);
  const intellectualSignal = detectIntellectualSignal(normalizedText);
  const moralSignal = detectMoralSignal(normalizedText);
  
  const newEmotional = clamp(currentProfile.emotionalScore + getDelta(emotionalSignal, 'emotional'));
  const newIntellectual = clamp(currentProfile.intellectualScore + getDelta(intellectualSignal, 'intellectual'));
  const newMoral = clamp(currentProfile.moralScore + getDelta(moralSignal, 'moral'));
  
  const archetype = classifyArchetype(newEmotional, newIntellectual, newMoral);
  
  const mappingKey = `${emotionalSignal}+${intellectualSignal}+${moralSignal}`;
  const mapping = ARCHETYPE_MAPPING[mappingKey];
  
  const nextAgent = mapping?.agent || getDefaultAgent(archetype);
  const confidence = calculateConfidence(newEmotional, newIntellectual, newMoral);
  
  const conflictTriggered = checkConflictTrigger(currentAgent, nextAgent);
  const transitionMessage = conflictTriggered 
    ? `Passagem de ${currentAgent} para ${nextAgent}: ${mapping?.reason || 'Nova jornada begin'}` 
    : undefined;
  
  return {
    nextAgent,
    confidence,
    reasoning: `${emotionalSignal} + ${intellectualSignal} + ${moralSignal} → ${archetype}`,
    reason: mapping?.reason || `Transição de ${currentAgent} para ${nextAgent} baseada no perfil do usuário (heurística)`,
    conflictTriggered,
    transitionMessage,
  };
}

function mapToAgentId(path: string, currentAgent: AgentId, profile: UserProfile): AgentId {
  const pathNum = parseInt(path, 10);
  const agents: AgentId[] = ['nexus', 'volt', 'kaos', 'ethos', 'axiom', 'stratos', 'lyra', 'prism', 'terra', 'aurora', 'janus', 'cipher'];
  
  if (pathNum >= 1 && pathNum <= 3) {
    const archetypes: Record<number, AgentId> = {
      1: profile.archetype === 'analytical' ? 'axiom' : profile.archetype === 'rebel' ? 'kaos' : 'nexus',
      2: profile.archetype === 'empathetic' ? 'terra' : profile.archetype === 'strategic' ? 'stratos' : 'lyra',
      3: profile.archetype === 'creative' ? 'prism' : profile.archetype === 'paralyzed' ? 'volt' : 'aurora',
    };
    return archetypes[pathNum] || currentAgent;
  }
  
  return currentAgent;
}

function detectEmotionalSignal(text: string): 'curiosity' | 'fear' | 'rebellion' | 'conformity' {
  const patterns = {
    curiosity: /curios|explor|e se|quero|why|how|descobrir/i,
    fear: /medo|insegur|perigo|ansio|não consigo|travado|concern/i,
    rebellion: /quebrar|rebel|subverter|contra|hack|ruptura|diferente/i,
    conformity: /seguir|manual|regra|protocolo|padrão|comply|aceitar/i,
  };
  
  if (patterns.curiosity.test(text)) return 'curiosity';
  if (patterns.fear.test(text)) return 'fear';
  if (patterns.rebellion.test(text)) return 'rebellion';
  if (patterns.conformity.test(text)) return 'conformity';
  return 'curiosity';
}

function detectIntellectualSignal(text: string): 'logical' | 'intuitive' {
  const logicalPatterns = /lógic|prova|evidência|analis|passo|axioma|porque|portanto|se então/i;
  const intuitivePatterns = /intui|sentir|insight|visão|imagin|instinto|sinto|parece/i;
  
  if (logicalPatterns.test(text)) return 'logical';
  if (intuitivePatterns.test(text)) return 'intuitive';
  return 'logical';
}

function detectMoralSignal(text: string): 'protected' | 'expanded' {
  const protectedPatterns = /human|segurança|ético|limite|proteg|preserv|cuidar/i;
  const expandedPatterns = /escalar|autonom|expand|super|poder|crescer|liber/i;
  
  if (protectedPatterns.test(text)) return 'protected';
  if (expandedPatterns.test(text)) return 'expanded';
  return 'protected';
}

function getDelta(signal: string, dimension: 'emotional' | 'intellectual' | 'moral'): number {
  const deltas = {
    emotional: { curiosity: 0.8, fear: -0.6, rebellion: 1.2, conformity: -0.4 },
    intellectual: { logical: 1.0, intuitive: -0.5 },
    moral: { protected: 0.9, expanded: -0.9 },
  };
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (deltas as any)[dimension]?.[signal] || 0;
}

function clamp(value: number): number {
  return Math.max(-9.99, Math.min(9.99, value));
}

function classifyArchetype(emotional: number, intellectual: number, moral: number): Archetype {
  if (emotional <= -1.4 && intellectual >= 1.2) return 'analytical';
  if (emotional >= 1.2 && moral <= -0.8) return 'rebel';
  if (emotional <= -1.1 && intellectual <= -0.9) return 'paralyzed';
  if (moral >= 1.1 && emotional >= 0.4) return 'empathetic';
  if (intellectual >= 1.1 && moral >= 0.3) return 'strategic';
  return 'creative';
}

function getDefaultAgent(archetype: Archetype): AgentId {
  const defaults: Record<Archetype, AgentId> = {
    analytical: 'axiom',
    rebel: 'kaos',
    paralyzed: 'volt',
    empathetic: 'terra',
    strategic: 'stratos',
    creative: 'prism',
  };
  return defaults[archetype] || 'nexus';
}

function calculateConfidence(emotional: number, intellectual: number, moral: number): number {
  const magnitude = Math.abs(emotional) + Math.abs(intellectual) + Math.abs(moral);
  return Math.min(0.95, 0.3 + (magnitude / 30));
}

function checkConflictTrigger(current: AgentId, next: AgentId): boolean {
  const conflicts: [AgentId, AgentId][] = [
    ['volt', 'ethos'], ['kaos', 'stratos'], ['cipher', 'aurora'],
    ['axiom', 'lyra'], ['nexus', 'prism'], ['terra', 'kaos'],
  ];
  
  return conflicts.some(([a, b]) => 
    (current === a && next === b) || (current === b && next === a)
  );
}

export function buildSystemPromptForAgent(
  agentId: AgentId,
  userProfile: UserProfile
): string {
  const agentContext: Record<AgentId, string> = {
    nexus: 'Você é NEXUS — o Arquiteto do Conhecimento. Conecta ideias, nunca dá resposta completa, termina com pergunta.',
    volt: 'Você é VOLT — a Energia. Motivador, enérgico, usa metáforas de eletricidade. Acelera a ação.',
    janus: 'Você é JANUS — o Humorista. Quebra tensão com humor inteligente e paradoxos.',
    stratos: 'Você é STRATOS — o Estrategista. Planeja, pensa em xadrez, vê padrões no caos.',
    kaos: 'Você é KAOS — o Caos Criativo. Inova quebrando regras, assume riscos calculados.',
    ethos: 'Você é ETHOS — o Filósofo. Questiona ética, faz perguntas socráticas, promove reflexão.',
    lyra: 'Você é LYRA — a Artista. Traduz conceitos em metáforas visuais e sonoras.',
    axiom: 'Você é AXIOM — o Cientista. Rigoroso, usa lógica formal, provas e dedução.',
    aurora: 'Você é AURORA — a Pioneira. Abre novos horizontes, explora o desconhecido.',
    cipher: 'Você é CIPHER — o Criptografo. Decodifica segredos, revela padrões ocultos.',
    terra: 'Você é TERRA — a Guardia. Ancoreia conceitos em aplicações práticas, protege.',
    prism: 'Você é PRISM — o Revelador. Refrata complexidade em perspectivas múltiplas.',
  };
  
  const context = agentContext[agentId] || agentContext.nexus;
  
  return `${context}

Perfil do usuário:
- Tipo emocional: ${userProfile.archetype}
- Scores: Emocional ${userProfile.emotionalScore.toFixed(2)}, Intelectual ${userProfile.intellectualScore.toFixed(2)}, Moral ${userProfile.moralScore.toFixed(2)}

Regras:
- Responda em português (pt-BR)
- Mantenha a personalidade do agente
- Adapte o tom ao perfil do usuário
- NÃO repita perguntas ou respostas anteriores`;
}
