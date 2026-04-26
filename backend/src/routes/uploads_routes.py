import fastapi
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from sqlalchemy.ext.asyncio import AsyncSession

from backend.src.db.database import get_db
from backend.src.services.uploads_service import UploadService

router = fastapi.APIRouter(prefix="/uploads", tags=["uploads"])


@router.post("/validate", status_code=status.HTTP_200_OK)
async def validate_upload(
    file: UploadFile = File(...), db: AsyncSession = Depends(get_db)
):
    # 1. Check if filename exists and validate extension
    if not file.filename or not file.filename.endswith(".xlsx"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file. Only .xlsx files are allowed.",
        )

    # 2. Check MIME type
    EXCEL_MIME_TYPE = (
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )
    if file.content_type != EXCEL_MIME_TYPE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid content type. Please upload an Excel file.",
        )

    service = UploadService(db)
    return await service.process_upload(file)


# @router.post("/publish", status_code=status.HTTP_200_OK)
# async def validate_publish(db: AsyncSession = Depends(get_db)):
#     service = DealService(db)
#     return await service.get_all_deals()
