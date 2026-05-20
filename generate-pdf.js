const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const doc = new PDFDocument({
  size: 'A4',
  margins: { top: 50, bottom: 50, left: 60, right: 60 },
  info: {
    Title: 'Guia Definitivo OpenCode + Claude Code Gratis',
    Author: 'MENTE.AI',
    Subject: 'Configuracao completa para iniciantes no Windows',
  },
});

const outputPath = path.join(__dirname, 'GUIA-OPENCODE-CLAUDE.pdf');
doc.pipe(fs.createWriteStream(outputPath));

const FONT_REGULAR = 'Helvetica';
const FONT_BOLD = 'Helvetica-Bold';
const FONT_OBLIQUE = 'Helvetica-Oblique';

const BG_DARK = '#0a0a1a';
const BG_CARD = '#1a1a2e';
const TEXT_PRIMARY = '#ffffff';
const TEXT_SECONDARY = '#94a3b8';
const ACCENT_BLUE = '#3b82f6';
const ACCENT_PURPLE = '#8b5cf6';
const ACCENT_GREEN = '#10b981';
const ACCENT_RED = '#ef4444';
const ACCENT_YELLOW = '#f59e0b';

let pageNum = 0;

function addPageNumber() {
  pageNum++;
  doc.save();
  doc.fontSize(8).fillColor(TEXT_SECONDARY);
  doc.text(`Pagina ${pageNum}`, doc.page.width - 60, doc.page.height - 30, { align: 'right' });
  doc.restore();
}

function coverPage() {
  // Background gradient (simulated)
  doc.rect(0, 0, doc.page.width, doc.page.height).fill(BG_DARK);

  // Decorative lines
  doc.save();
  for (let i = 0; i < 50; i++) {
    const y = Math.random() * doc.page.height;
    const x = Math.random() * doc.page.width;
    doc.rect(x, y, 1, 1).fill(ACCENT_BLUE).opacity(0.3);
  }
  doc.restore();

  // Accent bar at top
  doc.rect(0, 0, doc.page.width, 8).fill(ACCENT_PURPLE);

  // Title
  doc.save();
  doc.fontSize(36).fillColor(TEXT_PRIMARY);
  doc.text('GUIA DEFINITIVO', 60, 180, { align: 'center', width: doc.page.width - 120 });
  doc.fontSize(44).fillColor(ACCENT_PURPLE);
  doc.text('OPENCODE + CLAUDE CODE', 60, 220, { align: 'center', width: doc.page.width - 120 });
  doc.fontSize(36).fillColor(ACCENT_GREEN);
  doc.text('GRATIS', 60, 270, { align: 'center', width: doc.page.width - 120 });
  doc.restore();

  // Divider
  doc.save();
  doc.moveTo(150, 330).lineTo(doc.page.width - 150, 330).strokeColor(ACCENT_BLUE).opacity(0.5).stroke();
  doc.restore();

  // Subtitle
  doc.save();
  doc.fontSize(18).fillColor(TEXT_SECONDARY);
  doc.text('Configuracao completa para iniciantes no Windows', 60, 350, { align: 'center', width: doc.page.width - 120 });
  doc.restore();

  // Info box
  doc.save();
  doc.roundedRect(120, 410, doc.page.width - 240, 80, 10).fill(BG_CARD);
  doc.fontSize(12).fillColor(TEXT_SECONDARY);
  doc.text('Versao 1.0 • Maio 2026 • MENTE.AI', 60, 430, { align: 'center', width: doc.page.width - 120 });
  doc.text('Plataforma: Windows 11 • PowerShell 7+', 60, 452, { align: 'center', width: doc.page.width - 120 });
  doc.restore();

  // Bottom bar
  doc.rect(0, doc.page.height - 8, doc.page.width, 8).fill(ACCENT_BLUE);
  addPageNumber();
}

function sectionTitle(text, color = ACCENT_PURPLE) {
  doc.addPage();
  doc.rect(0, 0, doc.page.width, doc.page.height).fill(BG_DARK);
  doc.rect(0, 0, doc.page.width, 6).fill(color);

  doc.save();
  doc.fontSize(28).fillColor(color);
  doc.text(text, 60, 80, { align: 'center', width: doc.page.width - 120 });
  doc.restore();

  doc.save();
  doc.moveTo(120, 120).lineTo(doc.page.width - 120, 120).strokeColor(color).opacity(0.4).stroke();
  doc.restore();
  addPageNumber();
}

function heading1(text, y = 160) {
  doc.save();
  doc.fontSize(20).fillColor(ACCENT_PURPLE);
  doc.text(text, 60, y, { continued: false });
  doc.restore();
  return y + 30;
}

function heading2(text, y) {
  doc.save();
  doc.fontSize(15).fillColor(ACCENT_BLUE);
  doc.text(text, 60, y, { continued: false });
  doc.restore();
  return y + 24;
}

function bodyText(text, y, color = TEXT_SECONDARY, size = 11) {
  doc.save();
  doc.fontSize(size).fillColor(color);
  doc.text(text, 60, y, { width: doc.page.width - 120, align: 'justify' });
  doc.restore();
  return y + 20;
}

function codeBlock(code, y, lang = 'powershell') {
  const lines = code.split('\n').length;
  const blockHeight = lines * 16 + 20;

  doc.save();
  doc.roundedRect(60, y, doc.page.width - 120, blockHeight, 6).fill('#111122');
  doc.fontSize(9).fillColor(ACCENT_GREEN);
  doc.font(FONT_REGULAR);
  doc.text(code, 75, y + 10, { width: doc.page.width - 150 });
  doc.restore();
  return y + blockHeight + 10;
}

function alertBox(text, y, type = 'info') {
  const colors = {
    info: { bg: '#1e293b', border: ACCENT_BLUE, icon: 'ℹ' },
    warning: { bg: '#1c1917', border: ACCENT_YELLOW, icon: '⚠' },
    danger: { bg: '#1c1017', border: ACCENT_RED, icon: '🔴' },
    success: { bg: '#101c17', border: ACCENT_GREEN, icon: '✅' },
  };
  const c = colors[type] || colors.info;
  const lines = Math.ceil(text.length / 70);
  const h = Math.max(50, lines * 16 + 30);

  doc.save();
  doc.roundedRect(60, y, doc.page.width - 120, h, 6).fill(c.bg);
  doc.roundedRect(60, y, doc.page.width - 120, h, 6).lineWidth(1).strokeColor(c.border).opacity(0.5).stroke();
  doc.opacity(1);
  doc.fontSize(10).fillColor(TEXT_PRIMARY);
  doc.text(`${c.icon} ${text}`, 75, y + 12, { width: doc.page.width - 150 });
  doc.restore();
  return y + h + 8;
}

function checklist(items, y) {
  doc.save();
  doc.fontSize(11).fillColor(TEXT_PRIMARY);
  items.forEach((item, i) => {
    doc.text(`  ☐  ${item}`, 60, y + i * 20, { width: doc.page.width - 120 });
  });
  doc.restore();
  return y + items.length * 20 + 10;
}

function table(headers, rows, y) {
  const colWidth = (doc.page.width - 120) / headers.length;
  
  // Header
  doc.save();
  doc.rect(60, y, doc.page.width - 120, 22).fill(BG_CARD);
  doc.fontSize(9).fillColor(ACCENT_PURPLE).font(FONT_BOLD);
  headers.forEach((h, i) => {
    doc.text(h, 60 + i * colWidth + 5, y + 5, { width: colWidth - 10 });
  });
  doc.restore();

  y += 22;

  // Rows
  rows.forEach((row, ri) => {
    doc.save();
    if (ri % 2 === 0) doc.rect(60, y, doc.page.width - 120, 20).fill('#0f0f1f');
    doc.fontSize(8).fillColor(TEXT_SECONDARY);
    row.forEach((cell, ci) => {
      doc.text(cell, 60 + ci * colWidth + 5, y + 4, { width: colWidth - 10 });
    });
    doc.restore();
    y += 20;
  });

  return y + 10;
}

// ========== BUILD DOCUMENT ==========

// Cover
coverPage();

// Chapter 1
sectionTitle('CAPITULO 01 • O que e OpenCode');
let y = 160;
y = heading1('🤔 O que e OpenCode?', y);
y = bodyText('OpenCode e uma ferramenta de codigo aberto que roda direto no seu terminal (PowerShell). Ela usa Inteligencia Artificial para ajudar voce a programar, criar arquivos, corrigir bugs e automatizar tarefas — tudo por texto.', y);

y = heading2('🔧 O que ela faz?', y + 10);
const features = [
  '✅ Edita arquivos automaticamente',
  '✅ Cria projetos do zero',
  '✅ Corrige erros de codigo',
  '✅ Explica o que cada comando faz',
  '✅ Funciona offline (depois de instalada)',
  '✅ Gratuita e open-source',
];
checklist(features, y);

y = heading2('💡 Em linguagem simples:', y + features.length * 20 + 10);
y = alertBox('"E como ter um programador senior sentado ao seu lado, que le e escreve codigo no seu computador, e voce so precisa conversar com ele."', y, 'info');

// Chapter 2
sectionTitle('CAPITULO 02 • O que e Claude Code');
y = 160;
y = heading1('🤔 O que e?', y);
y = bodyText('Claude Code e um assistente de IA criado pela Anthropic (a mesma empresa do Claude). Diferente do OpenCode, ele roda dentro do VS Code como uma extensao.', y);

y = heading2('🆚 OpenCode vs Claude Code', y + 10);
y = table(
  ['Recurso', 'OpenCode', 'Claude Code'],
  [
    ['Onde roda', 'Terminal (PowerShell)', 'VS Code'],
    ['Precisa de API Key', 'Sim (qualquer provedor)', 'Sim (Anthropic)'],
    ['Codigo aberto', '✅ Sim', '❌ Nao'],
    ['Instalacao', 'npm global (simples)', 'Extensao VS Code'],
    ['Ideal para', 'Automacao e scripts', 'Programacao visual'],
  ],
  y
);

y = heading2('🤝 Eles trabalham juntos!', y + 10);
y = bodyText('Voce pode usar OpenCode no terminal para tarefas rapidas e Claude Code no VS Code para programar visualmente. Os dois se complementam.', y);

// Chapter 3
sectionTitle('CAPITULO 03 • Instalar Node.js');
y = 160;
y = heading1('📥 O que e Node.js?', y);
y = bodyText('Node.js e o "motor" que faz o OpenCode funcionar. Ele precisa estar instalado primeiro.', y);

y = heading2('🪟 Passo a passo no Windows', y + 10);
y = bodyText('PASSO 1: Acesse https://nodejs.org e baixe a versao LTS.', y, TEXT_PRIMARY, 12);
y = bodyText('PASSO 2: Execute o instalador. Clique em "Next" ate finalizar.', y, TEXT_PRIMARY, 12);
y = alertBox('IMPORTANTE: Marque a opcao "Add to PATH" durante a instalacao!', y, 'warning');
y = bodyText('PASSO 3: Verifique a instalacao no PowerShell:', y, TEXT_PRIMARY, 12);
y = codeBlock('node --version\nnpm --version', y);
y = bodyText('Resultado esperado: node v20.x.x  |  npm v10.x.x', y, ACCENT_GREEN, 10);

y = alertBox('Se aparecer "comando nao encontrado", feche e abra o PowerShell novamente.', y, 'warning');

// Chapter 4
sectionTitle('CAPITULO 04 • Instalar OpenCode');
y = 160;
y = heading1('📥 Instalacao via npm', y);
y = bodyText('Abra o PowerShell e cole este comando:', y, TEXT_PRIMARY, 12);
y = codeBlock('npm install -g @opencode-ai/cli', y);
y = bodyText('Isso pode levar de 30 segundos a 2 minutos.', y, TEXT_SECONDARY, 10);

y = heading2('✅ Verificar instalacao', y + 10);
y = codeBlock('opencode --version', y);
y = bodyText('Resultado esperado: numero da versao (ex: 1.x.x)', y, ACCENT_GREEN, 10);

y = heading2('🚀 Primeiro teste rapido', y + 10);
y = codeBlock('opencode --help', y);

y = alertBox('Se aparecer "Access Denied", execute o PowerShell COMO ADMINISTRADOR.', y, 'danger');

// Chapter 5
sectionTitle('CAPITULO 05 • Instalar OpenCode Zen');
y = 160;
y = heading1('🧘 O que e OpenCode Zen?', y);
y = bodyText('Uma versao mais limpa e focada do OpenCode, com tema minimalista.', y);

y = heading2('📥 Instalacao', y + 10);
y = codeBlock('npm install -g opencode-zen', y);
y = codeBlock('opencode-zen --version', y);

y = heading2('🎨 Diferencas', y + 10);
y = table(
  ['OpenCode Padrao', 'OpenCode Zen'],
  [
    ['Interface completa', 'Interface minimalista'],
    ['Mais comandos', 'Essencial'],
    ['Ideal para projetos grandes', 'Ideal para foco total'],
  ],
  y
);

y = bodyText('💡 Dica: Voce pode ter os dois instalados ao mesmo tempo.', y + 10, ACCENT_YELLOW, 11);

// Chapter 6
sectionTitle('CAPITULO 06 • Obter API Key');
y = 160;
y = heading1('🔑 O que e uma API Key?', y);
y = bodyText('E uma senha especial que permite o OpenCode se conectar a Inteligencia Artificial. Sem ela, nada funciona.', y);

y = heading2('📥 Passo a passo — OpenRouter (recomendado)', y + 10);
const steps = [
  'PASSO 1: Acesse https://openrouter.ai/keys',
  'PASSO 2: Crie sua conta (Google/GitHub/Email)',
  'PASSO 3: Adicione creditos (minimo $5 ≈ R$25)',
  'PASSO 4: Clique em "Create Key" e copie a chave',
  'PASSO 5: Salve em local seguro!',
];
checklist(steps, y);

y = heading2('📥 Provedores disponiveis',  y + steps.length * 20 + 20);
y = table(
  ['Provedor', 'Preco', 'Qualidade'],
  [
    ['OpenRouter', 'Varios modelos', '⭐⭐⭐⭐ Bom custo-beneficio'],
    ['Anthropic', 'Pago (creditos)', '⭐⭐⭐⭐⭐ Melhor para codigo'],
    ['OpenAI', 'Pago (creditos)', '⭐⭐⭐⭐ Excelente'],
  ],
  y
);

y = alertBox('🔴 SUA API KEY E COMO UMA SENHA DE BANCO. Nunca compartilhe em chats, redes sociais ou repositorios publicos.', y, 'danger');

// Chapter 7
sectionTitle('CAPITULO 07 • Configurar settings.json');
y = 160;
y = heading1('📁 Criar a pasta e o arquivo', y);
y = codeBlock('New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.opencode"', y);
y = codeBlock('New-Item -ItemType File -Force -Path "$env:USERPROFILE\.opencode\settings.json"', y);

y = heading2('📝 Conteudo do settings.json', y + 10);
y = codeBlock(`{
  "model": "openrouter/anthropic/claude-3.5-sonnet",
  "apiKey": "sk-or-v1-AQUI_VAI_SUA_CHAVE",
  "temperature": 0.7,
  "maxTokens": 4096,
  "theme": "dark",
  "language": "pt-BR",
  "systemPrompt": "Voce e um engenheiro... em portugues brasileiro."
}`, y, 'json');

y = heading2('⚙️ Explicacao dos campos', y + 10);
y = table(
  ['Campo', 'O que faz', 'Exemplo'],
  [
    ['model', 'Qual IA usar', 'openrouter/anthropic/...'],
    ['apiKey', 'Sua chave secreta', 'sk-or-v1-...'],
    ['temperature', 'Criatividade (0-1)', '0.7'],
    ['maxTokens', 'Tam. maximo resposta', '4096'],
    ['theme', 'Tema visual', 'dark'],
    ['language', 'Idioma', 'pt-BR'],
    ['systemPrompt', 'Personalidade', 'Texto descritivo'],
  ],
  y
);

y = heading2('🎯 Modelos recomendados', y + 10);
y = table(
  ['Modelo', 'Provedor', 'Qualidade'],
  [
    ['claude-3.5-sonnet', 'OpenRouter', '⭐⭐⭐⭐⭐'],
    ['gpt-4o', 'OpenRouter', '⭐⭐⭐⭐⭐'],
    ['gemini-2.0-pro', 'OpenRouter', '⭐⭐⭐⭐ (gratis!)'],
  ],
  y
);

// Chapter 8
sectionTitle('CAPITULO 08 • Integrar no VS Code');
y = 160;
y = heading1('🖥️ Instalar VS Code', y);
y = bodyText('Acesse https://code.visualstudio.com e baixe para Windows.', y, TEXT_PRIMARY, 11);
y = alertBox('Marque "Add to PATH" e "Register Code as editor" na instalacao!', y, 'warning');

y = heading2('🔌 Instalar Claude Code', y + 10);
y = bodyText('Abra o VS Code → Ctrl+Shift+X → pesquise "Claude Code" → Instale.', y, TEXT_PRIMARY, 11);

y = heading2('⚙️ Configurar', y + 10);
y = codeBlock(`// settings.json do VS Code
{
  "claudeCode.apiKey": "sk-ant-SUA_CHAVE",
  "claudeCode.model": "claude-3-5-sonnet-20241022",
  "claudeCode.language": "pt-BR"
}`, y, 'json');

y = heading2('🔗 Usar OpenCode dentro do VS Code', y + 10);
y = codeBlock('Ctrl + `  (abrir terminal)\nopencode', y);

// Chapter 9
sectionTitle('CAPITULO 09 • Primeiro teste funcionando');
y = 160;
y = heading1('🎯 Testes', y);

y = heading2('Teste 1: Verificar instalacao', y + 10);
y = codeBlock('opencode --version', y);

y = heading2('Teste 2: Modo interativo', y + 10);
y = codeBlock('opencode', y);
y = bodyText('Na primeira execucao, pode pedir sua API Key. Digite ou cole.', y, TEXT_SECONDARY, 10);

y = heading2('Teste 3: Pergunte algo', y + 10);
y = codeBlock('Crie um arquivo HTML com "Ola, Mundo!" em portugues', y);

y = heading2('💡 Comandos uteis', y + 10);
y = codeBlock(`opencode "Liste os arquivos desta pasta"
opencode "Explique o que este arquivo faz"
opencode "Corrija o erro neste arquivo"
opencode "Crie um botao estilizado em React"`, y);

// Chapter 10
sectionTitle('CAPITULO 10 • Erros comuns e solucoes');
y = 160;
y = heading1('🐛 Erros e solucoes', y);

y = alertBox('ERRO: "comando nao encontrado" → npm list -g --depth=0 e reinstale', y, 'info');
y = alertBox('ERRO: "Permission denied" → Execute PowerShell como Administrador', y, 'warning');
y = alertBox('ERRO: "Invalid API key" → Verifique chave, espacos e creditos', y, 'danger');
y = alertBox('ERRO: "settings.json nao encontrado" → Crie a pasta .opencode', y, 'info');
y = alertBox('ERRO: "Node.js not found" → Baixe e instale Node.js LTS', y, 'warning');
y = alertBox('ERRO: "Connection timeout" → Verifique internet e VPN', y, 'info');
y = alertBox('ERRO: "Model not found" → Verifique nome do modelo no settings.json', y, 'warning');

// Final page
doc.addPage();
doc.rect(0, 0, doc.page.width, doc.page.height).fill(BG_DARK);

doc.rect(0, 0, doc.page.width, 6).fill(ACCENT_GREEN);

doc.save();
doc.fontSize(30).fillColor(ACCENT_GREEN);
doc.text('PARABENS!', 60, 120, { align: 'center', width: doc.page.width - 120 });
doc.restore();

doc.save();
doc.fontSize(20).fillColor(TEXT_PRIMARY);
doc.text('Voce completou o guia!', 60, 160, { align: 'center', width: doc.page.width - 120 });
doc.restore();

doc.save();
doc.fontSize(12).fillColor(TEXT_SECONDARY);
doc.text('Agora voce tem um ambiente de desenvolvimento com IA funcionando no seu Windows!', 60, 200, { align: 'center', width: doc.page.width - 120 });
doc.restore();

// Final checklist
y = 250;
const finalItems = [
  '✅ Node.js instalado',
  '✅ OpenCode instalado',
  '✅ OpenCode Zen instalado',
  '✅ Claude Code no VS Code',
  '✅ API Key configurada',
  '✅ settings.json configurado',
  '✅ Primeiro teste funcionando',
  '✅ Sei resolver erros comuns',
];
checklist(finalItems, y);

// Links
y = y + finalItems.length * 20 + 30;
doc.save();
doc.fontSize(12).fillColor(ACCENT_BLUE);
doc.text('Links uteis:', 60, y);
doc.fontSize(10).fillColor(TEXT_SECONDARY);
const links = [
  'OpenCode: https://opencode.ai',
  'Node.js: https://nodejs.org',
  'VS Code: https://code.visualstudio.com',
  'OpenRouter: https://openrouter.ai',
  'GitHub: https://github.com/anomalyco/opencode',
];
links.forEach((link, i) => doc.text(link, 60, y + 22 + i * 16));

doc.rect(0, doc.page.height - 6, doc.page.width, 6).fill(ACCENT_PURPLE);
addPageNumber();

doc.end();

console.log(`\n✅ PDF gerado com sucesso!`);
console.log(`📁 ${outputPath}`);
console.log(`📄 ${path.basename(outputPath)}`);
