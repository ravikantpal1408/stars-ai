import pandas as pd
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from backend.src.services.llm_analysis_service import LLMAnalysisService

router = APIRouter(prefix="/ai", tags=["AI Unified Copilot"])

def get_analysis_service():
    return LLMAnalysisService()

@router.post("/analyze-document")
async def analyze_uploaded_document(
    file: UploadFile = File(...),
    prompt: str = Form("Extract all relevant financial metrics or text data cleanly."),
    service: LLMAnalysisService = Depends(get_analysis_service)
):
    content_type = file.content_type or ""

    try:
        file_bytes = await file.read()
        
        if "spreadsheetml.sheet" in content_type or "excel" in content_type or file.filename.endswith(('.xlsx', '.xls')):
            mode = "excel"
        elif content_type.startswith("image/"):
            mode = "vision"
        else:
            raise HTTPException(
                status_code=400, 
                detail="Unsupported format. Please upload an Excel sheet (.xlsx) or an image."
            )

        # Await the service pipeline execution
        output = await service.analyze_document_pipeline(
            mode=mode,
            prompt=prompt,
            data_payload=file_bytes,
            filename=file.filename # Forwarding filename parameter here
        )

        return {
            "success": True,
            "filename": file.filename,
            "detected_mode": "Spreadsheet Parser" if mode == "excel" else "Vision Model",
            "analysis": output
        }
        
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        print(f"[Route Exception Handled]: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Document Pipeline processing error: {str(e)}")