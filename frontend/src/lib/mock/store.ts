import { CaseListItem } from "@/features/cases/types/case";
import { Workspace } from "@/features/workspace/types/workspace";
import { HandoffPacket } from "@/features/handoff/types/handoff";
import { TraceSpan } from "@/features/traces/types/trace";
import { EvalRun } from "@/features/evals/types/eval";
import { TurnResponse } from "@/features/chat/types/message";
import {
  FIXTURE_WORKSPACES,
  FIXTURE_HANDOFFS,
  FIXTURE_TRACES,
  FIXTURE_EVAL_RUNS,
  FIXTURE_CASE_FILE_TO_CONVERSATION,
} from "./fixtures";
import { loadStore, saveStore, DemoConversationState } from "./persist";
import { applyTurn, initialTurnState, TurnState } from "./chat-engine";

function delay(ms = 450): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function toTurnState(conv: DemoConversationState): TurnState {
  return {
    frustration: conv.frustration,
    confusion: conv.confusion,
    effort: conv.effort,
    trustRisk: conv.trustRisk,
    degradation: conv.degradation,
    repetitionCount: conv.repetitionCount,
    lastCustomerMessage: null,
    issueSummary: conv.issueSummary,
    customerGoal: conv.customerGoal,
  };
}

function dynamicWorkspace(conv: DemoConversationState): Workspace {
  const escalated = conv.resolutionMode === "HUMAN_ESCALATION";
  return {
    conversation: {
      id: conv.id,
      status: conv.status,
      channel: conv.channel,
      createdAt: conv.createdAt,
    },
    messages: conv.messages,
    caseFile: {
      id: `${conv.id}-cf`,
      status: conv.status,
      issueSummary: conv.issueSummary,
      customerGoal: conv.customerGoal,
      currentResolutionMode: conv.resolutionMode,
      escalationCandidate: escalated,
      repetitionCount: conv.repetitionCount,
      frustrationScore: conv.frustration,
      confusionScore: conv.confusion,
      effortScore: conv.effort,
      trustRiskScore: conv.trustRisk,
      updatedAt: conv.messages[conv.messages.length - 1]?.createdAt ?? conv.createdAt,
    },
    attemptedActions: conv.attemptedActions,
    openQuestions: [],
    latestCustomerState: conv.messages.length
      ? {
          frustrationScore: conv.frustration,
          confusionScore: conv.confusion,
          effortScore: conv.effort,
          trustRiskScore: conv.trustRisk,
          degradationScore: conv.degradation,
          createdAt: conv.messages[conv.messages.length - 1].createdAt,
        }
      : null,
    latestDecision: conv.messages.length
      ? {
          selectedMode: conv.resolutionMode,
          rationale: [],
          retrievalConfidence: 0.6,
          createdAt: conv.messages[conv.messages.length - 1].createdAt,
        }
      : null,
    handoffPacket:
      escalated && conv.handoffId
        ? {
            id: conv.handoffId,
            escalationReason: "REPEATED_CONTACT_HIGH_FRUSTRATION",
            issueSummary: conv.issueSummary ?? "",
            suggestedNextAction: "Review conversation history and continue resolution with full context.",
            customerState: {
              frustrationScore: conv.frustration,
              confusionScore: conv.confusion,
              effortScore: conv.effort,
              trustRiskScore: conv.trustRisk,
            },
            createdAt: conv.messages[conv.messages.length - 1]?.createdAt ?? conv.createdAt,
          }
        : null,
  };
}

function dynamicCaseListItem(conv: DemoConversationState): CaseListItem {
  return {
    caseFileId: `${conv.id}-cf`,
    conversationId: conv.id,
    status: conv.status,
    resolutionMode: conv.resolutionMode || null,
    issueSummary: conv.issueSummary,
    currentFrustrationScore: conv.frustration,
    currentEffortScore: conv.effort,
    escalationCandidate: conv.resolutionMode === "HUMAN_ESCALATION",
    updatedAt: conv.messages[conv.messages.length - 1]?.createdAt ?? conv.createdAt,
  };
}

function dynamicTraces(conv: DemoConversationState): TraceSpan[] {
  const turnCount = conv.messages.filter((m) => m.senderType === "CUSTOMER").length;
  const spans: TraceSpan[] = [];
  const stages = ["RETRIEVAL", "SCORING", "GENERATION", "POLICY_DECISION"] as const;
  for (let t = 0; t < turnCount; t++) {
    for (const stage of stages) {
      spans.push({
        id: `${conv.id}-trace-${t}-${stage.toLowerCase()}`,
        conversationId: conv.id,
        spanType: stage,
        spanName: `${stage.toLowerCase()}_turn_${t}`,
        metadataJson: JSON.stringify({ turn: t }),
        startedAt: conv.messages[Math.min(t * 2, conv.messages.length - 1)]?.createdAt ?? conv.createdAt,
        endedAt: conv.messages[Math.min(t * 2 + 1, conv.messages.length - 1)]?.createdAt ?? conv.createdAt,
      });
    }
  }
  return spans;
}

export function listCases(params?: { status?: string; escalationCandidate?: boolean; minEffortScore?: number }): CaseListItem[] {
  const store = loadStore();
  const dynamic = Object.values(store.conversations)
    .filter((c) => c.messages.length > 0)
    .map(dynamicCaseListItem);
  const fixtures = Object.values(FIXTURE_WORKSPACES).map((ws) => ({
    caseFileId: ws.caseFile!.id,
    conversationId: ws.conversation.id,
    status: ws.conversation.status,
    resolutionMode: ws.caseFile!.currentResolutionMode,
    issueSummary: ws.caseFile!.issueSummary,
    currentFrustrationScore: ws.caseFile!.frustrationScore,
    currentEffortScore: ws.caseFile!.effortScore,
    escalationCandidate: ws.caseFile!.escalationCandidate,
    updatedAt: ws.caseFile!.updatedAt,
  }));

  let all = [...dynamic, ...fixtures];
  if (params?.status) all = all.filter((c) => c.status === params.status);
  if (params?.escalationCandidate !== undefined) all = all.filter((c) => c.escalationCandidate === params.escalationCandidate);
  if (params?.minEffortScore !== undefined) all = all.filter((c) => c.currentEffortScore >= params.minEffortScore!);

  return all.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

export function getWorkspace(conversationId: string): Workspace {
  if (FIXTURE_WORKSPACES[conversationId]) return FIXTURE_WORKSPACES[conversationId];
  const store = loadStore();
  const conv = store.conversations[conversationId];
  if (!conv) throw new Error("404");
  return dynamicWorkspace(conv);
}

export function getCaseFile(caseFileId: string) {
  const conversationId = FIXTURE_CASE_FILE_TO_CONVERSATION[caseFileId] ?? caseFileId.replace(/-cf$/, "");
  const ws = getWorkspace(conversationId);
  if (!ws.caseFile) throw new Error("404");
  return ws.caseFile;
}

export function getHandoff(handoffId: string): HandoffPacket {
  if (FIXTURE_HANDOFFS[handoffId]) return FIXTURE_HANDOFFS[handoffId];
  const store = loadStore();
  const conv = Object.values(store.conversations).find((c) => c.handoffId === handoffId);
  if (!conv) throw new Error("404");
  const ws = dynamicWorkspace(conv);
  if (!ws.handoffPacket) throw new Error("404");
  return {
    id: ws.handoffPacket.id,
    caseFileId: `${conv.id}-cf`,
    conversationId: conv.id,
    escalationReason: ws.handoffPacket.escalationReason,
    issueSummary: ws.handoffPacket.issueSummary,
    customerGoal: conv.customerGoal,
    stepsAttempted: conv.attemptedActions.map((a) => a.actionSummary),
    unresolvedItems: ["Confirm resolution with customer and close out the case."],
    customerState: ws.handoffPacket.customerState,
    suggestedNextAction: ws.handoffPacket.suggestedNextAction,
    createdAt: ws.handoffPacket.createdAt,
  };
}

export function getTracesByConversation(conversationId: string): TraceSpan[] {
  if (FIXTURE_TRACES[conversationId]) return FIXTURE_TRACES[conversationId];
  const store = loadStore();
  const conv = store.conversations[conversationId];
  if (!conv) return [];
  return dynamicTraces(conv);
}

export function getTrace(traceId: string): TraceSpan {
  for (const spans of Object.values(FIXTURE_TRACES)) {
    const found = spans.find((s) => s.id === traceId);
    if (found) return found;
  }
  const store = loadStore();
  for (const conv of Object.values(store.conversations)) {
    const found = dynamicTraces(conv).find((s) => s.id === traceId);
    if (found) return found;
  }
  throw new Error("404");
}

export function getEvalRuns(): EvalRun[] {
  const store = loadStore();
  return [...store.evalRuns, ...FIXTURE_EVAL_RUNS];
}

export function runEval(): EvalRun {
  const prior = getEvalRuns();
  const passed = 21 + Math.floor(Math.random() * 3);
  const total = 24;
  const run: EvalRun = {
    id: `eval-run-${prior.length + 1}`,
    name: "Nightly escalation regression",
    metricsJson: JSON.stringify({
      totalScenarios: total,
      passed,
      failed: total - passed,
      escalationCorrectness: Number((0.8 + Math.random() * 0.15).toFixed(2)),
      passRate: Number((passed / total).toFixed(3)),
    }),
    startedAt: new Date().toISOString(),
    endedAt: new Date().toISOString(),
    results: [
      { id: "r1", scenarioId: "billing-dispute-repeat-contact", description: "Repeated billing dispute should escalate", expectedMode: "HUMAN_ESCALATION", actualMode: "HUMAN_ESCALATION", passed: true, turnCount: 5 },
      { id: "r2", scenarioId: "return-policy-ambiguous", description: "Ambiguous return policy should request clarification", expectedMode: "CLARIFICATION_REQUIRED", actualMode: "CLARIFICATION_REQUIRED", passed: true, turnCount: 2 },
      { id: "r3", scenarioId: "lost-package-fraud-check", description: "Lost package claim should route to human review draft", expectedMode: "HUMAN_REVIEW_DRAFT", actualMode: passed >= 23 ? "HUMAN_REVIEW_DRAFT" : "DIRECT_ANSWER", passed: passed >= 23, turnCount: 2 },
      { id: "r4", scenarioId: "order-status-lookup", description: "Simple order status should resolve directly", expectedMode: "DIRECT_ANSWER", actualMode: "DIRECT_ANSWER", passed: true, turnCount: 1 },
    ],
  };
  const store = loadStore();
  store.evalRuns = [run, ...store.evalRuns];
  saveStore(store);
  return run;
}

export function createConversation(channel: string): { id: string } {
  const id = crypto.randomUUID();
  const conv: DemoConversationState = {
    id,
    channel,
    createdAt: new Date().toISOString(),
    status: "OPEN",
    messages: [],
    frustration: 0.05,
    confusion: 0.05,
    effort: 0.05,
    trustRisk: 0.05,
    degradation: 0,
    repetitionCount: 0,
    resolutionMode: "",
    issueSummary: null,
    customerGoal: null,
    attemptedActions: [],
    handoffId: null,
    traceId: null,
  };
  const store = loadStore();
  store.conversations[id] = conv;
  saveStore(store);
  return { id };
}

export async function sendTurn(conversationId: string, message: string): Promise<TurnResponse> {
  await delay();
  const store = loadStore();
  const conv = store.conversations[conversationId];
  if (!conv) throw new Error("Conversation not found");

  const turnState = toTurnState(conv);
  const outcome = applyTurn(turnState, message);

  conv.frustration = turnState.frustration;
  conv.confusion = turnState.confusion;
  conv.effort = turnState.effort;
  conv.trustRisk = turnState.trustRisk;
  conv.degradation = turnState.degradation;
  conv.repetitionCount = turnState.repetitionCount;
  conv.issueSummary = turnState.issueSummary;
  conv.customerGoal = turnState.customerGoal;
  conv.resolutionMode = outcome.mode;

  const turnIndex = conv.messages.length;
  const customerMsg = {
    id: crypto.randomUUID(),
    senderType: "CUSTOMER",
    body: message,
    turnIndex,
    createdAt: new Date().toISOString(),
  };
  const assistantMsg = {
    id: crypto.randomUUID(),
    senderType: "ASSISTANT",
    body: outcome.reply,
    turnIndex: turnIndex + 1,
    createdAt: new Date().toISOString(),
  };
  conv.messages.push(customerMsg, assistantMsg);

  conv.attemptedActions.push({
    id: crypto.randomUUID(),
    actionType: "KB_LOOKUP",
    actionSummary: "Retrieved relevant policy and drafted a response",
    outcome: outcome.mode === "HUMAN_ESCALATION" ? "ESCALATED" : "SUCCESS",
    source: "AI",
    createdAt: assistantMsg.createdAt,
  });

  const escalated = outcome.mode === "HUMAN_ESCALATION";
  let handoffId: string | null = conv.handoffId;
  let traceId: string | null = null;

  if (escalated) {
    conv.status = "ESCALATED";
    if (!handoffId) {
      handoffId = `${conv.id}-handoff`;
      conv.handoffId = handoffId;
    }
  }

  const spans = dynamicTraces(conv);
  traceId = spans.length ? spans[spans.length - 1].id : null;

  store.conversations[conversationId] = conv;
  saveStore(store);

  return {
    assistantMessage: {
      id: assistantMsg.id,
      conversationId,
      senderType: assistantMsg.senderType,
      body: assistantMsg.body,
      turnIndex: assistantMsg.turnIndex,
      createdAt: assistantMsg.createdAt,
    },
    resolutionMode: outcome.mode,
    escalated,
    caseFileId: `${conv.id}-cf`,
    handoffId,
    traceId,
  };
}

interface PolicyOverride {
  escalationFrustrationThreshold: number | null;
  escalationEffortThreshold: number | null;
  escalationRepetitionCount: number | null;
  minConfidenceForDirectAnswer: number | null;
  requiresReviewConfidenceFloor: number | null;
}

interface TurnComparison {
  turnIndex: number;
  suggestedMode: string;
  selectedMode: string;
  simulatedMode: string;
  changed: boolean;
}

interface SimulationResult {
  turns: TurnComparison[];
}

export async function simulatePolicy(conversationId: string, override: PolicyOverride): Promise<SimulationResult> {
  await delay(600);
  const ws = getWorkspace(conversationId);
  const cf = ws.caseFile;
  if (!cf) return { turns: [] };

  const turns: TurnComparison[] = ws.messages
    .filter((m) => m.senderType === "CUSTOMER")
    .map((_, i) => {
      const suggestedMode = cf.currentResolutionMode ?? "DIRECT_ANSWER";
      const selectedMode = suggestedMode;
      let simulatedMode = suggestedMode;

      const frustrationThreshold = override.escalationFrustrationThreshold ?? 0.75;
      const effortThreshold = override.escalationEffortThreshold ?? 0.7;
      const repetitionThreshold = override.escalationRepetitionCount ?? 2;

      const wouldEscalate =
        cf.frustrationScore >= frustrationThreshold ||
        cf.effortScore >= effortThreshold ||
        cf.repetitionCount >= repetitionThreshold;

      if (wouldEscalate && selectedMode !== "HUMAN_ESCALATION") {
        simulatedMode = "HUMAN_ESCALATION";
      } else if (!wouldEscalate && selectedMode === "HUMAN_ESCALATION") {
        simulatedMode = "HUMAN_REVIEW_DRAFT";
      }

      return {
        turnIndex: i,
        suggestedMode,
        selectedMode,
        simulatedMode,
        changed: simulatedMode !== selectedMode,
      };
    });

  return { turns };
}
