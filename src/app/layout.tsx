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
    <html lang="pt-BR" className="bg-[#0a0a1a] m-0">
      <body className="bg-[#0a0a1a] m-0 p-0 box-border">
        {children}
      </body>
    </html>
  );
}
