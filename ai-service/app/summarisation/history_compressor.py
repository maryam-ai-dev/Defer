"""
Compresses long conversation history to a short context string for LLM prompts.
"""

MAX_HISTORY_WORDS = 500


def compress_history(
    messages: list[dict],
    max_words: int = MAX_HISTORY_WORDS,
) -> str:
    """
    Compress conversation history to fit within a word budget.

    Args:
        messages: List of dicts with 'sender_type' and 'body' keys.
        max_words: Maximum words in the compressed output.

    Returns a condensed conversation string.
    """
    if not messages:
        return ""

    # Build full history text
    lines = []
    for msg in messages:
        sender = msg.get("sender_type", "UNKNOWN")
        body = msg.get("body", "")
        label = "Customer" if sender == "CUSTOMER" else "Agent"
        lines.append(f"{label}: {body}")

    full_text = "\n".join(lines)
    words = full_text.split()

    if len(words) <= max_words:
        return full_text

    # Keep the first few and last messages, truncate the middle
    # Prioritise recent context
    first_budget = max_words // 4
    last_budget = max_words - first_budget

    first_part = " ".join(words[:first_budget])
    last_part = " ".join(words[-last_budget:])

    return f"{first_part}\n...[earlier messages truncated]...\n{last_part}"
