"""
Updates the issue summary based on the latest message and existing summary.
Uses an LLM call.
"""

import os
from openai import OpenAI

_client: OpenAI | None = None


def _get_client() -> OpenAI:
    global _client
    if _client is None:
        _client = OpenAI(api_key=os.getenv("OPENAI_API_KEY", ""))
    return _client


def update_issue_summary(latest_message: str, existing_summary: str | None = None) -> str:
    """
    Refine the issue summary given the latest customer message.
    Returns a concise 1-3 sentence summary.
    """
    client = _get_client()

    system_prompt = (
        "You are a support case analyst. Given the latest customer message and an optional "
        "existing issue summary, produce a concise 1-3 sentence summary of the customer's issue. "
        "Focus on what the problem is, not what the customer wants you to do. "
        "If an existing summary is provided, refine it with new information — do not start from scratch."
    )

    user_prompt = ""
    if existing_summary:
        user_prompt += f"Existing summary: {existing_summary}\n\n"
    user_prompt += f"Latest customer message: {latest_message}"

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        max_tokens=150,
        temperature=0.3,
    )

    return response.choices[0].message.content.strip()
