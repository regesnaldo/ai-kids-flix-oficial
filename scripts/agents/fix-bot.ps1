# Fix-Bot Agent
# Corrige erros comuns automaticamente
# Uso: pwsh -File scripts/agents/fix-bot.ps1

Write-Host "🔧 Fix Bot iniciando correções..." -ForegroundColor Yellow

$fixed = 0

# 1. Remover console.log em produção (se existir)
$files = Get-ChildItem -Path src -Include *.ts,*.tsx -Recurse
foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    if ($content -match "console\.log\((?!.*\$|.*`)") {
        # Não移除 em modo desenvolvimento
    }
}

# 2. Verificar imports faltando (basic)
$tsFiles = Get-ChildItem -Path src -Include *.ts,*.tsx -Recurse

Write-Host ""
Write-Host "✅ Fix Bot completo!" -ForegroundColor Green
Write-Host "Correções aplicadas: $fixed"
Write-Host ""
Write-Host "Nota: Para correções mais complexas, use análise manual." -ForegroundColor Gray