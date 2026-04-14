import fastapi
from fastapi import Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from backend.src.db.database import get_db
from backend.src.services.investor_service import InvestorService

router = fastapi.APIRouter(prefix="/investors", tags=["investors"])

@router.get("", status_code=status.HTTP_200_OK)
async def read_investors(db: AsyncSession = Depends(get_db)):
    service = InvestorService(db)
    return await service.get_all_investors()

@router.post("/seed", status_code=status.HTTP_201_CREATED)
async def seed_data(db: AsyncSession = Depends(get_db)):
    service = InvestorService(db)
    return await service.run_seed_process()