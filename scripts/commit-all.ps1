# scripts/commit-all.ps1
# Script para commitar todas as mudanças automaticamente

Write-Host "[INFO] Verificando status do Git..." -ForegroundColor Cyan

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

Write-Host "`n[ARQUIVOS] Arquivos modificados:" -ForegroundColor Yellow
git status --short

Write-Host "`n[INFO] Adicionando arquivos..." -ForegroundColor Cyan
git add .

$branch = git rev-parse --abbrev-ref HEAD
Write-Host "[INFO] Branch: $branch" -ForegroundColor Cyan

$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm"
$message = "feat: Update $timestamp - MENTE.AI development"

Write-Host "`n[COMMIT] Mensagem de commit:" -ForegroundColor Yellow
Write-Host "1) Automática: '$message'"
Write-Host "2) Personalizada"
$choice = Read-Host "Escolha (1 ou 2)"

if ($choice -eq "2") {
  $customMessage = Read-Host "Digite a mensagem de commit"
  if (-not [string]::IsNullOrWhiteSpace($customMessage)) {
    $message = $customMessage
  }
}

Write-Host "`n[INFO] Fazendo commit..." -ForegroundColor Cyan
git commit -m "$message"

if ($LASTEXITCODE -eq 0) {
  Write-Host "[OK] Commit realizado com sucesso!" -ForegroundColor Green

  $pushChoice = Read-Host "Fazer push para o remoto? (y/n)"

  if ($pushChoice -eq "y" -or $pushChoice -eq "Y") {
    $hasOrigin = git remote get-url origin 2>$null
    if ([string]::IsNullOrWhiteSpace($hasOrigin)) {
      Write-Host "[ERRO] Remote 'origin' não encontrado. Configure um remote antes do push." -ForegroundColor Red
      exit 1
    }

    Write-Host "`n[INFO] Fazendo push..." -ForegroundColor Cyan
    git push origin $branch

    if ($LASTEXITCODE -eq 0) {
      Write-Host "[OK] Push realizado com sucesso!" -ForegroundColor Green
      Write-Host "`n[OK] Tudo sincronizado!" -ForegroundColor Green
    } else {
      Write-Host "[ERRO] Erro no push. Verifique sua conexão e credenciais." -ForegroundColor Red
      exit 1
    }
  }
} else {
  Write-Host "[ERRO] Erro no commit. Verifique se há conflitos ou hooks falhando." -ForegroundColor Red
  exit 1
}

Write-Host "`n[STATUS] Status atual:" -ForegroundColor Cyan
git status --short
