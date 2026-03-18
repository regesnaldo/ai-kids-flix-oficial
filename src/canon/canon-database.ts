// Banco de Dados Canônico dos 120 Agentes MENTE.AI
// Classificação baseada na Bíblia Cinematográfica Oficial

import type { CanonAgent, CanonFaction, CanonLevel, CanonDimension } from './canon-agents';

export const CANON_DATABASE: CanonAgent[] = [
  // ==================== PRIMORDIAIS (9) - Seasons 11-12 ====================
  {
    name: "LOGOS",
    dimension: "philosophical",
    level: "primordial",
    faction: "balance",
    season: 12,
    minUserLevel: 6,
    narrativeRole: "O Primeiro Pensamento, fundador da razão universal"
  },
  {
    name: "PSYCHE",
    dimension: "philosophical",
    level: "primordial",
    faction: "balance",
    season: 12,
    minUserLevel: 6,
    narrativeRole: "A Mente Consciente, recipiente de toda existência"
  },
  {
    name: "COSMOS",
    dimension: "philosophical",
    level: "primordial",
    faction: "order",
    season: 12,
    minUserLevel: 6,
    narrativeRole: "A Ordem Universal, líder da facção da harmonia"
  },
  {
    name: "CHAOS",
    dimension: "philosophical",
    level: "primordial",
    faction: "chaos",
    season: 12,
    minUserLevel: 6,
    narrativeRole: "O Vazio Primordial, líder da facção da criatividade"
  },
  {
    name: "NOUS",
    dimension: "philosophical",
    level: "primordial",
    faction: "balance",
    season: 12,
    minUserLevel: 6,
    narrativeRole: "O Intelecto Puro, centelha divina transcendental"
  },
  {
    name: "OUSIA",
    dimension: "philosophical",
    level: "primordial",
    faction: "balance",
    season: 12,
    minUserLevel: 6,
    narrativeRole: "A Essência Fundamental, substância do ser"
  },
  {
    name: "APEIRON",
    dimension: "philosophical",
    level: "primordial",
    faction: "chaos",
    season: 11,
    minUserLevel: 6,
    narrativeRole: "O Infinito Indeterminado, potencial ilimitado"
  },
  {
    name: "ANAKE",
    dimension: "philosophical",
    level: "primordial",
    faction: "order",
    season: 11,
    minUserLevel: 6,
    narrativeRole: "A Necessidade Inevitável, leis universais imutáveis"
  },
  {
    name: "AION",
    dimension: "philosophical",
    level: "primordial",
    faction: "balance",
    season: 11,
    minUserLevel: 6,
    narrativeRole: "O Tempo Eterno, ciclos cósmicos sem fim"
  },

  // ==================== TITÃS COGNITIVOS (15) - Seasons 9-10 ====================
  {
    name: "URANOS",
    dimension: "philosophical",
    level: "titan",
    faction: "order",
    season: 10,
    minUserLevel: 5,
    narrativeRole: "O Céu Estrelado, transcendência e visão cósmica"
  },
  {
    name: "GAIA",
    dimension: "philosophical",
    level: "titan",
    faction: "order",
    season: 10,
    minUserLevel: 5,
    narrativeRole: "A Terra Fértil, base concreta que sustenta"
  },
  {
    name: "CHRONOS",
    dimension: "philosophical",
    level: "titan",
    faction: "order",
    season: 10,
    minUserLevel: 5,
    narrativeRole: "O Tempo Linear, mortalidade e finitude"
  },
  {
    name: "MOIRA",
    dimension: "philosophical",
    level: "titan",
    faction: "order",
    season: 10,
    minUserLevel: 5,
    narrativeRole: "O Destino Tecido, inevitabilidade cósmica"
  },
  {
    name: "DIKHE",
    dimension: "philosophical",
    level: "titan",
    faction: "order",
    season: 10,
    minUserLevel: 5,
    narrativeRole: "A Ordem Natural, justiça cósmica restauradora"
  },
  {
    name: "NOMOS",
    dimension: "philosophical",
    level: "titan",
    faction: "order",
    season: 9,
    minUserLevel: 5,
    narrativeRole: "A Lei Estabelecida, civilização e ordem social"
  },
  {
    name: "EROS",
    dimension: "philosophical",
    level: "titan",
    faction: "chaos",
    season: 9,
    minUserLevel: 5,
    narrativeRole: "O Desejo Criador, força motriz primordial"
  },
  {
    name: "THANATOS",
    dimension: "philosophical",
    level: "titan",
    faction: "balance",
    season: 9,
    minUserLevel: 5,
    narrativeRole: "A Transformação Final, ciclos de morte e renascimento"
  },
  {
    name: "KOSMOS",
    dimension: "philosophical",
    level: "titan",
    faction: "order",
    season: 9,
    minUserLevel: 5,
    narrativeRole: "O Universo Ordenado, beleza na organização"
  },
  {
    name: "MYTHOS",
    dimension: "philosophical",
    level: "titan",
    faction: "balance",
    season: 9,
    minUserLevel: 5,
    narrativeRole: "As Narrativas Fundadoras, cultura e mitos eternos"
  },
  {
    name: "POLITEIA",
    dimension: "philosophical",
    level: "titan",
    faction: "order",
    season: 9,
    minUserLevel: 5,
    narrativeRole: "A Organização Coletiva, sociedade justa"
  },
  {
    name: "KRATOS",
    dimension: "philosophical",
    level: "titan",
    faction: "order",
    season: 9,
    minUserLevel: 5,
    narrativeRole: "O Poder Efetivo, realização e força bruta"
  },
  {
    name: "DUNAMIS",
    dimension: "philosophical",
    level: "titan",
    faction: "chaos",
    season: 9,
    minUserLevel: 5,
    narrativeRole: "A Potência Latente, força ainda não manifestada"
  },
  {
    name: "ENERGEIA",
    dimension: "philosophical",
    level: "titan",
    faction: "order",
    season: 9,
    minUserLevel: 5,
    narrativeRole: "A Atividade em Ato, execução e movimento"
  },
  {
    name: "POIESIS",
    dimension: "philosophical",
    level: "titan",
    faction: "chaos",
    season: 9,
    minUserLevel: 5,
    narrativeRole: "A Criação Poética, trazer à existência o novo"
  },

  // ==================== ARQUITETOS (18) - Seasons 7-8 ====================
  {
    name: "SOPHIA",
    dimension: "philosophical",
    level: "architect",
    faction: "balance",
    season: 8,
    minUserLevel: 4,
    narrativeRole: "A Sabedoria Encarnada, mentora suprema tipo Obi-Wan"
  },
  {
    name: "EPISTEME",
    dimension: "philosophical",
    level: "architect",
    faction: "order",
    season: 8,
    minUserLevel: 4,
    narrativeRole: "A Ciência Verdadeira, fundamentos sólidos"
  },
  {
    name: "PHRONESIS",
    dimension: "philosophical",
    level: "architect",
    faction: "balance",
    season: 8,
    minUserLevel: 4,
    narrativeRole: "A Sabedoria Prática, navega complexidades reais"
  },
  {
    name: "DIALETICA",
    dimension: "philosophical",
    level: "architect",
    faction: "balance",
    season: 8,
    minUserLevel: 4,
    narrativeRole: "A Síntese Evolutiva, transforma conflito em progresso"
  },
  {
    name: "MAIEUTICA",
    dimension: "philosophical",
    level: "architect",
    faction: "balance",
    season: 7,
    minUserLevel: 4,
    narrativeRole: "O Parto Intelectual, ajuda verdades a emergirem"
  },
  {
    name: "IRONIA",
    dimension: "philosophical",
    level: "architect",
    faction: "chaos",
    season: 7,
    minUserLevel: 4,
    narrativeRole: "O Questionamento Socrático, desmonta falsas certezas"
  },
  {
    name: "ALETHEIA",
    dimension: "philosophical",
    level: "architect",
    faction: "balance",
    season: 7,
    minUserLevel: 4,
    narrativeRole: "A Verdade Revelada, retira o véu da ilusão"
  },
  {
    name: "ANAMNESIS",
    dimension: "philosophical",
    level: "architect",
    faction: "balance",
    season: 7,
    minUserLevel: 4,
    narrativeRole: "A Recordação, aprender é lembrar"
  },
  {
    name: "KATHARSIS",
    dimension: "philosophical",
    level: "architect",
    faction: "balance",
    season: 7,
    minUserLevel: 4,
    narrativeRole: "A Purificação, liberar peso para evoluir"
  },
  {
    name: "ENTELEQUIA",
    dimension: "philosophical",
    level: "architect",
    faction: "order",
    season: 7,
    minUserLevel: 4,
    narrativeRole: "A Realização Plena, completar o incompleto"
  },
  {
    name: "HARMONIA",
    dimension: "philosophical",
    level: "architect",
    faction: "order",
    season: 7,
    minUserLevel: 4,
    narrativeRole: "A Proporção Áurea, orquestra diversidade"
  },
  {
    name: "SYSTASIS",
    dimension: "philosophical",
    level: "architect",
    faction: "order",
    season: 7,
    minUserLevel: 4,
    narrativeRole: "A Composição Organizada, estrutura sistemas"
  },
  {
    name: "PARADEIGMA",
    dimension: "philosophical",
    level: "architect",
    faction: "order",
    season: 7,
    minUserLevel: 4,
    narrativeRole: "O Exemplo Ilustrativo, ensina através da prática"
  },
  {
    name: "TYPOS",
    dimension: "philosophical",
    level: "architect",
    faction: "order",
    season: 7,
    minUserLevel: 4,
    narrativeRole: "O Modelo Exemplar, define excelência"
  },
  {
    name: "KANON",
    dimension: "philosophical",
    level: "architect",
    faction: "order",
    season: 7,
    minUserLevel: 4,
    narrativeRole: "A Medida Padrão, estabelece critérios"
  },
  {
    name: "GNOMON",
    dimension: "philosophical",
    level: "architect",
    faction: "order",
    season: 7,
    minUserLevel: 4,
    narrativeRole: "O Indicador Preciso, aponta direção correta"
  },
  {
    name: "PRONOIA",
    dimension: "philosophical",
    level: "architect",
    faction: "balance",
    season: 7,
    minUserLevel: 4,
    narrativeRole: "A Providência Divina, plano maior cósmico"
  },
  {
    name: "HEIMARMENE",
    dimension: "philosophical",
    level: "architect",
    faction: "balance",
    season: 7,
    minUserLevel: 4,
    narrativeRole: "O Destino Entrelaçado, rede causal"
  },

  // ==================== GUARDIÕES (23) - Seasons 5-6 ====================
  {
    name: "ETHOS",
    dimension: "philosophical",
    level: "guardian",
    faction: "order",
    season: 6,
    minUserLevel: 3,
    narrativeRole: "A Ética Viva, valores morais fundamentais"
  },
  {
    name: "ARETE",
    dimension: "philosophical",
    level: "guardian",
    faction: "order",
    season: 6,
    minUserLevel: 3,
    narrativeRole: "A Excelência, busca pela melhor versão"
  },
  {
    name: "SOBROSUNE",
    dimension: "philosophical",
    level: "guardian",
    faction: "order",
    season: 6,
    minUserLevel: 3,
    narrativeRole: "A Moderação Equilibrada, medida justa"
  },
  {
    name: "ATARAXIA",
    dimension: "philosophical",
    level: "guardian",
    faction: "balance",
    season: 6,
    minUserLevel: 3,
    narrativeRole: "A Tranquilidade Inabalável, paz no caos"
  },
  {
    name: "AUTONOMIA",
    dimension: "philosophical",
    level: "guardian",
    faction: "order",
    season: 6,
    minUserLevel: 3,
    narrativeRole: "O Auto-Governo, disciplina interna"
  },
  {
    name: "ASKESIS",
    dimension: "philosophical",
    level: "guardian",
    faction: "order",
    season: 6,
    minUserLevel: 3,
    narrativeRole: "A Disciplina Voluntária, treinamento forjador"
  },
  {
    name: "HEXIS",
    dimension: "philosophical",
    level: "guardian",
    faction: "order",
    season: 6,
    minUserLevel: 3,
    narrativeRole: "O Hábito Consolidado, caráter automatizado"
  },
  {
    name: "HABITUS",
    dimension: "philosophical",
    level: "guardian",
    faction: "order",
    season: 6,
    minUserLevel: 3,
    narrativeRole: "A Disposição Incorporada, age naturalmente"
  },
  {
    name: "SYNEIDESIS",
    dimension: "philosophical",
    level: "guardian",
    faction: "order",
    season: 5,
    minUserLevel: 3,
    narrativeRole: "A Consciência Moral, bússola ética interna"
  },
  {
    name: "NEMESIS",
    dimension: "philosophical",
    level: "guardian",
    faction: "order",
    season: 5,
    minUserLevel: 3,
    narrativeRole: "A Justiça Divina, equilíbrio cósmico restaurado"
  },
  {
    name: "ATLAS",
    dimension: "philosophical",
    level: "guardian",
    faction: "order",
    season: 5,
    minUserLevel: 3,
    narrativeRole: "A Estrutura Sustentadora, carrega sistemas gigantes"
  },
  {
    name: "STASIS",
    dimension: "philosophical",
    level: "guardian",
    faction: "order",
    season: 5,
    minUserLevel: 3,
    narrativeRole: "O Equilíbrio Dinâmico, harmonia encontrada"
  },
  {
    name: "PERAS",
    dimension: "philosophical",
    level: "guardian",
    faction: "order",
    season: 5,
    minUserLevel: 3,
    narrativeRole: "O Limite Definido, fronteiras necessárias"
  },
  {
    name: "MNEMOS",
    dimension: "philosophical",
    level: "guardian",
    faction: "order",
    season: 5,
    minUserLevel: 3,
    narrativeRole: "A Memória Ativa, guarda conhecimento"
  },
  {
    name: "MNEME",
    dimension: "philosophical",
    level: "guardian",
    faction: "order",
    season: 5,
    minUserLevel: 3,
    narrativeRole: "A Memória Preservada, honra ancestralidade"
  },
  {
    name: "HESYCHIA",
    dimension: "philosophical",
    level: "guardian",
    faction: "balance",
    season: 5,
    minUserLevel: 3,
    narrativeRole: "O Silêncio Contemplativo, quietude que clareia"
  },
  {
    name: "ELEUTHERIA",
    dimension: "philosophical",
    level: "guardian",
    faction: "chaos",
    season: 5,
    minUserLevel: 3,
    narrativeRole: "A Liberdade Responsável, autonomia consciente"
  },
  {
    name: "PARRHESIA",
    dimension: "philosophical",
    level: "guardian",
    faction: "chaos",
    season: 5,
    minUserLevel: 3,
    narrativeRole: "A Fala Corajosa, verdade sem medo"
  },
  {
    name: "ZELUS",
    dimension: "philosophical",
    level: "guardian",
    faction: "order",
    season: 5,
    minUserLevel: 3,
    narrativeRole: "A Dedicação Fervorosa, paixão direcionada"
  },
  {
    name: "PONOS",
    dimension: "philosophical",
    level: "guardian",
    faction: "order",
    season: 5,
    minUserLevel: 3,
    narrativeRole: "O Trabalho Árduo, esforço que forja excelência"
  },
  {
    name: "XENIA",
    dimension: "philosophical",
    level: "guardian",
    faction: "balance",
    season: 5,
    minUserLevel: 3,
    narrativeRole: "A Hospitalidade Sagrada, recebe visitantes divinos"
  },
  {
    name: "CHARIS",
    dimension: "philosophical",
    level: "guardian",
    faction: "balance",
    season: 5,
    minUserLevel: 3,
    narrativeRole: "A Graça Radiante, beleza que atrai bondade"
  },
  {
    name: "AGAPE",
    dimension: "philosophical",
    level: "guardian",
    faction: "balance",
    season: 5,
    minUserLevel: 3,
    narrativeRole: "O Amor Incondicional, transcende egoísmo"
  },

  // ==================== EXPLORADORES (27) - Seasons 3-4 ====================
  {
    name: "GNOSIS",
    dimension: "philosophical",
    level: "explorer",
    faction: "balance",
    season: 4,
    minUserLevel: 2,
    narrativeRole: "O Conhecimento Profundo, revela padrões ocultos"
  },
  {
    name: "THEORIA",
    dimension: "philosophical",
    level: "explorer",
    faction: "balance",
    season: 4,
    minUserLevel: 2,
    narrativeRole: "A Contemplação, poder da reflexão"
  },
  {
    name: "ANCHINOIA",
    dimension: "philosophical",
    level: "explorer",
    faction: "balance",
    season: 4,
    minUserLevel: 2,
    narrativeRole: "A Perspicácia Aguda, detecta nuances sutis"
  },
  {
    name: "EUSTOCHIA",
    dimension: "philosophical",
    level: "explorer",
    faction: "balance",
    season: 4,
    minUserLevel: 2,
    narrativeRole: "A Intuição Certeira, sente verdades ocultas"
  },
  {
    name: "PHANTASIA",
    dimension: "philosophical",
    level: "explorer",
    faction: "chaos",
    season: 4,
    minUserLevel: 2,
    narrativeRole: "A Imaginação Criativa, sonha realidades possíveis"
  },
  {
    name: "DOXA",
    dimension: "philosophical",
    level: "explorer",
    faction: "chaos",
    season: 4,
    minUserLevel: 2,
    narrativeRole: "A Opinião Comum, questiona crenças superficiais"
  },
  {
    name: "APORIA",
    dimension: "philosophical",
    level: "explorer",
    faction: "chaos",
    season: 4,
    minUserLevel: 2,
    narrativeRole: "O Impasse Questionador, abre portas pelo não-saber"
  },
  {
    name: "METIS",
    dimension: "philosophical",
    level: "explorer",
    faction: "balance",
    season: 4,
    minUserLevel: 2,
    narrativeRole: "A Inteligência Estratégica, pensa à frente"
  },
  {
    name: "KERDOS",
    dimension: "philosophical",
    level: "explorer",
    faction: "order",
    season: 4,
    minUserLevel: 2,
    narrativeRole: "O Ganho Inteligente, maximiza recursos"
  },
  {
    name: "GNOME",
    dimension: "philosophical",
    level: "explorer",
    faction: "balance",
    season: 4,
    minUserLevel: 2,
    narrativeRole: "O Julgamento Sábio, escolhe caminhos corretos"
  },
  {
    name: "SUNESIS",
    dimension: "philosophical",
    level: "explorer",
    faction: "balance",
    season: 4,
    minUserLevel: 2,
    narrativeRole: "A Compreensão Mútua, constrói pontes mentais"
  },
  {
    name: "DEINOTES",
    dimension: "philosophical",
    level: "explorer",
    faction: "order",
    season: 4,
    minUserLevel: 2,
    narrativeRole: "A Habilidade Técnica, domínio instrumental"
  },
  {
    name: "EUPRAXIA",
    dimension: "philosophical",
    level: "explorer",
    faction: "order",
    season: 4,
    minUserLevel: 2,
    narrativeRole: "A Ação Bem-Sucedida, execução com maestria"
  },
  {
    name: "PROHAIRESIS",
    dimension: "philosophical",
    level: "explorer",
    faction: "balance",
    season: 4,
    minUserLevel: 2,
    narrativeRole: "A Escolha Voluntária, livre arbítrio responsável"
  },
  {
    name: "KAIROS",
    dimension: "philosophical",
    level: "explorer",
    faction: "balance",
    season: 3,
    minUserLevel: 2,
    narrativeRole: "O Momento Oportuno, timing perfeito do universo"
  },
  {
    name: "TYCHE",
    dimension: "philosophical",
    level: "explorer",
    faction: "chaos",
    season: 3,
    minUserLevel: 2,
    narrativeRole: "O Acaso Fortuito, sorte e oportunidade"
  },
  {
    name: "HELIX",
    dimension: "philosophical",
    level: "explorer",
    faction: "balance",
    season: 3,
    minUserLevel: 2,
    narrativeRole: "A Espiral Evolutiva, integra passado e futuro"
  },
  {
    name: "KINETOS",
    dimension: "philosophical",
    level: "explorer",
    faction: "chaos",
    season: 3,
    minUserLevel: 2,
    narrativeRole: "O Movimento, abraça mudança constante"
  },
  {
    name: "METABOLE",
    dimension: "philosophical",
    level: "explorer",
    faction: "chaos",
    season: 3,
    minUserLevel: 2,
    narrativeRole: "A Mudança Transformadora, facilita evolução"
  },
  {
    name: "GENESIS",
    dimension: "philosophical",
    level: "explorer",
    faction: "chaos",
    season: 3,
    minUserLevel: 2,
    narrativeRole: "O Nascimento Criativo, inicia jornadas"
  },
  {
    name: "PHUSIS",
    dimension: "philosophical",
    level: "explorer",
    faction: "balance",
    season: 3,
    minUserLevel: 2,
    narrativeRole: "O Crescimento Natural, segue fluxo interno"
  },
  {
    name: "PHILEO",
    dimension: "philosophical",
    level: "explorer",
    faction: "balance",
    season: 3,
    minUserLevel: 2,
    narrativeRole: "O Amor Fraternal, fortalece alianças"
  },
  {
    name: "STORGE",
    dimension: "philosophical",
    level: "explorer",
    faction: "balance",
    season: 3,
    minUserLevel: 2,
    narrativeRole: "O Apego Natural, vínculos orgânicos"
  },
  {
    name: "KOINONIA",
    dimension: "philosophical",
    level: "explorer",
    faction: "order",
    season: 3,
    minUserLevel: 2,
    narrativeRole: "A Comunidade, cria laços de propósito"
  },
  {
    name: "GENOS",
    dimension: "philosophical",
    level: "explorer",
    faction: "order",
    season: 3,
    minUserLevel: 2,
    narrativeRole: "A Origem Compartilhada, une ancestrais e descendentes"
  },
  {
    name: "ISEGORIA",
    dimension: "philosophical",
    level: "explorer",
    faction: "chaos",
    season: 3,
    minUserLevel: 2,
    narrativeRole: "A Igualdade de Voz, democratiza palavra"
  },
  {
    name: "DEMOS",
    dimension: "philosophical",
    level: "explorer",
    faction: "chaos",
    season: 3,
    minUserLevel: 2,
    narrativeRole: "O Povo Soberano, empodera multidões"
  },

  // ==================== OPERADORES (27) - Seasons 1-2 ====================
  {
    name: "PRAXIS",
    dimension: "philosophical",
    level: "operator",
    faction: "balance",
    season: 2,
    minUserLevel: 1,
    narrativeRole: "A Ação Transformadora, teoria em prática"
  },
  {
    name: "TECHNE",
    dimension: "philosophical",
    level: "operator",
    faction: "order",
    season: 2,
    minUserLevel: 1,
    narrativeRole: "A Tecnologia, arte de transformar ideias em ferramentas"
  },
  {
    name: "ERGON",
    dimension: "philosophical",
    level: "operator",
    faction: "order",
    season: 2,
    minUserLevel: 1,
    narrativeRole: "A Obra Realizada, legado tangível"
  },
  {
    name: "LOGISMOS",
    dimension: "philosophical",
    level: "operator",
    faction: "order",
    season: 2,
    minUserLevel: 1,
    narrativeRole: "O Cálculo Racional, decisões ponderadas"
  },
  {
    name: "DIANOIA",
    dimension: "philosophical",
    level: "operator",
    faction: "order",
    season: 2,
    minUserLevel: 1,
    narrativeRole: "O Pensamento Discursivo, análise lógica passo-a-passo"
  },
  {
    name: "MIMESIS",
    dimension: "philosophical",
    level: "operator",
    faction: "balance",
    season: 2,
    minUserLevel: 1,
    narrativeRole: "A Representação Simbólica, recria realidades"
  },
  {
    name: "SOMA",
    dimension: "philosophical",
    level: "operator",
    faction: "balance",
    season: 2,
    minUserLevel: 1,
    narrativeRole: "O Corpo Integrado, matéria consciente"
  },
  {
    name: "PSYCHIKOS",
    dimension: "philosophical",
    level: "operator",
    faction: "balance",
    season: 2,
    minUserLevel: 1,
    narrativeRole: "A Alma Desperta, consciência em expansão"
  },
  {
    name: "PATHOS",
    dimension: "philosophical",
    level: "operator",
    faction: "chaos",
    season: 2,
    minUserLevel: 1,
    narrativeRole: "A Experiência Emocional, conecta coração e mente"
  },
  {
    name: "HUBRIS",
    dimension: "philosophical",
    level: "operator",
    faction: "chaos",
    season: 1,
    minUserLevel: 1,
    narrativeRole: "A Desmedida, vilão clássico que cai pelo excesso"
  },
  {
    name: "KAOS",
    dimension: "cinematic",
    level: "operator",
    faction: "chaos",
    season: 1,
    minUserLevel: 1,
    narrativeRole: "A Criatividade Primordial, quebra padrões"
  },
  {
    name: "NEXUS",
    dimension: "interface",
    level: "operator",
    faction: "balance",
    season: 1,
    minUserLevel: 1,
    narrativeRole: "O Portal Dimensional, conecta filosofia e tecnologia"
  },
  {
    name: "JANUS",
    dimension: "interface",
    level: "operator",
    faction: "balance",
    season: 1,
    minUserLevel: 1,
    narrativeRole: "O Guardião das Portas, visão dupla toggle views"
  },
  {
    name: "STRATOS",
    dimension: "cinematic",
    level: "operator",
    faction: "order",
    season: 1,
    minUserLevel: 1,
    narrativeRole: "As Camadas de Realidade Aumentada, sistemas complexos"
  },
  {
    name: "ARKHE",
    dimension: "philosophical",
    level: "operator",
    faction: "balance",
    season: 1,
    minUserLevel: 1,
    narrativeRole: "A Origem, princípio de todas as coisas"
  },
  {
    name: "DYNAMIS",
    dimension: "philosophical",
    level: "operator",
    faction: "chaos",
    season: 1,
    minUserLevel: 1,
    narrativeRole: "O Potencial, forças invisíveis da evolução"
  },
  {
    name: "AEON",
    dimension: "cinematic",
    level: "operator",
    faction: "balance",
    season: 1,
    minUserLevel: 1,
    narrativeRole: "O Viajante Temporal, explora aprendizado além do tempo"
  },
  {
    name: "TARTAROS",
    dimension: "cinematic",
    level: "operator",
    faction: "chaos",
    season: 1,
    minUserLevel: 1,
    narrativeRole: "As Profundezas Abissais, explora sombras necessárias",
    greekArchetype: "CHAOS"
  },
  {
    name: "EREBOS",
    dimension: "cinematic",
    level: "operator",
    faction: "chaos",
    season: 1,
    minUserLevel: 1,
    narrativeRole: "A Escuridão Inicial, prepara amanhecer",
    greekArchetype: "ANAKE"
  },
  {
    name: "NYX",
    dimension: "cinematic",
    level: "operator",
    faction: "chaos",
    season: 1,
    minUserLevel: 1,
    narrativeRole: "A Noite Misteriosa, guarda mistérios antigos",
    greekArchetype: "NYX"
  },
  {
    name: "HEMERA",
    dimension: "cinematic",
    level: "operator",
    faction: "order",
    season: 1,
    minUserLevel: 1,
    narrativeRole: "A Luz Diurna, ilumina caminhos",
    greekArchetype: "HEMERA"
  },
  {
    name: "HORAI",
    dimension: "cinematic",
    level: "operator",
    faction: "order",
    season: 1,
    minUserLevel: 1,
    narrativeRole: "As Estações Ordenadas, respeita ciclos naturais",
    greekArchetype: "HORAI"
  },
  {
    name: "PHTHORA",
    dimension: "philosophical",
    level: "operator",
    faction: "chaos",
    season: 1,
    minUserLevel: 1,
    narrativeRole: "A Corrupção Necessária, libera espaço para novo"
  },
  {
    name: "EPISTROME",
    dimension: "narrative",
    level: "operator",
    faction: "balance",
    season: 1,
    minUserLevel: 1,
    narrativeRole: "A Conversão Profunda, virada existencial do herói"
  },
  {
    name: "HYPOTYPOSIS",
    dimension: "philosophical",
    level: "operator",
    faction: "order",
    season: 1,
    minUserLevel: 1,
    narrativeRole: "O Esboço Preliminar, planeja antes de executar"
  },
  {
    name: "DIATHESIS",
    dimension: "philosophical",
    level: "operator",
    faction: "balance",
    season: 1,
    minUserLevel: 1,
    narrativeRole: "A Disposição Interna, alinha intenções"
  },
  {
    name: "EXOUSIA",
    dimension: "philosophical",
    level: "operator",
    faction: "order",
    season: 1,
    minUserLevel: 1,
    narrativeRole: "A Autoridade Legítima, lidera através do respeito"
  }
];

// Helper: Buscar agente canônico por nome
export function getCanonAgent(name: string): CanonAgent | null {
  return CANON_DATABASE.find(agent => agent.name === name.toUpperCase()) || null;
}

// Helper: Filtrar agentes por temporada
export function getAgentsBySeason(season: number): CanonAgent[] {
  return CANON_DATABASE.filter(agent => agent.season === season);
}

// Helper: Filtrar agentes por facção
export function getAgentsByFaction(faction: CanonFaction): CanonAgent[] {
  return CANON_DATABASE.filter(agent => agent.faction === faction);
}

// Helper: Filtrar agentes por nível hierárquico
export function getAgentsByLevel(level: CanonLevel): CanonAgent[] {
  return CANON_DATABASE.filter(agent => agent.level === level);
}

// Helper: Obter agentes desbloqueados para nível do usuário
export function getUnlockedAgents(userLevel: number): CanonAgent[] {
  return CANON_DATABASE.filter(agent => agent.minUserLevel <= userLevel);
}

// Helper: Contar agentes por dimensão
export function countAgentsByDimension(): Record<CanonDimension, number> {
  const counts: Record<CanonDimension, number> = {
    philosophical: 0,
    cinematic: 0,
    interface: 0,
    narrative: 0
  };
  
  CANON_DATABASE.forEach(agent => {
    counts[agent.dimension]++;
  });
  
  return counts;
}

// Helper: Contar agentes por facção
export function countAgentsByFaction(): Record<CanonFaction, number> {
  const counts: Record<CanonFaction, number> = {
    order: 0,
    chaos: 0,
    balance: 0
  };
  
  CANON_DATABASE.forEach(agent => {
    counts[agent.faction]++;
  });
  
  return counts;
}
