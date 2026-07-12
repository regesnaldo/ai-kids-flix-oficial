// ═══════════════════════════════════════════════════════════════════════════
// COGNITIVE CANON — Barrel re-export
// ═══════════════════════════════════════════════════════════════════════════
// Tipos e agentes individuais vivem em arquivos separados:
//   canon-types.ts  — AgentId, AGENT_ORDER, AgentDefinition, etc.
//   nexus.ts        — NEXUS_PROMPT + const NEXUS
//   cipher.ts       — CIPHER_PROMPT + const CIPHER
//   ...
//   janus.ts        — JANUS_PROMPT + const JANUS
//
// Este arquivo re-exporta tudo de forma 100% compatível com os 10 importadores
// existentes. Nenhum consumidor externo precisa ser alterado.

// ── Types ────────────────────────────────────────────────────────────
export type {
  AgentId,
  AgentIdentity,
  AgentCognition,
  AgentRelationships,
  AgentDefinition,
} from './canon-types'
export { AGENT_ORDER } from './canon-types'

// ── Agents ───────────────────────────────────────────────────────────
export { NEXUS, NEXUS_PROMPT } from './nexus'
export { CIPHER, CIPHER_PROMPT } from './cipher'
export { KAOS, KAOS_PROMPT } from './kaos'
export { AURORA, AURORA_PROMPT } from './aurora'
export { VOLT, VOLT_PROMPT } from './volt'
export { ETHOS, ETHOS_PROMPT } from './ethos'
export { LYRA, LYRA_PROMPT } from './lyra'
export { AXIOM, AXIOM_PROMPT } from './axiom'
export { STRATOS, STRATOS_PROMPT } from './stratos'
export { TERRA, TERRA_PROMPT } from './terra'
export { PRISM, PRISM_PROMPT } from './prism'
export { JANUS, JANUS_PROMPT } from './janus'

// ── Aggregated (backward-compatible) ─────────────────────────────────
import { NEXUS } from './nexus'
import { CIPHER } from './cipher'
import { KAOS } from './kaos'
import { AURORA } from './aurora'
import { VOLT } from './volt'
import { ETHOS } from './ethos'
import { LYRA } from './lyra'
import { AXIOM } from './axiom'
import { STRATOS } from './stratos'
import { TERRA } from './terra'
import { PRISM } from './prism'
import { JANUS } from './janus'

import { NEXUS_PROMPT } from './nexus'
import { CIPHER_PROMPT } from './cipher'
import { KAOS_PROMPT } from './kaos'
import { AURORA_PROMPT } from './aurora'
import { VOLT_PROMPT } from './volt'
import { ETHOS_PROMPT } from './ethos'
import { LYRA_PROMPT } from './lyra'
import { AXIOM_PROMPT } from './axiom'
import { STRATOS_PROMPT } from './stratos'
import { TERRA_PROMPT } from './terra'
import { PRISM_PROMPT } from './prism'
import { JANUS_PROMPT } from './janus'

import type { AgentId } from './canon-types'
import type { AgentDefinition } from './canon-types'

export const AGENTS: Record<AgentId, AgentDefinition> = {
  nexus: NEXUS,
  cipher: CIPHER,
  kaos: KAOS,
  aurora: AURORA,
  volt: VOLT,
  ethos: ETHOS,
  lyra: LYRA,
  axiom: AXIOM,
  stratos: STRATOS,
  terra: TERRA,
  prism: PRISM,
  janus: JANUS,
}

export const AGENT_PROMPTS: Record<AgentId, string> = {
  nexus: NEXUS_PROMPT,
  cipher: CIPHER_PROMPT,
  kaos: KAOS_PROMPT,
  aurora: AURORA_PROMPT,
  volt: VOLT_PROMPT,
  ethos: ETHOS_PROMPT,
  lyra: LYRA_PROMPT,
  axiom: AXIOM_PROMPT,
  stratos: STRATOS_PROMPT,
  terra: TERRA_PROMPT,
  prism: PRISM_PROMPT,
  janus: JANUS_PROMPT,
}
