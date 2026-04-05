"""
Orchestrates evidence selection and confidence estimation.
"""

from dataclasses import dataclass

from app.ranking.confidence_estimator import estimate_confidence
from app.ranking.evidence_selector import select_evidence
from app.retrieval.vector_retriever import RetrievedChunk


@dataclass
class RankingResult:
    selected_chunks: list[RetrievedChunk]
    confidence: float


def rank(chunks: list[RetrievedChunk]) -> RankingResult:
    """Select top evidence and estimate confidence."""
    selected = select_evidence(chunks)
    confidence = estimate_confidence(selected)
    return RankingResult(selected_chunks=selected, confidence=confidence)
