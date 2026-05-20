# QA-Bot Agent
# Busca problemas comuns no código
# Uso: pwsh -File scripts/agents/qa-bot.ps1

Write-Host "🔍 QA Bot iniciando..." -ForegroundColor Yellow

$issues = @()

# 1. Verificar console.log leftover
$logs = Get-ChildItem -Path src -Include *.ts,*.tsx -Recurse | Select-String -Pattern "console\.log" -List
if ($logs) {
    $issues += "console.log encontrado em $($logs.Count) arquivos"
}

# 2. Verificar TODO comments
$todos = Get-ChildItem -Path src -Include *.ts,*.tsx -Recurse | Select-String -Pattern "TODO|FIXME|HACK" -List
if ($todos) {
    $issues += "TODO/FIXME encontrado: $($todos.Count) itens"
}

# 3. Verificar errores de TypeScript básicos (sem build)
$emptyCatch = Get-ChildItem -Path src -Include *.ts,*.tsx -Recurse | Select-String -Pattern "catch\s*\{\s*\}" -List
if ($emptyCatch) {
    $issues += "catch vazio encontrado em $($emptyCatch.Count) arquivos"
}

# 4. Verificar imports não usados
$anyType = Get-ChildItem -Path src -Include *.ts,*.tsx -Recurse | Select-String -Pattern "any" -List
if ($anyType) {
    $issues += "Tipo 'any' usado em $($anyType.Count) lugares (revisar)"
}

# Resultado
Write-Host ""
if ($issues.Count -eq 0) {
    Write-Host "✅ Nenhum problema encontrado!" -ForegroundColor Green
} else {
    Write-Host "⚠️ Problemas encontrados:" -ForegroundColor Yellow
    $issues | ForEach-Object { Write-Host "  - $_" }
}

Write-Host ""
Write-Host "Para verificar build: npm run build" -ForegroundColor Gray