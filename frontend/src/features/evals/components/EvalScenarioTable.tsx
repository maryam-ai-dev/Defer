import { EvalResult } from "../types/eval";

export function EvalScenarioTable({ results }: { results: EvalResult[] }) {
  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-[#A9908D]">No eval results yet. Run an eval to see results.</p>
      </div>
    );
  }

  return (
    <div className="border border-[#EADAD6] rounded-lg overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[#EADAD6] bg-[#FFFAF8]">
            <th className="text-left px-4 py-2.5 text-[10px] text-[#A9908D] uppercase tracking-wider font-[family-name:var(--font-geist-mono)] font-medium">
              Scenario
            </th>
            <th className="text-left px-4 py-2.5 text-[10px] text-[#A9908D] uppercase tracking-wider font-[family-name:var(--font-geist-mono)] font-medium">
              Expected
            </th>
            <th className="text-left px-4 py-2.5 text-[10px] text-[#A9908D] uppercase tracking-wider font-[family-name:var(--font-geist-mono)] font-medium">
              Actual
            </th>
            <th className="text-left px-4 py-2.5 text-[10px] text-[#A9908D] uppercase tracking-wider font-[family-name:var(--font-geist-mono)] font-medium">
              Turns
            </th>
            <th className="text-left px-4 py-2.5 text-[10px] text-[#A9908D] uppercase tracking-wider font-[family-name:var(--font-geist-mono)] font-medium">
              Result
            </th>
          </tr>
        </thead>
        <tbody>
          {results.map((r) => (
            <tr key={r.id} className={`border-b border-[#EADAD6] ${r.passed ? "" : "bg-[#A24B50]/5"}`}>
              <td className="px-4 py-3">
                <p className="text-sm text-[#2F2624]">{r.description}</p>
                <p className="text-[10px] text-[#A9908D] font-[family-name:var(--font-geist-mono)] mt-0.5">{r.scenarioId}</p>
              </td>
              <td className="px-4 py-3">
                <span className="px-1.5 py-0.5 rounded text-[10px] font-[family-name:var(--font-geist-mono)] bg-[#EADAD6] text-[#7A6664]">
                  {r.expectedMode.replace(/_/g, " ")}
                </span>
              </td>
              <td className="px-4 py-3">
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-[family-name:var(--font-geist-mono)] ${
                  r.passed ? "bg-[#EADAD6] text-[#7A6664]" : "bg-[#A24B50]/15 text-[#A24B50]"
                }`}>
                  {r.actualMode.replace(/_/g, " ")}
                </span>
              </td>
              <td className="px-4 py-3 text-xs text-[#A9908D] font-[family-name:var(--font-geist-mono)]">
                {r.turnCount ?? "—"}
              </td>
              <td className="px-4 py-3">
                <span className={`px-2 py-0.5 rounded text-[10px] font-medium font-[family-name:var(--font-geist-mono)] uppercase ${
                  r.passed ? "bg-[#5F7C63]/15 text-[#5F7C63]" : "bg-[#A24B50]/15 text-[#A24B50]"
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
