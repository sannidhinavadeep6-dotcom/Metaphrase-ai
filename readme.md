# Metaphrase AI 3.0 Enterprise — Precision Text Transformation & Multilingual Engine

## 🚀 Overview
**Metaphrase AI 3.0 Enterprise** is a high-throughput, zero-latency text transformation and translation platform powered by **Google Gemini 3.5 Flash**, **React 19 + Vite**, and **FastAPI**. It transforms, simplifies, enriches, or translates complex documents while maintaining 100% semantic fidelity and factual accuracy.

---

## ✨ Enterprise Features
* **Document Batch Processing:** Upload complete `.docx` (Microsoft Word) or `.txt` files. The system splits the document into coherent paragraph chunks, runs concurrent asynchronous AI transformations, and returns a compiled downloadable document.
* **Custom User Personas:** Registered users can define, save, and manage custom system instructions and style rules (e.g., "Corporate Marketing Copy", "Legal Disclaimer", "Technical Summary") with custom badge icons.
* **Multilingual Translation Engine:** Integrated translation across 14+ international languages (Spanish, French, German, Hindi, Telugu, Japanese, Chinese, Arabic, Portuguese, etc.) seamlessly integrated into the paraphrasing step.
* **4 Core Tone Personas:** Simple & Clear, Natural & Fluent, Academic & Formal, and Executive & Concise.
* **Floating Windows & Modals:**
  - **Floating Action Dock:** Live word/character counters, reading time, quick sample loaders, and 1-click copy with celebratory animations.
  - **Floating Diff Inspector:** Color-coded word-by-word comparison between original and transformed text.
  - **Floating Readability Breakdown:** Comprehensive linguistic insights including Flesch Reading Ease (0-100), School Grade Level, Gunning Fog Index, and Vocabulary Diversity %.
  - **Floating Document Exporter:** 1-click downloads for Word (.docx), Markdown (.md), and Plain Text (.txt).
* **Enterprise Security & Credential Vault:**
  - Salted **bcrypt** password hashing (12 rounds) with transparent legacy migration.
  - Abstracted **AWS Secrets Manager** / Environment Vault credential management.
* **Sub-Millisecond Query Caching:** In-memory LRU cache serves repeated transformations in 0.000ms.
* **Quality Assurance & CI/CD:**
  - Automated `pytest` suite testing readability formulas, password security, and all REST endpoints.
  - GitHub Actions CI/CD pipeline (`.github/workflows/ci.yml`).

---

## 🛠️ Technology Stack
* **Frontend:** React 19, Vite, TailwindCSS, Lucide Icons, Canvas Confetti
* **Backend API:** FastAPI, Uvicorn, Pydantic, Python-Docx, Textstat, Bcrypt, Passlib
* **AI Engine:** Google Gemini Flash API (`gemini-3.5-flash` with multi-tier fallback)
* **Database:** SQLite with Write-Ahead Logging (WAL) & indexing (`metaphrase_app.db`)
* **DevOps:** Docker, Docker Compose, AWS ECS Fargate, GitHub Actions

---

## 📁 Project Structure
```text
Metaphrase-ai-main/
├── frontend/                        # React Client & Web Applications
│   ├── src/                         # React SPA components, views & services
│   ├── public/                      # Static web assets
│   ├── extension/                   # Chrome / Edge browser extension
│   ├── Dockerfile                   # Frontend container definition
│   ├── package.json                 # Frontend dependencies
│   └── vite.config.js               # Vite build & proxy config
│
├── backend/                         # Core Application Server & AI Engine
│   ├── server.py                    # FastAPI Enterprise REST API
│   ├── app.py                       # Streamlit interactive application
│   ├── run_server.py                # Standalone server runner
│   ├── utils/                       # AI generator, detector, OCR & metrics engines
│   ├── tests/                       # Automated test suites
│   ├── docs/                        # Specifications & IEEE documentation
│   ├── assets/                      # Application styling & static assets
│   ├── Dockerfile                   # Backend production container
│   ├── requirements.txt             # Python dependencies
│   └── pytest.ini                   # Pytest test runner configuration
│
├── database/                        # Database Layer & Migrations
│   ├── database.py                  # SQLite connection pool, auth & queries
│   ├── __init__.py                  # Database package exports
│   ├── schema.sql                   # Database schema DDL & indexing definitions
│   └── metaphrase_app.db            # SQLite WAL database store
│
├── docker-compose.yml               # Multi-container 24/7 orchestration
├── start_production.bat             # Windows 1-click 24/7 startup script
├── start_production.sh              # Linux/macOS 1-click startup script
├── .env.example                     # Environment variables template
└── readme.md                        # Master documentation
```

---

## ⚡ Quick Start

### 1. Start the FastAPI Backend:
```powershell
.\venv\Scripts\python -m uvicorn backend.server:app --host 127.0.0.1 --port 8000
```

### 2. Start the React Frontend:
```powershell
cd frontend
npm run dev
```
Open **`http://localhost:5173`** in your browser.

* **Admin Account:** `sannidhinavadeep6@gmail.com` / `admin123`

---

## 🧪 Running Automated Tests
```powershell
.\venv\Scripts\pytest -v backend/tests/
```

---

## 🐳 Docker Deployment
```powershell
docker-compose up --build
```