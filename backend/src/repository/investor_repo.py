from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from backend.src.dtos.investors_dto import Investor
from backend.src.db.entities.InvestorTable import InvestorTable

class InvestorRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def fetch_all(self, page: int = 1, page_size: int = 10) -> list[Investor]:
        offset = (page - 1) * page_size

        query = (
            select(InvestorTable)
            .order_by(InvestorTable.id.desc())
            .limit(page_size)
            .offset(offset)
        )

        result = await self.db.execute(query)
        db_investors = result.scalars().all()

        return [Investor.model_validate(investor) for investor in db_investors]

    async def get_total_count(self) -> int:
        query = select(func.count()).select_from(InvestorTable)
        
        result = await self.db.execute(query)
        count = result.scalar()
        
        return count if count is not None else 0