# Nano Banana Pro — Guia de Geração de Imagens

## Pré-requisitos

- Conta PRO no Nano Banana
- API key configurada no projeto

## Configuração

1. Crie um arquivo `.env.local` na raiz do projeto:

```bash
NANO_BANANA_API_KEY=seu-api-key-pro-aqui
NANO_BANANA_BASE_URL=https://api.nanobanana.ai/v1
NANO_BANANA_MODEL=pro-generator-v2
```

2. Opcional: ajuste limites e parâmetros de geração:

```bash
IMAGE_BATCH_SIZE=10
IMAGE_PAUSE_MS=180000
IMAGE_DELAY_MS=5000
MAX_PER_HOUR=20
IMAGE_WIDTH=1024
IMAGE_HEIGHT=1024
```

## Comandos

```bash
npm run agents:check
npm run agents:images
```

## Saída

- As imagens são salvas em `public/agents/` no formato `{agentId}.png`.

## Notas de limite

- O script aplica limite por hora via `MAX_PER_HOUR`.
- O script também processa em lotes via `IMAGE_BATCH_SIZE` e pausa via `IMAGE_PAUSE_MS`.

