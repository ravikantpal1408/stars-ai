import logging
import fastapi
from fastapi import Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text

from backend.src.db.database import get_db

logger = logging.getLogger(__name__)
router = fastapi.APIRouter(prefix="/users", tags=["users"])


# @router.get(
#     path="",
#     name="users:read-users",
#     response_model=list[str],
#     status_code=fastapi.status.HTTP_200_OK,
# )
# async def read_users() -> list[str]:
#     """
#     Endpoint to read all users.

#     Returns:
#         list[str]: A list of user names.
#     """
#     logger.info("Reading users...")
#     return ["Alice", "Bob", "Charlie"]


@router.get(
    path="",
    name="users:read-all",
    status_code=status.HTTP_200_OK,
)
async def read_users(db: AsyncSession = Depends(get_db)):
    """
    Fetch all users from the database.
    """
    logger.info("Fetching investors from DB...")
    result = await db.execute(text("SELECT * FROM scf_investor ORDER BY id DESC"))
    
    # Convert rows to a list of dictionaries for the JSON response
    investors = result.mappings().all()
    return list(investors)