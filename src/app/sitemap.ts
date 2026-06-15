import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const agents = ['nexus','volt','aurora','ethos','kaos','cipher','lyra','axiom','stratos','terra','prism','janus']
  
  const agentRoutes = agents.map(agent => ({
    url: `https://mente-ai.vercel.app/universo/${agent}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const seriesRoutes = agents.map(agent => ({
    url: `https://mente-ai.vercel.app/series/${agent}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  return [
    {
      url: 'https://mente-ai.vercel.app',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: 'https://mente-ai.vercel.app/home',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: 'https://mente-ai.vercel.app/explorar',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: 'https://mente-ai.vercel.app/certificado',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    ...agentRoutes,
    ...seriesRoutes,
  ]
}
