-- Add educational_episodes table for narrative episodes
CREATE TABLE IF NOT EXISTS educational_episodes (
  id VARCHAR(255) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  concept VARCHAR(255) NOT NULL,
  introduction TEXT NOT NULL,
  problem TEXT NOT NULL,
  decision_question TEXT NOT NULL,
  decision_option_a TEXT NOT NULL,
  decision_option_b TEXT NOT NULL,
  response_a TEXT NOT NULL,
  response_b TEXT NOT NULL,
  learning TEXT NOT NULL,
  thumbnail VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Add educational_decisions table to track user choices
CREATE TABLE IF NOT EXISTS educational_decisions (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  episode_id VARCHAR(255) NOT NULL,
  choice VARCHAR(1) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (episode_id) REFERENCES educational_episodes(id)
);

-- Insert Episode 1: O Algoritmo Perdido
INSERT INTO educational_episodes (
  id,
  title,
  concept,
  introduction,
  problem,
  decision_question,
  decision_option_a,
  decision_option_b,
  response_a,
  response_b,
  learning,
  thumbnail
) VALUES (
  'episode_1',
  'O Algoritmo Perdido',
  'Qualidade de Dados',
  'O Guia IA flutua no Centro de Comando Holográfico. As luzes neon da sala estão piscando em alerta amarelo. Algo no painel principal não está funcionando como deveria.',
  'A nave precisa traçar uma rota rápida para fugir de uma tempestade solar. O problema? Os sensores externos foram danificados. O sistema precisa escolher o melhor caminho de fuga, mas só possui o mapa estelar do ano passado (informações desatualizadas e incompletas).',
  'Você assume o controle manual do painel. O que você ordena?',
  'Acelerar usando apenas os dados antigos do mapa do ano passado.',
  'Pausar os motores por 2 minutos para escanear e coletar novos dados do espaço ao redor.',
  'A nave acelera, mas raspa na lateral de um asteroide que não estava no mapa antigo. Os escudos tremem, o sistema registra o erro, aprende a nova localização do asteroide e consegue escapar com danos leves.',
  'A nave fica parada e a tempestade chega assustadoramente perto. Porém, o escaneamento revela um atalho seguro recém-formado. A nave escapa intacta e com precisão total.',
  'Assim como a nossa nave, a Inteligência Artificial não consegue "adivinhar" o caminho se receber informações velhas ou incompletas. Na IA, chamamos isso de "Qualidade de Dados" — as boas decisões de uma máquina dependem diretamente das boas informações que entregamos a ela.',
  '/images/episode-1-thumbnail.png'
);
