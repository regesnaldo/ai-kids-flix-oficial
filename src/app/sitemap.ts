import type { MetadataRoute } from "next";

const SITE_URL = "https://mente-ai.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const agents = [
    "nexus", "volt", "aurora", "kaos", "cipher",
    "ethos", "lyra", "axiom", "stratos", "terra", "prism", "janus",
  ];

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/landing`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/series`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/explorar`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/cadastro`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
  ];

  const agentRoutes: MetadataRoute.Sitemap = agents.map((id) => ({
    url: `${SITE_URL}/series/${id}/1`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const episodeRoutes: MetadataRoute.Sitemap = agents.flatMap((id) =>
    [1, 2, 3, 4, 5].map((ep) => ({
      url: `${SITE_URL}/series/${id}/1/${ep}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    }))
  );

  return [...staticRoutes, ...agentRoutes, ...episodeRoutes];
}
