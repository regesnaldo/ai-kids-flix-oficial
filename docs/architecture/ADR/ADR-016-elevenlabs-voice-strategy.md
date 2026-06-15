# ADR-016: Estratégia de Voz — ElevenLabs

## Status
**Accepted** — Maio 2026

## Contexto

O MENTE.AI promete agentes com personalidade cinematográfica. Parte essencial disso é a **voz**. Texto sem áudio é como um filme mudo — funcional, mas sem alma.

O projeto precisava de TTS (Text-to-Speech) para:
- Agentes narrarem respostas no chat
- Episódios terem narração imersiva
- Cada agente ter voz única e reconhecível

## Decisão

**ElevenLabs como provedor primário de TTS. Browser Speech Synthesis como fallback.**

## Por quê?

1. **Qualidade cinematográfica:** ElevenLabs gera vozes com entonação, pausas naturais e emoção. Browser TTS soa robótico — quebraria a imersão narrativa.

2. **Voice cloning:** 12 agentes canônicos podem ter 12 vozes únicas. Não são "voz 1, voz 2" genéricas — são personalidades auditivas.

3. **Streaming TTS:** ElevenLabs suporta streaming de áudio (token por token). Usuário ouve o agente "falando" enquanto o texto aparece — experiência cinematográfica completa.

4. **Português brasileiro:** ElevenLabs tem excelente suporte a PT-BR com vozes naturais. Browser TTS em PT-BR é limitado e robótico.

5. **Fallback inteligente:** Se ElevenLabs falhar (cota, rede, timeout), o sistema automaticamente usa browser Speech Synthesis. Usuário não percebe diferença funcional (só qualidade).

## Alternativas Consideradas

- **Apenas Browser TTS** — rejeitado como primário. Qualidade robótica quebra a premissa "Netflix do aprendizado". Bom como fallback.
- **Google Cloud TTS** — rejeitado. Qualidade comparável, mas mais caro por caractere, sem voice cloning, API mais complexa.
- **Amazon Polly** — rejeitado. Vozes em PT-BR limitadas, sem a naturalidade do ElevenLabs.
- **Azure Speech** — rejeitado. Bom, mas exige conta Azure (outro vendor além de Vercel/TiDB/Anthropic).

## Consequências

### Positivas
- Experiência de áudio cinematográfica
- 12 vozes únicas (1 por agente canônico)
- Streaming TTS (áudio em tempo real)
- Fallback transparente para browser TTS

### Negativas
- Custo: $0.30/1000 caracteres (US$ 5-50/mês dependendo do volume)
- Latência: ~2s para gerar áudio (vs instantâneo do browser TTS)
- Dependência de API externa (se ElevenLabs cair, fallback assume)
- 12 voice IDs precisam ser configurados manualmente (ainda pendente)

### Riscos
- Custo pode escalar com volume de usuários
- Mitigação: cache de áudios frequentes, fallback para browser TTS

## Evolução Futura

- Voice ID por agente (12 vozes únicas)
- Streaming TTS (áudio e texto simultâneos)
- Emotion-aware TTS (voz muda com o tom emocional da resposta)
