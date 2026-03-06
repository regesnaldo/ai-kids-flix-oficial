import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Zap, BookOpen, Lightbulb } from "lucide-react";
// import { MODULES_CONTENT } from "@/lib/modules-content";

const MODULES_CONTENT: any = {};

/**
 * Design Philosophy: Cyberpunk Neon Playful
 * - Página de detalhe do módulo com conteúdo educativo
 * - Neon glow effects, animações fluidas
 * - Navegação entre módulos
 */

export default function ModuleDetail() {
  const { id } = useParams<{ id: string }>();
  const moduleId = parseInt(id || "1");
  const module = MODULES_CONTENT[moduleId];

  if (!module) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Módulo não encontrado</h1>
          <Link href="/">
            <Button className="bg-cyan-500 hover:bg-cyan-600">Voltar para Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const colorMap = {
    cyan: {
      border: "border-cyan-500",
      text: "text-cyan-400",
      bg: "bg-cyan-500/10",
      glow: "neon-glow",
      button: "bg-cyan-500 hover:bg-cyan-600",
    },
    magenta: {
      border: "border-magenta-500",
      text: "text-magenta-400",
      bg: "bg-magenta-500/10",
      glow: "neon-glow-magenta",
      button: "bg-magenta-500 hover:bg-magenta-600",
    },
    yellow: {
      border: "border-yellow-500",
      text: "text-yellow-400",
      bg: "bg-yellow-500/10",
      glow: "neon-glow-yellow",
      button: "bg-yellow-500 hover:bg-yellow-600",
    },
  };

  const colors = colorMap[module.color as keyof typeof colorMap] || colorMap.cyan;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" className="text-foreground hover:text-cyan-400">
              <ChevronLeft className="w-5 h-5 mr-2" />
              Voltar
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-center flex-1">{module.title}</h1>
          <div className="w-20" />
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className={`absolute top-20 left-10 w-72 h-72 rounded-full mix-blend-screen blur-3xl animate-pulse ${colors.bg}`} />
        </div>

        <div className="container max-w-4xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left Content */}
            <div className="fade-in-up">
              <div className={`inline-block px-4 py-2 rounded-full border ${colors.border} mb-4`}>
                <p className={`text-sm font-bold ${colors.text}`}>Módulo {module.id} de 15</p>
              </div>
              <h1 className="text-5xl font-bold mb-4">{module.title}</h1>
              <p className={`text-2xl ${colors.text} mb-6`}>{module.subtitle}</p>
              <p className="text-lg text-gray-300 mb-8 leading-relaxed">{module.description}</p>
            </div>

            {/* Right Image */}
            <div className="relative h-96 flex items-center justify-center">
              <img
                src={module.image}
                alt={module.title}
                className={`w-full h-full object-cover rounded-lg ${colors.glow} float`}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="py-16 px-4 border-t border-border">
        <div className="container max-w-4xl mx-auto">
          <div className="space-y-12">
            {module.sections?.map((section: any, index: number) => (
              <div key={index} className={`border-l-4 ${colors.border} pl-6 py-4`}>
                <h2 className="text-3xl font-bold mb-4">{section.title}</h2>
                <p className="text-lg text-gray-300 leading-relaxed">{section.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Points */}
      <section className={`py-16 px-4 ${colors.bg} border-t border-b border-border`}>
        <div className="container max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Lightbulb className={`w-8 h-8 ${colors.text}`} />
            <h2 className="text-3xl font-bold">Pontos-Chave</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {module.keyPoints?.map((point: any, index: number) => (
              <div key={index} className={`flex items-start gap-3 p-4 rounded-lg border ${colors.border} bg-background/50`}>
                <div className={`w-6 h-6 rounded-full ${colors.bg} flex items-center justify-center flex-shrink-0 mt-1`}>
                  <div className={`w-2 h-2 rounded-full ${colors.text}`} />
                </div>
                <p className="text-gray-300">{point}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Activities */}
      <section className="py-16 px-4 border-t border-border">
        <div className="container max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Zap className={`w-8 h-8 ${colors.text}`} />
            <h2 className="text-3xl font-bold">Atividades Práticas</h2>
          </div>
          <div className="space-y-4">
            {module.activities?.map((activity: any, index: number) => (
              <div
                key={index}
                className={`p-6 rounded-lg border-2 ${colors.border} bg-background/50 hover:bg-background transition-colors duration-300`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-8 h-8 rounded-full ${colors.bg} flex items-center justify-center flex-shrink-0 font-bold ${colors.text}`}>
                    {index + 1}
                  </div>
                  <p className="text-lg text-gray-300">{activity}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Navigation Buttons */}
      <section className="py-16 px-4 border-t border-border">
        <div className="container max-w-4xl mx-auto">
          <div className="flex items-center justify-between gap-4">
            {module.previousModule ? (
              <Link href={`/modulo/${module.previousModule}`}>
                <Button variant="outline" className={`border-${colors.border} text-foreground hover:bg-${colors.bg}`}>
                  <ChevronLeft className="w-5 h-5 mr-2" />
                  Módulo Anterior
                </Button>
              </Link>
            ) : (
              <div />
            )}

            <Link href="/">
              <Button variant="ghost" className="text-foreground hover:text-cyan-400">
                <BookOpen className="w-5 h-5 mr-2" />
                Ver Todos os Módulos
              </Button>
            </Link>

            {module.nextModule ? (
              <Link href={`/modulo/${module.nextModule}`}>
                <Button className={colors.button}>
                  Próximo Módulo
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            ) : (
              <div />
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border bg-background/50">
        <div className="container max-w-4xl mx-auto text-center">
          <p className="text-gray-400 mb-4">
            Você completou o módulo <strong>{module.id}</strong> de <strong>15</strong>
          </p>
          <div className="w-full bg-border rounded-full h-2 mb-4">
            <div
              className={`h-full rounded-full ${colors.bg} transition-all duration-300`}
              style={{ width: `${(module.id / 15) * 100}%` }}
            />
          </div>
          <p className="text-sm text-gray-500">Progresso: {Math.round((module.id / 15) * 100)}%</p>
        </div>
      </footer>
    </div>
  );
}
