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

            # Validate AUM_USD and NAV_USD - collect errors instead of raising immediately
            errors: dict = {}
            for idx, row in enumerate(clean_data):
                aum_usd = row.get("AUM_USD")
                nav_usd = row.get("NAV_USD")
                if aum_usd is not None and nav_usd is not None and aum_usd == nav_usd:
                    errors[idx] = (
                        f"Row {idx + 1}: AUM_USD and NAV_USD cannot be the same value ({aum_usd})"
                    )

            # Return response with data and errors
            response = {
                "rows_processed": len(clean_data),
                "data": clean_data,
            }

            # Only include errors dict if there are errors
            if errors:
                response["errors"] = errors

            return response

        except Exception as e:
            print(f"Error processing Excel: {e}")
            raise HTTPException(status_code=400, detail=str(e))
        finally:
            await file.close()
