"""
POST /api/v1/evals/run — run eval scenarios and return results.
"""

from fastapi import APIRouter

from app.evals.eval_service import run_eval_suite

router = APIRouter()


@router.post("/evals/run")
async def run_evals():
    return await run_eval_suite()
