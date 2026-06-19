import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://mente-ai.vercel.app";

export const metadata: Metadata = {
  title: "Não apenas use IA. Entenda-a. | MENTE.AI",
  description:
    "12 universos. 12 agentes de IA. Uma jornada cinematográfica para dominar a inteligência artificial. Comece grátis.",
  openGraph: {
    title: "MENTE.AI — Não apenas use IA. Entenda-a.",
    description:
      "12 universos. 12 agentes de IA. Uma jornada cinematográfica para dominar a inteligência artificial.",
    url: `${SITE_URL}/landing`,
    images: [
      {
        url: `${SITE_URL}/images/storyboard/landing-hero.jpg`,
        width: 1200,
        height: 630,
        alt: "MENTE.AI — Metaverso Educacional de IA",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MENTE.AI — Não apenas use IA. Entenda-a.",
    description:
      "12 universos. 12 agentes de IA. Uma jornada cinematográfica para dominar a inteligência artificial.",
    images: [`${SITE_URL}/images/storyboard/landing-hero.jpg`],
  },
};
