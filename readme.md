# Metaphrase: AI-Based Content Paraphrasing Tool

## Overview
Metaphrase is a Generative AI application designed to rewrite text into three distinct difficulty levels: **Simple, Moderate, and Advanced**. Built to address the need for accessible educational content, this tool simplifies or elevates text while strictly maintaining semantic consistency and the original meaning.

## Features
* **Text Input Area:** Easily paste large blocks of text for processing.
* **Difficulty-Level Selection:** Choose between Simple (Middle School), Moderate (High School), or Advanced (Academic/Professional) reading levels.
* **Semantic Consistency:** Utilizes strict prompt engineering with the Google Gemini API to ensure core facts are neither added nor removed.
* **Readability Comparison:** Automatically calculates and compares Flesch Reading Ease and Estimated School Grade levels between the original and paraphrased text using the `textstat` library.

## Tech Stack
* **Frontend:** [Streamlit](https://streamlit.io/) (Python)
* **AI Engine:** Google Gemini API (`gemini-1.5-flash`)
* **Text Metrics:** `textstat`
* **Environment Management:** `python-dotenv`

##  Project Structure
```text
metaphrase/
├── .env                    # Stores Gemini API Key (Do not commit to version control)
├── .gitignore              # Specifies intentionally untracked files to ignore
├── README.md               # Project documentation
├── requirements.txt        # Python dependencies
├── app.py                  # Main Streamlit application UI
├── utils/                  # Backend logic module
│   ├── __init__.py
│   ├── ai_generator.py     # Handles Gemini API and semantic constraints
│   └── text_metrics.py     # Calculates readability scores
└── assets/                 
    └── style.css           # Custom UI styling