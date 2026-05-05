import asyncio

from sqlalchemy.ext.asyncio import AsyncSession

from backend.src.repository.investor_repo import InvestorRepository


class InvestorService:
    def __init__(self, db: AsyncSession):
        self.repository = InvestorRepository(db)

    async def get_all_investors(self, page: int = 1, page_size: int = 10):
        data = await self.repository.fetch_all(page=page, page_size=page_size)
        total = await self.repository.get_total_count()
        return {"data": data, "total": total}


# async def run_seed_process(self):
#     # You could add logic to check if data already exists before seeding
#     await self.repository.seed_random_investors(count=20)
#     return {"status": "success", "count": 20}
