"""
POST /api/v1/retrieve — evidence retrieval endpoint.
"""

from fastapi import APIRouter
from pydantic import BaseModel

from app.retrieval.retrieval_service import retrieve
from app.ranking.ranking_service import rank
from app.grounding.grounding_checker import check_grounding
from app.grounding.citation_builder import build_citations
from app.grounding.evidence_bundle import EvidenceBundle, EvidenceChunk

router = APIRouter()


class RetrieveRequest(BaseModel):
    query: str
    case_summary: str | None = None
    kb_scope: str | None = None


@router.post("/retrieve", response_model=EvidenceBundle)
async def retrieve_evidence(request: RetrieveRequest) -> EvidenceBundle:
    # 1. Retrieve raw chunks
    raw_chunks = await retrieve(
        user_message=request.query,
        case_summary=request.case_summary,
    )

    # 2. Rank and select
    ranking_result = rank(raw_chunks)

    # 3. Check grounding
    is_grounded, insufficiency_flag = check_grounding(ranking_result.confidence)

    # 4. Build citations
    citations = build_citations(ranking_result.selected_chunks)

    # 5. Package evidence bundle
    evidence_chunks = [
        EvidenceChunk(
            chunk_id=c.chunk_id,
            document_id=c.document_id,
            chunk_text=c.chunk_text,
            similarity_score=c.similarity_score,
        )
        for c in ranking_result.selected_chunks
    ]

    return EvidenceBundle(
        chunks=evidence_chunks,
        citations=citations,
        confidence=ranking_result.confidence,
        is_grounded=is_grounded,
        insufficiency_flag=insufficiency_flag,
    )
