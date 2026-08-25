function scoreColor(score: number): string {
  if (score < 0.4) return "text-[#5F7C63]";
  if (score <= 0.7) return "text-[#A66B2E]";
  return "text-[#A24B50]";
}

export function HandoffCustomerState({ state }: { state: Record<string, number> }) {
  const entries = Object.entries(state);
  if (entries.length === 0) return null;

  return (
    <section className="space-y-3">
      <h2 className="text-xs font-medium text-[#7A6664] uppercase tracking-wider font-[family-name:var(--font-geist-mono)]">
        Customer State at Escalation
      </h2>
      <div className="grid grid-cols-2 gap-3">
        {entries.map(([key, value]) => (
          <div key={key} className="bg-[#F6ECEA] rounded-md px-3 py-2.5 border border-[#EADAD6]">
            <p className="text-[10px] text-[#A9908D] uppercase tracking-wider font-[family-name:var(--font-geist-mono)]">
              {key}
            </p>
            <p className={`text-lg font-semibold font-[family-name:var(--font-geist-mono)] ${scoreColor(value)}`}>
              {value.toFixed(2)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
