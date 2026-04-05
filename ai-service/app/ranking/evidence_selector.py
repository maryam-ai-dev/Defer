"""
Filters, deduplicates, and selects top evidence chunks.
"""

from app.retrieval.vector_retriever import RetrievedChunk

SIMILARITY_THRESHOLD = 0.2
MAX_SELECTED = 5
MIN_SELECTED = 3
DEDUP_OVERLAP_RATIO = 0.7


def _text_overlap(a: str, b: str) -> float:
    """Compute word overlap ratio between two chunks."""
    words_a = set(a.lower().split())
    words_b = set(b.lower().split())
    if not words_a or not words_b:
        return 0.0
    intersection = words_a & words_b
    return len(intersection) / min(len(words_a), len(words_b))


def select_evidence(chunks: list[RetrievedChunk]) -> list[RetrievedChunk]:
    """Filter low-similarity chunks, deduplicate, and return top 3-5."""
    # Filter by minimum similarity
    candidates = [c for c in chunks if c.similarity_score >= SIMILARITY_THRESHOLD]

    # Sort by similarity descending
    candidates.sort(key=lambda c: c.similarity_score, reverse=True)

    # Deduplicate by text overlap
    selected: list[RetrievedChunk] = []
    for chunk in candidates:
        is_duplicate = any(
            _text_overlap(chunk.chunk_text, s.chunk_text) >= DEDUP_OVERLAP_RATIO
            for s in selected
        )
        if not is_duplicate:
            selected.append(chunk)
        if len(selected) >= MAX_SELECTED:
            break

    return selected
