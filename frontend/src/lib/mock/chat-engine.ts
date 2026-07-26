const FRUSTRATION_WORDS = [
  "angry", "frustrat", "ridiculous", "terrible", "awful", "unacceptable",
  "worst", "furious", "pissed", "sick of", "fed up", "!!",
];

const CONFUSION_WORDS = [
  "confus", "don't understand", "do not understand", "what do you mean",
  "unclear", "makes no sense", "which one", "i'm lost",
];

const HUMAN_REQUEST_WORDS = [
  "human", "manager", "real person", "speak to a person", "escalate", "supervisor",
];

const REPETITION_WORDS = [
  "already tried", "already told", "again", "third time", "second time",
  "i said this", "how many times", "keep telling you",
];

const TOPICS: { keywords: string[]; summary: string; goal: string; reply: string }[] = [
  {
    keywords: ["refund", "charge", "billing", "invoice", "payment"],
    summary: "Billing inquiry regarding a charge on the customer's account.",
    goal: "Resolve a billing discrepancy.",
    reply: "I've pulled up your billing history — let me look into that charge and get this sorted out for you.",
  },
  {
    keywords: ["order", "shipping", "delivery", "arrived", "package", "tracking"],
    summary: "Order status or delivery inquiry.",
    goal: "Get an update on an order's delivery status.",
    reply: "I checked your order and it looks like it's moving through fulfillment. Let me get you the latest tracking status.",
  },
  {
    keywords: ["password", "login", "log in", "account access", "locked out"],
    summary: "Account access issue.",
    goal: "Regain access to their account.",
    reply: "Let's get you back into your account — I'll walk through the reset steps with you.",
  },
  {
    keywords: ["return", "exchange", "policy"],
    summary: "Question about the return or exchange policy.",
    goal: "Understand return eligibility for a purchased item.",
    reply: "Happy to clarify our return policy — the window depends on the product category, so let me confirm which applies here.",
  },
  {
    keywords: ["cancel", "subscription", "membership"],
    summary: "Request to cancel a subscription or membership.",
    goal: "Cancel an active subscription.",
    reply: "I can help with that cancellation — let me confirm the details on your plan before processing it.",
  },
];

function normalize(text: string): string {
  return text.toLowerCase();
}

function matchesAny(text: string, words: string[]): boolean {
  return words.some((w) => text.includes(w));
}

function detectTopic(text: string): (typeof TOPICS)[number] | null {
  return TOPICS.find((t) => matchesAny(text, t.keywords)) ?? null;
}

export interface TurnState {
  frustration: number;
  confusion: number;
  effort: number;
  trustRisk: number;
  degradation: number;
  repetitionCount: number;
  lastCustomerMessage: string | null;
  issueSummary: string | null;
  customerGoal: string | null;
}

export interface TurnOutcome {
  reply: string;
  mode: "DIRECT_ANSWER" | "CLARIFICATION_REQUIRED" | "HUMAN_REVIEW_DRAFT" | "HUMAN_ESCALATION" | "SAFE_REFUSAL";
  rationale: string[];
  confidence: number;
}

function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n));
}

export function applyTurn(state: TurnState, rawMessage: string): TurnOutcome {
  const text = normalize(rawMessage);
  const rationale: string[] = [];

  const isRepetition =
    matchesAny(text, REPETITION_WORDS) ||
    (state.lastCustomerMessage !== null && text.trim() === state.lastCustomerMessage.trim());
  const isFrustrated = matchesAny(text, FRUSTRATION_WORDS);
  const isConfused = matchesAny(text, CONFUSION_WORDS);
  const requestsHuman = matchesAny(text, HUMAN_REQUEST_WORDS);

  if (isRepetition) {
    state.repetitionCount += 1;
    state.frustration = clamp01(state.frustration + 0.22);
    state.effort = clamp01(state.effort + 0.2);
    rationale.push(`Repetition detected (count now ${state.repetitionCount})`);
  }
  if (isFrustrated) {
    state.frustration = clamp01(state.frustration + 0.28);
    rationale.push("Frustration language detected in message");
  }
  if (isConfused) {
    state.confusion = clamp01(state.confusion + 0.3);
    rationale.push("Confusion language detected in message");
  }
  if (requestsHuman) {
    rationale.push("Customer explicitly requested a human agent");
  }

  // natural decay of trust risk baseline drift with frustration/effort
  state.trustRisk = clamp01(0.5 * state.frustration + 0.3 * state.effort + 0.2 * state.trustRisk);
  state.degradation = clamp01(0.4 * state.frustration + 0.6 * state.degradation + (isRepetition ? 0.1 : 0));
  state.effort = clamp01(state.effort + 0.05);

  const topic = detectTopic(text);
  if (topic) {
    state.issueSummary = state.issueSummary ?? topic.summary;
    state.customerGoal = state.customerGoal ?? topic.goal;
  } else if (!state.issueSummary) {
    state.issueSummary = "General support inquiry.";
    state.customerGoal = "Get help resolving their issue.";
  }

  state.lastCustomerMessage = text;

  let mode: TurnOutcome["mode"];
  let reply: string;
  let confidence: number;

  if (requestsHuman || state.frustration >= 0.75 || state.repetitionCount >= 3) {
    mode = "HUMAN_ESCALATION";
    confidence = 0.7;
    if (!rationale.length) rationale.push("Frustration/effort thresholds exceeded escalation policy");
    reply = "I understand this hasn't been resolved yet, and I don't want to keep you going in circles. I'm connecting you with a specialist now who can take this from here — they'll have full context on everything we've discussed.";
  } else if (state.confusion >= 0.5) {
    mode = "CLARIFICATION_REQUIRED";
    confidence = 0.6;
    rationale.push("Confusion score above clarification threshold");
    reply = topic
      ? `${topic.reply} Could you give me a bit more detail so I can point you to the exact answer?`
      : "I want to make sure I understand correctly — could you tell me a bit more about what you're trying to do?";
  } else if (state.frustration >= 0.5 || state.effort >= 0.55) {
    mode = "HUMAN_REVIEW_DRAFT";
    confidence = 0.62;
    rationale.push("Elevated frustration/effort routed to human-reviewed draft");
    reply = topic
      ? `${topic.reply} I've drafted next steps, and a specialist will double-check this before anything is finalized — you'll hear back shortly.`
      : "I've drafted a resolution for this, and I'm having a specialist confirm it before we finalize — you'll hear back shortly.";
  } else {
    mode = "DIRECT_ANSWER";
    confidence = 0.9;
    rationale.push("Confidence above direct-answer threshold, no frustration or repetition signals");
    reply = topic
      ? topic.reply
      : "Thanks for reaching out — based on what you've shared, here's what I'd recommend to resolve this.";
  }

  return { reply, mode, rationale, confidence };
}

export function initialTurnState(): TurnState {
  return {
    frustration: 0.05,
    confusion: 0.05,
    effort: 0.05,
    trustRisk: 0.05,
    degradation: 0,
    repetitionCount: 0,
    lastCustomerMessage: null,
    issueSummary: null,
    customerGoal: null,
  };
}
