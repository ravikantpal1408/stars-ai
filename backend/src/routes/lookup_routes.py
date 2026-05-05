import fastapi
from fastapi import Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from backend.src.db.database import get_db

router = fastapi.APIRouter(prefix="/lookups", tags=["lookups"])


@router.get("/currency", status_code=status.HTTP_200_OK)
async def read_deals(db: AsyncSession = Depends(get_db)):
    service = DealService(db)
    return await service.get_all_deals()
