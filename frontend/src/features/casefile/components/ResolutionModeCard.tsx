import { DecisionSummary } from "@/features/workspace/types/workspace";

const modeStyles: Record<string, { bg: string; text: string }> = {
  DIRECT_ANSWER: { bg: "bg-green-500/10", text: "text-green-400" },
  CLARIFICATION_REQUIRED: { bg: "bg-amber-500/10", text: "text-amber-400" },
  HUMAN_REVIEW_DRAFT: { bg: "bg-amber-500/10", text: "text-amber-400" },
  HUMAN_ESCALATION: { bg: "bg-red-500/10", text: "text-red-400" },
  SAFE_REFUSAL: { bg: "bg-[#2e2e38]", text: "text-[#8a8a96]" },
};

export function ResolutionModeCard({
  mode,
  decision,
}: {
  mode: string | null;
  decision: DecisionSummary | null;
}) {
  if (!mode) return null;

  const style = modeStyles[mode] || { bg: "bg-[#2e2e38]", text: "text-[#8a8a96]" };
  const label = mode.replace(/_/g, " ");

  return (
    <div className="space-y-2.5">
      <h3 className="text-xs font-medium text-[#8a8a96] uppercase tracking-wider font-[family-name:var(--font-geist-mono)]">
        Resolution Mode
      </h3>
      <div className={`rounded-md px-3 py-2.5 ${style.bg}`}>
        <p className={`text-sm font-semibold font-[family-name:var(--font-geist-mono)] ${style.text}`}>
          {label}
        </p>
        {decision && (
          <>
            <p className="text-[10px] text-[#5a5a6a] mt-1.5 font-[family-name:var(--font-geist-mono)]">
              Confidence: {(decision.retrievalConfidence * 100).toFixed(1)}%
            </p>
            {decision.rationale.map((r, i) => (
              <p key={i} className="text-[10px] text-[#5a5a6a] mt-0.5 leading-snug">
                {r}
              </p>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
