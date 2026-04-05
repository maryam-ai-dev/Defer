"""
Extracts actions the customer has already tried from the latest message.
Rule-based heuristics first — reliable and debuggable.
"""

import re

# Patterns indicating customer has tried something
_ATTEMPT_PATTERNS = [
    r"i already (.+?)(?:\.|,|$)",
    r"i tried (.+?)(?:\.|,|$)",
    r"i checked (.+?)(?:\.|,|$)",
    r"i contacted (.+?)(?:\.|,|$)",
    r"i called (.+?)(?:\.|,|$)",
    r"i emailed (.+?)(?:\.|,|$)",
    r"i sent (.+?)(?:\.|,|$)",
    r"i reset (.+?)(?:\.|,|$)",
    r"i cleared (.+?)(?:\.|,|$)",
    r"i updated (.+?)(?:\.|,|$)",
    r"i restarted (.+?)(?:\.|,|$)",
    r"i've (.+?)(?:\.|,|$)",
    r"already (.+?) but",
    r"tried (.+?) but",
]


def extract_attempted_actions(message: str) -> list[str]:
    """
    Extract actions the customer reports having already tried.
    Returns a list of action summary strings.
    """
    if not message:
        return []

    actions: list[str] = []
    lower = message.lower()

    for pattern in _ATTEMPT_PATTERNS:
        matches = re.findall(pattern, lower)
        for match in matches:
            action = match.strip()
            if len(action) > 5 and action not in actions:
                actions.append(action)

    return actions
