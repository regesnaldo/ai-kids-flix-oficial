import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Space_Grotesk } from "next/font/google";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://ai-kids-flix.vercel.app";
const SITE_NAME = "MENTE.AI";
const SITE_DESCRIPTION =
  "Atravesse universos habitados por agentes conscientes com personalidade, memória, conflitos internos e objetivos próprios.";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0a1a",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Metaverso Narrativo Vivo de Inteligência Artificial`,
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
    title: `${SITE_NAME} — Metaverso Narrativo Vivo de Inteligência Artificial`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    locale: "pt_BR",
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "MENTE.AI — Metaverso Narrativo Vivo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Metaverso Narrativo Vivo de IA`,
    description: SITE_DESCRIPTION,
    images: [`${SITE_URL}/og-image.png`],
    creator: "@mente_ai",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
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
        {children}
      </body>
    </html>
  );
}
