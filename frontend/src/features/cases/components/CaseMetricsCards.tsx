"use client";

import { CaseListItem } from "../types/case";

function MetricCard({ label, value, color }: { label: string; value: string | number; color?: string }) {
  return (
    <div className="bg-[#22222a] border border-[#2e2e38] rounded-lg px-4 py-3">
      <p className="text-[10px] text-[#5a5a6a] uppercase tracking-wider font-[family-name:var(--font-geist-mono)]">
        {label}
      </p>
      <p className={`text-2xl font-semibold mt-1 font-[family-name:var(--font-geist-mono)] ${color || "text-[#e8e8f0]"}`}>
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
      <MetricCard label="Open Cases" value={openCount} color="text-[#4a7ebb]" />
      <MetricCard label="Escalated" value={escalatedCount} color={escalatedCount > 0 ? "text-red-400" : "text-[#e8e8f0]"} />
      <MetricCard label="High Effort" value={highEffortCount} color={highEffortCount > 0 ? "text-amber-400" : "text-[#e8e8f0]"} />
      <MetricCard label="Total Cases" value={cases.length} />
    </div>
  );
}
