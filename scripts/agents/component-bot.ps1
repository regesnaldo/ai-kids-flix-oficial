# Component-Bot Agent
# Gera componentes reutilizáveis
# Uso: pwsh -File scripts/agents/component-bot.ps1 [nome]

param(
    [string]$Name = ""
)

$projectRoot = "C:\Users\REGINALDO\Desktop\AI-KIDS-OFICIAL"

if ($Name -eq "") {
    Write-Host "Uso: pwsh -File scripts/agents/component-bot.ps1 [nome]" -ForegroundColor Yellow
    Write-Host "Exemplo: pwsh -File scripts/agents/component-bot.ps1 Button"
    Write-Host ""
    Write-Host "Componentes disponíveis em: src/components/" -ForegroundColor Gray
    
    Get-ChildItem -Path "$projectRoot\src\components" -Directory | ForEach-Object {
        Write-Host "  - $($_.Name)"
    }
} else {
    Write-Host "🧩 Gerando componente: $Name" -ForegroundColor Cyan
    
    $componentDir = "$projectRoot\src\components\ui"
    if (!(Test-Path $componentDir)) {
        New-Item -ItemType Directory -Path $componentDir -Force | Out-Null
    }
    
    $componentFile = "$componentDir\$Name.tsx"
    
    if (Test-Path $componentFile) {
        Write-Host "  ⚠️ Componente já existe: $componentFile"
    } else {
        $componentContent = @"
interface ${Name}Props {
  children?: React.ReactNode;
  className?: string;
}

export default function ${Name}({ children, className }: ${Name}Props) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}
"@
        Set-Content -Path $componentFile -Value $componentContent
        Write-Host "  ✅ Componente criado: $componentFile"
    }
}