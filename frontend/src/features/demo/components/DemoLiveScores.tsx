"use client";

function scoreColor(score: number): string {
  if (score < 0.4) return "text-green-400";
  if (score <= 0.7) return "text-amber-400";
  return "text-red-400";
}

function ScoreRow({ label, score }: { label: string; score: number }) {
  const pct = Math.min(score * 100, 100);
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-[9px] text-[#5a5a6a] uppercase tracking-wider font-[family-name:var(--font-geist-mono)]">
          {label}
        </span>
        <span className={`text-[10px] font-[family-name:var(--font-geist-mono)] ${scoreColor(score)}`}>
          {score.toFixed(2)}
        </span>
      </div>
      <div className="h-1 bg-[#2e2e38] rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            score < 0.4 ? "bg-green-500" : score <= 0.7 ? "bg-amber-500" : "bg-red-500"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

const modeLabels: Record<string, { text: string; color: string }> = {
  DIRECT_ANSWER: { text: "Direct Answer", color: "text-emerald-400" },
  CLARIFICATION_REQUIRED: { text: "Clarification", color: "text-violet-400" },
  HUMAN_REVIEW_DRAFT: { text: "Human Review", color: "text-amber-400" },
  HUMAN_ESCALATION: { text: "Escalated", color: "text-rose-400" },
  SAFE_REFUSAL: { text: "Refused", color: "text-[#8a8a96]" },
};

export interface LiveScores {
  frustrationScore: number;
  confusionScore: number;
  effortScore: number;
  trustRiskScore: number;
  resolutionMode: string | null;
  confidence: number;
}

export function DemoLiveScores({ scores }: { scores: LiveScores | null }) {
  if (!scores) {
    return (
      <div className="w-[240px] shrink-0 bg-[#22222a] border-l border-[#2e2e38] p-4">
        <h3 className="text-[10px] text-[#5a5a6a] uppercase tracking-wider font-[family-name:var(--font-geist-mono)] mb-4">
          Live Classification
        </h3>
        <p className="text-xs text-[#5a5a6a]">Send a message to see live scores.</p>
      </div>
    );
  }

  const mode = scores.resolutionMode ? modeLabels[scores.resolutionMode] : null;

  return (
    <div className="w-[240px] shrink-0 bg-[#22222a] border-l border-[#2e2e38] p-4 space-y-4">
      <h3 className="text-[10px] text-[#5a5a6a] uppercase tracking-wider font-[family-name:var(--font-geist-mono)]">
        Live Classification
      </h3>

      {mode && (
        <div className="rounded-md px-3 py-2 bg-[#1a1a1f] border border-[#2e2e38]">
          <p className="text-[9px] text-[#5a5a6a] uppercase tracking-wider font-[family-name:var(--font-geist-mono)]">
            Resolution Mode
          </p>
          <p className={`text-sm font-semibold font-[family-name:var(--font-geist-mono)] mt-0.5 ${mode.color}`}>
            {mode.text}
          </p>
        </div>
      )}

      <div className="rounded-md px-3 py-2 bg-[#1a1a1f] border border-[#2e2e38]">
        <p className="text-[9px] text-[#5a5a6a] uppercase tracking-wider font-[family-name:var(--font-geist-mono)] mb-1">
          Confidence
        </p>
        <p className={`text-lg font-semibold font-[family-name:var(--font-geist-mono)] ${scoreColor(scores.confidence)}`}>
          {(scores.confidence * 100).toFixed(0)}%
        </p>
      </div>

      <div className="space-y-2.5">
        <ScoreRow label="Frustration" score={scores.frustrationScore} />
        <ScoreRow label="Confusion" score={scores.confusionScore} />
        <ScoreRow label="Effort" score={scores.effortScore} />
        <ScoreRow label="Trust Risk" score={scores.trustRiskScore} />
      </div>
    </div>
  );
}
