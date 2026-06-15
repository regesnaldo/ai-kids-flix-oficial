-- ═══════════════════════════════════════════════════════════════════════════
-- KNOWLEDGE MODEL — Migration
-- ═══════════════════════════════════════════════════════════════════════════
-- Gerado manualmente a partir de src/lib/db/schema.ts
-- Branch: feat/knowledge-model
-- ⚠️ REVISAR antes de executar

-- ─── knowledge_unit — O ÁTOMO DE CONHECIMENTO ────────────────────────────

CREATE TABLE IF NOT EXISTS knowledge_unit (
  id                  VARCHAR(36) PRIMARY KEY,
  title               VARCHAR(256) NOT NULL,
  slug                VARCHAR(256) NOT NULL UNIQUE,
  learning_objective  TEXT NOT NULL,
  cognitive_level     VARCHAR(32) NOT NULL DEFAULT 'understand',
  difficulty          VARCHAR(16) DEFAULT 'beginner',
  estimated_time_min  INT,
  skills              JSON,
  tags                JSON,
  agent_domain        VARCHAR(32),
  version             INT DEFAULT 1,
  status              VARCHAR(16) DEFAULT 'draft',
  created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_ku_cognitive (cognitive_level, difficulty),
  INDEX idx_ku_agent (agent_domain),
  INDEX idx_ku_status (status)
);

-- ─── knowledge_asset — A FORMA DE APRESENTAÇÃO ───────────────────────────

CREATE TABLE IF NOT EXISTS knowledge_asset (
  id                  VARCHAR(36) PRIMARY KEY,
  knowledge_unit_id   VARCHAR(36) NOT NULL,
  agent_id            VARCHAR(32),
  season              INT,
  episode             INT,
  type                VARCHAR(32) NOT NULL,
  content             JSON NOT NULL,
  metadata            JSON,
  source              VARCHAR(16) DEFAULT 'manual',
  generated_by        VARCHAR(64),
  generated_at        TIMESTAMP,
  version             INT DEFAULT 1,
  status              VARCHAR(16) DEFAULT 'draft',
  cache_key           VARCHAR(64),
  created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_ka_unit (knowledge_unit_id),
  INDEX idx_ka_series (agent_id, season, episode),
  INDEX idx_ka_type_status (type, status),
  INDEX idx_ka_cache (cache_key)
);

-- ─── knowledge_graph_edge — A TEIA DE DEPENDÊNCIAS ───────────────────────

CREATE TABLE IF NOT EXISTS knowledge_graph_edge (
  id              VARCHAR(36) PRIMARY KEY,
  from_unit_id    VARCHAR(36) NOT NULL,
  to_unit_id      VARCHAR(36) NOT NULL,
  relationship    VARCHAR(32) NOT NULL,
  weight          REAL DEFAULT 1.0,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  UNIQUE INDEX uq_kge_edge (from_unit_id, to_unit_id, relationship),
  INDEX idx_kge_from (from_unit_id),
  INDEX idx_kge_to (to_unit_id)
);
