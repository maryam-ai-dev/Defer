import { TurnComparison } from "../api/policy-api";

function modeBadge(mode: string, changed?: boolean) {
  const base = "px-1.5 py-0.5 rounded text-[10px] font-[family-name:var(--font-geist-mono)]";
  if (changed) return `${base} bg-[#A66B2E]/15 text-[#A66B2E]`;
  return `${base} bg-[#EADAD6] text-[#7A6664]`;
}

export function PolicySimulationResult({ turns }: { turns: TurnComparison[] }) {
  if (turns.length === 0) {
    return <p className="text-xs text-[#A9908D]">No decision logs to simulate.</p>;
  }

  const changedCount = turns.filter((t) => t.changed).length;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-medium text-[#7A6664] uppercase tracking-wider font-[family-name:var(--font-geist-mono)]">
          Simulation Results
        </h3>
        {changedCount > 0 && (
          <span className="text-[10px] text-[#A66B2E] font-[family-name:var(--font-geist-mono)]">
            {changedCount} turn{changedCount > 1 ? "s" : ""} changed
          </span>
        )}
      </div>

      <div className="border border-[#EADAD6] rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#EADAD6] bg-[#F6ECEA]">
              <th className="text-left px-3 py-2 text-[9px] text-[#A9908D] uppercase font-[family-name:var(--font-geist-mono)] font-medium">
                Turn
              </th>
              <th className="text-left px-3 py-2 text-[9px] text-[#A9908D] uppercase font-[family-name:var(--font-geist-mono)] font-medium">
                Original
              </th>
              <th className="text-left px-3 py-2 text-[9px] text-[#A9908D] uppercase font-[family-name:var(--font-geist-mono)] font-medium">
                Simulated
              </th>
            </tr>
          </thead>
          <tbody>
            {turns.map((t) => (
              <tr
                key={t.turnIndex}
                className={`border-b border-[#EADAD6] ${t.changed ? "bg-[#A66B2E]/5" : ""}`}
              >
                <td className="px-3 py-2 text-xs text-[#A9908D] font-[family-name:var(--font-geist-mono)]">
                  {t.turnIndex}
                </td>
                <td className="px-3 py-2">
                  <span className={modeBadge(t.selectedMode)}>
                    {t.selectedMode.replace(/_/g, " ")}
                  </span>
                </td>
                <td className="px-3 py-2">
                  <span className={modeBadge(t.simulatedMode, t.changed)}>
                    {t.simulatedMode.replace(/_/g, " ")}
                  </span>
                  {t.changed && (
                    <span className="ml-1.5 text-[9px] text-[#A66B2E]">changed</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
