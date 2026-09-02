import json
from google import genai
from utils.config import get_gemini_api_key

_client = None

def get_client():
    global _client
    if _client is None:
        api_key = get_gemini_api_key()
        _client = genai.Client(api_key=api_key)
    return _client

def generate_sentence_alternatives(sentence: str, full_context: str = "", tone: str = "Fluent") -> list:
    """
    Generates 3-4 high-quality, localized alternative rephrasings for a specific sentence,
    taking surrounding context into account.
    """
    if not sentence or not sentence.strip():
        return []

    client = get_client()
    prompt = (
        f"Context around sentence (for reference):\n\"{full_context.strip()[:400]}\"\n\n"
        f"Target Sentence to Rewrite:\n\"{sentence.strip()}\"\n\n"
        f"Tone / Style: {tone}\n\n"
        "Provide exactly 3 distinct, high-quality rephrasings of this sentence. "
        "Return ONLY a JSON array of strings, for example: [\"Option 1\", \"Option 2\", \"Option 3\"]. "
        "Do NOT include markdown formatting, backticks, or extra text."
    )

    try:
        response = client.models.generate_content(
            model="gemini-3.5-flash",
            contents=prompt,
            config={
                "temperature": 0.45,
                "top_p": 0.95
            }
        )
        if response and response.text:
            text = response.text.strip()
            # Strip potential ```json wrappers
            if text.startswith("```"):
                lines = text.split("\n")
                if lines[0].startswith("```"):
                    lines = lines[1:]
                if lines and lines[-1].startswith("```"):
                    lines = lines[:-1]
                text = "\n".join(lines).strip()
            
            alternatives = json.loads(text)
            if isinstance(alternatives, list):
                return [str(a).strip() for a in alternatives if a][:4]
    except Exception as e:
        print(f"[SentenceEditor] Alternative generation error: {e}")

    # Fallback heuristic alternatives if JSON parsing failed
    return [
        f"{sentence.strip()}",
        f"In other words, {sentence.strip().lower()}",
        f"Specifically, {sentence.strip().lower()}"
    ]

def get_contextual_synonyms(word_or_phrase: str, sentence_context: str = "") -> list:
    """
    Returns 4-6 contextual synonyms with brief nuance descriptions.
    """
    if not word_or_phrase or not word_or_phrase.strip():
        return []

    client = get_client()
    prompt = (
        f"Sentence context:\n\"{sentence_context.strip()[:300]}\"\n\n"
        f"Target Word/Phrase: \"{word_or_phrase.strip()}\"\n\n"
        "Provide 4-5 contextual synonyms suitable for replacing this word in context. "
        "Return ONLY a JSON array of objects with 'word' and 'nuance' properties. "
        "Example: [{\"word\": \"enhance\", \"nuance\": \"adds value or quality\"}, {\"word\": \"boost\", \"nuance\": \"increases rapidly\"}]. "
        "Do NOT include markdown backticks or extra text."
    )

    try:
        response = client.models.generate_content(
            model="gemini-3.5-flash",
            contents=prompt,
            config={
                "temperature": 0.35,
                "top_p": 0.95
            }
        )
        if response and response.text:
            text = response.text.strip()
            if text.startswith("```"):
                lines = text.split("\n")
                if lines[0].startswith("```"):
                    lines = lines[1:]
                if lines and lines[-1].startswith("```"):
                    lines = lines[:-1]
                text = "\n".join(lines).strip()
            
            data = json.loads(text)
            if isinstance(data, list):
                return data[:5]
    except Exception as e:
        print(f"[SentenceEditor] Synonym lookup error: {e}")

    return [
        {"word": word_or_phrase, "nuance": "Original term"}
    ]
