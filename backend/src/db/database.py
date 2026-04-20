# backend/src/db/database.py
import fastapi
from sqlalchemy.ext.asyncio import AsyncEngine, create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import declarative_base
from backend.src.config.manager import settings

# Database URL from settings
DATABASE_URL = settings.DATABASE_URL

engine: AsyncEngine | None = None
AsyncSessionLocal: async_sessionmaker[AsyncSession] | None = None


def _create_engine_and_session_factory() -> tuple[AsyncEngine, async_sessionmaker[AsyncSession]]:
    global engine, AsyncSessionLocal
    if engine is None or AsyncSessionLocal is None:
        engine = create_async_engine(
            DATABASE_URL,
            echo=settings.DEBUG,
            future=True,
        )
        AsyncSessionLocal = async_sessionmaker(
            bind=engine,
            class_=AsyncSession,
            expire_on_commit=False,
            autocommit=False,
            autoflush=False,
        )
    return engine, AsyncSessionLocal


async def initialize_db_connection(backend_app: fastapi.FastAPI) -> None:
    """
    Creates the SQLAlchemy engine and attaches a sessionmaker to the app state.
    """
    engine, session_factory = _create_engine_and_session_factory()
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


Base = declarative_base()


async def get_db(request: fastapi.Request):
    session_factory = getattr(request.app.state, "db_session_factory", None)
    if session_factory is None:
        _, session_factory = _create_engine_and_session_factory()
    async with session_factory() as session:
        try:
            yield session
        finally:
            await session.close()