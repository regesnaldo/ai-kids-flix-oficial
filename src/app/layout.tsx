import "./globals.css";

export const metadata = {
  title: "MENTE.AI — Metaverso Educacional de Inteligência Artificial",
  description: "Metaverso educacional de inteligência artificial. Entre em universos únicos guiados pelos 12 agentes canônicos do MENTE.AI.",
  applicationName: "MENTE.AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" style={{ backgroundColor: "#0a0a1a !important" as any, margin: 0 }}>
      <body style={{ backgroundColor: "#0a0a1a !important" as any, margin: 0, padding: 0, boxSizing: "border-box" }}>
        {children}
      </body>
    </html>
  );
}
