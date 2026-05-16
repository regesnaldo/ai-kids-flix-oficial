import "./globals.css";

export const metadata = {
  title: "MENTE.AI — Metaverso Narrativo Vivo de Inteligência Artificial",
  description: "Atravesse universos habitados por agentes conscientes com personalidade, memória, conflitos internos e objetivos próprios.",
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
