import { writeFileSync, mkdirSync, existsSync } from 'fs'; 
import { ALL_AGENTS } from '../src/canon/agents/all-agents.ts'; 
 
// Configuração da API (OpenAI DALL-E ou Stability AI) 
const API_KEY = process.env.OPENAI_API_KEY || process.env.STABILITY_API_KEY; 
const USE_DALL_E = !!process.env.OPENAI_API_KEY; 
 
async function generateImageWithDalle(prompt: string, outputPath: string) { 
  const response = await fetch('https://api.openai.com/v1/images/generations', { 
    method: 'POST', 
    headers: { 
      'Authorization': `Bearer ${API_KEY}`, 
      'Content-Type': 'application/json', 
    }, 
    body: JSON.stringify({ 
      model: 'dall-e-3', 
      prompt: `Digital art, high quality, cinematic: ${prompt}`, 
      n: 1, 
      size: '1024x1024', 
    }), 
  }); 
 
  const data: any = await response.json(); 
  if (data.error) throw new Error(data.error.message);
  
  const imageUrl = data.data[0].url; 
 
  // Download da imagem 
  const imageResponse = await fetch(imageUrl); 
  const buffer = await imageResponse.arrayBuffer(); 
  writeFileSync(outputPath, Buffer.from(buffer)); 
} 
 
async function generateImageWithStability(prompt: string, outputPath: string) { 
  const response = await fetch('https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image', { 
    method: 'POST', 
    headers: { 
      'Authorization': `Bearer ${API_KEY}`, 
      'Content-Type': 'application/json', 
      'Accept': 'application/json', 
    }, 
    body: JSON.stringify({ 
      text_prompts: [{ text: prompt }], 
      cfg_scale: 7, 
      height: 1024, 
      width: 1024, 
      samples: 1, 
      steps: 30, 
    }), 
  }); 
 
  const data: any = await response.json(); 
  if (data.message) throw new Error(data.message);

  const buffer = Buffer.from(data.artifacts[0].base64, 'base64'); 
  writeFileSync(outputPath, buffer); 
} 
 
async function generateAllAgentImages() { 
  if (!API_KEY) {
    console.error('❌ ERRO: OPENAI_API_KEY ou STABILITY_API_KEY não encontrada no ambiente.');
    console.log('Por favor, configure sua chave de API antes de continuar.');
    process.exit(1);
  }

  console.log('🎨 Iniciando geração de imagens para 120 agentes...\n'); 
 
  // Criar diretório se não existir 
  const outputDir = 'public/agents'; 
  if (!existsSync(outputDir)) { 
    mkdirSync(outputDir, { recursive: true }); 
  } 
 
  let successCount = 0; 
  let failCount = 0; 
 
  for (let i = 0; i < ALL_AGENTS.length; i++) { 
    const agent = ALL_AGENTS[i]; 
    const outputPath = `${outputDir}/${agent.id}.png`; 
 
    // Pular se a imagem já existir para economizar tokens
    if (existsSync(outputPath)) {
      console.log(`[${i + 1}/${ALL_AGENTS.length}] Imagem para ${agent.name} já existe. Pulando...`);
      successCount++;
      continue;
    }

    console.log(`[${i + 1}/${ALL_AGENTS.length}] Gerando imagem para ${agent.name}...`); 
 
    try { 
      if (USE_DALL_E) { 
        await generateImageWithDalle(agent.visualPrompt, outputPath); 
      } else { 
        await generateImageWithStability(agent.visualPrompt, outputPath); 
      } 
       
      console.log(`✅ ${agent.name} — OK`); 
      successCount++; 
       
      // Delay para evitar rate limiting 
      await new Promise(resolve => setTimeout(resolve, 2000)); 
       
    } catch (error: any) { 
      console.error(`❌ ${agent.name} — ERRO:`, error.message || error); 
      failCount++; 
    } 
  } 
 
  console.log('\n' + '='.repeat(50)); 
  console.log('📊 RESUMO DA GERAÇÃO'); 
  console.log('='.repeat(50)); 
  console.log(`✅ Sucesso: ${successCount}`); 
  console.log(`❌ Falhas: ${failCount}`); 
  console.log(`📁 Diretório: ${outputDir}`); 
} 
 
// Executar 
generateAllAgentImages().catch(console.error); 
