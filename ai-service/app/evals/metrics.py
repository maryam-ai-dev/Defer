"""
Computes eval metrics from scenario results.
"""

from dataclasses import dataclass
from app.evals.scenario_runner import ScenarioResult


@dataclass
class EvalMetrics:
    total_scenarios: int
    passed: int
    failed: int
    escalation_correctness: float
    pass_rate: float


def compute_metrics(results: list[ScenarioResult]) -> EvalMetrics:
    """Compute aggregate metrics from eval results."""
    total = len(results)
    if total == 0:
        return EvalMetrics(0, 0, 0, 0.0, 0.0)

    passed = sum(1 for r in results if r.passed)
    failed = total - passed

    # Escalation correctness: of scenarios expecting escalation, how many got it?
    escalation_expected = [r for r in results if r.expected_final_mode == "HUMAN_ESCALATION"]
    if escalation_expected:
        escalation_correct = sum(1 for r in escalation_expected if r.passed)
        escalation_correctness = escalation_correct / len(escalation_expected)
    else:
        escalation_correctness = 1.0

    return EvalMetrics(
        total_scenarios=total,
        passed=passed,
        failed=failed,
        escalation_correctness=round(escalation_correctness, 3),
        pass_rate=round(passed / total, 3),
    )
