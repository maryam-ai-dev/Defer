"use client";

import { useEffect, useState, useCallback } from "react";
import { createDemoConversation, sendMessage } from "@/features/demo/api/demo-api";
import { TurnResponse } from "@/features/chat/types/message";
import { fetchWorkspace } from "@/features/workspace/api/workspace-api";
import { DemoShell } from "@/features/demo/components/DemoShell";
import { DemoStatusBar } from "@/features/demo/components/DemoStatusBar";
import { DemoChatThread, DemoMessage } from "@/features/demo/components/DemoChatThread";
import { DemoChatComposer } from "@/features/demo/components/DemoChatComposer";
import { DemoLiveScores, LiveScores } from "@/features/demo/components/DemoLiveScores";

export default function DemoPage() {
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<DemoMessage[]>([]);
  const [sending, setSending] = useState(false);
  const [escalated, setEscalated] = useState(false);
  const [liveScores, setLiveScores] = useState<LiveScores | null>(null);

  useEffect(() => {
    createDemoConversation().then((conv) => {
      setConversationId(conv.id);
    });
  }, []);

  const refreshScores = useCallback(async (convId: string, mode: string) => {
    try {
      const ws = await fetchWorkspace(convId);
      if (ws.caseFile) {
        setLiveScores({
          frustrationScore: ws.caseFile.frustrationScore,
          confusionScore: ws.caseFile.confusionScore,
          effortScore: ws.caseFile.effortScore,
          trustRiskScore: ws.caseFile.trustRiskScore,
          resolutionMode: mode,
          confidence: ws.latestDecision?.retrievalConfidence ?? 0,
        });
      }
    } catch {
      // Workspace may not exist yet on first turn timing
    }
  }, []);

  const handleSend = useCallback(async (text: string) => {
    if (!conversationId || sending || !text.trim()) return;
    setSending(true);

    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role: "customer", text: text.trim() },
    ]);

    try {
      const result: TurnResponse = await sendMessage(conversationId, text.trim());

      setMessages((prev) => [
        ...prev,
        { id: result.assistantMessage.id, role: "assistant", text: result.assistantMessage.body },
      ]);

      // Refresh live scores from workspace
      await refreshScores(conversationId, result.resolutionMode);

      if (result.escalated) {
        setEscalated(true);
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: "system",
            text: "Connecting you to a specialist. A support agent will review your case shortly.",
          },
        ]);
      }

      if (result.resolutionMode === "CLARIFICATION_REQUIRED") {
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: "system",
            text: "We need a bit more information to help you.",
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: "system", text: "Something went wrong. Please try again." },
      ]);
    } finally {
      setSending(false);
    }
  }, [conversationId, sending, refreshScores]);

  return (
    <DemoShell>
      <DemoStatusBar conversationId={conversationId} />
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 flex flex-col">
          <DemoChatThread messages={messages} sending={sending} />
          <DemoChatComposer onSend={handleSend} disabled={sending || escalated || !conversationId} />
        </div>
        <DemoLiveScores scores={liveScores} />
      </div>
    </DemoShell>
  );
}
