# ==========================================
# Metaphrase AI 3.0 — FastAPI Backend Container
# ==========================================
FROM python:3.11-slim

WORKDIR /app

# Set environment variables for 24/7 production resilience
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    DB_PATH=/app/data/metaphrase_app.db \
    PYTHONPATH=/app:/app/backend

# Install system dependencies & curl for healthcheck
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Create persistent data directory
RUN mkdir -p /app/data

# Install python dependencies
COPY backend/requirements.txt ./backend/requirements.txt
RUN pip install --no-cache-dir -r ./backend/requirements.txt

# Copy application files
COPY backend/ ./backend/
COPY database/ ./database/

# Expose port
EXPOSE 8000

# 24/7 Health check probe
HEALTHCHECK --interval=20s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:8000/api/health || exit 1

# Run with multi-threaded high-throughput Uvicorn
CMD ["sh", "-c", "uvicorn backend.server:app --host 0.0.0.0 --port ${PORT:-8000} --workers 4 --timeout-keep-alive 65"]

