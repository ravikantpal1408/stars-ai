import fastapi
from fastapi import Depends, status
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from backend.src.db.database import get_db
from backend.src.services.deal_service import DealService

router = fastapi.APIRouter(prefix="/deals", tags=["deals"])


@router.get("", status_code=status.HTTP_200_OK)
async def read_deals(db: AsyncSession = Depends(get_db)):
    service = DealService(db)
    return await service.get_all_deals()


@router.get("/schema/tables", status_code=status.HTTP_200_OK)
async def get_database_tables(db: AsyncSession = Depends(get_db)):
    """Diagnostic endpoint to discover all table names in the database"""
    query = text("""
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
        ORDER BY table_name
    """)
    result = await db.execute(query)
    tables = [row[0] for row in result.fetchall()]
    return {"tables": tables}
