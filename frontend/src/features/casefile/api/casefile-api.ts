import { DEMO_MODE } from "@/lib/mock/demo-mode";
import { getCaseFile } from "@/lib/mock/store";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export async function fetchCaseFile(caseFileId: string) {
  if (DEMO_MODE) return getCaseFile(caseFileId);

  const res = await fetch(`${API_BASE}/api/v1/case-files/${caseFileId}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Failed to fetch case file: ${res.status}`);
  return res.json();
}
