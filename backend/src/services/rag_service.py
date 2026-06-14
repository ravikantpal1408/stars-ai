import os
import chromadb
from chromadb.utils import embedding_functions
import pandas as pd
from typing import List, Dict, Any

class RAGService:
    def __init__(self):
        # 1. Setup a local file-based directory for Chroma storage
        self.chroma_client = chromadb.PersistentClient(path="./chroma_db")
        
        # 2. Use a highly optimized, lightweight embedding model that runs entirely local
        self.embedding_function = embedding_functions.SentenceTransformerEmbeddingFunction(
            model_name="all-MiniLM-L6-v2"
        )
        
        # 3. Create or fetch a collection for your documents
        self.collection = self.chroma_client.get_or_create_collection(
            name="stars_ai_documents",
            embedding_function=self.embedding_function
        )

    def chunk_text(self, text: str, chunk_size: int = 500, chunk_overlap: int = 100) -> List[str]:
        """
        Splits a massive text block into smaller overlapping chunks 
        so semantically rich paragraphs aren't cut in half.
        """
        words = text.split()
        chunks = []
        for i in range(0, len(words), chunk_size - chunk_overlap):
            chunk = " ".join(words[i:i + chunk_size])
            chunks.append(chunk)
        return chunks

    def ingest_document(self, filename: str, full_text: str):
        """
        Chunks the document text and stores it in the vector database.
        """
        # Clear previous records to avoid mixing data up between document uploads
        try:
            self.chroma_client.delete_collection("stars_ai_documents")
            self.collection = self.chroma_client.create_collection(
                name="stars_ai_documents",
                embedding_function=self.embedding_function
            )
        except Exception:
            pass

        chunks = self.chunk_text(full_text)
        
        # Generate clean incremental string IDs for the database
        ids = [f"{filename}_chunk_{i}" for i in range(len(chunks))]
        metadatas = [{"source": filename} for _ in range(len(chunks))]

        # Add vectors and raw content directly into ChromaDB
        self.collection.add(
            documents=chunks,
            ids=ids,
            metadatas=metadatas
        )
        print(f"[RAG Engine] Successfully ingested {len(chunks)} chunks for {filename}.")

    def query_context(self, user_query: str, n_results: int = 3) -> str:
        """
        Performs semantic search to find the top 'n_results' chunks 
        closest to the user query intent.
        """
        results = self.collection.query(
            query_texts=[user_query],
            n_results=n_results
        )
        
        # Flatten and combine the retrieved structural text strings
        retrieved_docs = results.get("documents", [[]])[0]
        return "\n\n---\n\n".join(retrieved_docs)

rag_service = RAGService()