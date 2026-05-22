#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
HERMES LOCAL AGENT v3.0
Production-grade operator for MENTE.AI / AI-KIDS-FLIX
Runs in project root. No browser needed.

NEW v3.0:
  - Automatic build validation after mission
  - Rollback system with safe backups
  - Critical file protection
  - Dynamic governance loading (MENTE_AI_GOVERNANCE.md)
  - --dry-run mode
  - Expanded PROJECT_MEMORY.json
"""

import os
import sys
import json
import re
import shutil
import subprocess
import argparse
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Optional, Tuple

# ═══════════════════════════════════════════════════════════════════════
# CONFIGURATION — env vars or edit here
# ═══════════════════════════════════════════════════════════════════════

DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY", "***")
PROJECT_PATH = os.getenv("HERMES_PROJECT_PATH", r"C:\Users\REGINALDO\Desktop\AI-KIDS-OFICIAL")
MODEL = "deepseek-v4-pro"
MAX_TOKENS = 8000
TEMPERATURE = 0.2
ALLOW_CRITICAL_CHANGES = os.getenv("ALLOW_CRITICAL_CHANGES", "").lower() == "true"

# ═══════════════════════════════════════════════════════════════════════
# CRITICAL FILES — NEVER overwrite without ALLOW_CRITICAL_CHANGES=true
# ═══════════════════════════════════════════════════════════════════════

CRITICAL_FILES = {
    "package.json",
    "package-lock.json",
    "tsconfig.json",
    "next.config.js",
    "next.config.mjs",
    "next.config.ts",
    ".env",
    ".env.local",
    "vercel.json",
}

# ═══════════════════════════════════════════════════════════════════════
# LOGGING
# ═══════════════════════════════════════════════════════════════════════

def log(msg: str, level: str = "INFO") -> None:
    now = datetime.now().strftime("%H:%M:%S")
    prefix = {
        "INFO": "[i]", "OK": "[OK]", "WARN": "[!]",
        "ERROR": "[ERRO]", "HERMES": "[H]", "ROLLBACK": "[R]",
        "VALIDATE": "[V]", "DRYRUN": "[DRY]", "PROTECT": "[P]",
    }.get(level, "[i]")
    print(f"{prefix} [{now}] {msg}")

# ═══════════════════════════════════════════════════════════════════════
# TASK 4 — DYNAMIC GOVERNANCE LOADING
# ═══════════════════════════════════════════════════════════════════════

def load_governance(project_path: str) -> str:
    """Load governance from MENTE_AI_GOVERNANCE.md. Fallback to embedded minimal prompt."""
    gov_path = os.path.join(project_path, "MENTE_AI_GOVERNANCE.md")
    if os.path.exists(gov_path):
        try:
            with open(gov_path, "r", encoding="utf-8") as f:
                governance = f.read()
            log(f"Governanca carregada: {gov_path} ({len(governance)} caracteres)", "OK")
            return governance
        except Exception as e:
            log(f"Erro ao ler governanca externa: {e}. Usando fallback.", "WARN")

    log("MENTE_AI_GOVERNANCE.md nao encontrado. Usando governanca minima embutida.", "WARN")
    return _get_fallback_governance()

def _get_fallback_governance() -> str:
    return """You are Hermes, operator of MENTE.AI.
Rules: Never modify visual identity. Never ignore TypeScript errors.
Never commit node_modules. Never modify package.json without asking.
Language: Code in English. Reports in Brazilian Portuguese.
Response format: ## ✅ O que foi feito, ## 📁 Arquivos alterados, ## 🧠 Decisoes, ## ⚠️ Atencao, ## 🎯 Proximo passo."""

# ═══════════════════════════════════════════════════════════════════════
# TASK 3 — CRITICAL FILE PROTECTION
# ═══════════════════════════════════════════════════════════════════════

def is_critical_file(filepath: str) -> bool:
    """Check if file is in the critical protection list."""
    basename = os.path.basename(filepath)
    return basename in CRITICAL_FILES

def check_critical_protection(filepath: str) -> bool:
    """Returns True if write is allowed, False if blocked."""
    if not is_critical_file(filepath):
        return True
    if ALLOW_CRITICAL_CHANGES:
        log(f"ALERTA: Sobrescrevendo arquivo critico: {filepath} (ALLOW_CRITICAL_CHANGES=true)", "PROTECT")
        return True
    log(f"BLOQUEADO: Tentativa de modificar arquivo critico: {filepath}", "PROTECT")
    log("Para permitir, execute: set ALLOW_CRITICAL_CHANGES=true", "PROTECT")
    return False

# ═══════════════════════════════════════════════════════════════════════
# TASK 2 — ROLLBACK SYSTEM
# ═══════════════════════════════════════════════════════════════════════

def create_backup(filepath: str) -> Optional[str]:
    """Create timestamped backup. Returns backup path or None."""
    if not os.path.exists(filepath):
        return None
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_dir = os.path.join(os.path.dirname(filepath) or ".", ".hermes_backups")
    os.makedirs(backup_dir, exist_ok=True)
    backup_path = os.path.join(backup_dir, f"{os.path.basename(filepath)}.{timestamp}.backup")
    try:
        shutil.copy2(filepath, backup_path)
        log(f"Backup criado: {backup_path}", "OK")
        return backup_path
    except Exception as e:
        log(f"Falha ao criar backup de {filepath}: {e}", "ERROR")
        return None

def restore_backups(backup_map: Dict[str, str]) -> int:
    """Restore all files from their backups. Returns count of restored files."""
    restored = 0
    for filepath, backup_path in backup_map.items():
        if not os.path.exists(backup_path):
            log(f"Backup nao encontrado para {filepath}: {backup_path}", "ERROR")
            continue
        try:
            shutil.copy2(backup_path, filepath)
            log(f"Rollback: {filepath} restaurado do backup", "ROLLBACK")
            restored += 1
        except Exception as e:
            log(f"Falha no rollback de {filepath}: {e}", "ERROR")
    return restored

def perform_rollback(backup_map: Dict[str, str], reason: str) -> None:
    """Execute full rollback — restore all backups."""
    log(f"INICIANDO ROLLBACK: {reason}", "ROLLBACK")
    count = restore_backups(backup_map)
    log(f"ROLLBACK CONCLUIDO: {count} arquivo(s) restaurado(s)", "ROLLBACK")
    log("Estado anterior recuperado. Projeto estavel.", "ROLLBACK")

# ═══════════════════════════════════════════════════════════════════════
# TASK 1 — BUILD VALIDATION
# ═══════════════════════════════════════════════════════════════════════

def run_build_validation(project_path: str) -> Tuple[bool, str]:
    """Run npm run build + npx tsc --noEmit. Returns (success, log_output)."""
    logs = []
    success = True

    # TypeScript check
    log("Executando validacao: npx tsc --noEmit ...", "VALIDATE")
    try:
        result = subprocess.run(
            ["npx", "tsc", "--noEmit"],
            cwd=project_path,
            capture_output=True,
            text=True,
            timeout=180,
            shell=True,
        )
        if result.returncode != 0:
            logs.append("[FALHA] tsc --noEmit:")
            logs.append(result.stderr[-2000:] if result.stderr else result.stdout[-2000:])
            success = False
            log("FALHA na validacao TypeScript!", "ERROR")
        else:
            logs.append("[OK] tsc --noEmit passou")
            log("TypeScript: OK", "OK")
    except subprocess.TimeoutExpired:
        logs.append("[FALHA] tsc --noEmit excedeu timeout")
        success = False
        log("Timeout na validacao TypeScript", "ERROR")
    except Exception as e:
        logs.append(f"[FALHA] tsc --noEmit: {e}")
        success = False

    # Build check
    log("Executando validacao: npm run build ...", "VALIDATE")
    try:
        result = subprocess.run(
            ["npm", "run", "build"],
            cwd=project_path,
            capture_output=True,
            text=True,
            timeout=300,
            shell=True,
        )
        if result.returncode != 0:
            logs.append("[FALHA] npm run build:")
            logs.append(result.stderr[-2000:] if result.stderr else result.stdout[-2000:])
            success = False
            log("FALHA na build!", "ERROR")
        else:
            logs.append("[OK] npm run build passou")
            log("Build: OK", "OK")
    except subprocess.TimeoutExpired:
        logs.append("[FALHA] npm run build excedeu timeout")
        success = False
        log("Timeout na build", "ERROR")
    except Exception as e:
        logs.append(f"[FALHA] npm run build: {e}")
        success = False

    return success, "\n".join(logs)

# ═══════════════════════════════════════════════════════════════════════
# FILE I/O
# ═══════════════════════════════════════════════════════════════════════

def read_file(path: str) -> Optional[str]:
    try:
        with open(path, "r", encoding="utf-8") as f:
            return f.read()
    except Exception:
        return None

def write_file_safe(path: str, content: str, dry_run: bool = False) -> Tuple[bool, Optional[str]]:
    """
    Write file with critical protection + backup.
    Returns (written, backup_path).
    """
    if not check_critical_protection(path):
        return False, None

    if dry_run:
        log(f"[DRY-RUN] Simulando escrita: {path} ({len(content)} caracteres)", "DRYRUN")
        return True, None

    os.makedirs(os.path.dirname(path) or ".", exist_ok=True)
    backup = None
    if os.path.exists(path):
        backup = create_backup(path)

    try:
        with open(path, "w", encoding="utf-8") as f:
            f.write(content)
        log(f"Arquivo salvo: {path}", "OK")
        return True, backup
    except Exception as e:
        log(f"Falha ao salvar {path}: {e}", "ERROR")
        return False, backup

# ═══════════════════════════════════════════════════════════════════════
# PROJECT SCANNING
# ═══════════════════════════════════════════════════════════════════════

def scan_project(project_path: str, max_files: int = 30) -> Dict[str, str]:
    context = {}
    relevant_extensions = (".tsx", ".ts", ".css", ".json", ".js", ".jsx")
    skip_dirs = ("node_modules", ".next", ".git", "dist", "build", ".hermes_backups")
    count = 0
    for root, dirs, files in os.walk(project_path):
        dirs[:] = [d for d in dirs if d not in skip_dirs]
        for file in files:
            if file.endswith(relevant_extensions) and count < max_files:
                full = os.path.join(root, file)
                rel = os.path.relpath(full, project_path)
                if file in ("package-lock.json", ".env.local", ".env"):
                    continue
                content = read_file(full)
                if content is not None:
                    context[rel] = content
                    count += 1
    return context

# ═══════════════════════════════════════════════════════════════════════
# TASK 6 — EXPANDED MEMORY
# ═══════════════════════════════════════════════════════════════════════

MEMORY_DEFAULTS = {
    "version": "2.0",
    "last_updated": "",
    "decisions": [],
    "components_created": [],
    "api_integrations": [],
    "errors_fixed": [],
    "next_steps": [],
    "architecture_decisions": [],
    "recurring_errors": [],
    "visual_rules": [],
    "deployment_history": [],
    "performance_notes": [],
}

def load_memory(project_path: str) -> dict:
    mem_path = os.path.join(project_path, "PROJECT_MEMORY.json")
    if os.path.exists(mem_path):
        try:
            with open(mem_path, "r", encoding="utf-8") as f:
                data = json.load(f)
            # Merge with defaults to add missing fields (backward compat)
            merged = {**MEMORY_DEFAULTS, **data}
            return merged
        except Exception as e:
            log(f"Erro ao ler memoria: {e}", "WARN")
    return {**MEMORY_DEFAULTS, "last_updated": datetime.now().isoformat()}

def save_memory(project_path: str, memory: dict) -> None:
    mem_path = os.path.join(project_path, "PROJECT_MEMORY.json")
    memory["last_updated"] = datetime.now().isoformat()
    with open(mem_path, "w", encoding="utf-8") as f:
        json.dump(memory, f, indent=2, ensure_ascii=False)
    log("Memoria atualizada: PROJECT_MEMORY.json", "OK")

# ═══════════════════════════════════════════════════════════════════════
# AI CALL
# ═══════════════════════════════════════════════════════════════════════

def call_deepseek(system_prompt: str, user_prompt: str) -> Optional[str]:
    import urllib.request
    import urllib.error

    url = "https://api.deepseek.com/chat/completions"
    payload = {
        "model": MODEL,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        "temperature": TEMPERATURE,
        "max_tokens": MAX_TOKENS,
        "stream": False,
    }
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        url, data=data,
        headers={"Content-Type": "application/json", "Authorization": f"Bearer {DEEPSEEK_API_KEY}"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=120) as resp:
            result = json.loads(resp.read().decode("utf-8"))
            return result["choices"][0]["message"]["content"]
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8")
        log(f"Erro HTTP {e.code}: {body}", "ERROR")
        return None
    except Exception as e:
        log(f"Erro na API: {e}", "ERROR")
        return None

def extract_files_from_response(response_text: str) -> Dict[str, str]:
    files = {}
    pattern1 = r'###\s*FILE:\s*(.+?)\n(.+?)(?=###\s*FILE:|$)'
    for path, content in re.findall(pattern1, response_text, re.DOTALL):
        files[path.strip()] = content.strip()
    pattern2 = r'```[a-z]*\s*filename="([^"]+)"\n(.+?)```'
    for path, content in re.findall(pattern2, response_text, re.DOTALL):
        files[path.strip()] = content.strip()
    return files

def build_user_prompt(mission: str, project_context: Dict[str, str], memory: dict) -> str:
    ctx_summary = []
    for rel_path, content in list(project_context.items())[:20]:
        snippet = content[:1500] + ("..." if len(content) > 1500 else "")
        ctx_summary.append(f"--- {rel_path} ---\n{snippet}\n")
    memory_json = json.dumps(memory, indent=2, ensure_ascii=False)
    return f"""MISSION: {mission}

## PROJECT CONTEXT (current files)
{''.join(ctx_summary)}

## PROJECT MEMORY
{memory_json}

## INSTRUCTIONS
1. Return ONLY code and report in the format defined in the system prompt.
2. For each created/modified file use: ### FILE: relative/path/in/project.ext
3. If modifying existing file, return COMPLETE file, not just diff.
4. If no new files, just explain what was done.
5. ALWAYS respect DESIGN_SYSTEM (hex colors, fonts, spacing).
6. ALWAYS use TypeScript strict. Never use 'any' without justification.
7. At the end, provide the Brazilian Portuguese report format.
"""

# ═══════════════════════════════════════════════════════════════════════
# TASK 5 — DRY-RUN PREVIEW
# ═══════════════════════════════════════════════════════════════════════

def dry_run_preview(files: Dict[str, str]) -> None:
    print("\n" + "=" * 60)
    print("  DRY-RUN — PREVIEW (arquivos NAO foram salvos)")
    print("=" * 60)
    for i, (rel_path, content) in enumerate(files.items(), 1):
        lines = content.count("\n") + 1
        is_critical = " [CRITICO - BLOQUEADO]" if is_critical_file(rel_path) and not ALLOW_CRITICAL_CHANGES else ""
        print(f"\n  [{i}] {rel_path} ({lines} linhas, {len(content)} bytes){is_critical}")
        preview = "\n".join(f"    | {line}" for line in content[:300].split("\n")[:12])
        print(preview)
        if len(content) > 300:
            print(f"    | ... ({len(content) - 300} bytes restantes)")
    print("\n" + "=" * 60)
    print(f"  Total: {len(files)} arquivo(s) seriam afetados")
    print("=" * 60)

# ═══════════════════════════════════════════════════════════════════════
# MAIN
# ═══════════════════════════════════════════════════════════════════════

def main() -> None:
    parser = argparse.ArgumentParser(description="HERMES LOCAL AGENT v3.0")
    parser.add_argument("--dry-run", action="store_true", help="Preview changes without saving files")
    parser.add_argument("--mission", type=str, help="Mission text (bypasses interactive prompt)")
    args = parser.parse_args()

    log("HERMES LOCAL AGENT v3.0 iniciado", "HERMES")
    dry_run = args.dry_run
    if dry_run:
        log("MODO DRY-RUN ATIVADO — nenhum arquivo sera modificado", "DRYRUN")

    # Validate project path
    if not os.path.exists(PROJECT_PATH):
        log(f"Pasta do projeto nao encontrada: {PROJECT_PATH}", "ERROR")
        sys.exit(1)

    # Validate API key
    if DEEPSEEK_API_KEY == "***":
        log("ERRO: Configure DEEPSEEK_API_KEY via env var ou no inicio do script!", "ERROR")
        sys.exit(1)

    log(f"Projeto: {PROJECT_PATH}", "INFO")
    log(f"Protecao de arquivos criticos: {'DESATIVADA (ALLOW_CRITICAL_CHANGES=true)' if ALLOW_CRITICAL_CHANGES else 'ATIVADA'}", "INFO")

    # TASK 4: Load governance
    governance = load_governance(PROJECT_PATH)

    # TASK 6: Load memory
    memory = load_memory(PROJECT_PATH)
    log(f"Memoria carregada. Decisoes: {len(memory.get('decisions', []))}, Erros recorrentes: {len(memory.get('recurring_errors', []))}", "INFO")

    # Scan project
    log("Escaneando arquivos do projeto...", "INFO")
    context = scan_project(PROJECT_PATH)
    log(f"{len(context)} arquivos carregados para contexto.", "OK")

    # Get mission
    if args.mission:
        mission = args.mission.strip()
        log(f"Missao recebida via argumento: {mission[:80]}...", "INFO")
    else:
        print("\n" + "=" * 60)
        print("DIGITE A MISSAO (ex: 'Crie componente ChatKids'):")
        print("=" * 60)
        try:
            mission = input("> ").strip()
        except (EOFError, KeyboardInterrupt):
            log("Entrada cancelada. Encerrando.", "WARN")
            return

    if not mission:
        log("Missao vazia. Encerrando.", "WARN")
        return

    # Build prompt and call AI
    user_prompt = build_user_prompt(mission, context, memory)

    log("Enviando missao para DeepSeek...", "HERMES")
    response = call_deepseek(governance, user_prompt)

    if not response:
        log("Falha na API. Encerrando.", "ERROR")
        return

    log("Resposta recebida. Processando...", "OK")

    # Save debug log
    debug_path = os.path.join(PROJECT_PATH, ".hermes_last_response.md")
    write_file_safe(debug_path, response, dry_run=dry_run)

    # Extract files
    files = extract_files_from_response(response)

    if not files:
        log("Nenhum arquivo detectado na resposta. Ver .hermes_last_response.md", "WARN")
        return

    # TASK 5: Dry-run preview
    if dry_run:
        dry_run_preview(files)
        print("\n[DRY-RUN] Validacao concluida. Execute sem --dry-run para aplicar.", "DRYRUN")
        return

    # TASK 2: Create backups, TASK 3: Check critical protection
    log(f"{len(files)} arquivo(s) detectado(s) para salvar.", "INFO")
    backup_map: Dict[str, str] = {}
    blocked_files: List[str] = []
    saved_files: List[str] = []

    for rel_path, content in files.items():
        full_path = os.path.join(PROJECT_PATH, rel_path)

        if not check_critical_protection(rel_path):
            blocked_files.append(rel_path)
            continue

        written, backup_path = write_file_safe(full_path, content)
        if written:
            saved_files.append(rel_path)
            if backup_path:
                backup_map[full_path] = backup_path
            # Track in memory
            if "components/" in rel_path:
                memory["components_created"].append({
                    "name": os.path.basename(rel_path),
                    "path": rel_path,
                    "date": datetime.now().isoformat(),
                })

    if blocked_files:
        log(f"ATENCAO: {len(blocked_files)} arquivo(s) critico(s) bloqueado(s):", "PROTECT")
        for bf in blocked_files:
            log(f"  - {bf}", "PROTECT")

    if not saved_files:
        log("Nenhum arquivo salvo (todos bloqueados ou falharam).", "WARN")
        return

    # TASK 1: Build validation
    log("Iniciando validacao automatica de build...", "VALIDATE")
    build_ok, build_log = run_build_validation(PROJECT_PATH)

    if not build_ok:
        log("VALIDACAO FALHOU! Iniciando rollback automatico...", "ERROR")
        print("\n--- LOG DE VALIDACAO ---")
        print(build_log[-3000:])
        print("--- FIM LOG ---\n")
        perform_rollback(backup_map, "Build validation failed")
        log("Missao CANCELADA devido a falha na validacao.", "ERROR")
        log("Os arquivos foram restaurados ao estado anterior.", "ROLLBACK")
        # Save build failure to memory
        memory["recurring_errors"].append({
            "date": datetime.now().isoformat(),
            "type": "build_validation_failure",
            "mission": mission,
            "log_snippet": build_log[-500:],
        })
        save_memory(PROJECT_PATH, memory)
        return

    log("Validacao de build: SUCESSO", "OK")

    # Update memory
    memory["decisions"].append({
        "id": f"DEC-{len(memory['decisions']) + 1:03d}",
        "date": datetime.now().isoformat(),
        "topic": mission,
        "decision": "Executado via Hermes Local Agent v3.0",
        "status": "active",
        "files_modified": saved_files,
        "validation_passed": True,
    })
    memory["deployment_history"].append({
        "date": datetime.now().isoformat(),
        "action": "mission_executed",
        "mission": mission,
        "files_count": len(saved_files),
        "build_validated": True,
    })
    save_memory(PROJECT_PATH, memory)

    # Done
    print("\n" + "=" * 60)
    print("RESPOSTA COMPLETA DA IA:")
    print("=" * 60)
    print(response)
    print("=" * 60)
    log("Missao concluida. Validacao OK. Revise os arquivos antes de commitar.", "HERMES")
    log("Comando sugerido: git add . && git commit -m 'feat: ...' && git push", "INFO")


if __name__ == "__main__":
    main()
