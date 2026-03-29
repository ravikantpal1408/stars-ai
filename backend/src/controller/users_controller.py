import fastapi

router = fastapi.APIRouter(prefix="/users", tags=["users"])


@router.get(
    path="",
    name="users:read-users",
    response_model=list[str],
    status_code=fastapi.status.HTTP_200_OK,
)
async def read_users() -> list[str]:
    """
    Endpoint to read all users.

    Returns:
        list[str]: A list of user names.
    """
    return ["Alice", "Bob", "Charlie"]