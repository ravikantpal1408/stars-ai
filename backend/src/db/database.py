# backend/src/db/database.py
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import declarative_base
from backend.src.config.manager import settings

# Assuming you add DATABASE_URL to your settings manager
# Format: "postgresql+asyncpg://user:password@host:port/dbname"
DATABASE_URL = settings.DATABASE_URL

# Create the async engine
engine = create_async_engine(
    DATABASE_URL,
    echo=settings.DEBUG, # Logs SQL queries if DEBUG is True
)

# Create the session factory
AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)

Base = declarative_base()

# Dependency to inject the session into your routes
async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()