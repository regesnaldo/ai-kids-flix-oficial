const mysql = require('mysql2/promise');
const fs = require('fs');

async function main() {
  const env = fs.readFileSync('/mnt/c/Users/REGINALDO/Desktop/AI-KIDS-OFICIAL/.env', 'utf8');
  const match = env.match(/^DATABASE_URL=(.+)$/m);
  const url = match[1].trim();
  
  const conn = await mysql.createConnection(url);
  
  // Get existing tables
  const [existing] = await conn.query('SHOW TABLES');
  const existingNames = new Set(existing.map(t => Object.values(t)[0]));
  
  const sql = fs.readFileSync('/mnt/c/Users/REGINALDO/Desktop/AI-KIDS-OFICIAL/drizzle/0001_needy_thaddeus_ross.sql', 'utf8');
  const statements = sql.split('--> statement-breakpoint').map(s => s.trim()).filter(Boolean);
  
  for (const stmt of statements) {
    // Skip CREATE TABLE for tables that already exist
    const createMatch = stmt.match(/CREATE TABLE\s+`(\w+)`/i);
    if (createMatch && existingNames.has(createMatch[1])) {
      console.log(`SKIP (exists): ${createMatch[1]}`);
      continue;
    }
    
    // Skip ALTER TABLE ADD CONSTRAINT for tables that already exist
    const alterMatch = stmt.match(/ALTER TABLE\s+`(\w+)`/i);
    if (alterMatch && !existingNames.has(alterMatch[1])) {
      console.log(`SKIP (no table): ${alterMatch[1]} — ${stmt.slice(0, 60)}`);
      continue;
    }
    
    try {
      await conn.query(stmt);
      const label = createMatch ? `CREATE ${createMatch[1]}` : alterMatch ? `ALTER ${alterMatch[1]}` : stmt.slice(0, 50);
      console.log(`OK: ${label}`);
    } catch (e) {
      console.log(`ERROR (${e.code || 'UNKNOWN'}): ${stmt.slice(0, 80)}... → ${e.message}`);
    }
  }
  
  await conn.end();
  console.log('\nDONE');
}
main().catch(e => console.error('FATAL:', e.message));
