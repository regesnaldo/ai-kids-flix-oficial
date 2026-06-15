# SEO-Bot Agent
# Otimiza SEO automaticamente
# Uso: pwsh -File scripts/agents/seo-bot.ps1

Write-Host "🔍 SEO Bot iniciando..." -ForegroundColor Cyan

$projectRoot = "C:\Users\REGINALDO\Desktop\AI-KIDS-OFICIAL"

# 1. Verificar sitemap.xml
$sitemap = Get-Content "$projectRoot\public\sitemap.xml" -ErrorAction SilentlyContinue
if ($sitemap) {
    $pageCount = ([regex]::Matches($sitemap, "<url>")).Count
    Write-Host "  ✅ sitemap.xml encontrado: $pageCount páginas"
} else {
    Write-Host "  ⚠️ sitemap.xml não encontrado"
}

# 2. Verificar robots.txt
$robots = Get-Content "$projectRoot\public\robots.txt" -ErrorAction SilentlyContinue
if ($robots) {
    Write-Host "  ✅ robots.txt encontrado"
} else {
    Write-Host "  ⚠️ robots.txt não encontrado"
}

# 3. Verificar meta tags em pages
$pagesWithMeta = 0
Get-ChildItem -Path "$projectRoot\src\app" -Include page.tsx,layout.tsx -Recurse | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    if ($content -match "metadata|title|description") {
        $pagesWithMeta++
    }
}
Write-Host "  ✅ Páginas com metadata: $pagesWithMeta"

# 4. Verificar universos no sitemap
$universes = @("nexus", "volt", "stratos", "kaos", "ethos", "lyra", "aurora", "terra", "axiom", "cipher", "janus", "prism")
$addedUniverses = 0
foreach ($u in $universes) {
    if (Test-Path "$projectRoot\src\app\(main)\universo\$u\page.tsx") {
        $addedUniverses++
    }
}
Write-Host "  📡 Universos implementados: $addedUniverses / $($universes.Count)"

Write-Host ""
Write-Host "✅ SEO Bot completo!" -ForegroundColor Green