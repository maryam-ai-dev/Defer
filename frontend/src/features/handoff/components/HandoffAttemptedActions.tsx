export function HandoffAttemptedActions({ steps }: { steps: string[] }) {
  return (
    <section className="space-y-3">
      <h2 className="text-xs font-medium text-[#8a8a96] uppercase tracking-wider font-[family-name:var(--font-geist-mono)]">
        Steps Already Attempted
      </h2>
      {steps.length === 0 ? (
        <p className="text-sm text-[#5a5a6a] italic">No steps recorded yet.</p>
      ) : (
        <ol className="space-y-2">
          {steps.map((step, i) => (
            <li key={i} className="flex gap-3">
              <span className="text-xs text-[#5a5a6a] font-[family-name:var(--font-geist-mono)] mt-0.5 shrink-0 w-5 text-right">
                {i + 1}.
              </span>
              <p className="text-sm text-[#e8e8f0] leading-snug">{step}</p>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
