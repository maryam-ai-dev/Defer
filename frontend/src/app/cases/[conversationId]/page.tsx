"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Workspace } from "@/features/workspace/types/workspace";
import { fetchWorkspace } from "@/features/workspace/api/workspace-api";
import { WorkspaceShell } from "@/features/workspace/components/WorkspaceShell";
import { ConversationThread } from "@/features/chat/components/ConversationThread";
import { ChatComposer } from "@/features/chat/components/ChatComposer";
import { SystemEventCard } from "@/features/chat/components/SystemEventCard";
import { sendTurn } from "@/features/chat/api/conversation-api";
import { CaseSummaryCard } from "@/features/casefile/components/CaseSummaryCard";
import { CustomerStateCard } from "@/features/casefile/components/CustomerStateCard";
import { AttemptedActionsCard } from "@/features/casefile/components/AttemptedActionsCard";
import { ResolutionModeCard } from "@/features/casefile/components/ResolutionModeCard";

export default function CaseWorkspacePage() {
  const params = useParams();
  const conversationId = params.conversationId as string;
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [lastMode, setLastMode] = useState<string | null>(null);

  const loadWorkspace = useCallback(() => {
    if (!conversationId) return;
    fetchWorkspace(conversationId)
      .then(setWorkspace)
      .catch((e) => setError(e.message));
  }, [conversationId]);

  useEffect(() => {
    loadWorkspace();
  }, [loadWorkspace]);

  const handleSend = async (message: string) => {
    if (!conversationId || sending) return;
    setSending(true);
    try {
      const result = await sendTurn(conversationId, message);
      setLastMode(result.resolutionMode);
      loadWorkspace();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-red-400 text-sm">{error}</p>
      </div>
    );
  }

  if (!workspace) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-[#5a5a6a] text-sm">Loading workspace...</p>
      </div>
    );
  }

  return (
    <WorkspaceShell
      center={
        <div className="flex flex-col h-full">
          <div className="border-b border-[#2e2e38] px-4 py-3">
            <h2 className="text-sm font-medium text-[#e8e8f0]">Conversation</h2>
            <p className="text-xs text-[#5a5a6a] mt-0.5 font-[family-name:var(--font-geist-mono)]">
              {workspace.conversation.id.slice(0, 8)}... &middot; {workspace.conversation.channel} &middot; {workspace.conversation.status}
            </p>
          </div>
          <ConversationThread messages={workspace.messages} />
          {lastMode && <SystemEventCard mode={lastMode} />}
          <ChatComposer onSend={handleSend} disabled={sending} />
        </div>
      }
      right={
        <div className="p-4 space-y-5">
          {workspace.caseFile ? (
            <>
              <ResolutionModeCard
                mode={workspace.caseFile.currentResolutionMode}
                decision={workspace.latestDecision}
              />
              <CaseSummaryCard
                issueSummary={workspace.caseFile.issueSummary}
                customerGoal={workspace.caseFile.customerGoal}
              />
              <CustomerStateCard
                frustration={workspace.caseFile.frustrationScore}
                confusion={workspace.caseFile.confusionScore}
                effort={workspace.caseFile.effortScore}
                trustRisk={workspace.caseFile.trustRiskScore}
              />
              <AttemptedActionsCard actions={workspace.attemptedActions} />
              {workspace.handoffPacket && (
                <div className="space-y-2.5">
                  <h3 className="text-xs font-medium text-red-400 uppercase tracking-wider font-[family-name:var(--font-geist-mono)]">
                    Handoff Packet
                  </h3>
                  <div className="rounded-md px-3 py-2.5 bg-red-500/10 border border-red-500/20">
                    <p className="text-xs text-red-400 font-[family-name:var(--font-geist-mono)]">
                      {workspace.handoffPacket.escalationReason.replace(/_/g, " ")}
                    </p>
                    <p className="text-[10px] text-[#5a5a6a] mt-1">{workspace.handoffPacket.suggestedNextAction}</p>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-xs text-[#5a5a6a]">No case data yet</p>
            </div>
          )}
        </div>
      }
    />
  );
}
