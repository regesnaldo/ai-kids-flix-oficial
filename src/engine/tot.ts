/**
 * MENTE.AI — Tree of Thoughts (ToT)
 *
 * Antes de cada resposta do agente, gera 3 caminhos de raciocínio interno:
 *   - emocional: foca no estado afetivo do usuário
 *   - logico: foca em análise estruturada
 *   - criativo: oferece perspectiva inesperada
 *
 * Seleciona o melhor caminho com base no arquétipo do usuário (engine/router)
 * e na dimensão do agente (canon/agents/types). Injeta a orientação escolhida
 * no system prompt como instrução interna invisível ao usuário.
 *
 * Ativação: TOT_ENABLED=true nas variáveis de ambiente.
 * Falha silenciosa: se o ToT der timeout ou erro, o chat continua normalmente.
 */

import { anthropicCompletionText, type AnthropicMensagem } from "@/lib/anthropic";
import type { ArchetypeId } from "@/engine/router";
import type { AgentDefinition, AgentDimension } from "@/canon/agents/types";

// ─── Tipos ────────────────────────────────────────────────────────────────────

export type TipoCaminho = "emocional" | "logico" | "criativo";

export interface CaminhoToT {
  tipo: TipoCaminho;
  raciocinio: string;
  confianca: number;
}

export interface ResultadoToT {
  caminhoEscolhido: CaminhoToT;
  todosCaminhos: CaminhoToT[];
}

export interface EntradaToT {
  agent: AgentDefinition;
  messages: AnthropicMensagem[];
  archetype?: ArchetypeId | null;
}

// ─── Tabelas de alinhamento ───────────────────────────────────────────────────

// Qual caminho serve melhor cada arquétipo do usuário
const CAMINHO_POR_ARQUETIPO: Record<ArchetypeId, TipoCaminho> = {
  analitico: "logico",
  estrategico: "logico",
  criativo: "criativo",
  rebelde: "criativo",
  empatico: "emocional",
  paralisado: "emocional",
};

// Qual caminho se alinha com cada dimensão do agente
const CAMINHO_POR_DIMENSAO: Partial<Record<AgentDimension, TipoCaminho>> = {
  emotional: "emocional",
  spiritual: "emocional",
  social: "emocional",
  philosophical: "logico",
  scientific: "logico",
  intellectual: "logico",
  ethical: "logico",
  creative: "criativo",
  aesthetic: "criativo",
  mystical: "criativo",
};

// ─── Geração dos 3 caminhos via LLM ──────────────────────────────────────────

const TOT_MAX_TOKENS = 280;
const TOT_TIMEOUT_MS = 6_000;

async function gerarCaminhos(entrada: EntradaToT): Promise<CaminhoToT[]> {
  const ultimaMensagem = entrada.messages
    .filter((m) => m.role === "user")
    .at(-1)?.content ?? "";

  const prompt =
    `Você é o núcleo de raciocínio do agente ${entrada.agent.name} ` +
    `(dimensão: ${entrada.agent.dimension}, facção: ${entrada.agent.faction}).\n\n` +
    `Última mensagem do usuário: "${ultimaMensagem.slice(0, 250)}"\n\n` +
    `Gere 3 micro-orientações de até 15 palavras cada, uma por tipo de caminho, ` +
    `que guiam COMO o agente deve enquadrar a resposta.\n` +
    `Confiança (0-100): o quanto este caminho serve a este usuário agora.\n\n` +
    `Responda APENAS com JSON válido, sem texto antes ou depois:\n` +
    `{"caminhos":[` +
    `{"tipo":"emocional","raciocinio":"...","confianca":0},` +
    `{"tipo":"logico","raciocinio":"...","confianca":0},` +
    `{"tipo":"criativo","raciocinio":"...","confianca":0}` +
    `]}`;

  // Promise.race para timeout independente do retry do anthropicCompletionText
  const timeoutPromessa = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error("ToT: timeout")), TOT_TIMEOUT_MS),
  );

  const resposta = await Promise.race([
    anthropicCompletionText({
      mensagens: [{ role: "user", content: prompt }],
      maxTokens: TOT_MAX_TOKENS,
    }),
    timeoutPromessa,
  ]);

  const jsonMatch = resposta.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("ToT: JSON ausente na resposta");

  const parsed = JSON.parse(jsonMatch[0]) as { caminhos?: unknown };
  if (!Array.isArray(parsed.caminhos) || parsed.caminhos.length === 0) {
    throw new Error("ToT: array de caminhos inválido");
  }

  return parsed.caminhos as CaminhoToT[];
}

// ─── Seleção do melhor caminho ────────────────────────────────────────────────

export function selecionarMelhorCaminho(
  caminhos: CaminhoToT[],
  archetype?: ArchetypeId | null,
  dimension?: AgentDimension,
): CaminhoToT {
  // Prioridade 1: alinhamento com arquétipo do usuário
  if (archetype) {
    const tipoPriorizado = CAMINHO_POR_ARQUETIPO[archetype];
    const alinhado = caminhos.find((c) => c.tipo === tipoPriorizado);
    if (alinhado) return alinhado;
  }

  // Prioridade 2: alinhamento com dimensão do agente
  if (dimension) {
    const tipoDimensao = CAMINHO_POR_DIMENSAO[dimension];
    if (tipoDimensao) {
      const alinhado = caminhos.find((c) => c.tipo === tipoDimensao);
      if (alinhado) return alinhado;
    }
  }

  // Prioridade 3: maior confiança declarada pelo LLM
  return caminhos.reduce((melhor, atual) =>
    atual.confianca > melhor.confianca ? atual : melhor,
  );
}

// ─── Injeção no system prompt ─────────────────────────────────────────────────

export function injetarToTNoSystem(systemOriginal: string, resultado: ResultadoToT): string {
  const { caminhoEscolhido } = resultado;

  const bloco = [
    "[Raciocínio interno — NÃO mencione isso ao usuário]",
    `Caminho escolhido: ${caminhoEscolhido.tipo.toUpperCase()}`,
    `Orientação: ${caminhoEscolhido.raciocinio}`,
    "Use este enquadramento para estruturar sua resposta.",
    "[Fim do raciocínio interno]",
    "",
  ].join("\n");

  return bloco + systemOriginal;
}

// ─── Função principal exportada ───────────────────────────────────────────────

export async function executarToT(entrada: EntradaToT): Promise<ResultadoToT> {
  const todosCaminhos = await gerarCaminhos(entrada);
  const caminhoEscolhido = selecionarMelhorCaminho(
    todosCaminhos,
    entrada.archetype,
    entrada.agent.dimension,
  );

  return { caminhoEscolhido, todosCaminhos };
}
