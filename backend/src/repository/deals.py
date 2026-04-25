from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from backend.src.models.deals_model import Deals


class DealRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def fetch_all(self):
        # Use a sub-transaction block to ensure the cursor stays open for the FETCH
        async with self.db.begin():
            # 1. Call the procedure and define the cursor name
            # We use a string for the cursor name that Postgres will recognize
            await self.db.execute(
                text("CALL fetch_deals_procedure(:cursor_name)"),
                {"cursor_name": "deals_cursor"},
            )

            # 2. Fetch the actual rows from the cursor
            # Note: The cursor name here must match the string passed above exactly
            result = await self.db.execute(text('FETCH ALL FROM "deals_cursor";'))

            # 3. Use mappings() to get dictionary-like objects
            rows = result.mappings().all()

            # 4. Convert to your Pydantic "Detail" model
            # I'm using StarsDealReadDetail as it includes the joined table fields
            return [Deals.model_validate(row) for row in rows]
