import { EvalRun } from "../types/eval";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
const AI_SERVICE_URL = process.env.NEXT_PUBLIC_AI_SERVICE_URL || "http://localhost:8000";

export async function fetchEvalRuns(): Promise<EvalRun[]> {
  const res = await fetch(`${API_BASE}/api/v1/evals`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch evals: ${res.status}`);
  return res.json();
}

export async function fetchEvalRun(runId: string): Promise<EvalRun> {
  const res = await fetch(`${API_BASE}/api/v1/evals/${runId}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch eval run: ${res.status}`);
  return res.json();
}

export async function triggerEvalRun(): Promise<Record<string, unknown>> {
  // Trigger eval run on FastAPI
  const aiRes = await fetch(`${AI_SERVICE_URL}/api/v1/evals/run`, {
    method: "POST",
  });
  if (!aiRes.ok) throw new Error(`Eval run failed: ${aiRes.status}`);
  const payload = await aiRes.json();

  // Persist results to Spring Boot
  const persistRes = await fetch(`${API_BASE}/api/v1/evals`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!persistRes.ok) throw new Error(`Persist eval failed: ${persistRes.status}`);
  return persistRes.json();
}
