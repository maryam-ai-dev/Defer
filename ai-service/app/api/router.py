from fastapi import APIRouter

from app.api.routes.retrieval import router as retrieval_router

router = APIRouter(prefix="/api/v1")
router.include_router(retrieval_router)
