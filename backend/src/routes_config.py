import fastapi

from backend.src.routes.deal_routes import router as deal_router
from backend.src.routes.investor_routes import router as investors_router

router = fastapi.APIRouter()

"""
all routes will be added here and then this router will be included in the main application router in main.py
"""

router.include_router(router=investors_router)
router.include_router(router=deal_router)
