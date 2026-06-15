import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const conn = await mysql.createConnection(process.env.DATABASE_URL);

// Check knowledge tables exist
const [tables] = await conn.execute('SHOW TABLES LIKE "knowledge_%"');
console.log('Tabelas knowledge_*:');
for (const t of tables) console.log('  \u2714', Object.values(t)[0]);

// Count records
const [unitCount] = await conn.execute('SELECT COUNT(*) as c FROM knowledge_unit');
const [assetCount] = await conn.execute('SELECT COUNT(*) as c FROM knowledge_asset');
const [edgeCount] = await conn.execute('SELECT COUNT(*) as c FROM knowledge_graph_edge');
console.log(`\nRegistros:`);
console.log(`  knowledge_unit:  ${unitCount[0].c}`);
console.log(`  knowledge_asset: ${assetCount[0].c}`);
console.log(`  knowledge_graph_edge: ${edgeCount[0].c}`);

// Verify consistency: assets should reference valid units
const [orphans] = await conn.execute(`
  SELECT ka.id FROM knowledge_asset ka
  LEFT JOIN knowledge_unit ku ON ka.knowledge_unit_id = ku.id
  WHERE ku.id IS NULL
`);
if (orphans.length > 0) {
  console.log(`\n\u274c Orphans: ${orphans.length} assets sem unit`);
} else {
  console.log(`\n\u2714 Nenhum orphan — todos assets referenciam units válidas`);
}

// Show sample records
const [samples] = await conn.execute(
  'SELECT id, agent_id, season, episode, source, status, cache_key FROM knowledge_asset ORDER BY created_at DESC LIMIT 3'
);
console.log(`\nÚltimos assets:`);
for (const s of samples) {
  console.log(`  ${s.id.slice(0,8)}... | ${s.agent_id} S${s.season}E${s.episode} | source=${s.source} | status=${s.status} | cache=${s.cache_key}`);
}

await conn.end();
