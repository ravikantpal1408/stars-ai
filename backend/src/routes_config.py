import fastapi

from backend.src.routes.investor_routes import router as investors_router

router = fastapi.APIRouter()

'''
all routes will be added here and then this router will be included in the main application router in main.py
'''

router.include_router(router=investors_router)