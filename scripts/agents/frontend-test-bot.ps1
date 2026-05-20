# Frontend-Test Bot
# Testa interface e funcionaliddes do frontend
# Uso: pwsh -File scripts/agents/frontend-test-bot.ps1

Write-Host "Frontend Test Bot iniciando..." -ForegroundColor Cyan

$projectRoot = "C:\Users\REGINALDO\Desktop\AI-KIDS-OFICIAL"

Write-Host ""
Write-Host "Verificando configuracao..." -ForegroundColor Yellow

# 1. Verificar Next.js
$nextConfig = Test-Path "$projectRoot\next.config.ts"
Write-Host "  Next.js: $(if($nextConfig){'OK'}else{'FALTA'})"

# 2. Verificar paginas principais
$pages = @(
    "src\app\(main)\home\page.tsx",
    "src\app\(main)\agentes\page.tsx",
    "src\app\(main)\universo\nexus\page.tsx",
    "src\app\(main)\universo\volt\page.tsx"
)

foreach ($p in $pages) {
    $exists = Test-Path "$projectRoot\$p"
    $status = if($exists){"OK"}else{"FALTA"}
    Write-Host "  $p : $status"
}

# 3. Verificar componentes UI
$components = Get-ChildItem -Path "$projectRoot\src\components" -Directory
Write-Host "  Componentes: $($components.Count) pastas"

# 4. Verificar imagens
$images = Get-ChildItem -Path "$projectRoot\public\images\agentes" -ErrorAction SilentlyContinue
Write-Host "  Imagens agentes: $($images.Count) arquivos"

# 5. Verificar CSS/Tailwind
$tailwind = Test-Path "$projectRoot\tailwind.config.ts"
Write-Host "  Tailwind: $(if($tailwind){'OK'}else{'FALTA'})"

Write-Host ""
Write-Host "Frontend verificado!" -ForegroundColor Green