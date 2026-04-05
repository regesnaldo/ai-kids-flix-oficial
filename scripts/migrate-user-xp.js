require("dotenv").config({ path: ".env.local" });
const mysql = require("mysql2/promise");

async function migrate() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL não configurada");
  }
  const conn = await mysql.createConnection({
    uri: databaseUrl,
    ssl: { rejectUnauthorized: true },
  });

  try {
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS user_xp (
        id VARCHAR(36) NOT NULL PRIMARY KEY,
        user_id INT NOT NULL UNIQUE,
        xp_total INT DEFAULT 0,
        xp_this_week INT DEFAULT 0,
        streak_days INT DEFAULT 0,
        last_activity_date DATE,
        week_start_date DATE,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_xp_week (xp_this_week DESC),
        INDEX idx_xp_total (xp_total DESC)
      )
    `);
    console.log("✓ Tabela user_xp criada com sucesso!");
  } catch (err) {
    console.error("✗ Erro ao criar tabela user_xp:", err);
    process.exit(1);
  } finally {
    await conn.end();
  }
}

migrate();
