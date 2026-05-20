# Migration-Bot Agent
# Cria migrations de banco de dados
# Uso: pwsh -File scripts/agents/migration-bot.ps1 [nome]

param(
    [string]$Name = ""
)

$projectRoot = "C:\Users\REGINALDO\Desktop\AI-KIDS-OFICIAL"

if ($Name -eq "") {
    Write-Host "Verificando schema do banco..." -ForegroundColor Cyan
    
    # Verificar schema.ts
    $schemaFile = "$projectRoot\src\lib\db\schema.ts"
    if (Test-Path $schemaFile) {
        $tables = Select-String -Path $schemaFile -Pattern "mysqlTable\(" | ForEach-Object {
            $_.Line -match 'mysqlTable\("(\w+)"' | Out-Null
            $matches[1]
        }
        Write-Host "  ✅ Tabelas existentes:"
        $tables | ForEach-Object { Write-Host "     - $_" }
    }
    
    Write-Host ""
    Write-Host "Uso: pwsh -File scripts/agents/migration-bot.ps1 [nome-da-migration]"
    Write-Host "Exemplo: pwsh -File scripts/agents/migration-bot.ps1 add_user_profiles"
} else {
    Write-Host "🗄️ Criando migration: $Name" -ForegroundColor Yellow
    
    $migrationContent = @"
-- Migration: $Name
-- Criado em: $(Get-Date -Format "yyyy-MM-dd HH:mm")

-- TODO: Definir schema
-- ALTER TABLE users ADD COLUMN new_column VARCHAR(255);

-- Rollback:
-- ALTER TABLE users DROP COLUMN new_column;
"@
    
    $migrationFile = "$projectRoot\sql\migrations\$Name.sql"
    if (!(Test-Path (Split-Path $migrationFile))) {
        New-Item -ItemType Directory -Path (Split-Path $migrationFile) -Force | Out-Null
    }
    Set-Content -Path $migrationFile -Value $migrationContent
    
    Write-Host "  ✅ Migration criada: $migrationFile"
}