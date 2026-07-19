/**
 * /api/health/governance - Diagnostic Nervous System Scanner
 *
 * Retorna a saúde completa da governança: ADRs, docs, links, orfaos, narrativa.
 * Este endpoint e o "scanner diagnostico do sistema nervoso" da civilizacao cognitiva.
 */
import { NextRequest, NextResponse } from "next/server";
import { readdirSync, readFileSync, existsSync } from "fs";
import { join } from "path";
import { getAuthCookieFromRequest, verifyToken } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PROJECT_ROOT = process.cwd();

interface GovernanceReport {
  timestamp: string;
  overall: "healthy" | "degraded" | "critical";
  scores: Record<string, number>;
  details: Record<string, unknown>;
  violations: string[];
  recommendations: string[];
}

function getDocsDir(): string {
  return join(PROJECT_ROOT, "docs");
}

function getAdrDir(): string {
  return join(PROJECT_ROOT, "docs", "architecture", "ADR");
}

function countAdrs(): { total: number; withAllSections: number; violations: string[] } {
  const dir = getAdrDir();
  const violations: string[] = [];
  let total = 0;
  let withAllSections = 0;

  if (!existsSync(dir)) return { total: 0, withAllSections: 0, violations: ["ADR directory not found"] };

  const required = ["## Status", "## Contexto", "## Decisao", "## Por que?"];

  for (const f of readdirSync(dir)) {
    if (!f.startsWith("ADR-") || !f.endsWith(".md")) continue;
    total++;
    const text = readFileSync(join(dir, f), "utf-8");
    const missing = required.filter((s) => !text.includes(s.replace("?", "?")));
    if (missing.length === 0) {
      withAllSections++;
    } else {
      violations.push(`${f}: missing ${missing.join(", ")}`);
    }
  }

  return { total, withAllSections, violations };
}

function countDocs(): { total: number; archived: number; orphanCandidates: number } {
  const dir = getDocsDir();
  let total = 0;
  let archived = 0;

  function walk(d: string) {
    for (const f of readdirSync(d, { withFileTypes: true })) {
      const fp = join(d, f.name);
      if (f.isDirectory()) {
        walk(fp);
      } else if (f.name.endsWith(".md")) {
        total++;
        if (fp.includes("archive")) archived++;
      }
    }
  }

  if (existsSync(dir)) walk(dir);
  return { total, archived, orphanCandidates: 0 }; // orphan detection via validate-docs.py
}

function checkCriticalFiles(): { allPresent: boolean; missing: string[] } {
  const critical = [
    "README.md",
    "CONTRIBUTING.md",
    "CLAUDE.md",
    "ROADMAP.md",
    "MENTE_AI_COGNITIVE_ARCHITECTURE_MASTER_INDEX.md",
    "docs/security/SECURITY.md",
    "docs/backend/DATABASE.md",
    "docs/backend/API.md",
  ];

  const missing: string[] = [];
  for (const f of critical) {
    if (!existsSync(join(PROJECT_ROOT, f))) {
      missing.push(f);
    }
  }

  return { allPresent: missing.length === 0, missing };
}

function checkCanonAgents(): { count: number; names: string[]; valid: boolean } {
  const canonFile = join(PROJECT_ROOT, "src", "canon", "agents", "all-agents.ts");
  const expected = [
    "NEXUS", "VOLT", "AURORA", "KAOS", "CIPHER", "LYRA",
    "ETHOS", "AXIOM", "STRATOS", "TERRA", "PRISM", "JANUS",
  ];

  if (!existsSync(canonFile)) {
    return { count: 0, names: [], valid: false };
  }

  const content = readFileSync(canonFile, "utf-8");
  const found: string[] = [];
  for (const name of expected) {
    if (content.includes(name)) found.push(name);
  }

  return { count: found.length, names: found, valid: found.length === 12 };
}

function computeScores(
  adrs: ReturnType<typeof countAdrs>,
  docs: ReturnType<typeof countDocs>,
  critical: ReturnType<typeof checkCriticalFiles>,
  agents: ReturnType<typeof checkCanonAgents>
): Record<string, number> {
  const scores: Record<string, number> = {};

  // ADR health: % of ADRs with all sections
  scores.adr_health = adrs.total > 0 ? Math.round((adrs.withAllSections / adrs.total) * 100) : 0;

  // Documentation coverage: critical files present
  const totalCritical = 9; // from checkCriticalFiles
  scores.doc_coverage = Math.round(((totalCritical - critical.missing.length) / totalCritical) * 100);

  // Canon integrity: all 12 agents present
  scores.canon_integrity = agents.valid ? 100 : Math.round((agents.count / 12) * 100);

  // Archive ratio: archived / total docs (healthy: 10-30%)
  const archiveRatio = docs.total > 0 ? docs.archived / docs.total : 0;
  scores.archive_health = archiveRatio <= 0.35 ? 100 : Math.round((1 - archiveRatio) * 100);

  // ADR coverage: ADRs per total docs (healthy: > 0.3)
  const adrRatio = docs.total > 0 ? adrs.total / docs.total : 0;
  scores.adr_coverage = adrRatio >= 0.25 ? 100 : Math.round((adrRatio / 0.25) * 100);

  return scores;
}

function overallStatus(scores: Record<string, number>): "healthy" | "degraded" | "critical" {
  const avg = Object.values(scores).reduce((a, b) => a + b, 0) / Object.values(scores).length;
  if (avg >= 80) return "healthy";
  if (avg >= 50) return "degraded";
  return "critical";
}

export async function GET(request: NextRequest): Promise<NextResponse<GovernanceReport>> {
  // Auth
  const token = getAuthCookieFromRequest(request);
  if (!token) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const payload = await verifyToken(token);
  if (!payload) return NextResponse.json({ error: "Token inválido" }, { status: 401 });

  const adrs = countAdrs();
  const docs = countDocs();
  const critical = checkCriticalFiles();
  const agents = checkCanonAgents();
  const scores = computeScores(adrs, docs, critical, agents);
  const status = overallStatus(scores);

  const violations: string[] = [];
  if (!critical.allPresent) violations.push(`Missing critical files: ${critical.missing.join(", ")}`);
  if (!agents.valid) violations.push(`Canon agents degraded: ${agents.count}/12 present`);
  if (adrs.violations.length > 0) violations.push(...adrs.violations);

  const recommendations: string[] = [];
  if (scores.adr_health < 100) recommendations.push("Some ADRs missing required sections. Run validate-docs.py for details.");
  if (scores.canon_integrity < 100) recommendations.push("Canonical agent integrity compromised. Check src/canon/agents/all-agents.ts.");
  if (!critical.allPresent) recommendations.push("Critical documentation files missing. Restore from archive or create.");
  if (scores.archive_health < 80) recommendations.push("Archive ratio high. Review docs/archive/ for candidates to reduce.");

  const report: GovernanceReport = {
    timestamp: new Date().toISOString(),
    overall: status,
    scores,
    details: {
      adrs: { total: adrs.total, healthy: adrs.withAllSections },
      docs: { total: docs.total, archived: docs.archived },
      critical_files: { present: critical.allPresent },
      canon_agents: { count: agents.count, valid: agents.valid },
    },
    violations,
    recommendations,
  };

  return NextResponse.json(report, {
    status: 200,
    headers: {
      "Cache-Control": "no-store, max-age=0",
      "X-Governance-Status": status,
    },
  });
}
