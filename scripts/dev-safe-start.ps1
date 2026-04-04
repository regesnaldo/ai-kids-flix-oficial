# ============================================================
# dev-safe-start.ps1 — MENTE.AI
# Inicializacao segura do servidor de desenvolvimento
# Uso: .\scripts\dev-safe-start.ps1
# ============================================================
param([Parameter(ValueFromRemainingArguments=$true)] $NextArgs)
$ErrorActionPreference = "Continue"

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  MENTE.AI - Inicializacao Segura do Dev Server" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# PASSO 1: Limpeza
Write-Host "[1/3] Executando limpeza de cache..." -ForegroundColor Yellow
$fixScript = Join-Path $scriptDir "fix-turbopack-cache.ps1"
if (Test-Path $fixScript) {
    & $fixScript | ForEach-Object {
        if ($_ -match "OK|FAIL|WARN|SUCESSO|LIMPO") { Write-Host "      $_" -ForegroundColor Gray }
    }
} else {
    Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force
    Remove-Item -Recurse -Force ".next", ".turbo" -ErrorAction SilentlyContinue
    Write-Host "      Limpeza manual executada." -ForegroundColor Gray
}

# PASSO 2: Validacao
Write-Host ""
Write-Host "[2/3] Validando ambiente..." -ForegroundColor Yellow
$validateScript = Join-Path $scriptDir "validate-turbopack-fix.ps1"
$envReady = $false
if (Test-Path $validateScript) {
    & $validateScript -Quiet
    if ($LASTEXITCODE -eq 0) { $envReady = $true; Write-Host "      [OK] Validacao passou" -ForegroundColor Green }
    else { Write-Host "      [FAIL] Validacao falhou" -ForegroundColor Red }
} else {
    $envReady = (-not (Test-Path ".next")) -and (-not (Test-Path ".turbo")) -and (-not (Get-Process -Name "node" -ErrorAction SilentlyContinue))
    if ($envReady) { Write-Host "      [OK] Verificacoes basicas OK" -ForegroundColor Green }
}

if (-not $envReady) {
    Write-Host ""
    Write-Host "  [ERRO] NAO FOI POSSIVEL PREPARAR O AMBIENTE" -ForegroundColor Red
    Write-Host "  Execute como Administrador: .\scripts\fix-turbopack-cache.ps1" -ForegroundColor Yellow
    exit 1
}

# PASSO 3: Iniciar servidor
Write-Host ""
Write-Host "[3/3] Iniciando servidor Next.js..." -ForegroundColor Yellow
Write-Host ""
Write-Host "============================================================" -ForegroundColor Green
Write-Host "  SERVIDOR INICIANDO..." -ForegroundColor Green
Write-Host "  URL: http://localhost:3000" -ForegroundColor Cyan
Write-Host "  Turbopack: Ativo" -ForegroundColor Cyan
Write-Host "  NAO abra outro terminal com 'npm run dev'" -ForegroundColor Red
Write-Host "  Pressione Ctrl+C para encerrar" -ForegroundColor Gray
Write-Host "============================================================" -ForegroundColor Green
Write-Host ""

$projectRoot = Split-Path -Parent $scriptDir
Set-Location $projectRoot

if ($NextArgs) { npx next dev --turbopack $NextArgs }
else { npx next dev --turbopack }
