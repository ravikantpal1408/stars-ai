import io

import pandas as pd
from fastapi import HTTPException, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from backend.src.repository.upload import UploadRepository


class UploadService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.repository = UploadRepository(db)

    async def process_upload(self, file: UploadFile):
        try:
            contents = await file.read()
            df = pd.read_excel(io.BytesIO(contents))

            df = df.replace([pd.NA, float("inf"), float("-inf")], None)
            df = df.where(pd.notnull(df), None)

            data_list = df.to_dict(orient="records")

            clean_data = [
                {
                    k: (None if (isinstance(v, float) and pd.isna(v)) else v)
                    for k, v in row.items()
                }
                for row in data_list
            ]

            return {"rows_processed": len(clean_data), "data": clean_data}

        except Exception as e:
            print(f"Error processing Excel: {e}")
            raise HTTPException(status_code=400, detail=str(e))
        finally:
            await file.close()
