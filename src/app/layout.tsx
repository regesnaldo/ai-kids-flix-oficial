import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Space_Grotesk } from "next/font/google";
import GamificationWrapper from "@/components/gamification/GamificationWrapper";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://mente-ai.vercel.app";
const SITE_NAME = "MENTE.AI";
const SITE_DESCRIPTION =
  "MENTE.AI — O metaverso educacional de inteligência artificial. 12 universos, 120 episódios, aprendizado gamificado.";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0a1a",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Metaverso Educacional de IA`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "inteligência artificial",
    "IA para crianças",
    "educação em IA",
    "agentes de IA",
    "metaverso narrativo",
    "machine learning",
    "deep learning",
    "redes neurais",
    "aulas de IA",
    "metaverso educacional",
    "aprendizado gamificado",
  ],
  authors: [{ name: "MENTE.AI" }],
  creator: "MENTE.AI",
  publisher: "MENTE.AI",
  formatDetection: { telephone: false },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Metaverso Educacional de IA`,
    description: "Aprenda inteligência artificial com 12 agentes únicos em um metaverso gamificado. 120 episódios, LOGOS gate, certificado de conclusão.",
    url: SITE_URL,
    locale: "pt_BR",
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
    title: `${SITE_NAME} — Metaverso Educacional de IA`,
    description: "12 universos de IA, 120 episódios gamificados. Comece sua jornada agora.",
    images: [`${SITE_URL}/images/storyboard/landing-hero.jpg`],
    creator: "@mente_ai",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
  },
  other: {
    "og:image": `${SITE_URL}/images/storyboard/landing-hero.jpg`,
    "og:url": SITE_URL,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${spaceGrotesk.variable} m-0`} style={{ backgroundColor: "var(--cyber-black)" }}>
      <body className="m-0 p-0 box-border" style={{ backgroundColor: "var(--cyber-black)", color: "white", fontFamily: "var(--font-display)" }}>
        <GamificationWrapper>{children}</GamificationWrapper>
      </body>
    </html>
  );
}
