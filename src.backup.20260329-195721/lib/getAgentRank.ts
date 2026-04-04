// Helper para obter o rank hierárquico de um agente
import { agentRankMap, getAgentInfo } from '../data/agents-hierarchy';

/**
 * Obtém o nível hierárquico de um agente específico
 * @param name - Nome do agente (ex: "LOGOS", "ETHOS")
 * @returns Objeto com level, division e narrativeRole, ou null se não existir
 */
export function getAgentRank(name: string): { 
  level: string; 
  division: string; 
  narrativeRole: string;
} | null {
  return getAgentInfo(name);
}

/**
 * Verifica se um agente existe na hierarquia
 * @param name - Nome do agente
 * @returns true se o agente existe, false caso contrário
 */
export function hasAgentRank(name: string): boolean {
  return name.toUpperCase() in agentRankMap;
}

/**
 * Obtém todos os agentes de um nível hierárquico específico
 * @param level - Nível hierárquico (Primordial, Titan, Architect, Guardian, Explorer, Operator)
 * @returns Array de nomes de agentes
 */
export function getAgentsByRank(level: string): string[] {
  const levels: Record<string, string[]> = {
    'Primordial': ['LOGOS', 'PSYCHE', 'COSMOS', 'CHAOS', 'NOUS', 'OUSIA', 'APEIRON', 'ANAKE', 'AION'],
    'Titan': ['URANOS', 'GAIA', 'CHRONOS', 'MOIRA', 'DIKHE', 'NOMOS', 'EROS', 'THANATOS', 'KOSMOS', 'MYTHOS', 'POLITEIA', 'KRATOS', 'DUNAMIS', 'ENERGEIA', 'POIESIS'],
    'Architect': ['SOPHIA', 'EPISTEME', 'PHRONESIS', 'DIALETICA', 'MAIEUTICA', 'IRONIA', 'ALETHEIA', 'ANAMNESIS', 'KATHARSIS', 'ENTELEQUIA', 'HARMONIA', 'SYSTASIS', 'PARADEIGMA', 'TYPOS', 'KANON', 'GNOMON', 'PRONOIA', 'HEIMARMENE'],
    'Guardian': ['ETHOS', 'ARETE', 'SOBROSUNE', 'ATARAXIA', 'AUTONOMIA', 'ASKESIS', 'HEXIS', 'HABITUS', 'SYNEIDESIS', 'NEMESIS', 'ATLAS', 'STASIS', 'PERAS', 'MNEMOS', 'MNEME', 'HESYCHIA', 'ELEUTHERIA', 'PARRHESIA', 'ZELUS', 'PONOS', 'XENIA', 'CHARIS', 'AGAPE'],
    'Explorer': ['GNOSIS', 'THEORIA', 'ANCHINOIA', 'EUSTOCHIA', 'PHANTASIA', 'DOXA', 'APORIA', 'METIS', 'KERDOS', 'GNOME', 'SUNESIS', 'DEINOTES', 'EUPRAXIA', 'PROHAIRESIS', 'KAIROS', 'TYCHE', 'HELIX', 'KINETOS', 'METABOLE', 'GENESIS', 'PHUSIS', 'PHILEO', 'STORGE', 'KOINONIA', 'GENOS', 'ISEGORIA', 'DEMOS'],
    'Operator': ['PRAXIS', 'TECHNE', 'ERGON', 'LOGISMOS', 'DIANOIA', 'MIMESIS', 'SOMA', 'PSYCHIKOS', 'PATHOS', 'HUBRIS', 'KAOS', 'NEXUS', 'JANUS', 'STRATOS', 'ARKHE', 'DYNAMIS', 'AEON', 'TARTAROS', 'EREBOS', 'NYX', 'HEMERA', 'HORAI', 'PHTHORA', 'EPISTROME', 'HYPOTYPOSIS', 'DIATHESIS', 'EXOUSIA']
  };
  
  return levels[level] || [];
}

/**
 * Retorna a descrição de um nível hierárquico
 * @param level - Nível hierárquico
 * @returns Descrição do nível
 */
export function getRankDescription(level: string): string {
  const descriptions: Record<string, string> = {
    'Primordial': 'Fundamentos absolutos da mente consciente',
    'Titan': 'Forças massivas que moldam a realidade mental',
    'Architect': 'Projetistas ativos dos sistemas mentais',
    'Guardian': 'Protetores e estabilizadores da ordem mental',
    'Explorer': 'Pioneiros que expandem fronteiras do conhecimento',
    'Operator': 'Executores práticos que manifestam na realidade'
  };
  
  return descriptions[level] || 'Nível desconhecido';
}

/**
 * Retorna o papel narrativo de um agente
 * @param name - Nome do agente
 * @returns Papel narrativo cinematográfico
 */
export function getAgentNarrativeRole(name: string): string | null {
  const info = getAgentInfo(name);
  return info ? info.narrativeRole : null;
}

/**
 * Compara o rank de dois agentes
 * @param agent1 - Primeiro agente
 * @param agent2 - Segundo agente
 * @returns Número negativo se agent1 é superior, positivo se agent2 é superior, 0 se iguais
 */
export function compareAgentRanks(agent1: string, agent2: string): number {
  const rankOrder = ['Primordial', 'Titan', 'Architect', 'Guardian', 'Explorer', 'Operator'];
  const info1 = getAgentInfo(agent1);
  const info2 = getAgentInfo(agent2);
  
  if (!info1 || !info2) return 0;
  
  const index1 = rankOrder.indexOf(info1.level);
  const index2 = rankOrder.indexOf(info2.level);
  
  return index1 - index2;
}
