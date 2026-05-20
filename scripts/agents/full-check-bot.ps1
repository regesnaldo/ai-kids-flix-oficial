# Full-Check Bot
# Verificacao completa antes de dormir
# Uso: pwsh -File scripts\agents\full-check-bot.ps1

Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "       FULL CHECK - VERIFICACAO COMPLETA    " -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""

$projectRoot = "C:\Users\REGINALDO\Desktop\AI-KIDS-OFICIAL"
$pass = 0
$fail = 0

# 1. Build
Write-Host "[1/8] Verificando build..." -ForegroundColor Yellow
try {
    Set-Location $projectRoot
    $build = npm run build 2>&1 | Select-String -Pattern "Compiled|error|Error"
    if ($build -match "Compiled successfully") {
        Write-Host "  OK - Build passa" -ForegroundColor Green
        $pass++
    } else {
        Write-Host "  FALHA - Build com erros" -ForegroundColor Red
        $fail++
    }
} catch {
    Write-Host "  FALHA - Erro no build" -ForegroundColor Red
    $fail++
}

# 2. Frontend
Write-Host "[2/8] Verificando frontend..." -ForegroundColor Yellow
$pages = @("home", "agentes", "login", "cadastro")
$pageFail = 0
foreach ($p in $pages) {
    if (Test-Path "$projectRoot\src\app\(main)\$p\page.tsx") {
        # OK
    } else {
        $pageFail++
    }
}
if ($pageFail -eq 0) {
    Write-Host "  OK - Pagens OK" -ForegroundColor Green
    $pass++
} else {
    Write-Host "  FALHA - $pageFail paginas faltando" -ForegroundColor Red
    $fail++
}

# 3. Universos
Write-Host "[3/8] Verificando universos..." -ForegroundColor Yellow
$universes = @("nexus", "volt")
$uniFail = 0
foreach ($u in $universes) {
    if (Test-Path "$projectRoot\src\app\(main)\universo\$u\page.tsx") {
        # OK
    } else {
        $uniFail++
    }
}
if ($uniFail -eq 0) {
    Write-Host "  OK - Universos OK" -ForegroundColor Green
    $pass++
} else {
    Write-Host "  FALHA - $uniFail universos faltando" -ForegroundColor Red
    $fail++
}

# 4. APIs
Write-Host "[4/8] Verificando APIs..." -ForegroundColor Yellow
$apis = @("chat", "auth\login", "universo\chat", "health\system")
$apiFail = 0
foreach ($a in $apis) {
    if (Test-Path "$projectRoot\src\app\api\$a\route.ts") {
        # OK
    } else {
        $apiFail++
    }
}
if ($apiFail -eq 0) {
    Write-Host "  OK - APIs OK" -ForegroundColor Green
    $pass++
} else {
    Write-Host "  FALHA - $apiFail APIs faltando" -ForegroundColor Red
    $fail++
}

# 5. Banco
Write-Host "[5/8] Verificando banco..." -ForegroundColor Yellow
$dbOk = Test-Path "$projectRoot\src\lib\db\schema.ts"
if ($dbOk) {
    Write-Host "  OK - Schema OK" -ForegroundColor Green
    $pass++
} else {
    Write-Host "  FALHA - Schema faltando" -ForegroundColor Red
    $fail++
}

# 6. Imagens
Write-Host "[6/8] Verificando imagens..." -ForegroundColor Yellow
$imgPath = "$projectRoot\public\images\agentes"
$imgCount = 0
if (Test-Path $imgPath) {
    $imgCount = (Get-ChildItem -Path $imgPath -File).Count
}
if ($imgCount -ge 12) {
    Write-Host "  OK - $imgCount imagens" -ForegroundColor Green
    $pass++
} else {
    Write-Host "  ATENCAO - Apenas $imgCount imagens" -ForegroundColor Yellow
    $pass++
}

# 7. SEO
Write-Host "[7/8] Verificando SEO..." -ForegroundColor Yellow
$seoOk = (Test-Path "$projectRoot\public\sitemap.xml") -and (Test-Path "$projectRoot\public\robots.txt")
if ($seoOk) {
    Write-Host "  OK - SEO OK" -ForegroundColor Green
    $pass++
} else {
    Write-Host "  FALHA - SEO faltando" -ForegroundColor Red
    $fail++
}

# 8. Config
Write-Host "[8/8] Verificando config..." -ForegroundColor Yellow
$configOk = (Test-Path "$projectRoot\vercel.json") -and (Test-Path "$projectRoot\.env.example")
if ($configOk) {
    Write-Host "  OK - Config OK" -ForegroundColor Green
    $pass++
} else {
    Write-Host "  FALHA - Config incompleta" -ForegroundColor Red
    $fail++
}

# Resultado final
Write-Host ""
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "RESULTADO: $pass OK | $fail FALHAS" -ForegroundColor $(if($fail -eq 0){"Green"}else{"Red"})
Write-Host "=============================================" -ForegroundColor Cyan

if ($fail -eq 0) {
    Write-Host ""
    Write-Host "PROJETO PRONTO PARA DEPLOY!" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "Corrigir $fail item(ns) antes do deploy" -ForegroundColor Yellow
}