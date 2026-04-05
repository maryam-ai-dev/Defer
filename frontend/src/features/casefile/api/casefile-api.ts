const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export async function fetchCaseFile(caseFileId: string) {
  const res = await fetch(`${API_BASE}/api/v1/case-files/${caseFileId}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Failed to fetch case file: ${res.status}`);
  return res.json();
}
