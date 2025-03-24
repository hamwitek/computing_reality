from app.api.v1.core.endpoints.authentication import router as auth_router
from app.api.v1.core.endpoints.courses import router as course_router
from app.api.v1.core.endpoints.general import router as general_router
from app.api.v1.core.endpoints.image_analyses import router as image_analyses_router
from fastapi import APIRouter

router = APIRouter()

router.include_router(general_router)
router.include_router(course_router)
router.include_router(auth_router)
router.include_router(image_analyses_router)
