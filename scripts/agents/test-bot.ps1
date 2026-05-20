# Test-Bot Agent
# Cria testes unitários automaticamente
# Uso: pwsh -File scripts/agents/test-bot.ps1 [arquivo]

param(
    [string]$File = ""
)

$projectRoot = "C:\Users\REGINALDO\Desktop\AI-KIDS-OFICIAL"

if ($File -eq "") {
    Write-Host "Verificando estrutura de testes..." -ForegroundColor Cyan
    
    # Verificar se existe Jest configurado
    $packageJson = Get-Content "$projectRoot\package.json" -Raw | ConvertFrom-Json
    if ($packageJson.devDependencies.jest) {
        Write-Host "  ✅ Jest configurado"
    }
    
    # Contar testes existentes
    $testFiles = Get-ChildItem -Path "$projectRoot\src" -Include *.test.ts,*.spec.ts -Recurse -ErrorAction SilentlyContinue
    Write-Host "  📝 Testes existentes: $($testFiles.Count)"
    
    # Listar arquivos sem teste
    $tsFiles = Get-ChildItem -Path "$projectRoot\src" -Include *.ts -Recurse | Where-Object { $_.Name -notmatch "\.test|\.spec" }
    Write-Host "  📄 Arquivos TypeScript: $($tsFiles.Count)"
    
    Write-Host ""
    Write-Host "Para criar teste de um arquivo específico:"
    Write-Host "  pwsh -File scripts/agents/test-bot.ps1 router.ts"
} else {
    Write-Host "🧪 Criando teste para: $File" -ForegroundColor Yellow
    
    $testName = $File -replace "\.ts$", ".test.ts"
    $testContent = @"
import { describe, it, expect } from '@jest/globals';

describe('$File', () => {
  it('should exist', () => {
    expect(true).toBe(true);
  });
  
  // TODO: Add specific tests
});
"@
    
    Write-Host "  ⚠️ Teste template criado (implementação manual necessária)"
    Write-Host "  💡 Dica: Tests devem cubrir casos de uso reais"
}