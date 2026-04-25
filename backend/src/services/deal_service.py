from sqlalchemy.ext.asyncio import AsyncSession

from backend.src.repository.deals import DealRepository


class DealService:
    def __init__(self, db: AsyncSession):
        self.repository = DealRepository(db)

    async def get_all_deals(self):
        # You could add caching or filtering logic here
        return await self.repository.fetch_all()
