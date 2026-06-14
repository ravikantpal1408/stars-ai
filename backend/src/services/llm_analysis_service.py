import io
import pandas as pd
from typing import Optional
from backend.src.llm.llm_connectivity import LLMService
from backend.src.services.rag_service import RAGService
from backend.src.repository.deals_repo import DealRepository

class LLMAnalysisService:
    def __init__(self, repository: Optional[DealRepository] = None):
        self.repository = repository

    async def analyze_deals_pipeline(self) -> str:
        # (Keep your existing database logic here untouched)
        pass

    async def analyze_document_pipeline(self, mode: str, prompt: str, data_payload: bytes, filename: str) -> str:
        """
        RAG Enhanced Pipeline Layer: Handles large document ingestion via vector embedding
        and passes only semantically precise context blocks to Qwen over the network.
        """
        # --- Spreadsheet/Large File Parser ---
        if mode == "excel":
            df = pd.read_excel(io.BytesIO(data_payload))
            
            # Instead of a strict head(50) slice, we convert the full spreadsheet to string
            # and let our RAG workflow slice out the precise rows matching the prompt.
            full_spreadsheet_text = df.to_string(index=False)            
            
            # 1. Ingest into local vector store
            rag_service = RAGService()
            rag_service.ingest_document(filename=filename, full_text=full_spreadsheet_text)
            
            # 2. Extract only rows/cells relevant to the current user prompt
            relevant_context = rag_service.query_context(user_query=prompt, n_results=5)
            
            # 3. Build a compact, contextualized prompt
            text_prompt = (
                f"You are evaluating a large data set. Answer the user query using only the relevant contextual matrix provided below.\n\n"
                f"User Query: {prompt}\n\n"
                f"Relevant Context from Document:\n{relevant_context}"
            )
            llm_service = LLMService()
            return await llm_service.generate_response(user_prompt=text_prompt)

        # --- Vision Logic ---
        elif mode == "vision":
            return await llm_service.generate_vision_response(
                prompt=prompt,
                image_bytes=data_payload,
                mime_type="image/png"
            )
        else:
            raise ValueError("Invalid document processing mode specified.")