"""
Extracts what the customer is trying to achieve from conversation messages.
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


def extract_goal(customer_messages: list[str]) -> str:
    """
    Extract the customer's goal from their messages.
    Returns a concise 1 sentence description of what they want to achieve.
    """
    client = _get_client()

    system_prompt = (
        "You are a support case analyst. Given the customer's messages, extract what the customer "
        "is trying to achieve in one concise sentence. Focus on the desired outcome, not the problem. "
        "Example: 'Get a refund for order #12345' or 'Regain access to their account'."
    )

    messages_text = "\n".join(f"Customer: {m}" for m in customer_messages)

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": messages_text},
        ],
        max_tokens=80,
        temperature=0.3,
    )

    return response.choices[0].message.content.strip()
