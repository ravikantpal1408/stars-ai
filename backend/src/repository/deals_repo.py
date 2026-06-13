import asyncio
from sqlalchemy import literal, literal_column, select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.src.dtos.deals_dto import Deals
from backend.src.db.entities.DealTable import DealTable # Import the ORM entity we created earlier
from backend.src.db.entities.InvestorTable import InvestorTable # Import the Investor ORM entity


class DealRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def fetch_all(self) -> list[Deals]:
        query = (
            select(
                DealTable.id,
                DealTable.deal_id,
                DealTable.deal_name,
                DealTable.investor_id,
                InvestorTable.investor_name,
                DealTable.region_id,
                DealTable.approved_amount,
                DealTable.is_active,
                DealTable.created_on,
                DealTable.created_by,
                
                # Mock missing lookups as native SQL NULLs
                literal(None).label("region_name"),
                literal(None).label("funding_vehicle_name"),
                literal(None).label("currency_code")
            )
            .join(InvestorTable, InvestorTable.id == DealTable.investor_id)
            .where(DealTable.is_active == True)
            .order_by(DealTable.id.desc())
        )

        # 1. Stream row execution from PostgreSQL
        result = await self.db.stream(query)
        
        # 2. Extract raw tuple rows directly (avoids mapping/flattening bugs)
        raw_rows = (await result.all())

        # 3. Offload the dictionary building and Pydantic parsing off-thread
        return await asyncio.to_thread(self._validate_rows, raw_rows)
    
    
    def _validate_rows(self, raw_rows) -> list[Deals]:
            """Manually constructs explicit dictionaries to eliminate Pydantic validation errors"""
            validated_deals = []
            
            for row in raw_rows:
                # Explicitly unpack the row properties in order of the select statement
                deal_dict = {
                    "id": row[0],
                    "deal_id": row[1],
                    "deal_name": row[2],
                    "investor_id": row[3],
                    "investor_name": row[4],
                    "region_id": row[5],
                    "approved_amount": row[6],
                    "is_active": row[7],
                    "created_on": row[8],
                    "created_by": row[9],
                    
                    # Defaulting missing keys as clean python None objects
                    "region_name": row[10],
                    "funding_vehicle_name": row[11],
                    "currency_code": row[12]
                }
                
                validated_deals.append(Deals.model_validate(deal_dict))
                
            return validated_deals