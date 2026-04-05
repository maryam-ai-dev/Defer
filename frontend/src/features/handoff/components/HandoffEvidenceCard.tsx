export function HandoffEvidenceCard({ unresolvedItems }: { unresolvedItems: string[] }) {
  if (unresolvedItems.length === 0) return null;

  return (
    <section className="space-y-3">
      <h2 className="text-xs font-medium text-[#8a8a96] uppercase tracking-wider font-[family-name:var(--font-geist-mono)]">
        Unresolved Items
      </h2>
      <ul className="space-y-1.5">
        {unresolvedItems.map((item, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="text-amber-400 mt-1 shrink-0">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </span>
            <p className="text-sm text-[#e8e8f0] leading-snug">{item}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
