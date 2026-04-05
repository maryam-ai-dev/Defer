export function EvidenceCard({
  citations,
}: {
  citations?: { documentId: string; chunkId: string; label: string }[];
}) {
  if (!citations || citations.length === 0) return null;

  return (
    <div className="space-y-2.5">
      <h3 className="text-xs font-medium text-[#8a8a96] uppercase tracking-wider font-[family-name:var(--font-geist-mono)]">
        Evidence Sources
      </h3>
      <div className="space-y-1">
        {citations.map((c, i) => (
          <div
            key={i}
            className="flex items-center gap-2 px-2 py-1.5 rounded bg-[#1a1a1f] border border-[#2e2e38]"
          >
            <span className="text-[10px] text-[#4a7ebb] font-[family-name:var(--font-geist-mono)] shrink-0">
              {c.label}
            </span>
            <span className="text-[10px] text-[#5a5a6a] font-[family-name:var(--font-geist-mono)] truncate">
              {c.documentId.slice(0, 8)}.../{c.chunkId.slice(0, 8)}...
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
