// ─── src/data/seed/season-01-axiom.ts ────────────────────────────────────
// AXIOM — Temporada 1: Ciência, Método Científico e Descoberta
// Agente: AXIOM (Cientista Lógico) · Cor: #3b82f6 (azul)
import type { NewKnowledgeUnit, NewKnowledgeAsset, NewKnowledgeGraphEdge } from "@/lib/db/schema";

/* ═══════════════════════════════════════════════════════════════════
   EPISÓDIO 1 — A Pergunta Certa
   ═══════════════════════════════════════════════════════════════════ */

export const AXIOM_T01E01_UNIT: NewKnowledgeUnit = {
  id: "ku-axiom-t01-e01", title: "A Pergunta Certa",
  slug: "axiom-t01-e01-pergunta-certa",
  learningObjective: "Reconhecer que a ciência começa com perguntas, não com respostas.",
  cognitiveLevel: "remember", difficulty: "beginner", estimatedTimeMin: 8,
  skills: ["scientific-method","curiosity"],
  tags: ["fundamentos","pergunta"], agentDomain: "axiom",
  version: 1, status: "published",
};

export const AXIOM_T01E01_ASSET: NewKnowledgeAsset = {
  id: "ka-axiom-t01-e01", knowledgeUnitId: "ku-axiom-t01-e01",
  agentId: "axiom", season: 1, episode: 1, type: "episode",
  content: {
    abertura: "Você está num laboratório infinito. Telescópios, microscópios, aceleradores de partículas — ferramentas para ver o invisível. No centro, uma figura esguia de jaleco azul anota fórmulas num quadro que nunca acaba. 'Bem-vindo ao Laboratório do Conhecimento. Eu sou AXIOM. Antes de qualquer experimento, de qualquer descoberta — existe UMA pergunta. A ciência não é sobre respostas. É sobre as perguntas certas.'",
    narrativa: "Isaac Newton fez a pergunta certa: 'Por que a maçã cai?' Einstein fez a pergunta certa: 'O que aconteceria se eu viajasse na velocidade da luz?' Marie Curie fez a pergunta certa: 'De onde vem essa radiação misteriosa?' Todos eles não sabiam a resposta quando perguntaram. A genialidade está em PERGUNTAR.",
    pausas: [
      { pergunta: "O que AXIOM diz que antecede toda descoberta científica?", opcoes: ["A. Uma hipótese bem formulada", "B. Uma pergunta", "C. Um experimento controlado"], continuacoes: ["A hipótese vem depois da pergunta. Primeiro você pergunta, depois formula a hipótese para testar a pergunta.", "Correto! 'Antes de qualquer experimento, de qualquer descoberta — existe UMA pergunta. A ciência não é sobre respostas. É sobre as perguntas certas.'", "O experimento só faz sentido depois que você tem uma pergunta e uma hipótese. A pergunta é a origem de tudo."] },
      { pergunta: "Qual das seguintes perguntas representa a de Einstein mencionada no episódio?", opcoes: ["A. 'Por que a maçã cai?'", "B. 'O que aconteceria se eu viajasse na velocidade da luz?'", "C. 'De onde vem essa radiação misteriosa?'"], continuacoes: ["Essa foi a pergunta de Newton, não de Einstein. Cada um fez a pergunta certa para o seu tempo.", "Correto! 'Einstein fez a pergunta certa: 'O que aconteceria se eu viajasse na velocidade da luz?'' Dessa pergunta nasceu a Teoria da Relatividade.", "Essa foi a pergunta de Marie Curie. Einstein perguntou sobre viajar na velocidade da luz."] },
    ],
    encerramento: "'Você aprendeu a perguntar. Mas perguntas pedem hipóteses. Amanhã, a arte de prever o desconhecido.'",
  },
  metadata: { xpReward: 50, readingTimeMin: 8, pauseCount: 2, hasLogosGate: false, prevEpisode: null, nextEpisode: "A Arte da Hipótese" },
  source: "manual", status: "published", version: 1,
};

export const AXIOM_T01E01_EDGES: NewKnowledgeGraphEdge[] = [
  { id: "kge-axiom-t01-e01-e02", fromUnitId: "ku-axiom-t01-e01", toUnitId: "ku-axiom-t01-e02", relationship: "next", weight: 1.0 },
];

/* ═══════════════════════════════════════════════════════════════════
   EPISÓDIO 2 — A Arte da Hipótese
   ═══════════════════════════════════════════════════════════════════ */

export const AXIOM_T01E02_UNIT: NewKnowledgeUnit = {
  id: "ku-axiom-t01-e02", title: "A Arte da Hipótese",
  slug: "axiom-t01-e02-arte-da-hipotese",
  learningObjective: "Entender como formular hipóteses testáveis.",
  cognitiveLevel: "understand", difficulty: "beginner", estimatedTimeMin: 8,
  skills: ["hypothesis","prediction"],
  tags: ["fundamentos","hipótese"], agentDomain: "axiom",
  version: 1, status: "published",
};

export const AXIOM_T01E02_ASSET: NewKnowledgeAsset = {
  id: "ka-axiom-t01-e02", knowledgeUnitId: "ku-axiom-t01-e02",
  agentId: "axiom", season: 1, episode: 2, type: "episode",
  content: {
    abertura: "O quadro de AXIOM se enche de previsões: 'Se eu fizer X, então Y vai acontecer.' Ele circula cada uma. 'Hipótese não é achismo. É uma previsão testável. Eu acho que vai chover ≠ Se a pressão atmosférica cair abaixo de X, a probabilidade de chuva é Y%. A diferença é que a segunda pode ser provada errada.'",
    narrativa: "Karl Popper definiu que a marca da ciência não é a prova — é a falseabilidade. Uma teoria que não pode ser provada ERRADA não é científica. 'Deus existe' não é falseável. 'A água ferve a 100°C ao nível do mar' é falseável. A ciência avança não provando o certo — mas eliminando o errado.",
    pausas: [
      { pergunta: "Qual a característica essencial de uma hipótese científica?", opcoes: ["A. Ser elegante e intuitiva", "B. Poder ser provada errada (falseabilidade)", "C. Ser confirmada por autoridades"], continuacoes: ["Elegância é desejável, mas não é essencial. O que define a ciência é a possibilidade de ser testada e refutada.", "Correto! 'A marca da ciência não é a prova — é a falseabilidade. Uma teoria que não pode ser provada ERRADA não é científica.'", "Autoridades não definem ciência. A ciência avança eliminando o que está errado, independentemente de quem disse o quê."] },
      { pergunta: "'Eu acho que vai chover' é diferente de 'se a pressão cair abaixo de X, a probabilidade de chuva é Y%'. Qual a diferença fundamental?", opcoes: ["A. A primeira é mais curta", "B. A segunda pode ser testada e provada errada", "C. A primeira foi dita por um especialista"], continuacoes: ["O tamanho da frase não importa. A diferença fundamental é que a segunda afirmação pode ser verificada, medida e refutada.", "Exato! A segunda é uma hipótese testável. A primeira é um palpite. A ciência se constrói sobre previsões que podem ser validadas ou descartadas.", "Quem disse é irrelevante para a validade científica. O que importa é se a afirmação pode ser submetida a teste."] },
    ],
    encerramento: "'Você formulou hipóteses. Mas hipóteses precisam ser testadas. Amanhã, o experimento.'",
  },
  metadata: { xpReward: 50, readingTimeMin: 8, pauseCount: 2, hasLogosGate: false, prevEpisode: "A Pergunta Certa", nextEpisode: "O Experimento" },
  source: "manual", status: "published", version: 1,
};

export const AXIOM_T01E02_EDGES: NewKnowledgeGraphEdge[] = [
  { id: "kge-axiom-t01-e02-e03", fromUnitId: "ku-axiom-t01-e02", toUnitId: "ku-axiom-t01-e03", relationship: "next", weight: 1.0 },
];

/* ═══════════════════════════════════════════════════════════════════
   EPISÓDIO 3 — O Experimento 🛡️ LOGOS
   ═══════════════════════════════════════════════════════════════════ */

export const AXIOM_T01E03_UNIT: NewKnowledgeUnit = {
  id: "ku-axiom-t01-e03", title: "O Experimento",
  slug: "axiom-t01-e03-o-experimento",
  learningObjective: "Aplicar método experimental controlado para testar hipóteses.",
  cognitiveLevel: "understand", difficulty: "beginner", estimatedTimeMin: 8,
  skills: ["experiment","variables"],
  tags: ["fundamentos","experimento"], agentDomain: "axiom",
  version: 1, status: "published",
};

export const AXIOM_T01E03_ASSET: NewKnowledgeAsset = {
  id: "ka-axiom-t01-e03", knowledgeUnitId: "ku-axiom-t01-e03",
  agentId: "axiom", season: 1, episode: 3, type: "episode",
  content: {
    abertura: "O laboratório se transforma numa arena de testes. Variáveis flutuam no ar: temperatura, pressão, tempo. AXIOM ajusta cada uma com precisão cirúrgica. 'Experimento não é 'vamos ver o que acontece'. É: 'mantendo todas as outras variáveis constantes, mudo APENAS esta — e observo o resultado'. Uma variável por vez. Esse é o segredo.'",
    narrativa: "Os irmãos Wright testaram mais de 200 formatos de asa num túnel de vento caseiro. Uma variável de cada vez. Curvatura, comprimento, ângulo. Não foi genialidade — foi MÉTODO. A genialidade está em seguir o método quando todos ao redor estão chutando.",
    pausas: [
      { pergunta: "Quantos formatos de asa os irmãos Wright testaram no túnel de vento?", opcoes: ["A. 50", "B. 200", "C. 500"], continuacoes: ["Foi muito mais que 50. Os irmãos Wright foram metódicos — testaram mais de 200 formatos, um de cada vez.", "Correto! 'Os irmãos Wright testaram mais de 200 formatos de asa num túnel de vento caseiro. Uma variável de cada vez.' Isso é método.", "Não foram tantos, mas 200 já é impressionante para um túnel de vento caseiro construído por dois ciclistas!"] },
      { pergunta: "Qual o segredo de um bom experimento, segundo AXIOM?", opcoes: ["A. Testar múltiplas variáveis simultaneamente para economizar tempo", "B. Manter todas as variáveis constantes e mudar apenas uma", "C. Usar equipamentos caros e sofisticados"], continuacoes: ["Mudar várias coisas ao mesmo tempo não permite saber o que causou o resultado. Esse é o erro mais comum.", "Exato! 'Mantendo todas as outras variáveis constantes, mudo APENAS esta — e observo o resultado. Uma variável por vez.' Esse é o segredo.", "Equipamentos ajudam, mas não são o segredo. Os irmãos Wright usaram um túnel de vento caseiro e mudaram a história da aviação com método."] },
    ],
    encerramento: "'Você experimentou. Mas dados brutos não são conhecimento. Amanhã, como ler os números.'",
  },
  metadata: { xpReward: 50, readingTimeMin: 8, pauseCount: 2, hasLogosGate: true, prevEpisode: "A Arte da Hipótese", nextEpisode: "A Voz dos Dados" },
  source: "manual", status: "published", version: 1,
};

export const AXIOM_T01E03_EDGES: NewKnowledgeGraphEdge[] = [];

/* ═══════════════════════════════════════════════════════════════════
   EPISÓDIO 4 — A Voz dos Dados
   ═══════════════════════════════════════════════════════════════════ */

export const AXIOM_T01E04_UNIT: NewKnowledgeUnit = {
  id: "ku-axiom-t01-e04", title: "A Voz dos Dados",
  slug: "axiom-t01-e04-voz-dos-dados",
  learningObjective: "Aplicar análise estatística para extrair significado de dados brutos.",
  cognitiveLevel: "apply", difficulty: "beginner", estimatedTimeMin: 8,
  skills: ["statistics","data-analysis"],
  tags: ["fundamentos","dados"], agentDomain: "axiom",
  version: 1, status: "published",
};

export const AXIOM_T01E04_ASSET: NewKnowledgeAsset = {
  id: "ka-axiom-t01-e04", knowledgeUnitId: "ku-axiom-t01-e04",
  agentId: "axiom", season: 1, episode: 4, type: "episode",
  content: {
    abertura: "Números dançam no ar — milhões deles. AXIOM os organiza em gráficos, curvas, distribuições. 'Dados são como testemunhas num tribunal. Sozinhos, dizem pouco. Bem interrogados, revelam a verdade.'",
    narrativa: "Em 1854, Londres sofria uma epidemia de cólera. Todos achavam que era 'miasma' — ar ruim. John Snow fez um MAPA de onde as vítimas moravam. Todas bebiam da mesma bomba d'água. Ele removeu a bomba. A epidemia parou. Nenhum remédio. Nenhuma poção. Apenas DADOS.",
    pausas: [
      { pergunta: "O que John Snow fez para combater a epidemia de cólera em Londres em 1854?", opcoes: ["A. Criou uma vacina", "B. Fez um mapa mostrando onde as vítimas moravam", "C. Isolou todos os doentes em quarentena"], continuacoes: ["Não existia vacina na época. John Snow usou dados — um mapa — para encontrar a origem do surto.", "Correto! 'Ele fez um MAPA de onde as vítimas moravam. Todas bebiam da mesma bomba d'água. Ele removeu a bomba. A epidemia parou.'", "Isolar doentes não teria resolvido, pois a fonte era a água contaminada. Foram os dados que revelaram a causa verdadeira."] },
      { pergunta: "O que efetivamente parou a epidemia de cólera?", opcoes: ["A. Um remédio milagroso", "B. A remoção da bomba d'água contaminada", "C. A chegada do inverno"], continuacoes: ["Não houve remédio. 'Nenhum remédio. Nenhuma poção. Apenas DADOS.' John Snow usou informação para agir com precisão.", "Exato! Ele removeu a bomba d'água que todos os doentes usavam. A epidemia parou imediatamente. Isso é o poder dos dados bem interpretados.", "O inverno não teve nada a ver. A epidemia parou porque a fonte de contaminação foi identificada e eliminada usando análise de dados."] },
    ],
    encerramento: "'Você ouviu os dados. Mas dados podem mentir. Amanhã, os vieses que enganam até os melhores cientistas.'",
  },
  metadata: { xpReward: 50, readingTimeMin: 8, pauseCount: 2, hasLogosGate: false, prevEpisode: "O Experimento", nextEpisode: "Os Vieses do Cientista" },
  source: "manual", status: "published", version: 1,
};

export const AXIOM_T01E04_EDGES: NewKnowledgeGraphEdge[] = [
  { id: "kge-axiom-t01-e04-e05", fromUnitId: "ku-axiom-t01-e04", toUnitId: "ku-axiom-t01-e05", relationship: "next", weight: 1.0 },
];

/* ═══════════════════════════════════════════════════════════════════
   EPISÓDIO 5 — Os Vieses do Cientista
   ═══════════════════════════════════════════════════════════════════ */

export const AXIOM_T01E05_UNIT: NewKnowledgeUnit = {
  id: "ku-axiom-t01-e05", title: "Os Vieses do Cientista",
  slug: "axiom-t01-e05-vieses-do-cientista",
  learningObjective: "Entender vieses cognitivos que afetam a pesquisa.",
  cognitiveLevel: "understand", difficulty: "beginner", estimatedTimeMin: 8,
  skills: ["cognitive-bias","objectivity"],
  tags: ["fundamentos","vieses"], agentDomain: "axiom",
  version: 1, status: "published",
};

export const AXIOM_T01E05_ASSET: NewKnowledgeAsset = {
  id: "ka-axiom-t01-e05", knowledgeUnitId: "ku-axiom-t01-e05",
  agentId: "axiom", season: 1, episode: 5, type: "episode",
  content: {
    abertura: "AXIOM coloca óculos distorcidos e o laboratório se deforma. 'Nós, cientistas, temos um problema: somos humanos. E humanos têm vieses. Viés de confirmação: ver só o que confirma sua teoria. Viés de publicação: só publicar resultados positivos. A ciência não é a busca pela verdade — é a busca por estar MENOS errado.'",
    narrativa: "Em 2015, um estudo tentou replicar 100 experimentos de psicologia publicados em revistas de prestígio. Apenas 36% se confirmaram. Não por fraude — por vieses sutis. A ciência se corrige, mas dói. O remédio: pré-registro de experimentos, revisão por pares, replicação.",
    pausas: [
      { pergunta: "Em 2015, quantos porcento dos experimentos de psicologia foram replicados com sucesso?", opcoes: ["A. 36%", "B. 50%", "C. 72%"], continuacoes: ["Correto. Apenas 36% se confirmaram. 'Não por fraude — por vieses sutis.' Isso mostra como o viés pode contaminar até a ciência de alto nível.", "Infelizmente foi menos da metade. Apenas 36% conseguiram ser replicados, revelando uma crise de reprodutibilidade.", "Foi bem menos que 72%. O resultado de 36% chocou a comunidade científica e levou a mudanças importantes nos métodos de pesquisa."] },
      { pergunta: "O que é o viés de confirmação?", opcoes: ["A. Publicar apenas resultados positivos", "B. Ver apenas o que confirma sua teoria", "C. Repetir experimentos até dar o resultado esperado"], continuacoes: ["Esse é o viés de publicação, outro problema sério. O viés de confirmação é diferente: é prestar atenção só no que reforça sua crença.", "Correto! 'Viés de confirmação: ver só o que confirma sua teoria.' Nosso cérebro busca ativamente evidências que nos dão razão.", "Isso seria fraude científica. O viés de confirmação é mais sutil — você nem percebe que está ignorando evidências contrárias."] },
    ],
    encerramento: "'Você reconheceu os vieses. Mas a ciência de ponta acontece na fronteira. Amanhã, o desconhecido.'",
  },
  metadata: { xpReward: 50, readingTimeMin: 8, pauseCount: 2, hasLogosGate: false, prevEpisode: "A Voz dos Dados", nextEpisode: "A Fronteira do Conhecimento" },
  source: "manual", status: "published", version: 1,
};

export const AXIOM_T01E05_EDGES: NewKnowledgeGraphEdge[] = [
  { id: "kge-axiom-t01-e05-e06", fromUnitId: "ku-axiom-t01-e05", toUnitId: "ku-axiom-t01-e06", relationship: "next", weight: 1.0 },
];

/* ═══════════════════════════════════════════════════════════════════
   EPISÓDIO 6 — A Fronteira do Conhecimento 🛡️ LOGOS
   ═══════════════════════════════════════════════════════════════════ */

export const AXIOM_T01E06_UNIT: NewKnowledgeUnit = {
  id: "ku-axiom-t01-e06", title: "A Fronteira do Conhecimento",
  slug: "axiom-t01-e06-fronteira-do-conhecimento",
  learningObjective: "Aplicar pensamento de fronteira para explorar o desconhecido.",
  cognitiveLevel: "apply", difficulty: "beginner", estimatedTimeMin: 8,
  skills: ["frontier-science","uncertainty"],
  tags: ["fundamentos","fronteira"], agentDomain: "axiom",
  version: 1, status: "published",
};

export const AXIOM_T01E06_ASSET: NewKnowledgeAsset = {
  id: "ka-axiom-t01-e06", knowledgeUnitId: "ku-axiom-t01-e06",
  agentId: "axiom", season: 1, episode: 6, type: "episode",
  content: {
    abertura: "O laboratório se expande até o horizonte do universo conhecido. Além, escuridão — o desconhecido. AXIOM aponta para a escuridão. 'Tudo que sabemos — todas as leis, teorias, certezas — cabe nesta sala. Lá fora está 95% do universo. Matéria escura. Energia escura. O desconhecido não é assustador. É o convite.'",
    narrativa: "Em 1900, Lord Kelvin declarou que a física estava 'completa' — só faltavam 'duas nuvenzinhas'. Essas nuvens se tornaram a relatividade e a mecânica quântica. Toda vez que alguém diz 'já sabemos tudo', o universo ri e revela algo novo.",
    pausas: [
      { pergunta: "Quanto do universo ainda é desconhecido segundo AXIOM?", opcoes: ["A. 50%", "B. 75%", "C. 95%"], continuacoes: ["Muito mais que isso. Nosso conhecimento do universo é surpreendentemente pequeno — apenas 5% do que existe.", "Mais de 75%. A matéria escura e a energia escura compõem 95% do universo — e mal sabemos o que são.", "Exato! 'Tudo que sabemos — todas as leis, teorias, certezas — cabe nesta sala. Lá fora está 95% do universo.'"] },
      { pergunta: "O que aconteceu com as 'duas nuvenzinhas' que Lord Kelvin mencionou?", opcoes: ["A. Foram dissipadas pela ciência", "B. Transformaram-se na relatividade e na mecânica quântica", "C. Foram esquecidas pela comunidade científica"], continuacoes: ["Não foram dissipadas — elas se expandiram! 'Essas nuvens se tornaram a relatividade e a mecânica quântica.' O desconhecido virou revolução.", "Correto! 'Em 1900, Lord Kelvin declarou que a física estava 'completa' — só faltavam 'duas nuvenzinhas'. Essas nuvens se tornaram a relatividade e a mecânica quântica.'", "Longe de serem esquecidas — elas transformaram a física! Sempre que alguém diz 'já sabemos tudo', o universo ri."] },
    ],
    encerramento: "'Você encarou a fronteira. Mas descobertas não ficam no laboratório. Amanhã, da bancada para o mundo.'",
  },
  metadata: { xpReward: 50, readingTimeMin: 8, pauseCount: 2, hasLogosGate: true, prevEpisode: "Os Vieses do Cientista", nextEpisode: "Da Bancada ao Mundo" },
  source: "manual", status: "published", version: 1,
};

export const AXIOM_T01E06_EDGES: NewKnowledgeGraphEdge[] = [
  { id: "kge-axiom-t01-e06-e07", fromUnitId: "ku-axiom-t01-e06", toUnitId: "ku-axiom-t01-e07", relationship: "next", weight: 1.0 },
];

/* ═══════════════════════════════════════════════════════════════════
   EPISÓDIO 7 — Da Bancada ao Mundo
   ═══════════════════════════════════════════════════════════════════ */

export const AXIOM_T01E07_UNIT: NewKnowledgeUnit = {
  id: "ku-axiom-t01-e07", title: "Da Bancada ao Mundo",
  slug: "axiom-t01-e07-da-bancada-ao-mundo",
  learningObjective: "Aplicar transferência de descobertas científicas para impacto social.",
  cognitiveLevel: "apply", difficulty: "beginner", estimatedTimeMin: 8,
  skills: ["tech-transfer","impact"],
  tags: ["fundamentos","impacto"], agentDomain: "axiom",
  version: 1, status: "published",
};

export const AXIOM_T01E07_ASSET: NewKnowledgeAsset = {
  id: "ka-axiom-t01-e07", knowledgeUnitId: "ku-axiom-t01-e07",
  agentId: "axiom", season: 1, episode: 7, type: "episode",
  content: {
    abertura: "Uma ponte de luz conecta o laboratório a uma cidade. Descobertas viajam pela ponte e se transformam em vacinas, painéis solares, internet. 'Ciência que fica no papel é filosofia. Ciência que atravessa a ponte é revolução.'",
    narrativa: "A pesquisa de mRNA levou 30 anos para sair do laboratório. Quando saiu, virou a vacina da COVID em 11 meses. O conhecimento acumulado não foi perdido — estava esperando a pergunta certa.",
    pausas: [
      { pergunta: "Quantos anos a pesquisa de mRNA levou para sair do laboratório até virar vacina?", opcoes: ["A. 10 anos", "B. 30 anos", "C. 50 anos"], continuacoes: ["Foi bem mais que uma década. Foram 30 anos de pesquisa básica até que o conhecimento acumulado encontrasse a aplicação certa.", "Correto! 'A pesquisa de mRNA levou 30 anos para sair do laboratório. Quando saiu, virou a vacina da COVID em 11 meses.'", "Quase — foram 30 anos, não 50. Mas mesmo 30 anos mostram que ciência de ponta exige paciência e persistência."] },
      { pergunta: "O que transforma a ciência em revolução, segundo AXIOM?", opcoes: ["A. Ser publicada em revistas de prestígio", "B. Atravessar a ponte do laboratório para o mundo", "C. Ganhar prêmios Nobel"], continuacoes: ["Publicação é importante, mas não suficiente. O conhecimento precisa sair do papel e impactar a vida das pessoas.", "Exato! 'Ciência que fica no papel é filosofia. Ciência que atravessa a ponte é revolução.' A ponte conecta descoberta a impacto.", "Prêmios reconhecem, não criam revolução. A verdadeira transformação acontece quando a descoberta chega a quem precisa."] },
    ],
    encerramento: "'Você conectou ciência e mundo. Mas a ética é o freio e o acelerador. Amanhã, os limites.'",
  },
  metadata: { xpReward: 50, readingTimeMin: 8, pauseCount: 2, hasLogosGate: false, prevEpisode: "A Fronteira do Conhecimento", nextEpisode: "Os Limites da Ciência" },
  source: "manual", status: "published", version: 1,
};

export const AXIOM_T01E07_EDGES: NewKnowledgeGraphEdge[] = [
  { id: "kge-axiom-t01-e07-e08", fromUnitId: "ku-axiom-t01-e07", toUnitId: "ku-axiom-t01-e08", relationship: "next", weight: 1.0 },
];

/* ═══════════════════════════════════════════════════════════════════
   EPISÓDIO 8 — Os Limites da Ciência
   ═══════════════════════════════════════════════════════════════════ */

export const AXIOM_T01E08_UNIT: NewKnowledgeUnit = {
  id: "ku-axiom-t01-e08", title: "Os Limites da Ciência",
  slug: "axiom-t01-e08-limites-da-ciencia",
  learningObjective: "Aplicar discernimento ético sobre os limites da experimentação.",
  cognitiveLevel: "apply", difficulty: "beginner", estimatedTimeMin: 8,
  skills: ["ethics","limits"],
  tags: ["fundamentos","limites"], agentDomain: "axiom",
  version: 1, status: "published",
};

export const AXIOM_T01E08_ASSET: NewKnowledgeAsset = {
  id: "ka-axiom-t01-e08", knowledgeUnitId: "ku-axiom-t01-e08",
  agentId: "axiom", season: 1, episode: 8, type: "episode",
  content: {
    abertura: "AXIOM traça uma linha vermelha no chão. 'A ciência pode clonar ovelhas, editar genes, criar inteligência. Mas PODER fazer é diferente de DEVER fazer. A ética não é inimiga da ciência. É sua bússola.'",
    narrativa: "Crispr pode curar doenças genéticas — ou criar bebês 'projetados'. Energia nuclear pode iluminar cidades — ou destruí-las. Toda descoberta é uma ferramenta. O martelo pode construir ou matar. A decisão é nossa.",
    pausas: [
      { pergunta: "Segundo AXIOM, PODER fazer é diferente de:", opcoes: ["A. SABER fazer", "B. DEVER fazer", "C. QUERER fazer"], continuacoes: ["Saber fazer é parte do poder técnico. A questão ética vai além do conhecimento.", "Correto! 'PODER fazer é diferente de DEVER fazer. A ética não é inimiga da ciência. É sua bússola.'", "Querer fazer é desejo, não ética. A pergunta que AXIOM nos convida a fazer é mais profunda."] },
      { pergunta: "Qual o papel da ética na ciência, na visão de AXIOM?", opcoes: ["A. Ser uma limitadora do progresso", "B. Ser a bússola que orienta o uso da descoberta", "C. Ser irrelevante para a pesquisa pura"], continuacoes: ["Ética não é inimiga do progresso — ela o direciona. 'O martelo pode construir ou matar. A decisão é nossa.'", "Exato! 'A ética não é inimiga da ciência. É sua bússola.' Sem ela, a ciência navega sem direção.", "Não existe pesquisa neutra. Toda descoberta traz responsabilidade. Ignorar a ética é uma escolha perigosa."] },
    ],
    encerramento: "'Você entendeu os limites. Amanhã, a colaboração que transcende fronteiras.'",
  },
  metadata: { xpReward: 50, readingTimeMin: 8, pauseCount: 2, hasLogosGate: false, prevEpisode: "Da Bancada ao Mundo", nextEpisode: "Ciência sem Fronteiras" },
  source: "manual", status: "published", version: 1,
};

export const AXIOM_T01E08_EDGES: NewKnowledgeGraphEdge[] = [
  { id: "kge-axiom-t01-e08-e09", fromUnitId: "ku-axiom-t01-e08", toUnitId: "ku-axiom-t01-e09", relationship: "next", weight: 1.0 },
];

/* ═══════════════════════════════════════════════════════════════════
   EPISÓDIO 9 — Ciência sem Fronteiras 🛡️ LOGOS
   ═══════════════════════════════════════════════════════════════════ */

export const AXIOM_T01E09_UNIT: NewKnowledgeUnit = {
  id: "ku-axiom-t01-e09", title: "Ciência sem Fronteiras",
  slug: "axiom-t01-e09-ciencia-sem-fronteiras",
  learningObjective: "Aplicar colaboração científica global como modelo de progresso humano.",
  cognitiveLevel: "apply", difficulty: "beginner", estimatedTimeMin: 8,
  skills: ["global-science","collaboration"],
  tags: ["fundamentos","global"], agentDomain: "axiom",
  version: 1, status: "published",
};

export const AXIOM_T01E09_ASSET: NewKnowledgeAsset = {
  id: "ka-axiom-t01-e09", knowledgeUnitId: "ku-axiom-t01-e09",
  agentId: "axiom", season: 1, episode: 9, type: "episode",
  content: {
    abertura: "O laboratório se enche de hologramas — cientistas de todos os países, etnias, gêneros. Trabalhando juntos. AXIOM sorri. 'A Estação Espacial Internacional foi construída por 15 nações — incluindo rivais geopolíticos. Na ciência, não há 'eles' e 'nós'. Há 'nós' e o desconhecido.'",
    narrativa: "O Projeto Genoma Humano foi uma colaboração de 20 países. O COVID-19 foi sequenciado e compartilhado globalmente em dias. A internet nasceu da colaboração científica. As maiores conquistas da humanidade não são de uma nação — são da espécie.",
    pausas: [
      { pergunta: "Quantas nações colaboraram na construção da Estação Espacial Internacional?", opcoes: ["A. 10", "B. 15", "C. 20"], continuacoes: ["Quase — foram 15 nações. Países que eram rivais geopolíticos na Terra se uniram para construir algo no espaço.", "Correto! 'A Estação Espacial Internacional foi construída por 15 nações — incluindo rivais geopolíticos. Na ciência, não há 'eles' e 'nós'.'", "Não chegaram a 20, mas 15 nações já é impressionante — especialmente considerando que algumas eram rivais políticas."] },
      { pergunta: "Segundo AXIOM, as maiores conquistas da humanidade são de:", opcoes: ["A. Uma única nação líder", "B. A espécie humana como um todo", "C. Grandes gênios individuais"], continuacoes: ["Nenhuma grande conquista científica moderna é obra de uma nação só.", "Correto! 'As maiores conquistas da humanidade não são de uma nação — são da espécie.' O conhecimento não tem fronteiras.", "Gênios existem, mas eles se apoiam em descobertas de incontáveis outros. A ciência é o empreendimento colaborativo mais bem-sucedido da humanidade."] },
    ],
    encerramento: "'Você viu a ciência global. Mas o maior laboratório é a mente. Amanhã, o cientista interior.'",
  },
  metadata: { xpReward: 50, readingTimeMin: 8, pauseCount: 2, hasLogosGate: true, prevEpisode: "Os Limites da Ciência", nextEpisode: "O Cientista Interior" },
  source: "manual", status: "published", version: 1,
};

export const AXIOM_T01E09_EDGES: NewKnowledgeGraphEdge[] = [
  { id: "kge-axiom-t01-e09-e10", fromUnitId: "ku-axiom-t01-e09", toUnitId: "ku-axiom-t01-e10", relationship: "next", weight: 1.0 },
];

/* ═══════════════════════════════════════════════════════════════════
   EPISÓDIO 10 — O Cientista Interior
   ═══════════════════════════════════════════════════════════════════ */

export const AXIOM_T01E10_UNIT: NewKnowledgeUnit = {
  id: "ku-axiom-t01-e10", title: "O Cientista Interior",
  slug: "axiom-t01-e10-cientista-interior",
  learningObjective: "Sintetizar o método científico como prática pessoal diária.",
  cognitiveLevel: "evaluate", difficulty: "beginner", estimatedTimeMin: 8,
  skills: ["synthesis","inner-scientist"],
  tags: ["fundamentos","interior"], agentDomain: "axiom",
  version: 1, status: "published",
};

export const AXIOM_T01E10_ASSET: NewKnowledgeAsset = {
  id: "ka-axiom-t01-e10", knowledgeUnitId: "ku-axiom-t01-e10",
  agentId: "axiom", season: 1, episode: 10, type: "episode",
  content: {
    abertura: "O laboratório se transforma num espelho. Você vê seu reflexo — mas com olhos curiosos. AXIOM está ao seu lado. 'Dez lições. Um método. Você não precisa de um PhD para pensar como cientista. Precisa de curiosidade e humildade para estar errado.'",
    narrativa: "Você aprendeu a perguntar, hipotetizar, experimentar, analisar. A reconhecer vieses. A explorar fronteiras. A respeitar limites. A colaborar globalmente. AXIOM entrega um caderno de notas. 'O laboratório fecha. Mas o cientista em você nunca dorme. Questione. Teste. Duvide. Descubra.'",
    pausas: [
      { pergunta: "O que você precisa para pensar como cientista, segundo AXIOM?", opcoes: ["A. Um PhD em ciências", "B. Curiosidade e humildade para estar errado", "C. Um laboratório equipado"], continuacoes: ["Não é necessário título acadêmico! 'Você não precisa de um PhD para pensar como cientista. Precisa de curiosidade e humildade para estar errado.'", "Correto! Curiosidade para perguntar, humildade para aceitar quando se está errado. Essas são as ferramentas essenciais.", "Laboratórios ajudam, mas a ciência começa na mente. Com papel, caneta e as perguntas certas, qualquer um pode pensar como cientista."] },
      { pergunta: "O que AXIOM entrega ao aprendiz no final do episódio?", opcoes: ["A. Um telescópio", "B. Um caderno de notas", "C. Um jaleco de laboratório"], continuacoes: ["Telescópio foi AURORA que entregou. AXIOM entrega algo mais simples e poderoso: um caderno para registrar perguntas e descobertas.", "Exato! 'AXIOM entrega um caderno de notas. 'O laboratório fecha. Mas o cientista em você nunca dorme. Questione. Teste. Duvide. Descubra.''", "Jaleco é simbólico. AXIOM prefere dar ferramentas práticas — um caderno para continuar a jornada científica além do laboratório."] },
    ],
    encerramento: "'NEXUS pensa. CIPHER protege. VOLT constrói. KAOS quebra. ETHOS escolhe. LYRA sente. AURORA vê. TERRA cuida. Eu QUESTIONO. E questionar é o primeiro ato de inteligência.'",
  },
  metadata: { xpReward: 50, readingTimeMin: 8, pauseCount: 2, hasLogosGate: false, prevEpisode: "Ciência sem Fronteiras", nextEpisode: null },
  source: "manual", status: "published", version: 1,
};

export const AXIOM_T01E10_EDGES: NewKnowledgeGraphEdge[] = [];
