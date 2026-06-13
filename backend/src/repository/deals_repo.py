import asyncio
import uuid

from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from backend.src.dtos.deals_dto import Deals


class DealRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def fetch_all(self):
        # 1. Identifier Safety: Use a clean UUID
        raw_id = uuid.uuid4().hex[:8]
        cursor_id = f"deals_{raw_id}"

        # 2. Transaction Handling: Check if we are already in a transaction
        # This prevents the "Transaction already started" error.
        if not self.db.in_transaction():
            await self.db.begin()

        try:
            # 3. Call the procedure
            await self.db.execute(
                text("CALL fetch_deals_procedure(:cursor_name)"),
                {"cursor_name": cursor_id},
            )

            # 4. Fetch the data
            # We wrap the cursor name in double quotes to handle it as a SQL identifier
            result = await self.db.execute(text(f'FETCH ALL IN "{cursor_id}"'))
            rows = result.mappings().all()

            # 5. Non-Blocking Validation:
            # If 'rows' is large, this prevents the API from freezing for other users
            return await asyncio.to_thread(self._validate_rows, rows)

        finally:
            # 6. Resource Cleanup: Always close the cursor
            await self.db.execute(text(f'CLOSE "{cursor_id}"'))
            # Note: We don't commit here; let the caller or middleware handle the commit/rollback

    def _validate_rows(self, rows):
        """Sync helper for CPU-bound validation"""
        return [Deals.model_validate(row) for row in rows]
