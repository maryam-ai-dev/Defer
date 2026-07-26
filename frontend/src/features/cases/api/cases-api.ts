import { CaseListItem } from "../types/case";
import { DEMO_MODE } from "@/lib/mock/demo-mode";
import { listCases } from "@/lib/mock/store";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export async function fetchCases(params?: {
  status?: string;
  escalationCandidate?: boolean;
  minEffortScore?: number;
}): Promise<CaseListItem[]> {
  if (DEMO_MODE) return listCases(params);

  const url = new URL(`${API_BASE}/api/v1/cases`);
  if (params?.status) url.searchParams.set("status", params.status);
  if (params?.escalationCandidate !== undefined)
    url.searchParams.set("escalationCandidate", String(params.escalationCandidate));
  if (params?.minEffortScore !== undefined)
    url.searchParams.set("minEffortScore", String(params.minEffortScore));

  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch cases: ${res.status}`);
  return res.json();
}
