# backend/src/repository/events.py
import fastapi
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from backend.src.config.manager import settings

async def initialize_db_connection(backend_app: fastapi.FastAPI) -> None:
    """
    Creates the SQLAlchemy engine and attaches a sessionmaker to the app state.
    """
    # 1. Create the async engine
    engine = create_async_engine(
        settings.DATABASE_URL,  # Ensure this is in your settings (e.g., postgresql+asyncpg://...)
        echo=settings.DEBUG,
        future=True
    )

    # 2. Create a session factory
    session_factory = async_sessionmaker(
        bind=engine,
        expire_on_commit=False,
        class_=AsyncSession
    )

    # 3. Store them in the app state so they are accessible globally via 'request.app.state'
    backend_app.state.db_engine = engine
    backend_app.state.db_session_factory = session_factory

    print("PostgreSQL connection pool established.")


async def dispose_db_connection(backend_app: fastapi.FastAPI) -> None:
    """
    Closes the connection pool on shutdown.
    """
    engine = getattr(backend_app.state, "db_engine", None)
    if engine:
        await engine.dispose()
        print("PostgreSQL connection pool closed.")