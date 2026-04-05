export interface HandoffPacket {
  id: string;
  caseFileId: string;
  conversationId: string;
  escalationReason: string;
  issueSummary: string;
  customerGoal: string | null;
  stepsAttempted: string[];
  unresolvedItems: string[];
  customerState: Record<string, number>;
  suggestedNextAction: string | null;
  createdAt: string;
}
