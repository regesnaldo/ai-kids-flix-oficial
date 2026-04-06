const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const mysql = require("mysql2/promise");

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const raw = fs.readFileSync(filePath, "utf8");
  const lines = raw.split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex <= 0) continue;

    const key = trimmed.slice(0, eqIndex).trim();
    let value = trimmed.slice(eqIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (process.env[key] == null || process.env[key] === "") {
      process.env[key] = value;
    }
  }
}

function isLocalHost(hostname) {
  return (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "::1" ||
    hostname.endsWith(".local")
  );
}

function parseBool(value, defaultValue) {
  if (value == null || value === "") return defaultValue;
  return value.toLowerCase() === "true";
}

function isIgnorableMigrationError(error) {
  const code = error?.code ?? "";
  const errno = Number(error?.errno);
  const message = String(error?.message ?? "").toLowerCase();

  if (code === "ER_TABLE_EXISTS_ERROR" || errno === 1050) return true;
  if (code === "ER_DUP_KEYNAME" || errno === 1061) return true;
  if (code === "ER_DUP_FIELDNAME" || errno === 1060) return true;
  if (code === "ER_FK_DUP_NAME" || errno === 1826) return true;
  if (message.includes("already exists")) return true;
  if (message.includes("duplicate") && message.includes("constraint")) return true;
  if (message.includes("duplicate") && message.includes("index")) return true;

  return false;
}

async function run() {
  loadEnvFile(path.resolve(process.cwd(), ".env.local"));
  loadEnvFile(path.resolve(process.cwd(), ".env"));

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL não configurada no ambiente.");
  }

  const url = new URL(databaseUrl);
  const local = isLocalHost(url.hostname);
  const useSsl = parseBool(process.env.DB_SSL, !local);
  const rejectUnauthorized = parseBool(process.env.DB_SSL_REJECT_UNAUTHORIZED, !local);
  const caPath = process.env.DB_SSL_CA_PATH;

  const connectionConfig = {
    uri: databaseUrl,
    multipleStatements: true,
  };

  if (useSsl) {
    connectionConfig.ssl = {
      rejectUnauthorized,
    };

    if (caPath) {
      connectionConfig.ssl.ca = fs.readFileSync(path.resolve(process.cwd(), caPath), "utf8");
    }
  }

  const migrationsDir = path.resolve(process.cwd(), "drizzle");
  const sqlFiles = fs
    .readdirSync(migrationsDir)
    .filter((file) => file.endsWith(".sql"))
    .sort((a, b) => a.localeCompare(b));

  if (sqlFiles.length === 0) {
    console.log("Nenhuma migration .sql encontrada em ./drizzle");
    return;
  }

  const conn = await mysql.createConnection(connectionConfig);
  try {
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS _narrative_migrations (
        id varchar(255) PRIMARY KEY,
        checksum char(64) NOT NULL,
        applied_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    for (const fileName of sqlFiles) {
      const migrationPath = path.join(migrationsDir, fileName);
      const sql = fs.readFileSync(migrationPath, "utf8");
      const checksum = crypto.createHash("sha256").update(sql).digest("hex");
      const statements = sql
        .split(/-->\s*statement-breakpoint/g)
        .map((chunk) => chunk.trim())
        .filter(Boolean);

      const [rows] = await conn.execute(
        "SELECT id, checksum FROM _narrative_migrations WHERE id = ? LIMIT 1",
        [fileName],
      );

      const existing = rows[0];
      if (existing) {
        if (existing.checksum !== checksum) {
          throw new Error(
            `Migration ${fileName} já aplicada com checksum diferente. Crie uma nova migration em vez de editar a antiga.`,
          );
        }
        console.log(`- SKIP ${fileName} (já aplicada)`);
        continue;
      }

      console.log(`- APPLY ${fileName}`);
      for (const statement of statements) {
        try {
          await conn.query(statement);
        } catch (statementError) {
          if (isIgnorableMigrationError(statementError)) {
            console.log(`  - SKIP statement (${statementError.code || statementError.errno || "ignorable"})`);
            continue;
          }
          throw statementError;
        }
      }
      await conn.execute(
        "INSERT INTO _narrative_migrations (id, checksum) VALUES (?, ?)",
        [fileName, checksum],
      );
    }

    console.log("Migrations narrativas aplicadas com sucesso.");
  } finally {
    await conn.end();
  }
}

run().catch((error) => {
  console.error("[migrate:narrative] erro:", error.message);
  process.exit(1);
});

