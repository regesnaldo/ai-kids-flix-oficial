# ============================================================
# validate-turbopack-fix.ps1 — MENTE.AI
# Checklist de validacao antes de iniciar o servidor
# Uso: .\scripts\validate-turbopack-fix.ps1
# ============================================================
param([switch]$Quiet = $false)
$ErrorActionPreference = "SilentlyContinue"
$exitCode = 0; $checksPassed = 0; $checksTotal = 6

function Write-Check {
    param($Number, $Message, $Status, $IsError = $false)
    $icon = if ($Status) { "OK" } else { if ($IsError) { "FAIL" } else { "WARN" } }
    $color = if ($Status) { "Green" } elseif ($IsError) { "Red" } else { "Yellow" }
    if (-not $Quiet) { Write-Host "  [$Number/$checksTotal] [$icon] $Message" -ForegroundColor $color }
}

if (-not $Quiet) {
    Write-Host ""; Write-Host "============================================================" -ForegroundColor Cyan
    Write-Host "  MENTE.AI - Validacao do Ambiente" -ForegroundColor Cyan
    Write-Host "============================================================" -ForegroundColor Cyan; Write-Host ""
}

$check1 = -not (Get-Process -Name "node" -ErrorAction SilentlyContinue)
if (-not $check1) { $exitCode = 1 } else { $checksPassed++ }
Write-Check 1 "Nenhum processo Node.js ativo" $check1 (-not $check1)

$check2 = -not (Test-Path ".next")
if (-not $check2) { $exitCode = 1 } else { $checksPassed++ }
Write-Check 2 "Cache .next removido" $check2 (-not $check2)

$check3 = -not (Test-Path ".turbo")
if (-not $check3) { $exitCode = 1 } else { $checksPassed++ }
Write-Check 3 "Cache .turbo removido" $check3 (-not $check3)

$check4 = -not (netstat -ano 2>$null | Select-String ":3000\s" | Select-Object -First 1)
if (-not $check4) { $exitCode = 1 } else { $checksPassed++ }
Write-Check 4 "Porta 3000 disponivel" $check4 (-not $check4)

$check5 = (Test-Path "package.json") -and (Get-Content "package.json" -Raw | ConvertFrom-Json -ErrorAction SilentlyContinue)
if (-not $check5) { $exitCode = 1 } else { $checksPassed++ }
Write-Check 5 "package.json valido" $check5 (-not $check5)

$check6 = Test-Path "node_modules"
if (-not $check6) { $exitCode = 1 } else { $checksPassed++ }
Write-Check 6 "node_modules instalado" $check6 (-not $check6)

if (-not $Quiet) {
    Write-Host ""; Write-Host "============================================================" -ForegroundColor Cyan
    if ($exitCode -eq 0) { Write-Host "  AMBIENTE PRONTO - $checksPassed/$checksTotal verificacoes OK" -ForegroundColor Green }
    else { Write-Host "  AMBIENTE NAO PRONTO - $($checksTotal - $checksPassed) falha(s)" -ForegroundColor Red }
    Write-Host "============================================================" -ForegroundColor Cyan; Write-Host ""
}
exit $exitCode
