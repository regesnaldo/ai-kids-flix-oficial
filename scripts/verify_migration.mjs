import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const conn = await mysql.createConnection(process.env.DATABASE_URL);
const [rows] = await conn.execute('SHOW TABLES LIKE "knowledge_%"');
await conn.end();

console.log('Tabelas criadas:');
for (const r of rows) {
  console.log('  \u2714', Object.values(r)[0]);
}
