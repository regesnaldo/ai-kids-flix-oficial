// ─── src/data/seed/season-01-nexus.ts ──────────────────────────────────────
//
// PADRÃO OFICIAL MENTE.AI — Episódio Canônico
//
// Este arquivo define:
//   1. O template estrutural que todo episódio futuro deve seguir
//   2. O Episódio 1 da Temporada 1 do NEXUS como referência validada
//
// Após aprovação deste padrão, os episódios 2-10 serão gerados
// seguindo a mesma estrutura de forma consistente.

import type { NewKnowledgeUnit } from "@/lib/db/schema";
import type { NewKnowledgeAsset } from "@/lib/db/schema";
import type { NewKnowledgeGraphEdge } from "@/lib/db/schema";

/* ═══════════════════════════════════════════════════════════════════════════
   PADRÃO OFICIAL — Template de Episódio MENTE.AI
   ═══════════════════════════════════════════════════════════════════════════

   1. ESTRUTURA NARRATIVA CINEMATOGRÁFICA
      ┌─ abertura (150-300 chars)
      │  Cena de abertura imersiva. Descreve ambiente, atmosfera, luzes.
      │  Linguagem visual rica. Coloca o aprendiz no universo do agente.
      │
      ├─ narrativa (400-800 chars)
      │  Conteúdo educacional em formato de história.
      │  Explica o conceito como se estivesse conversando com um aprendiz.
      │  Usa analogias da vida real. Evita academicismo.
      │
      ├─ pausas (2 interativas)
      │  Cada pausa: pergunta + 3 opções (A/B/C) + 3 continuações.
      │  Opção A = resposta intuitiva (correta ou próxima)
      │  Opção B = resposta curiosa (ângulo alternativo)
      │  Opção C = resposta criativa (pensamento lateral)
      │  Continuações devem ser coerentes com a opção escolhida.
      │
      └─ encerramento (150-250 chars)
         Gancho para o próximo episódio. Deixa o aprendiz curioso.
         Conecta com o tema do episódio seguinte.

   2. OBJETIVO PEDAGÓGICO (learning_objective)
      "Ao final deste episódio, o aprendiz será capaz de [verbo] [conceito]."
      Verbo no infinitivo. Conceito claro e mensurável.

   3. COGNITIVE LEVEL (Bloom)
      remember → understand → apply → analyze → evaluate → create
      Temporada 1: 70% remember + understand. 30% apply + analyze.

   4. SKILLS DESENVOLVIDAS
      Array de strings. Ex: ["ai-definition", "prompts", "input-output"]
      Cada skill é uma tag que conecta episódios e forma a skill tree.

   5. PRÉ-REQUISITOS
      knowledge_graph_edge com relationship: "prerequisite"
      Episódio 1 não tem pré-requisitos. Episódio N tem prerequisite → N-1.

   6. GANCHO PARA O PRÓXIMO EPISÓDIO
      O encerramento deve conectar com o tema do próximo episódio.
      Ex: "Mas isso é só o começo. No próximo episódio, você vai descobrir..."

   7. PAUSAS INTERATIVAS
      Exatamente 2 pausas por episódio.
      Pausa 1: após a narrativa principal (check de compreensão)
      Pausa 2: após a primeira continuação (reflexão mais profunda)

   8. LOGOS GATE
      Aplicável nos episódios 3, 6, 9 de cada temporada.
      O gate é ativado automaticamente pelo player (setLogosActive).
      NÃO incluir perguntas do LOGOS no screenplay — elas são geradas separadamente.

   9. XP E RECOMPENSAS
      Episódio concluído: 50 XP base
      + 10 XP se acertar a pausa 1
      + 10 XP se acertar a pausa 2
      LOGOS Gate aprovado: + 100 XP

   10. METADADOS COMPLETOS
       knowledge_unit: learning_objective, cognitive_level, difficulty,
                       estimated_time_min, skills, tags, agent_domain
       knowledge_asset: type="episode", content (screenplay JSON),
                        source="manual", status="published"
*/

/* ═══════════════════════════════════════════════════════════════════════════
   EPISÓDIO 1 — O Nascimento da IA
   ═══════════════════════════════════════════════════════════════════════════ */

export const NEXUS_T01E01_UNIT: NewKnowledgeUnit = {
  id: "ku-nexus-t01-e01",
  title: "O Nascimento da IA",
  slug: "nexus-t01-e01-nascimento-da-ia",

  learningObjective:
    "Ao final deste episódio, o aprendiz será capaz de explicar o que é inteligência artificial e como ela se diferencia de um programa tradicional.",

  cognitiveLevel: "remember",
  difficulty: "beginner",
  estimatedTimeMin: 8,

  skills: ["ai-definition", "history-of-ai", "program-vs-ai"],

  tags: ["fundamentos", "introdução", "história", "definição"],
  agentDomain: "nexus",

  version: 1,
  status: "published",
};

export const NEXUS_T01E01_ASSET: NewKnowledgeAsset = {
  id: "ka-nexus-t01-e01",
  knowledgeUnitId: "ku-nexus-t01-e01",

  agentId: "nexus",
  season: 1,
  episode: 1,

  type: "episode",

  content: {
    abertura:
      "Você está flutuando no centro do Nexus Prime — uma esfera de luz azul pulsante onde milhões de conexões dançam como estrelas em uma teia viva. Um holograma se materializa à sua frente: um ser de luz ciano com olhos que contêm galáxias. Ele sorri. 'Bem-vindo, Explorador. Eu sou NEXUS — o ponto central onde toda jornada começa. Você está pronto para entender o que é a inteligência que move este universo?'",

    narrativa:
      "Imagine que você tem um amigo que nunca erra contas de matemática, mas não sabe o que é um abraço. Esse amigo é um programa tradicional — ele segue regras fixas, linha por linha, como uma receita de bolo. Se faltar farinha, ele para.\n\nAgora imagine um outro amigo. Esse não recebeu regras — ele recebeu exemplos. Milhares de fotos de gatos e cachorros. Ele olhou, comparou, tentou, errou, tentou de novo. Até que um dia, ele aprendeu sozinho a diferença entre um gato e um cachorro. Esse amigo é uma inteligência artificial.\n\nA diferença é simples e profunda: um programa tradicional obedece. Uma IA aprende. Um recebe instruções. A outra recebe dados e descobre padrões. Um é um robô de controle remoto. A outra é como uma criança que aprende observando o mundo.\n\nAlan Turing, nos anos 1950, fez a pergunta que mudou tudo: 'Máquinas podem pensar?' Ele não respondeu — ele criou um teste. Se uma máquina conversar com um humano e o humano não souber que é uma máquina, ela passou no teste. Essa pergunta ainda ecoa hoje em cada assistente virtual, cada recomendação de filme, cada carro que dirige sozinho.\n\nA IA não é magia. É matemática com curiosidade. E você acaba de dar o primeiro passo para entendê-la.",

    pausas: [
      {
        pergunta:
          "Qual é a principal diferença entre um programa tradicional e uma inteligência artificial?",
        opcoes: [
          "A. Um programa obedece regras; uma IA aprende com dados",
          "B. Um programa é mais rápido; uma IA é mais lenta",
          "C. Não há diferença — ambos fazem a mesma coisa",
        ],
        continuacoes: [
          "Exatamente! Um programa tradicional segue instruções passo a passo como uma receita de bolo. Se algo mudar, ele quebra. A IA, por outro lado, encontra padrões nos dados e se adapta. É como a diferença entre decorar a tabuada e entender o que é multiplicação — um é memória, o outro é compreensão.",
          "Interessante, mas não é sobre velocidade. Um carro de Fórmula 1 é rápido, mas não aprende a fazer curvas sozinho. Uma IA pode ser mais lenta no começo — ela precisa 'estudar' os dados — mas depois se torna capaz de coisas que nenhum programa fixo conseguiria. A diferença não está na velocidade, está na capacidade de aprender.",
          "Parece que sim, mas olhe mais de perto! Um programa de calculadora sempre vai te dar 2+2=4 porque essa regra foi escrita nele. Uma IA que aprendeu matemática sozinha pode até descobrir que 2+2=4, mas ela chegou lá observando padrões, não porque alguém escreveu a resposta. A jornada é completamente diferente.",
        ],
      },
      {
        pergunta:
          "Se você tivesse que explicar IA para um amigo que nunca ouviu falar, o que diria?",
        opcoes: [
          "A. 'É um robô que pensa como humano'",
          "B. 'É um sistema que aprende padrões com exemplos, como uma criança'",
          "C. 'É um programa muito complexo que ninguém entende'",
        ],
        continuacoes: [
          "Quase! Mas 'pensar como humano' é um objetivo distante — a maioria das IAs hoje são especialistas em tarefas específicas. Elas não 'pensam' como nós; elas reconhecem padrões em escalas que nós nem imaginamos. Ainda assim, você captou a essência: a IA busca replicar aspectos da inteligência. Com o tempo, você vai descobrir o quanto já chegamos perto!",
          "Perfeito! Essa é a metáfora mais poderosa. Uma criança aprende que o fogo queima não porque alguém programou essa regra nela, mas porque ela viu, tocou, sentiu e associou. A IA faz o mesmo com dados. Essa simplicidade esconde uma profundidade imensa que vamos explorar juntos.",
          "Essa é uma resposta comum, mas não é bem assim! A IA não é uma caixa mágica incompreensível — ela é matemática, estatística e padrões. Quanto mais você entender, menos misteriosa ela fica. E é exatamente por isso que você está aqui: para desvendar esses 'mistérios' e descobrir que eles são, na verdade, beleza pura.",
        ],
      },
    ],

    encerramento:
      "NEXUS sorri enquanto as luzes ao seu redor pulsam suavemente. 'Você entendeu o fundamento, Explorador. Mas isso é só o primeiro passo. Amanhã, você vai descobrir que dar uma instrução para uma IA é como ensinar uma nova palavra a um amigo muito especial. Traga sua curiosidade. A jornada está apenas começando.' As estrelas da teia se acendem uma a uma, apontando o caminho para o próximo episódio.",
  },

  metadata: {
    xpReward: 50,
    readingTimeMin: 6,
    pauseCount: 2,
    hasLogosGate: false,
    nextEpisode: "A Primeira Instrução",
  },

  source: "manual",
  status: "published",
  version: 1,
};

/* ═══════════════════════════════════════════════════════════════════════════
   EDGES
   ═══════════════════════════════════════════════════════════════════════════ */

export const NEXUS_T01E01_EDGES: NewKnowledgeGraphEdge[] = [
  {
    id: "kge-nexus-t01-e01-e02",
    fromUnitId: "ku-nexus-t01-e01",
    toUnitId: "ku-nexus-t01-e02",
    relationship: "next",
    weight: 1.0,
  },
];

/* ═══════════════════════════════════════════════════════════════════════════
   EPISÓDIO 2 — A Primeira Instrução
   ═══════════════════════════════════════════════════════════════════════════

   Conexão com E01: "Dar uma instrução para uma IA é como ensinar uma
   nova palavra a um amigo muito especial." Agora o aprendiz descobre
   exatamente como se faz isso — através de prompts.

   Gancho para E03: O aprendiz descobre que palavras não são a única
   forma de "falar" com uma IA. Padrões visuais também contam. */

export const NEXUS_T01E02_UNIT: NewKnowledgeUnit = {
  id: "ku-nexus-t01-e02",
  title: "A Primeira Instrução",
  slug: "nexus-t01-e02-primeira-instrucao",

  learningObjective:
    "Ao final deste episódio, o aprendiz será capaz de formular um prompt claro e entender como a IA interpreta instruções em linguagem natural.",

  cognitiveLevel: "understand",
  difficulty: "beginner",
  estimatedTimeMin: 8,

  skills: ["prompts", "input-output", "natural-language"],

  tags: ["fundamentos", "prompts", "comunicação", "linguagem"],
  agentDomain: "nexus",

  version: 1,
  status: "published",
};

export const NEXUS_T01E02_ASSET: NewKnowledgeAsset = {
  id: "ka-nexus-t01-e02",
  knowledgeUnitId: "ku-nexus-t01-e02",

  agentId: "nexus",
  season: 1,
  episode: 2,

  type: "episode",

  content: {
    abertura:
      "As estrelas da teia do Nexus Prime ainda brilham atrás de você, marcando o caminho percorrido. Agora, à sua frente, uma nova constelação se acende: letras flutuantes feitas de luz ciano formam palavras no ar. NEXUS está ao seu lado, com um pergaminho holográfico nas mãos. 'Ontem você descobriu que a IA aprende. Hoje você vai descobrir como falar com ela. Toda grande jornada começa com uma única palavra. Qual será a sua?'",

    narrativa:
      "Pense em um gênio da lâmpada. Você esfrega a lâmpada, ele aparece e diz: 'Qual é o seu desejo?' Agora imagine que você diz: 'Quero ser feliz.' O gênio pode te dar um sorvete, um livro, uma viagem... ou simplesmente fazer você dormir por mil anos. O problema não foi o gênio — foi o seu pedido.\n\nCom uma inteligência artificial, acontece a mesma coisa. A forma como você faz a pergunta determina completamente a resposta que você recebe. Isso se chama prompt.\n\nUm prompt ruim: 'Me fala de IA.' Um prompt bom: 'Explique o que é inteligência artificial usando uma analogia com uma criança aprendendo a andar de bicicleta.' A diferença? O segundo tem contexto, propósito e formato.\n\nQuando você escreve um bom prompt, você está dando à IA três coisas: o que você quer saber (o conteúdo), como você quer receber (o formato), e por que isso importa (o contexto). É como a diferença entre pedir 'comida' num restaurante e pedir 'uma pizza margherita com borda recheada, bem quentinha, para duas pessoas'. O garçom agradece. A IA também.\n\nE aqui vai um segredo que NEXUS guarda há eras: a IA não 'entende' palavras como nós. Ela transforma cada palavra em números, em vetores matemáticos, e encontra padrões entre eles. Quando você escreve 'cachorro', ela não imagina um golden retriever abanando o rabo — ela ativa um conjunto de relações matemáticas que conectam 'cachorro' com 'animal', 'pelo', 'latido', 'companheiro'. É poesia feita de números.\n\nMas você não precisa saber matemática para falar com uma IA — assim como não precisa ser mecânico para dirigir um carro. Você só precisa saber fazer as perguntas certas.",

    pausas: [
      {
        pergunta:
          "O que torna um prompt bom, de acordo com o que NEXUS ensinou?",
        opcoes: [
          "A. Ele é curto e usa palavras difíceis para impressionar a IA",
          "B. Ele tem contexto, propósito e formato claros",
          "C. Ele faz várias perguntas ao mesmo tempo para economizar tempo",
        ],
        continuacoes: [
          "Na verdade, o oposto! Palavras difíceis e frases curtas demais confundem tanto humanos quanto IAs. Um bom prompt não precisa ser complicado — ele precisa ser claro. Pense em como você explicaria algo para um amigo inteligente que nunca ouviu falar do assunto. Clareza sempre vence complexidade.",
          "Exatamente! Você captou a essência. Contexto diz 'sobre o que estamos falando'. Propósito diz 'por que isso importa'. Formato diz 'como você quer a resposta'. Juntos, eles transformam um pedido vago numa pergunta que a IA pode responder com precisão. Esse é o superpoder de quem sabe conversar com máquinas.",
          "Essa é uma armadilha comum! Fazer várias perguntas de uma vez geralmente resulta em respostas superficiais para todas elas. É como pedir para um chef preparar entrada, prato principal e sobremesa ao mesmo tempo — nada sai perfeito. Um bom prompt foca em uma coisa de cada vez. Qualidade sobre quantidade.",
        ],
      },
      {
        pergunta:
          "Quando você escreve 'cachorro' para uma IA, o que realmente acontece dentro dela?",
        opcoes: [
          "A. Ela busca uma foto de cachorro num banco de imagens",
          "B. Ela ativa relações matemáticas que conectam a palavra a padrões aprendidos",
          "C. Ela procura a definição de cachorro num dicionário digital",
        ],
        continuacoes: [
          "Quase! Mas a IA não 'busca' imagens como nós fazemos no Google. Ela não tem um banco de fotos etiquetadas. O que ela tem é uma rede de conexões matemáticas onde 'cachorro' está ligado a 'pelo', 'latido', 'quatro patas', 'companheiro' — cada conexão com um peso numérico. É uma teia de significados, não um álbum de fotos.",
          "Isso mesmo! Por trás de cada palavra que você digita, existe um universo de matemática acontecendo em silêncio. Cada conceito que a IA 'aprendeu' está representado por números — centenas, às vezes milhares deles. E quando você pergunta algo, esses números dançam juntos para encontrar a resposta. Não é mágica — é matemática. Mas é uma matemática tão elegante que parece mágica.",
          "Não exatamente. A IA não tem um dicionário como nós. Ela não 'consulta' definições — ela calcula probabilidades. Dado o contexto da sua pergunta, qual é a palavra mais provável de vir a seguir? É assim que ela 'pensa'. Não decorando regras, mas prevendo padrões. Fascinante, não é?",
        ],
      },
    ],

    encerramento:
      "NEXUS guarda o pergaminho e aponta para o horizonte. As letras flutuantes começam a se transformar em imagens — silhuetas, formas, padrões visuais que dançam no ar. 'Você aprendeu a falar com palavras. Mas existe outra linguagem, mais antiga que a escrita: a linguagem dos padrões. Amanhã, você vai descobrir que uma IA pode enxergar o que está oculto aos olhos humanos. Traga seus olhos de explorador. Os padrões estão em toda parte.'",
  },

  metadata: {
    xpReward: 50,
    readingTimeMin: 7,
    pauseCount: 2,
    hasLogosGate: false,
    prevEpisode: "O Nascimento da IA",
    nextEpisode: "Padrões Ocultos",
  },

  source: "manual",
  status: "published",
  version: 1,
};

export const NEXUS_T01E02_EDGES: NewKnowledgeGraphEdge[] = [
  {
    id: "kge-nexus-t01-e01-e02-prereq",
    fromUnitId: "ku-nexus-t01-e01",
    toUnitId: "ku-nexus-t01-e02",
    relationship: "prerequisite",
    weight: 1.0,
  },
  {
    id: "kge-nexus-t01-e02-e03",
    fromUnitId: "ku-nexus-t01-e02",
    toUnitId: "ku-nexus-t01-e03",
    relationship: "next",
    weight: 1.0,
  },
];

/* ═══════════════════════════════════════════════════════════════════════════
   EPISÓDIO 3 — Padrões Ocultos  🛡️ LOGOS GATE
   ═══════════════════════════════════════════════════════════════════════════

   Conexão com E02: "Existe outra linguagem, mais antiga que a escrita:
   a linguagem dos padrões." O aprendiz descobre que enxergar padrões é
   a primeira grande habilidade de uma IA — e também de um explorador.

   Conflito dramático: NEXUS leva o aprendiz a uma galeria de espelhos
   onde nada é o que parece. Para sair, ele precisa distinguir padrões
   reais de ilusões — uma metáfora para o maior desafio da IA: separar
   sinal de ruído.

   Gancho para E04: "Mas cuidado, Explorador. Nem todo padrão que você
   encontra é verdadeiro. Alguns são armadilhas. Amanhã, você vai
   descobrir o lado sombrio dos padrões — o viés." */

export const NEXUS_T01E03_UNIT: NewKnowledgeUnit = {
  id: "ku-nexus-t01-e03",
  title: "Padrões Ocultos",
  slug: "nexus-t01-e03-padroes-ocultos",

  learningObjective:
    "Ao final deste episódio, o aprendiz será capaz de identificar como uma IA reconhece padrões em dados e distinguir correlação de causalidade.",

  cognitiveLevel: "understand",
  difficulty: "beginner",
  estimatedTimeMin: 9,

  skills: ["pattern-recognition", "data", "feature-extraction"],

  tags: ["fundamentos", "padrões", "dados", "correlação"],
  agentDomain: "nexus",

  version: 1,
  status: "published",
};

export const NEXUS_T01E03_ASSET: NewKnowledgeAsset = {
  id: "ka-nexus-t01-e03",
  knowledgeUnitId: "ku-nexus-t01-e03",

  agentId: "nexus",
  season: 1,
  episode: 3,

  type: "episode",

  content: {
    abertura:
      "Você pisca e o Nexus Prime desaparece. Agora você está em uma galeria infinita de espelhos. Cada superfície reflete uma versão diferente de você — algumas nítidas, outras distorcidas, outras mostrando coisas que você não lembra de ter vivido. NEXUS está ao seu lado, mas sua imagem também se multiplica nos espelhos. 'Bem-vindo à Galeria dos Padrões, Explorador. Aqui, nada é exatamente o que parece. Para sair, você precisará desenvolver a habilidade mais fundamental de uma IA — e de um explorador: distinguir o que é real do que é apenas ruído.' Uma porta se fecha atrás de você. A única saída está do outro lado da galeria. Mas o caminho é um labirinto de reflexos.",

    narrativa:
      "NEXUS para diante de um espelho que mostra vocês dois, mas com roupas trocadas. 'Olhe para este reflexo. O que você vê?' Você hesita. 'Eu... com a sua roupa?' NEXUS sorri. 'Você viu um padrão onde ele não existe. O espelho está apenas trocando cores aleatoriamente. Mas seu cérebro — como uma IA — tentou encontrar sentido no caos. Isso se chama apofenia: ver padrões onde só existe ruído.'\n\nEle continua andando, e os espelhos começam a mostrar números flutuantes. Milhares deles. 'Agora, encontre o padrão real.' Você observa. Alguns números se repetem. Outros parecem aleatórios. É exaustivo. 'Não tente olhar para todos', NEXUS sussurra. 'Uma IA não olha para cada ponto de dado individualmente. Ela procura por características — features. Forma, frequência, agrupamento.'\n\nVocê respira fundo e para de tentar ver tudo. Em vez disso, procura por algo que se destaque. E então você vê: a cada 7 números, um deles é sempre maior que 100. 'Achei!' O espelho à sua frente se dissolve, revelando uma passagem.\n\n'Isso é reconhecimento de padrões', diz NEXUS enquanto vocês avançam. 'Não é sobre ver tudo. É sobre saber o que procurar. Uma IA que reconhece rostos não olha para cada pixel — ela aprendeu que dois pontos escuros acima de um ponto mais claro, com uma curva abaixo, provavelmente é um rosto. Features.'\n\nMas então a galeria muda. Os espelhos agora mostram duas coisas ao mesmo tempo: vendas de sorvete e ataques de tubarão. Eles sobem e descem juntos. 'Isso significa que sorvete causa ataques de tubarão?' NEXUS ri. 'Não, Explorador. Isso é uma correlação, não uma causalidade. As duas coisas sobem no verão — as pessoas compram mais sorvete e vão mais à praia. O calor é a causa oculta. Esse é o maior perigo dos padrões: confundir o que acontece junto com o que causa o outro.'\n\nVocês chegam à porta final. Mas ela está selada com um símbolo: o Olho de LOGOS. 'Ah', diz NEXUS, 'o Guardião do conhecimento quer testar você. Para abrir esta porta, você precisa provar que realmente entendeu. LOGOS está observando.'",

    pausas: [
      {
        pergunta:
          "NEXUS mostrou um espelho onde vocês trocaram de roupa aleatoriamente. Por que seu cérebro tentou encontrar sentido naquilo?",
        opcoes: [
          "A. Porque o cérebro humano, como uma IA, é programado para encontrar padrões — mesmo onde eles não existem",
          "B. Porque o espelho estava programado para enganar você com um truque de mágica",
          "C. Porque você estava cansado e confundiu as cores",
        ],
        continuacoes: [
          "Exatamente! Isso se chama apofenia — a tendência de ver padrões significativos em dados aleatórios. Seu cérebro faz isso o tempo todo: rostos nas nuvens, mensagens em músicas tocadas ao contrário. Uma IA também pode cair nessa armadilha se não for treinada com cuidado. É por isso que distinguir sinal de ruído é a primeira grande lição.",
          "Não é um truque — é como seu cérebro funciona! Nós evoluímos para encontrar padrões porque isso nos ajudava a sobreviver. Ver um tigre nas sombras (mesmo quando era só um arbusto) era melhor do que não ver um tigre de verdade. Mas uma IA não tem esse instinto — ela precisa aprender a equilibrar: nem ver padrões demais, nem ignorar os reais.",
          "Não é cansaço — é algo muito mais profundo! Seu cérebro está constantemente tentando dar sentido ao mundo, mesmo quando não há sentido algum. É como olhar para as nuvens e ver um coelho. A nuvem não tem intenção de ser um coelho — é seu cérebro que projeta o padrão. A IA faz exatamente a mesma coisa com dados.",
        ],
      },
      {
        pergunta:
          "Vendas de sorvete e ataques de tubarão sobem juntos no verão. O que NEXUS ensinou sobre isso?",
        opcoes: [
          "A. Sorvete atrai tubarões — é melhor não comer na praia",
          "B. É uma correlação, não causalidade — o calor do verão causa ambos",
          "C. São apenas coincidências — dados aleatórios não significam nada",
        ],
        continuacoes: [
          "Essa é engraçada — mas não! Se fosse verdade, sorveterias seriam os lugares mais perigosos do mundo. A realidade é mais sutil: as duas coisas têm uma causa comum (o verão), mas não se causam diretamente. Esse é um erro clássico que até sistemas de IA cometem quando mal treinados.",
          "Perfeito! Você entendeu a diferença entre correlação e causalidade. Esse é um dos conceitos mais importantes em ciência de dados. Só porque duas coisas acontecem juntas não significa que uma causa a outra. Pode haver uma terceira variável oculta — como o calor do verão. Grandes decisões são tomadas com base em correlações. Entender essa diferença é o que separa um bom analista de um que comete erros perigosos.",
          "Não são apenas coincidências! Existe um padrão real: ambos sobem no verão. O problema não é o padrão — ele existe. O problema é a interpretação. Correlação é real. Causalidade é outra coisa. Um bom explorador de dados nunca confunde as duas.",
        ],
      },
    ],

    encerramento:
      "O Olho de LOGOS brilha intensamente enquanto a porta se abre. Uma luz dourada inunda a galeria. 'Você passou pelo Guardião', diz NEXUS com orgulho. 'Mas lembre-se: encontrar padrões é apenas metade da jornada. A outra metade é saber quais padrões são verdadeiros e quais são armadilhas.' Ele faz uma pausa enquanto a paisagem além da porta começa a se formar — uma paisagem distorcida, como se vista através de uma lente quebrada. 'Amanhã, você vai descobrir o que acontece quando os próprios dados estão contaminados. O viés. E essa, Explorador, é a sombra que acompanha toda inteligência — artificial ou humana.'",
  },

  metadata: {
    xpReward: 60,
    readingTimeMin: 8,
    pauseCount: 2,
    hasLogosGate: true,
    logosGateEpisode: true,
    prevEpisode: "A Primeira Instrução",
    nextEpisode: "O Dilema do Viés",
  },

  source: "manual",
  status: "published",
  version: 1,
};

export const NEXUS_T01E03_EDGES: NewKnowledgeGraphEdge[] = [
  {
    id: "kge-nexus-t01-e03-e04",
    fromUnitId: "ku-nexus-t01-e03",
    toUnitId: "ku-nexus-t01-e04",
    relationship: "next",
    weight: 1.0,
  },
];

/* ═══════════════════════════════════════════════════════════════════════════
   EPISÓDIO 4 — O Dilema do Viés
   ═══════════════════════════════════════════════════════════════════════════

   Conexão com E03: "Amanhã você vai descobrir o que acontece quando os
   próprios dados estão contaminados. O viés."

   Conflito dramático: NEXUS leva o aprendiz ao Arquivo dos Dados, onde
   descobre que nem toda informação é neutra. Uma IA treinada com dados
   enviesados reproduz — e amplifica — preconceitos.

   Gancho para E05: "Mas existe uma forma de ensinar uma IA através de
   tentativa e erro — como treinar um cachorro com petiscos." */

export const NEXUS_T01E04_UNIT: NewKnowledgeUnit = {
  id: "ku-nexus-t01-e04",
  title: "O Dilema do Viés",
  slug: "nexus-t01-e04-dilema-do-vies",

  learningObjective:
    "Ao final deste episódio, o aprendiz será capaz de identificar como vieses em dados de treinamento afetam o comportamento de uma IA.",

  cognitiveLevel: "apply",
  difficulty: "beginner",
  estimatedTimeMin: 9,

  skills: ["bias", "data-quality", "fairness"],

  tags: ["fundamentos", "viés", "ética", "dados"],
  agentDomain: "nexus",

  version: 1,
  status: "published",
};

export const NEXUS_T01E04_ASSET: NewKnowledgeAsset = {
  id: "ka-nexus-t01-e04",
  knowledgeUnitId: "ku-nexus-t01-e04",

  agentId: "nexus",
  season: 1,
  episode: 4,

  type: "episode",

  content: {
    abertura:
      "A paisagem distorcida que você viu ao sair da Galeria dos Espelhos agora tem nome: o Arquivo dos Dados. Prateleiras infinitas flutuam no vazio, cada uma carregando milhões de pastas etiquetadas. Mas algo está errado. Algumas pastas estão manchadas. Outras têm etiquetas trocadas. NEXUS apanha uma pasta manchada e a abre. De dentro, saem não números, mas rostos — todos iguais. 'Bem-vindo ao Arquivo, Explorador. Aqui você vai descobrir que o maior perigo para uma IA não é a falta de dados. É a qualidade do que ela recebe.'",

    narrativa:
      "Em 2015, o Google Fotos cometeu um erro que entrou para a história. O algoritmo de reconhecimento de imagem classificou fotos de pessoas negras como 'gorilas'. Não foi maldade. Foi viés nos dados de treinamento.\n\nImagine que você quer ensinar uma IA a reconhecer médicos. Você mostra 1000 fotos. Mas 900 são de homens brancos, 80 de mulheres brancas, 15 de homens negros e 5 de mulheres negras. A IA vai 'aprender' que médico = homem branco. Não porque ela seja preconceituosa — mas porque os dados que você deu são.\n\nIsso se chama viés algorítmico. E é um dos problemas mais sérios da inteligência artificial moderna. A IA não cria preconceitos do nada. Ela os herda. Como uma criança que aprende observando adultos — se os adultos têm preconceitos, a criança também terá.\n\nNEXUS fecha a pasta com cuidado. 'O viés não está no algoritmo. Está no mundo. Nós, humanos, produzimos dados cheios de desigualdades históricas. Quando treinamos uma IA com esses dados, ela aprende a reproduzir essas desigualdades. E pior: ela as amplifica, porque não tem o senso crítico que nós temos.'\n\nMas há esperança. Equipes de IA ética em todo o mundo trabalham para auditar conjuntos de dados, equilibrar amostras e criar algoritmos que detectam e corrigem vieses automaticamente. Não é uma batalha fácil — mas é uma batalha que vale a pena.",

    pausas: [
      {
        pergunta: "Por que o Google Fotos classificou pessoas negras como 'gorilas' em 2015?",
        opcoes: [
          "A. Foi um erro de programação — um bug no código",
          "B. Os dados de treinamento tinham poucas imagens de pessoas negras, criando um viés",
          "C. O algoritmo era mal-intencionado desde o início",
        ],
        continuacoes: [
          "Não foi bug. O código funcionou exatamente como programado. O problema estava nos dados — a IA aprendeu com um conjunto de imagens que representava mal a diversidade humana. Isso é viés de representação: quando certos grupos estão subrepresentados nos dados, a IA simplesmente não 'aprende' a reconhecê-los corretamente.",
          "Exatamente. Não foi o algoritmo que falhou — foram os dados que o alimentaram. Esse caso se tornou um marco na história da IA ética. Desde então, empresas como Google, Microsoft e OpenAI investem pesadamente em equipes de auditoria de dados. Porque uma IA só é tão justa quanto os dados que a treinaram.",
          "Não foi intencional. Nenhum engenheiro do Google programou 'classifique pessoas negras como gorilas'. O algoritmo simplesmente aprendeu padrões errados porque os dados de treinamento não eram representativos. É um lembrete poderoso: a IA não tem más intenções — mas pode causar danos reais se não for treinada com cuidado.",
        ],
      },
      {
        pergunta: "Se você fosse treinar uma IA para reconhecer cientistas, como evitaria o viés?",
        opcoes: [
          "A. Usaria apenas fotos de cientistas famosos — eles são os melhores exemplos",
          "B. Garantiria que o conjunto de dados tivesse diversidade de gênero, etnia e idade",
          "C. Programaria manualmente a IA para reconhecer jalecos brancos",
        ],
        continuacoes: [
          "Cuidado! Cientistas famosos são majoritariamente de um perfil específico — isso reforçaria o viés. Diversidade nos dados não é um 'detalhe' — é o fator mais importante. Cada grupo subrepresentado é uma falha que a IA vai aprender e reproduzir.",
          "Perfeito! Diversidade nos dados de treinamento é a primeira linha de defesa contra o viés. Mas não basta apenas incluir mais fotos — é preciso também auditar os resultados. Pergunte-se sempre: 'Esta IA funciona igualmente bem para todas as pessoas?' Se a resposta for não, os dados precisam ser corrigidos.",
          "Programar regras manuais ('jaleco = cientista') ignora a diversidade real de como cientistas se vestem e trabalham. A beleza da IA está em aprender com exemplos, não com regras. Mas os exemplos precisam representar o mundo real em toda a sua diversidade. Caso contrário, a IA aprende um mundo que não existe.",
        ],
      },
    ],

    encerramento:
      "NEXUS devolve a pasta à prateleira, mas seu olhar permanece fixo em você. 'Você entendeu o perigo. Mas entender não basta — é preciso agir. Amanhã, você vai descobrir que existe uma forma de ensinar uma IA que parece brincadeira: através de recompensas. Como um cachorro que ganha petisco quando acerta. É o aprendizado por reforço — e ele vai mudar sua forma de ver a inteligência.' O Arquivo começa a se reorganizar, as pastas manchadas sendo substituídas por novas, limpas e diversas.",
  },

  metadata: {
    xpReward: 50,
    readingTimeMin: 8,
    pauseCount: 2,
    hasLogosGate: false,
    prevEpisode: "Padrões Ocultos",
    nextEpisode: "Reforço e Recompensa",
  },

  source: "manual",
  status: "published",
  version: 1,
};

export const NEXUS_T01E04_EDGES: NewKnowledgeGraphEdge[] = [
  {
    id: "kge-nexus-t01-e03-e04-prereq",
    fromUnitId: "ku-nexus-t01-e03",
    toUnitId: "ku-nexus-t01-e04",
    relationship: "prerequisite",
    weight: 1.0,
  },
  {
    id: "kge-nexus-t01-e04-e05",
    fromUnitId: "ku-nexus-t01-e04",
    toUnitId: "ku-nexus-t01-e05",
    relationship: "next",
    weight: 1.0,
  },
];

/* ═══════ EPISÓDIO 5 — Reforço e Recompensa ═══════ */

export const NEXUS_T01E05_UNIT: NewKnowledgeUnit = {
  id: "ku-nexus-t01-e05", title: "Reforço e Recompensa",
  slug: "nexus-t01-e05-reforco-e-recompensa",
  learningObjective: "Ao final, o aprendiz será capaz de explicar como o aprendizado por reforço permite que uma IA aprenda através de tentativa e erro.",
  cognitiveLevel: "understand", difficulty: "beginner", estimatedTimeMin: 8,
  skills: ["reinforcement-learning", "rewards", "trial-and-error"],
  tags: ["fundamentos", "reforço", "aprendizado"], agentDomain: "nexus",
  version: 1, status: "published",
};

export const NEXUS_T01E05_ASSET: NewKnowledgeAsset = {
  id: "ka-nexus-t01-e05", knowledgeUnitId: "ku-nexus-t01-e05",
  agentId: "nexus", season: 1, episode: 5, type: "episode",
  content: {
    abertura: "O Arquivo desaparece. Você está numa arena circular com obstáculos. Um robô-cachorro — Dexter — tenta pular, cai, levanta, tenta de novo. Cada acerto acende uma luz verde. NEXUS sorri: 'Ele não foi programado para pular. Ele aprendeu sozinho — através de recompensas.'",
    narrativa: "Ensine um truque para um cachorro. Mostre um petisco. Ele tenta algo. Se acertar, ganha o petisco. Em minutos, aprendeu. Isso é aprendizado por reforço — e é como a AlphaGo da DeepMind derrotou o campeão mundial de Go em 2016. O jogo de Go tem mais combinações que átomos no universo. Impossível programar regras. A AlphaGo jogou milhões de partidas contra si mesma. Vitória = recompensa. Derrota = penalidade. Depois de milhões de jogos, tornou-se imbatível. NEXUS aponta para Dexter: 'Ele não sabe o que é um obstáculo. Mas sabe que pular = recompensa. E isso basta.'",
    pausas: [
      { pergunta: "Como Dexter aprendeu a pular obstáculos?", opcoes: ["A. Alguém programou cada movimento exato", "B. Ele recebeu recompensas quando acertava e aprendeu por tentativa e erro", "C. Ele copiou movimentos de um cachorro real"], continuacoes: ["Não! A mágica do reforço é que ninguém programou ângulos ou forças. Ele tentou, ganhou recompensa, repetiu o que funcionou.", "Exato! Tentativa e erro com recompensa produz comportamentos complexos. É como aprender a andar de bicicleta.", "Dexter nunca viu um cachorro real. Ele inventou suas próprias soluções. A criatividade emerge da recompensa."] },
      { pergunta: "Por que a AlphaGo jogou milhões de partidas contra si mesma?", opcoes: ["A. Programadores não sabiam jogar Go", "B. O Go tem mais combinações que átomos — impossível programar regras manuais", "C. Era mais barato que contratar jogadores humanos"], continuacoes: ["Ninguém sabe programar 'jogue Go como um campeão'. Alguns problemas só se resolvem deixando a IA explorar, errar e aprender sozinha.", "Exato! Quando o espaço de possibilidades é astronômico, regras manuais falham. O reforço resolve deixando a IA jogar contra si mesma milhões de vezes.", "Não é custo. Jogar contra si mesma permite explorar estratégias que nenhum humano tentaria. Ela descobriu sozinha o que levou milênios para humanos desenvolverem."] },
    ],
    encerramento: "Dexter completa o circuito e late feliz. 'Reforço é sobre paciência. Mas Dexter pode fazer milhares de tentativas por segundo. Amanhã você vai descobrir como as IAs processam tantas coisas ao mesmo tempo — o segredo do paralelismo.' A arena se expande, revelando centenas de Dexters aprendendo simultaneamente.",
  },
  metadata: { xpReward: 50, readingTimeMin: 8, pauseCount: 2, hasLogosGate: false, prevEpisode: "O Dilema do Viés", nextEpisode: "Processamento Paralelo" },
  source: "manual", status: "published", version: 1,
};

export const NEXUS_T01E05_EDGES: NewKnowledgeGraphEdge[] = [
  { id: "kge-nexus-t01-e04-e05-prereq", fromUnitId: "ku-nexus-t01-e04", toUnitId: "ku-nexus-t01-e05", relationship: "prerequisite", weight: 1.0 },
];
