"use client";

import { useState } from "react";

function scoreColor(score: number): string {
  if (score < 0.4) return "bg-[#5F7C63]";
  if (score <= 0.7) return "bg-[#A66B2E]";
  return "bg-[#A24B50]";
}

function scoreLabelColor(score: number): string {
  if (score < 0.4) return "text-[#5F7C63]";
  if (score <= 0.7) return "text-[#A66B2E]";
  return "text-[#A24B50]";
}

const tooltips: Record<string, string> = {
  Frustration: "Measures customer anger via keywords, caps, exclamation marks, and escalation phrases.",
  Confusion: "Detects uncertainty through question density and confusion language.",
  Effort: "Tracks how many messages and repeated attempts the customer has made.",
  "Trust Risk": "Combined signal from frustration + effort + negative sentiment. High = churn risk.",
};

function ScoreBar({ label, score }: { label: string; score: number }) {
  const pct = Math.min(score * 100, 100);
  const [showTip, setShowTip] = useState(false);
  const tip = tooltips[label];

  return (
    <div className="flex items-center gap-2 relative">
      <span
        className="text-[10px] text-[#A9908D] font-[family-name:var(--font-geist-mono)] w-20 shrink-0 uppercase tracking-wider cursor-help"
        onMouseEnter={() => setShowTip(true)}
        onMouseLeave={() => setShowTip(false)}
      >
        {label}
      </span>
      {showTip && tip && (
        <div className="absolute left-0 bottom-full mb-1 z-10 px-2.5 py-1.5 rounded bg-[#F6ECEA] border border-[#EADAD6] text-[10px] text-[#7A6664] max-w-[200px] leading-snug shadow-lg">
          {tip}
        </div>
      )}
      <div className="flex-1 h-1.5 bg-[#EADAD6] rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${scoreColor(score)}`}
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
      <h3 className="text-xs font-medium text-[#7A6664] uppercase tracking-wider font-[family-name:var(--font-geist-mono)]">
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
