const mysql = require('mysql2/promise');
const fs = require('fs');

async function main() {
  const env = fs.readFileSync('/mnt/c/Users/REGINALDO/Desktop/AI-KIDS-OFICIAL/.env', 'utf8');
  const match = env.match(/^DATABASE_URL=(.+)$/m);
  const url = match[1].trim();
  
  const conn = await mysql.createConnection(url);
  
  // Check existing tables and their PKs
  const [tables] = await conn.query('SHOW TABLES');
  const tableNames = tables.map(t => Object.values(t)[0]);
  
  for (const t of tableNames) {
    const [cols] = await conn.query(`SHOW COLUMNS FROM \`${t}\``);
    const pkCols = cols.filter(c => c.Key === 'PRI');
    const hasAutoInc = cols.some(c => c.Extra && c.Extra.includes('auto_increment'));
    console.log(`${t}: PK=[${pkCols.map(c => c.Field).join(',')}] auto_inc=${hasAutoInc}`);
  }
  
  await conn.end();
}
main().catch(e => console.error('ERROR:', e.message));
