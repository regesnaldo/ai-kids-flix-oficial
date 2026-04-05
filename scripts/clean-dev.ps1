# scripts/clean-dev.ps1
# Script para limpar caches CORROMPIDOS do Turbopack/Next.js no Windows
Write-Host "🧹 Limpando caches corrompidos do Next.js/Turbopack..." -ForegroundColor Cyan

# Listar pastas para remover
$folders = @(
    ".next",
    ".turbo",
    ".turbopack",
    "node_modules/.cache",
    "$env:LOCALAPPDATA\Turbo",
    "$env:TEMP\next-panic-*"
)

foreach ($folder in $folders) {
    if (Test-Path $folder) {
        Write-Host "  → Removendo: $folder" -ForegroundColor Yellow
        Remove-Item $folder -Recurse -Force -ErrorAction SilentlyContinue
    }
}

# Limpar arquivos de log de panic
$panicLogs = Get-ChildItem -Path $env:TEMP -Filter "next-panic-*.log" -ErrorAction SilentlyContinue
foreach ($log in $panicLogs) {
    Write-Host "  → Removendo log: $($log.Name)" -ForegroundColor Yellow
    Remove-Item $log.FullName -Force -ErrorAction SilentlyContinue
}

Write-Host "✅ Caches limpos!" -ForegroundColor Green
Write-Host "🚀 Iniciando servidor com Webpack legacy (estável)..." -ForegroundColor Cyan

# Iniciar dev SEM turbopack
npm run dev
