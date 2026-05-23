const mysql = require('mysql2/promise');
const fs = require('fs');

async function main() {
  const env = fs.readFileSync('/mnt/c/Users/REGINALDO/Desktop/AI-KIDS-OFICIAL/.env', 'utf8');
  const match = env.match(/^DATABASE_URL=(.+)$/m);
  if (!match) { console.log('NO DATABASE_URL'); process.exit(1); }
  const url = match[1].trim();
  
  const conn = await mysql.createConnection(url);
  
  // List all existing tables
  const [tables] = await conn.query('SHOW TABLES');
  const tableNames = tables.map(t => Object.values(t)[0]);
  console.log('EXISTING TABLES:', tableNames.join(', '));
  
  // Drop ab_test_experiments
  await conn.query('DROP TABLE IF EXISTS ab_test_experiments');
  console.log('DROPPED: ab_test_experiments');
  
  // Check each table for PRIMARY KEY
  for (const t of tableNames) {
    const [cols] = await conn.query(`SHOW COLUMNS FROM \`${t}\``);
    const pkCols = cols.filter(c => c.Key === 'PRI');
    console.log(`TABLE ${t}: PK columns = [${pkCols.map(c => c.Field).join(', ')}]`);
  }
  
  await conn.end();
}
main().catch(e => console.error('ERROR:', e.message));
