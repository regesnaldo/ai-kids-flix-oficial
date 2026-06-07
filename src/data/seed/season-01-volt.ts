// ─── src/data/seed/season-01-volt.ts ────────────────────────────────────────
//
// VOLT — Temporada 1: Prototipagem Rápida e Execução
// Agente: VOLT (Energia em Ação) · Cor: #F59E0B (laranja/dourado)
// Padrão canônico MENTE.AI — mesmo template de NEXUS T01

import type { NewKnowledgeUnit, NewKnowledgeAsset, NewKnowledgeGraphEdge } from "@/lib/db/schema";

/* ═══════════════════════════════════════════════════════════════════
   EPISÓDIO 1 — A Centelha Inicial
   ═══════════════════════════════════════════════════════════════════
   VOLT recebe o aprendiz em sua Forja de Ideias — um vulcão criativo.
   Conceito: toda grande jornada começa com uma única ideia.
   Gancho E02: "Você teve a centelha. Agora precisa dar forma a ela." */

export const VOLT_T01E01_UNIT: NewKnowledgeUnit = {
  id: "ku-volt-t01-e01", title: "A Centelha Inicial",
  slug: "volt-t01-e01-centelha-inicial",
  learningObjective: "Ao final, o aprendiz será capaz de transformar uma ideia abstrata em um conceito acionável para prototipagem.",
  cognitiveLevel: "remember", difficulty: "beginner", estimatedTimeMin: 8,
  skills: ["ideation", "brainstorming", "problem-definition"],
  tags: ["fundamentos", "ideação", "criatividade"], agentDomain: "volt",
  version: 1, status: "published",
};

export const VOLT_T01E01_ASSET: NewKnowledgeAsset = {
  id: "ka-volt-t01-e01", knowledgeUnitId: "ku-volt-t01-e01",
  agentId: "volt", season: 1, episode: 1, type: "episode",
  content: {
    abertura: "Você está dentro de uma cratera vulcânica. Mas não há lava — há ideias. Raios de luz laranja disparam do centro, cada um carregando um conceito bruto: 'app de receitas', 'jogo educativo', 'robô de limpeza'. No centro da cratera, uma figura envolta em energia dourada martela uma bigorna cósmica. Cada golpe gera faíscas que se transformam em novas ideias. Ele para e se vira. Seus olhos são dois sóis. 'Bem-vindo à Forja. Eu sou VOLT. Antes de construir qualquer coisa, você precisa de uma coisa: a centelha. A ideia que te tira da cama. Qual é a sua?'",
    narrativa: "Toda grande invenção começou com alguém dizendo 'e se...?'. O Airbnb começou quando dois caras alugaram colchões infláveis no apartamento deles. O WhatsApp começou porque um imigrante queria falar com a família de graça. Nada disso era óbvio no começo. Eram apenas centelhas. A diferença entre quem tem ideias e quem constrói coisas é simples: ação. Mas ação sem direção é desperdício. Antes de sair correndo, você precisa definir três coisas: (1) Qual problema você está resolvendo? (2) Para quem? (3) Como você vai saber se funcionou? VOLT martela a bigorna. 'Ideia sem problema é arte. Ideia com problema é inovação. Escolha um problema real. O resto é construção.'",
    pausas: [
      { pergunta: "Qual é o primeiro passo para transformar uma ideia em algo concreto?", opcoes: ["A. Sair correndo e começar a programar imediatamente", "B. Definir o problema que você está resolvendo e para quem", "C. Registrar a patente da ideia antes que alguém roube"], continuacoes: ["Programar sem entender o problema é como construir uma casa sem planta. Você até constrói algo, mas provavelmente vai desmoronar. O primeiro passo é clareza — definir o problema com precisão cirúrgica.", "Exato! Antes de qualquer código, qualquer protótipo, você precisa saber EXATAMENTE qual problema está resolvendo. E para quem. O resto flui a partir daí.", "Patentes são importantes, mas não são o primeiro passo. Muitas startups gastam meses protegendo uma ideia que ninguém quer. Valide primeiro, proteja depois."] },
      { pergunta: "Qual foi a centelha que deu origem ao Airbnb?", opcoes: ["A. Uma pesquisa de mercado de 200 páginas encomendada por consultores", "B. Dois caras alugaram colchões infláveis no apartamento porque precisavam de dinheiro", "C. Um algoritmo de IA que previu a demanda por hospedagem alternativa"], continuacoes: ["Nada tão sofisticado! Foi necessidade pura. Eles precisavam pagar o aluguel. Às vezes, as melhores ideias nascem não da genialidade, mas do desespero — ou da necessidade real.", "Sim! Uma necessidade pessoal virou um negócio de bilhões. A maior centelha é sempre um problema que você mesmo sente. Se você sofre com algo, provavelmente outros também sofrem.", "Nada de IA no começo! Era só um site simples com fotos de colchões de ar. A beleza está em começar pequeno e validar antes de construir algo complexo."] },
    ],
    encerramento: "A bigorna brilha uma última vez e as faíscas se organizam ao seu redor. 'Você tem a centelha. Mas uma ideia sem forma é só um sonho. Amanhã, vou te ensinar a transformar essa centelha em algo que você pode tocar. O primeiro protótipo.' A cratera começa a se transformar — as paredes de rocha se tornam telas, ferramentas, matéria-prima.",
  },
  metadata: { xpReward: 50, readingTimeMin: 8, pauseCount: 2, hasLogosGate: false, prevEpisode: null, nextEpisode: "Construindo o Protótipo" },
  source: "manual", status: "published", version: 1,
};

export const VOLT_T01E01_EDGES: NewKnowledgeGraphEdge[] = [
  { id: "kge-volt-t01-e01-e02", fromUnitId: "ku-volt-t01-e01", toUnitId: "ku-volt-t01-e02", relationship: "next", weight: 1.0 },
];

/* ═══════ EPISÓDIO 2 — Construindo o Protótipo ═══════ */

export const VOLT_T01E02_UNIT: NewKnowledgeUnit = {
  id: "ku-volt-t01-e02", title: "Construindo o Protótipo",
  slug: "volt-t01-e02-construindo-prototipo",
  learningObjective: "Ao final, o aprendiz será capaz de explicar o conceito de MVP e construir um protótipo mínimo para validar uma ideia.",
  cognitiveLevel: "understand", difficulty: "beginner", estimatedTimeMin: 8,
  skills: ["mvp", "prototyping", "lean-startup"],
  tags: ["fundamentos", "MVP", "construção"], agentDomain: "volt",
  version: 1, status: "published",
};

export const VOLT_T01E02_ASSET: NewKnowledgeAsset = {
  id: "ka-volt-t01-e02", knowledgeUnitId: "ku-volt-t01-e02",
  agentId: "volt", season: 1, episode: 2, type: "episode",
  content: {
    abertura: "A cratera se transformou. As paredes agora são bancadas de trabalho — cada uma com ferramentas diferentes: madeira, metal, circuitos, código. A bigorna de VOLT está no centro, mas agora ela é uma impressora 3D cósmica. 'MVP não significa Most Valuable Player. Significa Minimum Viable Product — Produto Mínimo Viável. É a versão mais simples da sua ideia que já entrega valor para alguém. Não é sobre fazer menos. É sobre fazer o essencial primeiro.'",
    narrativa: "O Dropbox não começou com terabytes de armazenamento. Começou com um vídeo de 3 minutos no YouTube mostrando como seria o produto — antes mesmo de existir. 75.000 pessoas se inscreveram. O fundador validou a ideia sem escrever uma linha de código. Isso é MVP. VOLT pega um bloco de energia bruta e começa a esculpir. 'O erro mais comum é querer construir o produto perfeito antes de mostrar para ninguém. Você passa meses polindo e quando finalmente mostra... ninguém quer. Construa o mínimo. Mostre para 5 pessoas. Aprenda. Melhore. Repita.'",
    pausas: [
      { pergunta: "O que significa MVP no contexto de startups?", opcoes: ["A. Most Valuable Player — o jogador mais valioso do time", "B. Minimum Viable Product — a versão mais simples que já entrega valor", "C. Maximum Velocity Prototype — o protótipo mais rápido possível"], continuacoes: ["No futebol americano, sim. Mas aqui é diferente! MVP é sobre produto mínimo. Pense: qual é a menor coisa que você pode construir que alguém já usaria?", "Exato! A palavra-chave é 'mínimo'. Não é o produto final. É a primeira versão que alguém — qualquer pessoa — já acharia útil. O resto você constrói depois.", "Quase! MVP não é sobre velocidade máxima de construção — é sobre escopo mínimo. Você pode construir rápido, mas o mais importante é construir POUCO. Apenas o essencial."] },
      { pergunta: "Como o Dropbox validou sua ideia antes de escrever código?", opcoes: ["A. Gastou milhões em anúncios no Google", "B. Gravou um vídeo de 3 minutos mostrando como o produto funcionaria — mesmo sem existir", "C. Pediu para amigos testarem um protótipo secreto"], continuacoes: ["Zero investimento em anúncios! Foi um vídeo caseiro. 75.000 pessoas se inscreveram em uma noite. Essa é a beleza do MVP: validar antes de construir.", "Sim! Um vídeo. Três minutos. Sem código. Isso é MVP no seu estado mais puro: validar que as pessoas querem o que você vai construir antes de gastar meses construindo.", "Nada secreto — foi público! Ele postou no Hacker News e o vídeo viralizou. Às vezes, a melhor validação é mostrar sua ideia para estranhos, não para amigos."] },
    ],
    encerramento: "A impressora 3D termina de esculpir o bloco de energia — agora é um objeto pequeno, simples, mas funcional. 'Você construiu seu primeiro protótipo. Mas um protótipo que ninguém testou é só uma escultura bonita. Amanhã, vamos colocá-lo no mundo real. E descobrir se ele sobrevive.'",
  },
  metadata: { xpReward: 50, readingTimeMin: 8, pauseCount: 2, hasLogosGate: false, prevEpisode: "A Centelha Inicial", nextEpisode: "Testando no Mundo Real" },
  source: "manual", status: "published", version: 1,
};

export const VOLT_T01E02_EDGES: NewKnowledgeGraphEdge[] = [];

/* ═══════ EPISÓDIO 3 — Testando no Mundo Real 🛡️ LOGOS ═══════ */

export const VOLT_T01E03_UNIT: NewKnowledgeUnit = {
  id: "ku-volt-t01-e03", title: "Testando no Mundo Real",
  slug: "volt-t01-e03-testando-mundo-real",
  learningObjective: "Ao final, o aprendiz será capaz de planejar e executar testes de validação com usuários reais para seu protótipo.",
  cognitiveLevel: "understand", difficulty: "beginner", estimatedTimeMin: 9,
  skills: ["user-testing", "validation", "feedback"],
  tags: ["fundamentos", "testes", "feedback"], agentDomain: "volt",
  version: 1, status: "published",
};

export const VOLT_T01E03_ASSET: NewKnowledgeAsset = {
  id: "ka-volt-t01-e03", knowledgeUnitId: "ku-volt-t01-e03",
  agentId: "volt", season: 1, episode: 3, type: "episode",
  content: {
    abertura: "Você está numa praça de mercado flutuante. Pessoas passam, olham, testam objetos. Seu protótipo está numa banca — e as reações são... mistas. Alguém elogia. Outro franze a testa. Um terceiro pergunta 'mas não tem botão de desfazer?' VOLT observa de longe, braços cruzados. 'Isso é validação. Não é sobre receber elogios. É sobre descobrir o que está quebrado antes de consertar.'",
    narrativa: "O Segway foi lançado como 'a revolução do transporte pessoal'. Os criadores tinham certeza absoluta de que mudaria o mundo. Gastaram anos e milhões em segredo. Quando lançaram... as pessoas acharam esquisito. Ninguém queria andar em pé numa calçada. O maior erro não foi o produto — foi nunca ter testado com usuários reais durante o desenvolvimento. Testar cedo dói menos que falhar tarde. VOLT aponta para a banca: 'Você não precisa de 1000 testadores. Precisa de 5 que sejam EXATAMENTE o seu público. Mostre o protótipo. Observe. Não explique. Não defenda. Apenas ouça. As melhores ideias vêm do silêncio depois de 'hmm, interessante...'",
    pausas: [
      { pergunta: "Qual foi o maior erro dos criadores do Segway?", opcoes: ["A. O produto era muito caro para o mercado de massa", "B. Passaram anos desenvolvendo em segredo sem testar com usuários reais", "C. Escolheram a cor errada para o produto"], continuacoes: ["Preço foi um problema, mas não o principal. O erro fatal foi nunca validar se as pessoas QUERIAM andar em pé numa calçada. Eles assumiram que sim.", "Exato! Anos de desenvolvimento, milhões gastos, zero testes com usuários. Quando lançaram, descobriram que ninguém queria o produto. Testar cedo teria revelado isso em semanas.", "Cor foi o menor dos problemas! O erro foi conceitual: eles construíram uma solução para um problema que não existia — e só descobriram isso depois de gastar tudo."] },
      { pergunta: "Quantos testadores você realmente precisa para validar um protótipo?", opcoes: ["A. Pelo menos 1000 pessoas para ter dados estatisticamente relevantes", "B. 5 pessoas que sejam exatamente o seu público-alvo", "C. Apenas seus amigos e familiares — eles são honestos"], continuacoes: ["1000 é para quando você já validou e quer medir com precisão. Para descobrir se sua ideia faz sentido, 5 pessoas certas valem mais que 1000 aleatórias.", "Perfeito! Jakob Nielsen, guru de usabilidade, provou que 5 usuários encontram 85% dos problemas. Não precisa de mais. Precisa das pessoas certas — que realmente usariam seu produto.", "Amigos e família são os PIORES testadores. Eles querem te agradar, não te ajudar. Teste com estranhos. Pessoas que não têm medo de dizer 'isso não faz sentido'."] },
    ],
    encerramento: "A banca se transforma — as anotações dos testadores flutuam no ar, organizadas por prioridade. 'Você ouviu. Agora precisa agir. Amanhã, vou te ensinar a arte da iteração acelerada — como melhorar seu protótipo em horas, não em meses.'",
  },
  metadata: { xpReward: 50, readingTimeMin: 8, pauseCount: 2, hasLogosGate: true, logosGateEpisode: true, prevEpisode: "Construindo o Protótipo", nextEpisode: "Iteração Acelerada" },
  source: "manual", status: "published", version: 1,
};

export const VOLT_T01E03_EDGES: NewKnowledgeGraphEdge[] = [];

/* ═══════ EPISÓDIO 4 — Iteração Acelerada ═══════ */

export const VOLT_T01E04_UNIT: NewKnowledgeUnit = {
  id: "ku-volt-t01-e04", title: "Iteração Acelerada",
  slug: "volt-t01-e04-iteracao-acelerada",
  learningObjective: "Ao final, o aprendiz será capaz de aplicar ciclos rápidos de melhoria contínua baseados em feedback real.",
  cognitiveLevel: "apply", difficulty: "beginner", estimatedTimeMin: 8,
  skills: ["iteration", "feedback-loop", "agile"],
  tags: ["fundamentos", "iteração", "agilidade"], agentDomain: "volt",
  version: 1, status: "published",
};

export const VOLT_T01E04_ASSET: NewKnowledgeAsset = {
  id: "ka-volt-t01-e04", knowledgeUnitId: "ku-volt-t01-e04",
  agentId: "volt", season: 1, episode: 4, type: "episode",
  content: {
    abertura: "As anotações dos testadores flutuam ao seu redor como uma tempestade de dados. VOLT estala os dedos e o tempo acelera. Você vê seu protótipo mudando a cada segundo — um botão se move, uma cor muda, uma funcionalidade aparece e some. 'Isso é iteração. O ciclo mais poderoso do universo: construir → medir → aprender → construir de novo. Quanto mais rápido você gira esse ciclo, mais rápido você chega onde quer.'",
    narrativa: "O Instagram começou como Burbn — um app de check-in com dezenas de funcionalidades. Tinha compartilhamento de localização, gamificação, planejamento de encontros. Era confuso. Ninguém usava. Os fundadores olharam os dados e perceberam: a ÚNICA funcionalidade que as pessoas usavam era compartilhar fotos. Então eles cortaram TUDO e relançaram como Instagram. Em 2 meses, tinham 1 milhão de usuários. Iteração não é sobre adicionar — é sobre descobrir o que funciona e cortar o resto sem dó.",
    pausas: [
      { pergunta: "O que o Instagram era antes de ser Instagram?", opcoes: ["A. Um aplicativo de mensagens chamado WhatsApp", "B. Um app cheio de funcionalidades chamado Burbn — ninguém usava nada exceto o compartilhamento de fotos", "C. Sempre foi Instagram, nunca mudou"], continuacoes: ["Não! Era o Burbn, um app tão complicado que nem os criadores usavam. A lição: você não precisa acertar de primeira. Precisa saber cortar o que não funciona.", "Exato! De um Frankenstein de funcionalidades sobrou apenas uma: fotos. Eles tiveram a coragem de cortar 90% do que construíram. Essa é a verdadeira iteração.", "Quase toda grande empresa começou como outra coisa. YouTube era site de namoro. Slack era um jogo. A mágica está em reconhecer o que funciona e pivotar."] },
      { pergunta: "Qual é o ciclo fundamental da iteração?", opcoes: ["A. Planejar → Planejar mais → Planejar de novo → Nunca executar", "B. Construir → Medir → Aprender → Construir de novo", "C. Construir → Lançar → Esquecer → Começar outro projeto"], continuacoes: ["'Paralisia por análise' é o maior assassino de ideias. Planejar é importante, mas o ciclo só funciona quando você CONSTRÓI algo para medir.", "Perfeito! Esse é o ciclo lean: build, measure, learn. Cada volta é uma iteração. Cada iteração é um passo mais perto do produto certo.", "Abandonar no primeiro obstáculo é o oposto de iteração! Grandes produtos são construídos através de dezenas, centenas de pequenas melhorias. Persistência com inteligência."] },
    ],
    encerramento: "A tempestade de dados se acalma. Seu protótipo agora é irreconhecível — mais limpo, mais focado, mais útil. 'Você iterou. Mas construir sozinho tem limites. Amanhã, vou te mostrar como multiplicar sua energia através de outras pessoas. O poder da colaboração.'",
  },
  metadata: { xpReward: 50, readingTimeMin: 8, pauseCount: 2, hasLogosGate: false, prevEpisode: "Testando no Mundo Real", nextEpisode: "O Poder da Colaboração" },
  source: "manual", status: "published", version: 1,
};

export const VOLT_T01E04_EDGES: NewKnowledgeGraphEdge[] = [];

/* ═══════ EPISÓDIO 5 — O Poder da Colaboração ═══════ */

export const VOLT_T01E05_UNIT: NewKnowledgeUnit = {
  id: "ku-volt-t01-e05", title: "O Poder da Colaboração",
  slug: "volt-t01-e05-poder-da-colaboracao",
  learningObjective: "Ao final, o aprendiz será capaz de explicar como times ágeis e metodologias colaborativas aceleram a construção de produtos.",
  cognitiveLevel: "understand", difficulty: "beginner", estimatedTimeMin: 8,
  skills: ["collaboration", "scrum", "teamwork"],
  tags: ["fundamentos", "times", "scrum"], agentDomain: "volt",
  version: 1, status: "published",
};

export const VOLT_T01E05_ASSET: NewKnowledgeAsset = {
  id: "ka-volt-t01-e05", knowledgeUnitId: "ku-volt-t01-e05",
  agentId: "volt", season: 1, episode: 5, type: "episode",
  content: {
    abertura: "A Forja se expande — você não está mais sozinho. Outras figuras de energia dourada trabalham em bancadas ao redor. Cada uma tem uma especialidade: uma desenha, outra programa, outra conversa com testadores. VOLT está no centro coordenando. 'Um gênio solitário constrói um castelo. Um time constrói uma cidade. A maior aceleradora de prototipagem não é uma ferramenta — são outras pessoas.'",
    narrativa: "O Scrum é a metodologia mais usada em tecnologia. Funciona em ciclos chamados 'sprints' — geralmente 2 semanas. Cada sprint tem um objetivo claro. Todo dia, o time faz uma reunião de 15 minutos chamada 'daily': o que você fez ontem? O que vai fazer hoje? Tem algum bloqueio? Simples assim. Mas a mágica não está nas reuniões — está na autonomia. Times de alta performance não têm chefe dizendo o que fazer. Eles têm um objetivo claro e liberdade para decidir COMO chegar lá.",
    pausas: [
      { pergunta: "O que é um sprint no Scrum?", opcoes: ["A. Uma corrida de velocidade entre programadores", "B. Um ciclo curto de trabalho (geralmente 2 semanas) com objetivo claro", "C. O momento em que o time para de trabalhar e vai descansar"], continuacoes: ["Não é competição! Sprint é um período fixo de tempo onde o time se compromete a entregar algo específico. A regularidade é mais importante que a velocidade.", "Exato! Ciclos curtos e previsíveis. A beleza do sprint é que você só se compromete com o que cabe em 2 semanas. Sem planos mirabolantes de 6 meses que nunca se concretizam.", "Longe disso! Sprint é o período de TRABALHO focado. O descanso vem entre os sprints — e é tão importante quanto. Times descansados produzem melhor."] },
      { pergunta: "Qual a vantagem de times autônomos sobre times com chefe controlador?", opcoes: ["A. Times sem chefe são mais baratos", "B. Times autônomos tomam decisões mais rápidas e são mais motivados — eles sentem que o projeto é deles", "C. Times com chefe são mais organizados e produtivos"], continuacoes: ["Não é sobre custo — é sobre eficiência. Quando cada decisão precisa subir para o chefe, você perde dias. Autonomia acelera tudo.", "Exato! O segredo dos times de alta performance é PROPRIEDADE. Quando o time sente que o projeto é deles, a motivação e a qualidade disparam.", "Na verdade, estudos mostram o contrário! Times autônomos são mais produtivos porque as decisões são tomadas por quem está mais próximo do problema."] },
    ],
    encerramento: "As figuras douradas se multiplicam — agora são dezenas, cada uma contribuindo com sua especialidade. 'Você aprendeu a colaborar. Mas times grandes trazem desafios novos. Amanhã, vou te ensinar a escalar sua solução — de 10 usuários para 10 mil, sem que tudo desmorone.'",
  },
  metadata: { xpReward: 50, readingTimeMin: 8, pauseCount: 2, hasLogosGate: false, prevEpisode: "Iteração Acelerada", nextEpisode: "Escalando a Solução" },
  source: "manual", status: "published", version: 1,
};

/* ═══════ EPISÓDIO 6 — Escalando a Solução 🛡️ LOGOS ═══════ */

export const VOLT_T01E06_UNIT: NewKnowledgeUnit = {
  id: "ku-volt-t01-e06", title: "Escalando a Solução",
  slug: "volt-t01-e06-escalando-solucao",
  learningObjective: "Ao final, o aprendiz será capaz de identificar os desafios de escalar um produto de poucos para milhares de usuários.",
  cognitiveLevel: "apply", difficulty: "intermediate", estimatedTimeMin: 9,
  skills: ["scaling", "infrastructure", "growth"],
  tags: ["fundamentos", "escala", "crescimento"], agentDomain: "volt",
  version: 1, status: "published",
};

export const VOLT_T01E06_ASSET: NewKnowledgeAsset = {
  id: "ka-volt-t01-e06", knowledgeUnitId: "ku-volt-t01-e06",
  agentId: "volt", season: 1, episode: 6, type: "episode",
  content: {
    abertura: "A Forja se transforma numa metrópole de dados. Milhares de usuários interagem com seu produto simultaneamente. Servidores piscam, gráficos sobem e descem. Um alarme dispara — sobrecarga! VOLT corre para um painel de controle: 'Escalar não é só ter mais usuários. É garantir que seu produto funcione tão bem para o milésimo usuário quanto para o primeiro.'",
    narrativa: "O Twitter nos primeiros anos era famoso pela 'baleia fail' — uma ilustração de baleia que aparecia quando o site caía. Acontecia várias vezes por dia. Eles não tinham infraestrutura para aguentar o crescimento explosivo. Escalar é sobre previsibilidade: se 1000 usuários usam 10 servidores, 1 milhão de usuários não usam 10.000 servidores — as relações não são lineares. Você precisa de arquitetura distribuída, cache, filas, balanceamento de carga.",
    pausas: [
      { pergunta: "Por que o Twitter caía tanto nos primeiros anos?", opcoes: ["A. Os programadores eram ruins", "B. A infraestrutura não estava preparada para o crescimento explosivo de usuários", "C. Eles queriam economizar em servidores"], continuacoes: ["Não era incompetência — era crescimento imprevisível. O Twitter cresceu tão rápido que a infraestrutura não conseguia acompanhar.", "Exato! A 'baleia fail' virou meme, mas era um sintoma real: escalar é DIFÍCIL. Você precisa prever o imprevisível.", "Economizar não era o problema — eles investiam pesado. Mas prever quanto você vai crescer é quase impossível. O segredo é construir para escalar desde o dia 1."] },
      { pergunta: "O que significa 'escalar' um produto digital?", opcoes: ["A. Fazer o mesmo produto em tamanhos diferentes", "B. Garantir que o produto funcione igualmente bem com 10 ou 10 milhões de usuários", "C. Contratar mais programadores"], continuacoes: ["Não é sobre tamanhos! É sobre performance consistente independente da carga. Seu app não pode ficar lento quando muitos usuários chegam.", "Perfeito! Escalar é sobre RESILIÊNCIA. O sistema precisa absorver crescimento sem degradar a experiência de nenhum usuário.", "Mais pessoas ajudam, mas escalar é principalmente uma decisão de ARQUITETURA, não de equipe."] },
    ],
    encerramento: "O painel de controle se estabiliza. 'Você escalou. Mas escala sem direção é só crescimento desordenado. Amanhã, vou te ensinar a usar métricas para guiar cada decisão.'",
  },
  metadata: { xpReward: 60, readingTimeMin: 8, pauseCount: 2, hasLogosGate: true, logosGateEpisode: true, prevEpisode: "O Poder da Colaboração", nextEpisode: "Métricas que Importam" },
  source: "manual", status: "published", version: 1,
};

/* ═══════ EPISÓDIO 7 — Métricas que Importam ═══════ */

export const VOLT_T01E07_UNIT: NewKnowledgeUnit = {
  id: "ku-volt-t01-e07", title: "Métricas que Importam",
  slug: "volt-t01-e07-metricas-que-importam",
  learningObjective: "Ao final, o aprendiz será capaz de diferenciar métricas de vaidade de métricas acionáveis para guiar decisões de produto.",
  cognitiveLevel: "apply", difficulty: "beginner", estimatedTimeMin: 8,
  skills: ["metrics", "data-driven", "analytics"],
  tags: ["fundamentos", "métricas", "dados"], agentDomain: "volt",
  version: 1, status: "published",
};

export const VOLT_T01E07_ASSET: NewKnowledgeAsset = {
  id: "ka-volt-t01-e07", knowledgeUnitId: "ku-volt-t01-e07",
  agentId: "volt", season: 1, episode: 7, type: "episode",
  content: {
    abertura: "A metrópole de dados agora é um painel de controle holográfico. Gráficos, números, porcentagens dançam no ar. Alguns números brilham em dourado — outros estão em cinza. VOLT aponta para os cinzas: 'Esses são métricas de vaidade. Números que impressionam mas não ajudam a decidir nada. Os dourados são métricas acionáveis. Eles dizem o que fazer amanhã.'",
    narrativa: "Métrica de vaidade: '10.000 downloads!' Ok, mas quantos usuários abriram o app no dia seguinte? Quantos usaram a funcionalidade principal? Métrica acionável: '30% dos usuários abandonam o cadastro na etapa 2.' Isso te diz EXATAMENTE onde agir. A melhor métrica do mundo se chama 'North Star Metric' — a única métrica que captura o valor central do seu produto. Para o Spotify: tempo ouvindo música. Para o Airbnb: noites reservadas. Para o WhatsApp: mensagens enviadas.",
    pausas: [
      { pergunta: "O que é uma métrica de vaidade?", opcoes: ["A. Uma métrica que mede a beleza do produto", "B. Um número que impressiona mas não ajuda a tomar decisões — como 'total de downloads'", "C. Uma métrica usada apenas por empresas de moda"], continuacoes: ["Não é sobre estética! É sobre utilidade. Se a métrica não te diz O QUE FAZER em seguida, ela é vaidade.", "Exato! '10.000 seguidores' — e daí? Quantos compraram? Quantos voltaram? Métrica de vaidade enche o ego. Métrica acionável enche o bolso.", "Não tem nada a ver com moda! É um termo usado em startups para descrever números que parecem bons em apresentações mas não guiam decisões."] },
      { pergunta: "Qual seria a North Star Metric do Spotify?", opcoes: ["A. Número de playlists criadas por dia", "B. Tempo total ouvindo música — captura o valor central do produto", "C. Quantidade de anúncios exibidos"], continuacoes: ["Playlists são importantes mas não capturam o valor central. Alguém pode criar playlist e nunca ouvir.", "Perfeito! Tempo ouvindo música mede exatamente o valor que o Spotify entrega: entretenimento. Mais tempo = mais valor.", "Anúncios medem receita, não valor para o usuário. North Star foca no USUÁRIO, não na empresa."] },
    ],
    encerramento: "Os números cinzas desaparecem — só os dourados permanecem. 'Você aprendeu a medir o que importa. Mas métricas também revelam quando é hora de mudar de rumo. Amanhã, a arte de pivotar com propósito.'",
  },
  metadata: { xpReward: 50, readingTimeMin: 7, pauseCount: 2, hasLogosGate: false, prevEpisode: "Escalando a Solução", nextEpisode: "Pivotando com Propósito" },
  source: "manual", status: "published", version: 1,
};

/* ═══════ EPISÓDIO 8 — Pivotando com Propósito ═══════ */

export const VOLT_T01E08_UNIT: NewKnowledgeUnit = {
  id: "ku-volt-t01-e08", title: "Pivotando com Propósito",
  slug: "volt-t01-e08-pivotando-com-proposito",
  learningObjective: "Ao final, o aprendiz será capaz de identificar quando e como pivotar um produto sem perder a visão original.",
  cognitiveLevel: "apply", difficulty: "intermediate", estimatedTimeMin: 9,
  skills: ["pivot", "adaptation", "strategy"],
  tags: ["fundamentos", "pivot", "estratégia"], agentDomain: "volt",
  version: 1, status: "published",
};

export const VOLT_T01E08_ASSET: NewKnowledgeAsset = {
  id: "ka-volt-t01-e08", knowledgeUnitId: "ku-volt-t01-e08",
  agentId: "volt", season: 1, episode: 8, type: "episode",
  content: {
    abertura: "O painel de controle mostra uma curva descendente. Os números dourados estão caindo. Você sente o pânico — mas VOLT está calmo. 'Toda grande empresa pivotou pelo menos uma vez. Slack era um jogo. YouTube era um site de namoro. Nintendo fabricava cartas de baralho. Pivotar não é fracassar — é ouvir os dados e ter coragem de mudar.'",
    narrativa: "Pivotar não é abandonar tudo. É manter o que funciona e redirecionar o que não funciona. O Slack nasceu de um jogo chamado Glitch. O jogo fracassou, mas a ferramenta de chat interno que a equipe construiu para se comunicar era brilhante. Eles pivotaram: de empresa de jogos para empresa de comunicação. Hoje vale bilhões. A pergunta certa não é 'devo pivotar?' — é 'o que os dados estão me dizendo?'",
    pausas: [
      { pergunta: "O que o Slack era antes de ser Slack?", opcoes: ["A. Um aplicativo de delivery de comida", "B. Uma ferramenta de chat interno construída para um jogo online que fracassou", "C. Sempre foi uma ferramenta de comunicação empresarial"], continuacoes: ["Não! Era o chat interno do Glitch. O jogo morreu. O chat sobreviveu. Eles tiveram a humildade de reconhecer que a ferramenta era mais valiosa que o produto.", "Exato! A lição mais poderosa do Slack: às vezes, o que você constrói PARA VOCÊ MESMO resolver um problema é mais valioso que o produto que você está vendendo.", "Não! O Slack é o exemplo perfeito de pivot: o produto original fracassou, mas uma parte dele era tão boa que virou o produto principal."] },
      { pergunta: "Qual a diferença entre pivotar e abandonar?", opcoes: ["A. São a mesma coisa — nos dois casos você desiste", "B. Pivotar é mudar de direção mantendo o que funciona; abandonar é desistir de tudo", "C. Abandonar é mais corajoso que pivotar"], continuacoes: ["Não são a mesma coisa! Pivotar usa o aprendizado acumulado. Abandonar joga fora. O Slack não abandonou a tecnologia — redirecionou.", "Perfeito! Pivotar preserva o conhecimento e os ativos. Abandonar começa do zero. Grandes empreendedores pivotam. Iniciantes abandonam.", "Abandonar não é mais corajoso — é mais fácil! Pivotar exige humildade para admitir que a direção estava errada e coragem para mudar sem recomeçar."] },
    ],
    encerramento: "A curva descendente se estabiliza e começa a subir numa nova direção. 'Você pivotou. Agora seu produto está pronto. Amanhã, o momento que todo construtor espera: o lançamento.'",
  },
  metadata: { xpReward: 50, readingTimeMin: 8, pauseCount: 2, hasLogosGate: false, prevEpisode: "Métricas que Importam", nextEpisode: "Lançamento" },
  source: "manual", status: "published", version: 1,
};

/* ═══════ EPISÓDIO 9 — Lançamento 🛡️ LOGOS ═══════ */

export const VOLT_T01E09_UNIT: NewKnowledgeUnit = {
  id: "ku-volt-t01-e09", title: "Lançamento",
  slug: "volt-t01-e09-lancamento",
  learningObjective: "Ao final, o aprendiz será capaz de planejar e executar o lançamento de um produto digital com estratégia de comunicação.",
  cognitiveLevel: "apply", difficulty: "intermediate", estimatedTimeMin: 9,
  skills: ["launch", "marketing", "product-launch"],
  tags: ["fundamentos", "lançamento", "marketing"], agentDomain: "volt",
  version: 1, status: "published",
};

export const VOLT_T01E09_ASSET: NewKnowledgeAsset = {
  id: "ka-volt-t01-e09", knowledgeUnitId: "ku-volt-t01-e09",
  agentId: "volt", season: 1, episode: 9, type: "episode",
  content: {
    abertura: "A Forja inteira se transformou num palco. Holofotes dourados iluminam uma plataforma central onde seu produto finalizado brilha. Uma contagem regressiva aparece no céu: 10, 9, 8... VOLT está ao seu lado, radiante. 'Lançar não é apertar um botão. É contar uma história. As pessoas não compram produtos — compram narrativas. Compram o que o produto diz sobre elas.'",
    narrativa: "O lançamento do iPhone em 2007 não foi sobre especificações técnicas. Steve Jobs não disse 'este telefone tem processador ARM de 412MHz'. Ele disse: 'Hoje, a Apple vai reinventar o telefone.' E mostrou alguém deslizando o dedo numa tela. O mundo mudou. Um bom lançamento responde três perguntas: (1) Para quem é este produto? (2) Que problema ele resolve? (3) Por que agora? Se você não consegue responder em 30 segundos, o lançamento vai falhar.",
    pausas: [
      { pergunta: "O que Steve Jobs disse no lançamento do iPhone em 2007?", opcoes: ["A. 'Este telefone tem processador ARM de 412MHz e 128MB de RAM'", "B. 'Hoje, a Apple vai reinventar o telefone' — e mostrou alguém deslizando o dedo na tela", "C. 'Comprem este telefone porque está em promoção'"], continuacoes: ["Detalhes técnicos não vendem. Histórias vendem. Jobs entendeu isso melhor que ninguém.", "Exato! Em 8 palavras ele criou expectativa, narrativa e revolução. O resto foi demonstração.", "Jamais! A Apple nunca compete por preço. Eles competem por desejo e narrativa."] },
      { pergunta: "Quais as 3 perguntas que um bom lançamento responde?", opcoes: ["A. 'Quanto custa?', 'Onde compra?', 'Tem garantia?'", "B. 'Para quem é?', 'Que problema resolve?', 'Por que agora?'", "C. 'Qual a tecnologia usada?', 'Quem programou?', 'Quanto pesa?'"], continuacoes: ["Essas são perguntas de varejo, não de lançamento. O lançamento é sobre PROPÓSITO, não sobre preço.", "Perfeito! Público + Problema + Timing. Se essas três estiverem claras, todo o resto se encaixa.", "Tecnologia é detalhe de implementação. O usuário quer saber o que seu produto FAZ POR ELE, não como foi feito."] },
    ],
    encerramento: "A contagem chega a zero. Seu produto brilha intensamente — o mundo agora pode vê-lo. 'Você lançou. Mas lançar não é o fim. É o começo de um ciclo infinito. Amanhã, no nosso último encontro, vou te mostrar que a energia nunca termina — ela só se transforma.'",
  },
  metadata: { xpReward: 60, readingTimeMin: 8, pauseCount: 2, hasLogosGate: true, logosGateEpisode: true, prevEpisode: "Pivotando com Propósito", nextEpisode: "A Energia Continua" },
  source: "manual", status: "published", version: 1,
};

/* ═══════ EPISÓDIO 10 — A Energia Continua ═══════ */

export const VOLT_T01E10_UNIT: NewKnowledgeUnit = {
  id: "ku-volt-t01-e10", title: "A Energia Continua",
  slug: "volt-t01-e10-energia-continua",
  learningObjective: "Ao final desta temporada, o aprendiz será capaz de sintetizar o ciclo completo de prototipagem — da centelha ao lançamento — e planejar seu próximo projeto.",
  cognitiveLevel: "evaluate", difficulty: "intermediate", estimatedTimeMin: 10,
  skills: ["synthesis", "product-cycle", "action-planning"],
  tags: ["fundamentos", "síntese", "futuro"], agentDomain: "volt",
  version: 1, status: "published",
};

export const VOLT_T01E10_ASSET: NewKnowledgeAsset = {
  id: "ka-volt-t01-e10", knowledgeUnitId: "ku-volt-t01-e10",
  agentId: "volt", season: 1, episode: 10, type: "episode",
  content: {
    abertura: "Você está de volta ao centro da cratera — mas ela não é mais um vulcão bruto. É uma cidade inteira construída ao seu redor. Protótipos, testadores, métricas, lançamentos — tudo que você construiu está aqui, pulsando com energia dourada. VOLT está na bigorna, mas desta vez ele não está martelando. Está sorrindo. 'Dez episódios atrás, você chegou aqui só com uma centelha. Hoje, você é um construtor.'",
    narrativa: "Você aprendeu que toda jornada começa com uma ideia. Que o primeiro protótipo não precisa ser perfeito — precisa existir. Que testar com usuários reais dói menos que falhar no lançamento. Que iterar rápido é melhor que planejar devagar. Que times multiplicam energia. Que escalar exige arquitetura. Que métricas guiam decisões. Que pivotar não é fracassar — é ouvir os dados. E que lançar é contar uma história. VOLT entrega um martelo dourado. 'Esta é sua ferramenta. Não a minha. A Forja é sua agora. O próximo projeto? Você decide. A próxima centelha? Você cria. A energia nunca termina — ela só muda de forma.'",
    pausas: [
      { pergunta: "Qual foi a lição mais importante que você aprendeu nesta temporada?", opcoes: ["A. Que construir produtos é muito complicado para uma pessoa só", "B. Que ação com propósito vence planejamento sem fim — comece pequeno, teste rápido, melhore sempre", "C. Que o segredo é ter muito dinheiro para investir"], continuacoes: ["Você provou o contrário! Em 10 episódios, construiu algo do zero. Não é sobre ser fácil — é sobre ser possível.", "Sim! Essa é a essência de VOLT. Energia sem direção é caos. Direção sem energia é sonho. As duas juntas são imparáveis.", "Dinheiro acelera, mas não substitui execução. Muitas startups queimaram milhões sem entregar nada. Aprender a construir com pouco é o superpoder."] },
      { pergunta: "Qual será seu próximo projeto?", opcoes: ["A. Vou esperar a ideia perfeita antes de começar", "B. Vou aplicar o ciclo que aprendi: centelha → protótipo → teste → iteração → lançamento", "C. Vou contratar alguém para fazer por mim"], continuacoes: ["A ideia perfeita não existe. Existe a ideia que você começa HOJE. Daqui a um ano, você vai desejar ter começado hoje.", "Perfeito! O ciclo está em você agora. Não importa qual projeto — importa COMO você executa. A Forja está acesa.", "Contratar ajuda, mas o construtor é você. Ninguém vai ter a mesma energia e visão que você tem para o seu próprio projeto."] },
    ],
    encerramento: "A cidade inteira brilha em dourado. VOLT acena da bigorna enquanto você se prepara para partir. 'Esta foi a Temporada 1, Explorador. A Forja da Ação. Mas existem outros universos. NEXUS te ensinou a pensar. CIPHER te ensinou a proteger. Eu te ensinei a CONSTRUIR. O próximo passo é seu. A centelha está acesa. O que você vai criar?'",
  },
  metadata: { xpReward: 100, readingTimeMin: 9, pauseCount: 2, hasLogosGate: false, isSeasonFinale: true, prevEpisode: "Lançamento", nextEpisode: null },
  source: "manual", status: "published", version: 1,
};

export const VOLT_T01E10_EDGES: NewKnowledgeGraphEdge[] = [];
