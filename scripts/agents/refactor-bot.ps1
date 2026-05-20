# Refactor-Bot Agent
# Identifica oportunidades de refatoração
# Uso: pwsh -File scripts/agents/refactor-bot.ps1

Write-Host "🔧 Refactor Bot analisando..." -ForegroundColor Yellow

$opportunities = @()

# 1. Verificar funções duplicadas
$duplicates = @{}

Get-ChildItem -Path src -Include *.ts,*.tsx -Recurse | ForEach-Object {
    $content = Get-Content $_.FullName
    $functions = [regex]::Matches($content, "function\s+(\w+)")
    foreach ($f in $functions) {
        $fn = $f.Groups[1].Value
        if ($duplicates.ContainsKey($fn)) {
            $opportunities += "Função '$fn' duplicada em $($_.Name)"
        } else {
            $duplicates[$fn] = $_.Name
        }
    }
}

# 2. Verificar estado similar (useState repetido)
$useStatePattern = Get-ChildItem -Path src -Include *.tsx -Recurse | Select-String -Pattern "useState<[^>]+>" -List

# 3. Verificar CSS inline repetido
$inlineStyles = Get-ChildItem -Path src -Include *.tsx -Recurse | Select-String -Pattern "style=\{\{" -List

# Resultado
Write-Host ""
if ($opportunities.Count -eq 0) {
    Write-Host "✅ Código limpo! Nenhuma refatoração necessária." -ForegroundColor Green
} else {
    Write-Host "💡 Oportunidades de refatoração:" -ForegroundColor Cyan
    $opportunities | Select-Object -First 5 | ForEach-Object { Write-Host "  - $_" }
    if ($opportunities.Count -gt 5) {
        Write-Host "  ... e mais $($opportunities.Count - 5) itens"
    }
}

Write-Host ""
Write-Host "💡 Dica: Para components duplicados, considerar criar em /components/ui/" -ForegroundColor Gray