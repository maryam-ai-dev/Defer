# Defer

Policy-first AI support decision system. The LLM recommends a response; Spring Boot loads policy thresholds from the database, applies rules, and makes the final resolution decision. Every decision is logged with full rationale.

Spring Boot (authority layer) + FastAPI (intelligence layer) + Next.js (admin console + customer demo).

## Key Concepts

| Concept | What it does |
|---|---|
| **CaseFile** | Structured memory of a support case. Updated every turn with scores, actions, and open questions. |
| **Support-State Scoring** | Frustration, confusion, effort, and trust-risk scored 0-1 per turn via heuristics. Drives escalation. |
| **Decision Engine** | Loads policy thresholds from DB. Applies rules to AI's suggested mode. Produces final `ResolutionMode`. |
| **HandoffPacket** | Structured agent brief generated on escalation. Contains issue summary, steps attempted, customer state, and suggested next action. |
| **Policy Simulation** | Replay stored decision inputs with override thresholds to see how decisions would change. |

## Architecture

```
Customer message
  -> Spring Boot (persist message, load CaseFile)
    -> FastAPI (RAG retrieval + scoring + LLM generation)
      <- returns: suggested_mode, scores, draft, memory updates
    -> Spring Boot (load policy, apply rules, select final mode)
      -> persist DecisionLog, update CaseFile, create HandoffPacket if escalated
  <- response to customer

                 +-----------+
                 |  Next.js  |   Admin console + customer demo
                 +-----+-----+
                       |
                 +-----+-----+
                 |  Spring    |   Authority layer
                 |  Boot      |   Owns: conversations, case files,
                 |  :8080     |   decisions, policies, handoffs
                 +-----+-----+
                       |
                 +-----+-----+
                 |  FastAPI   |   Intelligence layer
                 |  :8000     |   Owns: RAG pipeline, scoring,
                 |            |   memory extraction, generation
                 +-----+-----+
                       |
                 +-----+-----+
                 |  Postgres  |   pgvector for KB embeddings
                 |  :5432     |   Flyway-managed schema
                 +-----------+
```

## Quick Start

```bash
# 1. Clone and configure
cp .env.example .env
# Edit .env — add your OPENAI_API_KEY

# 2. Start everything
docker-compose up --build

# 3. Seed the knowledge base
docker-compose exec -e KB_DIR=/app/datasets/support_kb ai-service python -m app.ingest_kb

# 4. Open the app
# Admin console: http://localhost:3000/cases
# Customer demo: http://localhost:3000/demo
```

## Key Screens

**Customer Demo** (`/demo`) — Customer-facing chat. Sends messages, receives grounded responses, gets escalation notices. Links to admin view for the same conversation.

**Cases Overview** (`/cases`) — Queue of all support cases. Metric cards (open, escalated, high-effort), filterable table, click through to workspace.

**Case Workspace** (`/cases/{conversationId}`) — Three-panel layout. Left: case list. Center: conversation thread with chat composer. Right: intelligence panel showing resolution mode, case summary, customer state scores, attempted actions, handoff packet.

**Handoff Packet** (`/handoffs/{handoffId}`) — Structured agent brief. Issue summary, customer goal, steps attempted, unresolved items, customer state at escalation, suggested next action.

**Trace Timeline** (`/traces/{traceId}`) — Expandable timeline of pipeline steps. Shows latency per span, metadata, and decision signals.

## Design Decisions

See [docs/architecture.md](docs/architecture.md) for the full architecture document.

Key constraints:
- **The LLM recommends. Spring Boot decides.** FastAPI returns `suggested_mode`. Spring Boot makes the final call after applying policy.
- **Python does not own durable state.** Python proposes memory updates. Spring Boot applies and persists them with validation.
- **Policy thresholds come from the database.** Never hardcoded. Loaded via `PolicyApplicationService` on every decision.
- **Eval ownership is split.** FastAPI runs eval scenarios. Spring Boot persists and exposes results.

## Tech Stack

| Layer | Technology |
|---|---|
| Authority | Spring Boot 3.3, Java 17, Flyway, MapStruct |
| Intelligence | FastAPI, sentence-transformers, OpenAI gpt-4o-mini, pgvector |
| Frontend | Next.js 15, TypeScript, Tailwind CSS, shadcn/ui |
| Database | PostgreSQL 16 with pgvector |
| Infrastructure | Docker Compose |
