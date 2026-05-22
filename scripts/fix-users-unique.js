const mysql = require('mysql2/promise');
const fs = require('fs');

async function main() {
  const env = fs.readFileSync('/mnt/c/Users/REGINALDO/Desktop/AI-KIDS-OFICIAL/.env', 'utf8');
  const url = env.match(/^DATABASE_URL=(.+)$/m)[1].trim();
  const conn = await mysql.createConnection(url);
  
  // Check if unique constraint exists
  const [indexes] = await conn.query('SHOW INDEX FROM users WHERE Key_name = ?', ['users_openId_unique']);
  if (indexes.length > 0) {
    console.log('users_openId_unique já existe');
  } else {
    // Check for duplicate openId values first
    const [dupes] = await conn.query('SELECT openId, COUNT(*) as cnt FROM users GROUP BY openId HAVING cnt > 1');
    if (dupes.length > 0) {
      console.log('ATENÇÃO: openIds duplicados:', JSON.stringify(dupes));
    } else {
      try {
        await conn.query('ALTER TABLE users ADD CONSTRAINT users_openId_unique UNIQUE (openId)');
        console.log('OK: users_openId_unique adicionado');
      } catch (e) {
        console.log('ERRO:', e.code, e.message);
      }
    }
  }
  
  await conn.end();
}
main().catch(e => console.error('FATAL:', e.message));
