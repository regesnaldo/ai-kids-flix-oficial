@echo off
chcp 65001 >nul
echo ============================================
echo   HERMES LOCAL AGENT v3.0
echo   MENTE.AI / AI-KIDS-FLIX
echo   Production-grade operator
echo ============================================
echo.
echo   Uso: hermes.bat [--dry-run] [--mission "texto"]
echo.
echo ============================================

REM Check Python
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERRO] Python nao encontrado.
    echo Instale Python 3.10+ em https://python.org
    pause
    exit /b 1
)

REM Check API key
if "%DEEPSEEK_API_KEY%"=="" (
    echo [AVISO] Variavel DEEPSEEK_API_KEY nao encontrada.
    echo Configure com: setx DEEPSEEK_API_KEY "sk-sua-chave"
    echo.
)

REM Run agent with all arguments forwarded
python hermes_agent.py %*
pause
