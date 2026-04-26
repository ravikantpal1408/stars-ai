import io

import pandas as pd
from fastapi import HTTPException, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from backend.src.repository.investor import InvestorRepository


class UploadService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.repository = InvestorRepository(db)

    async def process_upload(self, file: UploadFile):
        try:
            contents = await file.read()
            df = pd.read_excel(io.BytesIO(contents))

            # 1. More robust cleaning:
            # Replace NaN with None (which becomes 'null' in JSON)
            # Also replace infinity values which are also non-compliant
            df = df.replace([pd.NA, float("inf"), float("-inf")], None)
            df = df.where(pd.notnull(df), None)

            # 2. Convert to list of dicts
            data_list = df.to_dict(orient="records")

            # 3. Double-check for any remaining 'nan' floats manually
            # (Pandas sometimes keeps them as actual float objects)
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
