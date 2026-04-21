from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from backend.src.models.investors_model import Investor


class InvestorRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def fetch_all(self):
        query = text("SELECT * FROM stars_investor_tbl ORDER BY id DESC")
        result = await self.db.execute(query)
        rows = result.mappings().all()
        return [Investor(**row) for row in rows]

    async def seed_random_investors(self, count: int = 20):
        query = text("""
            INSERT INTO scf_investor (investor_name, created_by)
            SELECT
                'Investor ' || floor(random() * 5000)::text,
                'system_seed'
            FROM generate_series(1, :count);
        """).bindparams(count=count)

        await self.db.execute(query)
        await self.db.commit()
