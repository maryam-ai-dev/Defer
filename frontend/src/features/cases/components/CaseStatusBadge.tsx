const statusStyles: Record<string, string> = {
  OPEN: "bg-[#A24B50]/15 text-[#A24B50]",
  ESCALATED: "bg-[#A24B50]/15 text-[#A24B50]",
  RESOLVED: "bg-[#5F7C63]/15 text-[#5F7C63]",
};

const modeStyles: Record<string, string> = {
  DIRECT_ANSWER: "bg-[#5F7C63]/15 text-[#5F7C63] border border-[#5F7C63]/20",
  CLARIFICATION_REQUIRED: "bg-[#6E5C7C]/15 text-[#6E5C7C] border border-[#6E5C7C]/20",
  HUMAN_REVIEW_DRAFT: "bg-[#A66B2E]/15 text-[#A66B2E] border border-[#A66B2E]/20",
  HUMAN_ESCALATION: "bg-[#B97A79]/15 text-[#B97A79] border border-[#B97A79]/20",
  SAFE_REFUSAL: "bg-[#A9908D]/15 text-[#7A6664] border border-[#A9908D]/20",
};

export function CaseStatusBadge({ status }: { status: string }) {
  const style = statusStyles[status] || "bg-[#EADAD6] text-[#7A6664]";
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium font-[family-name:var(--font-geist-mono)] uppercase tracking-wider ${style}`}>
      {status}
    </span>
  );
}

export function ResolutionModeBadge({ mode }: { mode: string | null }) {
  if (!mode) return null;
  const label = mode.replace(/_/g, " ");
  const style = modeStyles[mode] || "bg-[#EADAD6] text-[#7A6664]";
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium font-[family-name:var(--font-geist-mono)] tracking-wider ${style}`}>
      {label}
    </span>
  );
}
