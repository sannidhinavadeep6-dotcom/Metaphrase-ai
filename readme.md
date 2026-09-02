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
├── frontend/                        # React SPA (Vite + TailwindCSS)
│   ├── src/
│   │   ├── components/              # Navbar, ParaphraseView, FloatingDock, Modals
│   │   │   ├── BatchProcessingModal.jsx   # .docx / .txt Batch File Uploader
│   │   │   ├── CustomPersonaModal.jsx     # User Custom Personas Manager
│   │   │   ├── FloatingDiffModal.jsx      # Side-by-side Diff Inspector
│   │   │   ├── FloatingMetricsModal.jsx   # Readability Analytics
│   │   │   └── FloatingExportModal.jsx    # Document Download Center
│   │   ├── services/api.js          # REST client communicating with FastAPI
│   │   ├── App.jsx                  # Main orchestrator
│   │   └── index.css                # Glassmorphism design tokens & animations
│   ├── Dockerfile                   # Multi-stage React Nginx container
│   └── vite.config.js               # Vite config with backend proxy
├── tests/                           # Comprehensive QA Test Suites
│   ├── test_api.py                  # FastAPI route integration tests
│   ├── test_metrics.py              # Readability & linguistic formula tests
│   └── test_security.py             # Bcrypt hashing & authentication tests
├── .github/workflows/ci.yml         # GitHub Actions automated test & build pipeline
├── deploy/                          # Cloud Deployment Manifests
│   └── aws-ecs-task-definition.json # AWS ECS Fargate task definition
├── Dockerfile                       # FastAPI backend production container
├── docker-compose.yml               # Local/Staging multi-container orchestration
├── server.py                        # FastAPI enterprise backend server
├── database.py                      # Salted bcrypt database manager (SQLite WAL)
├── utils/
│   ├── ai_generator.py              # Multilingual Gemini AI engine with LRU caching
│   ├── config.py                    # AWS Secrets Manager & credential vault
│   └── text_metrics.py              # Readability & linguistic suite
├── pytest.ini                       # Test runner configuration
├── requirements.txt                 # Python dependencies
└── .env                             # Environment configuration
```

---

## ⚡ Quick Start

### 1. Start the FastAPI Backend:
```powershell
.\venv\Scripts\python -m uvicorn server:app --host 127.0.0.1 --port 8000
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
.\venv\Scripts\pytest -v tests/
```

---

## 🐳 Docker Deployment
```powershell
docker-compose up --build
```