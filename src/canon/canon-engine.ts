// Motor Canônico do Universo MENTE.AI
// Sistema de consulta e gerenciamento da narrativa cinematográfica

import type { CanonAgent, CanonDimension, CanonFaction, CanonLevel } from './canon-agents';
import { 
  CANON_DATABASE, 
  getCanonAgent as getAgentFromDB,
  getAgentsBySeason as getAgentsBySeasonFromDB,
  getAgentsByFaction as getAgentsByFactionFromDB,
  getAgentsByLevel as getAgentsByLevelFromDB,
  getUnlockedAgents as getUnlockedAgentsFromDB
} from './canon-database';

// ==================== CONSULTAS PRIMÁRIAS ====================

/**
 * Obtém informações canônicas completas de um agente
 * @param name - Nome do agente (ex: "LOGOS", "ETHOS")
 * @returns Dados canônicos completos ou null se não existir
 */
export function getCanonAgent(name: string): CanonAgent | null {
  return getAgentFromDB(name);
}

/**
 * Verifica se um agente existe no canon oficial
 * @param name - Nome do agente
 * @returns true se o agente está no canon
 */
export function hasCanonAgent(name: string): boolean {
  return getAgentFromDB(name) !== null;
}

// ==================== FILTROS POR TEMPORADA ====================

/**
 * Obtém todos os agentes de uma temporada específica
 * @param season - Número da temporada (1-12)
 * @returns Array de agentes da temporada
 */
export function getAgentsBySeason(season: number): CanonAgent[] {
  if (season < 1 || season > 12) {
    throw new Error(`Temporada inválida: ${season}. Use 1-12.`);
  }
  return getAgentsBySeasonFromDB(season);
}

/**
 * Obtém agentes que estreiam em até determinada temporada
 * @param maxSeason - Temporada máxima
 * @returns Array de agentes disponíveis até aquela temporada
 */
export function getAgentsUpToSeason(maxSeason: number): CanonAgent[] {
  if (maxSeason < 1 || maxSeason > 12) {
    throw new Error(`Temporada inválida: ${maxSeason}. Use 1-12.`);
  }
  return CANON_DATABASE.filter(agent => agent.season <= maxSeason);
}

// ==================== FILTROS POR FACÇÃO ====================

/**
 * Obtém todos os agentes de uma facção
 * @param faction - Facção ("order", "chaos", "balance")
 * @returns Array de agentes da facção
 */
export function getAgentsByFaction(faction: CanonFaction): CanonAgent[] {
  return getAgentsByFactionFromDB(faction);
}

/**
 * Obtém líderes de cada facção
 * @param faction - Facção alvo
 * @returns Líderes da facção (agentes de nível primordial/titan)
 */
export function getFactionLeaders(faction: CanonFaction): CanonAgent[] {
  const agents = getAgentsByFaction(faction);
  return agents.filter(agent => 
    agent.level === 'primordial' || agent.level === 'titan'
  );
}

/**
 * Verifica equilíbrio de forças entre facções
 * @returns Contagem de agentes por facção
 */
export function getFactionBalance(): Record<CanonFaction, number> {
  const balance: Record<CanonFaction, number> = {
    order: 0,
    chaos: 0,
    balance: 0
  };
  
  CANON_DATABASE.forEach(agent => {
    balance[agent.faction]++;
  });
  
  return balance;
}

// ==================== FILTROS POR NÍVEL HIERÁRQUICO ====================

/**
 * Obtém todos os agentes de um nível hierárquico
 * @param level - Nível hierárquico
 * @returns Array de agentes do nível
 */
export function getAgentsByLevel(level: CanonLevel): CanonAgent[] {
  return getAgentsByLevelFromDB(level);
}

/**
 * Obtém agentes de nível igual ou superior ao especificado
 * @param minLevel - Nível mínimo
 * @returns Array de agentes do nível para cima
 */
export function getAgentsFromLevel(minLevel: CanonLevel): CanonAgent[] {
  const levelOrder: CanonLevel[] = [
    'operator',
    'explorer',
    'guardian',
    'architect',
    'titan',
    'primordial'
  ];
  
  const minIndex = levelOrder.indexOf(minLevel);
  if (minIndex === -1) {
    throw new Error(`Nível inválido: ${minLevel}`);
  }
  
  return CANON_DATABASE.filter(agent => {
    const agentIndex = levelOrder.indexOf(agent.level);
    return agentIndex >= minIndex;
  });
}

// ==================== SISTEMA DE PROGRESSÃO DO USUÁRIO ====================

/**
 * Obtém agentes desbloqueados para o nível do usuário
 * @param userLevel - Nível do usuário (1-6)
 * @returns Array de agentes disponíveis
 */
export function getUnlockedAgents(userLevel: number): CanonAgent[] {
  if (userLevel < 1 || userLevel > 6) {
    throw new Error(`Nível de usuário inválido: ${userLevel}. Use 1-6.`);
  }
  return getUnlockedAgentsFromDB(userLevel);
}

/**
 * Verifica se um usuário pode acessar determinado agente
 * @param agentName - Nome do agente
 * @param userLevel - Nível do usuário
 * @returns true se o usuário tem acesso
 */
export function canUserAccessAgent(agentName: string, userLevel: number): boolean {
  const agent = getAgentFromDB(agentName);
  if (!agent) return false;
  
  return agent.minUserLevel <= userLevel;
}

/**
 * Calcula porcentagem de progresso do usuário
 * @param userLevel - Nível atual do usuário
 * @returns Porcentagem de agentes desbloqueados (0-100)
 */
export function getUserProgressPercentage(userLevel: number): number {
  const unlocked = getUnlockedAgents(userLevel).length;
  const total = CANON_DATABASE.length;
  return Math.round((unlocked / total) * 100);
}

// ==================== CONSULTAS POR DIMENSÃO ====================

/**
 * Obtém agentes por dimensão de realidade
 * @param dimension - Dimensão ("philosophical", "cinematic", "interface", "narrative")
 * @returns Array de agentes da dimensão
 */
export function getAgentsByDimension(dimension: CanonDimension): CanonAgent[] {
  return CANON_DATABASE.filter(agent => agent.dimension === dimension);
}

/**
 * Obtém apenas agentes filosóficos gregos originais
 * @returns Agentes do reino filosófico
 */
export function getPhilosophicalAgents(): CanonAgent[] {
  return getAgentsByDimension('philosophical');
}

/**
 * Obtém apenas agentes cinematográficos sci-fi
 * @returns Projeções holográficas do futuro
 */
export function getCinematicAgents(): CanonAgent[] {
  return getAgentsByDimension('cinematic');
}

/**
 * Obtém agentes funcionais de interface (pontes dimensionais)
 * @returns Agentes que conectam as duas realidades
 */
export function getInterfaceAgents(): CanonAgent[] {
  return getAgentsByDimension('interface');
}

/**
 * Obtém agentes narrativos de temporadas
 * @returns Personagens com arcos sazonais
 */
export function getNarrativeAgents(): CanonAgent[] {
  return getAgentsByDimension('narrative');
}

// ==================== SISTEMA DE BUSCA AVANÇADA ====================

export interface AgentSearchFilters {
  dimension?: CanonDimension;
  level?: CanonLevel;
  faction?: CanonFaction;
  season?: number;
  minUserLevel?: number;
  searchQuery?: string; // Busca textual no nome ou narrativeRole
}

/**
 * Busca avançada com múltiplos filtros
 * @param filters - Objeto com filtros opcionais
 * @returns Agentes que correspondem aos critérios
 */
export function searchAgents(filters: AgentSearchFilters = {}): CanonAgent[] {
  return CANON_DATABASE.filter(agent => {
    if (filters.dimension && agent.dimension !== filters.dimension) return false;
    if (filters.level && agent.level !== filters.level) return false;
    if (filters.faction && agent.faction !== filters.faction) return false;
    if (filters.season && agent.season !== filters.season) return false;
    if (filters.minUserLevel && agent.minUserLevel < filters.minUserLevel) return false;
    
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      const matchesName = agent.name.toLowerCase().includes(query);
      const matchesRole = agent.narrativeRole.toLowerCase().includes(query);
      if (!matchesName && !matchesRole) return false;
    }
    
    return true;
  });
}

// ==================== ESTATÍSTICAS CANÔNICAS ====================

/**
 * Gera relatório estatístico completo do canon
 * @returns Objeto com contagens e distribuições
 */
export function getCanonStatistics() {
  const byDimension = {
    philosophical: getAgentsByDimension('philosophical').length,
    cinematic: getAgentsByDimension('cinematic').length,
    interface: getAgentsByDimension('interface').length,
    narrative: getAgentsByDimension('narrative').length
  };
  
  const byFaction = getFactionBalance();
  
  const byLevel: Record<CanonLevel, number> = {
    primordial: getAgentsByLevel('primordial').length,
    titan: getAgentsByLevel('titan').length,
    architect: getAgentsByLevel('architect').length,
    guardian: getAgentsByLevel('guardian').length,
    explorer: getAgentsByLevel('explorer').length,
    operator: getAgentsByLevel('operator').length
  };
  
  const bySeason: Record<number, number> = {};
  for (let i = 1; i <= 12; i++) {
    bySeason[i] = getAgentsBySeason(i).length;
  }
  
  return {
    totalAgents: CANON_DATABASE.length,
    byDimension,
    byFaction,
    byLevel,
    bySeason
  };
}

/**
 * Verifica integridade do canon (validações internas)
 * @returns Relatório de validação
 */
export function validateCanonIntegrity(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Validação 1: Todos os agentes devem ter nome único
  const names = CANON_DATABASE.map(a => a.name);
  const duplicates = names.filter((name, index) => names.indexOf(name) !== index);
  if (duplicates.length > 0) {
    errors.push(`Nomes duplicados encontrados: ${duplicates.join(', ')}`);
  }
  
  // Validação 2: Temporadas devem estar entre 1-12
  const invalidSeasons = CANON_DATABASE.filter(a => a.season < 1 || a.season > 12);
  if (invalidSeasons.length > 0) {
    errors.push(`Agentes com temporadas inválidas: ${invalidSeasons.map(a => a.name).join(', ')}`);
  }
  
  // Validação 3: Níveis de usuário devem estar entre 1-6
  const invalidLevels = CANON_DATABASE.filter(a => a.minUserLevel < 1 || a.minUserLevel > 6);
  if (invalidLevels.length > 0) {
    errors.push(`Agentes com níveis de usuário inválidos: ${invalidLevels.map(a => a.name).join(', ')}`);
  }
  
  // Validação 4: Agentes sci-fi devem referenciar arquétipo grego
  const cinematicWithoutArchetype = CANON_DATABASE.filter(
    a => a.dimension === 'cinematic' && !a.greekArchetype
  );
  if (cinematicWithoutArchetype.length > 0) {
    errors.push(`Agentes cinemáticos sem arquétipo grego: ${cinematicWithoutArchetype.map(a => a.name).join(', ')}`);
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

// ==================== SISTEMA DE NARRATIVA ====================

/**
 * Obtém arco narrativo de um agente através das temporadas
 * @param agentName - Nome do agente
 * @returns Histórico de aparições por temporada
 */
export function getAgentStoryArc(agentName: string): { season: number; role: string }[] {
  const agent = getAgentFromDB(agentName);
  if (!agent) return [];
  
  // Arco básico: aparece na temporada de estreia e continua nas seguintes
  const arc: { season: number; role: string }[] = [];
  
  for (let season = agent.season; season <= 12; season++) {
    arc.push({
      season,
      role: season === agent.season 
        ? `Estreia: ${agent.narrativeRole}`
        : `Retorna como ${agent.level} ${agent.faction}`
    });
  }
  
  return arc;
}

/**
 * Identifica conflitos potenciais entre facções em uma temporada
 * @param season - Temporada alvo
 * @returns Pares de agentes em conflito potencial
 */
export function getSeasonConflicts(season: number): { agent1: string; agent2: string; tension: string }[] {
  const seasonAgents = getAgentsBySeason(season);
  const conflicts: { agent1: string; agent2: string; tension: string }[] = [];
  
  const orderAgents = seasonAgents.filter(a => a.faction === 'order');
  const chaosAgents = seasonAgents.filter(a => a.faction === 'chaos');
  
  orderAgents.forEach(order => {
    chaosAgents.forEach(chaos => {
      // Conflitos baseados em oposições conceituais
      const conflictPairs = [
        ['COSMOS', 'CHAOS'],
        ['DIKHE', 'HUBRIS'],
        ['ATLAS', 'KAOS'],
        ['NOMOS', 'EROS']
      ];
      
      const isConflict = conflictPairs.some(
        ([o, c]) => (o === order.name && c === chaos.name) ||
                    (c === order.name && o === chaos.name)
      );
      
      if (isConflict) {
        conflicts.push({
          agent1: order.name,
          agent2: chaos.name,
          tension: 'Conflito cósmico ORDEM vs CAOS'
        });
      }
    });
  });
  
  return conflicts;
}
