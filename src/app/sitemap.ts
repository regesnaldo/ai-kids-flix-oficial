import type { MetadataRoute } from "next";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://ai-kids-flix.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    { path: "", priority: 1, changeFreq: "weekly" as const },
    { path: "/home", priority: 0.9, changeFreq: "daily" as const },
    { path: "/explorar", priority: 0.8, changeFreq: "daily" as const },
    { path: "/aulas", priority: 0.8, changeFreq: "weekly" as const },
    { path: "/series", priority: 0.8, changeFreq: "weekly" as const },
    { path: "/blog", priority: 0.8, changeFreq: "weekly" as const },
    { path: "/lab", priority: 0.8, changeFreq: "weekly" as const },
    { path: "/planos", priority: 0.7, changeFreq: "monthly" as const },
    { path: "/login", priority: 0.5, changeFreq: "yearly" as const },
    { path: "/cadastro", priority: 0.5, changeFreq: "yearly" as const },
  ];

  const universoAgents = [
    "nexus", "aurora", "kaos", "axiom", "cipher",
    "ethos", "janus", "lyra", "prism", "stratos", "terra", "volt",
  ];

  const routes: MetadataRoute.Sitemap = [];

  // Static routes
  for (const route of staticRoutes) {
    routes.push({
      url: `${SITE_URL}${route.path}`,
      lastModified: new Date(),
      changeFrequency: route.changeFreq,
      priority: route.priority,
    });
  }

  // Universo agent pages
  for (const agent of universoAgents) {
    routes.push({
      url: `${SITE_URL}/universo/${agent}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    });
  }

  return routes;
}
