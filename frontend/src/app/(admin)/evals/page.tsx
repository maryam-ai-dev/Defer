"use client";

import { useEffect, useState, useCallback } from "react";
import { EvalRun, EvalMetrics } from "@/features/evals/types/eval";
import { fetchEvalRuns, triggerEvalRun } from "@/features/evals/api/evals-api";
import { EvalSummaryCards } from "@/features/evals/components/EvalSummaryCards";
import { EvalScenarioTable } from "@/features/evals/components/EvalScenarioTable";
import { RunEvalButton } from "@/features/evals/components/RunEvalButton";
import { EvalSparkline } from "@/features/evals/components/EvalSparkline";

function parseMetrics(metricsJson: string | null): EvalMetrics | null {
  if (!metricsJson) return null;
  try {
    return JSON.parse(metricsJson);
  } catch {
    return null;
  }
}

export default function EvalsPage() {
  const [runs, setRuns] = useState<EvalRun[]>([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);

  const loadRuns = useCallback(() => {
    fetchEvalRuns()
      .then(setRuns)
      .catch(() => setRuns([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadRuns();
  }, [loadRuns]);

  const handleRun = async () => {
    setRunning(true);
    try {
      await triggerEvalRun();
      loadRuns();
    } catch (e) {
      console.error("Eval run failed:", e);
    } finally {
      setRunning(false);
    }
  };

  const latestRun = runs.length > 0 ? runs[0] : null;
  const metrics = latestRun ? parseMetrics(latestRun.metricsJson) : null;

  return (
    <div className="h-full overflow-y-auto">
      <div className="px-6 py-5">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-lg font-semibold text-[#e8e8f0]">Evaluations</h1>
            <p className="text-xs text-[#5a5a6a] mt-0.5">
              {runs.length > 0
                ? `${runs.length} eval run${runs.length > 1 ? "s" : ""} recorded`
                : "No eval runs yet"}
            </p>
          </div>
          <RunEvalButton onRun={handleRun} running={running} />
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-sm text-[#5a5a6a]">Loading eval runs...</p>
          </div>
        ) : (
          <div className="space-y-5">
            <EvalSummaryCards metrics={metrics} />
            <EvalSparkline runs={runs} />

            {latestRun && (
              <>
                <div className="flex items-center gap-3">
                  <h2 className="text-sm font-medium text-[#e8e8f0]">
                    Latest Run: {latestRun.name}
                  </h2>
                  <span className="text-[10px] text-[#5a5a6a] font-[family-name:var(--font-geist-mono)]">
                    {new Date(latestRun.startedAt).toLocaleString()}
                  </span>
                </div>
                <EvalScenarioTable results={latestRun.results} />
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
