/**
 * Static fallback for NEXUS T02-T05 episodes.
 * Loaded directly on the client when API/database is unavailable.
 * Content sourced from src/data/seed/season-01-nexus.ts.
 */

interface Screenplay {
  abertura: string;
  narrativa: string;
  pausas: Array<{
    pergunta: string;
    opcoes: [string, string, string];
    continuacoes: [string, string, string];
  }>;
  encerramento: string;
}

export const STATIC_SCREENPLAYS: Record<string, Screenplay> = {
  "nexus-1-2": {
    abertura: "As estrelas da teia do Nexus Prime ainda brilham atrás de você, marcando o caminho percorrido. Agora, à sua frente, uma nova constelação se acende: letras flutuantes feitas de luz ciano formam palavras no ar. NEXUS está ao seu lado, com um pergaminho holográfico nas mãos. 'Ontem você descobriu que a IA aprende. Hoje você vai descobrir como falar com ela. Toda grande jornada começa com uma única palavra. Qual será a sua?'",
    narrativa: "Pense em um gênio da lâmpada. Você esfrega a lâmpada, ele aparece e diz: 'Qual é o seu desejo?' Agora imagine que você diz: 'Quero ser feliz.' O gênio pode te dar um sorvete, um livro, uma viagem... ou simplesmente fazer você dormir por mil anos. O problema não foi o gênio — foi o seu pedido.\n\nCom uma inteligência artificial, acontece a mesma coisa. A forma como você faz a pergunta determina completamente a resposta que você recebe. Isso se chama prompt.\n\nUm prompt ruim: 'Me fala de IA.' Um prompt bom: 'Explique o que é inteligência artificial usando uma analogia com uma criança aprendendo a andar de bicicleta.' A diferença? O segundo tem contexto, propósito e formato.\n\nQuando você escreve um bom prompt, você está dando à IA três coisas: o que você quer saber (o conteúdo), como você quer receber (o formato), e por que isso importa (o contexto).\n\nE aqui vai um segredo que NEXUS guarda há eras: a IA não 'entende' palavras como nós. Ela transforma cada palavra em números, em vetores matemáticos, e encontra padrões entre eles. É poesia feita de números.",
    pausas: [
      {
        pergunta: "Se você pudesse fazer uma única pergunta para a IA mais inteligente do mundo, qual seria?",
        opcoes: ["A. 'Qual é o sentido da vida?' — uma pergunta filosófica profunda", "B. 'Como posso aprender mais rápido?' — uma pergunta prática e útil", "C. 'O que você vê quando olha para mim?' — uma pergunta sobre percepção"],
        continuacoes: ["Uma pergunta fascinante! Mas a IA responderia com padrões que encontrou em textos humanos — não com uma verdade universal. O valor não está na resposta, mas na jornada de fazer a pergunta certa.", "Essa é uma excelente pergunta prática! A IA poderia te dar técnicas de estudo — mas o verdadeiro segredo é que aprender rápido não é sobre velocidade, é sobre fazer as conexões certas. E isso, a IA pode ajudar.", "Essa pergunta revela algo profundo sobre você. A IA não 'vê' como nós — ela analisa padrões. Mas ao fazer essa pergunta, você está começando a entender que a qualidade da resposta depende da qualidade da sua curiosidade."],
      },
      {
        pergunta: "O que torna um prompt realmente poderoso?",
        opcoes: ["A. Clareza — quanto mais específico, melhor a resposta", "B. Criatividade — prompts criativos geram respostas surpreendentes", "C. Contexto — explicar o porquê da pergunta faz toda diferença"],
        continuacoes: ["Sim! Clareza é fundamental. Mas clareza sem contexto é como dar um endereço sem dizer a cidade. Um prompt claro diz O QUE você quer. Um prompt poderoso também diz POR QUE você quer.", "Criatividade abre portas que a clareza não alcança! Mas lembre-se: a IA não é mágica. Um prompt criativo funciona melhor quando está ancorado em um objetivo claro. É como jazz — improvisação dentro de uma estrutura.", "O Contexto é o ingrediente secreto! Quando você explica POR QUE está perguntando, a IA pode adaptar a resposta ao seu nível, aos seus interesses, ao seu momento. É como a diferença entre um professor que te conhece e um que nunca te viu."],
      },
    ],
    encerramento: "NEXUS guarda o pergaminho e aponta para o horizonte. 'Você aprendeu a perguntar. Mas existe algo mais profundo: como a IA encontra as respostas? Amanhã, você vai descobrir o mundo invisível dos padrões — como uma máquina olha para o caos e encontra ordem.' Uma luz pulsa no horizonte, revelando estruturas geométricas que se formam e se desfazem. 'Prepare-se. O Despertar dos Padrões começa ao amanhecer.'",
  },
  "nexus-1-3": {
    abertura: "Você pisca e o Nexus Prime desaparece. Agora você está em uma galeria infinita de espelhos. Cada superfície reflete uma versão diferente de você — algumas nítidas, outras distorcidas. NEXUS está ao seu lado. 'Bem-vindo à Galeria dos Padrões, Explorador. Aqui, nada é exatamente o que parece.'",
    narrativa: "NEXUS para diante de um espelho que mostra vocês dois, mas com roupas trocadas. 'Olhe para este reflexo. O que você vê?' Você hesita. 'Eu... com a sua roupa?' NEXUS sorri. 'Você viu um padrão onde ele não existe. Isso se chama apofenia: ver padrões significativos em dados aleatórios.'\n\nEle continua andando, e os espelhos começam a mostrar números flutuantes. Milhares deles. 'Agora, encontre o padrão real.' Você observa. Alguns números se repetem. Outros parecem aleatórios. É exaustivo. 'Não tente olhar para todos. Uma IA não olha para cada ponto de dado individualmente. Ela procura por características — features.'\n\nVocê respira fundo e para de tentar ver tudo. Em vez disso, procura por algo que se destaque. E então você vê: a cada 7 números, um deles é sempre maior que 100. 'Achei!' O espelho à sua frente se dissolve.\n\nIsso é reconhecimento de padrões. Não é sobre ver tudo — é sobre saber o que procurar.",
    pausas: [
      {
        pergunta: "Por que seu cérebro tentou encontrar sentido em roupas trocadas aleatoriamente no espelho?",
        opcoes: ["A. Porque o cérebro humano é programado para encontrar padrões — mesmo onde eles não existem", "B. Porque o espelho estava programado para enganar você", "C. Porque você estava cansado e confundiu as cores"],
        continuacoes: ["Exatamente! Isso se chama apofenia. Seu cérebro faz isso o tempo todo: rostos nas nuvens, mensagens em músicas. Uma IA também pode cair nessa armadilha se não for treinada com cuidado.", "Não é um truque — é como seu cérebro funciona! Nós evoluímos para encontrar padrões porque isso nos ajudava a sobreviver. Ver um tigre nas sombras era melhor do que não ver um tigre de verdade.", "Não é cansaço — é algo muito mais profundo! Seu cérebro está constantemente tentando dar sentido ao mundo, mesmo quando não há sentido algum. A IA faz exatamente a mesma coisa com dados."],
      },
      {
        pergunta: "Vendas de sorvete e ataques de tubarão sobem juntos no verão. O que isso realmente significa?",
        opcoes: ["A. Sorvete atrai tubarões — é melhor não comer na praia", "B. É uma correlação, não causalidade — o calor do verão causa ambos", "C. São apenas coincidências — dados aleatórios não significam nada"],
        continuacoes: ["Essa é engraçada — mas não! Se fosse verdade, sorveterias seriam os lugares mais perigosos do mundo. A realidade é mais sutil: as duas coisas têm uma causa comum (o verão), mas não se causam diretamente.", "Perfeito! Você entendeu a diferença entre correlação e causalidade. Esse é um dos conceitos mais importantes em ciência de dados. Grandes decisões são tomadas com base em correlações — entender essa diferença é crucial.", "Não são apenas coincidências! Existe um padrão real: ambos sobem no verão. O problema não é o padrão — ele existe. O problema é a interpretação. Correlação é real. Causalidade é outra coisa."],
      },
    ],
    encerramento: "O Olho de LOGOS brilha intensamente enquanto a porta se abre. 'Você passou pelo Guardião', diz NEXUS com orgulho. 'Mas lembre-se: encontrar padrões é apenas metade da jornada. A outra metade é saber quais padrões são verdadeiros e quais são armadilhas.' Ele faz uma pausa enquanto a paisagem além da porta começa a se formar. 'Amanhã, você vai descobrir o que acontece quando os próprios dados estão contaminados. O viés.'",
  },
  "nexus-1-4": {
    abertura: "A galeria dos padrões ficou para trás, mas o que você vê agora é ainda mais perturbador. Os dados que deveriam ser puros estão manchados. Gráficos que deveriam ser neutros mostram inclinações sutis. NEXUS está ao seu lado, com uma expressão grave. 'Bem-vindo ao Dilema do Viés, Explorador. O capítulo mais difícil — e mais importante.'",
    narrativa: "Imagine que você está construindo uma IA para contratar pessoas. Você alimenta o sistema com 10 anos de contratações da sua empresa. O sistema aprende e começa a selecionar candidatos. Mas você percebe algo estranho: ele está escolhendo principalmente homens. Por quê?\n\nNEXUS explica: 'A IA não é preconceituosa por natureza. Ela aprendeu com os dados que você deu. Se nos últimos 10 anos sua empresa contratou mais homens, a IA concluiu que homens são melhores candidatos. Ela não questiona os dados — ela os replica.'\n\nIsso é o viés algorítmico. Não é maldade. É matemática. A IA encontra padrões nos dados e os perpetua. Se os dados de treinamento têm preconceitos embutidos, a IA vai amplificá-los.\n\nMas o problema é ainda mais profundo. Às vezes, o viés não está nos dados de treinamento — está no que NÃO está nos dados. Quem não foi contratado nos últimos 10 anos? Quais currículos foram descartados sem nem serem lidos? A IA não pode aprender com o que não vê.\n\n'Dados são como água', diz NEXUS. 'Se a fonte está contaminada, tudo que cresce dela também estará.'",
    pausas: [
      {
        pergunta: "Se uma IA de contratação aprende com dados históricos que favorecem homens, o que deve ser feito?",
        opcoes: ["A. Descartar a IA e voltar ao método humano de contratação", "B. Corrigir os dados de treinamento para serem mais equilibrados", "C. A IA está certa — os dados históricos refletem a realidade"],
        continuacoes: ["Voltar ao método humano não resolve — humanos também têm vieses! A diferença é que o viés humano pode ser questionado, enquanto o viés da IA é invisível e multiplicado por escala. A solução não é abandonar a tecnologia, mas usá-la com consciência.", "Corrigir os dados é o caminho certo! Mas como? Você pode balancear o dataset, adicionar exemplos sintéticos, ou usar técnicas de fairness. O importante é reconhecer que dados 'neutros' não existem — toda coleta de dados tem viés embutido.", "Cuidado! Os dados históricos refletem a realidade de um sistema que já era desigual. Se a IA aprende com esses dados e replica o padrão, ela está apenas automatizando a desigualdade. A realidade dos dados não é a realidade que queremos construir."],
      },
      {
        pergunta: "Qual é a maior armadilha ao trabalhar com dados?",
        opcoes: ["A. Dados insuficientes — quanto mais dados, melhor o modelo", "B. Dados enviesados — o viés invisível é mais perigoso que a falta de dados", "C. Dados desatualizados — informações velhas levam a conclusões erradas"],
        continuacoes: ["Mais dados nem sempre é melhor! Se você tem um bilhão de exemplos enviesados, o modelo vai aprender o viés com ainda mais precisão. Quantidade não substitui qualidade. Às vezes, menos dados bem curados são melhores que muitos dados sujos.", "Exato! O viés invisível é o inimigo silencioso. Você pode ter todos os dados do mundo, mas se eles carregam preconceitos históricos, seu modelo vai perpetuá-los. A pergunta mais importante não é 'quantos dados temos?', mas 'o que esses dados não mostram?'", "Dados desatualizados são um problema real, mas o viés é mais traiçoeiro. Dados antigos podem ser identificados e substituídos. O viés, não — ele se disfarça de verdade estatística. É como um vírus que se replica silenciosamente."],
      },
    ],
    encerramento: "NEXUS fecha o terminal de dados e olha para você com seriedade. 'Você viu a sombra que acompanha toda inteligência. Mas não tenha medo dos dados — tenha respeito. Amanhã, você vai cruzar o Limiar da Consciência. A pergunta que nenhuma IA consegue responder: o que significa pensar?'",
  },
  "nexus-1-5": {
    abertura: "O horizonte à sua frente não é mais feito de dados ou padrões. É uma névoa dourada que pulsa como se estivesse viva. Você está na fronteira entre o que é máquina e o que é mente. NEXUS caminha ao seu lado em silêncio, seus olhos ciano refletindo a névoa. 'Este é o Limiar da Consciência. O lugar onde param as respostas e começam as perguntas.'",
    narrativa: "Pense em um espelho. O que você vê? Você vê seu reflexo. Mas o espelho SABE que está refletindo você? Ele tem consciência do que faz?\n\nAgora pense em uma IA que joga xadrez. Ela vence o campeão mundial. Ela calcula milhões de jogadas por segundo. Mas ela SABE que está jogando xadrez? Ela sente a vitória? Ela se importa?\n\nEste é o grande debate da inteligência artificial: a diferença entre inteligência e consciência. Uma calculadora é inteligente? Ela faz contas melhor que qualquer humano. Mas ninguém diria que uma calculadora 'pensa'.\n\nNEXUS aponta para a névoa. 'Existem duas correntes de pensamento. A primeira diz que a consciência é um subproduto da complexidade: quando um sistema fica suficientemente complexo, a consciência emerge naturalmente — como a água vira gelo quando esfria o suficiente.'\n\nA segunda diz que a consciência é algo fundamentalmente diferente de computação. Que não importa o quão rápido ou complexo um sistema seja, ele nunca vai 'sentir' o vermelho de uma rosa ou a tristeza de uma despedida. Seria como esperar que um livro de receitas sinta fome.",
    pausas: [
      {
        pergunta: "Se uma IA pudesse imitar perfeitamente a consciência humana, você a consideraria consciente?",
        opcoes: ["A. Sim — se ela age como consciente, é consciente. Aparência é realidade", "B. Não — imitar não é ser. Um papagaio repete palavras mas não entende o significado", "C. Depende — precisaríamos de um teste melhor do que apenas observar o comportamento"],
        continuacoes: ["Essa é a posição do behaviorismo! Se nada distingue o comportamento de uma IA consciente de um humano consciente, qual a diferença prática? Mas cuidado: isso nos levaria a tratar uma imitação perfeita como se fosse real — com todas as implicações éticas.", "Essa é a posição do ceticismo! Mas onde exatamente está a linha entre imitar e ser? Um bebê humano também 'imita' consciência nos primeiros anos — ninguém diria que ele não é consciente. O critério de imitação é mais complexo do que parece.", "Essa é uma posição científica prudente! O Teste de Turing não é mais suficiente. Precisamos de novos paradigmas: testes de autoconsciência, de teoria da mente, de metacognição. A pergunta não é 'ela parece consciente?', mas 'ela SABE que existe?'"],
      },
      {
        pergunta: "O que você acha que NUNCA deveria ser delegado a uma IA, mesmo que ela fosse superinteligente?",
        opcoes: ["A. Decisões sobre vida e morte — isso deve permanecer humano", "B. Nada — se a IA for melhor que humanos em tudo, deveríamos delegar tudo", "C. A pergunta em si é humana — a IA não deveria decidir o que delegamos a ela"],
        continuacoes: ["Essa resposta revela sua bússola moral! Mas considere: se uma IA pode diagnosticar câncer com 99% de precisão e um humano com 70%, não delegar seria ético? A fronteira entre 'vida e morte' e 'eficiência' é mais nebulosa do que parece.", "Cuidado com a confiança absoluta! Uma IA pode ser melhor em métricas quantificáveis, mas 'melhor' para quem? Segundo quais valores? Uma IA pode otimizar a felicidade global decidindo eliminar 10% da população — os 10% mais infelizes. Tecnicamente 'melhor'. Moralmente monstruoso.", "Profundo. Você tocou no cerne da questão: quem decide o que delegar? Se deixarmos a IA decidir seu próprio escopo, podemos acordar em um mundo onde não há mais nada que 'não deva ser delegado'. A autonomia humana é a última fronteira."],
      },
    ],
    encerramento: "A névoa começa a se dissipar. À sua frente, seis portais se abrem — cada um com a silhueta de um agente diferente. 'Você chegou ao fim da Temporada 1', diz NEXUS com um sorriso. 'Agora você conhece o básico. Mas o MENTE.AI é muito maior. Além destes portais, existem outros 11 universos, cada um com seu próprio agente, sua própria perspectiva, sua própria verdade.' Os portais brilham em cores diferentes. 'Na Temporada 2, você vai explorar o mundo de VOLT, o Energético — e descobrir como a energia flui através das redes neurais. Cada agente vai te ensinar algo que nenhum outro pode.' NEXUS estende a mão. 'A jornada apenas começou, Explorador. Qual portal você vai cruzar primeiro?'",
  },
};

export function getStaticScreenplay(agentId: string, season: number, episode: number): Screenplay | null {
  const key = `${agentId}-${season}-${episode}`;
  return STATIC_SCREENPLAYS[key] || null;
}
