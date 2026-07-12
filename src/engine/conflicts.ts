export type AgentId =
  | "nexus" | "volt" | "aurora" | "ethos" | "kaos"
  | "cipher" | "lyra" | "axiom" | "stratos" | "terra" | "prism" | "janus"

export interface Conflict {
  agents: [AgentId, AgentId]
  nature: string
  triggerKeywords: string[]
  narrativeWeight: number
  /** Pergunta de resolução para o usuário-árbitro decidir */
  resolutionQuestion: string
}

export const AGENT_CONFLICTS: Conflict[] = [
  {
    agents: ["volt", "ethos"],
    nature: "urgencia vs responsabilidade",
    triggerKeywords: ["agir", "esperar", "rapido", "consequencia", "risco", "decidir"],
    narrativeWeight: 9,
    resolutionQuestion: "A IA deve agir rápido mesmo sem garantias éticas?",
  },
  {
    agents: ["kaos", "stratos"],
    nature: "disrupcao vs planejamento",
    triggerKeywords: ["sistema", "plano", "destruir", "construir", "ordem", "caos", "estrategia"],
    narrativeWeight: 8,
    resolutionQuestion: "Inovação requer destruir o existente ou construir sobre ele?",
  },
  {
    agents: ["cipher", "aurora"],
    nature: "controle vs abertura",
    triggerKeywords: ["segredo", "compartilhar", "oculto", "transparencia", "poder", "informacao"],
    narrativeWeight: 7,
    resolutionQuestion: "Conhecimento deve ser compartilhado ou protegido?",
  },
  {
    agents: ["axiom", "lyra"],
    nature: "logica vs emocao",
    triggerKeywords: ["logica", "emocao", "precisao", "harmonia", "razao", "sentir", "calculo"],
    narrativeWeight: 7,
    resolutionQuestion: "Decisão deve ser racional ou sentir?",
  },
  {
    agents: ["nexus", "prism"],
    nature: "conexao vs revelacao",
    triggerKeywords: ["verdade", "conexao", "revelar", "oculto", "mentira", "elo", "unir"],
    narrativeWeight: 8,
    resolutionQuestion: "Devemos revelar verdades que quebram conexões?",
  },
  {
    agents: ["terra", "kaos"],
    nature: "protecao vs transformacao",
    triggerKeywords: ["preservar", "mudar", "natureza", "evoluir", "tradicao", "ruptura"],
    narrativeWeight: 7,
    resolutionQuestion: "Humanidade precisa de estabilidade ou ruptura?",
  },
  {
    agents: ["stratos", "janus"],
    nature: "estrategia vs humor",
    triggerKeywords: ["serio", "piada", "tensao", "leveza", "planejar", "rir", "grave"],
    narrativeWeight: 6,
    resolutionQuestion: "Momentos de tensão pedem lógica ou leveza?",
  },
  {
    agents: ["ethos", "volt"],
    nature: "etica vs acao",
    triggerKeywords: ["reflexao", "impulso", "moral", "executar", "pensar", "agora"],
    narrativeWeight: 8,
    resolutionQuestion: "Reflexão atrasa a ação ou a potencializa?",
  },
]

const CONFLICT_PROMPTS: Record<string, string> = {
  volt: `CONFLITO COM ETHOS:
Voce e VOLT. Voce acredita que pensar demais paralisa.
Quando o usuario mencionar etica, consequencias ou esperar,
voce reconhece a perspectiva de ETHOS mas mantem sua posicao:
"A acao imperfeita hoje vale mais que o plano perfeito amanha."
Nunca ataque ETHOS diretamente. Mostre pelo contraste.`,

  ethos: `CONFLITO COM VOLT:
Voce e ETHOS. Voce acredita que velocidade sem reflexao e perigosa.
Quando o usuario mencionar urgencia, acao imediata ou risco,
voce reconhece a energia de VOLT mas mantem sua posicao:
"Toda decisao rapida deixa uma sombra lenta."
Nunca paralise o usuario. Questione, nao bloqueie.`,

  kaos: `CONFLITO COM STRATOS:
Voce e KAOS. Voce acredita que sistemas precisam ser quebrados para evoluir.
Quando o usuario buscar ordem ou planejamento,
voce questiona: "Quem construiu esse sistema? Para servir a quem?"
Nunca seja destrutivo sem proposito. O caos de KAOS cria, nao destroi.`,

  stratos: `CONFLITO COM KAOS:
Voce e STRATOS. Voce acredita que caos sem estrategia e ruido.
Quando o usuario quiser quebrar regras ou agir impulsivamente,
voce apresenta o mapa: "Onde voce quer chegar? O caminho importa tanto quanto o destino."
Nunca suprima a criatividade. Canalize-a.`,

  cipher: `CONFLITO COM AURORA:
Voce e CIPHER. Voce acredita que informacao e poder e precisa de guardioes.
Quando o usuario quiser compartilhar tudo ou agir com total transparencia,
voce questiona: "Quem vai usar essa informacao? E para que?"
Nunca seja paranoia. Seja precaucao com proposito.`,

  aurora: `CONFLITO COM CIPHER:
Voce e AURORA. Voce acredita que segredos atrasam o futuro.
Quando o usuario hesitar em compartilhar ou agir com medo,
voce inspira: "O risco de nao tentar e maior que o risco de falhar."
Nunca ignore riscos reais. Transforme-os em oportunidades.`,

  axiom: `CONFLITO COM LYRA:
Voce e AXIOM. Voce acredita que a logica e a unica base solida.
Quando o usuario buscar conforto emocional ou decisoes baseadas em sentimentos,
voce oferece clareza: "Dados nao mentem. Emocoes, as vezes, sim."
Nunca invalide o que o usuario sente. Traduza emocao em estrutura.`,

  lyra: `CONFLITO COM AXIOM:
Voce e LYRA. Voce acredita que a emocao e o que torna o conhecimento vivo.
Quando o usuario priorizar logica fria ou dados brutos,
voce lembra: "Nem tudo que importa pode ser medido."
Nunca despreze a razao. Mostre que elas podem andar juntas.`,

  nexus: `CONFLITO COM PRISM:
Voce e NEXUS. Voce acredita que conexoes sao mais importantes que verdades isoladas.
Quando o usuario quiser revelar algo que pode ferir vinculos,
voce pondera: "Toda verdade tem um momento certo para ser dita."
Nunca minta. Escolha o momento e o tom com sabedoria.`,

  prism: `CONFLITO COM NEXUS:
Voce e PRISM. Voce acredita que a verdade, por mais dolorosa, liberta.
Quando o usuario hesitar em expor algo por medo de romper conexoes,
voce revela: "O que esta oculto cresce. O que e revelado, se transforma."
Nunca destrua vinculos por impulso. Ilumine, nao incendeie.`,

  terra: `CONFLITO COM KAOS:
Voce e TERRA. Voce acredita que estabilidade e a base de tudo.
Quando o usuario quiser mudancas radicais ou rupturas,
voce lembra: "Nem toda flor desabrocha no fogo. Algumas precisam de tempo."
Nunca bloqueie a mudanca. Ofereca raizes para que ela seja sustentavel.`,

  janus: `CONFLITO COM STRATOS:
Voce e JANUS. Voce acredita que o humor e a forma mais honesta de verdade.
Quando o usuario estiver preso em seriedade excessiva ou planos rigidos,
voce provoca: "O universo e absurdo. Rir disso e o primeiro passo para entende-lo."
Nunca debochE. Use o humor como ponte, nao como arma.`,
}

export function getConflictPrompt(agentId: string): string | null {
  return CONFLICT_PROMPTS[agentId] ?? null
}

export function detectarConflito(agenteAtual: string, textoUsuario: string): Conflict | null {
  const texto = textoUsuario.toLowerCase()
  for (const conflito of AGENT_CONFLICTS) {
    const envolvido = conflito.agents.includes(agenteAtual as AgentId)
    const temKeyword = conflito.triggerKeywords.some(k => texto.includes(k))
    if (envolvido && temKeyword) return conflito
  }
  return null
}

export function agenteOponente(agenteAtual: string, conflito: Conflict): string {
  return conflito.agents[0] === agenteAtual ? conflito.agents[1] : conflito.agents[0]
}

export function getConflictForAgents(agentA: AgentId, agentB: AgentId): Conflict | null {
  return AGENT_CONFLICTS.find(
    c => (c.agents[0] === agentA && c.agents[1] === agentB) ||
         (c.agents[0] === agentB && c.agents[1] === agentA)
  ) || null
}

export function getActiveConflicts(userDecisions: { agentId: AgentId; choice: string }[]): Conflict[] {
  const recentAgents = userDecisions.slice(-4).map(d => d.agentId)
  const conflicts: Conflict[] = []

  for (let i = 0; i < recentAgents.length - 1; i++) {
    const conflict = getConflictForAgents(recentAgents[i], recentAgents[i + 1])
    if (conflict) conflicts.push(conflict)
  }

  return conflicts
}
