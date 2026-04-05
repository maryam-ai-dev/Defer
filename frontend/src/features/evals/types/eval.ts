export interface EvalRun {
  id: string;
  name: string;
  metricsJson: string | null;
  startedAt: string;
  endedAt: string | null;
  results: EvalResult[];
}

export interface EvalResult {
  id: string;
  scenarioId: string;
  description: string;
  expectedMode: string;
  actualMode: string;
  passed: boolean;
  turnCount: number | null;
}

export interface EvalMetrics {
  totalScenarios: number;
  passed: number;
  failed: number;
  escalationCorrectness: number;
  passRate: number;
}
