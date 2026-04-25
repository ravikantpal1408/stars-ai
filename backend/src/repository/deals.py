from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from backend.src.models.deals_model import Deals


class DealRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def fetch_all(self):
        async with self.db.begin():
            await self.db.execute(
                text("CALL fetch_deals_procedure(:cursor_name)"),
                {"cursor_name": "deals_cursor"},
            )

            result = await self.db.execute(text('FETCH ALL FROM "deals_cursor";'))

            rows = result.mappings().all()

            return [Deals.model_validate(row) for row in rows]
