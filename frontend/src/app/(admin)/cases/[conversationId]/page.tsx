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
import { ErrorBoundary } from "@/shared/components/ErrorBoundary";
import { PolicyEditorPanel } from "@/features/policy/components/PolicyEditorPanel";
import { PolicySimulationResult } from "@/features/policy/components/PolicySimulationResult";
import { simulatePolicy, PolicyOverride, TurnComparison } from "@/features/policy/api/policy-api";
import { fetchTracesByConversation } from "@/features/traces/api/traces-api";
import Link from "next/link";

type RightTab = "intelligence" | "policy";

export default function CaseWorkspacePage() {
  const params = useParams();
  const conversationId = params.conversationId as string;
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [lastMode, setLastMode] = useState<string | null>(null);
  const [rightTab, setRightTab] = useState<RightTab>("intelligence");
  const [simulating, setSimulating] = useState(false);
  const [simResult, setSimResult] = useState<TurnComparison[] | null>(null);
  const [latestTraceId, setLatestTraceId] = useState<string | null>(null);

  const loadWorkspace = useCallback(() => {
    if (!conversationId) return;
    fetchWorkspace(conversationId)
      .then(setWorkspace)
      .catch((e) => setError(e.message));
    fetchTracesByConversation(conversationId)
      .then((spans) => setLatestTraceId(spans.length ? spans[spans.length - 1].id : null))
      .catch(() => setLatestTraceId(null));
  }, [conversationId]);

  useEffect(() => {
    loadWorkspace();
  }, [loadWorkspace]);

  // Poll every 3s when tab is visible, stop when case is terminal
  useEffect(() => {
    const isTerminal =
      workspace?.caseFile?.status === "ESCALATED" ||
      workspace?.caseFile?.status === "RESOLVED";
    if (!conversationId || isTerminal) return;

    const interval = setInterval(() => {
      if (document.visibilityState === "visible") {
        loadWorkspace();
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [conversationId, loadWorkspace, workspace?.caseFile?.status]);

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

  const handleSimulate = async (override: PolicyOverride) => {
    if (!conversationId) return;
    setSimulating(true);
    try {
      const result = await simulatePolicy(conversationId, override);
      setSimResult(result.turns);
    } catch {
      setSimResult([]);
    } finally {
      setSimulating(false);
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-[#A24B50] text-sm">{error}</p>
      </div>
    );
  }

  if (!workspace) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="space-y-2 text-center">
          <div className="animate-pulse rounded-full bg-[#EADAD6] h-8 w-8 mx-auto" />
          <p className="text-[#A9908D] text-sm">Loading workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
    <WorkspaceShell
      center={
        <div className="flex flex-col h-full">
          <div className="border-b border-[#EADAD6] px-4 py-3">
            <p className="text-[10px] uppercase tracking-wider text-[#A9908D] font-[family-name:var(--font-geist-mono)]">
              Case #{workspace.conversation.id.slice(0, 8)} &middot; {workspace.conversation.channel} &middot; {workspace.conversation.status}
            </p>
            <h2 className="text-lg font-medium text-[#2F2624] font-[family-name:var(--font-serif)] mt-0.5">
              {workspace.caseFile?.issueSummary || "Conversation"}
            </h2>
          </div>
          <ConversationThread messages={workspace.messages} />
          {lastMode && <SystemEventCard mode={lastMode} />}
          <ChatComposer onSend={handleSend} disabled={sending} />
        </div>
      }
      right={
        <div className="flex flex-col h-full">
          {/* Tabs */}
          <div className="flex border-b border-[#EADAD6] shrink-0">
            <button
              onClick={() => setRightTab("intelligence")}
              className={`flex-1 px-3 py-2.5 text-[10px] uppercase tracking-wider font-[family-name:var(--font-geist-mono)] transition-colors ${
                rightTab === "intelligence"
                  ? "text-[#A24B50] border-b-2 border-[#A24B50]"
                  : "text-[#A9908D] hover:text-[#7A6664]"
              }`}
            >
              Intelligence
            </button>
            <button
              onClick={() => setRightTab("policy")}
              className={`flex-1 px-3 py-2.5 text-[10px] uppercase tracking-wider font-[family-name:var(--font-geist-mono)] transition-colors ${
                rightTab === "policy"
                  ? "text-[#A24B50] border-b-2 border-[#A24B50]"
                  : "text-[#A9908D] hover:text-[#7A6664]"
              }`}
            >
              Policy
            </button>
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-5">
            {rightTab === "intelligence" && (
              <>
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
                        <h3 className="text-xs font-medium text-[#A24B50] uppercase tracking-wider font-[family-name:var(--font-geist-mono)]">
                          Handoff Packet
                        </h3>
                        <div className="rounded-md px-3 py-2.5 bg-[#A24B50]/10 border border-[#A24B50]/20">
                          <p className="text-xs text-[#A24B50] font-[family-name:var(--font-geist-mono)]">
                            {workspace.handoffPacket.escalationReason.replace(/_/g, " ")}
                          </p>
                          <p className="text-[10px] text-[#A9908D] mt-1">{workspace.handoffPacket.suggestedNextAction}</p>
                          <Link
                            href={`/handoffs/${workspace.handoffPacket.id}`}
                            target="_blank"
                            className="text-[10px] text-[#A24B50] hover:underline mt-2 inline-block"
                          >
                            View full handoff packet &rarr;
                          </Link>
                        </div>
                      </div>
                    )}
                    {latestTraceId && (
                      <Link
                        href={`/traces/${latestTraceId}`}
                        target="_blank"
                        className="text-[10px] text-[#A24B50] hover:underline block"
                      >
                        View trace timeline &rarr;
                      </Link>
                    )}
                  </>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-xs text-[#A9908D]">No case data yet</p>
                  </div>
                )}
              </>
            )}

            {rightTab === "policy" && (
              <>
                <PolicyEditorPanel onSimulate={handleSimulate} simulating={simulating} />
                {simResult && <PolicySimulationResult turns={simResult} />}
              </>
            )}
          </div>
        </div>
      }
    />
    </ErrorBoundary>
  );
}
