import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const SERIES_DATA = [
  { title: 'AI Chronicles', category: 'Novidades', description: 'A jornada da inteligência artificial através dos tempos' },
  { title: 'Neural Dreams', category: 'Para Jovens', description: 'Explorando redes neurais e aprendizado profundo' },
  { title: 'Digital Horizons', category: 'Para Crianças', description: 'O futuro digital ao alcance de todos' },
  { title: 'Quantum Minds', category: 'Para Jovens', description: 'Computação quântica e seus mistérios' },
  { title: 'Cyber Legends', category: 'Novidades', description: 'Histórias de hackers e cibersegurança' },
  { title: 'Future Worlds', category: 'Para Crianças', description: 'Mundos futuristas criados pela IA' },
  { title: 'Tech Mysteries', category: 'Para Jovens', description: 'Desvendando os mistérios da tecnologia' },
  { title: 'Digital Hearts', category: 'Para Crianças', description: 'IA com coração: histórias tocantes' },
  { title: 'Code Warriors', category: 'Para Jovens', description: 'Programadores e suas aventuras épicas' },
  { title: 'Virtual Reality', category: 'Novidades', description: 'Imersão total em mundos virtuais' },
  { title: 'AI Adventures', category: 'Para Crianças', description: 'Aventuras incríveis com assistentes de IA' },
  { title: 'Smart Cities', category: 'Para Jovens', description: 'Cidades inteligentes do futuro' },
  { title: 'Data Odyssey', category: 'Novidades', description: 'Uma jornada pelos dados do universo' },
  { title: 'Robot Tales', category: 'Para Crianças', description: 'Contos de robôs amigos' },
  { title: 'Algorithm Quest', category: 'Para Jovens', description: 'A busca pelo algoritmo perfeito' },
  { title: 'AI Academy', category: 'Para Crianças', description: 'Escola de inteligência artificial' },
  { title: 'Cyber Space', category: 'Novidades', description: 'Aventuras no espaço cibernético' },
  { title: 'Machine Learning', category: 'Para Jovens', description: 'Máquinas que aprendem e evoluem' },
  { title: 'Digital Magic', category: 'Para Crianças', description: 'A magia da tecnologia digital' },
  { title: 'Tech Explorers', category: 'Novidades', description: 'Exploradores da tecnologia' },
  { title: 'AI Mysteries', category: 'Para Jovens', description: 'Mistérios da inteligência artificial' },
  { title: 'Future Lab', category: 'Para Crianças', description: 'Laboratório do futuro' },
  { title: 'Cyber Adventures', category: 'Novidades', description: 'Aventuras no mundo cibernético' },
  { title: 'Smart Minds', category: 'Para Jovens', description: 'Mentes brilhantes em ação' },
  { title: 'Digital Dreams', category: 'Para Crianças', description: 'Sonhos digitais realizados' },
  { title: 'AI Legends', category: 'Novidades', description: 'Lendas da inteligência artificial' },
  { title: 'Tech Titans', category: 'Para Jovens', description: 'Titãs da tecnologia' },
  { title: 'Virtual Worlds', category: 'Para Crianças', description: 'Mundos virtuais para explorar' },
  { title: 'Code Masters', category: 'Novidades', description: 'Mestres da programação' },
  { title: 'AI Frontiers', category: 'Para Jovens', description: 'Fronteiras da inteligência artificial' },
  { title: 'Digital Journey', category: 'Para Crianças', description: 'Jornada digital incrível' },
  { title: 'Cyber Heroes', category: 'Novidades', description: 'Heróis do mundo cibernético' },
  { title: 'Smart Systems', category: 'Para Jovens', description: 'Sistemas inteligentes em ação' },
  { title: 'Future Vision', category: 'Para Crianças', description: 'Visão do futuro' },
  { title: 'Tech Wonders', category: 'Novidades', description: 'Maravilhas da tecnologia' },
  { title: 'AI Innovations', category: 'Para Jovens', description: 'Inovações em IA' },
  { title: 'Digital Explorers', category: 'Para Crianças', description: 'Exploradores do mundo digital' },
  { title: 'Cyber Realm', category: 'Novidades', description: 'O reino cibernético' },
  { title: 'Smart Future', category: 'Para Jovens', description: 'Um futuro mais inteligente' },
  { title: 'Virtual Adventures', category: 'Para Crianças', description: 'Aventuras virtuais emocionantes' },
  { title: 'Code Universe', category: 'Novidades', description: 'O universo da programação' },
  { title: 'AI Wonders', category: 'Para Jovens', description: 'Maravilhas da IA' },
  { title: 'Digital Realm', category: 'Para Crianças', description: 'O reino digital' },
  { title: 'Tech Evolution', category: 'Novidades', description: 'Evolução da tecnologia' },
  { title: 'Smart Innovations', category: 'Para Jovens', description: 'Inovações inteligentes' },
  { title: 'Future Quest', category: 'Para Crianças', description: 'Busca pelo futuro' },
  { title: 'Cyber Innovations', category: 'Novidades', description: 'Inovações cibernéticas' },
  { title: 'AI Explorers', category: 'Para Jovens', description: 'Exploradores da IA' },
  { title: 'Digital Wonders', category: 'Para Crianças', description: 'Maravilhas digitais' },
];

async function seedDatabase() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);

  try {
    console.log('🌱 Iniciando seed do banco de dados...');
    console.log(`📊 Total de séries: ${SERIES_DATA.length}`);
    console.log('⏳ Isso pode levar alguns minutos...\n');

    let seriesCount = 0;
    let episodeCount = 0;

    for (const seriesData of SERIES_DATA) {
      // Inserir série
      const [seriesResult] = await connection.execute(
        'INSERT INTO series (title, description, category, rating, totalSeasons, totalEpisodes) VALUES (?, ?, ?, ?, ?, ?)',
        [seriesData.title, seriesData.description, seriesData.category, Math.random() * 5, 50, 500]
      );

      const seriesId = seriesResult.insertId;
      seriesCount++;

      // Inserir 50 temporadas com 10 episódios cada
      for (let season = 1; season <= 50; season++) {
        for (let episode = 1; episode <= 10; episode++) {
          const episodeNumber = (season - 1) * 10 + episode;
          const title = `${seriesData.title} - Temporada ${season}, Episódio ${episode}`;
          const description = `Episódio ${episode} da temporada ${season}: Uma aventura emocionante em ${seriesData.title}`;
          const duration = 20 + Math.floor(Math.random() * 20); // 20-40 minutos

          await connection.execute(
            'INSERT INTO episodes (seriesId, seasonNumber, episodeNumber, title, description, duration) VALUES (?, ?, ?, ?, ?, ?)',
            [seriesId, season, episode, title, description, duration]
          );

          episodeCount++;

          // Log de progresso
          if (episodeCount % 500 === 0) {
            console.log(`✅ ${episodeCount} episódios inseridos...`);
          }
        }
      }

      console.log(`✨ Série "${seriesData.title}" criada com 50 temporadas e 500 episódios`);
    }

    console.log('\n🎉 Seed concluído com sucesso!');
    console.log(`📊 Total de séries: ${seriesCount}`);
    console.log(`📺 Total de episódios: ${episodeCount}`);
    console.log(`💾 Banco de dados populado com sucesso!`);

  } catch (error) {
    console.error('❌ Erro ao fazer seed do banco de dados:', error);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

seedDatabase();
