"""
Replays each eval scenario turn-by-turn.
Calls Spring Boot's turn endpoint to get the authoritative selected_mode.
"""

import logging
import os
from dataclasses import dataclass, field

import httpx

logger = logging.getLogger(__name__)

BACKEND_URL = os.getenv("BACKEND_URL", "http://backend:8080")


@dataclass
class TurnResult:
    turn_index: int
    customer_text: str
    suggested_mode: str
    selected_mode: str
    retrieval_confidence: float
    frustration_score: float
    effort_score: float
    escalated: bool


@dataclass
class ScenarioResult:
    scenario_id: str
    description: str
    expected_final_mode: str
    actual_final_mode: str
    turns: list[TurnResult] = field(default_factory=list)
    passed: bool = False


async def run_scenario(scenario: dict) -> ScenarioResult:
    """Run a single eval scenario through the full pipeline via Spring Boot."""
    async with httpx.AsyncClient(base_url=BACKEND_URL, timeout=60.0) as client:
        # Create conversation
        conv_resp = await client.post("/api/v1/conversations", json={
            "channel": "eval",
            "customerId": "00000000-0000-0000-0000-000000000000",
        })
        conv_resp.raise_for_status()
        conversation_id = conv_resp.json()["id"]

        turns: list[TurnResult] = []
        last_mode = ""

        for i, turn in enumerate(scenario["turns"]):
            if turn["role"] != "CUSTOMER":
                continue

            # Call Spring Boot turn endpoint (full pipeline)
            turn_resp = await client.post(
                f"/api/v1/conversations/{conversation_id}/turn",
                json={"message": turn["text"]},
            )
            turn_resp.raise_for_status()
            data = turn_resp.json()

            last_mode = data["resolutionMode"]

            turns.append(TurnResult(
                turn_index=i,
                customer_text=turn["text"],
                suggested_mode="",  # not exposed in turn response
                selected_mode=data["resolutionMode"],
                retrieval_confidence=0.0,
                frustration_score=0.0,
                effort_score=0.0,
                escalated=data["escalated"],
            ))

            logger.info(
                "  Turn %d: selected=%s escalated=%s",
                i, data["resolutionMode"], data["escalated"],
            )

            # Stop early if escalated
            if data["escalated"]:
                break

        expected = scenario["expected_final_mode"]
        passed = last_mode == expected

        return ScenarioResult(
            scenario_id=scenario["id"],
            description=scenario["description"],
            expected_final_mode=expected,
            actual_final_mode=last_mode,
            turns=turns,
            passed=passed,
        )
