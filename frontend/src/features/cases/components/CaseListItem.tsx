import Link from "next/link";
import { CaseListItem as CaseListItemType } from "../types/case";
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

export function CaseListItemCard({
  caseItem,
  isActive,
}: {
  caseItem: CaseListItemType;
  isActive: boolean;
}) {
  return (
    <Link
      href={`/cases/${caseItem.conversationId}`}
      className={`block px-3 py-2.5 border-b border-[#EADAD6] transition-colors ${
        isActive ? "bg-[#FFFAF8]" : "hover:bg-[#FFFAF8]/50"
      }`}
    >
      <div className="flex items-center gap-2 mb-1.5">
        <CaseStatusBadge status={caseItem.status} />
        <ResolutionModeBadge mode={caseItem.resolutionMode} />
        <span className="ml-auto text-[10px] text-[#A9908D] font-[family-name:var(--font-geist-mono)]">
          {timeAgo(caseItem.updatedAt)}
        </span>
      </div>
      <p className="text-sm text-[#2F2624] line-clamp-2 leading-snug">
        {caseItem.issueSummary || "No summary yet"}
      </p>
      {caseItem.escalationCandidate && (
        <div className="mt-1.5 flex items-center gap-1 text-[10px] text-[#A24B50]">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          Escalation candidate
        </div>
      )}
    </Link>
  );
}
