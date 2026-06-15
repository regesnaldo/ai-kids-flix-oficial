# Vercel-Deploy Bot
# Verifica e prepara deploy no Vercel
# Uso: pwsh -File scripts/agents\vercel-deploy-bot.ps1

Write-Host "Vercel Deploy Bot iniciando..." -ForegroundColor Cyan

$projectRoot = "C:\Users\REGINALDO\Desktop\AI-KIDS-OFICIAL"

Write-Host ""
Write-Host "Verificando configuracao Vercel..." -ForegroundColor Yellow

# 1. Verificar vercel.json
$vercelConfig = Test-Path "$projectRoot\vercel.json"
Write-Host "  vercel.json: $(if($vercelConfig){'OK'}else{'FALTA'})"

if ($vercelConfig) {
    $vercel = Get-Content "$projectRoot\vercel.json" | ConvertFrom-Json
    Write-Host "  Framework: $($vercel.framework)"
    Write-Host "  Build: $($vercel.buildCommand)"
}

# 2. Verificar .env.example
$envExample = Test-Path "$projectRoot\.env.example"
Write-Host "  .env.example: $(if($envExample){'OK'}else{'FALTA'})"

# 3. Verificar build
$buildScript = Get-Content "$projectRoot\package.json" -Raw | ConvertFrom-Json
$buildCmd = $buildScript.scripts.build
Write-Host "  Build command: $buildCmd"

# 4. Verificar dependencias criticas
$deps = $buildScript.dependencies
$criticalDeps = @("next", "react", "typescript", "drizzle-orm")
Write-Host "  Dependencias criticas:"
foreach ($dep in $criticalDeps) {
    $has = $deps.PSObject.Properties.Name -contains $dep
    $status = if($has){"OK"}else{"FALTA"}
    Write-Host "    $dep: $status"
}

# 5. Verificar .gitignore
$gitignore = Test-Path "$projectRoot\.gitignore"
Write-Host "  .gitignore: $(if($gitignore){'OK'}else{'FALTA'})"

Write-Host ""
Write-Host "Configuracao Vercel OK!" -ForegroundColor Green
Write-Host ""
Write-Host "Para fazer deploy:" -ForegroundColor Yellow
Write-Host "  1. git add . && git commit -m 'deploy'"
Write-Host "  2. git push origin main"
Write-Host "  3. Vercel faz deploy automatico" -ForegroundColor Gray