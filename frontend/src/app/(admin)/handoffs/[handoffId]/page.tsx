"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { HandoffPacket } from "@/features/handoff/types/handoff";
import { fetchHandoff } from "@/features/handoff/api/handoff-api";
import { HandoffHeader } from "@/features/handoff/components/HandoffHeader";
import { HandoffSummaryCard } from "@/features/handoff/components/HandoffSummaryCard";
import { HandoffAttemptedActions } from "@/features/handoff/components/HandoffAttemptedActions";
import { HandoffCustomerState } from "@/features/handoff/components/HandoffCustomerState";
import { HandoffNextActionCard } from "@/features/handoff/components/HandoffNextActionCard";
import { HandoffEvidenceCard } from "@/features/handoff/components/HandoffEvidenceCard";

export default function HandoffPage() {
  const params = useParams();
  const handoffId = params.handoffId as string;
  const [handoff, setHandoff] = useState<HandoffPacket | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!handoffId) return;
    fetchHandoff(handoffId)
      .then(setHandoff)
      .catch((e) => setError(e.message));
  }, [handoffId]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-red-400 text-sm">{error}</p>
      </div>
    );
  }

  if (!handoff) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-[#5a5a6a] text-sm">Loading handoff packet...</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-3xl mx-auto">
        <HandoffHeader
          handoffId={handoff.id}
          conversationId={handoff.conversationId}
          escalationReason={handoff.escalationReason}
          createdAt={handoff.createdAt}
        />
        <div className="px-6 py-6 space-y-8">
          <HandoffNextActionCard action={handoff.suggestedNextAction} />
          <HandoffSummaryCard
            issueSummary={handoff.issueSummary}
            customerGoal={handoff.customerGoal}
          />
          <HandoffCustomerState state={handoff.customerState} />
          <HandoffAttemptedActions steps={handoff.stepsAttempted} />
          <HandoffEvidenceCard unresolvedItems={handoff.unresolvedItems} />
        </div>
      </div>
    </div>
  );
}
