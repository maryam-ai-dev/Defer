"use client";

import { useEffect, useState } from "react";
import { CaseListItem, CaseFilter } from "@/features/cases/types/case";
import { fetchCases } from "@/features/cases/api/cases-api";
import { CaseMetricsCards } from "@/features/cases/components/CaseMetricsCards";
import { CaseFilters } from "@/features/cases/components/CaseFilters";
import { CasesOverviewTable } from "@/features/cases/components/CasesOverviewTable";

export default function CasesPage() {
  const [allCases, setAllCases] = useState<CaseListItem[]>([]);
  const [filteredCases, setFilteredCases] = useState<CaseListItem[]>([]);
  const [filter, setFilter] = useState<CaseFilter>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCases()
      .then((data) => {
        setAllCases(data);
        setFilteredCases(data);
      })
      .catch(() => setAllCases([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = allCases;
    if (filter === "escalated") result = allCases.filter((c) => c.escalationCandidate);
    if (filter === "high-effort") result = allCases.filter((c) => c.currentEffortScore > 0.5);
    if (filter === "unresolved") result = allCases.filter((c) => c.status === "OPEN");
    setFilteredCases(result);
  }, [filter, allCases]);

  return (
    <div className="h-full overflow-y-auto">
      <div className="px-6 py-5">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-lg font-semibold text-[#e8e8f0]">Cases</h1>
            <p className="text-xs text-[#5a5a6a] mt-0.5">Support case overview and queue</p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-sm text-[#5a5a6a]">Loading cases...</p>
          </div>
        ) : (
          <div className="space-y-5">
            <CaseMetricsCards cases={allCases} />
            <CaseFilters active={filter} onChange={setFilter} />
            <CasesOverviewTable cases={filteredCases} />
          </div>
        )}
      </div>
    </div>
  );
}
