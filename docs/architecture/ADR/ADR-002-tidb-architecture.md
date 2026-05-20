# ADR-002: Arquitetura de Banco — TiDB Cloud

## Status
**Accepted** — Maio 2026

## Contexto

O MENTE.AI precisava de um banco de dados relacional para produção. Os requisitos eram:
- MySQL-compatível (familiaridade da equipe)
- Serverless-friendly (sem conexões persistentes)
- Hosted (zero manutenção de infra)
- Disponível no Brasil (latência baixa para público BR)
- Free tier generoso para MVP

## Decisão

**TiDB Cloud** como banco de dados principal, acessado via Drizzle ORM com driver `mysql2`.

## Por quê?

1. **MySQL wire protocol:** TiDB "fala MySQL". Qualquer driver MySQL funciona. Zero adaptação de código.

2. **Serverless architecture:** TiDB separa compute de storage. Conexões HTTP-native, pool gerenciado pelo servidor — ideal para Vercel serverless functions que criam/destroem conexões a cada request.

3. **Região São Paulo (gru1):** Deploy Vercel em `gru1` + TiDB na mesma região = latência sub-5ms entre API e banco.

4. **Free tier (TiDB Serverless):** 5GB storage, 50M Request Units/mês gratuitos. Suficiente para MVP com centenas de usuários.

5. **Auto-scaling:** Sem preocupação com capacidade. TiDB escala horizontalmente sem intervenção.

## Alternativas Consideradas

- **PlanetScale** — rejeitado. MySQL-compatível também, mas encerrou free tier em 2024. Custo mínimo de ~$39/mês inviabiliza MVP.
- **AWS RDS MySQL** — rejeitado. Requer VPC, security groups, gestão de instância. Overhead operacional que não queremos.
- **Supabase (PostgreSQL)** — rejeitado. PostgreSQL é ótimo, mas a equipe tem mais experiência em MySQL e as migrations existentes são MySQL-specific.
- **SQLite (Turso)** — rejeitado. Bom para edge, mas 12 agentes canônicos + 108 gerados + dados de perfil precisam de integridade relacional forte.

## Consequências

### Positivas
- Zero operações de DBA — TiDB gerencia tudo
- Conexão serverless nativa — sem pool management manual
- Latência < 5ms entre Vercel (gru1) e TiDB Cloud
- Scaling automático sem mudança de código

### Negativas
- Vendor lock-in moderado (trocar TiDB por MySQL vanilla exigiria reconfigurar `DATABASE_URL`)
- Debugging de queries requer TiDB Dashboard (não é MySQL Workbench)
- Limitado a 5GB no tier gratuito — será pago após tração

### Riscos
- Se TiDB Serverless descontinuar, migrar para MySQL vanilla
- Mitigação: schema Drizzle é portável, SQL das migrations é padrão

## Evolução Futura

- Quando o free tier estourar (~500+ usuários), migrar para TiDB Dedicated
- Se latência internacional virar requisito, TiDB suporta multi-region
- Backup strategy: TiDB automated backups + export periódico `.sql`
