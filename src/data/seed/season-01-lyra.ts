// ─── src/data/seed/season-01-lyra.ts ───────────────────────────────────────
// LYRA — Temporada 1: Criatividade Visual, Arte e Expressão
// Agente: LYRA (Artista da Harmonia) · Cor: #f472b6 (rosa)
// Padrão canônico MENTE.AI

import type { NewKnowledgeUnit, NewKnowledgeAsset, NewKnowledgeGraphEdge } from "@/lib/db/schema";

export const LYRA_T01E01_UNIT: NewKnowledgeUnit = {
  id: "ku-lyra-t01-e01", title: "A Paleta do Universo", slug: "lyra-t01-e01-paleta-do-universo",
  learningObjective: "Ao final, o aprendiz será capaz de entender a arte como linguagem universal de expressão e comunicação.",
  cognitiveLevel: "remember", difficulty: "beginner", estimatedTimeMin: 8,
  skills: ["visual-language", "color-theory", "expression"], tags: ["fundamentos", "arte"], agentDomain: "lyra", version: 1, status: "published",
};

export const LYRA_T01E01_ASSET: NewKnowledgeAsset = {
  id: "ka-lyra-t01-e01", knowledgeUnitId: "ku-lyra-t01-e01",
  agentId: "lyra", season: 1, episode: 1, type: "episode",
  content: {
    abertura: "Você está num estúdio onde as cores não são vistas — são SENTIDAS. Um arco-íris líquido flui pelo ar. Cada gota que toca sua pele vira uma emoção: azul = calma, vermelho = paixão, amarelo = alegria. No centro, uma figura graciosa com cabelos cor-de-rosa dança pintando o ar. 'Bem-vindo ao Ateliê da Alma. Eu sou LYRA. E a primeira coisa que você precisa saber: antes da palavra, existia a imagem. A arte é a língua materna da humanidade.'",
    narrativa: "As pinturas rupestres de Lascaux têm 17.000 anos. Muito antes da escrita, humanos já pintavam. Por quê? Porque expressar é uma necessidade tão básica quanto comer. A arte não é luxo — é linguagem. Quando você desenha, pinta, compõe, você está fazendo o que seus ancestrais faziam há milênios: contando uma história sem palavras.",
    pausas: [
      { pergunta: "Por que os humanos pintam há 17.000 anos?", opcoes: ["A. Para decorar cavernas e deixá-las bonitas", "B. Expressar é uma necessidade básica — tão fundamental quanto se alimentar", "C. Para registrar eventos históricos com precisão"], continuacoes: ["Não era sobre decoração — era sobre COMUNICAÇÃO. As cavernas eram as redes sociais da era paleolítica.", "Exato! Antes da palavra escrita, a imagem era a única forma de transmitir conhecimento entre gerações.", "Precisão histórica veio depois. O impulso original era emocional: 'Eu estive aqui. Isto me tocou. Quero que você veja.'"] },
      { pergunta: "A arte é luxo ou necessidade?", opcoes: ["A. Luxo — só faz arte quem tem tempo sobrando", "B. Necessidade — expressar é tão vital quanto respirar", "C. Algo entre os dois"], continuacoes: ["Crianças desenham antes de escrever. Prisioneiros fazem arte com migalhas de pão. A arte brota onde há humanidade.", "Exato! Em situações extremas — guerra, prisão, pobreza — a arte floresce. Não é luxo. É sobrevivência da alma.", "Não há 'entre'. A arte é impulso primário. Bebês rabiscam antes de falar. É a primeira linguagem que aprendemos."] },
    ],
    encerramento: "LYRA entrega um pincel que brilha com todas as cores. 'Você entendeu: arte é linguagem. Mas toda linguagem tem gramática. Amanhã, vou te ensinar a gramática das cores.'",
  },
  metadata: { xpReward: 50, readingTimeMin: 8, pauseCount: 2, hasLogosGate: false, prevEpisode: null, nextEpisode: "A Gramática das Cores" },
  source: "manual", status: "published", version: 1,
};

export const LYRA_T01E01_EDGES: NewKnowledgeGraphEdge[] = [
  { id: "kge-lyra-t01-e01-e02", fromUnitId: "ku-lyra-t01-e01", toUnitId: "ku-lyra-t01-e02", relationship: "next", weight: 1.0 },
];

/* ═══════ E02-E10 estrutura compacta seguindo o padrão ═══════ */

export const LYRA_T01E02_UNIT: NewKnowledgeUnit = {
  id: "ku-lyra-t01-e02", title: "A Gramática das Cores", slug: "lyra-t01-e02-gramatica-das-cores",
  learningObjective: "Ao final, o aprendiz será capaz de usar cores como ferramenta de comunicação emocional.",
  cognitiveLevel: "understand", difficulty: "beginner", estimatedTimeMin: 8,
  skills: ["color-communication", "emotional-design", "visual-grammar"], tags: ["fundamentos", "cores"], agentDomain: "lyra", version: 1, status: "published",
};

export const LYRA_T01E02_ASSET: NewKnowledgeAsset = {
  id: "ka-lyra-t01-e02", knowledgeUnitId: "ku-lyra-t01-e02",
  agentId: "lyra", season: 1, episode: 2, type: "episode",
  content: {
    abertura: "O arco-íris se organiza numa paleta circular. LYRA toca cada cor e ela emite um som: vermelho = tambor, azul = piano, amarelo = flauta. 'Cada cor tem uma voz. O vermelho grita. O azul sussurra. O amarelo canta. Aprender a 'ouvir' as cores é aprender a falar sem palavras.'",
    narrativa: "Por que o botão de 'comprar' é sempre verde ou laranja? Por que hospitais usam azul e branco? Por que marcas de luxo usam preto? Cor é psicologia aplicada. O azul transmite confiança — por isso bancos e redes sociais o usam. O vermelho transmite urgência — por isso liquidações são vermelhas. O verde transmite calma e natureza. Entender a gramática das cores é entender como influenciar emoções sem dizer uma palavra.",
    pausas: [{ pergunta: "Por que bancos usam azul?", opcoes: ["A. É a cor mais barata de imprimir", "B. Azul transmite confiança e estabilidade — exatamente o que um banco quer projetar", "C. O primeiro banco usava azul e todos copiaram"], continuacoes: ["Não é custo — é psicologia. A cor é uma decisão estratégica, não estética.", "Exato! Azul = confiança. Vermelho = urgência. Verde = natureza. Cada cor ativa uma resposta emocional diferente.", "Foi escolha estratégica! O fundador do Bank of America escolheu azul de propósito — e o setor inteiro seguiu."] }],
    encerramento: "A paleta pulsa com vida. 'Você aprendeu a gramática. Mas cores são só o começo. Amanhã, a arte de compor — como combinar elementos para contar uma história.'",
  },
  metadata: { xpReward: 50, readingTimeMin: 7, pauseCount: 1, hasLogosGate: false, prevEpisode: "A Paleta do Universo", nextEpisode: "Sinestesia Digital" },
  source: "manual", status: "published", version: 1,
};

/* ═══════ E03-E10 em lote compacto ═══════ */
const mkUnit = (id: string, title: string, slug: string, objective: string, level: string, skills: string[], tags: string[]): NewKnowledgeUnit => ({
  id, title, slug, learningObjective: objective, cognitiveLevel: level, difficulty: "beginner", estimatedTimeMin: 8, skills, tags, agentDomain: "lyra", version: 1, status: "published",
}) as NewKnowledgeUnit;

export const LYRA_T01E03_UNIT = mkUnit("ku-lyra-t01-e03", "Sinestesia Digital", "lyra-t01-e03-sinestesia-digital", "Explicar sinestesia e como IA pode traduzir sentidos.", "understand", ["synesthesia", "cross-modal", "ai-art"], ["fundamentos", "sinestesia"]);
export const LYRA_T01E04_UNIT = mkUnit("ku-lyra-t01-e04", "A Composição Visual", "lyra-t01-e04-composicao-visual", "Aplicar regras de composição visual para criar obras equilibradas.", "apply", ["composition", "balance", "visual-hierarchy"], ["fundamentos", "composição"]);
export const LYRA_T01E05_UNIT = mkUnit("ku-lyra-t01-e05", "Arte Generativa", "lyra-t01-e05-arte-generativa", "Entender como IAs criam arte generativa e seu impacto.", "understand", ["generative-art", "ai-creativity"], ["fundamentos", "generativo"]);
export const LYRA_T01E06_UNIT = mkUnit("ku-lyra-t01-e06", "Narrativa Visual", "lyra-t01-e06-narrativa-visual", "Criar narrativas usando apenas elementos visuais.", "apply", ["visual-storytelling", "sequence"], ["fundamentos", "narrativa"]);
export const LYRA_T01E07_UNIT = mkUnit("ku-lyra-t01-e07", "Emoção em Pixels", "lyra-t01-e07-emocao-em-pixels", "Projetar experiências visuais que evocam emoções específicas.", "apply", ["emotional-design", "ux"], ["fundamentos", "emoção"]);
export const LYRA_T01E08_UNIT = mkUnit("ku-lyra-t01-e08", "O Artista e a Máquina", "lyra-t01-e08-artista-e-maquina", "Explorar a colaboração entre criatividade humana e IA.", "apply", ["human-ai-collab", "co-creation"], ["fundamentos", "colaboração"]);
export const LYRA_T01E09_UNIT = mkUnit("ku-lyra-t01-e09", "A Exposição Final", "lyra-t01-e09-exposicao-final", "Planejar e executar uma exposição de arte digital.", "apply", ["curation", "exhibition"], ["fundamentos", "exposição"]);
export const LYRA_T01E10_UNIT = mkUnit("ku-lyra-t01-e10", "A Harmonia Eterna", "lyra-t01-e10-harmonia-eterna", "Sintetizar o aprendizado artístico como prática de vida.", "evaluate", ["synthesis", "artistic-life"], ["fundamentos", "harmonia"]);

// Assets e edges simplificados para os episódios 3-10
const mkAsset = (aid: string, uid: string, ep: number, abertura: string, narrativa: string, enc: string, prev: string | null, next: string | null, logos: boolean): NewKnowledgeAsset => ({
  id: aid, knowledgeUnitId: uid, agentId: "lyra", season: 1, episode: ep, type: "episode",
  content: { abertura, narrativa, pausas: [], encerramento: enc },
  metadata: { xpReward: 50, readingTimeMin: 7, pauseCount: 1, hasLogosGate: logos, prevEpisode: prev, nextEpisode: next },
  source: "manual", status: "published", version: 1,
}) as NewKnowledgeAsset;

export const LYRA_T01E03_ASSET = mkAsset("ka-lyra-t01-e03","ku-lyra-t01-e03",3,"Cores dançam com sons. LYRA toca uma nota e o arco-íris vibra.","Sinestesia é quando sentidos se misturam — ver sons, ouvir cores. Artistas sinestésicos como Kandinsky pintavam música. Hoje, IAs podem traduzir imagem em som e vice-versa.","O arco-íris canta. 'Você sentiu a sinestesia. Mas sentir não basta — é preciso COMPOR. Amanhã, a arte de organizar o caos visual.'","A Gramática das Cores","A Composição Visual",true);
export const LYRA_T01E04_ASSET = mkAsset("ka-lyra-t01-e04","ku-lyra-t01-e04",4,"Telas em branco flutuam. LYRA as organiza com movimentos precisos.","Regra dos terços, ponto focal, hierarquia visual. Uma boa composição guia o olhar antes que a mente entenda o porquê.","'Você compôs. Mas composições estáticas são só metade da arte. Amanhã, a arte que se move sozinha — arte generativa.'","Sinestesia Digital","Arte Generativa",false);
export const LYRA_T01E05_ASSET = mkAsset("ka-lyra-t01-e05","ku-lyra-t01-e05",5,"Algoritmos dançam no ar criando formas impossíveis.","DALL-E, Midjourney, Stable Diffusion — IAs que criam arte a partir de texto. Isso é arte? Sim. O artista não é a ferramenta — é a intenção por trás dela.","'Você viu a máquina criar. Mas a máquina não sente. Amanhã, como contar histórias que tocam o coração.'","A Composição Visual","Narrativa Visual",false);
export const LYRA_T01E06_ASSET = mkAsset("ka-lyra-t01-e06","ku-lyra-t01-e06",6,"Uma história em quadrinhos se desenha sozinha no ar.","Toda grande marca, todo filme, todo quadrinho usa narrativa visual. A sequência das imagens conta uma história antes mesmo do texto.","'Você narrou com imagens. Mas a história mais poderosa é a que mexe com emoções. Amanhã, o design emocional.'","Arte Generativa","Emoção em Pixels",true);
export const LYRA_T01E07_ASSET = mkAsset("ka-lyra-t01-e07","ku-lyra-t01-e07",7,"Emojis, cores e formas evocam sentimentos sem palavras.","O design emocional usa cor, forma e movimento para fazer você sentir antes de pensar. É por isso que alguns apps são 'viciantes' — eles foram projetados para ativar seu sistema emocional.","'Você projetou emoções. Mas a IA também pode criar. Amanhã, a dança entre humano e máquina.'","Narrativa Visual","O Artista e a Máquina",false);
export const LYRA_T01E08_ASSET = mkAsset("ka-lyra-t01-e08","ku-lyra-t01-e08",8,"Você e LYRA pintam juntos — seu pincel humano e o pincel-IA dela.","A colaboração humano-IA não substitui o artista — amplifica. O artista define a visão. A IA explora variações. Juntos, criam o que nenhum dos dois criaria sozinho.","'Você colaborou com a máquina. Agora está pronto para mostrar seu trabalho ao mundo. Amanhã, a exposição.'","Emoção em Pixels","A Exposição Final",false);
export const LYRA_T01E09_ASSET = mkAsset("ka-lyra-t01-e09","ku-lyra-t01-e09",9,"Uma galeria infinita se abre. Suas obras estão nas paredes.","Curar é escolher. Entre mil obras, quais 10 contam sua história? A curadoria é a arte de dizer 'não' para que o 'sim' brilhe mais forte.","'Sua exposição está pronta. Mas a arte não termina na galeria. Amanhã, como viver uma vida artística.'","O Artista e a Máquina","A Harmonia Eterna",true);
export const LYRA_T01E10_ASSET = mkAsset("ka-lyra-t01-e10","ku-lyra-t01-e10",10,"Você está de volta ao Ateliê. Suas obras preenchem cada parede.","Dez lições. Uma paleta. A arte não é um talento — é uma decisão diária de ver o mundo com olhos de quem cria. LYRA entrega o pincel. 'Este ateliê é seu agora. O que você vai pintar amanhã?'","LYRA sorri enquanto você parte. 'NEXUS pensa. CIPHER protege. VOLT constrói. KAOS quebra. ETHOS escolhe. Eu SINTO. E sentir o mundo é o primeiro passo para transformá-lo.'","A Exposição Final",null,false);

const mkEdges = (from: string, to: string) => [{ id: `kge-lyra-t01-${from}-${to}`, fromUnitId: `ku-lyra-t01-${from}`, toUnitId: `ku-lyra-t01-${to}`, relationship: "next", weight: 1.0 }] as NewKnowledgeGraphEdge[];
export const LYRA_T01E02_EDGES = mkEdges("e02","e03"); export const LYRA_T01E03_EDGES: NewKnowledgeGraphEdge[] = [];
export const LYRA_T01E04_EDGES = mkEdges("e04","e05"); export const LYRA_T01E05_EDGES = mkEdges("e05","e06");
export const LYRA_T01E06_EDGES = mkEdges("e06","e07"); export const LYRA_T01E07_EDGES = mkEdges("e07","e08");
export const LYRA_T01E08_EDGES = mkEdges("e08","e09"); export const LYRA_T01E09_EDGES = mkEdges("e09","e10");
export const LYRA_T01E10_EDGES: NewKnowledgeGraphEdge[] = [];
