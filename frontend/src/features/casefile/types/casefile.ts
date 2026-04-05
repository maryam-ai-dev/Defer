export interface CaseFileDetail {
  id: string;
  status: string;
  issueSummary: string | null;
  customerGoal: string | null;
  currentResolutionMode: string | null;
  escalationCandidate: boolean;
  repetitionCount: number;
  frustrationScore: number;
  confusionScore: number;
  effortScore: number;
  trustRiskScore: number;
  updatedAt: string;
}
