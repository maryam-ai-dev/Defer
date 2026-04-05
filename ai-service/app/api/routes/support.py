"""
POST /api/v1/support/respond — full support response endpoint.
"""

from fastapi import APIRouter
from pydantic import BaseModel
from uuid import UUID

from app.services.support_response_service import (
    build_support_response,
    SupportResponsePayload,
)

router = APIRouter()


class MessagePayload(BaseModel):
    message_id: UUID
    role: str
    text: str


class HistoryEntry(BaseModel):
    role: str
    text: str


class CaseSummary(BaseModel):
    issue_summary: str | None = None
    customer_goal: str | None = None
    attempted_actions: list[str] = []
    open_questions: list[str] = []
    current_state: dict | None = None


class PolicyFlags(BaseModel):
    allow_direct_answer: bool = True
    requires_review_for_policy_exceptions: bool = False


class SupportRespondRequest(BaseModel):
    trace_id: UUID | None = None
    conversation_id: UUID
    case_file_id: UUID | None = None
    latest_message: MessagePayload
    recent_history: list[HistoryEntry] = []
    case_summary: CaseSummary | None = None
    policy_flags: PolicyFlags | None = None


@router.post("/support/respond", response_model=SupportResponsePayload)
async def support_respond(request: SupportRespondRequest) -> SupportResponsePayload:
    # Build history dicts for the service
    history = [
        {"role": entry.role, "text": entry.text}
        for entry in request.recent_history
    ]

    # Extract case context
    existing_summary = None
    existing_goal = None
    message_count = len(request.recent_history) + 1
    repetition_count = 0

    if request.case_summary:
        existing_summary = request.case_summary.issue_summary
        existing_goal = request.case_summary.customer_goal
        if request.case_summary.current_state:
            repetition_count = request.case_summary.current_state.get("repetition_count", 0)

    return await build_support_response(
        latest_message_text=request.latest_message.text,
        recent_history=history,
        case_summary=existing_summary,
        customer_goal=existing_goal,
        existing_issue_summary=existing_summary,
        message_count=message_count,
        repetition_count=repetition_count,
    )
