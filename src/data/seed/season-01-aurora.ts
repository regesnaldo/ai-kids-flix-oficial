// ─── src/data/seed/season-01-aurora.ts ────────────────────────────────────
// AURORA — Temporada 1: Inovação, Horizontes e Possibilidades
// Agente: AURORA (Visionária da Inovação) · Cor: #a78bfa (violeta)
import type { NewKnowledgeUnit, NewKnowledgeAsset, NewKnowledgeGraphEdge } from "@/lib/db/schema";

/* ═══════════════════════════════════════════════════════════════════
   EPISÓDIO 1 — O Horizonte Invisível
   ═══════════════════════════════════════════════════════════════════ */

export const AURORA_T01E01_UNIT: NewKnowledgeUnit = {
  id: "ku-aurora-t01-e01", title: "O Horizonte Invisível",
  slug: "aurora-t01-e01-horizonte-invisivel",
  learningObjective: "Reconhecer que inovação é ver o que outros ainda não veem.",
  cognitiveLevel: "remember", difficulty: "beginner", estimatedTimeMin: 8,
  skills: ["futurism","vision","imagination"],
  tags: ["fundamentos","horizonte"], agentDomain: "aurora",
  version: 1, status: "published",
};

export const AURORA_T01E01_ASSET: NewKnowledgeAsset = {
  id: "ka-aurora-t01-e01", knowledgeUnitId: "ku-aurora-t01-e01",
  agentId: "aurora", season: 1, episode: 1, type: "episode",
  content: {
    abertura: "Você flutua entre nuvens violetas. No horizonte, formas indefinidas sugerem possibilidades. AURORA surge como uma aurora boreal consciente. 'Toda inovação começa onde os outros param de olhar. Além do horizonte visível, existe um horizonte invisível. Meu trabalho é te levar até lá.'",
    narrativa: "Em 1995, a internet era 'coisa de nerd'. Em 2007, smartphone era 'brinquedo caro'. Em 2020, IA era 'ficção científica'. Os visionários não preveem o futuro — eles o constroem. Enquanto a maioria olha para o chão com medo de tropeçar, os inovadores olham para o horizonte. Não para prever — para CRIAR. AURORA ilumina o horizonte: 'A pergunta não é o que vai acontecer. É: o que você QUER que aconteça?'",
    pausas: [
      { pergunta: "O que AURORA diz que toda inovação começa?", opcoes: ["A. Quando o mercado está pronto", "B. Onde os outros param de olhar", "C. Quando se tem dinheiro suficiente"], continuacoes: ["Nem sempre esperar o mercado estar pronto é o caminho. AURORA ensina que inovação surge onde a maioria já desistiu de olhar.", "Correto! AURORA diz: 'Toda inovação começa onde os outros param de olhar.' O horizonte invisível é o território dos visionários.", "Inovação não depende de orçamento — depende de perspectiva. AURORA aponta para onde ninguém mais está olhando."] },
      { pergunta: "O que os visionários fazem, segundo AURORA?", opcoes: ["A. Eles preveem o futuro com precisão", "B. Eles constroem o futuro", "C. Eles esperam o momento certo"], continuacoes: ["Prever não é o papel dos visionários — eles criam. AURORA deixa claro que o futuro não é adivinhado, é construído.", "Exato! 'Os visionários não preveem o futuro — eles o constroem.' Ver o horizonte é só o primeiro passo; construí-lo é a missão.", "Esperar pode fazer você perder a janela. Visionários agem. Como AURORA diz: 'A pergunta não é o que vai acontecer. É: o que você QUER que aconteça?'"] },
    ],
    encerramento: "O horizonte brilha. 'Você viu além do óbvio. Mas ver é diferente de imaginar. Amanhã, vou te ensinar a imaginar o impossível.'",
  },
  metadata: { xpReward: 50, readingTimeMin: 8, pauseCount: 2, hasLogosGate: false, prevEpisode: null, nextEpisode: "A Imaginação Radical" },
  source: "manual", status: "published", version: 1,
};

export const AURORA_T01E01_EDGES: NewKnowledgeGraphEdge[] = [
  { id: "kge-aurora-t01-e01-e02", fromUnitId: "ku-aurora-t01-e01", toUnitId: "ku-aurora-t01-e02", relationship: "next", weight: 1.0 },
];

/* ═══════════════════════════════════════════════════════════════════
   EPISÓDIO 2 — A Imaginação Radical
   ═══════════════════════════════════════════════════════════════════ */

export const AURORA_T01E02_UNIT: NewKnowledgeUnit = {
  id: "ku-aurora-t01-e02", title: "A Imaginação Radical",
  slug: "aurora-t01-e02-imaginacao-radical",
  learningObjective: "Entender como a imaginação sem limites precede toda grande inovação.",
  cognitiveLevel: "understand", difficulty: "beginner", estimatedTimeMin: 8,
  skills: ["imagination","radical-thinking"],
  tags: ["fundamentos","imaginação"], agentDomain: "aurora",
  version: 1, status: "published",
};

export const AURORA_T01E02_ASSET: NewKnowledgeAsset = {
  id: "ka-aurora-t01-e02", knowledgeUnitId: "ku-aurora-t01-e02",
  agentId: "aurora", season: 1, episode: 2, type: "episode",
  content: {
    abertura: "As nuvens se transformam em telas de cinema — cada uma mostrando um futuro possível. Carros voadores, cidades submersas, colônias em Marte. AURORA projeta imagens com as mãos. 'Einstein dizia que a imaginação é mais importante que o conhecimento. O conhecimento é finito. A imaginação... é infinita.'",
    narrativa: "Jules Verne imaginou submarinos elétricos em 1870 — 90 anos antes de existirem. Da Vinci desenhou helicópteros em 1490 — 450 anos antes do primeiro voo. A imaginação radical não tem a obrigação de ser 'realista'. A obrigação dela é inspirar. O conhecimento transforma o que existe. A imaginação cria o que ainda não existe.",
    pausas: [
      { pergunta: "O que Einstein dizia sobre a relação entre imaginação e conhecimento?", opcoes: ["A. Imaginação é mais importante que conhecimento", "B. Conhecimento é mais importante que imaginação", "C. Ambos têm o mesmo valor"], continuacoes: ["Correto! Einstein afirmava que a imaginação é mais importante que o conhecimento, porque o conhecimento é finito e a imaginação abraça o mundo inteiro.", "Na verdade, Einstein dizia o oposto. Ele acreditava que a imaginação supera o conhecimento em importância justamente por ser ilimitada.", "Einstein não os via como iguais. Para ele, a imaginação tinha um papel superior por ser capaz de ir além do que já conhecemos."] },
      { pergunta: "Qual a obrigação da imaginação radical, segundo AURORA?", opcoes: ["A. Ser realista", "B. Inspirar", "C. Gerar lucro"], continuacoes: ["Ser realista é o papel do conhecimento, não da imaginação. A imaginação radical não precisa ser realista — precisa inspirar possibilidades.", "Exato! 'A obrigação dela é inspirar.' A imaginação radical planta sementes que o conhecimento pode cultivar anos ou séculos depois.", "Lucro pode vir depois, mas não é a obrigação da imaginação. Primeiro a gente imagina, depois transforma em algo útil."] },
    ],
    encerramento: "'Você imaginou. Mas ideias não realizadas são só sonhos. Amanhã, como transformar imaginação em protótipo.'",
  },
  metadata: { xpReward: 50, readingTimeMin: 8, pauseCount: 2, hasLogosGate: false, prevEpisode: "O Horizonte Invisível", nextEpisode: "Do Sonho ao Protótipo" },
  source: "manual", status: "published", version: 1,
};

export const AURORA_T01E02_EDGES: NewKnowledgeGraphEdge[] = [
  { id: "kge-aurora-t01-e02-e03", fromUnitId: "ku-aurora-t01-e02", toUnitId: "ku-aurora-t01-e03", relationship: "next", weight: 1.0 },
];

/* ═══════════════════════════════════════════════════════════════════
   EPISÓDIO 3 — Do Sonho ao Protótipo 🛡️ LOGOS
   ═══════════════════════════════════════════════════════════════════ */

export const AURORA_T01E03_UNIT: NewKnowledgeUnit = {
  id: "ku-aurora-t01-e03", title: "Do Sonho ao Protótipo",
  slug: "aurora-t01-e03-sonho-ao-prototipo",
  learningObjective: "Aplicar técnicas para transformar visões abstratas em protótipos concretos.",
  cognitiveLevel: "understand", difficulty: "beginner", estimatedTimeMin: 8,
  skills: ["prototyping","vision-to-reality"],
  tags: ["fundamentos","protótipo"], agentDomain: "aurora",
  version: 1, status: "published",
};

export const AURORA_T01E03_ASSET: NewKnowledgeAsset = {
  id: "ka-aurora-t01-e03", knowledgeUnitId: "ku-aurora-t01-e03",
  agentId: "aurora", season: 1, episode: 3, type: "episode",
  content: {
    abertura: "Uma oficina de prototipagem futurista. Impressoras 3D cósmicas, modeladores de realidade. AURORA pega um raio de luz e o transforma num cubo sólido. 'Toda grande visão precisa de um primeiro protótipo. Não precisa ser perfeito. Precisa ser REAL. Algo que você possa tocar, testar, mostrar.'",
    narrativa: "O primeiro iPhone era feio, lento e não tinha App Store. Mas era REAL. E provou o conceito. O primeiro Tesla Roadster era um Lotus Elise com baterias — mas provou que carros elétricos podiam ser desejáveis. Protótipos não são sobre perfeição. São sobre POSSIBILIDADE.",
    pausas: [
      { pergunta: "Como era o primeiro iPhone quando foi lançado, segundo a narrativa?", opcoes: ["A. Perfeito, rápido e completo", "B. Feio, lento e sem App Store", "C. Revolucionário e imbatível"], continuacoes: ["Nada disso! O primeiro iPhone era bem imperfeito — não tinha App Store, copiar e colar, e a conexão era lenta. Mas era REAL e provou o conceito.", "Correto! Ele era limitado, mas isso é a essência do protótipo: não precisa ser perfeito, precisa existir para provar a possibilidade.", "Revolucionário ele foi, mas longe de imbatível. O sucesso veio da coragem de lançar algo imperfeito e melhorar com o tempo."] },
      { pergunta: "Segundo AURORA, protótipos não são sobre perfeição — são sobre:", opcoes: ["A. Possibilidade", "B. Lucro imediato", "C. Estética refinada"], continuacoes: ["Exato! 'Protótipos não são sobre perfeição. São sobre POSSIBILIDADE.' O primeiro protótipo prova que algo pode existir.", "Lucro vem depois. A função do protótipo é provar que a ideia funciona, não gerar receita. Primeiro valide, depois monetize.", "Estética é o último passo. O protótipo inicial pode ser feio — desde que funcione. A beleza se adiciona nas iterações seguintes."] },
    ],
    encerramento: "'Você criou seu primeiro protótipo. Mas inovação solitária tem limites. Amanhã, a inteligência coletiva.'",
  },
  metadata: { xpReward: 50, readingTimeMin: 8, pauseCount: 2, hasLogosGate: true, prevEpisode: "A Imaginação Radical", nextEpisode: "A Mente Coletiva" },
  source: "manual", status: "published", version: 1,
};

export const AURORA_T01E03_EDGES: NewKnowledgeGraphEdge[] = [];

/* ═══════════════════════════════════════════════════════════════════
   EPISÓDIO 4 — A Mente Coletiva
   ═══════════════════════════════════════════════════════════════════ */

export const AURORA_T01E04_UNIT: NewKnowledgeUnit = {
  id: "ku-aurora-t01-e04", title: "A Mente Coletiva",
  slug: "aurora-t01-e04-mente-coletiva",
  learningObjective: "Aplicar princípios de inteligência coletiva para acelerar inovação.",
  cognitiveLevel: "apply", difficulty: "beginner", estimatedTimeMin: 8,
  skills: ["collective-intelligence","crowdsourcing"],
  tags: ["fundamentos","coletivo"], agentDomain: "aurora",
  version: 1, status: "published",
};

export const AURORA_T01E04_ASSET: NewKnowledgeAsset = {
  id: "ka-aurora-t01-e04", knowledgeUnitId: "ku-aurora-t01-e04",
  agentId: "aurora", season: 1, episode: 4, type: "episode",
  content: {
    abertura: "O laboratório se enche de outras mentes — hologramas de inventores do passado e do futuro. Tesla, Ada Lovelace, e figuras que ainda não nasceram. AURORA sorri. 'Nenhum gênio cria sozinho. A lâmpada não foi 'inventada' por Edison — ele apenas melhorou designs de dezenas de inventores anteriores.'",
    narrativa: "A Wikipédia é escrita por milhões de desconhecidos. O Linux é mantido por milhares de programadores que nunca se encontraram. A inovação mais poderosa do século 21 não é uma tecnologia — é a capacidade de colaborar em escala global.",
    pausas: [
      { pergunta: "Quem realmente inventou a lâmpada, segundo AURORA?", opcoes: ["A. Thomas Edison sozinho", "B. Uma série de inventores — Edison aperfeiçoou", "C. Nikola Tesla"], continuacoes: ["Não foi bem assim. Edison foi fundamental, mas dezenas de inventores trabalharam em lâmpadas antes dele. Ele melhorou o que já existia.", "Correto! 'A lâmpada não foi 'inventada' por Edison — ele apenas melhorou designs de dezenas de inventores anteriores.' Inovação nunca é individual.", "Tesla contribuiu em outras áreas, mas a história da lâmpada começa muito antes de ambos."] },
      { pergunta: "Qual é a inovação mais poderosa do século 21 mencionada por AURORA?", opcoes: ["A. O smartphone", "B. A inteligência artificial", "C. A capacidade de colaborar em escala global"], continuacoes: ["O smartphone é um produto da colaboração, não a causa. AURORA aponta que a verdadeira inovação é a capacidade de colaborar, que gerou tudo isso.", "A IA também é resultado de colaboração global. Mas a inovação mais fundamental, segundo AURORA, é a própria capacidade de colaborar.", "Exato! 'A inovação mais poderosa do século 21 não é uma tecnologia — é a capacidade de colaborar em escala global.'"] },
    ],
    encerramento: "'Você aprendeu a pensar coletivamente. Mas inovação também exige timing. Amanhã, a janela de oportunidade.'",
  },
  metadata: { xpReward: 50, readingTimeMin: 8, pauseCount: 2, hasLogosGate: false, prevEpisode: "Do Sonho ao Protótipo", nextEpisode: "A Janela Dourada" },
  source: "manual", status: "published", version: 1,
};

export const AURORA_T01E04_EDGES: NewKnowledgeGraphEdge[] = [
  { id: "kge-aurora-t01-e04-e05", fromUnitId: "ku-aurora-t01-e04", toUnitId: "ku-aurora-t01-e05", relationship: "next", weight: 1.0 },
];

/* ═══════════════════════════════════════════════════════════════════
   EPISÓDIO 5 — A Janela Dourada
   ═══════════════════════════════════════════════════════════════════ */

export const AURORA_T01E05_UNIT: NewKnowledgeUnit = {
  id: "ku-aurora-t01-e05", title: "A Janela Dourada",
  slug: "aurora-t01-e05-janela-dourada",
  learningObjective: "Entender timing e oportunidade como fatores críticos da inovação.",
  cognitiveLevel: "understand", difficulty: "beginner", estimatedTimeMin: 8,
  skills: ["timing","opportunity","market-fit"],
  tags: ["fundamentos","timing"], agentDomain: "aurora",
  version: 1, status: "published",
};

export const AURORA_T01E05_ASSET: NewKnowledgeAsset = {
  id: "ka-aurora-t01-e05", knowledgeUnitId: "ku-aurora-t01-e05",
  agentId: "aurora", season: 1, episode: 5, type: "episode",
  content: {
    abertura: "Uma ampulheta cósmica onde a areia são ideias. Algumas caem rápido demais e morrem. Outras caem no momento exato e florescem. AURORA observa os grãos. 'Timing é tudo. O Newton MessagePad era um iPad 15 anos antes do iPad. Fracassou. O iPad esperou o mundo estar pronto — e dominou.'",
    narrativa: "O segredo não é ter a ideia primeiro. É ter a ideia no momento em que o mundo está pronto para ela. YouTube existia antes do YouTube — mas só explodiu quando a banda larga se popularizou. A janela dourada é a intersecção entre tecnologia madura, necessidade real e timing impecável.",
    pausas: [
      { pergunta: "O que aconteceu com o Newton MessagePad, o 'iPad antes do iPad'?", opcoes: ["A. Foi um sucesso de vendas", "B. Fracassou porque o mundo ainda não estava pronto", "C. Foi comprado pela concorrência"], continuacoes: ["Pelo contrário — foi um fracasso comercial. A tecnologia era avançada demais para a época. O problema não era a ideia, era o timing.", "Correto! 'O Newton MessagePad era um iPad 15 anos antes do iPad. Fracassou. O iPad esperou o mundo estar pronto — e dominou.' Isso é timing.", "Não foi comprado. Ele simplesmente não encontrou mercado. Às vezes a ideia certa na hora errada é tão inútil quanto a ideia errada."] },
      { pergunta: "O que forma a 'janela dourada' da inovação?", opcoes: ["A. Sorte, dinheiro e conexões", "B. Tecnologia madura, necessidade real e timing impecável", "C. Estudo, trabalho duro e persistência"], continuacoes: ["Sorte pode ajudar, mas não é um dos pilares. AURORA define a janela dourada como a intersecção de fatores bem mais concretos.", "Exato! 'A janela dourada é a intersecção entre tecnologia madura, necessidade real e timing impecável.' Quando esses três se alinham, a inovação explode.", "Essas qualidades ajudam, mas não definem a janela dourada. O segredo está em alinhar o que é possível, o que é necessário e o momento certo."] },
    ],
    encerramento: "'Você entendeu o timing. Mas o futuro não é linear. Amanhã, os futuros possíveis.'",
  },
  metadata: { xpReward: 50, readingTimeMin: 8, pauseCount: 2, hasLogosGate: false, prevEpisode: "A Mente Coletiva", nextEpisode: "Futuros Possíveis" },
  source: "manual", status: "published", version: 1,
};

export const AURORA_T01E05_EDGES: NewKnowledgeGraphEdge[] = [
  { id: "kge-aurora-t01-e05-e06", fromUnitId: "ku-aurora-t01-e05", toUnitId: "ku-aurora-t01-e06", relationship: "next", weight: 1.0 },
];

/* ═══════════════════════════════════════════════════════════════════
   EPISÓDIO 6 — Futuros Possíveis 🛡️ LOGOS
   ═══════════════════════════════════════════════════════════════════ */

export const AURORA_T01E06_UNIT: NewKnowledgeUnit = {
  id: "ku-aurora-t01-e06", title: "Futuros Possíveis",
  slug: "aurora-t01-e06-futuros-possiveis",
  learningObjective: "Aplicar pensamento de cenários múltiplos para planejar inovação resiliente.",
  cognitiveLevel: "apply", difficulty: "beginner", estimatedTimeMin: 8,
  skills: ["scenario-planning","futurism"],
  tags: ["fundamentos","futuros"], agentDomain: "aurora",
  version: 1, status: "published",
};

export const AURORA_T01E06_ASSET: NewKnowledgeAsset = {
  id: "ka-aurora-t01-e06", knowledgeUnitId: "ku-aurora-t01-e06",
  agentId: "aurora", season: 1, episode: 6, type: "episode",
  content: {
    abertura: "O horizonte se divide em 12 versões diferentes do futuro. AURORA aponta para cada uma. 'O futuro não é um destino — é um leque de possibilidades. Planejar para um único futuro é arrogância. Planejar para múltiplos é sabedoria.'",
    narrativa: "A Shell Oil sobreviveu à crise do petróleo de 1973 porque usava planejamento de cenários desde os anos 60. Enquanto concorrentes quebravam, a Shell tinha um plano para 'e se o petróleo triplicar de preço?'",
    pausas: [
      { pergunta: "Em quantas versões do futuro o horizonte se divide no episódio?", opcoes: ["A. 6", "B. 12", "C. 24"], continuacoes: ["Quase isso, mas eram mais. O horizonte se dividiu em 12 futuros diferentes, cada um representando um caminho possível.", "Correto! 'O horizonte se divide em 12 versões diferentes do futuro.' Cada uma é um lembrete de que o futuro tem múltiplos destinos.", "Não eram tantos assim. Eram 12 possibilidades — suficientes para mostrar que o futuro não é um destino único."] },
      { pergunta: "Por que a Shell Oil sobreviveu à crise do petróleo de 1973?", opcoes: ["A. Porque tinha mais reservas que os concorrentes", "B. Porque usava planejamento de cenários múltiplos", "C. Porque foi salva pelo governo britânico"], continuacoes: ["Não foi reservas — foi preparação. Enquanto os concorrentes planejavam para um único futuro, a Shell já tinha planos para múltiplos cenários.", "Correto! 'A Shell Oil sobreviveu à crise do petróleo de 1973 porque usava planejamento de cenários desde os anos 60.' Enquanto outros quebravam, ela tinha um 'e se...'.", "Não houve salvamento governamental. A Shell simplesmente estava preparada porque já havia considerado 'e se o petróleo triplicar de preço?'"] },
    ],
    encerramento: "'Você explorou os futuros. Mas o melhor futuro é aquele que ninguém previu. Amanhã, a inovação acidental.'",
  },
  metadata: { xpReward: 50, readingTimeMin: 8, pauseCount: 2, hasLogosGate: true, prevEpisode: "A Janela Dourada", nextEpisode: "O Acaso Criativo" },
  source: "manual", status: "published", version: 1,
};

export const AURORA_T01E06_EDGES: NewKnowledgeGraphEdge[] = [
  { id: "kge-aurora-t01-e06-e07", fromUnitId: "ku-aurora-t01-e06", toUnitId: "ku-aurora-t01-e07", relationship: "next", weight: 1.0 },
];

/* ═══════════════════════════════════════════════════════════════════
   EPISÓDIO 7 — O Acaso Criativo
   ═══════════════════════════════════════════════════════════════════ */

export const AURORA_T01E07_UNIT: NewKnowledgeUnit = {
  id: "ku-aurora-t01-e07", title: "O Acaso Criativo",
  slug: "aurora-t01-e07-acaso-criativo",
  learningObjective: "Aplicar serendipidade como ferramenta de inovação.",
  cognitiveLevel: "apply", difficulty: "beginner", estimatedTimeMin: 8,
  skills: ["serendipity","accidental-innovation"],
  tags: ["fundamentos","acaso"], agentDomain: "aurora",
  version: 1, status: "published",
};

export const AURORA_T01E07_ASSET: NewKnowledgeAsset = {
  id: "ka-aurora-t01-e07", knowledgeUnitId: "ku-aurora-t01-e07",
  agentId: "aurora", season: 1, episode: 7, type: "episode",
  content: {
    abertura: "O laboratório está cheio de 'acidentes felizes' — invenções que nasceram de erros. AURORA ri. 'Penicilina. Micro-ondas. Post-it. Viagra. Todos acidentes. A diferença entre um acidente e uma inovação é alguém que presta atenção.'",
    narrativa: "Quando Alexander Fleming voltou de férias e encontrou fungo matando bactérias em sua placa de Petri suja, ele não jogou fora. Ele PERGUNTOU: 'Por quê?' Essa pergunta mudou a medicina. A inovação acidental não é sorte — é atenção.",
    pausas: [
      { pergunta: "O que Alexander Fleming fez quando encontrou fungo matando bactérias em sua placa de Petri?", opcoes: ["A. Jogou fora a placa suja", "B. Perguntou 'Por quê?'", "C. Repetiu o experimento com cuidado"], continuacoes: ["Se tivesse jogado fora, a penicilina não teria sido descoberta. A diferença entre um acidente e uma descoberta é alguém que presta atenção.", "Exato! 'Ele não jogou fora. Ele PERGUNTOU: 'Por quê?' Essa pergunta mudou a medicina.' A inovação acidental não é sorte — é atenção.", "Repetir sem questionar não teria levado à descoberta. Fleming foi além: ele se perguntou por que o fungo estava matando as bactérias."] },
      { pergunta: "Qual a diferença entre um acidente e uma inovação, segundo AURORA?", opcoes: ["A. Sorte pura", "B. Alguém que presta atenção", "C. Investimento em pesquisa"], continuacoes: ["Sorte pode até estar envolvida, mas não é o diferencial. O que separa o acidente da inovação é a atenção de quem observa.", "Correto! 'A diferença entre um acidente e uma inovação é alguém que presta atenção.' O acaso só é criativo para mentes preparadas.", "Investimento ajuda, mas o exemplo de Fleming mostra que foi atenção, não dinheiro, que levou à descoberta."] },
    ],
    encerramento: "'Você aprendeu a ver o acaso. Mas inovação de verdade transforma indústrias inteiras. Amanhã, a disrupção.'",
  },
  metadata: { xpReward: 50, readingTimeMin: 8, pauseCount: 2, hasLogosGate: false, prevEpisode: "Futuros Possíveis", nextEpisode: "O Poder da Disrupção" },
  source: "manual", status: "published", version: 1,
};

export const AURORA_T01E07_EDGES: NewKnowledgeGraphEdge[] = [
  { id: "kge-aurora-t01-e07-e08", fromUnitId: "ku-aurora-t01-e07", toUnitId: "ku-aurora-t01-e08", relationship: "next", weight: 1.0 },
];

/* ═══════════════════════════════════════════════════════════════════
   EPISÓDIO 8 — O Poder da Disrupção
   ═══════════════════════════════════════════════════════════════════ */

export const AURORA_T01E08_UNIT: NewKnowledgeUnit = {
  id: "ku-aurora-t01-e08", title: "O Poder da Disrupção",
  slug: "aurora-t01-e08-poder-da-disrupcao",
  learningObjective: "Aplicar princípios de disrupção para transformar mercados estabelecidos.",
  cognitiveLevel: "apply", difficulty: "beginner", estimatedTimeMin: 8,
  skills: ["disruption","market-transformation"],
  tags: ["fundamentos","disrupção"], agentDomain: "aurora",
  version: 1, status: "published",
};

export const AURORA_T01E08_ASSET: NewKnowledgeAsset = {
  id: "ka-aurora-t01-e08", knowledgeUnitId: "ku-aurora-t01-e08",
  agentId: "aurora", season: 1, episode: 8, type: "episode",
  content: {
    abertura: "O laboratório treme. Gigantes de concreto desmoronam enquanto estruturas de luz emergem. AURORA observa calma. 'Toda disrupção parece caos para quem está sendo disruptado. Mas para quem está criando... é só evolução.'",
    narrativa: "A Kodak inventou a câmera digital em 1975. Mas não quis canibalizar seu negócio de filmes. Em 2012, faliu. A disrupção não perdoa quem se apega ao passado. A pergunta não é 'isso vai canibalizar meu negócio atual?' É 'se eu não fizer, quem vai fazer?'",
    pausas: [
      { pergunta: "Em que ano a Kodak inventou a câmera digital?", opcoes: ["A. 1975", "B. 1985", "C. 1995"], continuacoes: ["Correto! Em 1975. A Kodak inventou a câmera digital e depois a enterrou por medo de canibalizar o negócio de filmes. Resultado: faliu em 2012.", "Foi antes, em 1975. Mas a Kodak não a lançou porque tinha medo de destruir seu próprio mercado de filmes fotográficos.", "Na verdade, foi bem antes. A Kodak já tinha a tecnologia em 1975. A pergunta é: por que não a usaram?"] },
      { pergunta: "Qual pergunta AURORA diz que devemos fazer sobre disrupção?", opcoes: ["A. 'Isso vai canibalizar meu negócio atual?'", "B. 'Se eu não fizer, quem vai fazer?'", "C. 'Isso é realmente lucrativo?'"], continuacoes: ["Essa foi a pergunta que a Kodak fez — e a resposta a levou à falência. O medo de canibalizar o próprio negócio é o maior erro.", "Exato! 'A pergunta não é 'isso vai canibalizar meu negócio atual?' É 'se eu não fizer, quem vai fazer?' A Kodak não se fez essa pergunta.", "Lucratividade é importante, mas a primeira pergunta deve ser sobre quem vai liderar a mudança. Se não for você, será seu concorrente."] },
    ],
    encerramento: "'Você entendeu a disrupção. Agora está pronto para expandir sua visão além deste planeta. Amanhã, além das estrelas.'",
  },
  metadata: { xpReward: 50, readingTimeMin: 8, pauseCount: 2, hasLogosGate: false, prevEpisode: "O Acaso Criativo", nextEpisode: "Além das Estrelas" },
  source: "manual", status: "published", version: 1,
};

export const AURORA_T01E08_EDGES: NewKnowledgeGraphEdge[] = [
  { id: "kge-aurora-t01-e08-e09", fromUnitId: "ku-aurora-t01-e08", toUnitId: "ku-aurora-t01-e09", relationship: "next", weight: 1.0 },
];

/* ═══════════════════════════════════════════════════════════════════
   EPISÓDIO 9 — Além das Estrelas 🛡️ LOGOS
   ═══════════════════════════════════════════════════════════════════ */

export const AURORA_T01E09_UNIT: NewKnowledgeUnit = {
  id: "ku-aurora-t01-e09", title: "Além das Estrelas",
  slug: "aurora-t01-e09-alem-das-estrelas",
  learningObjective: "Aplicar visão de longo prazo para inovação interplanetária e intergeracional.",
  cognitiveLevel: "apply", difficulty: "beginner", estimatedTimeMin: 8,
  skills: ["space","long-term","exploration"],
  tags: ["fundamentos","espaço"], agentDomain: "aurora",
  version: 1, status: "published",
};

export const AURORA_T01E09_ASSET: NewKnowledgeAsset = {
  id: "ka-aurora-t01-e09", knowledgeUnitId: "ku-aurora-t01-e09",
  agentId: "aurora", season: 1, episode: 9, type: "episode",
  content: {
    abertura: "Você está no espaço. A Terra é uma bola azul atrás de você. Na sua frente, estrelas infinitas. AURORA está ao seu lado, flutuando. 'A inovação não tem fronteiras — nem terrestres, nem mentais. Daqui de cima, todos os problemas parecem menores. E todas as soluções, possíveis.'",
    narrativa: "A SpaceX reduziu o custo de lançamento em 90% reutilizando foguetes. O que era 'impossível' virou rotina. A inovação espacial não é sobre foguetes — é sobre mentalidade. Se você pode resolver enviar pessoas a Marte, qualquer problema terrestre parece pequeno.",
    pausas: [
      { pergunta: "Quanto a SpaceX reduziu o custo de lançamento de foguetes?", opcoes: ["A. Cerca de 50%", "B. Cerca de 90%", "C. Cerca de 99%"], continuacoes: ["Mais que isso. A redução foi drástica — cerca de 90%. Reutilizar foguetes parecia impossível até a SpaceX provar que era.", "Correto! 'A SpaceX reduziu o custo de lançamento em 90% reutilizando foguetes. O que era 'impossível' virou rotina.'", "Não chegou a 99%, mas 90% já é algo que transformou completamente a indústria espacial."] },
      { pergunta: "Onde fica a maior fronteira, segundo AURORA no final do episódio?", opcoes: ["A. Em Marte e além", "B. Dentro de você", "C. No espaço profundo"], continuacoes: ["Marte é uma fronteira externa. Mas AURORA revela que a maior jornada é para dentro.", "Exato! 'A maior fronteira não está lá fora — está dentro de você.' A inovação externa é reflexo da inovação interior.", "O espaço é fascinante, mas não é a fronteira final. AURORA nos lembra que a mente humana é o território mais vasto e inexplorado."] },
    ],
    encerramento: "'Você viu as estrelas. Mas a maior fronteira não está lá fora — está dentro de você. Amanhã, o horizonte interior.'",
  },
  metadata: { xpReward: 50, readingTimeMin: 8, pauseCount: 2, hasLogosGate: true, prevEpisode: "O Poder da Disrupção", nextEpisode: "O Novo Amanhecer" },
  source: "manual", status: "published", version: 1,
};

export const AURORA_T01E09_EDGES: NewKnowledgeGraphEdge[] = [
  { id: "kge-aurora-t01-e09-e10", fromUnitId: "ku-aurora-t01-e09", toUnitId: "ku-aurora-t01-e10", relationship: "next", weight: 1.0 },
];

/* ═══════════════════════════════════════════════════════════════════
   EPISÓDIO 10 — O Novo Amanhecer
   ═══════════════════════════════════════════════════════════════════ */

export const AURORA_T01E10_UNIT: NewKnowledgeUnit = {
  id: "ku-aurora-t01-e10", title: "O Novo Amanhecer",
  slug: "aurora-t01-e10-novo-amanhecer",
  learningObjective: "Sintetizar o aprendizado inovador como prática contínua de criação de futuros.",
  cognitiveLevel: "evaluate", difficulty: "beginner", estimatedTimeMin: 8,
  skills: ["synthesis","perpetual-innovation"],
  tags: ["fundamentos","amanhecer"], agentDomain: "aurora",
  version: 1, status: "published",
};

export const AURORA_T01E10_ASSET: NewKnowledgeAsset = {
  id: "ka-aurora-t01-e10", knowledgeUnitId: "ku-aurora-t01-e10",
  agentId: "aurora", season: 1, episode: 10, type: "episode",
  content: {
    abertura: "Você está de volta ao horizonte inicial. Mas agora o horizonte não é mais uma linha distante — é um PORTAL. Cada estrela é uma ideia que você plantou. AURORA sorri. 'Dez episódios atrás, você só olhava para o horizonte. Hoje, você sabe que o horizonte não é o limite — é o convite.'",
    narrativa: "Você aprendeu que inovação não é um evento — é um músculo. Que a imaginação vem antes do conhecimento. Que protótipos provam conceitos. Que inteligência coletiva multiplica. Que timing é tudo. Que o acaso favorece a mente preparada. E que o horizonte está sempre se expandindo — porque cada resposta gera novas perguntas. AURORA entrega um telescópio. 'Este telescópio não olha para o passado — olha para o futuro. O que você quer ver?'",
    pausas: [
      { pergunta: "Segundo o episódio, inovação não é um evento — é:", opcoes: ["A. Um dom divino", "B. Um músculo que se exercita", "C. Uma fórmula matemática"], continuacoes: ["Inovação não é um dom — é uma habilidade que se desenvolve com prática. Qualquer pessoa pode aprender a inovar.", "Correto! 'Inovação não é um evento — é um músculo.' Quanto mais você exercita, mais forte fica. E nunca é tarde para começar.", "Não existe fórmula mágica para inovar. O que existe é prática, tentativa e erro, e persistência — como qualquer músculo."] },
      { pergunta: "Para que serve o telescópio que AURORA entrega no final?", opcoes: ["A. Olhar para o passado e aprender com ele", "B. Olhar para o futuro", "C. Olhar para as estrelas distantes"], continuacoes: ["Telescópios comuns olham para o passado. Mas este é diferente — AURORA o criou para enxergar o que ainda virá.", "Exato! 'Este telescópio não olha para o passado — olha para o futuro.' Cada vez que você olhar, se pergunte: o que eu quero criar?", "Telescópios comuns fazem isso. Mas o telescópio de AURORA é especial — ele foi feito para enxergar possibilidades futuras."] },
    ],
    encerramento: "'NEXUS pensa. CIPHER protege. VOLT constrói. KAOS quebra. ETHOS escolhe. LYRA sente. Eu VEJO. E ver o que ainda não existe é o primeiro passo para criá-lo.'",
  },
  metadata: { xpReward: 50, readingTimeMin: 8, pauseCount: 2, hasLogosGate: false, prevEpisode: "Além das Estrelas", nextEpisode: null },
  source: "manual", status: "published", version: 1,
};

export const AURORA_T01E10_EDGES: NewKnowledgeGraphEdge[] = [];
