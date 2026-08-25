"use client";

import { EvalRun } from "../types/eval";

function parsePassRate(metricsJson: string | null): number | null {
  if (!metricsJson) return null;
  try {
    const m = JSON.parse(metricsJson);
    return m.passRate ?? null;
  } catch {
    return null;
  }
}

export function EvalSparkline({ runs }: { runs: EvalRun[] }) {
  const points = runs
    .slice()
    .reverse()
    .map((r) => parsePassRate(r.metricsJson))
    .filter((v): v is number => v !== null);

  if (points.length < 2) return null;

  const width = 200;
  const height = 48;
  const padding = 4;
  const maxVal = 1;
  const stepX = (width - padding * 2) / (points.length - 1);

  const pathPoints = points.map((v, i) => {
    const x = padding + i * stepX;
    const y = height - padding - (v / maxVal) * (height - padding * 2);
    return `${x},${y}`;
  });
  const pathD = `M${pathPoints.join(" L")}`;

  const latest = points[points.length - 1];
  const prev = points[points.length - 2];
  const trend = latest > prev ? "text-[#5F7C63]" : latest < prev ? "text-[#A24B50]" : "text-[#7A6664]";
  const trendLabel = latest > prev ? "improving" : latest < prev ? "declining" : "stable";

  return (
    <div className="flex items-center gap-3">
      <div>
        <p className="text-[10px] text-[#A9908D] uppercase tracking-wider font-[family-name:var(--font-geist-mono)]">
          Pass Rate Trend
        </p>
        <p className={`text-[10px] font-[family-name:var(--font-geist-mono)] mt-0.5 ${trend}`}>
          {trendLabel}
        </p>
      </div>
      <svg width={width} height={height} className="shrink-0">
        <path d={pathD} fill="none" stroke="#A24B50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {points.map((v, i) => (
          <circle
            key={i}
            cx={padding + i * stepX}
            cy={height - padding - (v / maxVal) * (height - padding * 2)}
            r="2.5"
            fill={i === points.length - 1 ? "#A24B50" : "#EADAD6"}
            stroke="#A24B50"
            strokeWidth="1"
          />
        ))}
      </svg>
    </div>
  );
}
