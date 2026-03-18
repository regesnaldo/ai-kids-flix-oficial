## 🧠 Matriz de Impacto — MENTE.AI 
 
 ### 📌 O que está sendo alterado: 
 <!-- Descreva em 1 frase clara --> 
 - 
 
 ### 🏗️ Sistemas Impactados: 
 <!-- Marque todos que se aplicam --> 
 -  [ ] FLIX (streaming/interface) 
 -  [ ] AGENTES (canon/120 agentes) 
 -  [ ] LABORATÓRIO (experimentos) 
 -  [ ] GAMIFICAÇÃO (badges/conquistas) 
 -  [ ] CORE (shared/utilitários) 
 -  [ ] INFRA (build/deploy) 
 
 ### ✅ Checklist de Prevenção (obrigatório): 
 - [ ] Execute: `npm run arch:full`  — mapas atualizados 
 - [ ] Execute: `npm run arch:validate`  — zero ciclos 
 - [ ] Execute: `npx tsc --noEmit`  — TypeScript limpo 
 - [ ] Teste local: `npm run dev`  + verificação manual 
 -  [ ] Verifiquei impacto em: ___ (listar módulos) 
 
 ### 🔮 Riscos Antecipados: 
 | Cenário | Probabilidade | Impacto | Mitigação | 
 |---------|--------------|---------|-----------| 
 | (ex: Quebra de tipo Agent) | Alta/Média/Baixa | Crítico/Alto/Médio | (sua ação) | 
 
 ### 📎 Evidências: 
 -  [ ] Screenshot do teste local 
 -  [ ] Mapa arquitetural atualizado (se estrutura mudou) 
 - [ ] Log do `arch:validate`  (colar output) 
 
 ### 👥 Revisão Cruzada: 
 -  [ ] Solicitei review de dev que trabalhou neste módulo nos últimos 30 dias 
 -  [ ] Tag no canal #arquitetura: @dev1 @dev2 
 
 --- 
 ⚠️ **PRs sem Matriz de Impacto preenchida serão automaticamente rejeitados.** 
