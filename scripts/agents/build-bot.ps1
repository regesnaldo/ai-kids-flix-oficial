# Build-Bot Agent
# Monitora e verifica build
# Uso: pwsh -File scripts/agents/build-bot.ps1

Write-Host "⚙️ Build Bot verificando..." -ForegroundColor Cyan

$projectRoot = "C:\Users\REGINALDO\Desktop\AI-KIDS-OFICIAL"

# Verificar package.json
$packageJson = Get-Content "$projectRoot\package.json" -Raw | ConvertFrom-Json
Write-Host "  📦 Projeto: $($packageJson.name) v$($packageJson.version)"

# Verificar dependências
$deps = $packageJson.dependencies
Write-Host "  📚 Dependências: $($deps.Count)"

# Verificar scripts disponíveis
Write-Host "  📜 Scripts:"
$packageJson.scripts | Get-Member -MemberType NoteProperty | ForEach-Object {
    Write-Host "     - $($_.Name): $($packageJson.scripts.($_.Name))"
}

# Contar rotas
$apiRoutes = (Get-ChildItem -Path "$projectRoot\src\app\api" -Directory -Recurse -ErrorAction SilentlyContinue).Count
$pages = (Get-ChildItem -Path "$projectRoot\src\app" -Include page.tsx -Recurse).Count
Write-Host "  🌐 Rotas API: $apiRoutes"
Write-Host "  📄 Páginas: $pages"

Write-Host ""
Write-Host "✅ Build Bot completo!" -ForegroundColor Green
Write-Host "Para rodar build: npm run build" -ForegroundColor Gray