import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const items = [
  { id: "01", title: "MODELO", sub: "CABECÃO", glyph: "ML" },
  { id: "02", title: "REDE", sub: "TEIA", glyph: "RN" },
  { id: "03", title: "PARAMETROS", sub: "NEURONIOS", glyph: "PM" },
  { id: "04", title: "PESOS", sub: "HALTERES", glyph: "PS" },
  { id: "05", title: "ATIVACAO", sub: "DESPERTADOR", glyph: "FA" },
];

const outDir = path.join(process.cwd(), "public", "images", "agents");
mkdirSync(outDir, { recursive: true });

for (const [index, item] of items.entries()) {
  const hue = 265 + index * 10;
  const svg = `
  <svg xmlns='http://www.w3.org/2000/svg' width='300' height='400' viewBox='0 0 300 400'>
    <defs>
      <linearGradient id='bg' x1='0' y1='0' x2='1' y2='1'>
        <stop offset='0%' stop-color='hsl(${hue},85%,48%)'/>
        <stop offset='50%' stop-color='#1a1a2e'/>
        <stop offset='100%' stop-color='#0f3460'/>
      </linearGradient>
      <radialGradient id='glow' cx='50%' cy='40%' r='60%'>
        <stop offset='0%' stop-color='rgba(6,182,212,0.55)'/>
        <stop offset='100%' stop-color='rgba(6,182,212,0)'/>
      </radialGradient>
    </defs>
    <rect width='300' height='400' fill='url(#bg)'/>
    <rect width='300' height='400' fill='url(#glow)'/>
    <circle cx='245' cy='70' r='52' fill='rgba(147,51,234,0.35)'/>
    <circle cx='70' cy='320' r='95' fill='rgba(59,130,246,0.25)'/>
    <rect x='24' y='24' width='252' height='352' rx='16' fill='none' stroke='rgba(233,69,96,0.45)' stroke-width='2'/>
    <text x='150' y='170' fill='white' font-family='Arial,sans-serif' font-size='62' font-weight='800' text-anchor='middle'>${item.glyph}</text>
    <text x='150' y='232' fill='white' font-family='Arial,sans-serif' font-size='21' font-weight='700' text-anchor='middle'>${item.title}</text>
    <text x='150' y='261' fill='#d1d5db' font-family='Arial,sans-serif' font-size='14' font-weight='700' text-anchor='middle'>${item.sub}</text>
    <text x='150' y='300' fill='#a78bfa' font-family='Arial,sans-serif' font-size='12' font-weight='700' text-anchor='middle'>DISCOVERY #${Number(item.id)}</text>
  </svg>`;

  const png = await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();
  writeFileSync(path.join(outDir, `agent-${item.id}.png`), png);
  console.log(`OK agent-${item.id}.png`);
}
