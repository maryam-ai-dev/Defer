import { Workspace } from "../types/workspace";
import { DEMO_MODE } from "@/lib/mock/demo-mode";
import { getWorkspace } from "@/lib/mock/store";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export async function fetchWorkspace(conversationId: string): Promise<Workspace> {
  if (DEMO_MODE) return getWorkspace(conversationId);

  const res = await fetch(`${API_BASE}/api/v1/workspaces/${conversationId}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Failed to fetch workspace: ${res.status}`);
  return res.json();
}
