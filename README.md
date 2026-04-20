# ⚖️ Defer

> Policy-first AI support decision system. The LLM recommends a response; Spring Boot loads policy thresholds from the database, applies rules, and makes the final resolution decision.

![Demo](DEMO_GIF_PLACEHOLDER)

[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3-6DB33F?logo=spring-boot)](https://spring.io/projects/spring-boot)

## What it does

Defer is a support decision system where AI and policy share responsibility - but not equally. FastAPI handles RAG retrieval, customer state scoring, and response generation. Spring Boot loads policy thresholds from the database, applies rules, and makes the final call on how a case is resolved. The LLM never decides alone. Every decision is logged with full rationale.

## Demo

![Demo](DEMO_GIF_PLACEHOLDER)

- Send a support message and watch the pipeline score frustration, confusion, and effort in real time
- See how policy thresholds override or confirm the AI's suggested resolution mode
- Trigger an escalation and inspect the generated HandoffPacket
- Replay stored decisions with override thresholds in the policy simulator

## Key concepts

| Concept | What it does |
|---|---|
| **CaseFile** | Structured memory of a support case - updated every turn with scores, actions, and open questions |
| **Support-state scoring** | Frustration, confusion, effort, and trust-risk scored 0–1 per turn via heuristics. Drives escalation |
| **Decision Engine** | Loads policy thresholds from the database, applies rules to the AI's suggested mode, produces the final `ResolutionMode` |
| **HandoffPacket** | Structured agent brief generated on escalation - issue summary, steps attempted, customer state, and suggested next action |
| **Policy simulation** | Replay stored decision inputs with override thresholds to see how decisions would change |

## Architecture

```
Customer message
  -> Spring Boot (persist message, load CaseFile)
    -> FastAPI (RAG retrieval + scoring + LLM generation)
      <- returns: suggested_mode, scores, draft, memory updates
    -> Spring Boot (load policy, apply rules, select final mode)
      -> persist DecisionLog, update CaseFile, create HandoffPacket if escalated
  <- response to customer
```

Key decisions:

- The LLM recommends. Spring Boot decides. FastAPI returns `suggested_mode` — Spring Boot makes the final call after applying policy
- Python never owns durable state. FastAPI proposes memory updates; Spring Boot validates and persists them
- Policy thresholds live in the database, never hardcoded. Loaded via `PolicyApplicationService` on every decision
- Eval ownership is split — FastAPI runs eval scenarios, Spring Boot persists and exposes results

## Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15, TypeScript, Tailwind CSS, shadcn/ui |
| Authority service | Spring Boot 3.3, Java 17, Flyway, MapStruct |
| Intelligence service | FastAPI, Python, sentence-transformers, OpenAI gpt-4o-mini |
| Database | PostgreSQL 16 + pgvector |
| Infrastructure | Docker Compose |

## Key screens

**Customer demo** (`/demo`) - Customer-facing chat. Sends messages, receives grounded responses, gets escalation notices. Links to the admin view for the same conversation.

**Cases overview** (`/cases`) - Queue of all support cases. Metric cards for open, escalated, and high-effort cases. Filterable table with click-through to the workspace.

**Case workspace** (`/cases/{conversationId}`) - Three-panel layout. Left: case list. Centre: conversation thread with chat composer. Right: intelligence panel showing resolution mode, case summary, customer state scores, attempted actions, and handoff packet.

**Handoff packet** (`/handoffs/{handoffId}`) - Structured agent brief. Issue summary, customer goal, steps attempted, unresolved items, customer state at escalation, and suggested next action.

**Trace timeline** (`/traces/{traceId}`) - Expandable timeline of pipeline steps. Shows latency per span, metadata, and decision signals.

## Running locally

```bash
# 1. Clone and configure
cp .env.example .env
# Add your OPENAI_API_KEY to .env

# 2. Start everything
docker-compose up --build

# 3. Seed the knowledge base
docker-compose exec -e KB_DIR=/app/datasets/support_kb ai-service python -m app.ingest_kb

# 4. Open the app
# Admin console: http://localhost:3000/cases
# Customer demo: http://localhost:3000/demo
```

## Roadmap

- [ ] Confidence-weighted policy - trust score influences threshold sensitivity
- [ ] Multi-turn memory summarisation - compress long CaseFiles without losing signal
- [ ] A/B policy testing - run two threshold configs in parallel and compare outcomes
- [ ] Exportable eval reports

## License

Apache 2.0

---

*Built by [Maryam Yousuf](https://github.com/maryam-ai-dev)*
