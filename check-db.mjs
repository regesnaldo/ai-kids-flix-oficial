import mysql from 'mysql2/promise';
import { readFileSync } from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const url = process.env.DATABASE_URL;
if (!url) {
  console.log("No DATABASE_URL found");
  process.exit(1);
}

const conn = await mysql.createConnection(url);
const [rows] = await conn.query(`
  SELECT e.id, e.seriesId, e.seasonNumber, e.episodeNumber, e.title, e.videoUrl, e.thumbnail, 
         s.title as seriesTitle, s.image as seriesImage, s.category
  FROM episodes e 
  LEFT JOIN series s ON e.seriesId = s.id 
  ORDER BY e.seriesId, e.seasonNumber, e.episodeNumber
`);
console.log(JSON.stringify(rows, null, 2));

const [seriesRows] = await conn.query(`SELECT * FROM series ORDER BY id`);
console.log("\n=== SERIES ===");
console.log(JSON.stringify(seriesRows, null, 2));

await conn.end();
