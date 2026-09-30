import json
import re
from google import genai
from utils.config import get_gemini_api_key, ACTIVE_GEMINI_MODELS

_client = None

def get_client():
    global _client
    if _client is None:
        api_key = get_gemini_api_key()
        _client = genai.Client(api_key=api_key)
    return _client

CANDIDATE_MODELS = ACTIVE_GEMINI_MODELS

def _rule_based_fallback_grammar(text: str) -> dict:
    """Self-healing rule-based grammar and spelling analyzer."""
    issues = []
    corrected_text = text
    common_mistakes = {
        r"\bteh\b": ("the", "Spelling", "Misspelled word 'teh'"),
        r"\brecieve\b": ("receive", "Spelling", "Misspelled word (i before e rule)"),
        r"\btheir is\b": ("there is", "Grammar", "Confused word pair ('their' vs 'there')"),
        r"\byour welcome\b": ("you're welcome", "Grammar", "Incorrect possessive form"),
        r"\bits a\b": ("it's a", "Punctuation", "Missing apostrophe for contraction"),
        r"\bdont\b": ("don't", "Punctuation", "Missing contraction apostrophe"),
        r"\bcant\b": ("can't", "Punctuation", "Missing contraction apostrophe"),
        r"\bwont\b": ("won't", "Punctuation", "Missing contraction apostrophe"),
        r"\bvery unique\b": ("unique", "Clarity", "'Unique' is an absolute and does not take qualifiers"),
        r"\bin order to\b": ("to", "Conciseness", "Wordy phrase can be simplified to 'to'")
    }

    issue_id = 1
    for pattern, (replacement, issue_type, explanation) in common_mistakes.items():
        matches = list(re.finditer(pattern, corrected_text, re.IGNORECASE))
        for m in matches:
            original_match = m.group(0)
            rep_formatted = replacement.capitalize() if original_match[0].isupper() else replacement
            issues.append({
                "id": issue_id,
                "original": original_match,
                "suggestion": rep_formatted,
                "type": issue_type,
                "explanation": explanation
            })
            issue_id += 1
            corrected_text = re.sub(pattern, rep_formatted, corrected_text, count=1, flags=re.IGNORECASE)

    # Calculate score
    words = text.split()
    word_count = len(words)
    error_count = len(issues)
    score = max(50, min(100, 100 - (error_count * 8))) if word_count > 0 else 100

    return {
        "original_text": text,
        "corrected_text": corrected_text,
        "issues": issues,
        "score": score,
        "word_count": word_count,
        "char_count": len(text),
        "reading_time": f"{max(1, round(word_count / 200 * 60))}s"
    }

def analyze_grammar_and_spelling(text: str) -> dict:
    """Analyze grammar, spelling, punctuation, clarity, and conciseness."""
    if not text or not text.strip():
        return {
            "original_text": "",
            "corrected_text": "",
            "issues": [],
            "score": 100,
            "word_count": 0,
            "char_count": 0,
            "reading_time": "0s"
        }

    client = get_client()
    prompt = f"""
Analyze the following text for grammar errors, spelling mistakes, punctuation issues, and clarity enhancements.
Return ONLY valid JSON (no surrounding markdown code blocks, no backticks, no extra text) with this exact schema:
{{
  "corrected_text": "Complete corrected version of the text with all grammar/spelling fixes applied",
  "score": 85,
  "issues": [
    {{
      "id": 1,
      "original": "misspelled or incorrect phrase from original",
      "suggestion": "corrected replacement",
      "type": "Grammar" | "Spelling" | "Punctuation" | "Clarity" | "Conciseness",
      "explanation": "Brief explanation of why this was corrected"
    }}
  ]
}}

Original Text:
{text.strip()}
"""

    for model_name in CANDIDATE_MODELS:
        try:
            response = client.models.generate_content(
                model=model_name,
                contents=prompt,
                config={
                    "temperature": 0.1,
                    "top_p": 0.9,
                    "response_mime_type": "application/json"
                }
            )
            if response and response.text:
                raw_json = response.text.strip()
                if raw_json.startswith("```json"):
                    raw_json = raw_json[7:]
                if raw_json.startswith("```"):
                    raw_json = raw_json[3:]
                if raw_json.endswith("```"):
                    raw_json = raw_json[:-3]
                data = json.loads(raw_json.strip())
                
                words = text.split()
                data["original_text"] = text
                data["word_count"] = len(words)
                data["char_count"] = len(text)
                data["reading_time"] = f"{max(1, round(len(words) / 200 * 60))}s"
                if "score" not in data:
                    data["score"] = max(60, min(100, 100 - len(data.get("issues", [])) * 6))
                return data
        except Exception:
            continue

    return _rule_based_fallback_grammar(text)
