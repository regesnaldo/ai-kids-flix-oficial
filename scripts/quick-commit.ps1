# scripts/quick-commit.ps1
# Commit rápido sem perguntas

try {
  $null = git --version
} catch {
  Write-Host "[ERRO] Git não encontrado. Instale o Git e tente novamente." -ForegroundColor Red
  exit 1
}

$insideRepo = git rev-parse --is-inside-work-tree 2>$null
if ($insideRepo -ne "true") {
  Write-Host "[ERRO] Este diretório não é um repositório Git." -ForegroundColor Red
  exit 1
}

$status = git status --porcelain
if ([string]::IsNullOrWhiteSpace($status)) {
  Write-Host "[OK] Nenhuma mudança para commitar!" -ForegroundColor Green
  exit 0
}

git add .
$message = "feat: $(Get-Date -Format 'yyyy-MM-dd HH:mm') - Auto-save"
git commit -m "$message"
if ($LASTEXITCODE -ne 0) {
  Write-Host "[ERRO] Erro no commit. Verifique se há conflitos ou hooks falhando." -ForegroundColor Red
  exit 1
}

$hasOrigin = git remote get-url origin 2>$null
if ([string]::IsNullOrWhiteSpace($hasOrigin)) {
  Write-Host "[ERRO] Remote 'origin' não encontrado. Configure um remote antes do push." -ForegroundColor Red
  exit 1
}

git push
if ($LASTEXITCODE -ne 0) {
  Write-Host "[ERRO] Erro no push. Verifique sua conexão e credenciais." -ForegroundColor Red
  exit 1
}

Write-Host "[OK] Commit e push realizados!" -ForegroundColor Green
