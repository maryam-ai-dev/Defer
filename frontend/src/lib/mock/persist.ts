const STORAGE_KEY = "defer-demo-state-v1";

export interface DemoConversationState {
  id: string;
  channel: string;
  createdAt: string;
  status: string;
  messages: {
    id: string;
    senderType: string;
    body: string;
    turnIndex: number;
    createdAt: string;
  }[];
  frustration: number;
  confusion: number;
  effort: number;
  trustRisk: number;
  degradation: number;
  repetitionCount: number;
  resolutionMode: string;
  issueSummary: string | null;
  customerGoal: string | null;
  attemptedActions: {
    id: string;
    actionType: string;
    actionSummary: string;
    outcome: string;
    source: string;
    createdAt: string;
  }[];
  handoffId: string | null;
  traceId: string | null;
}

interface DemoStore {
  conversations: Record<string, DemoConversationState>;
  evalRuns: import("@/features/evals/types/eval").EvalRun[];
}

function emptyStore(): DemoStore {
  return { conversations: {}, evalRuns: [] };
}

export function loadStore(): DemoStore {
  if (typeof window === "undefined") return emptyStore();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyStore();
    const parsed = JSON.parse(raw);
    return { conversations: parsed.conversations ?? {}, evalRuns: parsed.evalRuns ?? [] };
  } catch {
    return emptyStore();
  }
}

export function saveStore(store: DemoStore): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // storage unavailable (private mode, quota) — demo state just won't persist across reloads
  }
}

export type { DemoStore };
