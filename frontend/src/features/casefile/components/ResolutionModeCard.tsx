import { DecisionSummary } from "@/features/workspace/types/workspace";

const modeStyles: Record<string, { bg: string; text: string }> = {
  DIRECT_ANSWER: { bg: "bg-[#5F7C63]/10", text: "text-[#5F7C63]" },
  CLARIFICATION_REQUIRED: { bg: "bg-[#A66B2E]/10", text: "text-[#A66B2E]" },
  HUMAN_REVIEW_DRAFT: { bg: "bg-[#A66B2E]/10", text: "text-[#A66B2E]" },
  HUMAN_ESCALATION: { bg: "bg-[#A24B50]/10", text: "text-[#A24B50]" },
  SAFE_REFUSAL: { bg: "bg-[#EADAD6]", text: "text-[#7A6664]" },
};

export function ResolutionModeCard({
  mode,
  decision,
}: {
  mode: string | null;
  decision: DecisionSummary | null;
}) {
  if (!mode) return null;

  const style = modeStyles[mode] || { bg: "bg-[#EADAD6]", text: "text-[#7A6664]" };
  const label = mode.replace(/_/g, " ");

  return (
    <div className="space-y-2.5">
      <h3 className="text-xs font-medium text-[#7A6664] uppercase tracking-wider font-[family-name:var(--font-geist-mono)]">
        Resolution Mode
      </h3>
      <div className={`rounded-md px-3 py-2.5 ${style.bg}`}>
        <p className={`text-sm font-semibold font-[family-name:var(--font-geist-mono)] ${style.text}`}>
          {label}
        </p>
        {decision && (
          <>
            <p className="text-[10px] text-[#A9908D] mt-1.5 font-[family-name:var(--font-geist-mono)]">
              Confidence: {(decision.retrievalConfidence * 100).toFixed(1)}%
            </p>
            {decision.rationale.map((r, i) => (
              <p key={i} className="text-[10px] text-[#A9908D] mt-0.5 leading-snug">
                {r}
              </p>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
