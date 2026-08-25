export function HandoffSummaryCard({
  issueSummary,
  customerGoal,
}: {
  issueSummary: string;
  customerGoal: string | null;
}) {
  return (
    <section className="space-y-3">
      <h2 className="text-xs font-medium text-[#7A6664] uppercase tracking-wider font-[family-name:var(--font-geist-mono)]">
        Issue Summary
      </h2>
      <p className="text-sm text-[#2F2624] leading-relaxed">{issueSummary}</p>
      {customerGoal && (
        <>
          <h2 className="text-xs font-medium text-[#7A6664] uppercase tracking-wider font-[family-name:var(--font-geist-mono)] mt-4">
            Customer Goal
          </h2>
          <p className="text-sm text-[#2F2624] leading-relaxed">{customerGoal}</p>
        </>
      )}
    </section>
  );
}
