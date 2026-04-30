// Enhanced mock data with images and optimized voice content

export interface ExplanationBlock {
  id: string;
  title: string;
  content: string;
  emoji: string;
  iconType: "brain" | "network" | "sparkle" | "robot" | "lightbulb";
  imageUrl?: string; // Placeholder for AI-generated images
  voiceText?: string; // Optimized for TTS
}

export interface FlipBookLesson {
  id: string;
  title: string;
  subtitle: string;
  summary: string;
  blocks: ExplanationBlock[];
  keywords: string[];
  visualizerRequest?: {
    enabled: boolean;
    concept: string;
    universe: "NEXUS" | "VOLT" | "STRATOS" | "KAOS" | "ETHOS" | "LYRA" | "AURORA" | "TERRA" | "AXIOM" | "CIPHER" | "JANUS" | "PRISM";
  };
}

type VisualizerUniverse = "NEXUS" | "VOLT" | "STRATOS" | "KAOS" | "ETHOS" | "LYRA" | "AURORA" | "TERRA" | "AXIOM" | "CIPHER" | "JANUS" | "PRISM";

// Neural Networks - Portuguese BR
export const neuralNetworksLesson: FlipBookLesson = {
  id: "redes-neurais-7y",
  title: "Redes Neurais",
  subtitle: "Como os computadores aprendem como o seu cérebro!",
  summary: "Pense no seu cérebro como uma supermáquina que aprende com experiências. Redes neurais ajudam computadores a aprender de forma parecida.",
  blocks: [
    {
      id: "nn-1",
      title: "Seu cérebro tem superpoderes!",
      content: "No seu cérebro existem bilhões de células chamadas neurônios. Elas conversam entre si para você pensar, aprender e lembrar das coisas.",
      emoji: "🧠",
      iconType: "brain",
      imageUrl: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&h=400&fit=crop",
      voiceText: "Seu cérebro tem superpoderes! No seu cérebro existem bilhões de células chamadas neurônios. Elas conversam entre si para você pensar, aprender e lembrar."
    },
    {
      id: "nn-2",
      title: "Computadores têm neurônios também!",
      content: "Redes neurais são como cérebros falsos para computadores. Eles têm muitas partes pequenas que aprendem a trabalhar juntas.",
      emoji: "💻",
      iconType: "network",
      imageUrl: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&h=400&fit=crop",
      voiceText: "Computadores têm neurônios também! Redes neurais são como cérebros falsos para computadores."
    },
    {
      id: "nn-3",
      title: "Errar é parte do aprendizado!",
      content: "Quando você aprende a andar de bicicleta, erra algumas vezes e tenta de novo. O computador faz a mesma coisa!",
      emoji: "🎓",
      iconType: "lightbulb",
      imageUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=400&fit=crop",
      voiceText: "Errar é parte do aprendizado! Quando você aprende a andar de bicicleta, erra e tenta de novo. O computador faz o mesmo."
    },
    {
      id: "nn-4",
      title: "Encontrando padrões escondidos",
      content: "Redes neurais são ótimas em achar padrões, como reconhecer seu rosto em fotos!",
      emoji: "🔍",
      iconType: "sparkle",
      imageUrl: "https://images.unsplash.com/photo-1555255707-c07966088b7b?w=800&h=400&fit=crop",
      voiceText: "Encontrando padrões escondidos! Redes neurais são ótimas em achar padrões, como reconhecer seu rosto em fotos."
    },
    {
      id: "nn-5",
      title: "Fazendo previsões inteligentes",
      content: "Depois de treinar muito, o computador consegue adivinhar o que você quer fazer, igual ao Netflix sugerindo filmes!",
      emoji: "🎯",
      iconType: "robot",
      imageUrl: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800&h=400&fit=crop",
      voiceText: "Fazendo previsões inteligentes! Depois de treinar muito, o computador adivinha o que você quer fazer, igual ao Netflix."
    }
  ],
  keywords: ["rede neural", "redes neurais", "neural", "network", "cérebro", "neurônio"]
};

// AI Prompts - NEW LESSON
export const aiPromptsLesson: FlipBookLesson = {
  id: "prompts-de-ia",
  title: "Prompt Engineering",
  subtitle: "A arte de falar direito com a IA!",
  summary: "Um prompt é como uma pergunta bem feita. Quanto melhor você perguntar, melhores respostas a IA vai dar.",
  blocks: [
    {
      id: "prompt-1",
      title: "O que é um Prompt?",
      content: "Prompt é o que você escreve para a IA. É como dar uma instrução clara para alguém fazer algo por você.",
      emoji: "💬",
      iconType: "lightbulb",
      imageUrl: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800&h=400&fit=crop",
      voiceText: "O que é um Prompt? Prompt é o que você escreve para a IA. É como dar uma instrução clara."
    },
    {
      id: "prompt-2",
      title: "Seja específico!",
      content: "Em vez de 'faça um desenho', tente 'faça um desenho de um gato astronauta no espaço'. Quanto mais detalhes, melhor!",
      emoji: "🎯",
      iconType: "sparkle",
      imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=400&fit=crop",
      voiceText: "Seja específico! Em vez de fazer um desenho, tente fazer um desenho de um gato astronauta no espaço. Quanto mais detalhes, melhor!"
    },
    {
      id: "prompt-3",
      title: "Dê contexto",
      content: "Explique quem você é e para quê precisa. 'Sou professor e preciso de uma atividade para crianças de 7 anos' funciona melhor que só 'atividade'.",
      emoji: "📚",
      iconType: "brain",
      imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=400&fit=crop",
      voiceText: "Dê contexto! Explique quem você é e para quê precisa. Assim a IA entende melhor o que você quer."
    },
    {
      id: "prompt-4",
      title: "Use exemplos",
      content: "Mostrar exemplos para a IA ajuda ela entender o formato que você quer. É como mostrar uma foto do prato pronto antes de cozinhar!",
      emoji: "🖼️",
      iconType: "sparkle",
      imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop",
      voiceText: "Use exemplos! Mostrar exemplos para a IA ajuda ela entender o formato que você quer. É como mostrar uma foto antes de cozinhar."
    },
    {
      id: "prompt-5",
      title: "Itere e melhore",
      content: "A primeira resposta não precisa ser perfeita. Ajuste seu prompt aos poucos até conseguir o resultado que deseja!",
      emoji: "🔄",
      iconType: "robot",
      imageUrl: "https://images.unsplash.com/photo-1535378620166-273708d44e4c?w=800&h=400&fit=crop",
      voiceText: "Itere e melhore! A primeira resposta não precisa ser perfeita. Ajuste seu prompt aos poucos até conseguir o resultado que deseja."
    }
  ],
  keywords: ["prompt", "prompts", "engenharia de prompt", "instrução", "comando", "como perguntar"]
};

// Machine Learning
export const machineLearningLesson: FlipBookLesson = {
  id: "aprendizado-de-maquina",
  title: "Machine Learning",
  subtitle: "Ensinando computadores a ficarem mais espertos",
  summary: "Machine learning é a técnica que permite ao computador aprender com exemplos, sem precisar de regras escritas para tudo.",
  blocks: [
    {
      id: "ml-1",
      title: "Computadores que aprendem",
      content: "É como ensinar um truque para um cachorro: você mostra exemplos, corrige e ele vai aprendendo a cada vez.",
      emoji: "🐕",
      iconType: "lightbulb",
      imageUrl: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&h=400&fit=crop",
      voiceText: "Computadores que aprendem! É como ensinar um truque para um cachorro: você mostra exemplos e ele vai aprendendo."
    },
    {
      id: "ml-2",
      title: "Prática melhora o resultado",
      content: "Quanto mais exemplos o sistema analisa, melhor ele fica. É igual treinar matemática resolvendo vários exercícios.",
      emoji: "📚",
      iconType: "brain",
      imageUrl: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&h=400&fit=crop",
      voiceText: "Prática melhora o resultado! Quanto mais exemplos, melhor o sistema fica. É igual treinar matemática."
    },
    {
      id: "ml-3",
      title: "Buscando o melhor caminho",
      content: "O modelo testa abordagens diferentes e guarda o que funcionou, ajustando a estratégia para acertar mais.",
      emoji: "🗺️",
      iconType: "sparkle",
      imageUrl: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&h=400&fit=crop",
      voiceText: "Buscando o melhor caminho! O modelo testa abordagens diferentes e guarda o que funcionou."
    },
    {
      id: "ml-4",
      title: "Fazendo previsões",
      content: "Depois de aprender, ele consegue estimar o que vem a seguir, como recomendações de filmes ou previsão do tempo.",
      emoji: "🔮",
      iconType: "robot",
      imageUrl: "https://images.unsplash.com/photo-1530639834082-05bafb67fb58?w=800&h=400&fit=crop",
      voiceText: "Fazendo previsões! Depois de aprender, ele estima o que vem a seguir, como recomendações de filmes."
    },
    {
      id: "ml-5",
      title: "Evolução contínua",
      content: "Com novos dados, o desempenho continua melhorando. O aprendizado nunca para!",
      emoji: "🚀",
      iconType: "sparkle",
      imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=400&fit=crop",
      voiceText: "Evolução contínua! Com novos dados, o desempenho continua melhorando. O aprendizado nunca para!"
    }
  ],
  keywords: ["machine learning", "aprendizado de máquina", "ml", "dados", "previsão", "treino"]
};

// Generative AI
export const generativeAILesson: FlipBookLesson = {
  id: "ia-generativa",
  title: "IA Generativa",
  subtitle: "Tecnologia que cria conteúdo novo",
  summary: "IA generativa é um tipo de inteligência artificial capaz de criar textos, imagens, música e outras ideias originais.",
  blocks: [
    {
      id: "gen-1",
      title: "IA que cria!",
      content: "Diferente de sistemas que só seguem comandos fixos, a IA generativa produz conteúdo novo a partir de um pedido.",
      emoji: "✨",
      iconType: "sparkle",
      imageUrl: "https://images.unsplash.com/photo-1684384057887-3d9ff05e9e7a?w=800&h=400&fit=crop",
      voiceText: "IA que cria! Diferente de sistemas que só seguem comandos, a IA generativa produz conteúdo novo."
    },
    {
      id: "gen-2",
      title: "Aprendendo com tudo",
      content: "Ela aprende observando muitos exemplos de livros, imagens, sons e conversas para entender estilos e estruturas.",
      emoji: "📚",
      iconType: "brain",
      imageUrl: "https://images.unsplash.com/photo-1487110125142-63642187c51c?w=800&h=400&fit=crop",
      voiceText: "Aprendendo com tudo! Ela observa muitos exemplos de livros, imagens e conversas para entender estilos."
    },
    {
      id: "gen-3",
      title: "Misturando ideias",
      content: "O modelo mistura referências e cria variações novas, como um chef que combina ingredientes para inventar receitas.",
      emoji: "🍨",
      iconType: "lightbulb",
      imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=400&fit=crop",
      voiceText: "Misturando ideias! O modelo cria variações novas, como um chef que inventa receitas novas."
    },
    {
      id: "gen-4",
      title: "Parceiro criativo",
      content: "Pode apoiar escritores, designers, professores e músicos acelerando rascunhos, estudos e experimentos.",
      emoji: "🎨",
      iconType: "robot",
      imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=400&fit=crop",
      voiceText: "Parceiro criativo! Pode apoiar escritores e designers, acelerando rascunhos e experimentos."
    },
    {
      id: "gen-5",
      title: "Criatividade aumentada",
      content: "Não substitui a criatividade humana: amplia possibilidades, reduz bloqueios e abre espaço para novas ideias.",
      emoji: "🌈",
      iconType: "sparkle",
      imageUrl: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=400&fit=crop",
      voiceText: "Criatividade aumentada! Não substitui a criatividade humana, mas abre espaço para novas ideias."
    }
  ],
  keywords: ["ia generativa", "generativa", "gpt", "criar", "criação", "conteúdo"]
};

// AI Agents
export const aiAgentsLesson: FlipBookLesson = {
  id: "agentes-de-ia",
  title: "Agentes de IA",
  subtitle: "Assistentes digitais que planejam e executam",
  summary: "Agentes de IA entendem objetivos, montam um plano e usam ferramentas para executar tarefas com autonomia.",
  blocks: [
    {
      id: "agent-1",
      title: "Assistentes inteligentes",
      content: "Um agente de IA interpreta seu pedido e decide qual caminho seguir para chegar no resultado esperado.",
      emoji: "🤖",
      iconType: "robot",
      imageUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=400&fit=crop",
      voiceText: "Assistentes inteligentes! Um agente de IA interpreta seu pedido e decide o melhor caminho a seguir."
    },
    {
      id: "agent-2",
      title: "Planejamento em etapas",
      content: "Assim como montar LEGO por passos, o agente divide um problema grande em tarefas menores e organizadas.",
      emoji: "🗺️",
      iconType: "lightbulb",
      imageUrl: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&h=400&fit=crop",
      voiceText: "Planejamento em etapas! O agente divide um problema grande em tarefas menores e organizadas."
    },
    {
      id: "agent-3",
      title: "Uso de ferramentas",
      content: "Ele pode consultar busca, calculadora, APIs e outros sistemas para tomar decisões melhores.",
      emoji: "🔧",
      iconType: "sparkle",
      imageUrl: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800&h=400&fit=crop",
      voiceText: "Uso de ferramentas! Ele pode consultar busca, calculadora e outros sistemas para ajudar."
    },
    {
      id: "agent-4",
      title: "Memória de contexto",
      content: "Agentes podem manter contexto das interações para oferecer respostas mais coerentes ao longo da conversa.",
      emoji: "🐘",
      iconType: "brain",
      imageUrl: "https://images.unsplash.com/photo-1535378620166-273708d44e4c?w=800&h=400&fit=crop",
      voiceText: "Memória de contexto! Agentes lembram do que foi dito antes para dar respostas mais coerentes."
    },
    {
      id: "agent-5",
      title: "Trabalho em equipe",
      content: "Vários agentes podem colaborar, cada um com uma especialidade, para resolver tarefas complexas mais rápido.",
      emoji: "👥",
      iconType: "network",
      imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=400&fit=crop",
      voiceText: "Trabalho em equipe! Vários agentes colaboram, cada um com uma especialidade, para resolver tarefas mais rápido."
    }
  ],
  keywords: ["agente", "agentes", "agentes de ia", "autônomo", "planejar", "executar"]
};

// Introduction to AI
export const introAILesson: FlipBookLesson = {
  id: "introducao-ia",
  title: "O que é IA?",
  subtitle: "Entenda inteligência artificial de forma simples",
  summary: "IA significa inteligência artificial: tecnologias que ajudam computadores a perceber padrões, aprender e tomar decisões.",
  blocks: [
    {
      id: "intro-1",
      title: "Definição prática",
      content: "IA é quando o computador executa tarefas que normalmente exigem raciocínio humano, como reconhecer imagem e linguagem.",
      emoji: "💡",
      iconType: "lightbulb",
      imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop",
      voiceText: "Definição prática! IA é quando o computador faz tarefas que precisam de raciocínio humano."
    },
    {
      id: "intro-2",
      title: "IA e cérebro humano",
      content: "O cérebro humano é muito mais amplo, mas a IA tenta reproduzir algumas capacidades específicas com matemática e código.",
      emoji: "🧠",
      iconType: "brain",
      imageUrl: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&h=400&fit=crop",
      voiceText: "IA e cérebro humano! O cérebro é mais amplo, mas a IA reproduz algumas capacidades com matemática."
    },
    {
      id: "intro-3",
      title: "IA no dia a dia",
      content: "Ela aparece no desbloqueio facial do celular, em recomendações de conteúdo e em assistentes de voz.",
      emoji: "📱",
      iconType: "sparkle",
      imageUrl: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=400&fit=crop",
      voiceText: "IA no dia a dia! Ela aparece no desbloqueio facial, recomendações e assistentes de voz."
    },
    {
      id: "intro-4",
      title: "Aprendizado por dados",
      content: "Quanto mais dados relevantes e de qualidade, melhor o modelo aprende a encontrar padrões úteis.",
      emoji: "📊",
      iconType: "network",
      imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
      voiceText: "Aprendizado por dados! Quanto mais dados, melhor o modelo aprende a encontrar padrões úteis."
    },
    {
      id: "intro-5",
      title: "Impacto real",
      content: "IA acelera diagnósticos em saúde, apoia pesquisas científicas e simplifica tarefas rotineiras.",
      emoji: "🚀",
      iconType: "robot",
      imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=400&fit=crop",
      voiceText: "Impacto real! IA acelera diagnósticos em saúde e apoia pesquisas científicas."
    }
  ],
  keywords: ["ia", "inteligência artificial", "introdução", "básico", "fundamentos"]
};

// Topic mapping
export const topicToLesson: Record<string, FlipBookLesson> = {
  "rede neural": neuralNetworksLesson,
  "redes neurais": neuralNetworksLesson,
  "redes": neuralNetworksLesson,
  neural: neuralNetworksLesson,
  network: neuralNetworksLesson,
  cérebro: neuralNetworksLesson,
  "machine learning": machineLearningLesson,
  "aprendizado de máquina": machineLearningLesson,
  "aprendizado de maquina": machineLearningLesson,
  ml: machineLearningLesson,
  aprender: machineLearningLesson,
  treino: machineLearningLesson,
  "ia generativa": generativeAILesson,
  generativa: generativeAILesson,
  gpt: generativeAILesson,
  criar: generativeAILesson,
  criação: generativeAILesson,
  arte: generativeAILesson,
  "prompts": aiPromptsLesson,
  prompt: aiPromptsLesson,
  "engenharia de prompt": aiPromptsLesson,
  "como perguntar": aiPromptsLesson,
  agente: aiAgentsLesson,
  agentes: aiAgentsLesson,
  autônomo: aiAgentsLesson,
  planejar: aiAgentsLesson,
  "inteligência artificial": introAILesson,
  ia: introAILesson,
  "o que é ia": introAILesson,
  fundamentos: introAILesson,
};

export const defaultLesson: FlipBookLesson = introAILesson;

// Smart prompt matcher
export function getLessonFromPrompt(prompt: string): FlipBookLesson {
  const lowerPrompt = prompt.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, ''); // Remove accents
  const showMeMatch = prompt.match(/\bshow me\s+(.+)$/i);
  const showMeConcept = showMeMatch?.[1]?.trim() || '';

  const inferUniverse = (concept: string): VisualizerUniverse => {
    const input = concept.toLowerCase();
    if (/(raio|energia|eletric|lightning|power)/.test(input)) return "VOLT";
    if (/(xadrez|estrateg|strategy|tower)/.test(input)) return "STRATOS";
    if (/(caos|fragment|colapso|entropy)/.test(input)) return "KAOS";
    if (/(etica|ethic|biblioteca|library)/.test(input)) return "ETHOS";
    if (/(musica|audio|som|synesthesia|sinestesia)/.test(input)) return "LYRA";
    if (/(aurora|sky|horizon|clima)/.test(input)) return "AURORA";
    if (/(natureza|floresta|plant|terra)/.test(input)) return "TERRA";
    if (/(lab|dados|hologra|axiom|analytics)/.test(input)) return "AXIOM";
    if (/(codigo|code|maze|cipher|algoritmo)/.test(input)) return "CIPHER";
    if (/(humor|comedia|janus|ironia)/.test(input)) return "JANUS";
    if (/(prism|viewport|reality|multiverso)/.test(input)) return "PRISM";
    return "NEXUS";
  };

  const attachVisualizerRequest = (lesson: FlipBookLesson): FlipBookLesson => {
    if (!showMeConcept) return lesson;
    return {
      ...lesson,
      visualizerRequest: {
        enabled: true,
        concept: showMeConcept,
        universe: inferUniverse(showMeConcept),
      },
    };
  };

  // Special patterns for 7-year-old explanations
  if (lowerPrompt.includes("7 ano") || lowerPrompt.includes("7anos") || 
      lowerPrompt.includes("crianca") || lowerPrompt.includes("criança") ||
      lowerPrompt.includes("infantil") || lowerPrompt.includes("filho") ||
      lowerPrompt.includes("filha")) {
    if (lowerPrompt.includes("neural") || lowerPrompt.includes("rede")) {
      return attachVisualizerRequest(neuralNetworksLesson);
    }
    if (lowerPrompt.includes("machine") || lowerPrompt.includes("aprendizado")) {
      return attachVisualizerRequest(machineLearningLesson);
    }
  }

  // Check for prompts topic
  if (lowerPrompt.includes("prompt") || lowerPrompt.includes("pergunta") || 
      lowerPrompt.includes("engenharia") || lowerPrompt.includes("como falar")) {
    return attachVisualizerRequest(aiPromptsLesson);
  }

  // Normal topic matching
  for (const [key, lesson] of Object.entries(topicToLesson)) {
    const normalizedKey = key.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    if (lowerPrompt.includes(normalizedKey)) {
      return attachVisualizerRequest(lesson);
    }
  }

  return attachVisualizerRequest(defaultLesson);
}

// All lessons for random selection
export const allLessons: FlipBookLesson[] = [
  neuralNetworksLesson,
  machineLearningLesson,
  generativeAILesson,
  aiAgentsLesson,
  introAILesson,
  aiPromptsLesson
];
