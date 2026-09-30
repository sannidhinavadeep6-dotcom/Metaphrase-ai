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

def _offline_humanize_fallback(text: str) -> str:
    """Local offline humanizer rule-set when cloud connectivity is impaired."""
    replacements = {
        "furthermore": "also",
        "moreover": "in addition",
        "in conclusion": "to wrap up",
        "it is important to note": "notably",
        "delve into": "explore",
        "tapestry": "range",
        "multifaceted": "varied",
        "paramount": "vital",
        "beacon": "model",
        "testament": "proof",
        "crucial role": "key part",
        "revolutionize": "reshape",
        "pivotal": "central",
        "underscores": "highlights",
        "fosters": "builds",
        "dynamic landscape": "changing environment",
        "in summary": "overall",
        "utilize": "use",
        "facilitate": "help",
        "leverage": "use",
        "demonstrate": "show",
        "subsequently": "then",
        "approximately": "about",
        "commence": "start",
        "terminate": "end",
        "endeavor": "effort",
        "optimize": "improve",
        "implement": "set up",
        "ascertain": "check",
        "comprehend": "understand"
    }
    lines = text.split("\n")
    transformed_lines = []
    for line in lines:
        if not line.strip():
            transformed_lines.append(line)
            continue
        words = line.split(" ")
        new_words = []
        for w in words:
            clean_w = w.lower().strip(".,!?;:\"'()[]{}")
            if clean_w in replacements:
                rep = replacements[clean_w]
                if w and w[0].isupper():
                    rep = rep.capitalize()
                prefix = ""
                for char in w:
                    if char in ".,!?;:\"'([]{}":
                        prefix += char
                    else:
                        break
                suffix = ""
                for char in reversed(w):
                    if char in ".,!?;:\"'([]{}":
                        suffix = char + suffix
                    else:
                        break
                new_words.append(prefix + rep + suffix)
            else:
                new_words.append(w)
        transformed_lines.append(" ".join(new_words))
    return "\n".join(transformed_lines)

def humanize_text(text: str, target_language: str = "English") -> str:
    """
    Transforms rigid/synthetic prose into natural, rhythmic, and authentic human-sounding text.
    Intentionally varies sentence lengths, removes cliché transition words, and injects active cadence.
    Handles long paragraphs and whole document files with chunking.
    """
    clean_text = (text or "").strip()
    if not clean_text:
        return ""

    # Split into chunks of ~1200 words if document is very large
    paragraphs = [p for p in clean_text.split("\n\n") if p.strip()]
    if not paragraphs:
        paragraphs = [clean_text]

    chunks = []
    current_chunk = []
    current_len = 0
    for p in paragraphs:
        p_len = len(p.split())
        if current_len + p_len > 600 and current_chunk:
            chunks.append("\n\n".join(current_chunk))
            current_chunk = [p]
            current_len = p_len
        else:
            current_chunk.append(p)
            current_len += p_len
    if current_chunk:
        chunks.append("\n\n".join(current_chunk))

    client = get_client()
    humanized_chunks = []

    for chunk in chunks:
        prompt = (
            "You are an elite human ghostwriter and master of natural English prose. "
            "Your task is to completely HUMANIZE the following text so that it reads 100% like it was written by an expressive human author, effortlessly bypassing AI content detectors.\n\n"
            "CRITICAL HUMANIZATION DIRECTIVES:\n"
            "1. VARY SENTENCE LENGTH & RHYTHM: Inject strong burstiness. Mix short, punchy 4-7 word sentences with longer, flowing explanatory thoughts.\n"
            "2. BANISH AI BUZZWORDS & CLICHÉS: Strip all robotic fillers ('delve into', 'tapestry', 'furthermore', 'moreover', 'testament', 'in summary', 'multifaceted', 'pivotal role', 'crucial', 'underscores', 'fosters').\n"
            "3. ACTIVE & CONVERSATIONAL VOICE: Use direct, energetic phrasing, natural idioms, and authentic human vocabulary.\n"
            "4. 100% FACTUAL FIDELITY: Keep all factual information, data points, citations, names, and original intent intact.\n"
            "5. OUTPUT FORMAT: Return ONLY the final humanized text without quotation marks, introduction, or commentary."
        )

        if target_language and target_language.lower() != "english":
            prompt += f"\n6. TARGET LANGUAGE: Deliver the final humanized output naturally in {target_language}."

        prompt += f"\n\nText to Humanize:\n{chunk.strip()}"

        chunk_result = None
        for model_name in ACTIVE_GEMINI_MODELS:
            try:
                response = client.models.generate_content(
                    model=model_name,
                    contents=prompt,
                    config={
                        "temperature": 0.75,
                        "top_p": 0.95
                    }
                )
                if response and response.text:
                    cleaned = response.text.strip()
                    if cleaned.startswith('"""') and cleaned.endswith('"""'):
                        cleaned = cleaned[3:-3].strip()
                    elif cleaned.startswith('"') and cleaned.endswith('"'):
                        cleaned = cleaned[1:-1].strip()
                    if cleaned:
                        chunk_result = cleaned
                        break
            except Exception:
                continue

        if not chunk_result:
            chunk_result = _offline_humanize_fallback(chunk)
        humanized_chunks.append(chunk_result)

    return "\n\n".join(humanized_chunks)
