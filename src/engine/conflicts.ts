export type AgentId =
  | "nexus" | "volt" | "aurora" | "ethos" | "kaos"
  | "cipher" | "lyra" | "axiom" | "stratos" | "terra" | "prism" | "janus"

export interface Conflict {
  agents: [AgentId, AgentId]
  nature: string
  triggerKeywords: string[]
  narrativeWeight: number
}

export const AGENT_CONFLICTS: Conflict[] = [
  {
    agents: ["volt", "ethos"],
    nature: "urgencia vs responsabilidade",
    triggerKeywords: ["agir", "esperar", "rapido", "consequencia", "risco", "decidir"],
    narrativeWeight: 9,
  },
  {
    agents: ["kaos", "stratos"],
    nature: "disrupcao vs planejamento",
    triggerKeywords: ["sistema", "plano", "destruir", "construir", "ordem", "caos", "estrategia"],
    narrativeWeight: 8,
  },
  {
    agents: ["cipher", "aurora"],
    nature: "controle vs abertura",
    triggerKeywords: ["segredo", "compartilhar", "oculto", "transparencia", "poder", "informacao"],
    narrativeWeight: 7,
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
