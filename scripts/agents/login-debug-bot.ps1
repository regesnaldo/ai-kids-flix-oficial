# Login-Debug Bot
# Verifica e corrige problemas de autenticacao
# Uso: pwsh -File scripts/agents\login-debug-bot.ps1

Write-Host "Login Debug Bot iniciando..." -ForegroundColor Cyan

$projectRoot = "C:\Users\REGINALDO\Desktop\AI-KIDS-OFICIAL"

Write-Host ""
Write-Host "Analisando sistema de login..." -ForegroundColor Yellow

# 1. Verificar arquivos de auth
$authFiles = @(
    "src\lib\auth.ts",
    "src\app\api\auth\route.ts",
    "src\middleware.ts"
)

foreach ($f in $authFiles) {
    $exists = Test-Path "$projectRoot\$f"
    $status = if($exists){"OK"}else{"FALTA"}
    Write-Host "  $f : $status"
}

# 2. Verificar cookie token
$cookieSearch = Select-String -Path "$projectRoot\src\lib\auth.ts" -Pattern "mente_ai_token" -ErrorAction SilentlyContinue
if ($cookieSearch) {
    Write-Host "  Cookie 'mente_ai_token': OK"
} else {
    Write-Host "  Cookie 'mente_ai_token': VERIFICAR"
}

# 3. Verificar JWT
$jwtSearch = Select-String -Path "$projectRoot\src" -Pattern "jwt|jose" -Include *.ts -Recurse -ErrorAction SilentlyContinue
Write-Host "  JWT/Jose: $($jwtSearch.Count) referencias"

# 4. Verificar login page
$loginPage = Test-Path "$projectRoot\src\app\(main)\login\page.tsx"
Write-Host "  Pagina login: $(if($loginPage){'OK'}else{'FALTA'})"

# 5. Verificar register page
$registerPage = Test-Path "$projectRoot\src\app\(main)\cadastro\page.tsx"
Write-Host "  Pagina registro: $(if($registerPage){'OK'}else{'FALTA'})"

# 6. Verificar middleware de protecao
$middleware = Get-Content "$projectRoot\src\middleware.ts" -ErrorAction SilentlyContinue
if ($middleware) {
    $hasAuth = $middleware -match "token|jwt|auth"
    Write-Host "  Middleware auth: $(if($hasAuth){'OK'}else{'VERIFICAR'})"
}

Write-Host ""
Write-Host "Login verificado!" -ForegroundColor Green
Write-Host "Para testar: acessar /login e /cadastro" -ForegroundColor Gray