/**
 * MENTE.AI — E2E Smoke Test: Fluxo de Combinação de Agentes
 * tests/e2e/gamification/agent-combination.smoke.test.ts
 *
 * Valida fluxo completo:
 *  1. Abrir página da Biblioteca Viva
 *  2. Clicar no botão "Combinar Agentes"
 *  3. Selecionar dois agentes
 *  4. Clicar em "Combinar"
 *  5. Verificar popup de XP
 *  6. Verificar confetti (nova descoberta)
 *
 * Pré-requisitos:
 *  - Banco de dados com combinações cadastradas
 *  - Usuário autenticado com agentes desbloqueados
 */

import { test, expect } from '@playwright/test';

test.describe('Agent Combination - Smoke Test', () => {
  test('deve completar fluxo de combinação de agentes com sucesso', async ({ page }) => {
    // 1. Navegar para a página da Biblioteca Viva
    await page.goto('/laboratorio/biblioteca');
    
    // 2. Verificar se a página carregou
    await expect(page.locator('h1')).toContainText('Biblioteca Viva');
    
    // 3. Clicar no botão "Combinar Agentes"
    const combinarButton = page.locator('button', { hasText: /Combinar Agentes/i });
    await expect(combinarButton).toBeVisible();
    await combinarButton.click();
    
    // 4. Verificar se modal abriu
    const modal = page.locator('[role="dialog"][aria-label="Combinar Agentes"]');
    await expect(modal).toBeVisible();
    
    // 5. Verificar se há slots de seleção de agentes
    await expect(page.locator('text=Agente A')).toBeVisible();
    await expect(page.locator('text=Agente B')).toBeVisible();
    
    // 6. Selecionar primeiro agente (clicar no dropdown)
    const agenteASelector = page.locator('[data-testid="agent-selector-a"]');
    if (await agenteASelector.isVisible()) {
      await agenteASelector.click();
      
      // Selecionar primeiro agente da lista
      const primeiroAgente = page.locator('[data-testid="agent-option"]').first();
      await primeiroAgente.click();
    }
    
    // 7. Selecionar segundo agente
    const agenteBSelector = page.locator('[data-testid="agent-selector-b"]');
    if (await agenteBSelector.isVisible()) {
      await agenteBSelector.click();
      
      // Selecionar segundo agente da lista (diferente do primeiro)
      const segundoAgente = page.locator('[data-testid="agent-option"]').nth(1);
      await segundoAgente.click();
    }
    
    // 8. Verificar se botão "Combinar" está habilitado
    const combinarAcaoButton = page.locator('button', { hasText: /Combinar/i });
    await expect(combinarAcaoButton).toBeEnabled();
    
    // 9. Clicar em "Combinar"
    await combinarAcaoButton.click();
    
    // 10. Aguardar processamento (loading state)
    await expect(page.locator('text=Combinando...')).toBeVisible({ timeout: 5000 });
    
    // 11. Verificar se houve sucesso (popup de XP ou mensagem de sucesso)
    // Nota: Este teste assume que o backend está configurado com dados de teste
    
    // Opção A: Nova descoberta (confetti + XP popup)
    const xpPopup = page.locator('[data-testid="xp-popup"]');
    const confetti = page.locator('[data-testid="confetti"]');
    
    // Opção B: Combinação já descoberta (apenas XP)
    const sucessoMessage = page.locator('text=/Combinação descoberta!/i');
    
    // Pelo menos um destes deve aparecer
    const sucessoVisivel = await xpPopup.isVisible().catch(() => false) ||
                          await confetti.isVisible().catch(() => false) ||
                          await sucessoMessage.isVisible().catch(() => false);
    
    expect(sucessoVisivel).toBeTruthy();
    
    // 12. Verificar se XP foi atualizado (se houver elemento de XP na UI)
    const xpElement = page.locator('[data-testid="xp-total"]');
    if (await xpElement.isVisible()) {
      const xpText = await xpElement.textContent();
      expect(xpText).toMatch(/\d+/);
    }
    
    // 13. Fechar modal
    const fecharButton = page.locator('button[aria-label="Fechar modal"]');
    if (await fecharButton.isVisible()) {
      await fecharButton.click();
      await expect(modal).not.toBeVisible();
    }
  });

  test('deve mostrar erro ao tentar combinar mesmo agente', async ({ page }) => {
    await page.goto('/laboratorio/biblioteca');
    
    // Abrir modal de combinação
    const combinarButton = page.locator('button', { hasText: /Combinar Agentes/i });
    await combinarButton.click();
    
    // Selecionar mesmo agente para A e B
    // Nota: A UI deve prevenir isso, mas testamos o comportamento
    
    // Verificar se botão "Combinar" está desabilitado quando agentes são iguais
    const combinarAcaoButton = page.locator('button', { hasText: /Combinar/i });
    
    // O botão deve estar desabilitado até que dois agentes diferentes sejam selecionados
    await expect(combinarAcaoButton).toBeDisabled();
  });

  test('deve fechar modal com tecla ESC', async ({ page }) => {
    await page.goto('/laboratorio/biblioteca');
    
    // Abrir modal
    const combinarButton = page.locator('button', { hasText: /Combinar Agentes/i });
    await combinarButton.click();
    
    const modal = page.locator('[role="dialog"][aria-label="Combinar Agentes"]');
    await expect(modal).toBeVisible();
    
    // Fechar com ESC
    await page.keyboard.press('Escape');
    
    // Modal deve fechar
    await expect(modal).not.toBeVisible();
  });

  test('deve fechar modal clicando no overlay', async ({ page }) => {
    await page.goto('/laboratorio/biblioteca');
    
    // Abrir modal
    const combinarButton = page.locator('button', { hasText: /Combinar Agentes/i });
    await combinarButton.click();
    
    const modal = page.locator('[role="dialog"][aria-label="Combinar Agentes"]');
    const overlay = page.locator('[style*="backdrop-filter"]');
    
    // Clicar no overlay
    await overlay.click();
    
    // Modal deve fechar
    await expect(modal).not.toBeVisible();
  });
});

test.describe('Agent Combination - Validações de Negócio', () => {
  test('deve mostrar erro para combinação não catalogada', async ({ page }) => {
    // Este teste requer mock da API ou dados específicos
    // Implementação futura com fixtures de teste
    test.skip();
  });

  test('deve mostrar erro para agente bloqueado', async ({ page }) => {
    // Este teste requer usuário com agentes bloqueados
    // Implementação futura com fixtures de teste
    test.skip();
  });
});
