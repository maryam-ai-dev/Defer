"""
Estimates retrieval confidence from selected chunk similarity scores.
"""

from app.retrieval.vector_retriever import RetrievedChunk


def estimate_confidence(selected_chunks: list[RetrievedChunk]) -> float:
    """
    Compute a single retrieval confidence score (0-1) from selected chunks.

    Strategy:
    - Weighted average: top chunk counts more heavily.
    - If no chunks, confidence is 0.
    - Clamp to [0, 1].
    """
    if not selected_chunks:
        return 0.0

    scores = [c.similarity_score for c in selected_chunks]

    # Weighted: first chunk gets 2x weight, rest get 1x
    weights = [2.0] + [1.0] * (len(scores) - 1)
    weighted_sum = sum(s * w for s, w in zip(scores, weights))
    total_weight = sum(weights)

    confidence = weighted_sum / total_weight

    return max(0.0, min(1.0, confidence))
