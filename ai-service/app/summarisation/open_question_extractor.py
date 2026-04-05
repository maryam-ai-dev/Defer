"""
Identifies unresolved blockers as questions.
Heuristic-first: extracts explicit questions and known blocker patterns.
"""

import re


# Patterns for explicit blocker language
_BLOCKER_PATTERNS = [
    r"i can't (.+?)(?:\.|!|$)",
    r"i cannot (.+?)(?:\.|!|$)",
    r"unable to (.+?)(?:\.|!|$)",
    r"doesn't let me (.+?)(?:\.|!|$)",
    r"won't (.+?)(?:\.|!|$)",
    r"not working",
    r"keeps failing",
    r"getting an error",
]


def extract_open_questions(messages: list[str]) -> list[str]:
    """
    Extract unresolved questions or blockers from customer messages.
    Returns a list of question/blocker strings.
    """
    questions: list[str] = []

    for message in messages:
        # Extract explicit questions (sentences ending with ?)
        sentences = re.split(r'(?<=[.!?])\s+', message)
        for sentence in sentences:
            sentence = sentence.strip()
            if sentence.endswith("?") and len(sentence) > 10:
                if sentence not in questions:
                    questions.append(sentence)

        # Extract blocker patterns
        lower = message.lower()
        for pattern in _BLOCKER_PATTERNS:
            matches = re.findall(pattern, lower)
            for match in matches:
                if isinstance(match, str) and len(match.strip()) > 3:
                    blocker = f"Customer cannot: {match.strip()}"
                    if blocker not in questions:
                        questions.append(blocker)

    return questions
