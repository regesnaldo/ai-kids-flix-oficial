const mysql = require('mysql2/promise');
async function run() {
  const conn = await mysql.createConnection({
    host: 'gateway01.us-east-1.prod.aws.tidbcloud.com',
    port: 4000,
    user: 'Xp3F88Yn4YRQBSX.root',
    password: 'SWTQOJAWC1v4H5eu',
    database: 'test',
    ssl: { rejectUnauthorized: true }
  });
  try {
    await conn.execute("ALTER TABLE users ADD COLUMN password varchar(255) DEFAULT NULL");
    console.log('Coluna password adicionada!');
  } catch(e) {
    if (e.code === 'ER_DUP_FIELDNAME') {
      console.log('Coluna password ja existe!');
    } else {
      console.error('Erro:', e.message);
    }
  }
  try {
    await conn.execute("ALTER TABLE users MODIFY COLUMN openId varchar(64) NULL");
    console.log('openId agora é nullable!');
  } catch(e) {
    console.error('Erro openId:', e.message);
  }
  await conn.end();
  console.log('Pronto!');
}
run().catch(console.error);