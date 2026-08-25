"use client";

import { CaseListItem } from "../types/case";

function MetricCard({ label, value, color }: { label: string; value: string | number; color?: string }) {
  return (
    <div className="bg-[#FFFAF8] border border-[#EADAD6] rounded-lg px-4 py-3">
      <p className="text-[10px] text-[#A9908D] uppercase tracking-wider font-[family-name:var(--font-geist-mono)]">
        {label}
      </p>
      <p className={`text-2xl font-semibold mt-1 font-[family-name:var(--font-geist-mono)] ${color || "text-[#2F2624]"}`}>
        {value}
      </p>
    </div>
  );
}

export function CaseMetricsCards({ cases }: { cases: CaseListItem[] }) {
  const openCount = cases.filter((c) => c.status === "OPEN").length;
  const escalatedCount = cases.filter((c) => c.status === "ESCALATED").length;
  const highEffortCount = cases.filter((c) => c.currentEffortScore > 0.7).length;

  const avgConfidence = "—"; // Confidence not in case list response; show placeholder

  return (
    <div className="grid grid-cols-4 gap-3">
      <MetricCard label="Open Cases" value={openCount} color="text-[#A24B50]" />
      <MetricCard label="Escalated" value={escalatedCount} color={escalatedCount > 0 ? "text-[#A24B50]" : "text-[#2F2624]"} />
      <MetricCard label="High Effort" value={highEffortCount} color={highEffortCount > 0 ? "text-[#A66B2E]" : "text-[#2F2624]"} />
      <MetricCard label="Total Cases" value={cases.length} />
    </div>
  );
}
