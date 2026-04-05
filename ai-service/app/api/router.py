from fastapi import APIRouter

from app.api.routes.retrieval import router as retrieval_router
from app.api.routes.support import router as support_router
from app.api.routes.evals import router as evals_router

router = APIRouter(prefix="/api/v1")
router.include_router(retrieval_router)
router.include_router(support_router)
router.include_router(evals_router)
