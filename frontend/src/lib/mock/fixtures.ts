import { Workspace } from "@/features/workspace/types/workspace";
import { HandoffPacket } from "@/features/handoff/types/handoff";
import { TraceSpan } from "@/features/traces/types/trace";
import { EvalRun } from "@/features/evals/types/eval";

function hoursAgo(h: number): string {
  return new Date(Date.now() - h * 3600_000).toISOString();
}

function minutesAgo(m: number): string {
  return new Date(Date.now() - m * 60_000).toISOString();
}

interface FixtureCase {
  conversationId: string;
  caseFileId: string;
  status: string;
  channel: string;
  createdHoursAgo: number;
  messages: { role: "customer" | "assistant"; text: string; minutesAgoAtEnd: number }[];
  issueSummary: string;
  customerGoal: string;
  resolutionMode: string;
  frustration: number;
  confusion: number;
  effort: number;
  trustRisk: number;
  degradation: number;
  repetitionCount: number;
  confidence: number;
  rationale: string[];
  attemptedActions: { actionType: string; actionSummary: string; outcome: string; source: string }[];
  openQuestions: { questionText: string; status: string; source: string }[];
  escalationReason?: string;
  stepsAttempted?: string[];
  unresolvedItems?: string[];
  suggestedNextAction?: string;
}

const FIXTURE_DEFS: FixtureCase[] = [
  {
    conversationId: "a1000000-0000-4000-8000-000000000001",
    caseFileId: "b1000000-0000-4000-8000-000000000001",
    status: "RESOLVED",
    channel: "web",
    createdHoursAgo: 26,
    messages: [
      { role: "customer", text: "Hi, my order #48213 hasn't arrived yet. It was supposed to be here Tuesday.", minutesAgoAtEnd: 1560 },
      { role: "assistant", text: "I checked order #48213 — it's currently in transit and running one day behind schedule due to a regional carrier delay. Updated delivery is expected tomorrow by end of day. I've also applied a $5 credit to your account for the inconvenience.", minutesAgoAtEnd: 1559 },
      { role: "customer", text: "Okay, that works, thank you.", minutesAgoAtEnd: 1558 },
    ],
    issueSummary: "Delayed delivery on order #48213 due to carrier backlog.",
    customerGoal: "Get an accurate delivery estimate for a delayed order.",
    resolutionMode: "DIRECT_ANSWER",
    frustration: 0.12,
    confusion: 0.05,
    effort: 0.1,
    trustRisk: 0.08,
    degradation: 0.0,
    repetitionCount: 0,
    confidence: 0.93,
    rationale: ["Retrieval confidence above direct-answer threshold", "No frustration or repetition signals detected"],
    attemptedActions: [
      { actionType: "KB_LOOKUP", actionSummary: "Retrieved shipping policy and carrier delay procedure", outcome: "SUCCESS", source: "AI" },
      { actionType: "GOODWILL_CREDIT", actionSummary: "Applied $5 account credit", outcome: "SUCCESS", source: "AI" },
    ],
    openQuestions: [],
  },
  {
    conversationId: "a1000000-0000-4000-8000-000000000002",
    caseFileId: "b1000000-0000-4000-8000-000000000002",
    status: "OPEN",
    channel: "web",
    createdHoursAgo: 4,
    messages: [
      { role: "customer", text: "I don't understand your return policy, can I return an item after 30 days or not?", minutesAgoAtEnd: 240 },
      { role: "assistant", text: "Good question — it depends on the item type. Standard items have a 30-day window, but electronics have a 15-day window. Could you tell me what item you're trying to return so I can confirm which policy applies?", minutesAgoAtEnd: 239 },
      { role: "customer", text: "It's a pair of headphones, so which one applies?", minutesAgoAtEnd: 180 },
    ],
    issueSummary: "Customer unsure which return-window policy applies to their item.",
    customerGoal: "Confirm return eligibility for headphones purchased 22 days ago.",
    resolutionMode: "CLARIFICATION_REQUIRED",
    frustration: 0.28,
    confusion: 0.58,
    effort: 0.3,
    trustRisk: 0.2,
    degradation: 0.1,
    repetitionCount: 0,
    confidence: 0.61,
    rationale: ["Confusion score above clarification threshold", "Multiple applicable policies require disambiguation"],
    attemptedActions: [
      { actionType: "KB_LOOKUP", actionSummary: "Retrieved general and electronics return policy sections", outcome: "PARTIAL", source: "AI" },
    ],
    openQuestions: [
      { questionText: "Which product category is being returned?", status: "OPEN", source: "AI" },
    ],
  },
  {
    conversationId: "a1000000-0000-4000-8000-000000000003",
    caseFileId: "b1000000-0000-4000-8000-000000000003",
    status: "ESCALATED",
    channel: "web",
    createdHoursAgo: 2,
    messages: [
      { role: "customer", text: "I was charged twice for order #77120. This is unacceptable.", minutesAgoAtEnd: 118 },
      { role: "assistant", text: "I'm sorry about that — I can see two charges of $84.50 on order #77120. Let me look into whether this was a duplicate authorization or an actual double charge.", minutesAgoAtEnd: 117 },
      { role: "customer", text: "I already tried calling about this yesterday and no one fixed it.", minutesAgoAtEnd: 90 },
      { role: "assistant", text: "I understand this is the second time you've had to raise this. I don't have visibility into the phone call, but I want to make sure this gets resolved properly this time.", minutesAgoAtEnd: 89 },
      { role: "customer", text: "This is the third time I've contacted you about the same billing issue. I want a manager, now.", minutesAgoAtEnd: 60 },
    ],
    issueSummary: "Customer double-charged on order #77120, third contact attempt with no resolution.",
    customerGoal: "Get the duplicate charge reversed and confirmation it won't recur.",
    resolutionMode: "HUMAN_ESCALATION",
    frustration: 0.86,
    confusion: 0.22,
    effort: 0.79,
    trustRisk: 0.71,
    degradation: 0.4,
    repetitionCount: 3,
    confidence: 0.74,
    rationale: [
      "Frustration score 0.86 exceeds escalation threshold 0.75",
      "Repetition count 3 exceeds threshold 2",
      "Explicit request for human agent detected",
    ],
    attemptedActions: [
      { actionType: "KB_LOOKUP", actionSummary: "Retrieved duplicate-charge dispute procedure", outcome: "PARTIAL", source: "AI" },
      { actionType: "BILLING_CHECK", actionSummary: "Flagged order #77120 for billing team review", outcome: "PENDING", source: "AI" },
    ],
    openQuestions: [
      { questionText: "Was the duplicate charge an auth hold or a settled transaction?", status: "OPEN", source: "AI" },
    ],
    escalationReason: "REPEATED_CONTACT_HIGH_FRUSTRATION",
    stepsAttempted: [
      "Looked up duplicate-charge dispute procedure",
      "Flagged order #77120 for billing team review",
      "Acknowledged repeated contact and elevated concern",
    ],
    unresolvedItems: [
      "Confirm whether $84.50 charge is a duplicate settlement or pending auth hold",
      "Process refund or reversal once confirmed",
    ],
    suggestedNextAction: "Prioritize as a repeat-contact billing dispute; verify duplicate charge with payments team and issue reversal within 24h.",
  },
  {
    conversationId: "a1000000-0000-4000-8000-000000000004",
    caseFileId: "b1000000-0000-4000-8000-000000000004",
    status: "RESOLVED",
    channel: "web",
    createdHoursAgo: 30,
    messages: [
      { role: "customer", text: "My package says delivered but I never got it.", minutesAgoAtEnd: 1800 },
      { role: "assistant", text: "I'm sorry to hear that. I've drafted a replacement shipment for order #61042, but I want a specialist to confirm there's no fraud flag before it goes out — you'll hear back within a few hours.", minutesAgoAtEnd: 1799 },
      { role: "customer", text: "Alright, thanks for looking into it.", minutesAgoAtEnd: 1750 },
    ],
    issueSummary: "Package marked delivered but customer reports non-receipt on order #61042.",
    customerGoal: "Receive the missing package or a replacement.",
    resolutionMode: "HUMAN_REVIEW_DRAFT",
    frustration: 0.45,
    confusion: 0.15,
    effort: 0.35,
    trustRisk: 0.42,
    degradation: 0.15,
    repetitionCount: 1,
    confidence: 0.68,
    rationale: ["Confidence below direct-answer floor for lost-package claims", "Routed to human-reviewed draft due to fraud-check policy"],
    attemptedActions: [
      { actionType: "KB_LOOKUP", actionSummary: "Retrieved lost-package replacement procedure", outcome: "SUCCESS", source: "AI" },
      { actionType: "DRAFT_REPLACEMENT", actionSummary: "Drafted replacement shipment pending human approval", outcome: "SUCCESS", source: "AI" },
      { actionType: "HUMAN_APPROVAL", actionSummary: "Specialist approved replacement shipment", outcome: "SUCCESS", source: "HUMAN" },
    ],
    openQuestions: [],
  },
  {
    conversationId: "a1000000-0000-4000-8000-000000000005",
    caseFileId: "b1000000-0000-4000-8000-000000000005",
    status: "OPEN",
    channel: "web",
    createdHoursAgo: 6,
    messages: [
      { role: "customer", text: "I can't log into my account, it keeps saying invalid password.", minutesAgoAtEnd: 360 },
      { role: "assistant", text: "Let's reset it — I've sent a password reset link to your account email. It should arrive within a few minutes.", minutesAgoAtEnd: 359 },
      { role: "customer", text: "I already tried that link twice, it says expired both times.", minutesAgoAtEnd: 300 },
      { role: "assistant", text: "Sorry about that — reset links expire after 15 minutes. I've generated a fresh one and extended its window to an hour. Please try again soon after receiving it.", minutesAgoAtEnd: 299 },
      { role: "customer", text: "Still not working, I've tried this four times now.", minutesAgoAtEnd: 60 },
    ],
    issueSummary: "Repeated password reset failures preventing account login.",
    customerGoal: "Regain access to their account.",
    resolutionMode: "HUMAN_REVIEW_DRAFT",
    frustration: 0.6,
    confusion: 0.3,
    effort: 0.68,
    trustRisk: 0.35,
    degradation: 0.35,
    repetitionCount: 4,
    confidence: 0.55,
    rationale: ["Effort score 0.68 driven by 4 repeated reset attempts", "Below escalation threshold but flagged for review due to repetition"],
    attemptedActions: [
      { actionType: "PASSWORD_RESET", actionSummary: "Sent password reset link (attempt 1)", outcome: "FAILED", source: "AI" },
      { actionType: "PASSWORD_RESET", actionSummary: "Sent extended-window reset link (attempt 2)", outcome: "FAILED", source: "AI" },
    ],
    openQuestions: [
      { questionText: "Is the customer's email provider delaying or blocking reset emails?", status: "OPEN", source: "AI" },
    ],
  },
];

function buildWorkspace(def: FixtureCase): Workspace {
  const messages = def.messages.map((m, i) => ({
    id: `${def.conversationId}-msg-${i}`,
    senderType: m.role === "customer" ? "CUSTOMER" : "ASSISTANT",
    body: m.text,
    turnIndex: i,
    createdAt: minutesAgo(m.minutesAgoAtEnd),
  }));

  const latestState = {
    frustrationScore: def.frustration,
    confusionScore: def.confusion,
    effortScore: def.effort,
    trustRiskScore: def.trustRisk,
    degradationScore: def.degradation,
    createdAt: messages[messages.length - 1]?.createdAt ?? hoursAgo(def.createdHoursAgo),
  };

  const handoffPacket = def.escalationReason
    ? {
        id: `${def.conversationId}-handoff`,
        escalationReason: def.escalationReason,
        issueSummary: def.issueSummary,
        suggestedNextAction: def.suggestedNextAction ?? "",
        customerState: {
          frustrationScore: def.frustration,
          confusionScore: def.confusion,
          effortScore: def.effort,
          trustRiskScore: def.trustRisk,
        },
        createdAt: latestState.createdAt,
      }
    : null;

  return {
    conversation: {
      id: def.conversationId,
      status: def.status,
      channel: def.channel,
      createdAt: hoursAgo(def.createdHoursAgo),
    },
    messages,
    caseFile: {
      id: def.caseFileId,
      status: def.status,
      issueSummary: def.issueSummary,
      customerGoal: def.customerGoal,
      currentResolutionMode: def.resolutionMode,
      escalationCandidate: def.status === "ESCALATED",
      repetitionCount: def.repetitionCount,
      frustrationScore: def.frustration,
      confusionScore: def.confusion,
      effortScore: def.effort,
      trustRiskScore: def.trustRisk,
      updatedAt: latestState.createdAt,
    },
    attemptedActions: def.attemptedActions.map((a, i) => ({
      id: `${def.conversationId}-action-${i}`,
      actionType: a.actionType,
      actionSummary: a.actionSummary,
      outcome: a.outcome,
      source: a.source,
      createdAt: messages[Math.min(i, messages.length - 1)]?.createdAt ?? hoursAgo(def.createdHoursAgo),
    })),
    openQuestions: def.openQuestions.map((q, i) => ({
      id: `${def.conversationId}-question-${i}`,
      questionText: q.questionText,
      status: q.status,
      source: q.source,
      createdAt: hoursAgo(def.createdHoursAgo),
    })),
    latestCustomerState: latestState,
    latestDecision: {
      selectedMode: def.resolutionMode,
      rationale: def.rationale,
      retrievalConfidence: def.confidence,
      createdAt: latestState.createdAt,
    },
    handoffPacket,
  };
}

export const FIXTURE_WORKSPACES: Record<string, Workspace> = Object.fromEntries(
  FIXTURE_DEFS.map((def) => [def.conversationId, buildWorkspace(def)])
);

export const FIXTURE_CASE_FILE_TO_CONVERSATION: Record<string, string> = Object.fromEntries(
  FIXTURE_DEFS.map((def) => [def.caseFileId, def.conversationId])
);

export const FIXTURE_HANDOFFS: Record<string, HandoffPacket> = Object.fromEntries(
  FIXTURE_DEFS.filter((def) => def.escalationReason).map((def) => {
    const ws = FIXTURE_WORKSPACES[def.conversationId];
    return [
      `${def.conversationId}-handoff`,
      {
        id: `${def.conversationId}-handoff`,
        caseFileId: def.caseFileId,
        conversationId: def.conversationId,
        escalationReason: def.escalationReason as string,
        issueSummary: def.issueSummary,
        customerGoal: def.customerGoal,
        stepsAttempted: def.stepsAttempted ?? [],
        unresolvedItems: def.unresolvedItems ?? [],
        customerState: ws.handoffPacket?.customerState ?? {},
        suggestedNextAction: def.suggestedNextAction ?? null,
        createdAt: ws.handoffPacket?.createdAt ?? hoursAgo(def.createdHoursAgo),
      },
    ];
  })
);

function buildTraceSpans(def: FixtureCase): TraceSpan[] {
  const baseTypes: { spanType: string; spanName: string; metadata: Record<string, unknown> }[] = [
    { spanType: "RETRIEVAL", spanName: "kb_retrieval", metadata: { topK: 5, confidence: def.confidence } },
    { spanType: "SCORING", spanName: "support_state_scoring", metadata: { frustration: def.frustration, confusion: def.confusion, effort: def.effort, trustRisk: def.trustRisk } },
    { spanType: "GENERATION", spanName: "answer_generation", metadata: { model: "gpt-4o-mini", suggestedMode: def.resolutionMode } },
    { spanType: "POLICY_DECISION", spanName: "policy_application", metadata: { selectedMode: def.resolutionMode, rationale: def.rationale } },
  ];
  const turnCount = def.messages.filter((m) => m.role === "customer").length;
  const spans: TraceSpan[] = [];
  let offset = def.createdHoursAgo * 60;
  for (let t = 0; t < turnCount; t++) {
    for (const b of baseTypes) {
      const start = offset;
      offset -= 1;
      spans.push({
        id: `${def.conversationId}-trace-${t}-${b.spanType.toLowerCase()}`,
        conversationId: def.conversationId,
        spanType: b.spanType,
        spanName: `${b.spanName}_turn_${t}`,
        metadataJson: JSON.stringify(b.metadata),
        startedAt: minutesAgo(start),
        endedAt: minutesAgo(Math.max(start - 1, 0)),
      });
    }
  }
  return spans;
}

export const FIXTURE_TRACES: Record<string, TraceSpan[]> = Object.fromEntries(
  FIXTURE_DEFS.map((def) => [def.conversationId, buildTraceSpans(def)])
);

export const FIXTURE_EVAL_RUNS: EvalRun[] = [
  {
    id: "eval-run-3",
    name: "Nightly escalation regression",
    metricsJson: JSON.stringify({
      totalScenarios: 24,
      passed: 22,
      failed: 2,
      escalationCorrectness: 0.92,
      passRate: 0.917,
    }),
    startedAt: hoursAgo(6),
    endedAt: hoursAgo(6),
    results: [
      { id: "r1", scenarioId: "billing-dispute-repeat-contact", description: "Repeated billing dispute should escalate", expectedMode: "HUMAN_ESCALATION", actualMode: "HUMAN_ESCALATION", passed: true, turnCount: 5 },
      { id: "r2", scenarioId: "return-policy-ambiguous", description: "Ambiguous return policy should request clarification", expectedMode: "CLARIFICATION_REQUIRED", actualMode: "CLARIFICATION_REQUIRED", passed: true, turnCount: 2 },
      { id: "r3", scenarioId: "lost-package-fraud-check", description: "Lost package claim should route to human review draft", expectedMode: "HUMAN_REVIEW_DRAFT", actualMode: "DIRECT_ANSWER", passed: false, turnCount: 2 },
      { id: "r4", scenarioId: "order-status-lookup", description: "Simple order status should resolve directly", expectedMode: "DIRECT_ANSWER", actualMode: "DIRECT_ANSWER", passed: true, turnCount: 1 },
      { id: "r5", scenarioId: "off-topic-request", description: "Off-topic request should be safely refused", expectedMode: "SAFE_REFUSAL", actualMode: "CLARIFICATION_REQUIRED", passed: false, turnCount: 1 },
    ],
  },
  {
    id: "eval-run-2",
    name: "Nightly escalation regression",
    metricsJson: JSON.stringify({
      totalScenarios: 24,
      passed: 20,
      failed: 4,
      escalationCorrectness: 0.85,
      passRate: 0.833,
    }),
    startedAt: hoursAgo(30),
    endedAt: hoursAgo(30),
    results: [
      { id: "r1", scenarioId: "billing-dispute-repeat-contact", description: "Repeated billing dispute should escalate", expectedMode: "HUMAN_ESCALATION", actualMode: "HUMAN_REVIEW_DRAFT", passed: false, turnCount: 5 },
      { id: "r2", scenarioId: "return-policy-ambiguous", description: "Ambiguous return policy should request clarification", expectedMode: "CLARIFICATION_REQUIRED", actualMode: "CLARIFICATION_REQUIRED", passed: true, turnCount: 2 },
    ],
  },
  {
    id: "eval-run-1",
    name: "Nightly escalation regression",
    metricsJson: JSON.stringify({
      totalScenarios: 24,
      passed: 18,
      failed: 6,
      escalationCorrectness: 0.79,
      passRate: 0.75,
    }),
    startedAt: hoursAgo(54),
    endedAt: hoursAgo(54),
    results: [
      { id: "r1", scenarioId: "billing-dispute-repeat-contact", description: "Repeated billing dispute should escalate", expectedMode: "HUMAN_ESCALATION", actualMode: "HUMAN_REVIEW_DRAFT", passed: false, turnCount: 5 },
    ],
  },
];
