from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from backend.src.models.investors_model import Investor


class UploadRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def save_upload(self):
        query = text("SELECT * FROM stars_investor_tbl ORDER BY id DESC")
        result = await self.db.execute(query)
        rows = result.mappings().all()
        return [Investor(**row) for row in rows]
