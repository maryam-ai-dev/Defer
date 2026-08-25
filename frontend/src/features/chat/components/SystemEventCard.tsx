const eventStyles: Record<string, { border: string; text: string; label: string }> = {
  HUMAN_ESCALATION: {
    border: "border-[#A24B50]/30",
    text: "text-[#A24B50]",
    label: "Escalated to human agent",
  },
  CLARIFICATION_REQUIRED: {
    border: "border-[#A66B2E]/30",
    text: "text-[#A66B2E]",
    label: "Clarification requested",
  },
  SAFE_REFUSAL: {
    border: "border-[#A9908D]/30",
    text: "text-[#7A6664]",
    label: "Out of scope — safe refusal",
  },
  HUMAN_REVIEW_DRAFT: {
    border: "border-[#A66B2E]/30",
    text: "text-[#A66B2E]",
    label: "Draft pending human review",
  },
};

export function SystemEventCard({ mode }: { mode: string }) {
  if (mode === "DIRECT_ANSWER") return null;

  const style = eventStyles[mode] || {
    border: "border-[#EADAD6]",
    text: "text-[#7A6664]",
    label: mode,
  };

  return (
    <div className={`mx-auto max-w-[60%] border ${style.border} rounded-md px-3 py-2 text-center`}>
      <p className={`text-xs font-[family-name:var(--font-geist-mono)] ${style.text}`}>
        {style.label}
      </p>
    </div>
  );
}
