import { EvalMetrics } from "../types/eval";

function MetricCard({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="bg-[#22222a] border border-[#2e2e38] rounded-lg px-4 py-3">
      <p className="text-[10px] text-[#5a5a6a] uppercase tracking-wider font-[family-name:var(--font-geist-mono)]">
        {label}
      </p>
      <p className={`text-2xl font-semibold mt-1 font-[family-name:var(--font-geist-mono)] ${color || "text-[#e8e8f0]"}`}>
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

  const passColor = metrics.passRate >= 0.7 ? "text-green-400" : metrics.passRate >= 0.4 ? "text-amber-400" : "text-red-400";
  const escColor = metrics.escalationCorrectness >= 0.7 ? "text-green-400" : "text-amber-400";

  return (
    <div className="grid grid-cols-4 gap-3">
      <MetricCard label="Pass Rate" value={`${(metrics.passRate * 100).toFixed(0)}%`} color={passColor} />
      <MetricCard label="Passed" value={String(metrics.passed)} color="text-green-400" />
      <MetricCard label="Failed" value={String(metrics.failed)} color={metrics.failed > 0 ? "text-red-400" : "text-[#e8e8f0]"} />
      <MetricCard label="Escalation Correctness" value={`${(metrics.escalationCorrectness * 100).toFixed(0)}%`} color={escColor} />
    </div>
  );
}
