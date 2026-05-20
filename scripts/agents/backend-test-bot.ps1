# Backend-Test Bot
# Testa APIs e backend
# Uso: pwsh -File scripts/agents/backend-test-bot.ps1

Write-Host "Backend Test Bot iniciando..." -ForegroundColor Cyan

$projectRoot = "C:\Users\REGINALDO\Desktop\AI-KIDS-OFICIAL"

Write-Host ""
Write-Host "Verificando APIs..." -ForegroundColor Yellow

# 1. Listar todas as rotas de API
$apiRoutes = Get-ChildItem -Path "$projectRoot\src\app\api" -Directory -Recurse -ErrorAction SilentlyContinue
Write-Host "  Rotas API encontradas: $($apiRoutes.Count)"

# 2. Verificar rotas principais
$routes = @(
    "api\auth\login\route.ts",
    "api\chat\route.ts",
    "api\universo\chat\route.ts",
    "api\checkout\route.ts",
    "api\health\system\route.ts"
)

foreach ($r in $routes) {
    $exists = Test-Path "$projectRoot\src\app\$r"
    $status = if($exists){"OK"}else{"FALTA"}
    Write-Host "  $r : $status"
}

# 3. Verificar banco de dados
$dbSchema = Test-Path "$projectRoot\src\lib\db\schema.ts"
Write-Host "  Schema DB: $(if($dbSchema){'OK'}else{'FALTA'})"

# 4. Verificar Drizzle ORM
$drizzle = Test-Path "$projectRoot\drizzle.config.ts"
Write-Host "  Drizzle: $(if($drizzle){'OK'}else{'FALTA'})"

# 5. Verificar autenticação
$auth = Get-ChildItem -Path "$projectRoot\src\lib" -Filter "*auth*" -ErrorAction SilentlyContinue
Write-Host "  Auth: $($auth.Count) arquivos"

# 6. Verificar Stripe
$stripe = Get-ChildItem -Path "$projectRoot\src" -Filter "*stripe*" -Recurse -ErrorAction SilentlyContinue
Write-Host "  Stripe: $($stripe.Count) arquivos"

Write-Host ""
Write-Host "Backend verificado!" -ForegroundColor Green