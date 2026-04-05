// Tipos Canônicos do Universo MENTE.AI
// Baseado na Bíblia Cinematográfica Oficial

export type CanonDimension =
  | "philosophical"    // Reino Filosófico Grego (98 agentes)
  | "cinematic"        // Reino Cinematográfico Sci-Fi (15 agentes)
  | "interface"        // Agentes Funcionais de Interface (5 agentes)
  | "narrative";       // Agentes Narrativos de Temporada (2 agentes)

export type CanonFaction =
  | "order"            // FACÇÃO DA ORDEM: COSMOS, DIKHE, ATLAS, HARMONIA
  | "chaos"            // FACÇÃO DO CAOS: CHAOS, KAOS, EROS, TYCHE
  | "balance";         // GUARDIÕES DO EQUILÍBRIO: SOPHIA, METIS, AION

export type CanonLevel =
  | "primordial"       // Nível 6: Primordiais (9 agentes) - Seasons 11-12
  | "titan"            // Nível 5: Titãs Cognitivos (15 agentes) - Seasons 9-10
  | "architect"        // Nível 4: Arquitetos (18 agentes) - Seasons 7-8
  | "guardian"         // Nível 3: Guardiões (23 agentes) - Seasons 5-6
  | "explorer"         // Nível 2: Exploradores (27 agentes) - Seasons 3-4
  | "operator";        // Nível 1: Operadores (27 agentes) - Seasons 1-2

export interface CanonAgent {
  name: string;
  dimension: CanonDimension;
  level: CanonLevel;
  faction: CanonFaction;
  season: number;           // Temporada de estreia (1-12)
  minUserLevel: number;     // Nível mínimo do usuário para desbloquear (1-6)
  narrativeRole: string;    // Papel na narrativa cinematográfica
  greekArchetype?: string;  // Agente grego original (para projeções sci-fi)
}
