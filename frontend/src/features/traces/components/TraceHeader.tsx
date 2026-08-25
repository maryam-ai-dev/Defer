import Link from "next/link";
import { TraceSpan } from "../types/trace";

function formatDuration(startedAt: string, endedAt: string | null): string {
  if (!endedAt) return "in progress";
  const ms = new Date(endedAt).getTime() - new Date(startedAt).getTime();
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

export function TraceHeader({
  conversationId,
  spans,
}: {
  conversationId: string;
  spans: TraceSpan[];
}) {
  const rootSpan = spans.find((s) => s.spanType === "TURN") || spans[0];
  const totalDuration = rootSpan ? formatDuration(rootSpan.startedAt, rootSpan.endedAt) : "—";

  let finalMode = "—";
  if (rootSpan?.metadataJson) {
    try {
      const meta = JSON.parse(rootSpan.metadataJson);
      if (meta.final_mode) finalMode = meta.final_mode;
    } catch { /* ignore */ }
  }

  return (
    <div className="border-b border-[#EADAD6] px-6 py-5">
      <div className="flex items-center gap-3 mb-2">
        <h1 className="text-xl font-medium text-[#2F2624] font-[family-name:var(--font-serif)]">Trace Timeline</h1>
        <span className="px-2 py-0.5 rounded text-[10px] font-medium font-[family-name:var(--font-geist-mono)] bg-[#A24B50]/15 text-[#A24B50]">
          {totalDuration}
        </span>
      </div>
      <div className="flex items-center gap-4 text-xs text-[#A9908D] font-[family-name:var(--font-geist-mono)]">
        <span>Conversation: {conversationId.slice(0, 8)}...</span>
        <span>{spans.length} spans</span>
        <span>Final: {finalMode.replace(/_/g, " ")}</span>
        <Link href={`/cases/${conversationId}`} className="text-[#A24B50] hover:underline ml-auto">
          View case &rarr;
        </Link>
      </div>
    </div>
  );
}
