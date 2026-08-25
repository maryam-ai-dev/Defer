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
    <div className="border-b border-[#EADAD6] px-6 py-5">
      <div className="flex items-center gap-3 mb-2">
        <h1 className="text-xl font-medium text-[#2F2624] font-[family-name:var(--font-serif)]">Handoff Packet</h1>
        <span className="px-2 py-0.5 rounded text-[10px] font-medium font-[family-name:var(--font-geist-mono)] uppercase tracking-wider bg-[#A24B50]/15 text-[#A24B50]">
          {escalationReason.replace(/_/g, " ")}
        </span>
      </div>
      <div className="flex items-center gap-4 text-xs text-[#A9908D] font-[family-name:var(--font-geist-mono)]">
        <span>ID: {handoffId.slice(0, 8)}...</span>
        <Link href={`/cases/${conversationId}`} className="text-[#A24B50] hover:underline">
          View case &rarr;
        </Link>
        <span className="ml-auto">{formatTime(createdAt)}</span>
      </div>
    </div>
  );
}
