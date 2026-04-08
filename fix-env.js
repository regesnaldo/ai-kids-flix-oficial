const fs = require('fs');

const user = 'Xp3F88Yn4YRQBSX.root';
const pass = encodeURIComponent('j07pn35ZnBXIEFVU');
const host = 'gateway01.us-east-1.prod.aws.tidbcloud.com';
const port = '4000';
const db   = 'test';

const url = `mysql://${user}:${pass}@${host}:${port}/${db}?ssl=true`;

let env = fs.readFileSync('.env.local', 'utf8');

if (env.includes('DATABASE_URL=')) {
  env = env.replace(/DATABASE_URL=.*/, 'DATABASE_URL=' + url);
} else {
  env += '\nDATABASE_URL=' + url;
}

fs.writeFileSync('.env.local', env);
console.log('Gravado com sucesso!');
console.log(url);