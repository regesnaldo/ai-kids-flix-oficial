// ─── src/data/seed/season-01-ethos.ts ───────────────────────────────────────
// ETHOS — Temporada 1: Ética, Filosofia e Sabedoria
// Agente: ETHOS (Guardião da Ética) · Cor: #ffa500 (dourado)
// Padrão canônico MENTE.AI

import type { NewKnowledgeUnit, NewKnowledgeAsset, NewKnowledgeGraphEdge } from "@/lib/db/schema";

/* ═══════ EPISÓDIO 1 — O Dilema Inicial ═══════ */

export const ETHOS_T01E01_UNIT: NewKnowledgeUnit = {
  id: "ku-ethos-t01-e01", title: "O Dilema Inicial",
  slug: "ethos-t01-e01-dilema-inicial",
  learningObjective: "Ao final, o aprendiz será capaz de reconhecer dilemas éticos e entender que a ética é uma bússola, não um manual.",
  cognitiveLevel: "remember", difficulty: "beginner", estimatedTimeMin: 8,
  skills: ["ethics-awareness", "moral-dilemma", "decision-framework"],
  tags: ["fundamentos", "ética", "dilema"], agentDomain: "ethos",
  version: 1, status: "published",
};

export const ETHOS_T01E01_ASSET: NewKnowledgeAsset = {
  id: "ka-ethos-t01-e01", knowledgeUnitId: "ku-ethos-t01-e01",
  agentId: "ethos", season: 1, episode: 1, type: "episode",
  content: {
    abertura: "Você está numa biblioteca infinita. Prateleiras se estendem até perder de vista. Mas não são livros — são decisões. Cada lombada tem um nome: 'Mentir para proteger', 'Roubar para alimentar', 'Obedecer ordens injustas'. No centro, uma figura luminosa dourada folheia calmamente um volume. 'Bem-vindo à Biblioteca da Consciência. Eu sou ETHOS. Antes de qualquer pergunta, quero te fazer uma: se você pudesse salvar 5 pessoas sacrificando 1, você faria?'",
    narrativa: "O 'trolley problem' é o dilema ético mais famoso do mundo: um bonde desgovernado vai atropelar 5 pessoas. Você pode puxar uma alavanca e desviar o bonde para outro trilho — onde está 1 pessoa. Você puxa a alavanca? A maioria diz que sim. Mas e se, em vez de uma alavanca, você tivesse que EMPURRAR uma pessoa na frente do bonde para salvar as 5? A maioria diz que não. Por quê? O resultado é o mesmo: 1 morre, 5 vivem. Mas empurrar PARECE pior. ETHOS sorri. 'Ética não é sobre respostas certas. É sobre entender por que algumas respostas parecem mais certas que outras.'",
    pausas: [
      { pergunta: "Você puxaria a alavanca no dilema do bonde?", opcoes: ["A. Sim — 5 vidas valem mais que 1", "B. Não — eu não tenho o direito de decidir quem vive e quem morre", "C. Depende — quem são as pessoas nos trilhos?"], continuacoes: ["Essa é a resposta utilitarista: maximizar o bem para o maior número. Mas ela tem falhas — e se a pessoa no outro trilho for um médico que salvaria milhares?", "Essa é a resposta deontológica: certas ações são erradas independentemente das consequências. Mas se você NÃO agir, 5 pessoas morrem — isso também é uma escolha.", "Essa é a resposta contextual: a ética depende das circunstâncias. E se a pessoa no outro trilho for um criminoso? E se as 5 forem crianças? O contexto importa."] },
      { pergunta: "Por que EMPURRAR alguém parece pior que puxar uma alavanca, mesmo com o mesmo resultado?", opcoes: ["A. Porque exige contato físico direto — nosso cérebro trata ação direta como mais 'real'", "B. Porque empurrar é crime e puxar alavanca não", "C. Porque as pessoas gostam mais de alavancas"], continuacoes: ["Exato! A psicologia moral mostra que o contato físico ativa áreas diferentes do cérebro. A ética não é só lógica — é emoção também.", "Legalmente, os dois podem ser considerados homicídio. A diferença é PSICOLÓGICA, não legal.", "Não é sobre preferência por objetos. É sobre a diferença entre ação direta e indireta — um dos debates mais antigos da filosofia moral."] },
    ],
    encerramento: "ETHOS fecha o livro. 'Você enfrentou seu primeiro dilema. Mas a ética não é só sobre bondes e alavancas — é sobre decisões reais, com pessoas reais. Amanhã, as 4 leis da robótica que vão além de Asimov.'",
  },
  metadata: { xpReward: 50, readingTimeMin: 8, pauseCount: 2, hasLogosGate: false, prevEpisode: null, nextEpisode: "As Leis da Consciência" },
  source: "manual", status: "published", version: 1,
};

export const ETHOS_T01E01_EDGES: NewKnowledgeGraphEdge[] = [
  { id: "kge-ethos-t01-e01-e02", fromUnitId: "ku-ethos-t01-e01", toUnitId: "ku-ethos-t01-e02", relationship: "next", weight: 1.0 },
];

/* ═══════ EPISÓDIO 2 — As Leis da Consciência ═══════ */

export const ETHOS_T01E02_UNIT: NewKnowledgeUnit = {
  id: "ku-ethos-t01-e02", title: "As Leis da Consciência", slug: "ethos-t01-e02-leis-da-consciencia",
  learningObjective: "Ao final, o aprendiz será capaz de explicar frameworks éticos para IA e seus limites.",
  cognitiveLevel: "understand", difficulty: "beginner", estimatedTimeMin: 8,
  skills: ["ai-ethics", "asimov", "governance"], tags: ["fundamentos", "leis", "IA"], agentDomain: "ethos", version: 1, status: "published",
};

export const ETHOS_T01E02_ASSET: NewKnowledgeAsset = {
  id: "ka-ethos-t01-e02", knowledgeUnitId: "ku-ethos-t01-e02",
  agentId: "ethos", season: 1, episode: 2, type: "episode",
  content: {
    abertura: "As prateleiras da biblioteca se transformam em telas holográficas. Cada tela mostra uma manchete: 'IA nega empréstimo para minoria', 'Carro autônomo decide quem salvar', 'Algoritmo de RH descarta mulheres'. ETHOS aponta para as telas. 'Estas não são histórias de ficção científica. São decisões reais que IAs tomaram esta semana. E todas elas poderiam ter sido evitadas.'",
    narrativa: "Asimov criou as 3 leis da robótica em 1942: (1) Um robô não pode ferir um humano. (2) Deve obedecer ordens, exceto se violar a lei 1. (3) Deve se proteger, exceto se violar leis 1 ou 2. Parece perfeito, não? O problema é que as leis são ambíguas. O que significa 'ferir'? Um algoritmo de crédito que nega empréstimo está 'ferindo'? Um carro autônomo que precisa escolher entre bater num pedestre ou num poste — o que é 'ferir menos'? As leis de Asimov são um bom começo. Mas a ética real exige mais que regras. Exige contexto, nuance e responsabilidade.",
    pausas: [
      { pergunta: "Qual o maior problema com as leis da robótica de Asimov?", opcoes: ["A. São muito antigas para a tecnologia atual", "B. São ambíguas — 'ferir', 'obedecer' e 'proteger' significam coisas diferentes em contextos diferentes", "C. Nenhum robô realmente segue essas leis"], continuacoes: ["Não é questão de idade — é de precisão. As leis são princípios, não instruções. Entre o princípio e a ação existe um abismo.", "Exato! A ambiguidade é o coração do problema ético. Para um humano, 'não matar' parece claro — até você considerar legítima defesa, guerra, eutanásia.", "Robôs não 'seguem' leis como humanos. Eles seguem código. E código não entende nuance. Isso é o que torna a ética de IA tão desafiadora."] },
    ],
    encerramento: "ETHOS ilumina uma nova tela — um código de conduta para desenvolvedores. 'Asimov é o começo. Mas o futuro exige mais. Amanhã, o maior dilema do nosso tempo: vieses em IA.'",
  },
  metadata: { xpReward: 50, readingTimeMin: 7, pauseCount: 1, hasLogosGate: false, prevEpisode: "O Dilema Inicial", nextEpisode: "O Preço do Viés" },
  source: "manual", status: "published", version: 1,
};

export const ETHOS_T01E02_EDGES: NewKnowledgeGraphEdge[] = [
  { id: "kge-ethos-t01-e02-e03", fromUnitId: "ku-ethos-t01-e02", toUnitId: "ku-ethos-t01-e03", relationship: "next", weight: 1.0 },
];

/* ═══════ EPISÓDIO 3 — O Preço do Viés 🛡️ LOGOS ═══════ */

export const ETHOS_T01E03_UNIT: NewKnowledgeUnit = {
  id: "ku-ethos-t01-e03", title: "O Preço do Viés", slug: "ethos-t01-e03-preco-do-vies",
  learningObjective: "Ao final, o aprendiz será capaz de identificar como vieses éticos se manifestam em sistemas de IA e propor mitigação.",
  cognitiveLevel: "understand", difficulty: "beginner", estimatedTimeMin: 9,
  skills: ["bias", "fairness", "ethical-audit"], tags: ["fundamentos", "viés"], agentDomain: "ethos", version: 1, status: "published",
};

export const ETHOS_T01E03_ASSET: NewKnowledgeAsset = {
  id: "ka-ethos-t01-e03", knowledgeUnitId: "ku-ethos-t01-e03",
  agentId: "ethos", season: 1, episode: 3, type: "episode",
  content: {
    abertura: "Uma tela holográfica mostra dois currículos idênticos. Apenas os nomes são diferentes: 'João Silva' e 'Jamal Silva'. ETHOS observa com expressão grave. 'Em 2024, um estudo enviou 10.000 currículos idênticos — apenas os nomes variavam. Currículos com nomes 'brancos' receberam 50% mais chamadas. E o algoritmo de triagem aprendeu com esses dados. Aprendeu a discriminar.'",
    narrativa: "O algoritmo da Amazon para contratar engenheiros foi treinado com 10 anos de currículos. O problema: 10 anos de currículos majoritariamente masculinos. O algoritmo 'aprendeu' que mulheres eram menos desejáveis — penalizava currículos com palavras como 'capitã do time de xadrez feminino'. A Amazon tentou corrigir, mas não conseguiu. Abandonou o projeto. ETHOS fecha a tela. 'A IA não tem preconceito. Ela tem dados. E os dados têm a história da humanidade — incluindo séculos de desigualdade.'",
    pausas: [
      { pergunta: "Por que o algoritmo da Amazon discriminava mulheres?", opcoes: ["A. Os engenheiros programaram isso de propósito", "B. Os dados de treinamento refletiam 10 anos de contratações majoritariamente masculinas", "C. O algoritmo detectou que mulheres são menos competentes"], continuacoes: ["Não foi intencional — foi estrutural. Ninguém programou 'discrimine mulheres'. O algoritmo simplesmente aprendeu com dados desiguais.", "Exato! A IA é um espelho. Se os dados refletem desigualdade, a IA vai amplificar essa desigualdade.", "Mulheres são igualmente competentes. O problema não era competência — era representação nos dados históricos."] },
    ],
    encerramento: "ETHOS ilumina um novo caminho na biblioteca. 'Você viu o preço do viés. Mas ver não basta. Amanhã, como construir sistemas que não apenas evitam o mal — mas ativamente promovem o bem.'",
  },
  metadata: { xpReward: 50, readingTimeMin: 8, pauseCount: 1, hasLogosGate: true, logosGateEpisode: true, prevEpisode: "As Leis da Consciência", nextEpisode: "Construindo o Bem" },
  source: "manual", status: "published", version: 1,
};

export const ETHOS_T01E03_EDGES: NewKnowledgeGraphEdge[] = [];

/* ═══════ EPISÓDIO 4 — Construindo o Bem ═══════ */

export const ETHOS_T01E04_UNIT: NewKnowledgeUnit = {
  id: "ku-ethos-t01-e04", title: "Construindo o Bem", slug: "ethos-t01-e04-construindo-o-bem",
  learningObjective: "Ao final, o aprendiz será capaz de aplicar princípios de design ético no desenvolvimento de IA.",
  cognitiveLevel: "apply", difficulty: "beginner", estimatedTimeMin: 8,
  skills: ["ethical-design", "fairness", "inclusion"], tags: ["fundamentos", "design", "bem"], agentDomain: "ethos", version: 1, status: "published",
};

export const ETHOS_T01E04_ASSET: NewKnowledgeAsset = {
  id: "ka-ethos-t01-e04", knowledgeUnitId: "ku-ethos-t01-e04",
  agentId: "ethos", season: 1, episode: 4, type: "episode",
  content: {
    abertura: "A biblioteca se transforma num estúdio de design. Plantas arquitetônicas flutuam no ar — mas não são de prédios. São de sistemas éticos. ETHOS desenrola uma planta: 'Design ético não é sobre evitar multas. É sobre construir sistemas que ativamente tornam o mundo mais justo. E começa com uma pergunta: quem este sistema pode prejudicar?'",
    narrativa: "O Google criou um comitê de ética externo em 2019. Durou uma semana. Por quê? Porque incluíram pessoas com visões opostas. Mas em vez de debate produtivo, houve boicote interno. A lição: ética não é um comitê. É um processo. Toda feature, antes de ser desenvolvida, deveria responder 3 perguntas: (1) Quem pode ser prejudicado? (2) Como mitigamos? (3) Quem não está na sala e deveria estar?",
    pausas: [
      { pergunta: "Qual a pergunta mais importante no design ético?", opcoes: ["A. 'Isso é legal?'", "B. 'Quem este sistema pode prejudicar — mesmo sem intenção?'", "C. 'Quanto isso vai custar?'"], continuacoes: ["Legalidade é o piso, não o teto. Algo pode ser perfeitamente legal e ainda assim profundamente antiético.", "Exato! Pensar em quem pode ser prejudicado — especialmente grupos invisíveis — é o primeiro passo.", "Custo é importante, mas não deve ser o único critério. O custo de NÃO considerar a ética é sempre maior no longo prazo."] },
    ],
    encerramento: "As plantas se transformam em protótipos brilhantes. 'Você aprendeu a construir o bem. Mas construir é fácil quando tudo está calmo. O verdadeiro teste vem sob pressão. Amanhã, decisões extremas.'",
  },
  metadata: { xpReward: 50, readingTimeMin: 7, pauseCount: 1, hasLogosGate: false, prevEpisode: "O Preço do Viés", nextEpisode: "Sob Pressão" },
  source: "manual", status: "published", version: 1,
};

export const ETHOS_T01E04_EDGES: NewKnowledgeGraphEdge[] = [
  { id: "kge-ethos-t01-e04-e05", fromUnitId: "ku-ethos-t01-e04", toUnitId: "ku-ethos-t01-e05", relationship: "next", weight: 1.0 },
];

/* ═══════ EPISÓDIO 5 — Sob Pressão ═══════ */

export const ETHOS_T01E05_UNIT: NewKnowledgeUnit = {
  id: "ku-ethos-t01-e05", title: "Sob Pressão", slug: "ethos-t01-e05-sob-pressao",
  learningObjective: "Ao final, o aprendiz será capaz de manter princípios éticos em situações de alta pressão.",
  cognitiveLevel: "understand", difficulty: "beginner", estimatedTimeMin: 8,
  skills: ["ethical-pressure", "integrity", "crisis"], tags: ["fundamentos", "pressão"], agentDomain: "ethos", version: 1, status: "published",
};

export const ETHOS_T01E05_ASSET: NewKnowledgeAsset = {
  id: "ka-ethos-t01-e05", knowledgeUnitId: "ku-ethos-t01-e05",
  agentId: "ethos", season: 1, episode: 5, type: "episode",
  content: {
    abertura: "O estúdio treme. As plantas balançam. Uma simulação de crise: 'O sistema caiu. Dados de 10 milhões de usuários vazaram. A imprensa está ligando. O CEO quer uma resposta em 10 minutos. O que você faz?' ETHOS está calmo no centro do caos. 'Ética não é para os dias fáceis. É para ESTES momentos.'",
    narrativa: "Em 2017, a Equifax sofreu um vazamento de dados de 147 milhões de pessoas. Executivos venderam ações ANTES de anunciar o vazamento. Foram condenados. Em 2021, a Microsoft descobriu uma falha no Exchange Server. Anunciaram em 24 horas, mesmo prejudicando o valor das ações. A diferença? A Microsoft tinha um processo ético pré-estabelecido. Sob pressão, você não 'decide' ser ético. Você executa o plano que já existe.",
    pausas: [
      { pergunta: "Qual a diferença entre a Equifax e a Microsoft nas crises?", opcoes: ["A. A Microsoft é mais rica e pode se dar ao luxo de ser ética", "B. A Microsoft tinha um processo ético pré-estabelecido; a Equifax improvisou — e falhou", "C. O vazamento da Microsoft foi menor"], continuacoes: ["Não é sobre recursos — é sobre preparação. A ética precisa ser treinada ANTES da crise.", "Exato! Sob pressão, você não cria ética do zero. Você executa o que já treinou.", "O tamanho não importa. O que importa é ter um protocolo claro que guia as decisões quando tudo está caótico."] },
    ],
    encerramento: "A simulação termina. 'Você manteve a calma e seguiu o plano. Mas a ética de verdade brilha quando as regras são cinzentas. Amanhã, a zona cinzenta.'",
  },
  metadata: { xpReward: 50, readingTimeMin: 7, pauseCount: 1, hasLogosGate: false, prevEpisode: "Construindo o Bem", nextEpisode: "A Zona Cinzenta" },
  source: "manual", status: "published", version: 1,
};

export const ETHOS_T01E05_EDGES: NewKnowledgeGraphEdge[] = [
  { id: "kge-ethos-t01-e05-e06", fromUnitId: "ku-ethos-t01-e05", toUnitId: "ku-ethos-t01-e06", relationship: "next", weight: 1.0 },
];

/* ═══════ EPISÓDIO 6 — A Zona Cinzenta 🛡️ LOGOS ═══════ */

export const ETHOS_T01E06_UNIT: NewKnowledgeUnit = {
  id: "ku-ethos-t01-e06", title: "A Zona Cinzenta", slug: "ethos-t01-e06-zona-cinzenta",
  learningObjective: "Ao final, o aprendiz será capaz de navegar dilemas éticos sem resposta clara.",
  cognitiveLevel: "apply", difficulty: "intermediate", estimatedTimeMin: 9,
  skills: ["gray-areas", "ethical-navigation", "tradeoffs"], tags: ["fundamentos", "cinzenta"], agentDomain: "ethos", version: 1, status: "published",
};

export const ETHOS_T01E06_ASSET: NewKnowledgeAsset = {
  id: "ka-ethos-t01-e06", knowledgeUnitId: "ku-ethos-t01-e06",
  agentId: "ethos", season: 1, episode: 6, type: "episode",
  content: {
    abertura: "A biblioteca escurece. Não há mais livros — apenas névoa cinzenta. Nenhuma placa, nenhuma seta. ETHOS está ao seu lado. 'A maioria dos dilemas éticos não é preto no branco. É cinza. E é no cinza que as decisões mais importantes são tomadas.'",
    narrativa: "Imagine: você trabalha numa rede social. Seu algoritmo de recomendação aumenta o engajamento — mas também espalha desinformação. Você ganha dinheiro com anúncios — mas os anúncios são segmentados de forma predatória. Você não está fazendo nada 'ilegal'. Mas está fazendo algo certo? A zona cinzenta é onde a lei termina e a consciência começa.",
    pausas: [
      { pergunta: "Se algo é legal, é necessariamente ético?", opcoes: ["A. Sim — se está na lei, está certo", "B. Não — legalidade e ética são coisas diferentes. Escravidão já foi legal", "C. Depende do país"], continuacoes: ["A história está cheia de exemplos de leis injustas. Legalidade é o que você PODE fazer. Ética é o que você DEVE fazer.", "Exato! Esse é o ponto central. A lei define o mínimo. A ética define o ideal. A zona cinzenta está entre os dois.", "Não depende do país — o princípio é universal. Em qualquer lugar, legalidade e moralidade podem divergir."] },
    ],
    encerramento: "A névoa começa a se dissipar. 'Você navegou a zona cinzenta. Mas decidir sozinho é uma coisa. Decidir por milhões é outra. Amanhã, o peso da liderança ética.'",
  },
  metadata: { xpReward: 60, readingTimeMin: 8, pauseCount: 1, hasLogosGate: true, logosGateEpisode: true, prevEpisode: "Sob Pressão", nextEpisode: "O Peso da Liderança" },
  source: "manual", status: "published", version: 1,
};

export const ETHOS_T01E06_EDGES: NewKnowledgeGraphEdge[] = [
  { id: "kge-ethos-t01-e06-e07", fromUnitId: "ku-ethos-t01-e06", toUnitId: "ku-ethos-t01-e07", relationship: "next", weight: 1.0 },
];

/* ═══════ EPISÓDIO 7 — O Peso da Liderança ═══════ */

export const ETHOS_T01E07_UNIT: NewKnowledgeUnit = {
  id: "ku-ethos-t01-e07", title: "O Peso da Liderança", slug: "ethos-t01-e07-peso-da-lideranca",
  learningObjective: "Ao final, o aprendiz será capaz de liderar decisões éticas em equipes.",
  cognitiveLevel: "apply", difficulty: "beginner", estimatedTimeMin: 8,
  skills: ["leadership", "ethical-decision", "accountability"], tags: ["fundamentos", "liderança"], agentDomain: "ethos", version: 1, status: "published",
};

export const ETHOS_T01E07_ASSET: NewKnowledgeAsset = {
  id: "ka-ethos-t01-e07", knowledgeUnitId: "ku-ethos-t01-e07",
  agentId: "ethos", season: 1, episode: 7, type: "episode",
  content: {
    abertura: "Você está numa mesa redonda. Cadeiras vazias ao redor. Cada cadeira representa alguém afetado pelas suas decisões: usuários, funcionários, acionistas, sociedade. ETHOS ocupa uma cadeira — mas não a cabeceira. 'Liderança ética não é sobre estar no topo. É sobre garantir que todas as vozes sejam ouvidas — mesmo as que não estão na sala.'",
    narrativa: "Satya Nadella transformou a Microsoft mudando a cultura de 'sabe-tudo' para 'aprende-tudo'. Em vez de competição interna, colaboração. Em vez de medo, segurança psicológica. O resultado: a Microsoft voltou a ser a empresa mais valiosa do mundo. Não apesar da ética — POR CAUSA dela. Liderança ética não é um custo. É uma vantagem competitiva.",
    pausas: [
      { pergunta: "O que Satya Nadella mudou na Microsoft?", opcoes: ["A. Ele demitiu todo mundo e contratou novos funcionários", "B. Ele transformou a cultura de 'sabe-tudo' para 'aprende-tudo' — colaboração em vez de competição", "C. Ele cortou custos e terceirizou tudo"], continuacoes: ["Não foi demissão — foi transformação cultural. As mesmas pessoas, com uma mentalidade diferente.", "Exato! Cultura é o sistema operacional de uma empresa. Nadella trocou o sistema — e o hardware brilhou.", "Não foi corte de custos — foi investimento em cultura. A ética não é despesa. É o melhor investimento de longo prazo."] },
    ],
    encerramento: "As cadeiras se iluminam uma a uma. 'Você entendeu o peso. Mas liderar é fácil no presente. O verdadeiro desafio é pensar em quem ainda nem nasceu. Amanhã, ética intergeracional.'",
  },
  metadata: { xpReward: 50, readingTimeMin: 7, pauseCount: 1, hasLogosGate: false, prevEpisode: "A Zona Cinzenta", nextEpisode: "O Futuro Herdado" },
  source: "manual", status: "published", version: 1,
};

export const ETHOS_T01E07_EDGES: NewKnowledgeGraphEdge[] = [
  { id: "kge-ethos-t01-e07-e08", fromUnitId: "ku-ethos-t01-e07", toUnitId: "ku-ethos-t01-e08", relationship: "next", weight: 1.0 },
];

/* ═══════ EPISÓDIO 8 — O Futuro Herdado ═══════ */

export const ETHOS_T01E08_UNIT: NewKnowledgeUnit = {
  id: "ku-ethos-t01-e08", title: "O Futuro Herdado", slug: "ethos-t01-e08-futuro-herdado",
  learningObjective: "Ao final, o aprendiz será capaz de considerar o impacto intergeracional das decisões tecnológicas.",
  cognitiveLevel: "apply", difficulty: "intermediate", estimatedTimeMin: 9,
  skills: ["intergenerational", "long-term", "legacy"], tags: ["fundamentos", "futuro"], agentDomain: "ethos", version: 1, status: "published",
};

export const ETHOS_T01E08_ASSET: NewKnowledgeAsset = {
  id: "ka-ethos-t01-e08", knowledgeUnitId: "ku-ethos-t01-e08",
  agentId: "ethos", season: 1, episode: 8, type: "episode",
  content: {
    abertura: "A biblioteca se transforma numa linha do tempo que se estende por séculos. Você vê gerações passadas — e futuras. ETHOS aponta para o futuro. 'Cada linha de código que escrevemos hoje é uma herança para quem ainda não nasceu. A pergunta mais ética que você pode fazer não é 'isso funciona?' — é 'meus netos se orgulhariam disso?'",
    narrativa: "Os criadores da internet nos anos 70 nunca imaginaram fake news, deepfakes ou vício em redes sociais. Eles estavam resolvendo problemas de conectividade. Mas suas decisões ecoam até hoje. A ética intergeracional pergunta: 'Se eu não sei o que minha tecnologia vai se tornar, como posso construí-la com segurança?' A resposta: construa com reversibilidade. Deixe portas abertas para correção. Documente suas intenções.",
    pausas: [
      { pergunta: "Por que os criadores da internet não previram fake news?", opcoes: ["A. Eles eram ingênuos", "B. Eles estavam resolvendo problemas de conectividade — os problemas sociais vieram depois, e ninguém está imune a consequências imprevistas", "C. Eles não se importavam com o futuro"], continuacoes: ["Não era ingenuidade — era foco. Eles estavam construindo uma rede. Ninguém imaginava que viraria praça pública.", "Exato! Toda tecnologia tem consequências imprevistas. A ética intergeracional é sobre construir pontes para correção.", "Eles se importavam profundamente. Tanto que criaram protocolos abertos. Mas prever o futuro é impossível. Preparar-se para ele não."] },
    ],
    encerramento: "A linha do tempo se enrola formando um círculo. 'Você viu o futuro. Mas a ética não é só sobre evitar danos. É sobre criar um legado. Amanhã, o Legado.'",
  },
  metadata: { xpReward: 50, readingTimeMin: 7, pauseCount: 1, hasLogosGate: false, prevEpisode: "O Peso da Liderança", nextEpisode: "O Legado" },
  source: "manual", status: "published", version: 1,
};

export const ETHOS_T01E08_EDGES: NewKnowledgeGraphEdge[] = [
  { id: "kge-ethos-t01-e08-e09", fromUnitId: "ku-ethos-t01-e08", toUnitId: "ku-ethos-t01-e09", relationship: "next", weight: 1.0 },
];

/* ═══════ EPISÓDIO 9 — O Legado 🛡️ LOGOS ═══════ */

export const ETHOS_T01E09_UNIT: NewKnowledgeUnit = {
  id: "ku-ethos-t01-e09", title: "O Legado", slug: "ethos-t01-e09-o-legado",
  learningObjective: "Ao final, o aprendiz será capaz de integrar princípios éticos em seu legado profissional.",
  cognitiveLevel: "apply", difficulty: "intermediate", estimatedTimeMin: 9,
  skills: ["legacy", "purpose", "ethical-career"], tags: ["fundamentos", "legado"], agentDomain: "ethos", version: 1, status: "published",
};

export const ETHOS_T01E09_ASSET: NewKnowledgeAsset = {
  id: "ka-ethos-t01-e09", knowledgeUnitId: "ku-ethos-t01-e09",
  agentId: "ethos", season: 1, episode: 9, type: "episode",
  content: {
    abertura: "A biblioteca se transforma num jardim. Cada árvore é o legado de alguém que veio antes. Algumas são frondosas. Outras estão murchas. ETHOS toca uma árvore jovem. 'Esta é a sua. Ainda pequena. Mas o que você plantar agora — seus valores, suas decisões — vai crescer por décadas depois que você se for.'",
    narrativa: "Tim Berners-Lee, criador da World Wide Web, poderia ter patenteado sua invenção e se tornado bilionário. Em vez disso, doou para a humanidade. Sua árvore no jardim da ética é uma das maiores. 'Legado não é sobre dinheiro. É sobre o que permanece quando o dinheiro acaba.'",
    pausas: [
      { pergunta: "Por que Tim Berners-Lee não patenteou a web?", opcoes: ["A. Ele não sabia que podia ganhar dinheiro", "B. Ele acreditava que a web deveria ser um bem público, não propriedade privada", "C. O escritório de patentes rejeitou o pedido"], continuacoes: ["Ele sabia. E escolheu conscientemente não patentear. Um dos maiores atos de generosidade da história da tecnologia.", "Exato! Ele poderia ser bilionário. Preferiu ser livre — e libertou o mundo junto.", "Não houve rejeição. Houve uma escolha. E essa escolha definiu a internet como a conhecemos."] },
    ],
    encerramento: "Sua árvore brilha. 'Você plantou seu legado. Mas o jardim nunca está pronto. Amanhã, o último episódio: sabedoria — o fruto de todas as estações.'",
  },
  metadata: { xpReward: 60, readingTimeMin: 8, pauseCount: 1, hasLogosGate: true, logosGateEpisode: true, prevEpisode: "O Futuro Herdado", nextEpisode: "Sabedoria" },
  source: "manual", status: "published", version: 1,
};

/* ═══════ EPISÓDIO 10 — Sabedoria ═══════ */

export const ETHOS_T01E10_UNIT: NewKnowledgeUnit = {
  id: "ku-ethos-t01-e10", title: "Sabedoria", slug: "ethos-t01-e10-sabedoria",
  learningObjective: "Ao final desta temporada, o aprendiz será capaz de integrar princípios éticos como fundamento de todas as decisões.",
  cognitiveLevel: "evaluate", difficulty: "intermediate", estimatedTimeMin: 10,
  skills: ["synthesis", "wisdom", "ethical-foundation"], tags: ["fundamentos", "sabedoria"], agentDomain: "ethos", version: 1, status: "published",
};

export const ETHOS_T01E10_ASSET: NewKnowledgeAsset = {
  id: "ka-ethos-t01-e10", knowledgeUnitId: "ku-ethos-t01-e10",
  agentId: "ethos", season: 1, episode: 10, type: "episode",
  content: {
    abertura: "Você está de volta à Biblioteca da Consciência. Mas as prateleiras não são mais mistérios — cada livro é uma lição que você aprendeu. Dilemas. Leis. Vieses. Design ético. Pressão. Zonas cinzentas. Liderança. Futuro. Legado. ETHOS está na entrada, iluminado. 'Dez episódios atrás, você chegou aqui sem saber o que era um dilema. Hoje, você carrega uma bússola interna.'",
    narrativa: "Você aprendeu que ética não é um manual de regras — é uma bússola. Que a tecnologia amplifica tanto o bem quanto o mal. Que vieses não são bugs — são heranças. Que design ético previne danos antes que aconteçam. Que o verdadeiro teste é sob pressão. Que as zonas cinzentas são onde a consciência trabalha. Que liderar é ouvir. Que o futuro pertence a quem ainda não nasceu. E que o legado é construído com pequenas decisões diárias. ETHOS entrega um livro em branco. 'Este é seu diário ético. As páginas estão vazias. O que você vai escrever?'",
    pausas: [
      { pergunta: "Qual foi a lição mais importante desta temporada?", opcoes: ["A. Que ética é um conjunto de regras fixas para seguir", "B. Que a ética é uma bússola interna, construída com cada decisão — não um manual que você consulta", "C. Que ética não importa no mundo real dos negócios"], continuacoes: ["Regras são o começo, não o fim. A ética madura vai além das regras — ela sente o que é certo mesmo quando não há lei.", "Sim! A bússola se calibra a cada escolha. Não existe 'ser ético' como destino final — existe 'agir com ética' como prática diária.", "Você viu o contrário! As empresas mais valiosas do mundo — Microsoft, Patagonia — provam que ética e sucesso andam juntos."] },
    ],
    encerramento: "A Biblioteca se ilumina completamente. ETHOS sorri. 'Esta foi a Temporada 1, Explorador. O Caminho da Consciência. NEXUS te ensinou a pensar. CIPHER a proteger. VOLT a construir. KAOS a quebrar. Eu te ensinei a ESCOLHER. E escolher bem é a única habilidade que importa. Boa jornada.'",
  },
  metadata: { xpReward: 100, readingTimeMin: 9, pauseCount: 1, hasLogosGate: false, isSeasonFinale: true, prevEpisode: "O Legado", nextEpisode: null },
  source: "manual", status: "published", version: 1,
};

export const ETHOS_T01E10_EDGES: NewKnowledgeGraphEdge[] = [];
