/**
 * semantic-memory.ts — Motor de busca semântica local (TF-IDF + Cosine Similarity).
 *
 * Funciona SEM dependências externas (sem OpenAI embeddings, sem pgvector).
 * Fornece matching semântico real usando vetorização TF-IDF e similaridade
 * de cosseno entre a query do usuário e as memórias armazenadas.
 *
 * ARQUITETURA DE EVOLUÇÃO:
 *   Quando pgvector + OpenAI embeddings estiverem disponíveis:
 *   1. Adicionar coluna `embedding VECTOR(1536)` no schema
 *   2. Substituir `vectorize()` por `openai.embeddings.create()`
 *   3. Substituir `cosineSimilarity()` por `<=>` operator do pgvector
 *   → A API pública (`findSemanticMatches`) não muda.
 */

import type { AgentMemory } from "@/lib/db/schema";

// ─── Stopwords em Português ───────────────────────────────────────────────────

const STOPWORDS = new Set([
  "o", "a", "os", "as", "um", "uma", "uns", "umas",
  "de", "do", "da", "dos", "das", "no", "na", "nos", "nas",
  "em", "por", "para", "com", "sem", "sob", "sobre",
  "é", "são", "foi", "foram", "ser", "estar", "está", "estão",
  "que", "se", "não", "mais", "como", "mas", "ou", "quando",
  "muito", "também", "já", "ainda", "assim", "então",
  "ele", "ela", "eles", "elas", "eu", "você", "nós", "me", "te",
  "isso", "isto", "aquele", "aquela", "esse", "essa",
  "the", "a", "an", "is", "are", "was", "were", "be", "been",
  "of", "in", "to", "for", "with", "on", "at", "by", "from",
  "and", "or", "but", "not", "this", "that", "it", "its",
]);

// ─── Stemming simples (Português) ─────────────────────────────────────────────

const SUFFIXES = ["ções", "ções", "mente", "inho", "inha", "ão", "ões",
  "ado", "ido", "ando", "endo", "indo", "ava", "eva", "ia",
  "os", "as", "es", "is", "us", "ei", "ou", "iu"];

function stem(word: string): string {
  let w = word.toLowerCase();
  for (const suffix of SUFFIXES) {
    if (w.endsWith(suffix) && w.length - suffix.length >= 3) {
      w = w.slice(0, -suffix.length);
      break;
    }
  }
  // Remove plural simples
  if (w.endsWith("s") && w.length > 3 && !w.endsWith("ss")) {
    w = w.slice(0, -1);
  }
  return w;
}

// ─── Tokenização ──────────────────────────────────────────────────────────────

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-záàâãéêíóôõúüç0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length >= 2 && !STOPWORDS.has(t))
    .map(stem);
}

// ─── TF-IDF Vectorization ─────────────────────────────────────────────────────

interface TfIdfVector {
  terms: Map<string, number>; // term → tf-idf weight
  magnitude: number;
}

/**
 * Constroi vetor TF-IDF para um texto.
 * TF = frequência do termo / total de termos
 * IDF = log(N / df) — aproximado com pesos locais
 */
function vectorize(text: string): TfIdfVector {
  const tokens = tokenize(text);
  if (tokens.length === 0) return { terms: new Map(), magnitude: 0 };

  // TF: frequência normalizada
  const tf = new Map<string, number>();
  for (const t of tokens) {
    tf.set(t, (tf.get(t) ?? 0) + 1);
  }

  // Normaliza TF e aplica peso logarítmico (IDF aproximado)
  const terms = new Map<string, number>();
  let sumSquares = 0;
  const n = tokens.length;

  for (const [term, count] of tf) {
    // TF normalizado × log-weight (favorece termos raros)
    const weight = (count / n) * Math.log(1 + n / count);
    terms.set(term, weight);
    sumSquares += weight * weight;
  }

  return {
    terms,
    magnitude: Math.sqrt(sumSquares),
  };
}

// ─── Cosine Similarity ────────────────────────────────────────────────────────

function cosineSimilarity(a: TfIdfVector, b: TfIdfVector): number {
  if (a.magnitude === 0 || b.magnitude === 0) return 0;

  let dotProduct = 0;
  for (const [term, weightA] of a.terms) {
    const weightB = b.terms.get(term) ?? 0;
    dotProduct += weightA * weightB;
  }

  return dotProduct / (a.magnitude * b.magnitude);
}

// ─── Semantic Search API ──────────────────────────────────────────────────────

export interface SemanticMatch {
  memory: AgentMemory;
  score: number; // 0..1 — cosine similarity
}

/**
 * Busca as memórias mais semanticamente similares à query.
 *
 * @param query     Texto da mensagem do usuário
 * @param memories  Pool de memórias para buscar
 * @param topK      Quantas retornar
 * @param minScore  Score mínimo de similaridade (0..1)
 */
export function findSemanticMatches(
  query: string,
  memories: AgentMemory[],
  topK: number = 5,
  minScore: number = 0.05,
): SemanticMatch[] {
  if (!query.trim() || memories.length === 0) return [];

  const queryVector = vectorize(query);
  if (queryVector.magnitude === 0) return [];

  const scored: SemanticMatch[] = [];

  for (const memory of memories) {
    const memoryVector = vectorize(memory.content);
    const score = cosineSimilarity(queryVector, memoryVector);

    if (score >= minScore) {
      scored.push({ memory, score });
    }
  }

  // Ordena por score decrescente e retorna topK
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}

/**
 * Retorna uma string resumida dos matches para debug/logging.
 */
export function formatSemanticResults(matches: SemanticMatch[]): string {
  if (matches.length === 0) return "Nenhum match semântico encontrado.";
  return matches
    .map(
      (m, i) =>
        `  ${i + 1}. [${(m.score * 100).toFixed(0)}%] ${m.memory.content.slice(0, 80)}`,
    )
    .join("\n");
}

/**
 * Cache de vetores para evitar recomputação em buscas repetidas.
 * Armazena até 500 vetores; limpeza LRU simples.
 */
const vectorCache = new Map<string, TfIdfVector>();
const MAX_CACHE_SIZE = 500;

export function getCachedVector(text: string): TfIdfVector {
  const key = text.slice(0, 100);
  let cached = vectorCache.get(key);
  if (!cached) {
    cached = vectorize(text);
    if (vectorCache.size >= MAX_CACHE_SIZE) {
      // Remove entrada mais antiga (primeira do Map)
      const first = vectorCache.keys().next().value;
      if (first) vectorCache.delete(first);
    }
    vectorCache.set(key, cached);
  }
  return cached;
}

/** Limpa o cache de vetores (útil para testes) */
export function clearVectorCache(): void {
  vectorCache.clear();
}
