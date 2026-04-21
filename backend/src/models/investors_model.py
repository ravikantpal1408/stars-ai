from datetime import datetime
from typing import Optional

from pydantic import BaseModel, HttpUrl


class Investor(BaseModel):
    id: int
    iinvestor_name: str
    is_parent: bool
    bqr_date: datetime
    country_of_risk_code: str
    investor_type_id: int
    aum_usd: float
    aum_source_link: HttpUrl
    aum_date: datetime
    nav_usd: float
    nav_source_link: HttpUrl
    nav_date: datetime
    ien_number: str
    is_national: int  # If this should be a boolean, change to bool
    investor_comment: Optional[str] = None
    created_by: str
    created_at: datetime
