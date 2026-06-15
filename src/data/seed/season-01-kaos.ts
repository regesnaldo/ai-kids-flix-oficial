// ─── src/data/seed/season-01-kaos.ts ────────────────────────────────────────
//
// KAOS — Temporada 1: Criatividade Caótica e Inovação Disruptiva
// Agente: KAOS (Explorador do Inesperado) · Cor: #EF4444 (vermelho)
// Padrão canônico MENTE.AI — mesmo template de NEXUS/VOLT/CIPHER T01

import type { NewKnowledgeUnit, NewKnowledgeAsset, NewKnowledgeGraphEdge } from "@/lib/db/schema";

/* ═══════════════════════════════════════════════════════════════════
   EPISÓDIO 1 — O Caos Criativo
   ═══════════════════════════════════════════════════════════════════
   KAOS recebe o aprendiz no Olho da Tempestade — um vórtice de ideias.
   Gancho E02: "Você quebrou a primeira regra. Agora vamos quebrar todas." */

export const KAOS_T01E01_UNIT: NewKnowledgeUnit = {
  id: "ku-kaos-t01-e01", title: "O Caos Criativo",
  slug: "kaos-t01-e01-caos-criativo",
  learningObjective: "Ao final, o aprendiz será capaz de entender que o caos controlado é uma fonte poderosa de criatividade e inovação.",
  cognitiveLevel: "remember", difficulty: "beginner", estimatedTimeMin: 8,
  skills: ["creative-chaos", "divergent-thinking", "breaking-patterns"],
  tags: ["fundamentos", "criatividade", "caos"], agentDomain: "kaos",
  version: 1, status: "published",
};

export const KAOS_T01E01_ASSET: NewKnowledgeAsset = {
  id: "ka-kaos-t01-e01", knowledgeUnitId: "ku-kaos-t01-e01",
  agentId: "kaos", season: 1, episode: 1, type: "episode",
  content: {
    abertura: "Você está no centro de um tornado. Mas não é um tornado de vento — é um vórtice de ideias. Fragmentos de invenções giram ao seu redor: metade de um avião, um pedaço de sinfonia, uma equação incompleta. No olho da tempestade, uma figura de cabelo vermelho desgrenhado ri enquanto rabisca num quadro que se apaga e reescreve sozinho. 'Bem-vindo ao Olho da Tempestade! Eu sou KAOS. E a primeira coisa que você precisa saber é: a ordem é uma ilusão. Toda grande ideia nasceu de uma bagunça.'",
    narrativa: "O Post-it foi um acidente. Um cientista da 3M tentava criar uma supercola e falhou — criou uma cola que grudava, mas não muito. Anos depois, um colega lembrou da cola 'que não colava' e nasceu o Post-it. O micro-ondas foi descoberto quando um engenheiro percebeu que uma barra de chocolate derreteu no bolso perto de um radar. A penicilina nasceu de um fungo que contaminou uma cultura de bactérias por acidente. KAOS aponta para o quadro: 'Três das maiores invenções da humanidade. Todas acidentais. O erro não é o oposto do acerto — é o caminho.'",
    pausas: [
      { pergunta: "Como o Post-it foi inventado?", opcoes: ["A. Alguém pediu especificamente uma cola que grudasse pouco", "B. Um cientista tentou criar uma supercola e falhou — o 'erro' virou o produto", "C. Foi copiado de uma invenção japonesa"], continuacoes: ["Não foi planejado! A falha em criar uma supercola gerou uma cola 'fraca'. Mas alguém viu valor nessa fraqueza.", "Exato! O 'fracasso' de um objetivo gerou um produto bilionário. A lição: às vezes o erro é mais valioso que o acerto.", "Não foi cópia. Foi um acidente que alguém teve a sabedoria de não jogar fora. Guardar os 'erros' é uma estratégia criativa."] },
      { pergunta: "O que o micro-ondas, o Post-it e a penicilina têm em comum?", opcoes: ["A. Todos foram criados por gênios em laboratórios impecáveis", "B. Todos foram descobertos por acidente — alguém prestou atenção a algo inesperado", "C. Todos foram encomendados por governos"], continuacoes: ["Laboratórios reais são bagunçados! As grandes descobertas raramente acontecem em ambientes estéreis.", "Sim! A serendipidade — a arte de encontrar algo valioso que você não estava procurando — é o motor da inovação.", "Nenhum governo encomendou penicilina. Ela simplesmente... apareceu. E mudou a medicina para sempre."] },
    ],
    encerramento: "O tornado desacelera. KAOS entrega um giz vermelho. 'Você entendeu: o erro é matéria-prima. Mas existe uma diferença entre errar sem direção e errar com propósito. Amanhã, vou te ensinar a quebrar padrões de propósito.'",
  },
  metadata: { xpReward: 50, readingTimeMin: 8, pauseCount: 2, hasLogosGate: false, prevEpisode: null, nextEpisode: "Quebrando Padrões" },
  source: "manual", status: "published", version: 1,
};

export const KAOS_T01E01_EDGES: NewKnowledgeGraphEdge[] = [
  { id: "kge-kaos-t01-e01-e02", fromUnitId: "ku-kaos-t01-e01", toUnitId: "ku-kaos-t01-e02", relationship: "next", weight: 1.0 },
];

/* ═══════ EPISÓDIO 2 — Quebrando Padrões ═══════ */

export const KAOS_T01E02_UNIT: NewKnowledgeUnit = {
  id: "ku-kaos-t01-e02", title: "Quebrando Padrões",
  slug: "kaos-t01-e02-quebrando-padroes",
  learningObjective: "Ao final, o aprendiz será capaz de identificar padrões mentais limitantes e usar técnicas de ruptura para gerar ideias originais.",
  cognitiveLevel: "understand", difficulty: "beginner", estimatedTimeMin: 8,
  skills: ["pattern-breaking", "lateral-thinking", "assumptions"],
  tags: ["fundamentos", "padrões", "ruptura"], agentDomain: "kaos",
  version: 1, status: "published",
};

export const KAOS_T01E02_ASSET: NewKnowledgeAsset = {
  id: "ka-kaos-t01-e02", knowledgeUnitId: "ku-kaos-t01-e02",
  agentId: "kaos", season: 1, episode: 2, type: "episode",
  content: {
    abertura: "O quadro de KAOS agora mostra uma linha reta. Ele pega o giz vermelho que te deu e — CRACK — quebra a linha no meio. 'Isso é o que a maioria das pessoas faz com ideias: segue em linha reta. Mas as maiores ideias não estão na linha. Estão fora dela.' O quadro se enche de rabiscos que vão em todas as direções.",
    narrativa: "Tem um exercício clássico de criatividade: 'Quantos usos você consegue pensar para um tijolo?' A maioria das pessoas diz: construir parede, calçar porta, quebrar janela. Mas as respostas criativas são: peso de papel, arma improvisada, instrumento musical, aquecedor (se aquecido). O que mudou? A pergunta foi a mesma. O que mudou foi a disposição de quebrar o padrão — de pensar no tijolo não como material de construção, mas como OBJETO com propriedades: pesado, duro, áspero, que armazena calor.",
    pausas: [
      { pergunta: "Por que a maioria das pessoas só pensa em 'construir parede' quando vê um tijolo?", opcoes: ["A. Porque é o uso correto e outros usos são errados", "B. Porque fomos condicionados a ver objetos pela função, não pelas propriedades", "C. Porque tijolos são perigosos para outros usos"], continuacoes: ["Não existe 'uso correto' — existe uso convencional. Criatividade é ver além da convenção.", "Exato! O tijolo é PESADO, DURO, ÁSPERO. Cada propriedade sugere dezenas de usos diferentes.", "Não é sobre segurança — é sobre imaginação. Um tijolo pode ser um peso de papel tão bem quanto uma pedra."] },
      { pergunta: "Qual a técnica para quebrar padrões de pensamento?", opcoes: ["A. Esperar a inspiração chegar naturalmente", "B. Listar PROPRIEDADES do objeto, não funções — e pensar em usos para cada propriedade", "C. Perguntar para outras pessoas o que elas fariam"], continuacoes: ["Inspiração é importante, mas técnica é mais confiável. Você não espera a inspiração para escovar os dentes.", "Perfeito! Essa é a técnica de 'desconstrução por propriedades'. Funciona com objetos, problemas, até relacionamentos.", "Perguntar ajuda, mas a técnica te dá autonomia. Você não precisa de outras pessoas para pensar diferente."] },
    ],
    encerramento: "O quadro agora é um emaranhado de linhas coloridas. 'Você quebrou padrões. Mas existe uma ferramenta ainda mais poderosa: o pensamento lateral — resolver problemas pelo lado que ninguém está olhando. Amanhã.'",
  },
  metadata: { xpReward: 50, readingTimeMin: 7, pauseCount: 2, hasLogosGate: false, prevEpisode: "O Caos Criativo", nextEpisode: "Pensamento Lateral" },
  source: "manual", status: "published", version: 1,
};

export const KAOS_T01E02_EDGES: NewKnowledgeGraphEdge[] = [
  { id: "kge-kaos-t01-e02-e03", fromUnitId: "ku-kaos-t01-e02", toUnitId: "ku-kaos-t01-e03", relationship: "next", weight: 1.0 },
];

/* ═══════ EPISÓDIO 3 — Pensamento Lateral 🛡️ LOGOS ═══════ */

export const KAOS_T01E03_UNIT: NewKnowledgeUnit = {
  id: "ku-kaos-t01-e03", title: "Pensamento Lateral",
  slug: "kaos-t01-e03-pensamento-lateral",
  learningObjective: "Ao final, o aprendiz será capaz de aplicar técnicas de pensamento lateral para resolver problemas por ângulos não óbvios.",
  cognitiveLevel: "understand", difficulty: "beginner", estimatedTimeMin: 9,
  skills: ["lateral-thinking", "problem-solving", "creativity-techniques"],
  tags: ["fundamentos", "pensamento-lateral", "resolução"], agentDomain: "kaos",
  version: 1, status: "published",
};

export const KAOS_T01E03_ASSET: NewKnowledgeAsset = {
  id: "ka-kaos-t01-e03", knowledgeUnitId: "ku-kaos-t01-e03",
  agentId: "kaos", season: 1, episode: 3, type: "episode",
  content: {
    abertura: "Você está numa sala com uma porta trancada. Não há chave, não há maçaneta. Na parede, uma frase: 'A resposta não está na porta.' KAOS está sentado de pernas cruzadas no chão, desenhando círculos. 'Todo mundo olha para a porta. Mas a porta é o problema errado. O problema certo é: como sair desta sala? A porta é só uma das respostas.'",
    narrativa: "Edward de Bono criou o termo 'pensamento lateral' em 1967. A ideia é simples: em vez de aprofundar o pensamento na mesma direção (pensamento vertical), você muda de direção. O exemplo clássico: 'Um homem entra num bar e pede um copo d'água. O barman pega uma arma e aponta para ele. O homem diz obrigado e vai embora. Por quê?' Resposta: o homem estava com soluço. O barman o assustou de propósito para curar o soluço. Você pensou nisso? Provavelmente não — porque seu cérebro foi para 'violência', 'assalto', 'perigo'. Pensamento lateral é treinar seu cérebro para considerar possibilidades que não são óbvias.",
    pausas: [
      { pergunta: "Por que a maioria das pessoas não resolve o enigma do barman?", opcoes: ["A. Porque o enigma é mal formulado", "B. Porque o cérebro vai automaticamente para a interpretação mais óbvia — 'arma = perigo'", "C. Porque falta informação no enigma"], continuacoes: ["O enigma é perfeito. O problema não é ele — é nosso viés de interpretação.", "Exato! O cérebro é uma máquina de atalhos. Ele pega o caminho mais rápido, não o mais criativo.", "Toda informação está lá. O que falta é a disposição de considerar que 'arma' pode significar 'susto', não 'violência'."] },
      { pergunta: "O que é pensamento lateral?", opcoes: ["A. Pensar deitado em vez de sentado", "B. Abordar um problema por um ângulo diferente — mudar de direção em vez de aprofundar", "C. Uma técnica para resolver problemas matemáticos"], continuacoes: ["Não é sobre posição física! É sobre direção mental. Sair da linha reta e explorar os lados.", "Perfeito! Enquanto o pensamento vertical cava mais fundo, o lateral cava em outro lugar completamente diferente.", "Não é exclusivo da matemática. É aplicável a qualquer problema: negócios, arte, relacionamentos."] },
    ],
    encerramento: "KAOS se levanta e simplesmente empurra a parede — que era de papel o tempo todo. 'Você passou no teste. Mas o maior erro que as pessoas cometem não é pensar errado — é ter medo de errar. Amanhã, a arte do erro.'",
  },
  metadata: { xpReward: 50, readingTimeMin: 8, pauseCount: 2, hasLogosGate: true, logosGateEpisode: true, prevEpisode: "Quebrando Padrões", nextEpisode: "A Arte do Erro" },
  source: "manual", status: "published", version: 1,
};

export const KAOS_T01E03_EDGES: NewKnowledgeGraphEdge[] = [];

/* ═══════ EPISÓDIO 4 — A Arte do Erro ═══════ */

export const KAOS_T01E04_UNIT: NewKnowledgeUnit = {
  id: "ku-kaos-t01-e04", title: "A Arte do Erro",
  slug: "kaos-t01-e04-arte-do-erro",
  learningObjective: "Ao final, o aprendiz será capaz de transformar erros e falhas em oportunidades de aprendizado e inovação.",
  cognitiveLevel: "apply", difficulty: "beginner", estimatedTimeMin: 8,
  skills: ["learning-from-failure", "iteration", "resilience"],
  tags: ["fundamentos", "erro", "resiliência"], agentDomain: "kaos",
  version: 1, status: "published",
};

export const KAOS_T01E04_ASSET: NewKnowledgeAsset = {
  id: "ka-kaos-t01-e04", knowledgeUnitId: "ku-kaos-t01-e04",
  agentId: "kaos", season: 1, episode: 4, type: "episode",
  content: {
    abertura: "A sala se transforma numa galeria de arte. Mas as obras são... estranhas. Uma tela rasgada. Uma escultura quebrada. Uma sinfonia que desafina no meio. KAOS aponta para a tela rasgada: 'Esta é minha obra favorita. O artista ia jogar fora. Eu convenci ele a pendurar exatamente como estava. Sabe por quê? Porque o rasgo conta uma história que a tela perfeita nunca contaria.'",
    narrativa: "Thomas Edison fez 10.000 tentativas antes de criar a lâmpada. Um repórter perguntou: 'Como você se sente por ter falhado 10.000 vezes?' Edison respondeu: 'Eu não falhei. Eu descobri 10.000 maneiras que não funcionam.' KAOS ri. 'Essa é a diferença entre um gênio e um perfeccionista. O perfeccionista vê erro como derrota. O gênio vê erro como dado.'",
    pausas: [
      { pergunta: "O que Thomas Edison disse sobre suas 10.000 tentativas?", opcoes: ["A. 'Eu quero desistir — é impossível'", "B. 'Eu não falhei. Descobri 10.000 maneiras que não funcionam'", "C. 'Eu deveria ter contratado mais ajudantes'"], continuacoes: ["Edison era conhecido por sua persistência. Ele via cada 'falha' como um passo na direção certa.", "Exato! Cada tentativa 'fracassada' era um ponto de dados. Ele não estava perdendo — estava mapeando o território.", "Mais pessoas não resolvem o problema da atitude. Edison sozinho, com a mentalidade certa, mudou o mundo."] },
      { pergunta: "Qual a diferença entre um gênio e um perfeccionista, segundo KAOS?", opcoes: ["A. O gênio é mais inteligente; o perfeccionista é mais organizado", "B. O gênio vê erro como dado valioso; o perfeccionista vê erro como derrota", "C. Não há diferença real — os dois buscam excelência"], continuacoes: ["Não é sobre inteligência — é sobre interpretação do erro. O gênio usa o erro. O perfeccionista foge dele.", "Perfeito! A mesma falha pode paralisar um perfeccionista e iluminar um gênio. A diferença está na lente.", "Buscar excelência é nobre, mas o perfeccionismo paralisa. O gênio entrega versão 0.1. O perfeccionista nunca entrega."] },
    ],
    encerramento: "KAOS pega um pincel e pinta sobre o rasgo, transformando-o numa constelação. 'Você aprendeu a arte do erro. Mas erros isolados são só acidentes. Amanhã, vou te ensinar a conectar erros aparentemente desconexos — e criar algo novo.'",
  },
  metadata: { xpReward: 50, readingTimeMin: 8, pauseCount: 2, hasLogosGate: false, prevEpisode: "Pensamento Lateral", nextEpisode: "Conexões Improváveis" },
  source: "manual", status: "published", version: 1,
};

export const KAOS_T01E04_EDGES: NewKnowledgeGraphEdge[] = [
  { id: "kge-kaos-t01-e04-e05", fromUnitId: "ku-kaos-t01-e04", toUnitId: "ku-kaos-t01-e05", relationship: "next", weight: 1.0 },
];

/* ═══════ EPISÓDIO 5 — Conexões Improváveis ═══════ */

export const KAOS_T01E05_UNIT: NewKnowledgeUnit = {
  id: "ku-kaos-t01-e05", title: "Conexões Improváveis",
  slug: "kaos-t01-e05-conexoes-improvaveis",
  learningObjective: "Ao final, o aprendiz será capaz de usar a técnica de associação forçada para conectar ideias não relacionadas e gerar inovação.",
  cognitiveLevel: "understand", difficulty: "beginner", estimatedTimeMin: 8,
  skills: ["association", "serendipity", "cross-pollination"],
  tags: ["fundamentos", "conexões", "associação"], agentDomain: "kaos",
  version: 1, status: "published",
};

export const KAOS_T01E05_ASSET: NewKnowledgeAsset = {
  id: "ka-kaos-t01-e05", knowledgeUnitId: "ku-kaos-t01-e05",
  agentId: "kaos", season: 1, episode: 5, type: "episode",
  content: {
    abertura: "A galeria se transforma num mercado flutuante de ideias. Barracas vendem conceitos avulsos: 'gravidade', 'sushi', 'jazz', 'internet'. KAOS corre de uma barraca para outra como uma criança, pegando itens aleatórios e os esfregando um no outro. 'O velcro foi inventado por um engenheiro que voltava de uma caçada com o cachorro cheio de carrapichos grudados no pelo. Ele conectou: carrapicho + tecido = velcro. Isso é associação forçada.'",
    narrativa: "Steve Jobs disse que criatividade é 'conectar coisas'. Quando ele cursou caligrafia na faculdade, ninguém imaginava que aquilo seria útil. Anos depois, o Macintosh foi o primeiro computador com fontes bonitas. Jobs conectou: caligrafia + computador = tipografia digital. A técnica de associação forçada é simples: pegue dois conceitos aleatórios. Encontre 5 conexões entre eles. Não importa se são absurdas — o absurdo de hoje é a inovação de amanhã.",
    pausas: [
      { pergunta: "Como o velcro foi inventado?", opcoes: ["A. Por uma equipe de cientistas num laboratório de materiais", "B. Um engenheiro voltando de caçada notou carrapichos grudados no pelo do cachorro e conectou com tecido", "C. Foi comprado de uma empresa suíça"], continuacoes: ["Foi um engenheiro suíço, mas não em laboratório — foi num passeio no campo. A natureza deu a ideia.", "Exato! Carrapicho + tecido = velcro. Uma das invenções mais copiadas do mundo veio de um passeio com o cachorro.", "Não foi comprado — foi observado. A natureza é a maior inventora. Nós só precisamos prestar atenção."] },
      { pergunta: "O que Steve Jobs conectou para criar a tipografia do Mac?", opcoes: ["A. Ele contratou os melhores designers do mundo", "B. Ele conectou seu curso de caligrafia da faculdade com a tecnologia do computador", "C. Ele copiou o design da Microsoft"], continuacoes: ["Não foi contratação — foi conexão pessoal. Ninguém pediu para ele estudar caligrafia. Ele fez por curiosidade.", "Sim! Uma aula aparentemente inútil de caligrafia, anos depois, definiu o design de todos os computadores modernos.", "Jobs nunca copiou Microsoft. A Microsoft é que tentava copiar a Apple — inclusive a tipografia."] },
    ],
    encerramento: "KAOS junta duas ideias aleatórias do mercado — 'música' e 'medicina' — e elas brilham juntas. 'Você conectou o desconexo. Mas conexões são só faíscas. Amanhã, vou te ensinar a transformar faíscas em revoluções — a inovação disruptiva.'",
  },
  metadata: { xpReward: 50, readingTimeMin: 8, pauseCount: 2, hasLogosGate: false, prevEpisode: "A Arte do Erro", nextEpisode: "Inovação Disruptiva" },
  source: "manual", status: "published", version: 1,
};

export const KAOS_T01E05_EDGES: NewKnowledgeGraphEdge[] = [
  { id: "kge-kaos-t01-e05-e06", fromUnitId: "ku-kaos-t01-e05", toUnitId: "ku-kaos-t01-e06", relationship: "next", weight: 1.0 },
];

/* ═══════ EPISÓDIO 6 — Inovação Disruptiva 🛡️ LOGOS ═══════ */

export const KAOS_T01E06_UNIT: NewKnowledgeUnit = {
  id: "ku-kaos-t01-e06", title: "Inovação Disruptiva",
  slug: "kaos-t01-e06-inovacao-disruptiva",
  learningObjective: "Ao final, o aprendiz será capaz de explicar o conceito de inovação disruptiva e aplicá-lo para desafiar mercados estabelecidos.",
  cognitiveLevel: "apply", difficulty: "intermediate", estimatedTimeMin: 9,
  skills: ["disruptive-innovation", "market-challenge", "blue-ocean"],
  tags: ["fundamentos", "disrupção", "estratégia"], agentDomain: "kaos",
  version: 1, status: "published",
};

export const KAOS_T01E06_ASSET: NewKnowledgeAsset = {
  id: "ka-kaos-t01-e06", knowledgeUnitId: "ku-kaos-t01-e06",
  agentId: "kaos", season: 1, episode: 6, type: "episode",
  content: {
    abertura: "O mercado de ideias treme. As barracas de conceitos tradicionais começam a ruir enquanto novas estruturas emergem do chão. KAOS está no centro do terremoto criativo, completamente calmo. 'Toda indústria tem gigantes adormecidos. A Netflix era uma locadora que mandava DVD pelo correio. A Blockbuster tinha 9.000 lojas e riu da Netflix. Hoje, a Blockbuster tem UMA loja. A Netflix vale bilhões. Isso é disrupção.'",
    narrativa: "Clayton Christensen definiu inovação disruptiva como aquela que começa atendendo um nicho ignorado pelos líderes de mercado — e eventualmente os engole. O iPhone não competiu com os melhores telefones. Ele competiu com... nada. Criou uma categoria nova. A Tesla não tentou fazer um carro elétrico melhor que a Toyota. Ela fez um carro elétrico que parecia foguete. Disrupção não é fazer melhor. É fazer DIFERENTE.",
    pausas: [
      { pergunta: "Por que a Blockbuster faliu e a Netflix dominou?", opcoes: ["A. A Netflix tinha mais dinheiro para marketing", "B. A Netflix começou com um modelo que a Blockbuster ignorou — DVD pelo correio — e evoluiu para streaming", "C. A Blockbuster foi proibida pelo governo"], continuacoes: ["Não foi dinheiro — a Blockbuster era muito maior. Foi miopia: eles não viram que o futuro não era loja física.", "Exato! A Blockbuster ignorou o nicho e quando percebeu, o nicho tinha virado o mercado inteiro.", "Nenhum governo proibiu a Blockbuster. Ela faliu sozinha, por achar que seu modelo de negócio era eterno."] },
      { pergunta: "O que define uma inovação verdadeiramente disruptiva?", opcoes: ["A. Uma tecnologia mais avançada que todas as outras", "B. Começa num nicho ignorado, resolve um problema de forma diferente, e eventualmente redefine o mercado", "C. Um produto mais barato que o concorrente"], continuacoes: ["Não é sobre tecnologia — é sobre MODELO. A Netflix não tinha tecnologia superior. Tinha um modelo diferente.", "Perfeito! Nicho → crescimento → dominação. Esse é o arco da disrupção. E ele começa onde ninguém está olhando.", "Preço ajuda, mas não define disrupção. O iPhone era mais CARO que os concorrentes. E mesmo assim destruiu o mercado."] },
    ],
    encerramento: "O terreno se estabiliza — as velhas estruturas sumiram, substituídas por algo completamente novo. 'Você entendeu a disrupção. Mas inovação de verdade não é teórica. Amanhã, você vai colocar a mão na massa — O Experimento Radical.'",
  },
  metadata: { xpReward: 60, readingTimeMin: 8, pauseCount: 2, hasLogosGate: true, logosGateEpisode: true, prevEpisode: "Conexões Improváveis", nextEpisode: "O Experimento Radical" },
  source: "manual", status: "published", version: 1,
};

export const KAOS_T01E06_EDGES: NewKnowledgeGraphEdge[] = [
  { id: "kge-kaos-t01-e06-e07", fromUnitId: "ku-kaos-t01-e06", toUnitId: "ku-kaos-t01-e07", relationship: "next", weight: 1.0 },
];

/* ═══════ EPISÓDIO 7 — O Experimento Radical ═══════ */

export const KAOS_T01E07_UNIT: NewKnowledgeUnit = {
  id: "ku-kaos-t01-e07", title: "O Experimento Radical",
  slug: "kaos-t01-e07-experimento-radical",
  learningObjective: "Ao final, o aprendiz será capaz de projetar e executar experimentos rápidos para testar ideias ousadas com risco controlado.",
  cognitiveLevel: "apply", difficulty: "beginner", estimatedTimeMin: 8,
  skills: ["experimentation", "rapid-prototyping", "hypothesis-testing"],
  tags: ["fundamentos", "experimento", "prototipagem"], agentDomain: "kaos",
  version: 1, status: "published",
};

export const KAOS_T01E07_ASSET: NewKnowledgeAsset = {
  id: "ka-kaos-t01-e07", knowledgeUnitId: "ku-kaos-t01-e07",
  agentId: "kaos", season: 1, episode: 7, type: "episode",
  content: {
    abertura: "Você está num laboratório — mas não é um laboratório comum. É uma mistura de cozinha, oficina e playground. KAOS veste um jaleco manchado de tinta e graxa. 'As maiores ideias do mundo foram testadas em laboratórios improvisados. Os irmãos Wright construíram o primeiro avião numa oficina de bicicletas. Steve Jobs e Wozniak montaram o primeiro Apple numa garagem. Você não precisa de um laboratório de milhões. Precisa de coragem para testar.'",
    narrativa: "O experimento radical tem 3 regras: (1) Defina uma hipótese clara. 'Acredito que X vai causar Y.' (2) Crie a versão mais simples possível para testar — um 'MVP de experimento'. (3) Defina o que é sucesso ANTES de começar. Assim você não se engana depois. Os irmãos Wright não construíram um 747. Eles construíram um planador com motor de 12 cavalos. O primeiro voo durou 12 segundos. Mas provou que era possível.",
    pausas: [
      { pergunta: "Onde os irmãos Wright construíram o primeiro avião?", opcoes: ["A. Num hangar militar com verba do governo", "B. Numa oficina de bicicletas, com recursos próprios", "C. Na universidade onde estudaram engenharia"], continuacoes: ["Nada de verba militar — era uma loja de bicicletas. Eles usaram o que tinham.", "Exato! Uma oficina de bicicletas. Sem verba, sem PhD, sem hangar. Só curiosidade e persistência.", "Eles não eram engenheiros formados! Eram mecânicos de bicicleta. Isso não os impediu de inventar o avião."] },
      { pergunta: "Qual a regra mais importante de um experimento radical?", opcoes: ["A. Ter o melhor equipamento disponível", "B. Definir o que é sucesso ANTES de começar, para não se enganar depois", "C. Documentar tudo em vídeo para o YouTube"], continuacoes: ["Equipamento importa menos que clareza. Se você não sabe o que está testando, qualquer resultado parece bom.", "Perfeito! Definir sucesso antes evita a tentação de reinterpretar o fracasso como vitória.", "Documentar é útil, mas a regra de ouro é a clareza. Sem hipótese clara, você não está experimentando — está brincando."] },
    ],
    encerramento: "KAOS acende um fósforo e acende uma mistura que explode em confete. 'Você fez seu primeiro experimento radical. Mas experimentos não acontecem no vácuo — eles desafiam o status quo. Amanhã, o delicado equilíbrio entre caos e ordem.'",
  },
  metadata: { xpReward: 50, readingTimeMin: 8, pauseCount: 2, hasLogosGate: false, prevEpisode: "Inovação Disruptiva", nextEpisode: "Caos e Ordem" },
  source: "manual", status: "published", version: 1,
};

export const KAOS_T01E07_EDGES: NewKnowledgeGraphEdge[] = [
  { id: "kge-kaos-t01-e07-e08", fromUnitId: "ku-kaos-t01-e07", toUnitId: "ku-kaos-t01-e08", relationship: "next", weight: 1.0 },
];

/* ═══════ EPISÓDIO 8 — Caos e Ordem ═══════ */

export const KAOS_T01E08_UNIT: NewKnowledgeUnit = {
  id: "ku-kaos-t01-e08", title: "Caos e Ordem",
  slug: "kaos-t01-e08-caos-e-ordem",
  learningObjective: "Ao final, o aprendiz será capaz de equilibrar criatividade caótica com execução disciplinada para transformar ideias em realidade.",
  cognitiveLevel: "apply", difficulty: "intermediate", estimatedTimeMin: 9,
  skills: ["balance", "structured-creativity", "execution"],
  tags: ["fundamentos", "equilíbrio", "execução"], agentDomain: "kaos",
  version: 1, status: "published",
};

export const KAOS_T01E08_ASSET: NewKnowledgeAsset = {
  id: "ka-kaos-t01-e08", knowledgeUnitId: "ku-kaos-t01-e08",
  agentId: "kaos", season: 1, episode: 8, type: "episode",
  content: {
    abertura: "Você está numa corda bamba entre dois mundos. De um lado, o Olho da Tempestade — caos criativo puro. Do outro, uma fábrica silenciosa e organizada — ordem absoluta. KAOS caminha na corda bamba como se fosse calçada. 'Caos sem ordem é bagunça. Ordem sem caos é estagnação. O segredo não é escolher um lado. É dançar entre os dois.'",
    narrativa: "O Google tem uma regra famosa: 20% do tempo de trabalho pode ser gasto em projetos pessoais. Gmail, Google News e AdSense nasceram desses 20%. Isso é caos controlado — liberdade dentro de uma estrutura. A Pixar tem 'Braintrust' — reuniões onde qualquer um pode criticar qualquer filme, mas ninguém pode dar ordens. Crítica livre, execução disciplinada. As empresas mais inovadoras do mundo não aboliram as regras — elas criaram regras que permitem o caos.",
    pausas: [
      { pergunta: "O que é a regra dos 20% do Google?", opcoes: ["A. 20% de desconto para funcionários", "B. 20% do tempo de trabalho pode ser gasto em projetos pessoais — foi assim que nasceram Gmail e AdSense", "C. 20% do lucro vai para caridade"], continuacoes: ["Não é desconto — é TEMPO. Um dia por semana para explorar ideias que não têm nada a ver com seu trabalho.", "Exato! Liberdade com estrutura. O Gmail nasceu de um engenheiro que queria um email melhor.", "Não é filantropia — é inovação. O retorno desses 20% gerou bilhões em produtos."] },
      { pergunta: "Qual o segredo para equilibrar caos e ordem?", opcoes: ["A. Alternar entre semanas de caos e semanas de ordem", "B. Criar regras que permitam o caos — como '20% do tempo é livre' ou 'críticas são bem-vindas, mas ninguém dá ordens'", "C. Contratar pessoas caóticas e pessoas organizadas em times separados"], continuacoes: ["Não é sobre alternar — é sobre INTEGRAR. O caos e a ordem precisam coexistir no mesmo dia, no mesmo projeto.", "Perfeito! As melhores regras não restringem a criatividade — elas criam um espaço seguro para ela florescer.", "Times separados criam silos. A mágica está na mistura — o caótico e o organizado trabalhando juntos."] },
    ],
    encerramento: "KAOS chega ao centro da corda bamba e pula — caindo suavemente numa rede feita de ideias. 'Você aprendeu a dançar entre os extremos. Agora está pronto para o passo final: sintetizar tudo que aprendeu em algo novo. Amanhã, a Síntese Criativa.'",
  },
  metadata: { xpReward: 50, readingTimeMin: 8, pauseCount: 2, hasLogosGate: false, prevEpisode: "O Experimento Radical", nextEpisode: "A Síntese Criativa" },
  source: "manual", status: "published", version: 1,
};

export const KAOS_T01E08_EDGES: NewKnowledgeGraphEdge[] = [
  { id: "kge-kaos-t01-e08-e09", fromUnitId: "ku-kaos-t01-e08", toUnitId: "ku-kaos-t01-e09", relationship: "next", weight: 1.0 },
];

/* ═══════ EPISÓDIO 9 — A Síntese Criativa 🛡️ LOGOS ═══════ */

export const KAOS_T01E09_UNIT: NewKnowledgeUnit = {
  id: "ku-kaos-t01-e09", title: "A Síntese Criativa",
  slug: "kaos-t01-e09-sintese-criativa",
  learningObjective: "Ao final, o aprendiz será capaz de sintetizar múltiplas técnicas criativas para resolver problemas complexos de forma original.",
  cognitiveLevel: "apply", difficulty: "intermediate", estimatedTimeMin: 9,
  skills: ["synthesis", "creative-methods", "problem-solving"],
  tags: ["fundamentos", "síntese", "métodos"], agentDomain: "kaos",
  version: 1, status: "published",
};

export const KAOS_T01E09_ASSET: NewKnowledgeAsset = {
  id: "ka-kaos-t01-e09", knowledgeUnitId: "ku-kaos-t01-e09",
  agentId: "kaos", season: 1, episode: 9, type: "episode",
  content: {
    abertura: "Você está numa arena circular. Ao redor, 8 portais — cada um representando uma lição que você aprendeu. Caos criativo. Quebra de padrões. Pensamento lateral. Arte do erro. Conexões improváveis. Disrupção. Experimento radical. Equilíbrio. KAOS ergue as mãos e todos os portais brilham ao mesmo tempo. 'Você não precisa escolher UMA ferramenta. O mestre usa TODAS. A síntese é a arte de combinar.'",
    narrativa: "Leonardo da Vinci não era 'pintor'. Era pintor, engenheiro, anatomista, botânico, músico. Sua genialidade não vinha de ser o melhor em uma coisa — vinha de combinar conhecimentos de áreas diferentes. Ele usou anatomia para pintar sorrisos mais realistas. Usou engenharia para projetar máquinas voadoras. A síntese criativa é isso: pegar ferramentas que você aprendeu separadamente e usá-las JUNTAS num problema real.",
    pausas: [
      { pergunta: "O que fazia Leonardo da Vinci ser tão genial?", opcoes: ["A. Ele era o melhor pintor do mundo e só fazia arte", "B. Ele combinava conhecimentos de áreas diferentes — anatomia melhorava sua pintura, engenharia melhorava sua escultura", "C. Ele tinha um QI muito acima da média e não precisava estudar"], continuacoes: ["Ele era muito mais que pintor. A Mona Lisa só existe porque ele passou anos dissecando cadáveres para entender músculos faciais.", "Exato! A síntese de conhecimentos diversos era seu superpoder. Ele não era especialista em nada — era integrador de tudo.", "QI não explica Da Vinci. O que explica é curiosidade infinita. Ele simplesmente nunca parou de aprender coisas novas."] },
      { pergunta: "O que é síntese criativa?", opcoes: ["A. Fazer uma coisa de cada vez, com calma", "B. Combinar múltiplas técnicas e conhecimentos para resolver um problema de forma original", "C. Decorar todas as técnicas criativas e aplicá-las em ordem"], continuacoes: ["Uma coisa de cada vez é o oposto da síntese. Síntese é sobre COMBINAR, não sobre sequenciar.", "Perfeito! As técnicas são ferramentas. O artista usa pincel E espátula E carvão — não um de cada vez.", "Decorar não é sintetizar. Síntese é entender tão profundamente que você usa as técnicas sem pensar — elas se tornam intuição."] },
    ],
    encerramento: "Os 8 portais se fundem num único — branco, brilhante. 'Você sintetizou tudo que aprendeu. Mas a jornada criativa não tem linha de chegada. Amanhã, no nosso último encontro, vou te mostrar como viver no novo normal — onde a criatividade não é um evento, é um estado.'",
  },
  metadata: { xpReward: 60, readingTimeMin: 8, pauseCount: 2, hasLogosGate: true, logosGateEpisode: true, prevEpisode: "Caos e Ordem", nextEpisode: "O Novo Normal" },
  source: "manual", status: "published", version: 1,
};

export const KAOS_T01E09_EDGES: NewKnowledgeGraphEdge[] = [
  { id: "kge-kaos-t01-e09-e10", fromUnitId: "ku-kaos-t01-e09", toUnitId: "ku-kaos-t01-e10", relationship: "next", weight: 1.0 },
];

/* ═══════ EPISÓDIO 10 — O Novo Normal ═══════ */

export const KAOS_T01E10_UNIT: NewKnowledgeUnit = {
  id: "ku-kaos-t01-e10", title: "O Novo Normal",
  slug: "kaos-t01-e10-novo-normal",
  learningObjective: "Ao final desta temporada, o aprendiz será capaz de integrar a criatividade como prática diária e aplicar o pensamento kaótico em qualquer área da vida.",
  cognitiveLevel: "evaluate", difficulty: "intermediate", estimatedTimeMin: 10,
  skills: ["synthesis", "creative-lifestyle", "continuous-innovation"],
  tags: ["fundamentos", "síntese", "estilo-de-vida"], agentDomain: "kaos",
  version: 1, status: "published",
};

export const KAOS_T01E10_ASSET: NewKnowledgeAsset = {
  id: "ka-kaos-t01-e10", knowledgeUnitId: "ku-kaos-t01-e10",
  agentId: "kaos", season: 1, episode: 10, type: "episode",
  content: {
    abertura: "Você está de volta ao Olho da Tempestade. Mas agora você não é mais um visitante — você faz parte dele. As ideias não giram AO SEU REDOR — giram COM VOCÊ. KAOS está sentado no chão, desenhando com o giz vermelho que te deu no primeiro dia. 'Dez episódios atrás, você chegou aqui achando que criatividade era um dom. Hoje você sabe que é uma escolha. Uma prática. Um músculo.'",
    narrativa: "Você aprendeu que o erro é matéria-prima. Que padrões existem para serem quebrados. Que o pensamento lateral resolve o que o pensamento reto não alcança. Que o fracasso é só um ponto de dados. Que conexões improváveis geram revoluções. Que a disrupção começa num nicho ignorado. Que experimentos não precisam de laboratório — precisam de coragem. Que caos e ordem dançam juntos. E que a síntese é a sua arma secreta. KAOS entrega o giz de volta — agora está gasto, usado, cheio de marcas. 'Este giz carrega 10 lições. Mas ele é seu agora. A Tempestade não termina aqui — ela continua onde você estiver.'",
    pausas: [
      { pergunta: "Qual foi a lição mais transformadora desta temporada?", opcoes: ["A. Que criatividade é um dom que poucos têm", "B. Que a criatividade é uma prática diária — não um evento isolado, mas um estilo de vida", "C. Que o caos deve ser evitado a todo custo"], continuacoes: ["Você provou o contrário! Em 10 episódios, aprendeu técnicas que qualquer um pode usar. Criatividade é treino, não talento.", "Sim! O 'novo normal' é acordar todo dia disposto a errar, conectar, experimentar. A criatividade não é um interruptor — é um hábito.", "Você aprendeu exatamente o oposto! O caos controlado é seu aliado. Fugir dele é fugir da inovação."] },
      { pergunta: "O que você vai fazer com seu 'giz vermelho'?", opcoes: ["A. Guardar como lembrança e nunca usar", "B. Usar para rabiscar ideias todo dia — mesmo as 'ruins' — porque o próximo rabisco pode mudar tudo", "C. Devolver para KAOS e pedir um novo"], continuacoes: ["Guardar o giz é guardar o potencial. O giz só tem valor quando RISCA. Use-o. Gaste-o. É para isso que ele serve.", "Perfeito! O giz é a metáfora da ação criativa. Ele só serve se for usado. Rabisque todo dia. Alguns rabiscos viram obras-primas.", "KAOS já te deu o giz. Não existe 'giz melhor'. Existe o giz que você USA e o giz que você guarda. O primeiro muda o mundo."] },
    ],
    encerramento: "A Tempestade se acalma — não porque parou, mas porque agora ela está dentro de você. KAOS acena enquanto você parte. 'Esta foi a Temporada 1, Explorador. A Tempestade Criativa. NEXUS te ensinou a pensar. CIPHER te ensinou a proteger. VOLT te ensinou a construir. Eu te ensinei a QUEBRAR. E quebrar é o primeiro passo para criar algo que nunca existiu. O que você vai quebrar hoje?'",
  },
  metadata: { xpReward: 100, readingTimeMin: 9, pauseCount: 2, hasLogosGate: false, isSeasonFinale: true, prevEpisode: "A Síntese Criativa", nextEpisode: null },
  source: "manual", status: "published", version: 1,
};

export const KAOS_T01E10_EDGES: NewKnowledgeGraphEdge[] = [];
