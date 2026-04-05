export function HandoffNextActionCard({ action }: { action: string | null }) {
  if (!action) return null;

  return (
    <section className="space-y-3">
      <h2 className="text-xs font-medium text-[#8a8a96] uppercase tracking-wider font-[family-name:var(--font-geist-mono)]">
        Suggested Next Action
      </h2>
      <div className="rounded-md px-4 py-3 bg-[#4a7ebb]/10 border border-[#4a7ebb]/20">
        <p className="text-sm text-[#e8e8f0] font-medium leading-relaxed">{action}</p>
      </div>
    </section>
  );
}
