from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from backend.src.models.investors_model import Investor


class InvestorRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def fetch_all(self, page: int = 1, page_size: int = 10):

        offset = (page - 1) * page_size

        query = text("""
            SELECT * FROM stars_investor_tbl
            ORDER BY id DESC
            LIMIT :limit OFFSET :offset
        """)

        result = await self.db.execute(query, {"limit": page_size, "offset": offset})
        rows = result.mappings().all()

        return [Investor(**row) for row in rows]

    async def get_total_count(self) -> int:
        query = text("SELECT COUNT(*) FROM stars_investor_tbl")
        result = await self.db.execute(query)
        count = result.scalar()
        return count if count is not None else 0
