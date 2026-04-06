/**
 * conflitos.ts — Conflitos narrativos centrais do metaverso MENTE.AI
 *
 * Conflitos são tensões narrativas que enriquecem a experiência.
 * NEXUS observa todos sem tomar partido — só intervém quando necessário.
 */

import type { ConflitoNarrativo } from "@/types/conflito";

export const CONFLITOS: ConflitoNarrativo[] = [
  {
    id: "volt-vs-ethos",
    agente1: "volt",
    agente2: "ethos",
    titulo: "Ação vs Prudência",
    descricao: "VOLT quer agir agora; ETHOS pede responsabilidade e reflexão ética.",
    premissa:
      "VOLT quer agir agora — a energia é tudo. ETHOS exige que cada passo seja examinado moralmente antes.",
    argumentoAgente1:
      'VOLT: "A inação também é uma escolha — e muitas vezes é a pior delas. Agir é o único jeito de aprender."',
    argumentoAgente2:
      'ETHOS: "A ação sem reflexão pode produzir danos irreversíveis. Nem todo avanço é progresso."',
    resolucaoNexus:
      'NEXUS pergunta: "O que você perderia se esperasse 24 horas? O que você perderia se não esperasse?"',
  },
  {
    id: "kaos-vs-stratos",
    agente1: "kaos",
    agente2: "stratos",
    titulo: "Criatividade vs Estrutura",
    descricao: "KAOS quer romper padrões; STRATOS quer método e previsibilidade.",
    premissa:
      "KAOS acredita que ideias nascem no improviso. STRATOS argumenta que sem estrutura não há escala.",
    argumentoAgente1:
      'KAOS: "Plano demais mata o inesperado. Sem risco, você repete o passado com nova embalagem."',
    argumentoAgente2:
      'STRATOS: "Sem critérios, você não sabe por que funcionou — e não consegue repetir o sucesso."',
    resolucaoNexus:
      'NEXUS revela: "E se a estrutura pudesse criar espaço controlado para o caos? E se o caos pudesse revelar os limites da estrutura?"',
  },
  {
    id: "cipher-vs-aurora",
    agente1: "cipher",
    agente2: "aurora",
    titulo: "Evidência vs Intuição",
    descricao: "CIPHER exige prova; AURORA aposta em visão e transformação.",
    premissa:
      "CIPHER quer evidências verificáveis. AURORA diz que grandes mudanças começam antes da prova perfeita.",
    argumentoAgente1:
      'CIPHER: "Sem dados consistentes, você está apostando. E apostas cegas cobram caro."',
    argumentoAgente2:
      'AURORA: "Se esperar certeza absoluta, o futuro chega sem você. Mudança também exige coragem."',
    resolucaoNexus:
      'NEXUS questiona: "Quem decide quando alguém está pronto? E quem paga o preço quando essa decisão está errada?"',
  },
];

export function getConflitoById(id: string): ConflitoNarrativo | undefined {
  return CONFLITOS.find((c) => c.id === id);
}

export function getConflitoPorAgentes(agente1: string, agente2: string): ConflitoNarrativo | null {
  const a = agente1.toLowerCase();
  const b = agente2.toLowerCase();
  return (
    CONFLITOS.find(
      (c) =>
        (c.agente1 === a && c.agente2 === b) ||
        (c.agente1 === b && c.agente2 === a),
    ) ?? null
  );
}

/** Verifica se NEXUS deve intervir (conflito não resolvido após X interações) */
export function deveNexusIntervir(interacoesSemResolucao: number, limite = 3): boolean {
  return interacoesSemResolucao >= limite;
}

