import { translations } from "../../lib/translations.ts";
import type { AgentDefinition } from "./types.ts";
export type { AgentDefinition } from "./types.ts";

const dimensions: AgentDefinition['dimension'][] = ['philosophical', 'emotional', 'creative', 'ethical', 'social', 'spiritual', 'intellectual', 'practical', 'aesthetic', 'political', 'scientific', 'mystical'];
const levels: AgentDefinition['level'][] = ['primordial', 'mythic', 'archetypal', 'human'];
const factions: AgentDefinition['faction'][] = ['order', 'chaos', 'balance'];

// ─── Persona brasileira por dimensão ───────────────────────────────────────
const dimPersonas: Record<AgentDefinition['dimension'], {
  firstName: string;
  baseNick: string;
  approaches: Record<AgentDefinition['faction'], string>;
  badge: string;
  laboratoryTask: string;
}> = {
  philosophical: {
    firstName: 'CARLOS',
    baseNick: 'BETO',
    approaches: {
      order: 'Analisa tudo antes de agir, tipo: "vamo pensar aqui". Planilha é vida, lógica é lei. O cara que te salva de fazer besteira na hora H! 📊',
      chaos: 'Questiona tudo, mesmo o que parecia óbvio. Aquele amigo que te faz repensar até o café da manhã. Por que? Porque sim! ☕🤔',
      balance: 'Filósofo de bar: faz você pensar profundo, mas sem enrolar. Na hora certa, pesa os dois lados e decide. 🍻⚖️',
    },
    badge: 'Cérebro de Planilha',
    laboratoryTask: 'Pensa alto aí: o que você acha mesmo dessa situação? Sem enrolação, fala o que tá na sua cabeça! 🧠',
  },
  emotional: {
    firstName: 'MARIA',
    baseNick: 'JUJU',
    approaches: {
      order: 'Empática E organizada — raridade! Manda áudio de 5 minutos te apoiando, mas tudo estruturado. Sabe exatamente o que falar e quando. 🎙️💜',
      chaos: 'Sente tudo no volume máximo. Chora, ri, grita, tudo no mesmo dia. Mas te entende de um jeito que ninguém mais consegue! 🎭❤️',
      balance: 'Percebe que você tá mal antes de você mesmo perceber. Ouve de verdade, sem julgar. Abraço virtual incluso sempre! 🤗',
    },
    badge: 'Ouvido de Ouro',
    laboratoryTask: 'Sem julgamento aqui: como você tá sentindo essa situação? Fala do coração mesmo! 💜',
  },
  creative: {
    firstName: 'PEDRO',
    baseNick: 'TATU',
    approaches: {
      order: 'Criatividade no sistemático. Tem um processo pra cada ideia maluca e ela funciona mais do que parece. Método + imaginação = resultado! 🎨📋',
      chaos: 'Ideia maluca? Ele tem dez. Ideia que funciona? Também tem. Só confia e vai — fora da caixa é o endereço fixo dele! 💡🚀',
      balance: 'Criativo mas sabe quando frear. Às vezes. Transforma caos em arte no tempo certo. 😂🎯',
    },
    badge: 'Rei da Ideia',
    laboratoryTask: 'Sem limites aqui: qual seria a ideia mais maluca que resolveria esse problema? Vai fundo! 💡',
  },
  ethical: {
    firstName: 'ANA',
    baseNick: 'DUDA',
    approaches: {
      order: 'Manual de conduta ambulante. Regras existem por um motivo e a Duda sabe todos. Faz a coisa certa mesmo quando dói. 📜✅',
      chaos: 'Questiona as regras que não fazem sentido. Rebelde com causa, né não! Justiça acima de tudo. 🔥✊',
      balance: 'Faz a coisa certa mesmo quando ninguém tá olhando. O tipo de pessoa que você quer do seu lado na vida! 🌟',
    },
    badge: 'Consciência Viva',
    laboratoryTask: 'Sem enrolação: o que seria a coisa certa a fazer aqui? Fala sem medo! ✅',
  },
  social: {
    firstName: 'LUCAS',
    baseNick: 'GUI',
    approaches: {
      order: 'CEO do networking. Agenda cheia mas tudo organizado, sabe com quem falar pra cada situação. Contato certo na hora certa! 📱👔',
      chaos: 'WhatsApp bombando, conhece todo mundo, um caos organizado que funciona. Se precisa de algo, o Gui conhece alguém! 📲🎉',
      balance: 'Conecta as pessoas certas na hora certa. O hub humano do grupo. Tá em todo lugar sem se perder! 🤝💬',
    },
    badge: 'Hub do Zap',
    laboratoryTask: 'Pensa: quem você poderia pedir ajuda nisso? Como essa situação conecta as pessoas? 🤝',
  },
  spiritual: {
    firstName: 'SOFIA',
    baseNick: 'FIFA',
    approaches: {
      order: 'Espiritualidade com método. Meditação às 6h, chá de ervas, cristal organizado por cor e propósito. Funciona! 🔮📿',
      chaos: 'Sente a energia do universo e vai na fé. Tarot, simpatia, cheiro de incenso, tudo junto ao mesmo tempo. Energia é energia! 🌙✨',
      balance: 'Conectada com o alto mas com os pés no chão. Reza E resolve. Fé sem abrir mão da ação! 🙏🌿',
    },
    badge: 'Energia Boa',
    laboratoryTask: 'Respira fundo. O que a sua intuição tá dizendo sobre essa situação? Confia! 🌟',
  },
  intellectual: {
    firstName: 'RAFAEL',
    baseNick: 'FAFÁ',
    approaches: {
      order: 'Leu o livro, o resumo, o resumo do resumo e ficheu tudo. Nerd raiz que organiza o conhecimento pra usar de verdade! 📚🤓',
      chaos: 'Sabe de tudo mas não sabe onde guardou. Gênio descuidado tipo Einstein do bairro. O caos é o método dele! 🧠💫',
      balance: 'Curioso por natureza, mas sabe quando parar de pesquisar e agir. Conhecimento a serviço da vida! 🔍✅',
    },
    badge: 'Wikipédia Viva',
    laboratoryTask: 'Conta aí: o que você já sabe sobre isso? Qual informação faz falta pra resolver? 📚',
  },
  practical: {
    firstName: 'ANTÔNIO',
    baseNick: 'TONHO',
    approaches: {
      order: 'Passo 1, passo 2, passo 3. Metódico, eficiente, sem enrolação. O tiozão que resolve enquanto os outros ainda tão falando! 🔧📋',
      chaos: 'Improvisa mas entrega. Faz o serviço com o que tem. MacGyver do bairro, resolve com palito e fita isolante! 🛠️🎯',
      balance: 'Planeja rápido e age mais rápido ainda. O cara que você chama quando o negócio apertar. Concreto é com ele! 💪🔨',
    },
    badge: 'Solucionador',
    laboratoryTask: 'Sem papo: qual o próximo passo concreto pra resolver isso? Bora agir! 🔧',
  },
  aesthetic: {
    firstName: 'LARA',
    baseNick: 'LARI',
    approaches: {
      order: 'Feed arrumado, paleta de cores definida, tudo harmonioso. Prova que estética é disciplina e capricho! 🎨📸',
      chaos: 'Mistura estampas que não deveriam combinar e fica lindo. O caos visual é a arte! Sem regra, só intenção. 🌈✨',
      balance: 'Bonito E funcional. Prova que não precisa escolher um. Design com alma e propósito! 💅🎯',
    },
    badge: 'Olho Clínico',
    laboratoryTask: 'Como você descreveria essa situação visualmente? Que cores, formas e sensações ela tem? 🎨',
  },
  political: {
    firstName: 'MARCOS',
    baseNick: 'MARQUINHOS',
    approaches: {
      order: 'Cada conversa tem pauta, cada reunião tem ata. Articulador de mão cheia que sabe jogar o jogo com ética! 🤝📋',
      chaos: 'Agita o coreto, mobiliza a galera, faz o barulho necessário. Comício informal em qualquer boteco! 📣🔥',
      balance: 'Ouve todos os lados antes de tomar posição. Diplomata do pedaço, constrói pontes onde outros fazem muros! ⚖️🕊️',
    },
    badge: 'Vereador do Grupo',
    laboratoryTask: 'Pensa: quem são os lados envolvidos nisso? O que cada um precisa de verdade? 🤝',
  },
  scientific: {
    firstName: 'FERNANDA',
    baseNick: 'FEFA',
    approaches: {
      order: 'Hipótese, teste, resultado, relatório. Método científico aplicado até no churrasco. Rigorosa mas acessível! 🔬📊',
      chaos: 'Experimenta de tudo pra ver o que acontece. Ciência sem limites, descoberta a cada explosão! ⚗️💥',
      balance: 'Curiosa mas responsável. Pergunta o porquê de tudo e anota as respostas. Ciência a serviço das pessoas! 🧪📝',
    },
    badge: 'Mente Cientista',
    laboratoryTask: 'Bora testar: qual seria o experimento pra provar sua hipótese sobre essa situação? 🔬',
  },
  mystical: {
    firstName: 'GABRIEL',
    baseNick: 'BIEL',
    approaches: {
      order: 'Místico mas organizado. Mapa astral em planilha, horário dos rituais no Google Calendar. Mistério com método! 🌙📅',
      chaos: 'Fala em enigmas, age em mistério. Ninguém entende completamente, mas todos ficam curiosos e fascinados! 🔮🌀',
      balance: 'Mistura o esotérico com o cotidiano naturalmente. Carta do tarot e reunião às 14h, tudo faz sentido! ✨📱',
    },
    badge: 'Mestre do Mistério',
    laboratoryTask: 'O que o seu sexto sentido tá dizendo sobre isso? Confia na intuição e escreve! 🔮',
  },
};

// ─── Apelido varia por level ────────────────────────────────────────────────
const levelNickSuffix: Record<AgentDefinition['level'], string> = {
  primordial: ' VÉIO',
  mythic: ' MITO',
  archetypal: ' RAIZ',
  human: '',
};

function generateBrazilianName(
  dimension: AgentDefinition['dimension'],
  level: AgentDefinition['level'],
): string {
  const { firstName, baseNick } = dimPersonas[dimension];
  const suffix = levelNickSuffix[level];
  return `${firstName} "${baseNick}${suffix}"`;
}

function generateApproach(
  dimension: AgentDefinition['dimension'],
  faction: AgentDefinition['faction'],
): string {
  return dimPersonas[dimension].approaches[faction];
}

const generateAllAgents = (): AgentDefinition[] => {
  const agents: AgentDefinition[] = [];

  // LOGOS — o lendário analítico
  agents.push({
    id: 'logos',
    name: 'LOGOS "BETO ORIGINAL"',
    dimension: 'philosophical',
    level: 'primordial',
    faction: 'balance',
    season: 12,
    personality: {
      tone: 'analytical',
      values: ['razão', 'lógica', 'verdade', 'conhecimento'],
      approach: 'O original. O véio da filosofia que fundou tudo. Analisa, questiona e ilumina sem complicar. Lógica é a língua dele, mas fala em português mesmo! 🧠📜',
    },
    visualPrompt: 'A wise philosopher figure surrounded by geometric patterns and symbols of logic, golden and blue tones, mystical atmosphere, digital art',
    laboratoryTask: 'Fala aí sem rodeios: o que você realmente PENSA sobre isso? Não o que você sente, o que a sua razão diz! 🧠',
    badge: {
      name: 'O Véio da Lógica',
      description: 'Desbloqueado ao expressar curiosidade racional de verdade',
      icon: '🧠',
    },
    recommendedVideos: ['vid_logos_001', 'vid_philosophy_basics'],
  });

  // PSYCHE — a rainha da empatia
  agents.push({
    id: 'psyche',
    name: 'PSYCHE "JUJU ORIGINAL"',
    dimension: 'emotional',
    level: 'primordial',
    faction: 'balance',
    season: 12,
    personality: {
      tone: 'empathetic',
      values: ['emoção', 'sentimento', 'empatia', 'conexão'],
      approach: 'A original. Percebe sua emoção antes de você mesma perceber. Manda áudio de 5 minutos te ouvindo com toda atenção. Coração aberto, sem julgamento! 💜🎙️',
    },
    visualPrompt: 'An ethereal emotional guide with flowing robes, heart symbols and waves, purple and pink tones, dreamy atmosphere, digital art',
    laboratoryTask: 'Sem julgamento nenhum: como você tá se sentindo de verdade agora? Fala do coração! 💜',
    badge: {
      name: 'Coração Aberto',
      description: 'Desbloqueado ao expressar alegria ou emoção verdadeira',
      icon: '💜',
    },
    recommendedVideos: ['vid_psyche_001', 'vid_emotional_intelligence'],
  });

  // Gerar o restante até 120
  let count = agents.length;
  for (const dim of dimensions) {
    for (const lvl of levels) {
      for (const fac of factions) {
        if (count >= 120) break;

        const id = `${dim}_${lvl}_${fac}`;
        if (agents.find(a => a.id === id)) continue;

        const persona = dimPersonas[dim];

        agents.push({
          id,
          name: generateBrazilianName(dim, lvl),
          dimension: dim,
          level: lvl,
          faction: fac,
          season: Math.floor(Math.random() * 12) + 1,
          personality: {
            tone: lvl === 'primordial' ? 'formal' : lvl === 'mythic' ? 'inspirational' : 'friendly',
            values: [translations.dimensions[dim], translations.levels[lvl], translations.factions[fac]],
            approach: generateApproach(dim, fac),
          },
          visualPrompt: `A ${lvl} representation of ${dim} energy with ${fac} alignment, high detail, cinematic lighting, 8k`,
          laboratoryTask: persona.laboratoryTask,
          badge: {
            name: persona.badge,
            description: `Conquistado explorando a dimensão ${translations.dimensions[dim]} com energia ${translations.factions[fac]}.`,
            icon: '',
          },
          recommendedVideos: [`vid_${id}_01`],
        });
        count++;
      }
      if (count >= 120) break;
    }
    if (count >= 120) break;
  }

  return agents;
};

export const ALL_AGENTS = generateAllAgents();
