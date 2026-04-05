"""
Orchestrates eval scenario execution and metric computation.
"""

import json
import logging
import os
from datetime import datetime
from pathlib import Path
from uuid import uuid4

from app.evals.scenario_runner import run_scenario, ScenarioResult
from app.evals.metrics import compute_metrics, EvalMetrics

logger = logging.getLogger(__name__)

EVAL_DIR = os.getenv(
    "EVAL_DIR",
    str(Path(__file__).resolve().parent.parent.parent.parent / "datasets" / "eval_sets"),
)


async def run_eval_suite() -> dict:
    """Load scenarios, run each, compute metrics, return result payload."""
    # Load scenarios
    scenarios_path = Path(EVAL_DIR) / "eval_scenarios.json"
    with open(scenarios_path) as f:
        scenarios = json.load(f)

    logger.info("Running %d eval scenarios from %s", len(scenarios), scenarios_path)

    results: list[ScenarioResult] = []
    started_at = datetime.utcnow().isoformat()

    for scenario in scenarios:
        logger.info("Running scenario: %s — %s", scenario["id"], scenario["description"])
        try:
            result = await run_scenario(scenario)
            results.append(result)
            status = "PASS" if result.passed else "FAIL"
            logger.info(
                "  Result: %s (expected=%s, actual=%s)",
                status, result.expected_final_mode, result.actual_final_mode,
            )
        except Exception as e:
            logger.error("  Scenario %s failed with error: %s", scenario["id"], e)
            results.append(ScenarioResult(
                scenario_id=scenario["id"],
                description=scenario["description"],
                expected_final_mode=scenario["expected_final_mode"],
                actual_final_mode="ERROR",
                turns=[],
                passed=False,
            ))

    ended_at = datetime.utcnow().isoformat()
    metrics = compute_metrics(results)

    # Build payload matching what Spring Boot expects
    run_id = str(uuid4())
    return {
        "runId": run_id,
        "name": f"eval-run-{run_id[:8]}",
        "startedAt": started_at,
        "endedAt": ended_at,
        "metrics": {
            "totalScenarios": metrics.total_scenarios,
            "passed": metrics.passed,
            "failed": metrics.failed,
            "escalationCorrectness": metrics.escalation_correctness,
            "passRate": metrics.pass_rate,
        },
        "results": [
            {
                "scenarioId": r.scenario_id,
                "description": r.description,
                "expectedMode": r.expected_final_mode,
                "actualMode": r.actual_final_mode,
                "passed": r.passed,
                "turnCount": len(r.turns),
            }
            for r in results
        ],
    }
