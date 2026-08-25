export function HandoffNextActionCard({ action }: { action: string | null }) {
  if (!action) return null;

  return (
    <section className="space-y-3">
      <h2 className="text-xs font-medium text-[#7A6664] uppercase tracking-wider font-[family-name:var(--font-geist-mono)]">
        Suggested Next Action
      </h2>
      <div className="rounded-md px-4 py-3 bg-[#A24B50]/10 border border-[#A24B50]/20">
        <p className="text-sm text-[#2F2624] font-medium leading-relaxed">{action}</p>
      </div>
    </section>
  );
}
