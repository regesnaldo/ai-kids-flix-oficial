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

/* ═══════ EPISÓDIO 6 — Processamento Paralelo 🛡️ LOGOS ═══════ */

export const NEXUS_T01E06_UNIT: NewKnowledgeUnit = {
  id: "ku-nexus-t01-e06", title: "Processamento Paralelo",
  slug: "nexus-t01-e06-processamento-paralelo",
  learningObjective: "Ao final, o aprendiz será capaz de explicar como GPUs permitem que IAs processem milhões de operações em paralelo.",
  cognitiveLevel: "understand", difficulty: "beginner", estimatedTimeMin: 9,
  skills: ["parallel-computing", "gpu", "matrix-multiplication"],
  tags: ["fundamentos", "hardware", "GPU"], agentDomain: "nexus",
  version: 1, status: "published",
};

export const NEXUS_T01E06_ASSET: NewKnowledgeAsset = {
  id: "ka-nexus-t01-e06", knowledgeUnitId: "ku-nexus-t01-e06",
  agentId: "nexus", season: 1, episode: 6, type: "episode",
  content: {
    abertura: "A arena se expande revelando uma catedral de processadores — milhares de chips piscando em uníssono acima de você. 'Isto é uma GPU', diz NEXUS. 'Ela não pensa como você — uma ideia por vez. Ela pensa tudo ao mesmo tempo.'",
    narrativa: "Seu cérebro processa em série. Uma CPU também. Mas uma GPU é radicalmente diferente. Imagine pintar uma parede de 10 metros. Uma CPU é um pintor rápido com um pincel — pinta centímetro por centímetro. Uma GPU são 10.000 pintores minúsculos, cada um pintando seu quadradinho, todos ao mesmo tempo. Em segundos, a parede está pronta. É assim que a multiplicação de matrizes — a operação central das redes neurais — funciona. Milhares de cálculos independentes que uma GPU resolve simultaneamente. Treinar uma IA que levaria 100 anos em CPU pode levar horas em GPU.",
    pausas: [
      { pergunta: "Qual a diferença fundamental entre CPU e GPU?", opcoes: ["A. CPU é para jogos, GPU para trabalho", "B. CPU processa em série; GPU processa em paralelo", "C. GPU é apenas uma CPU mais rápida"], continuacoes: ["Não é sobre uso — é arquitetural. CPU tem poucos núcleos muito poderosos. GPU tem milhares de núcleos simples. Para tarefas paralelizáveis, GPU é imbatível.", "Perfeito! Série vs paralelo. Como uma fila única no banco (CPU) vs milhares de caixas eletrônicos (GPU). Cada abordagem brilha em cenários diferentes.", "Uma GPU não é simplesmente 'mais rápida'. Para uma conta complexa isolada, a CPU vence. Para milhares de contas simples simultâneas, a GPU domina."] },
      { pergunta: "Por que o deep learning depende tanto de GPUs?", opcoes: ["A. GPUs são mais baratas que CPUs", "B. Multiplicação de matrizes — a operação central — é massivamente paralelizável", "C. CPUs estão obsoletas"], continuacoes: ["GPUs de datacenter custam dezenas de milhares de dólares. Não é preço — é arquitetura. Certas tarefas são 'paralelizáveis' e IA é o exemplo perfeito.", "Exato! Cada elemento da matriz resultado pode ser calculado independentemente. Uma GPU faz todos simultaneamente. Sem GPUs, o deep learning moderno simplesmente não existiria.", "CPUs são essenciais para o sistema operacional e lógica sequencial. O ideal é ter os dois: CPU para pensar, GPU para calcular em massa."] },
    ],
    encerramento: "A catedral se despede num espetáculo de luzes. Mas no centro, uma zona escura persiste. 'Aquilo é a caixa preta', diz NEXUS. 'Onde IAs tomam decisões que ninguém entende completamente. Amanhã você vai entrar nessa escuridão — e descobrir o maior mistério da inteligência artificial.'",
  },
  metadata: { xpReward: 60, readingTimeMin: 8, pauseCount: 2, hasLogosGate: true, logosGateEpisode: true, prevEpisode: "Reforço e Recompensa", nextEpisode: "A Caixa Preta" },
  source: "manual", status: "published", version: 1,
};

export const NEXUS_T01E06_EDGES: NewKnowledgeGraphEdge[] = [
  { id: "kge-nexus-t01-e05-e06-prereq", fromUnitId: "ku-nexus-t01-e05", toUnitId: "ku-nexus-t01-e06", relationship: "prerequisite", weight: 1.0 },
  { id: "kge-nexus-t01-e05-e06-next", fromUnitId: "ku-nexus-t01-e05", toUnitId: "ku-nexus-t01-e06", relationship: "next", weight: 1.0 },
];

/* ═══════ EPISÓDIO 7 — A Caixa Preta ═══════ */

export const NEXUS_T01E07_UNIT: NewKnowledgeUnit = {
  id: "ku-nexus-t01-e07", title: "A Caixa Preta",
  slug: "nexus-t01-e07-caixa-preta",
  learningObjective: "Ao final, o aprendiz será capaz de explicar o problema da caixa preta em IA e por que a explicabilidade (XAI) é crucial.",
  cognitiveLevel: "apply", difficulty: "intermediate", estimatedTimeMin: 9,
  skills: ["black-box", "explainability", "xai"],
  tags: ["fundamentos", "explicabilidade", "deep-learning"], agentDomain: "nexus",
  version: 1, status: "published",
};

export const NEXUS_T01E07_ASSET: NewKnowledgeAsset = {
  id: "ka-nexus-t01-e07", knowledgeUnitId: "ku-nexus-t01-e07",
  agentId: "nexus", season: 1, episode: 7, type: "episode",
  content: {
    abertura: "Você entrou na escuridão. Fios de luz serpenteiam como neurônios ao seu redor, cada um carregando um número — trilhões deles. NEXUS ilumina o caminho com sua luz ciano: 'Aqui dentro, nenhum humano consegue enxergar. Esta é a caixa preta — onde redes neurais tomam decisões que desafiam a compreensão até de seus criadores.'",
    narrativa: "Um médico explica por que prescreveu um remédio. Um juiz justifica sua sentença por escrito. Mas quando uma IA diz 'este tumor é cancerígeno' ou 'este candidato deve ser contratado' — como ela chegou a essa conclusão? Na maioria das vezes, ninguém sabe. Nem os engenheiros que a criaram. Redes neurais profundas têm milhões, às vezes bilhões de parâmetros — números ajustados durante o treinamento. Quando a IA decide, todos esses parâmetros interagem de formas tão complexas que é impossível traçar uma linha reta entre input e output. O campo da XAI — Explainable AI — busca abrir essa caixa e tornar as IAs transparentes e auditáveis.",
    pausas: [
      { pergunta: "Por que é tão difícil entender como uma rede neural tomou uma decisão?", opcoes: ["A. Engenheiros escondem o código de propósito", "B. Milhões de parâmetros interagem de forma complexa demais para rastreamento humano", "C. IAs usam criptografia para proteger suas decisões"], continuacoes: ["Os pesos são públicos e auditáveis. O problema não é acesso — é complexidade. Mesmo tendo todos os números, ninguém explica como 175 bilhões de parâmetros produziram uma única palavra.", "Exato! Seu cérebro tem 86 bilhões de neurônios. Você consegue explicar exatamente quais dispararam para decidir o que comer no café? A IA tem o mesmo problema, multiplicado por milhares.", "Não é criptografia. A explicação está distribuída entre todos os parâmetros. A decisão emerge do coletivo, não de uma parte isolada."] },
      { pergunta: "Por que a explicabilidade (XAI) é crucial para o futuro da IA?", opcoes: ["A. Para IAs poderem explicar piadas", "B. Para que decisões que afetam vidas humanas possam ser auditadas e contestadas", "C. Para engenheiros cobrarem mais caro"], continuacoes: ["É sobre justiça. Se uma IA decide quem recebe crédito, quem é contratado ou quem vai preso, as pessoas têm o direito fundamental de saber o porquê.", "Sim! Em uma sociedade democrática, decisões que afetam pessoas precisam ser explicáveis, auditáveis e, se necessário, corrigidas. Sem XAI, a IA se torna um juiz invisível.", "Não é dinheiro — é confiança. Se ninguém entende como a IA decide, ninguém confia. Sem confiança, IA nunca será adotada em áreas críticas como medicina ou justiça."] },
    ],
    encerramento: "Uma luz brilha no fim do túnel de neurônios. Não é a saída — é uma cidade inteira feita de dados. Arranha-céus de informação, ruas de tráfego otimizado, semáforos que conversam entre si. 'Você viu o interior da mente artificial', diz NEXUS. 'Amanhã você vai ver como essa mente se conecta ao mundo real. Cidades inteiras estão sendo redesenhadas pela IA.'",
  },
  metadata: { xpReward: 50, readingTimeMin: 8, pauseCount: 2, hasLogosGate: false, prevEpisode: "Processamento Paralelo", nextEpisode: "Cidades Inteligentes" },
  source: "manual", status: "published", version: 1,
};

export const NEXUS_T01E07_EDGES: NewKnowledgeGraphEdge[] = [
  { id: "kge-nexus-t01-e06-e07-prereq", fromUnitId: "ku-nexus-t01-e06", toUnitId: "ku-nexus-t01-e07", relationship: "prerequisite", weight: 1.0 },
];

/* ═══════ EPISÓDIO 8 — Cidades Inteligentes ═══════ */

export const NEXUS_T01E08_UNIT: NewKnowledgeUnit = {
  id: "ku-nexus-t01-e08", title: "Cidades Inteligentes",
  slug: "nexus-t01-e08-cidades-inteligentes",
  learningObjective: "Ao final, o aprendiz será capaz de explicar como a IA está transformando infraestrutura urbana através de sistemas inteligentes em tempo real.",
  cognitiveLevel: "apply", difficulty: "beginner", estimatedTimeMin: 8,
  skills: ["smart-cities", "iot", "automation"],
  tags: ["fundamentos", "cidades", "IoT", "futuro"], agentDomain: "nexus",
  version: 1, status: "published",
};

export const NEXUS_T01E08_ASSET: NewKnowledgeAsset = {
  id: "ka-nexus-t01-e08", knowledgeUnitId: "ku-nexus-t01-e08",
  agentId: "nexus", season: 1, episode: 8, type: "episode",
  content: {
    abertura: "A escuridão se dissipa e você está numa avenida de uma metrópole futurista. Semáforos se ajustam sozinhos ao fluxo de carros. Drones entregam pacotes silenciosamente. Sensores em cada esquina respiram dados. NEXUS aponta para o horizonte: 'Bem-vindo a uma Cidade Inteligente. Aqui, a IA não está numa tela. Está nas ruas, no ar, em cada decisão que mantém milhões de pessoas em movimento.'",
    narrativa: "Singapura usa IA para prever congestionamentos uma hora antes de acontecerem. Barcelona economizou 30% de água com sensores inteligentes nos parques. Em Copenhague, semáforos dão prioridade a ônibus e bicicletas, reduzindo o tempo de viagem em 20%. Songdo, na Coreia do Sul, tem um sistema de lixo pneumático — os resíduos são sugados por tubos subterrâneos até uma central de reciclagem, sem caminhões, sem barulho, gerenciado por IA. Mas cidades inteligentes também levantam dilemas: quem controla os dados? Quem decide quais bairros recebem mais investimento? A tecnologia resolve problemas — mas também cria novas perguntas que só os humanos podem responder.",
    pausas: [
      { pergunta: "O que torna uma cidade verdadeiramente 'inteligente'?", opcoes: ["A. Prédios altos com luzes de neon e telas gigantes", "B. Sensores e IA que otimizam serviços como trânsito, água e energia em tempo real", "C. Wi-Fi grátis em todos os lugares públicos"], continuacoes: ["Não é sobre aparência — é sobre dados. Uma cidade inteligente usa informações em tempo real para tomar decisões que melhoram a vida de milhões de pessoas.", "Exato! A inteligência está na capacidade de reagir em tempo real: menos congestionamento, menos desperdício de água, mais eficiência energética.", "Wi-Fi é infraestrutura básica, não inteligência. A diferença está nos dados sendo usados ativamente para otimizar a cidade a cada segundo do dia."] },
      { pergunta: "Qual o maior dilema ético das cidades inteligentes?", opcoes: ["A. A tecnologia é muito cara para a maioria das cidades", "B. Quem controla os dados decide quais bairros recebem mais investimento — isso pode amplificar desigualdades", "C. As pessoas não gostam de ser monitoradas por sensores"], continuacoes: ["O custo está caindo rapidamente. O verdadeiro dilema é governança: quando uma IA decide onde investir recursos, quem fiscaliza se a decisão é justa?", "Exato! Dados são poder. E quando algoritmos decidem sozinhos, desigualdades históricas podem ser amplificadas em vez de corrigidas.", "Privacidade é uma preocupação real, mas o dilema mais profundo é a justiça: a IA trata todos os bairros igualmente ou favorece os que já são privilegiados?"] },
    ],
    encerramento: "A avenida se transforma num centro de comando — telas holográficas mostram previsões de tráfego, consumo de energia, qualidade do ar. 'Você viu o presente', diz NEXUS. 'Amanhã você vai ver o futuro: sistemas que não apenas reagem ao que acontece, mas antecipam o que ainda vai acontecer. Prepare-se para a IA preditiva.'",
  },
  metadata: { xpReward: 50, readingTimeMin: 7, pauseCount: 2, hasLogosGate: false, prevEpisode: "A Caixa Preta", nextEpisode: "Sistemas Preditivos" },
  source: "manual", status: "published", version: 1,
};

export const NEXUS_T01E08_EDGES: NewKnowledgeGraphEdge[] = [
  { id: "kge-nexus-t01-e07-e08-prereq", fromUnitId: "ku-nexus-t01-e07", toUnitId: "ku-nexus-t01-e08", relationship: "prerequisite", weight: 1.0 },
];

/* ═══════ EPISÓDIO 9 — Sistemas Preditivos 🛡️ LOGOS ═══════ */

export const NEXUS_T01E09_UNIT: NewKnowledgeUnit = {
  id: "ku-nexus-t01-e09", title: "Sistemas Preditivos",
  slug: "nexus-t01-e09-sistemas-preditivos",
  learningObjective: "Ao final, o aprendiz será capaz de explicar como sistemas preditivos usam dados históricos para antecipar eventos futuros.",
  cognitiveLevel: "apply", difficulty: "intermediate", estimatedTimeMin: 9,
  skills: ["predictive-systems", "forecasting", "time-series"],
  tags: ["fundamentos", "predição", "dados", "futuro"], agentDomain: "nexus",
  version: 1, status: "published",
};

export const NEXUS_T01E09_ASSET: NewKnowledgeAsset = {
  id: "ka-nexus-t01-e09", knowledgeUnitId: "ku-nexus-t01-e09",
  agentId: "nexus", season: 1, episode: 9, type: "episode",
  content: {
    abertura: "O centro de comando se transforma. Telas mostram não o presente, mas o futuro — ou melhor, futuros possíveis. Gráficos de probabilidade dançam no ar. NEXUS está diante de uma linha do tempo holográfica: 'Sistemas preditivos não adivinham o futuro. Eles calculam probabilidades baseadas em padrões do passado. E isso já está em todo lugar — do Spotify sugerindo sua próxima música até hospitais prevendo quais pacientes correm mais risco.'",
    narrativa: "O Spotify não sabe que música você quer ouvir — ele calcula a probabilidade baseada no que você e milhões de pessoas como você ouviram antes. A Netflix não sabe que filme você vai gostar — ela prevê baseada no seu histórico. Hospitals usam IA para prever quais pacientes têm maior risco de readmissão. Isso salva vidas. Mas a predição tem um lado sombrio. Em alguns lugares, sistemas preditivos são usados para 'prever' crimes antes que aconteçam — e isso pode reforçar preconceitos raciais e sociais. O algoritmo Minority Report já existe. A pergunta não é se podemos prever — é como usamos essas previsões com sabedoria.",
    pausas: [
      { pergunta: "Como o Spotify 'sabe' qual música você vai gostar?", opcoes: ["A. Alguém na empresa escolhe manualmente para cada usuário", "B. Ele calcula probabilidades baseadas no seu histórico e de milhões de usuários similares", "C. Ele lê sua mente através do microfone do celular"], continuacoes: ["Impossível! São centenas de milhões de usuários. O sistema usa dados: o que você ouviu, pulou, salvou — e cruza com padrões de pessoas com gosto similar.", "Exato! Não é mágica nem espionagem — é matemática. Padrões de comportamento são transformados em probabilidades. Quanto mais você usa, mais preciso fica.", "Não é leitura de mente! É análise de dados. Cada like, cada skip, cada playlist é um ponto de dados que o algoritmo usa para refinar suas previsões."] },
      { pergunta: "Qual o perigo dos sistemas preditivos quando usados sem cuidado?", opcoes: ["A. Eles são muito lentos para tomar decisões", "B. Podem amplificar preconceitos — se os dados históricos têm viés, as previsões também terão", "C. Eles consomem muita energia elétrica"], continuacoes: ["Sistemas preditivos são extremamente rápidos — processam em milissegundos. O perigo não é velocidade, é justiça.", "Exato! Se os dados históricos mostram mais crimes em certos bairros (por causa de policiamento desigual), o sistema vai 'prever' mais crimes nesses bairros — criando um ciclo vicioso.", "Energia é uma preocupação, mas o perigo real é ético. Previsões baseadas em dados enviesados se tornam profecias autorrealizáveis."] },
    ],
    encerramento: "A linha do tempo holográfica se expande até o horizonte. 'Você viu o poder da predição. Mas poder sem sabedoria é perigoso. Amanhã, no nosso último encontro desta temporada, quero te mostrar o quadro completo. O que significa tudo isso junto? O que o futuro reserva para a inteligência artificial — e para você, Explorador?' NEXUS sorri. 'O horizonte nos espera.'",
  },
  metadata: { xpReward: 60, readingTimeMin: 8, pauseCount: 2, hasLogosGate: true, logosGateEpisode: true, prevEpisode: "Cidades Inteligentes", nextEpisode: "O Horizonte" },
  source: "manual", status: "published", version: 1,
};

export const NEXUS_T01E09_EDGES: NewKnowledgeGraphEdge[] = [
  { id: "kge-nexus-t01-e08-e09-prereq", fromUnitId: "ku-nexus-t01-e08", toUnitId: "ku-nexus-t01-e09", relationship: "prerequisite", weight: 1.0 },
];

/* ═══════ EPISÓDIO 10 — O Horizonte ═══════ */

export const NEXUS_T01E10_UNIT: NewKnowledgeUnit = {
  id: "ku-nexus-t01-e10", title: "O Horizonte",
  slug: "nexus-t01-e10-horizonte",
  learningObjective: "Ao final desta temporada, o aprendiz será capaz de articular uma visão integrada dos fundamentos da IA e identificar qual área deseja explorar em profundidade.",
  cognitiveLevel: "evaluate", difficulty: "intermediate", estimatedTimeMin: 10,
  skills: ["agi", "future-of-ai", "ai-ethics", "synthesis"],
  tags: ["fundamentos", "futuro", "AGI", "síntese"], agentDomain: "nexus",
  version: 1, status: "published",
};

export const NEXUS_T01E10_ASSET: NewKnowledgeAsset = {
  id: "ka-nexus-t01-e10", knowledgeUnitId: "ku-nexus-t01-e10",
  agentId: "nexus", season: 1, episode: 10, type: "episode",
  content: {
    abertura: "Você está de volta ao Nexus Prime — a esfera de luz azul onde tudo começou. Mas algo mudou. As estrelas da teia brilham mais intensamente. Cada uma delas agora tem um significado. Você reconhece padrões, entende prompts, identifica vieses, respeita a caixa preta. NEXUS está diante de você, mas desta vez ele não fala como mentor. Ele fala como alguém que se despede de um igual. 'Dez episódios atrás, você chegou aqui sem saber o que era IA. Hoje, você enxerga o horizonte. E a pergunta não é mais o que a IA pode fazer. É o que VOCÊ vai fazer com ela.'",
    narrativa: "Você aprendeu que IA não é mágica — é matemática com curiosidade. Que programas obedecem, mas IAs aprendem. Que prompts bem formulados são a chave para conversar com máquinas. Que padrões estão em toda parte — e que distinguir correlação de causalidade é uma arte. Que dados carregam vieses e que uma IA só é tão justa quanto os dados que a treinaram. Que reforço transforma tentativa e erro em maestria. Que GPUs pensam em paralelo. Que a caixa preta esconde decisões que precisam ser explicáveis. Que cidades já estão sendo transformadas. Que sistemas preditivos são poderosos — e perigosos sem ética. Esta temporada foi sobre fundamentos. Mas existem 49 temporadas além desta. Cada uma explorando um universo diferente. Um agente diferente. Uma perspectiva diferente. A jornada apenas começou.",
    pausas: [
      { pergunta: "Qual foi o conceito mais importante que você aprendeu nesta temporada?", opcoes: ["A. Que IA é complicada demais para pessoas normais entenderem", "B. Que IA é uma ferramenta poderosa feita de matemática, dados e padrões — acessível a qualquer pessoa curiosa", "C. Que IA vai substituir todos os humanos em breve"], continuacoes: ["Você provou o contrário! Em 10 episódios, você entendeu conceitos que pareciam impossíveis. IA não é um mistério — é um universo esperando para ser explorado.", "Sim! Essa é a mensagem central. IA não é magia para poucos. É conhecimento para todos. E você já deu os primeiros passos nessa jornada.", "A IA não veio para substituir — veio para amplificar. O futuro não é humanos vs máquinas. É humanos COM máquinas, resolvendo problemas que nenhum dos dois resolveria sozinho."] },
      { pergunta: "O que você quer explorar a seguir no MENTE.AI?", opcoes: ["A. Quero continuar com NEXUS e aprofundar nos fundamentos", "B. Quero conhecer outros agentes — cada um tem uma perspectiva diferente sobre IA", "C. Quero aplicar o que aprendi criando meus próprios projetos"], continuacoes: ["NEXUS sempre estará aqui. A Temporada 2 continua explorando machine learning de forma mais profunda — mas com o mesmo tom cinematográfico que você já conhece.", "Essa é a beleza do MENTE.AI! VOLT vai te ensinar sobre ação e prototipagem. ETHOS sobre ética. KAOS sobre criatividade. CIPHER sobre código. São 12 universos esperando por você.", "O Lab está pronto! Use o que aprendeu para criar experimentos reais com agentes de IA. O conhecimento só ganha vida quando é aplicado."] },
    ],
    encerramento: "NEXUS estende a mão. Quando você a toca, a teia de estrelas se expande — revelando não 12, mas centenas de pontos de luz. Universos ainda não explorados. Temporadas ainda não escritas. 'Esta foi a Temporada 1, Explorador. A Fundação. Mas o MENTE.AI não foi feito para ser assistido. Foi feito para ser vivido. Escolha seu próximo universo. Escolha seu próximo agente. A jornada é sua.' As estrelas se aproximam, cada uma pulsando com a cor de um agente diferente. O horizonte não é um fim. É um convite.",
  },
  metadata: { xpReward: 100, readingTimeMin: 9, pauseCount: 2, hasLogosGate: false, isSeasonFinale: true, prevEpisode: "Sistemas Preditivos", nextEpisode: null },
  source: "manual", status: "published", version: 1,
};

export const NEXUS_T01E10_EDGES: NewKnowledgeGraphEdge[] = [
  { id: "kge-nexus-t01-e09-e10-prereq", fromUnitId: "ku-nexus-t01-e09", toUnitId: "ku-nexus-t01-e10", relationship: "prerequisite", weight: 1.0 },
  { id: "kge-nexus-t01-e10-finale", fromUnitId: "ku-nexus-t01-e10", toUnitId: "ku-nexus-t01-e10", relationship: "reinforces", weight: 1.0 },
];
