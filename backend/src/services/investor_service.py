from sqlalchemy.ext.asyncio import AsyncSession
from backend.src.repository.investor import InvestorRepository

class InvestorService:
    def __init__(self, db: AsyncSession):
        self.repository = InvestorRepository(db)

    async def get_all_investors(self):
        # You could add caching or filtering logic here
        return await self.repository.fetch_all()

    async def run_seed_process(self):
        # You could add logic to check if data already exists before seeding
        await self.repository.seed_random_investors(count=20)
        return {"status": "success", "count": 20}