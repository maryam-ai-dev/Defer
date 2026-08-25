import { EvalMetrics } from "../types/eval";

function MetricCard({ label, value, color, delay }: { label: string; value: string; color?: string; delay?: number }) {
  return (
    <div
      className="bg-[#FFFAF8] border border-[#EADAD6] rounded-lg px-4 py-3 animate-[fadeIn_0.4s_ease-out_forwards] opacity-0"
      style={{ animationDelay: `${delay || 0}ms` }}
    >
      <p className="text-[10px] text-[#A9908D] uppercase tracking-wider font-[family-name:var(--font-geist-mono)]">
        {label}
      </p>
      <p className={`text-2xl font-semibold mt-1 font-[family-name:var(--font-geist-mono)] ${color || "text-[#2F2624]"}`}>
        {value}
      </p>
    </div>
  );
}

export function EvalSummaryCards({ metrics }: { metrics: EvalMetrics | null }) {
  if (!metrics) {
    return (
      <div className="grid grid-cols-4 gap-3">
        <MetricCard label="Pass Rate" value="—" />
        <MetricCard label="Passed" value="—" />
        <MetricCard label="Failed" value="—" />
        <MetricCard label="Escalation Correctness" value="—" />
      </div>
    );
  }

  const passColor = metrics.passRate >= 0.7 ? "text-[#5F7C63]" : metrics.passRate >= 0.4 ? "text-[#A66B2E]" : "text-[#A24B50]";
  const escColor = metrics.escalationCorrectness >= 0.7 ? "text-[#5F7C63]" : "text-[#A66B2E]";

  return (
    <div className="grid grid-cols-4 gap-3">
      <MetricCard label="Pass Rate" value={`${(metrics.passRate * 100).toFixed(0)}%`} color={passColor} delay={0} />
      <MetricCard label="Passed" value={String(metrics.passed)} color="text-[#5F7C63]" delay={80} />
      <MetricCard label="Failed" value={String(metrics.failed)} color={metrics.failed > 0 ? "text-[#A24B50]" : "text-[#2F2624]"} delay={160} />
      <MetricCard label="Escalation Correctness" value={`${(metrics.escalationCorrectness * 100).toFixed(0)}%`} color={escColor} delay={240} />
    </div>
  );
}
