# 🛡️ Protocolo de Comunicação — Modo Antecipado 
 
 ## Regras de Ouro (obrigatórias) 
 
 ### ANTES de iniciar qualquer task: 
 1. **Mapear:** Execute `npm run arch:heatmap`  — identifique hot spots 
 2. **Questionar:**  Preencha a Matriz de Impacto no PR template 
 3. **Validar:** Execute `npm run arch:validate`  — bloqueie se houver ciclos 
 4. **Comunicar:**  Poste no canal #arquitetura: "Vou alterar [X]. Alguém vê problema?" 
 
 ### ANTES de commitar: 
 1. **TypeScript:** `npx tsc --noEmit`  → zero erros 
 2. **Circular:** `npm run arch:validate`  → zero ciclos 
 3. **Build:** `npm run build`  → sucesso 
 4. **Teste:**  Verificação manual na rota afetada 
 
 ### SE detectar erro em código existente: 
 1. **NÃO corrija silenciosamente**  — crie task documentada 
 2. **Registre**  no Diário de Decisões 
 3. **Comunique**  no daily: "Encontrei [X] em [Y]. Sugiro [Z]." 
 
 ### SE task envolver `src/canon/` ou `src/cognitive/`: 
 - **OBRIGATÓRIO:**  2 aprovações de devs seniores 
 - **OBRIGATÓRIO:**  Teste em ambiente de staging 
 - **OBRIGATÓRIO:**  Rollback plan documentado 
 
 ## Canais de Comunicação 
 
 | Canal | Uso | Frequência | 
 |-------|-----|------------| 
 | #arquitetura | Dúvidas de impacto cruzado | Real-time | 
 | #dev | Updates técnicos | Daily | 
 | #alertas | Falhas de validação | Automático | 
 
 ## Penalidades (sim, existem) 
 
 | Falta | Consequência | 
 |-------|--------------| 
 | PR sem Matriz de Impacto | Rejeição automática | 
 | Commit com dependência circular | Revert imediato + 1:1 | 
 | Alterar core sem aprovação | Bloqueio de permissões | 
 | Não comunicar breaking change | Documentação no Diário + explicação no demo | 
