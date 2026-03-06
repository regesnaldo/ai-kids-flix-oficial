// Estrutura de dados para 50 temporadas × 10 episódios

export interface Episode {
  id: string;
  number: number;
  title: string;
  description: string;
  duration: string;
  thumbnail: string;
}

export interface Season {
  id: string;
  seasonNumber: number;
  title: string;
  year: number;
  episodes: Episode[];
  poster: string;
}

export interface Series {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  rating: number;
  year: number;
  genre: string;
  ageRating: string;
  totalEpisodes: number;
  seasons: Season[];
  heroImage: string;
  poster: string;
}

// Imagens de IA futuristas geradas
const AI_IMAGES = [
  "https://private-us-east-1.manuscdn.com/sessionFile/m7YclxBokDFJE7odLUUuHA/sandbox/W0I160N6b9ZmBck6IUHIl9-img-1_1770158872000_na1fn_YWktbmV1cmFsLW5ldHdvcms.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvbTdZY2x4Qm9rREZKRTdvZExVVXVIQS9zYW5kYm94L1cwSTE2ME42YjlabUJjazZJVUhJbDktaW1nLTFfMTc3MDE1ODg3MjAwMF9uYTFmbl9ZV2t0Ym1WMWNtRnNMVzVsZEhkdmNtcy5wbmc~eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsd18xOTIwLGhfMTkyMC9mb3JtYXQsd2VicC9xdWFsaXR5LHFfODAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=EeO4HowlqS1f6TlTAUs7Vvak1e2-y~NX5~qa0kp8GfkM2ngtZSixiTd1SjO9qv-gp0QQtH7jnQEmfzbCpyGb0Kr1il6yP7629ySNQlz8hlPFjpayi5DIT~XZWLdbvX2VtYs2L4ewNM4ysf5ZUiSDfLrKcmntdzCDrWAr9SJ~1RhC3EdEDvjnayugiPgMn~~Qs1ZWdZMEhX~L2GxU~kF0t~-9uRwqK1KJU9P1y1z0vDtxXfqxhtEalKHGBHmICL69uL8DevCDzzEDOQCOUGFmsXsN6oJBDJXiIXZUl9RK3wOuforQvTjXj8rHjOvxtFoMQhRfKwMmRjWfiEzYM6J8NA__",
  "https://private-us-east-1.manuscdn.com/sessionFile/m7YclxBokDFJE7odLUUuHA/sandbox/W0I160N6b9ZmBck6IUHIl9-img-2_1770158853000_na1fn_YWktZGF0YS1mbG93.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvbTdZY2x4Qm9rREZKRTdvZExVVXVIQS9zYW5kYm94L1cwSTE2ME42YjlabUJjazZJVUhJbDktaW1nLTJfMTc3MDE1ODg1MzAwMF9uYTFmbl9ZV2t0WkdGMFlTMW1iRzkzLnBuZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=TAk~bKBiE0eEd4XfpJt93YMUEFKERnDaHKMnszGVsUpZC3wLP5mjriygWV4QsGxw2QWD29DgkZpYOrNJC9ntfGod3w9nopwpMVTzB4-K4-aAx1yL0OpsU5a9p3kfK7oqpCZ21Z47soJiS5xl5d39zK9rMNOzfr0pmFOAEpTR-R3-FXG7zoiRcUY1rFTKnwjDhLyEL-AOYiJ3SaPGSLJh1x2oGqeu2nAh5YV0qomnUgT1ZmG2~InMsA2dsOYlN4uy8nFcjDU~u5Msrk3gwix06JzJxYycWmOriVsyUuMnpd15fzWSAvTzmf8IqPFEi~g38JsL~Ldhr9PqVbxG1mzLkQ__",
  "https://private-us-east-1.manuscdn.com/sessionFile/m7YclxBokDFJE7odLUUuHA/sandbox/W0I160N6b9ZmBck6IUHIl9-img-3_1770158870000_na1fn_YWktZGlnaXRhbC1taW5k.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvbTdZY2x4Qm9rREZKRTdvZExVVXVIQS9zYW5kYm94L1cwSTE2ME42YjlabUJjazZJVUhJbDktaW1nLTNfMTc3MDE1ODg3MDAwMF9uYTFmbl9ZV2t0WkdsbmFYUmhiQzF0YVc1ay5wbmc~eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsd18xOTIwLGhfMTkyMC9mb3JtYXQsd2VicC9xdWFsaXR5LHFfODAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=PblwHmoTbLdXGWjxzAmvjcPT14exr4slR1Ldus3QI7UBLUqsO3OQkuYEcDwHzv1jcOh98-adt4WEozxIFdkoV96FZooqaiAjElXU7FFfk6~cM8tMqdNVsKTGSJCbFHbaPgfdY90s90p4mcSqh62D8dCRggtVWXMbgDgJmG9bTTk2wPRltTfeRydIwK6IwUo0sVlUIIComEnyvCFhajZfpppfX6mpg3rE3WcHOB1u-KrZ9Pyij6RiaaAndjGs08KcmN8KPEExJ2VdwJzcB5y3PUwW67gB8Qs4uPho28mjLUJt~nFQLbYkmGK3JiyJGhMDy4XZF8p~4KhiVd99BfMhjw__",
  "https://private-us-east-1.manuscdn.com/sessionFile/m7YclxBokDFJE7odLUUuHA/sandbox/W0I160N6b9ZmBck6IUHIl9-img-4_1770158862000_na1fn_YWktcXVhbnR1bS1jb21wdXRpbmc.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvbTdZY2x4Qm9rREZKRTdvZExVVXVIQS9zYW5kYm94L1cwSTE2ME42YjlabUJjazZJVUhJbDktaW1nLTRfMTc3MDE1ODg2MjAwMF9uYTFmbl9ZV2t0Y1hWaGJuUjFiUzFqYjIxd2RYUnBibWMucG5nP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=NVHftJRHDojSFZBXSIE5uBXuJU94wwLhdcJKcKNf5LIr0BRE2i9AnkpQ6tQMN~Aoy~MmEuNrQc2EMcQZVzHlUZs8H3u47VPz4SPe7vCE4DOjZjfILzK2eZWtMqr3TWjp~OZlqjQRHgmlkZSQwuZ4PKeRiUGlWSMYMlySZrQwm~7wRshkyBWTH7xhkvSjfq5zABKGGZHIg-o2hXN2U1ad4F4bS~WJfNR4qBuUhpZpw8XdCsNtrONBn9Mdx23eFxuxMFoztJEhOoGhFqs1jf00h72fpyy8PYPZFr1zjrxEKL5ol5R55kLVKEXTR7iMrliBNOE1-KtRxpG8GRz4O1T5tg__",
  "https://private-us-east-1.manuscdn.com/sessionFile/m7YclxBokDFJE7odLUUuHA/sandbox/W0I160N6b9ZmBck6IUHIl9-img-5_1770158866000_na1fn_YWktZnV0dXJlLXRlY2g.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvbTdZY2x4Qm9rREZKRTdvZExVVXVIQS9zYW5kYm94L1cwSTE2ME42YjlabUJjazZJVUhJbDktaW1nLTVfMTc3MDE1ODg2NjAwMF9uYTFmbl9ZV2t0Wm5WMGRYSmxMWFJsWTJnLnBuZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=bx4jtEfE-D3WOwyqNuXx9xJio5zCjDVcVivNK0f4ComrVUpZ5Ujo5ppbnf5~MkXFgncCfcWk9g0BpLu2aK-eFTYroejT5bkHBu77wyixBDpOh0efQ3U~f3LQ8QOJRYPyJyYoM3CzsBI3bdYiLNXrlvujMvZshymxr9aF3rRjKjD5BNfO8J2pp3z7~O4uJJhrfaXhZqrmz~tFifDqSAuXzm8PW5H6UhE~Yt1G40DuEt0JbZKrFze-MdrzBZtH~mkTPXgZOgyUGgqJY6xaLB5z-dIwEgKZmPTOrBeSYH7P6ySO07jUfkiVNbJPjWokvO0bBn4tA3wIZHipNpRjKZ2A2g__",
];

// Imagem de fundo para Hero (cidade futurista)
const HERO_IMAGE = "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=1920&q=80";

// Nomes das séries sobre IA
const SERIES_NAMES = [
  "Mundo Mágico da Aprendizagem",
  "Aventuras do Alfabeto",
  "Robôs e Amigos",
  "Números Divertidos",
  "Ciência para Pequenos",
  "Exploradores do Espaço",
  "Animais Fantásticos",
  "Histórias do Futuro",
  "Música e Movimento",
  "Arte Digital",
];

// Função para gerar episódios de uma temporada
function generateEpisodes(seasonNumber: number, seriesTitle: string): Episode[] {
  const episodes: Episode[] = [];
  for (let i = 1; i <= 10; i++) {
    episodes.push({
      id: `ep-${seasonNumber}-${i}`,
      number: i,
      title: `Episódio ${i}: ${seriesTitle} - Parte ${i}`,
      description: `Neste episódio, você vai aprender conceitos fundamentais sobre ${seriesTitle}. Uma jornada incrível pelo conhecimento!`,
      duration: `${15 + Math.floor(Math.random() * 10)}:00`,
      thumbnail: AI_IMAGES[i % AI_IMAGES.length],
    });
  }
  return episodes;
}

// Função para gerar temporadas de uma série
function generateSeasons(seriesTitle: string): Season[] {
  const seasons: Season[] = [];
  for (let i = 1; i <= 50; i++) {
    seasons.push({
      id: `season-${i}`,
      seasonNumber: i,
      title: `Temporada ${i}`,
      year: 2020 + Math.floor(i / 10),
      episodes: generateEpisodes(i, seriesTitle),
      poster: AI_IMAGES[(i - 1) % AI_IMAGES.length],
    });
  }
  return seasons;
}

// Gerar todas as séries
export const NETFLIX_DATA: Series[] = SERIES_NAMES.map((name, index) => ({
  id: `series-${index + 1}`,
  title: name,
  description: `Descubra, brinque e aprenda com aventuras incríveis!`,
  longDescription: `Uma jornada colorida pelo conhecimento, onde cada episódio é uma nova descoberta cheia de diversão e magia. Explore o mundo de ${name} com personagens cativantes e histórias envolventes.`,
  rating: 4.5 + Math.random() * 0.5,
  year: 2020,
  genre: "Aventura",
  ageRating: "L",
  totalEpisodes: 500, // 50 temporadas × 10 episódios
  seasons: generateSeasons(name),
  heroImage: HERO_IMAGE,
  poster: AI_IMAGES[index % AI_IMAGES.length],
}));

// Série em destaque
export const FEATURED_SERIES = NETFLIX_DATA[0];

// Categorias de conteúdo
export const CATEGORIES = [
  { id: "continue", title: "Continuar Assistindo", series: NETFLIX_DATA.slice(0, 5) },
  { id: "trending", title: "Em Alta", series: NETFLIX_DATA.slice(0, 10) },
  { id: "kids", title: "Para Crianças", series: NETFLIX_DATA.slice(0, 5) },
  { id: "teens", title: "Para Jovens", series: NETFLIX_DATA.slice(5, 10) },
  { id: "new", title: "Novidades", series: NETFLIX_DATA.slice(0, 10) },
];

// Função para obter série por ID
export function getSeriesById(id: string): Series | undefined {
  return NETFLIX_DATA.find((s) => s.id === id);
}

// Função para obter temporada por número
export function getSeasonByNumber(series: Series, seasonNumber: number): Season | undefined {
  return series.seasons.find((s) => s.seasonNumber === seasonNumber);
}

// Função para obter episódio por número
export function getEpisodeByNumber(season: Season, episodeNumber: number): Episode | undefined {
  return season.episodes.find((e) => e.number === episodeNumber);
}
