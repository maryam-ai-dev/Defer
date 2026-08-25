import { TraceSpan } from "../types/trace";

function scoreColor(score: number): string {
  if (score < 0.4) return "text-[#5F7C63]";
  if (score <= 0.7) return "text-[#A66B2E]";
  return "text-[#A24B50]";
}

export function RiskSignalsPanel({ spans }: { spans: TraceSpan[] }) {
  // Find decision span for risk signals
  const decisionSpan = spans.find((s) => s.spanType === "DECISION");
  const aiSpan = spans.find((s) => s.spanType === "EXTERNAL_CALL");

  if (!decisionSpan && !aiSpan) return null;

  let confidence = 0;
  let selectedMode = "—";

  if (decisionSpan?.metadataJson) {
    try {
      const meta = JSON.parse(decisionSpan.metadataJson);
      selectedMode = meta.selected_mode || "—";
    } catch { /* ignore */ }
  }

  if (aiSpan?.metadataJson) {
    try {
      const meta = JSON.parse(aiSpan.metadataJson);
      confidence = meta.retrieval_confidence || 0;
    } catch { /* ignore */ }
  }

  return (
    <div className="px-6 py-4 border-t border-[#EADAD6]">
      <h2 className="text-xs font-medium text-[#7A6664] uppercase tracking-wider font-[family-name:var(--font-geist-mono)] mb-3">
        Decision Signals
      </h2>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#F6ECEA] rounded-md px-3 py-2.5 border border-[#EADAD6]">
          <p className="text-[10px] text-[#A9908D] uppercase tracking-wider font-[family-name:var(--font-geist-mono)]">
            Confidence
          </p>
          <p className={`text-lg font-semibold font-[family-name:var(--font-geist-mono)] ${scoreColor(confidence)}`}>
            {(confidence * 100).toFixed(1)}%
          </p>
        </div>
        <div className="bg-[#F6ECEA] rounded-md px-3 py-2.5 border border-[#EADAD6]">
          <p className="text-[10px] text-[#A9908D] uppercase tracking-wider font-[family-name:var(--font-geist-mono)]">
            Final Mode
          </p>
          <p className="text-sm font-semibold font-[family-name:var(--font-geist-mono)] text-[#2F2624] mt-1">
            {selectedMode.replace(/_/g, " ")}
          </p>
        </div>
      </div>
    </div>
  );
}
