from sqlalchemy.ext.asyncio import AsyncSession

from backend.src.repository.lookup_repo import LookupRepository


class LookupService:
    def __init__(self, db: AsyncSession):
        self.repository = LookupRepository(db)

    async def get_all_deals(self):
        # You could add caching or filtering logic here
        return await self.repository.fetch_all()
