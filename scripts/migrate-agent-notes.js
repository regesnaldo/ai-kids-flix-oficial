require("dotenv").config({ path: ".env.local" });
const mysql = require("mysql2/promise");

async function migrate() {
  const conn = await mysql.createConnection({
    host: "gateway01.us-east-1.prod.aws.tidbcloud.com",
    port: 4000,
    user: "Xp3F88Yn4YRQBSX.root",
    password: "SWTQOJAWC1v4H5eu",
    database: "test",
    ssl: { rejectUnauthorized: true },
  });

  try {
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS agent_notes (
        id VARCHAR(36) NOT NULL PRIMARY KEY,
        user_id INT NOT NULL,
        agent_id VARCHAR(100) NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_user_agent (user_id, agent_id)
      )
    `);
    console.log("✓ Tabela agent_notes criada com sucesso!");
  } catch (err) {
    console.error("✗ Erro ao criar tabela agent_notes:", err);
    process.exit(1);
  } finally {
    await conn.end();
  }
}

migrate();
