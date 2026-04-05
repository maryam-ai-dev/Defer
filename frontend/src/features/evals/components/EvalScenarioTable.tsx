import { EvalResult } from "../types/eval";

export function EvalScenarioTable({ results }: { results: EvalResult[] }) {
  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-[#5a5a6a]">No eval results yet. Run an eval to see results.</p>
      </div>
    );
  }

  return (
    <div className="border border-[#2e2e38] rounded-lg overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[#2e2e38] bg-[#22222a]">
            <th className="text-left px-4 py-2.5 text-[10px] text-[#5a5a6a] uppercase tracking-wider font-[family-name:var(--font-geist-mono)] font-medium">
              Scenario
            </th>
            <th className="text-left px-4 py-2.5 text-[10px] text-[#5a5a6a] uppercase tracking-wider font-[family-name:var(--font-geist-mono)] font-medium">
              Expected
            </th>
            <th className="text-left px-4 py-2.5 text-[10px] text-[#5a5a6a] uppercase tracking-wider font-[family-name:var(--font-geist-mono)] font-medium">
              Actual
            </th>
            <th className="text-left px-4 py-2.5 text-[10px] text-[#5a5a6a] uppercase tracking-wider font-[family-name:var(--font-geist-mono)] font-medium">
              Turns
            </th>
            <th className="text-left px-4 py-2.5 text-[10px] text-[#5a5a6a] uppercase tracking-wider font-[family-name:var(--font-geist-mono)] font-medium">
              Result
            </th>
          </tr>
        </thead>
        <tbody>
          {results.map((r) => (
            <tr key={r.id} className={`border-b border-[#2e2e38] ${r.passed ? "" : "bg-red-500/5"}`}>
              <td className="px-4 py-3">
                <p className="text-sm text-[#e8e8f0]">{r.description}</p>
                <p className="text-[10px] text-[#5a5a6a] font-[family-name:var(--font-geist-mono)] mt-0.5">{r.scenarioId}</p>
              </td>
              <td className="px-4 py-3">
                <span className="px-1.5 py-0.5 rounded text-[10px] font-[family-name:var(--font-geist-mono)] bg-[#2e2e38] text-[#8a8a96]">
                  {r.expectedMode.replace(/_/g, " ")}
                </span>
              </td>
              <td className="px-4 py-3">
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-[family-name:var(--font-geist-mono)] ${
                  r.passed ? "bg-[#2e2e38] text-[#8a8a96]" : "bg-red-500/15 text-red-400"
                }`}>
                  {r.actualMode.replace(/_/g, " ")}
                </span>
              </td>
              <td className="px-4 py-3 text-xs text-[#5a5a6a] font-[family-name:var(--font-geist-mono)]">
                {r.turnCount ?? "—"}
              </td>
              <td className="px-4 py-3">
                <span className={`px-2 py-0.5 rounded text-[10px] font-medium font-[family-name:var(--font-geist-mono)] uppercase ${
                  r.passed ? "bg-green-500/15 text-green-400" : "bg-red-500/15 text-red-400"
                }`}>
                  {r.passed ? "Pass" : "Fail"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
