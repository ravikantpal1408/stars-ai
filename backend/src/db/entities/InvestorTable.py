from datetime import datetime
from time import timezone
from typing import Optional
from sqlalchemy import String, Numeric, Boolean, Integer, DateTime
from sqlalchemy.orm import Mapped, mapped_column
from backend.src.db.entities.BaseModel import Base

class InvestorTable(Base):
    __tablename__ = "stars_investor_tbl"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    investor_name: Mapped[str] = mapped_column(String(255), nullable=False)
    is_parent: Mapped[bool] = mapped_column(Boolean, default=False)
    bqr_date: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    country_of_risk_code: Mapped[str] = mapped_column(String(10), nullable=False)
    investor_type_id: Mapped[int] = mapped_column(Integer, nullable=False)
    
    aum_usd: Mapped[float] = mapped_column(Numeric(precision=15, scale=2), nullable=False)
    aum_source_link: Mapped[str] = mapped_column(String(1024), nullable=False)
    aum_date: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    
    nav_usd: Mapped[float] = mapped_column(Numeric(precision=15, scale=2), nullable=False)
    nav_source_link: Mapped[str] = mapped_column(String(1024), nullable=False)
    nav_date: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    
    ien_number: Mapped[str] = mapped_column(String(50), nullable=False)
    is_national: Mapped[int] = mapped_column(Integer, default=0)
    
    investor_comment: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    created_by: Mapped[str] = mapped_column(String(100), nullable=False)
    created_on: Mapped[datetime] = mapped_column(DateTime(timezone=True),default=lambda: datetime.now(timezone.utc))