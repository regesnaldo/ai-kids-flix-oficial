/**
 * MENTE.AI — Migração Fase 2
 * Script: scripts/migrate-fase2.js
 *
 * Cria as 4 tabelas da Fase 2 no banco TiDB Cloud (MySQL):
 *   1. agent_metadata        — metadados de gamificação dos agentes
 *   2. user_agent_progress   — progresso por usuário × agente
 *   3. agent_combinations    — catálogo de combinações de agentes
 *   4. user_combinations     — combinações descobertas por usuário
 *
 * USO:
 *   node scripts/migrate-fase2.js
 *   node scripts/migrate-fase2.js --dry-run   (só mostra o SQL, não executa)
 *   node scripts/migrate-fase2.js --seed       (cria tabelas + popula dados iniciais)
 *
 * SEGURO para re-execução: usa CREATE TABLE IF NOT EXISTS.
 */

const mysql = require("mysql2/promise");

// ─── Configuração ─────────────────────────────────────────────────────────────

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL não configurada");
}

const DB_CONFIG = {
  uri: databaseUrl,
  ssl: { rejectUnauthorized: true },
};

const DRY_RUN = process.argv.includes("--dry-run");
const SEED    = process.argv.includes("--seed");

// ─── SQL das tabelas ──────────────────────────────────────────────────────────

const TABELAS_SQL = [
  {
    nome: "agent_metadata",
    sql: `
      CREATE TABLE IF NOT EXISTS agent_metadata (
        agent_id              VARCHAR(100)  NOT NULL,
        temporada             INT           NOT NULL DEFAULT 1,
        ordem_na_temporada    INT           NOT NULL DEFAULT 0,
        fase                  INT           NOT NULL DEFAULT 1,
        categoria             ENUM(
          'fundamentos','linguagens','criacao',
          'inovacao','ferramentas','colaborativos'
        )                     NOT NULL DEFAULT 'fundamentos',
        tags                  JSON          NOT NULL DEFAULT (JSON_ARRAY()),
        dificuldade           INT           NOT NULL DEFAULT 1,
        xp_por_interacao      INT           NOT NULL DEFAULT 15,
        xp_por_concluir       INT           NOT NULL DEFAULT 100,
        bloqueado_por_padrao  TINYINT(1)    NOT NULL DEFAULT 0,
        requisitos_desbloqueio JSON         NOT NULL DEFAULT (JSON_OBJECT()),
        created_at            TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at            TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (agent_id),
        INDEX idx_agent_temporada (temporada),
        INDEX idx_agent_categoria (categoria),
        INDEX idx_agent_fase      (fase)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `,
  },
  {
    nome: "user_agent_progress",
    sql: `
      CREATE TABLE IF NOT EXISTS user_agent_progress (
        id                  VARCHAR(36)   NOT NULL,
        user_id             INT           NOT NULL,
        agent_id            VARCHAR(100)  NOT NULL,
        desbloqueado        TINYINT(1)    NOT NULL DEFAULT 0,
        desbloqueado_em     TIMESTAMP     NULL,
        interacoes_total    INT           NOT NULL DEFAULT 0,
        notas_total         INT           NOT NULL DEFAULT 0,
        xp_ganho            INT           NOT NULL DEFAULT 0,
        nivel_interacao     INT           NOT NULL DEFAULT 0,
        completado_em       TIMESTAMP     NULL,
        created_at          TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at          TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        UNIQUE KEY uq_user_agent_progress (user_id, agent_id),
        INDEX idx_uap_user_desbloqueado  (user_id, desbloqueado),
        INDEX idx_uap_agent_interacoes   (agent_id, interacoes_total),
        CONSTRAINT fk_uap_user FOREIGN KEY (user_id)
          REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `,
  },
  {
    nome: "agent_combinations",
    sql: `
      CREATE TABLE IF NOT EXISTS agent_combinations (
        id                     VARCHAR(36)   NOT NULL,
        agent_a_id             VARCHAR(100)  NOT NULL,
        agent_b_id             VARCHAR(100)  NOT NULL,
        tipo_sinergia          ENUM(
          'amplificacao','contrabalanco','fusao','especializacao'
        )                      NOT NULL DEFAULT 'amplificacao',
        sinergia_bonus         INT           NOT NULL DEFAULT 0,
        xp_bonus               INT           NOT NULL DEFAULT 0,
        descricao              TEXT,
        requisitos_desbloqueio JSON          NOT NULL DEFAULT (JSON_OBJECT()),
        ativa                  TINYINT(1)    NOT NULL DEFAULT 1,
        created_at             TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        UNIQUE KEY uq_combination_par (agent_a_id, agent_b_id),
        INDEX idx_comb_agent_a  (agent_a_id),
        INDEX idx_comb_agent_b  (agent_b_id),
        INDEX idx_comb_sinergia (tipo_sinergia)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `,
  },
  {
    nome: "user_combinations",
    sql: `
      CREATE TABLE IF NOT EXISTS user_combinations (
        id              VARCHAR(36)   NOT NULL,
        user_id         INT           NOT NULL,
        combination_id  VARCHAR(36)   NOT NULL,
        descoberta_em   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
        vezes_usada     INT           NOT NULL DEFAULT 1,
        ultimo_uso_em   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        UNIQUE KEY uq_user_combination (user_id, combination_id),
        INDEX idx_uc_user_uso  (user_id, vezes_usada),
        INDEX idx_uc_combo_uso (combination_id, vezes_usada),
        CONSTRAINT fk_uc_user FOREIGN KEY (user_id)
          REFERENCES users(id) ON DELETE CASCADE,
        CONSTRAINT fk_uc_combination FOREIGN KEY (combination_id)
          REFERENCES agent_combinations(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `,
  },
];

// ─── Seed: agentes da Fase 1 no agent_metadata ───────────────────────────────
// IDs retirados do all-agents.ts (primeiros 10 agentes do MVP)

const SEED_AGENTES = [
  { agentId: "nexus",  temporada: 1, ordem: 0, fase: 1, categoria: "fundamentos", tags: ["orquestrador","conexao"],    dificuldade: 1, bloqueado: false },
  { agentId: "volt",   temporada: 1, ordem: 1, fase: 1, categoria: "fundamentos", tags: ["energia","motivacao"],       dificuldade: 1, bloqueado: false },
  { agentId: "aurora", temporada: 1, ordem: 2, fase: 1, categoria: "criacao",     tags: ["criatividade","inovacao"],   dificuldade: 2, bloqueado: false },
  { agentId: "ethos",  temporada: 1, ordem: 3, fase: 1, categoria: "fundamentos", tags: ["etica","filosofia"],         dificuldade: 2, bloqueado: false },
  { agentId: "logos",  temporada: 1, ordem: 4, fase: 1, categoria: "linguagens",  tags: ["linguagem","logica"],        dificuldade: 2, bloqueado: false },
  { agentId: "psyche", temporada: 1, ordem: 5, fase: 1, categoria: "fundamentos", tags: ["psicologia","emocao"],       dificuldade: 2, bloqueado: false },
  // Agentes Fase 2 (bloqueados por padrão)
  { agentId: "forge",  temporada: 2, ordem: 0, fase: 2, categoria: "ferramentas", tags: ["construcao","prototipagem"], dificuldade: 3, bloqueado: true, xpMinimo: 200 },
  { agentId: "cipher", temporada: 2, ordem: 1, fase: 2, categoria: "linguagens",  tags: ["criptografia","seguranca"],  dificuldade: 3, bloqueado: true, xpMinimo: 200 },
  { agentId: "flux",   temporada: 2, ordem: 2, fase: 2, categoria: "inovacao",    tags: ["mudanca","adaptacao"],       dificuldade: 4, bloqueado: true, xpMinimo: 350 },
  { agentId: "synth",  temporada: 2, ordem: 3, fase: 2, categoria: "criacao",     tags: ["sintese","geracao"],         dificuldade: 4, bloqueado: true, xpMinimo: 350 },
];

const SEED_COMBINATIONS = [
  { agentA: "nexus",  agentB: "volt",   tipo: "amplificacao",  bonus: 30, xpBonus: 25, desc: "NEXUS conecta + VOLT energiza: aprendizado acelerado" },
  { agentA: "aurora", agentB: "ethos",  tipo: "contrabalanco", bonus: 40, xpBonus: 30, desc: "AURORA cria sem limites, ETHOS filtra com responsabilidade" },
  { agentA: "logos",  agentB: "psyche", tipo: "fusao",         bonus: 50, xpBonus: 40, desc: "Razão + Emoção: a combinação mais poderosa do MENTE.AI" },
  { agentA: "nexus",  agentB: "ethos",  tipo: "especializacao", bonus: 35, xpBonus: 30, desc: "NEXUS aplica, ETHOS questiona: IA com consciência" },
  { agentA: "aurora", agentB: "volt",   tipo: "amplificacao",  bonus: 45, xpBonus: 35, desc: "Criatividade + Energia: ideias que se tornam realidade" },
];

// ─── Execução ─────────────────────────────────────────────────────────────────

async function run() {
  console.log("\n🚀 MENTE.AI — Migração Fase 2");
  console.log("═".repeat(50));
  if (DRY_RUN) console.log("⚠️  MODO DRY-RUN: nenhuma alteração será feita\n");

  let conn;
  if (!DRY_RUN) {
    conn = await mysql.createConnection(DB_CONFIG);
    console.log("✅ Conectado ao banco TiDB Cloud\n");
  }

  // Criar tabelas
  for (const tabela of TABELAS_SQL) {
    console.log(`📋 Criando tabela: ${tabela.nome}`);
    if (DRY_RUN) {
      console.log(tabela.sql.trim().slice(0, 120) + "...\n");
      continue;
    }
    try {
      await conn.execute(tabela.sql);
      console.log(`   ✅ ${tabela.nome} — OK\n`);
    } catch (e) {
      console.error(`   ❌ ${tabela.nome} — ERRO:`, e.message);
      await conn.end();
      process.exit(1);
    }
  }

  // Seed opcional
  if (SEED && !DRY_RUN) {
    console.log("🌱 Populando dados iniciais...\n");
    const crypto = require("crypto");

    // Inserir agent_metadata
    for (const a of SEED_AGENTES) {
      const requisitos = a.xpMinimo ? JSON.stringify({ xpMinimo: a.xpMinimo }) : "{}";
      const tags = JSON.stringify(a.tags);
      await conn.execute(`
        INSERT INTO agent_metadata
          (agent_id, temporada, ordem_na_temporada, fase, categoria, tags,
           dificuldade, bloqueado_por_padrao, requisitos_desbloqueio)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          temporada=VALUES(temporada), fase=VALUES(fase), categoria=VALUES(categoria)
      `, [a.agentId, a.temporada, a.ordem, a.fase, a.categoria, tags, a.dificuldade, a.bloqueado ? 1 : 0, requisitos]);
      console.log(`   ✅ agent_metadata: ${a.agentId}`);
    }

    // Inserir agent_combinations
    for (const c of SEED_COMBINATIONS) {
      // Garante ordem lexicográfica (invariante do sistema)
      const [aId, bId] = [c.agentA, c.agentB].sort();
      await conn.execute(`
        INSERT INTO agent_combinations
          (id, agent_a_id, agent_b_id, tipo_sinergia, sinergia_bonus, xp_bonus, descricao)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          tipo_sinergia=VALUES(tipo_sinergia), sinergia_bonus=VALUES(sinergia_bonus)
      `, [crypto.randomUUID(), aId, bId, c.tipo, c.bonus, c.xpBonus, c.desc]);
      console.log(`   ✅ combination: ${aId} × ${bId}`);
    }
    console.log("\n🌱 Seed concluído!");
  }

  if (conn) await conn.end();

  console.log("\n" + "═".repeat(50));
  console.log("🎉 Migração Fase 2 concluída com sucesso!");
  console.log("\nPróximos passos:");
  console.log("  • Verifique as tabelas no TiDB Console");
  console.log("  • Execute: node scripts/migrate-fase2.js --seed (para dados iniciais)");
  console.log("  • Rode: npm run typecheck para validar o schema Drizzle");
}

run().catch((e) => {
  console.error("\n❌ Falha na migração:", e.message);
  process.exit(1);
});
