# ============================================================
# start-mente-ai.ps1
# MENTE.AI — Launcher Operacional
# Versão 1.0
# ============================================================

param(
    [string]$Task = "",
    [switch]$CheckOnly,
    [switch]$Silent
)

$PROJECT_ROOT = "C:\Users\REGINALDO\Desktop\AI-KIDS-OFICIAL"
$LOG_DIR      = "$PROJECT_ROOT\.launcher-logs"
$LOG_FILE     = "$LOG_DIR\$(Get-Date -Format 'yyyy-MM-dd_HH-mm-ss').log"

function Write-Header  { param($msg) Write-Host "`n[ MENTE.AI ] $msg" -ForegroundColor Cyan }
function Write-Ok      { param($msg) Write-Host "  [OK]  $msg" -ForegroundColor Green }
function Write-Warn    { param($msg) Write-Host "  [!!]  $msg" -ForegroundColor Yellow }
function Write-Fail    { param($msg) Write-Host "  [XX]  $msg" -ForegroundColor Red }
function Write-Log     { param($msg) Add-Content -Path $LOG_FILE -Value "$(Get-Date -Format 'HH:mm:ss') $msg" }

Clear-Host
Write-Host "============================================================" -ForegroundColor DarkCyan
Write-Host "  MENTE.AI — LAUNCHER OPERACIONAL" -ForegroundColor Cyan
Write-Host "  $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor DarkGray
Write-Host "============================================================`n" -ForegroundColor DarkCyan

if (-not (Test-Path $LOG_DIR)) { New-Item -ItemType Directory -Path $LOG_DIR | Out-Null }
Write-Log "=== SESSAO INICIADA ==="

Write-Header "STEP 1 — Verificando projeto..."
if (-not (Test-Path $PROJECT_ROOT)) { Write-Fail "Diretório não encontrado: $PROJECT_ROOT"; exit 1 }
if (-not (Test-Path "$PROJECT_ROOT\package.json")) { Write-Fail "package.json ausente"; exit 1 }
Write-Ok "Projeto encontrado: $PROJECT_ROOT"
Write-Log "OK: projeto validado"

Write-Header "STEP 2 — Entrando no projeto..."
Set-Location $PROJECT_ROOT
Write-Ok "cwd: $(Get-Location)"
Write-Log "OK: cwd = $PROJECT_ROOT"

Write-Header "STEP 3 — Verificando Codex CLI..."
$codexPath = Get-Command codex -ErrorAction SilentlyContinue
if ($null -eq $codexPath) { Write-Fail "Codex nao encontrado no PATH."; Write-Warn "Execute: npm install -g @openai/codex"; exit 1 }
Write-Ok "Codex localizado: $($codexPath.Source)"
Write-Log "OK: codex encontrado"

Write-Header "STEP 4 — Verificando dependencias..."
if (-not (Test-Path "$PROJECT_ROOT\node_modules")) { npm install }
Write-Ok "Dependencias presentes."
Write-Log "OK: node_modules validado"

Write-Header "STEP 5 — Pre-check TypeScript..."
$tscResult = npx tsc --noEmit 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Warn "TypeScript com erros detectados:"
    $tscResult | Select-Object -First 10 | ForEach-Object { Write-Host "    $_" -ForegroundColor DarkYellow }
    Write-Log "WARN: TypeScript errors pre-launch"
    Write-Warn "Continuando para o Codex corrigir..."
} else {
    Write-Ok "TypeScript limpo."
    Write-Log "OK: typecheck limpo"
}

if ($CheckOnly) { Write-Header "Modo CheckOnly. Encerrando."; exit 0 }

Write-Header "STEP 6 — Registrando sessao..."
$sessionInfo = @{ timestamp = (Get-Date -Format "yyyy-MM-dd HH:mm:ss"); project = $PROJECT_ROOT; task = if ($Task) { $Task } else { "sessao-manual" } }
Set-Content -Path "$LOG_DIR\session-latest.json" -Value ($sessionInfo | ConvertTo-Json)
Write-Ok "Sessao registrada."
Write-Log "OK: sessao registrada"

Write-Host "`n============================================================" -ForegroundColor DarkCyan
Write-Host "  CODEX INICIANDO — cwd: $PROJECT_ROOT" -ForegroundColor Cyan
Write-Host "============================================================`n" -ForegroundColor DarkCyan
Write-Log "INFO: iniciando codex"

if ($Task) { codex --approval-mode full-auto -q "$Task" } else { codex }

Write-Log "INFO: sessao codex encerrada"
Write-Host "`n============================================================" -ForegroundColor DarkCyan
Write-Host "  SESSAO ENCERRADA" -ForegroundColor Cyan
Write-Host "============================================================`n" -ForegroundColor DarkCyan

Write-Header "Pos-sessao — Verificando build..."
npm run build 2>&1 | Out-Null
if ($LASTEXITCODE -eq 0) { Write-Ok "Build passou."; Write-Log "OK: build pos-sessao" } else { Write-Fail "Build falhou."; Write-Log "FAIL: build pos-sessao" }
Write-Log "=== SESSAO ENCERRADA ==="
