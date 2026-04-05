import Link from "next/link";

function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString("en-GB", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export function HandoffHeader({
  handoffId,
  conversationId,
  escalationReason,
  createdAt,
}: {
  handoffId: string;
  conversationId: string;
  escalationReason: string;
  createdAt: string;
}) {
  return (
    <div className="border-b border-[#2e2e38] px-6 py-5">
      <div className="flex items-center gap-3 mb-2">
        <h1 className="text-lg font-semibold text-[#e8e8f0]">Handoff Packet</h1>
        <span className="px-2 py-0.5 rounded text-[10px] font-medium font-[family-name:var(--font-geist-mono)] uppercase tracking-wider bg-red-500/15 text-red-400">
          {escalationReason.replace(/_/g, " ")}
        </span>
      </div>
      <div className="flex items-center gap-4 text-xs text-[#5a5a6a] font-[family-name:var(--font-geist-mono)]">
        <span>ID: {handoffId.slice(0, 8)}...</span>
        <Link href={`/cases/${conversationId}`} className="text-[#4a7ebb] hover:underline">
          View case &rarr;
        </Link>
        <span className="ml-auto">{formatTime(createdAt)}</span>
      </div>
    </div>
  );
}
