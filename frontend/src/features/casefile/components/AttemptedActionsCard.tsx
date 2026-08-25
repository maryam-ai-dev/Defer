import { AttemptedAction } from "@/features/workspace/types/workspace";

const outcomeBadge: Record<string, string> = {
  SUCCESS: "bg-[#5F7C63]/15 text-[#5F7C63]",
  FAILURE: "bg-[#A24B50]/15 text-[#A24B50]",
  PARTIAL: "bg-[#A66B2E]/15 text-[#A66B2E]",
  PENDING: "bg-[#EADAD6] text-[#7A6664]",
};

export function AttemptedActionsCard({ actions }: { actions: AttemptedAction[] }) {
  if (actions.length === 0) return null;

  return (
    <div className="space-y-2.5">
      <h3 className="text-xs font-medium text-[#7A6664] uppercase tracking-wider font-[family-name:var(--font-geist-mono)]">
        Steps Attempted
      </h3>
      <ol className="space-y-1.5">
        {actions.map((a, i) => (
          <li key={a.id} className="flex items-start gap-2">
            <span className="text-[10px] text-[#A9908D] font-[family-name:var(--font-geist-mono)] mt-0.5 shrink-0">
              {i + 1}.
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-[#2F2624] leading-snug">{a.actionSummary}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                {a.outcome && (
                  <span className={`inline-flex px-1.5 py-0.5 rounded text-[9px] font-[family-name:var(--font-geist-mono)] ${outcomeBadge[a.outcome] || outcomeBadge.PENDING}`}>
                    {a.outcome}
                  </span>
                )}
                <span className="text-[9px] text-[#A9908D] font-[family-name:var(--font-geist-mono)]">
                  {a.source}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
