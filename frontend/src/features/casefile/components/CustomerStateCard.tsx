function scoreColor(score: number): string {
  if (score < 0.4) return "bg-green-500";
  if (score <= 0.7) return "bg-amber-500";
  return "bg-red-500";
}

function scoreLabelColor(score: number): string {
  if (score < 0.4) return "text-green-400";
  if (score <= 0.7) return "text-amber-400";
  return "text-red-400";
}

function ScoreBar({ label, score }: { label: string; score: number }) {
  const pct = Math.min(score * 100, 100);

  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] text-[#5a5a6a] font-[family-name:var(--font-geist-mono)] w-20 shrink-0 uppercase tracking-wider">
        {label}
      </span>
      <div className="flex-1 h-1.5 bg-[#2e2e38] rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${scoreColor(score)}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className={`text-[10px] font-[family-name:var(--font-geist-mono)] w-8 text-right ${scoreLabelColor(score)}`}>
        {score.toFixed(2)}
      </span>
    </div>
  );
}

export function CustomerStateCard({
  frustration,
  confusion,
  effort,
  trustRisk,
}: {
  frustration: number;
  confusion: number;
  effort: number;
  trustRisk: number;
}) {
  return (
    <div className="space-y-2.5">
      <h3 className="text-xs font-medium text-[#8a8a96] uppercase tracking-wider font-[family-name:var(--font-geist-mono)]">
        Customer State
      </h3>
      <div className="space-y-2">
        <ScoreBar label="Frustration" score={frustration} />
        <ScoreBar label="Confusion" score={confusion} />
        <ScoreBar label="Effort" score={effort} />
        <ScoreBar label="Trust Risk" score={trustRisk} />
      </div>
    </div>
  );
}
