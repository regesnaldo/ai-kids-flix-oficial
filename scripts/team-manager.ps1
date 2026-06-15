# MENTE.AI Dev Team Manager
#用法: pwsh -File scripts\team-manager.ps1 [comando]

param(
    [string]$Command = "help"
)

$green = "Green"
$yellow = "Yellow"
$cyan = "Cyan"

function Show-Help {
    Write-Host ""
    Write-Host "MENTE.AI DEV TEAM - Equipe de 16 Agentes" -ForegroundColor $cyan
    Write-Host "==========================================" -ForegroundColor $cyan
    Write-Host ""
    Write-Host "Comandos:"
    Write-Host "  help         - Mostrar ajuda"
    Write-Host "  status       - Status da equipe"
    Write-Host ""
    Write-Host "BOTS DE CODIGO:"
    Write-Host "  qa           - Verifica codigo (console.log, TODO, any)"
    Write-Host "  refactor     - Identifica refatoracoes"
    Write-Host "  fix          - Corrige erros simples"
    Write-Host "  test         - Cria testes"
    Write-Host ""
    Write-Host "BOTS DE UNIVERSO:"
    Write-Host "  universe     - Gera universos"
    Write-Host "  seo          - Verifica SEO"
    Write-Host "  images       - Verifica imagens"
    Write-Host ""
    Write-Host "BOTS DE INFRA:"
    Write-Host "  build        - Verifica build"
    Write-Host "  frontend     - Testa frontend"
    Write-Host "  backend      - Testa backend"
    Write-Host "  login        - Debug login"
    Write-Host "  vercel       - Config Vercel"
    Write-Host ""
    Write-Host "BOTS DE PESQUISA:"
    Write-Host "  search       - Pesquisar na web"
    Write-Host ""
    Write-Host "BOTS COMPLETOS:"
    Write-Host "  check        - Verificacao completa"
    Write-Host "  all          - Executar todos"
}

function Show-Status {
    Write-Host ""
    Write-Host "MENTE.AI DEV TEAM - Online" -ForegroundColor $green
    Write-Host "==========================" -ForegroundColor $cyan
    Write-Host ""
    Write-Host "16 Agentes prontos para trabalhar"
    Write-Host ""
    Write-Host "Use: pwsh -File scripts\team-manager.ps1 check"
    Write-Host "Para verificacao completa"
}

switch ($Command.ToLower()) {
    "help"    { Show-Help }
    "status"  { Show-Status }
    "qa"      { & "$PSScriptRoot\agents\qa-bot.ps1" }
    "refactor" { & "$PSScriptRoot\agents\refactor-bot.ps1" }
    "fix"     { & "$PSScriptRoot\agents\fix-bot.ps1" }
    "test"    { & "$PSScriptRoot\agents\test-bot.ps1" }
    "seo"     { & "$PSScriptRoot\agents\seo-bot.ps1" }
    "images"  { & "$PSScriptRoot\agents\image-check-bot.ps1" }
    "build"   { & "$PSScriptRoot\agents\build-bot.ps1" }
    "frontend" { & "$PSScriptRoot\agents\frontend-test-bot.ps1" }
    "backend" { & "$PSScriptRoot\agents\backend-test-bot.ps1" }
    "login"   { & "$PSScriptRoot\agents\login-debug-bot.ps1" }
    "vercel"  { & "$PSScriptRoot\agents\vercel-deploy-bot.ps1" }
    "search"  { Write-Host "Use: pwsh -File scripts\agents\websearch-bot.ps1 [termo]" }
    "check"   { & "$PSScriptRoot\agents\full-check-bot.ps1" }
    "all"     {
        Write-Host "Executando verificacao completa..." -ForegroundColor $yellow
        & "$PSScriptRoot\agents\full-check-bot.ps1"
    }
    default   { Show-Help }
}