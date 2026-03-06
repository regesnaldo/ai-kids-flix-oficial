export interface Episode {
  id: string;
  title: string;
  concept: string;
  introduction: string;
  problem: string;
  decision: {
    question: string;
    optionA: string;
    optionB: string;
  };
  responses: {
    A: string;
    B: string;
  };
  learning: string;
  thumbnail: string;
}

export const EPISODES: Record<string, Episode> = {
  episode_1: {
    id: "episode_1",
    title: "O Algoritmo Perdido",
    concept: "Qualidade de Dados",
    introduction:
      "O Guia IA flutua no Centro de Comando Holográfico. As luzes neon da sala estão piscando em alerta amarelo. Algo no painel principal não está funcionando como deveria.",
    problem:
      "A nave precisa traçar uma rota rápida para fugir de uma tempestade solar. O problema? Os sensores externos foram danificados. O sistema precisa escolher o melhor caminho de fuga, mas só possui o mapa estelar do ano passado (informações desatualizadas e incompletas).",
    decision: {
      question: "Você assume o controle manual do painel. O que você ordena?",
      optionA:
        "Acelerar usando apenas os dados antigos do mapa do ano passado.",
      optionB:
        "Pausar os motores por 2 minutos para escanear e coletar novos dados do espaço ao redor.",
    },
    responses: {
      A: "A nave acelera, mas raspa na lateral de um asteroide que não estava no mapa antigo. Os escudos tremem, o sistema registra o erro, aprende a nova localização do asteroide e consegue escapar com danos leves.",
      B: "A nave fica parada e a tempestade chega assustadoramente perto. Porém, o escaneamento revela um atalho seguro recém-formado. A nave escapa intacta e com precisão total.",
    },
    learning:
      "Assim como a nossa nave, a Inteligência Artificial não consegue 'adivinhar' o caminho se receber informações velhas ou incompletas. Na IA, chamamos isso de 'Qualidade de Dados' — as boas decisões de uma máquina dependem diretamente das boas informações que entregamos a ela.",
    thumbnail: "/images/episode-1-thumbnail.png",
  },
};
