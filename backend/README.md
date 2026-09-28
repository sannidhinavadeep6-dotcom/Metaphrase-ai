# Backend Services — Metaphrase AI

This directory houses the backend API server, neural transformation utilities, AI detection engines, metrics calculators, and automated tests.

## Structure
- `server.py`: FastAPI enterprise REST API service with endpoints for authentication, paraphrasing, OCR, detection, metrics, and document parsing.
- `run_server.py`: Server launcher script with port configuration.
- `app.py`: Streamlit interactive dashboard application.
- `utils/`: Core processing modules:
  - `ai_generator.py`: Google Gemini API integration and tone profiles.
  - `ai_detector.py`: AI probability analyzer and humanizer engine.
  - `text_metrics.py`: Flesch-Kincaid reading ease, grade level, and lexical diversity.
  - `sentence_editor.py`: Granular sentence-level alternatives and contextual synonyms.
  - `ocr_parser.py`: Image OCR and vision parsing.
  - `doc_parser.py`: File parser for PDF, DOCX, TXT.
  - `originality.py`: Academic originality scoring and citation generator.
- `tests/`: Pytest automated test suites covering security, API endpoints, metrics, and advanced features.
- `docs/`: Technical specifications and IEEE documentation.
- `assets/`: Styling assets and static media.
- `requirements.txt`: Python package dependencies.
- `Dockerfile`: Production Docker container definition for the backend service.

## Running Backend
```bash
# Run FastAPI server
python -m uvicorn backend.server:app --reload --port 8000

# Or using run_server.py
python backend/run_server.py

# Run tests
python -m pytest backend/tests/
```
