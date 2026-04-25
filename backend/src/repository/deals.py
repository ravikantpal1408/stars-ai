import uuid

from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from backend.src.models.deals_model import Deals


class DealRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def fetch_all(self):
        async with self.db.begin():
            cursor_id = f"deals_{uuid.uuid4().hex[:8]}"

            async with self.db.begin():
                await self.db.execute(
                    text("CALL fetch_deals_procedure(:cursor_name)"),
                    {"cursor_name": cursor_id},
                )
                result = await self.db.execute(text(f'FETCH ALL IN "{cursor_id}"'))

                rows = result.mappings().all()

                return [Deals.model_validate(row) for row in rows]
