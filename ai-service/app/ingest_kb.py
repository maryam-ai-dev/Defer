"""
KB Ingestion Script

Reads .txt files from datasets/support_kb/, chunks them, generates embeddings,
and writes directly to Postgres (knowledge_documents + knowledge_chunks).

Run as: python -m app.ingest_kb
"""

import asyncio
import json
import logging
import os
import uuid
from datetime import datetime
from pathlib import Path

import asyncpg
from sentence_transformers import SentenceTransformer

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
logger = logging.getLogger(__name__)

KB_DIR = os.getenv(
    "KB_DIR",
    str(Path(__file__).resolve().parent.parent.parent / "datasets" / "support_kb"),
)
KB_DIR = Path(KB_DIR)
CHUNK_SIZE = 200  # words
CHUNK_OVERLAP = 20  # words
MODEL_NAME = "all-MiniLM-L6-v2"

POSTGRES_URL = os.getenv("POSTGRES_URL", "postgresql://defer:defer@localhost:5432/defer")


def chunk_text(text: str, chunk_size: int = CHUNK_SIZE, overlap: int = CHUNK_OVERLAP) -> list[str]:
    """Split text into ~chunk_size word segments with overlap."""
    words = text.split()
    chunks = []
    start = 0
    while start < len(words):
        end = start + chunk_size
        chunk = " ".join(words[start:end])
        chunks.append(chunk)
        start = end - overlap
        if start >= len(words):
            break
    return chunks


async def ingest():
    logger.info("Loading embedding model: %s", MODEL_NAME)
    model = SentenceTransformer(MODEL_NAME)

    logger.info("Connecting to Postgres: %s", POSTGRES_URL)
    conn = await asyncpg.connect(POSTGRES_URL)

    try:
        # Clear existing data for a clean re-ingest
        await conn.execute("DELETE FROM knowledge_chunks")
        await conn.execute("DELETE FROM knowledge_documents")
        logger.info("Cleared existing knowledge data")

        txt_files = sorted(KB_DIR.glob("*.txt"))
        if not txt_files:
            logger.warning("No .txt files found in %s", KB_DIR)
            return

        logger.info("Found %d KB documents in %s", len(txt_files), KB_DIR)

        for filepath in txt_files:
            doc_id = uuid.uuid4()
            title = filepath.stem.replace("_", " ").title()
            now = datetime.utcnow()

            text = filepath.read_text(encoding="utf-8")
            chunks = chunk_text(text)

            logger.info("Processing: %s (%d chunks)", title, len(chunks))

            # Insert document
            await conn.execute(
                """
                INSERT INTO knowledge_documents (id, source_type, title, version, uri, active, created_at)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                """,
                doc_id, "file", title, "1.0", str(filepath), True, now,
            )

            # Generate embeddings for all chunks at once
            embeddings = model.encode(chunks)

            # Insert chunks with embeddings
            for i, (chunk, embedding) in enumerate(zip(chunks, embeddings)):
                chunk_id = uuid.uuid4()
                metadata = json.dumps({"chunk_index": i, "source_file": filepath.name})
                embedding_str = "[" + ",".join(str(float(x)) for x in embedding) + "]"

                await conn.execute(
                    """
                    INSERT INTO knowledge_chunks (id, document_id, chunk_text, embedding, metadata_json, created_at)
                    VALUES ($1, $2, $3, $4::vector, $5::jsonb, $6)
                    """,
                    chunk_id, doc_id, chunk, embedding_str, metadata, now,
                )

            logger.info("  -> Inserted %d chunks for %s", len(chunks), title)

        # Final count
        doc_count = await conn.fetchval("SELECT COUNT(*) FROM knowledge_documents")
        chunk_count = await conn.fetchval("SELECT COUNT(*) FROM knowledge_chunks")
        logger.info("Ingestion complete: %d documents, %d chunks", doc_count, chunk_count)

    finally:
        await conn.close()


def main():
    asyncio.run(ingest())


if __name__ == "__main__":
    main()
