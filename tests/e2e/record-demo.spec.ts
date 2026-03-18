import { test } from '@playwright/test';

test('Gravar demo da MENTE.AI', async ({ page }) => {
  // Configurar viewport para gravação HD
  await page.setViewportSize({ width: 1280, height: 720 });

  // Iniciar gravação (Playwright faz isso via config se configurado, ou podemos fazer manual)
  await page.goto('/onboarding');
  
  // 1. Navegar pelo onboarding
  for (let i = 0; i < 3; i++) {
    await page.waitForTimeout(1000);
    await page.click('text=Continuar');
  }
  await page.waitForTimeout(1000);
  await page.click('text=Começar Jornada');

  // 2. Acessar Laboratório
  await page.waitForURL('**/laboratorio/simulador');
  await page.waitForTimeout(2000);

  // 3. Demonstrar features
  const input = page.getByPlaceholder(/Expresse seu estado/);
  await input.fill('Estou sentindo uma profunda conexão com o Logos e a sabedoria universal!');
  await page.waitForTimeout(1000);
  await page.click('text=Conectar Consciência', { force: true });
  await page.waitForTimeout(3000);

  // 4. Ativar áudio
  // Procura pelo botão de áudio por título ou ícone
  const audioBtn = page.locator('button').filter({ hasText: /🔈|🔊/ }).first();
  if (await audioBtn.isVisible()) {
    await audioBtn.click();
  }
  await page.waitForTimeout(2000);

  // 5. Ativar Modo Zen
  await page.keyboard.press('z');
  await page.waitForTimeout(3000);
  await page.keyboard.press('z');
  await page.waitForTimeout(1000);

  // 6. Ajustar velocidade (se houver slider)
  const slider = page.locator('input[type="range"]').first();
  if (await slider.isVisible()) {
    await slider.evaluate((el) => {
      (el as HTMLInputElement).value = '1.5';
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    });
  }
  await page.waitForTimeout(2000);

  console.log('✅ Demo simulada com sucesso!');
  console.log('📹 Se o Playwright estiver configurado para gravar, o vídeo estará em test-results/');
});
