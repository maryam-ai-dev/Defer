export function CitationChips({ citations }: { citations?: string[] }) {
  if (!citations || citations.length === 0) return null;

  return (
    <div className="flex gap-1 mt-1.5 flex-wrap">
      {citations.map((label, i) => (
        <span
          key={i}
          className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] bg-[#EADAD6] text-[#7A6664] font-[family-name:var(--font-geist-mono)]"
        >
          {label}
        </span>
      ))}
    </div>
  );
}
