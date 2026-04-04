# ============================================================
# fix-turbopack-cache.ps1 — MENTE.AI
# Corrige: "Persisting failed: Another write batch or compaction
#           is already active" (Turbopack cache corrompido)
# Uso: .\scripts\fix-turbopack-cache.ps1
# ============================================================
$ErrorActionPreference = "SilentlyContinue"

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  MENTE.AI — Fix: Turbopack Cache Corrompido" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

# PASSO 1: Matar todos os processos Node.js ativos
Write-Host "[1/5] Encerrando processos Node.js..." -ForegroundColor Yellow
$nodeProcs = Get-Process -Name "node" -ErrorAction SilentlyContinue
if ($nodeProcs) {
    $nodeProcs | Stop-Process -Force
    Start-Sleep -Seconds 1
    Write-Host "      ✅ $($nodeProcs.Count) processo(s) encerrado(s)." -ForegroundColor Green
} else {
    Write-Host "      ℹ️  Nenhum processo Node.js em execução." -ForegroundColor Gray
}

# PASSO 2: Matar processos npm/npx remanescentes
Write-Host "[2/5] Encerrando processos npm/npx..." -ForegroundColor Yellow
@("npm", "npx", "next") | ForEach-Object {
    $procs = Get-Process -Name $_ -ErrorAction SilentlyContinue
    if ($procs) { $procs | Stop-Process -Force; Write-Host "      ✅ '$_' encerrado." -ForegroundColor Green }
}
Start-Sleep -Seconds 1

# PASSO 3: Remover caches corrompidos
Write-Host "[3/5] Removendo caches corrompidos..." -ForegroundColor Yellow
@(".next", ".turbo", "node_modules\.cache", "node_modules\.next") | ForEach-Object {
    if (Test-Path $_) {
        Remove-Item -Recurse -Force $_ -ErrorAction SilentlyContinue
        if (-not (Test-Path $_)) { Write-Host "      ✅ Removido: $_" -ForegroundColor Green }
        else { Write-Host "      ⚠️  Nao removido: $_ (tente como Admin)" -ForegroundColor Yellow }
    } else {
        Write-Host "      ℹ️  Nao existe: $_ (ok)" -ForegroundColor Gray
    }
}

# PASSO 4: Verificar portas ocupadas
Write-Host "[4/5] Verificando portas 3000 e 3001..." -ForegroundColor Yellow
@(3000, 3001) | ForEach-Object {
    $port = $_
    $conn = netstat -ano 2>$null | Select-String ":$port\s"
    if ($conn) {
        $pid = ($conn | ForEach-Object { if ($_ -match '\s+(\d+)\s*$') { $matches[1] } } | Select-Object -First 1)
        if ($pid -and $pid -ne "0") {
            try { Stop-Process -Id ([int]$pid) -Force -ErrorAction Stop; Write-Host "      ✅ Porta $port liberada." -ForegroundColor Green }
            catch { Write-Host "      ⚠️  Porta $port ocupada (PID $pid) — encerre manualmente." -ForegroundColor Yellow }
        }
    } else { Write-Host "      ✅ Porta $port livre." -ForegroundColor Green }
}

# PASSO 5: Confirmacao final
Write-Host "[5/5] Validando ambiente..." -ForegroundColor Yellow
$remainingNode = Get-Process -Name "node" -ErrorAction SilentlyContinue
$allClear = (-not $remainingNode) -and (-not (Test-Path ".next")) -and (-not (Test-Path ".turbo"))

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
if ($allClear) {
    Write-Host "  ✅ TURBOPACK CACHE CORRIGIDO COM SUCESSO!" -ForegroundColor Green
} else {
    Write-Host "  ⚠️  LIMPEZA PARCIAL — veja avisos acima." -ForegroundColor Yellow
}
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "  PROXIMO PASSO: npm run dev" -ForegroundColor White
Write-Host "  ⚠️  REGRA: apenas 1 instancia de 'npm run dev' por projeto!" -ForegroundColor Red
Write-Host ""
