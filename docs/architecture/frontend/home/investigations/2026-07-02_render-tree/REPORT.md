# REPORT — Investigação da Home Route (v2 — adendo)

- **Data:** 2026-07-02
- **Profundidade máxima atingida:** 3 níveis
- **Componentes analisados (total):** 29
- **Componentes na tabela (total):** 27
- **Componentes analisados mas não tabulados:** 2 (OasisProvider e SessionProvider — lidos para rastrear a cadeia de context providers; consolidados como imports diretos de MainLayout na v2 da tabela)
- **Limite de profundidade atingido:** Não
- **Limite de expansão atingido:** Não
- **Ambiguidades encontradas:** Não — todas as classificações resolvidas
- **Correções do adendo:**
  1. CognitiveGPS: confirmado Content. Evidência: `<span>` com texto literal (`{currentLocation}`, labels de rota)
  2. LogosOracle: confirmado Content. Evidência: `<h1>` ("LOGOS"), `<p>` ("Guardião do Conhecimento"), múltiplos `<span>` com texto literal. Renderização condicional (`logosActive` → return null)
  3. Providers: não existe como componente agregador. MainLayout importa os 3 providers diretamente. Tabela corrigida para listar nomes explícitos
  4. Coluna "Evidência (JSX)" adicionada permanentemente à tabela
- **Necessita Gate 0 adicional:** Não
