export function CaseSummaryCard({
  issueSummary,
  customerGoal,
}: {
  issueSummary: string | null;
  customerGoal: string | null;
}) {
  return (
    <div className="space-y-2.5">
      <h3 className="text-xs font-medium text-[#7A6664] uppercase tracking-wider font-[family-name:var(--font-geist-mono)]">
        Case Summary
      </h3>
      <div>
        <span className="text-[10px] text-[#A9908D] uppercase tracking-wider font-[family-name:var(--font-geist-mono)]">
          Issue
        </span>
        <p className="text-sm text-[#2F2624] mt-0.5 leading-snug">
          {issueSummary || "No summary yet"}
        </p>
      </div>
      <div>
        <span className="text-[10px] text-[#A9908D] uppercase tracking-wider font-[family-name:var(--font-geist-mono)]">
          Customer Goal
        </span>
        <p className="text-sm text-[#2F2624] mt-0.5 leading-snug">
          {customerGoal || "Not identified yet"}
        </p>
      </div>
    </div>
  );
}
