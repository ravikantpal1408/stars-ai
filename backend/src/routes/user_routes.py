import fastapi

from backend.src.controller.users_controller import router as users_router

router = fastapi.APIRouter()

'''
all user related routes will be added here and then this router will be included in the main application router in main.py
'''

router.include_router(router=users_router)
