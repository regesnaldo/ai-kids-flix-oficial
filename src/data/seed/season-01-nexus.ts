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
  // E02 → E03 (next) — será criado quando E03 for produzido
];
