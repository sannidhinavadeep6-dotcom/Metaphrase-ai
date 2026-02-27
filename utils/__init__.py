# utils/__init__.py

"""
Metaphrase Utilities Package
This package contains the backend logic for AI generation and text metrics.
"""

# We will write these functions in the next steps, but importing them 
# here allows app.py to import them directly from 'utils'
from .ai_generator import generate_paraphrase
from .text_metrics import get_readability_scores