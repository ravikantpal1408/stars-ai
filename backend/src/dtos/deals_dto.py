from datetime import datetime
from decimal import Decimal
from typing import Optional

from pydantic import BaseModel, ConfigDict


class Deals(BaseModel):
    # Primary Key
    id: int

    # Core Deal Info
    deal_id: int
    deal_name: str
    investor_id: int
    region_id: int
    approved_amount: Optional[Decimal] = None

    # Joined Data from Lookup Tables
    region_name: Optional[str] = None
    funding_vehicle_name: Optional[str] = None
    currency_code: Optional[str] = None

    # Metadata
    is_active: bool
    created_on: datetime
    created_by: str

    # Enables compatibility with SQLAlchemy row objects
    model_config = ConfigDict(from_attributes=True)
