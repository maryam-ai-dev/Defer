import { HandoffPacket } from "../types/handoff";
import { DEMO_MODE } from "@/lib/mock/demo-mode";
import { getHandoff } from "@/lib/mock/store";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export async function fetchHandoff(handoffId: string): Promise<HandoffPacket> {
  if (DEMO_MODE) return getHandoff(handoffId);

  const res = await fetch(`${API_BASE}/api/v1/handoffs/${handoffId}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch handoff: ${res.status}`);
  return res.json();
}
