import { TraceSpan } from "../types/trace";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export async function fetchTracesByConversation(conversationId: string): Promise<TraceSpan[]> {
  const res = await fetch(`${API_BASE}/api/v1/traces?conversationId=${conversationId}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Failed to fetch traces: ${res.status}`);
  return res.json();
}

export async function fetchTrace(traceId: string): Promise<TraceSpan> {
  const res = await fetch(`${API_BASE}/api/v1/traces/${traceId}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch trace: ${res.status}`);
  return res.json();
}
