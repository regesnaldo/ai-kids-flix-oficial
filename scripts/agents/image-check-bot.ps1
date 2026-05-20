# Image-Check Bot
# Verifica imagens dos agentes e recursos visuais
# Uso: pwsh -File scripts/agents\image-check-bot.ps1

Write-Host "Image Check Bot iniciando..." -ForegroundColor Cyan

$projectRoot = "C:\Users\REGINALDO\Desktop\AI-KIDS-OFICIAL"

Write-Host ""
Write-Host "Verificando imagens..." -ForegroundColor Yellow

# Lista de agentes esperados
$expectedAgents = @("nexus", "volt", "stratos", "kaos", "ethos", "lyra", "aurora", "terra", "axiom", "cipher", "janus", "prism")

# Verificar imagens em public/images/agentes
$imagePath = "$projectRoot\public\images\agentes"
if (Test-Path $imagePath) {
    $images = Get-ChildItem -Path $imagePath -File
    Write-Host "  Imagens encontradas: $($images.Count)"
    
    Write-Host "  Por agente:"
    $missing = @()
    foreach ($agent in $expectedAgents) {
        $hasImage = $images | Where-Object { $_.Name -match "^$agent\." }
        if ($hasImage) {
            Write-Host "    $agent : OK ($($hasImage.Extension))"
        } else {
            Write-Host "    $agent : FALTA"
            $missing += $agent
        }
    }
    
    if ($missing.Count -gt 0) {
        Write-Host ""
        Write-Host "Imagens faltando: $($missing -join ', ')" -ForegroundColor Yellow
    }
} else {
    Write-Host "  Pasta nao encontrada: $imagePath"
}

# Verificar outras pastas de imagem
$folders = @("public\images", "public\icons", "public\assets")
foreach ($f in $folders) {
    $path = "$projectRoot\$f"
    if (Test-Path $path) {
        $count = (Get-ChildItem -Path $path -File -Recurse).Count
        Write-Host "  $f : $count arquivos"
    }
}

Write-Host ""
Write-Host "Image Check completo!" -ForegroundColor Green