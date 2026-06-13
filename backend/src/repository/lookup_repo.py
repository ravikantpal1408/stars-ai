from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from backend.src.dtos.lookups_dto import Lookups


class LookupRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def fetch_all(self):
        query = text("SELECT * FROM stars_investor_tbl ORDER BY id DESC")
        result = await self.db.execute(query)
        rows = result.mappings().all()
        return [Lookups(**row) for row in rows]
