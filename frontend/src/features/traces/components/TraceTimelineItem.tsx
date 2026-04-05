"use client";

import { useState } from "react";
import { TraceSpan } from "../types/trace";

function formatDuration(startedAt: string, endedAt: string | null): string {
  if (!endedAt) return "in progress";
  const ms = new Date(endedAt).getTime() - new Date(startedAt).getTime();
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

const typeColors: Record<string, string> = {
  TURN: "bg-[#4a7ebb]",
  EXTERNAL_CALL: "bg-amber-500",
  DECISION: "bg-green-500",
};

export function TraceTimelineItem({ span }: { span: TraceSpan }) {
  const [expanded, setExpanded] = useState(false);
  const dotColor = typeColors[span.spanType] || "bg-[#5a5a6a]";
  const duration = formatDuration(span.startedAt, span.endedAt);

  let metadata: Record<string, unknown> = {};
  if (span.metadataJson) {
    try { metadata = JSON.parse(span.metadataJson); } catch { /* ignore */ }
  }
  const metaEntries = Object.entries(metadata);

  return (
    <div className="flex gap-3">
      {/* Timeline line + dot */}
      <div className="flex flex-col items-center shrink-0 w-5">
        <div className={`w-2.5 h-2.5 rounded-full ${dotColor} mt-1.5 shrink-0`} />
        <div className="w-px flex-1 bg-[#2e2e38]" />
      </div>

      {/* Content */}
      <div className="flex-1 pb-5">
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full text-left group"
        >
          <div className="flex items-center gap-2">
            <span className="text-sm text-[#e8e8f0] font-medium">
              {span.spanName.replace(/_/g, " ")}
            </span>
            <span className="text-[10px] text-[#5a5a6a] font-[family-name:var(--font-geist-mono)] px-1.5 py-0.5 rounded bg-[#2e2e38]">
              {span.spanType}
            </span>
            <span className="text-xs text-[#5a5a6a] font-[family-name:var(--font-geist-mono)] ml-auto">
              {duration}
            </span>
            <svg
              className={`w-3 h-3 text-[#5a5a6a] transition-transform ${expanded ? "rotate-180" : ""}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>

        {expanded && metaEntries.length > 0 && (
          <div className="mt-2 rounded-md bg-[#1a1a1f] border border-[#2e2e38] px-3 py-2 space-y-1">
            {metaEntries.map(([key, value]) => (
              <div key={key} className="flex items-baseline gap-2">
                <span className="text-[10px] text-[#5a5a6a] font-[family-name:var(--font-geist-mono)] shrink-0">
                  {key}:
                </span>
                <span className="text-xs text-[#e8e8f0] font-[family-name:var(--font-geist-mono)]">
                  {typeof value === "object" ? JSON.stringify(value) : String(value)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
