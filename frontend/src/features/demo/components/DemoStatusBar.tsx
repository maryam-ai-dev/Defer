import Link from "next/link";

export function DemoStatusBar({ conversationId }: { conversationId: string | null }) {
  const shortId = conversationId ? conversationId.slice(0, 8) : "...";

  return (
    <header className="bg-[#FFFAF8] border-b border-[#EADAD6] px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="text-[#2F2624] text-base font-medium tracking-tight font-[family-name:var(--font-serif)]">
          defer
        </span>
        <span className="text-[#EADAD6]">|</span>
        <div>
          <h1 className="text-sm font-medium text-[#2F2624]">Support Chat</h1>
          <p className="text-[10px] text-[#A9908D] font-[family-name:var(--font-geist-mono)]">Case #{shortId}</p>
        </div>
      </div>
      {conversationId && (
        <Link
          href={`/cases/${conversationId}`}
          target="_blank"
          className="text-[10px] text-[#A9908D] hover:text-[#A24B50] font-[family-name:var(--font-geist-mono)] transition-colors"
        >
          View admin console &rarr;
        </Link>
      )}
    </header>
  );
}
