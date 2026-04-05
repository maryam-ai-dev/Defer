"use client";

import Link from "next/link";
import { CaseListItem } from "../types/case";
import { CaseStatusBadge, ResolutionModeBadge } from "./CaseStatusBadge";

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function effortColor(score: number): string {
  if (score < 0.4) return "text-green-400";
  if (score <= 0.7) return "text-amber-400";
  return "text-red-400";
}

export function CasesOverviewTable({ cases }: { cases: CaseListItem[] }) {
  if (cases.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-[#5a5a6a]">No cases match the current filter.</p>
      </div>
    );
  }

  return (
    <div className="border border-[#2e2e38] rounded-lg overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[#2e2e38] bg-[#22222a]">
            <th className="text-left px-4 py-2.5 text-[10px] text-[#5a5a6a] uppercase tracking-wider font-[family-name:var(--font-geist-mono)] font-medium">
              Issue
            </th>
            <th className="text-left px-4 py-2.5 text-[10px] text-[#5a5a6a] uppercase tracking-wider font-[family-name:var(--font-geist-mono)] font-medium">
              Status
            </th>
            <th className="text-left px-4 py-2.5 text-[10px] text-[#5a5a6a] uppercase tracking-wider font-[family-name:var(--font-geist-mono)] font-medium">
              Mode
            </th>
            <th className="text-left px-4 py-2.5 text-[10px] text-[#5a5a6a] uppercase tracking-wider font-[family-name:var(--font-geist-mono)] font-medium">
              Effort
            </th>
            <th className="text-left px-4 py-2.5 text-[10px] text-[#5a5a6a] uppercase tracking-wider font-[family-name:var(--font-geist-mono)] font-medium">
              Updated
            </th>
            <th className="px-4 py-2.5" />
          </tr>
        </thead>
        <tbody>
          {cases.map((c) => (
            <tr key={c.caseFileId} className="border-b border-[#2e2e38] hover:bg-[#22222a]/50 transition-colors">
              <td className="px-4 py-3 max-w-[300px]">
                <p className="text-sm text-[#e8e8f0] truncate">
                  {c.issueSummary || "No summary"}
                </p>
                <p className="text-[10px] text-[#5a5a6a] font-[family-name:var(--font-geist-mono)] mt-0.5">
                  {c.caseFileId.slice(0, 8)}...
                </p>
              </td>
              <td className="px-4 py-3">
                <CaseStatusBadge status={c.status} />
              </td>
              <td className="px-4 py-3">
                <ResolutionModeBadge mode={c.resolutionMode} />
              </td>
              <td className="px-4 py-3">
                <span className={`text-sm font-[family-name:var(--font-geist-mono)] ${effortColor(c.currentEffortScore)}`}>
                  {c.currentEffortScore.toFixed(2)}
                </span>
              </td>
              <td className="px-4 py-3">
                <span className="text-xs text-[#5a5a6a] font-[family-name:var(--font-geist-mono)]">
                  {timeAgo(c.updatedAt)}
                </span>
              </td>
              <td className="px-4 py-3">
                <Link
                  href={`/cases/${c.conversationId}`}
                  className="text-xs text-[#4a7ebb] hover:underline"
                >
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
