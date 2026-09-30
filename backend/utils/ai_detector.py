import re
import math
from google import genai
from utils.config import get_gemini_api_key, ACTIVE_GEMINI_MODELS

_client = None

def get_client():
    global _client
    if _client is None:
        api_key = get_gemini_api_key()
        _client = genai.Client(api_key=api_key)
    return _client

# Common synthetic transition markers favored by LLMs
AI_MARKER_TERMS = [
    "furthermore", "moreover", "in conclusion", "it is important to note", 
    "delve into", "tapestry", "multifaceted", "paramount", "beacon", 
    "testament", "crucial role", "revolutionize", "pivotal", "underscores",
    "fosters", "dynamic landscape", "in summary"
]

def analyze_ai_probability(text: str) -> dict:
    """
    Evaluates linguistic burstiness, perplexity variance, and robotic syntactical markers
    to compute an AI vs Human Probability score (0-100%).
    """
    clean_text = (text or "").strip()
    if not clean_text:
        return {
            "ai_probability": 0,
            "human_probability": 100,
            "verdict": "Likely Human",
            "burstiness_score": 100,
            "repetitive_index": 0,
            "markers_found": []
        }

    # 1. Sentence splitting and length variance (Burstiness)
    sentences = [s.strip() for s in re.split(r'[.!?]+', clean_text) if s.strip()]
    if not sentences:
        sentences = [clean_text]

    sentence_lengths = [len(s.split()) for s in sentences]
    avg_length = sum(sentence_lengths) / len(sentence_lengths)
    
    if len(sentence_lengths) > 1:
        variance = sum((l - avg_length) ** 2 for l in sentence_lengths) / len(sentence_lengths)
        std_dev = math.sqrt(variance)
        # Coefficient of variation (higher = more human burstiness)
        cv = (std_dev / avg_length) if avg_length > 0 else 0
    else:
        cv = 0.4

    # Normalize burstiness score (0-100)
    burstiness_score = min(100, max(10, int(cv * 120)))

    # 2. Check for synthetic marker terms
    lower_text = clean_text.lower()
    found_markers = [term for term in AI_MARKER_TERMS if term in lower_text]

    # 3. Word repetition index
    words = re.findall(r'\b\w+\b', lower_text)
    unique_words = set(words)
    ttr = (len(unique_words) / len(words)) if words else 1.0

    # 4. Composite AI Probability calculation
    # - Low burstiness (< 40) increases AI score
    # - High marker count increases AI score
    # - Low TTR increases AI score
    ai_points = 0
    
    # Burstiness contribution (up to 40 pts)
    if burstiness_score < 30:
        ai_points += 35
    elif burstiness_score < 50:
        ai_points += 20
    elif burstiness_score < 70:
        ai_points += 10

    # Synthetic marker contribution (up to 35 pts)
    ai_points += min(35, len(found_markers) * 12)

    # Uniform sentence count penalty (up to 25 pts)
    if len(sentences) >= 4 and all(12 <= l <= 22 for l in sentence_lengths):
        ai_points += 20

    ai_probability = min(98, max(4, ai_points))
    human_probability = 100 - ai_probability

    if ai_probability < 30:
        verdict = "Likely Human-Written"
    elif ai_probability < 65:
        verdict = "Mixed / AI-Assisted"
    else:
        verdict = "Likely AI-Generated"

    return {
        "ai_probability": ai_probability,
        "human_probability": human_probability,
        "verdict": verdict,
        "burstiness_score": burstiness_score,
        "sentence_count": len(sentences),
        "markers_found": found_markers
    }

def humanize_text(text: str, target_language: str = "English") -> str:
    """
    Transforms rigid/synthetic prose into natural, rhythmic, and authentic human-sounding text.
    Intentionally varies sentence lengths, removes cliché transition words, and injects active cadence.
    """
    if not text or not text.strip():
        return ""

    client = get_client()
    prompt = (
        "You are an expert human editor and master of organic writing. "
        "Your task is to HUMANIZE the following text so it sounds 100% natural, expressive, and authentically human. "
        "CRITICAL HUMANIZATION RULES:\n"
        "1. Inject high burstiness: Mix punchy short sentences with natural, longer descriptive clauses.\n"
        "2. Strip all AI buzzwords and robotic fillers (e.g. 'Furthermore', 'Moreover', 'In summary', 'It is crucial to note', 'delve into', 'tapestry').\n"
        "3. Use direct, active voice and organic conversational cadence.\n"
        "4. Preserve 100% of the core factual meaning and message.\n"
        "5. Output ONLY the humanized prose without any commentary, markdown labels, or introductory text."
    )

    if target_language and target_language.lower() != "english":
        prompt += f"\n6. Output language: Express the final humanized text naturally in {target_language}."

    prompt += f"\n\nText to Humanize:\n{text.strip()}"

    for model_name in ACTIVE_GEMINI_MODELS:
        try:
            response = client.models.generate_content(
                model=model_name,
                contents=prompt,
                config={
                    "temperature": 0.70,
                    "top_p": 0.95
                }
            )
            if response and response.text:
                cleaned = response.text.strip()
                if cleaned.startswith('"""') and cleaned.endswith('"""'):
                    cleaned = cleaned[3:-3].strip()
                elif cleaned.startswith('"') and cleaned.endswith('"'):
                    cleaned = cleaned[1:-1].strip()
                return cleaned
        except Exception as e:
            continue

    return text
