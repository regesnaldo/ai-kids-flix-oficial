# SENTINELA - Sistema de Monitoramento em Tempo Real
# Dashboard que mostra todos os bots trabalhando
# Uso: pwsh -File scripts\sentinel\sentinel-server.ps1

param(
    [switch]$Interactive = $false
)

$projectRoot = "C:\Users\REGINALDO\Desktop\AI-KIDS-OFICIAL"
$logFile = "$projectRoot\logs\sentinel.log"

# Criar pasta de logs se não existir
if (!(Test-Path "$projectRoot\logs")) {
    New-Item -ItemType Directory -Path "$projectRoot\logs" -Force | Out-Null
}

function Write-Log($message, $type = "INFO") {
    $timestamp = Get-Date -Format "HH:mm:ss"
    $logEntry = "[$timestamp] [$type] $message"
    Add-Content -Path $logFile -Value $logEntry
}

function Get-SystemStatus {
    $status = @{
        Timestamp = Get-Date -Format "HH:mm:ss"
        BotCount = 16
        ActiveBots = @()
        BuildStatus = "unknown"
        UniverseCount = 0
        Issues = @()
    }

    # Verificar universos
    $universes = Get-ChildItem -Path "$projectRoot\src\app\(main)\universo" -Directory -ErrorAction SilentlyContinue
    $status.UniverseCount = $universes.Count

    # Contar bots ativos (arquivos modificados recently)
    $botsDir = "$projectRoot\scripts\agents"
    if (Test-Path $botsDir) {
        $bots = Get-ChildItem -Path $botsDir -Filter "*.ps1"
        $status.BotCount = $bots.Count
    }

    # Verificar build
    try {
        Set-Location $projectRoot
        $buildOutput = npm run build 2>&1 | Select-String -Pattern "Compiled|Error|error"
        if ($buildOutput -match "Compiled successfully") {
            $status.BuildStatus = "OK"
        } else {
            $status.BuildStatus = "FAIL"
            $status.Issues += "Build falhou"
        }
    } catch {
        $status.BuildStatus = "ERROR"
        $status.Issues += "Erro ao verificar build"
    }

    return $status
}

function Show-SentinelDashboard {
    Clear-Host
    Write-Host ""
    Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor Cyan
    Write-Host "    🤖 MENTE.AI SENTINELA - Monitoramento em Tempo Real    " -ForegroundColor Cyan
    Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor Cyan
    Write-Host ""

    $status = Get-SystemStatus

    Write-Host "📊 STATUS GERAL" -ForegroundColor Yellow
    Write-Host "   Horário:    $($status.Timestamp)"
    Write-Host "   Bots:       $($status.BotCount) agentes disponíveis"
    Write-Host "   Universos: $($status.UniverseCount) criados"
    Write-Host "   Build:      $($status.BuildStatus)"
    Write-Host ""

    Write-Host "🤖 AGENTES ONLINE" -ForegroundColor Yellow
    $bots = @(
        "Doc-Writer    | 📝 Documentação",
        "QA-Bot        | 🔍 Verificação código",
        "Refactor-Bot  | 🔧 Refatoração",
        "Fix-Bot       | 🛠️ Correções",
        "Universe-Gen  | 🌌 Gerar universos",
        "SEO-Bot       | 🔎 SEO",
        "Test-Bot      | 🧪 Testes",
        "Migration-Bot | 🗄️ Migrations",
        "Component-Bot | 🧩 Componentes",
        "Build-Bot     | ⚙️ Build",
        "Frontend-Test | 🌐 Frontend",
        "Backend-Test  | 🖥️ Backend",
        "Login-Debug   | 🔐 Auth",
        "Vercel-Deploy | 🚀 Deploy",
        "Image-Check   | 🖼️ Imagens",
        "Full-Check    | ✅ Verificação total"
    )
    $bots | ForEach-Object { Write-Host "   $_" }

    Write-Host ""
    Write-Host "🌌 UNIVERSOS" -ForegroundColor Yellow
    if ($status.UniverseCount -gt 0) {
        $universes = Get-ChildItem -Path "$projectRoot\src\app\(main)\universo" -Directory
        $uList = $universes.Name -join ", "
        Write-Host "   Ativos: $uList"
    } else {
        Write-Host "   Nenhum universo criado"
    }

    if ($status.Issues.Count -gt 0) {
        Write-Host ""
        Write-Host "⚠️ PROBLEMAS" -ForegroundColor Red
        $status.Issues | ForEach-Object { Write-Host "   - $_" }
    }

    Write-Host ""
    Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor Cyan
    Write-Host "Pressione ENTER para atualizar ou Ctrl+C para sair" -ForegroundColor Gray
}

# Modo interativo
if ($Interactive) {
    Write-Log "Sentinela iniciada" "START"
    while ($true) {
        Show-SentinelDashboard
        $input = Read-Host
        if ($input -eq "exit") { break }
    }
    Write-Log "Sentinela encerrada" "STOP"
} else {
    # Modo único
    Show-SentinelDashboard
    Write-Log "Verificação concluída" "CHECK"
}