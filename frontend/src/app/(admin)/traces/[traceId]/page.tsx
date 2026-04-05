"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { TraceSpan } from "@/features/traces/types/trace";
import { fetchTrace, fetchTracesByConversation } from "@/features/traces/api/traces-api";
import { TraceHeader } from "@/features/traces/components/TraceHeader";
import { TraceTimeline } from "@/features/traces/components/TraceTimeline";
import { RiskSignalsPanel } from "@/features/traces/components/RiskSignalsPanel";

export default function TracePage() {
  const params = useParams();
  const traceId = params.traceId as string;
  const [spans, setSpans] = useState<TraceSpan[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!traceId) return;
    // First fetch the single trace to get conversationId, then load all spans
    fetchTrace(traceId)
      .then((span) => {
        setConversationId(span.conversationId);
        return fetchTracesByConversation(span.conversationId);
      })
      .then(setSpans)
      .catch((e) => setError(e.message));
  }, [traceId]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-red-400 text-sm">{error}</p>
      </div>
    );
  }

  if (!conversationId || spans.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-[#5a5a6a] text-sm">Loading trace...</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-3xl mx-auto">
        <TraceHeader conversationId={conversationId} spans={spans} />
        <TraceTimeline spans={spans} />
        <RiskSignalsPanel spans={spans} />
      </div>
    </div>
  );
}
