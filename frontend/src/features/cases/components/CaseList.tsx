"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { CaseListItem, CaseFilter } from "../types/case";
import { fetchCases } from "../api/cases-api";
import { CaseFilters } from "./CaseFilters";
import { CaseListItemCard } from "./CaseListItem";

export function CaseList() {
  const pathname = usePathname();
  const [cases, setCases] = useState<CaseListItem[]>([]);
  const [filter, setFilter] = useState<CaseFilter>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params: Parameters<typeof fetchCases>[0] = {};
    if (filter === "escalated") params.escalationCandidate = true;
    if (filter === "high-effort") params.minEffortScore = 0.5;
    if (filter === "unresolved") params.status = "OPEN";

    setLoading(true);
    fetchCases(params)
      .then(setCases)
      .catch(() => setCases([]))
      .finally(() => setLoading(false));
  }, [filter]);

  // Extract active conversationId from path
  const activeConversationId = pathname.startsWith("/cases/")
    ? pathname.split("/cases/")[1]?.split("/")[0]
    : null;

  return (
    <div className="flex flex-col h-full">
      <div className="px-3 py-3 border-b border-[#EADAD6]">
        <h2 className="text-sm font-medium text-[#2F2624]">Cases</h2>
      </div>
      <CaseFilters active={filter} onChange={setFilter} />
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="space-y-2 p-3">
            {[1,2,3,4].map((i) => (
              <div key={i} className="space-y-1.5 py-2">
                <div className="flex gap-2">
                  <div className="animate-pulse rounded bg-[#EADAD6] h-4 w-14" />
                  <div className="animate-pulse rounded bg-[#EADAD6] h-4 w-20" />
                </div>
                <div className="animate-pulse rounded bg-[#EADAD6] h-3 w-full" />
                <div className="animate-pulse rounded bg-[#EADAD6] h-3 w-2/3" />
              </div>
            ))}
          </div>
        ) : cases.length === 0 ? (
          <div className="px-3 py-8 text-center text-xs text-[#A9908D]">No cases found</div>
        ) : (
          cases.map((c) => (
            <CaseListItemCard
              key={c.caseFileId}
              caseItem={c}
              isActive={c.conversationId === activeConversationId}
            />
          ))
        )}
      </div>
    </div>
  );
}
