from decimal import Decimal
from datetime import datetime
from typing import Optional
from sqlalchemy import Integer, String, Numeric, Boolean, DateTime, ForeignKey, text
from sqlalchemy.orm import Mapped, mapped_column
from backend.src.db.entities.BaseModel import Base 

class DealTable(Base):
    __tablename__ = "stars_deals_tbl"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    deal_id: Mapped[int] = mapped_column(Integer, nullable=False)
    deal_name: Mapped[str] = mapped_column(String(255), nullable=False)
    investor_id: Mapped[int] = mapped_column(
        Integer, 
        ForeignKey("stars_investor_tbl.id", ondelete="CASCADE"), 
        nullable=False
    )
    region_id: Mapped[int] = mapped_column(Integer, nullable=False)
    approved_amount: Mapped[Optional[Decimal]] = mapped_column(Numeric(18, 2), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    
    created_on: Mapped[datetime] = mapped_column(
        DateTime, 
        server_default=text("TIMEZONE('utc', NOW())"), 
        nullable=False
    )
    created_by: Mapped[str] = mapped_column(String(100), nullable=False)