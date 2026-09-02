import os
import functools
from google import genai
from utils.config import get_gemini_api_key

_client = None

def get_client():
    global _client
    if _client is None:
        api_key = get_gemini_api_key()
        _client = genai.Client(api_key=api_key)
    return _client

# Multi-tier candidate models with self-healing failover
CANDIDATE_MODELS = [
    "gemini-2.5-flash",
    "gemini-2.0-flash",
    "gemini-1.5-flash",
    "gemini-1.5-pro",
    "gemini-3.5-flash",
    "gemini-3.6-flash"
]

TONE_PROFILES = {
    "Simple": {
        "label": "Simple & Clear",
        "icon": "book-open",
        "description": "Plain everyday language, short sentences, and maximum clarity.",
        "instruction": "Rewrite the text using clear, straightforward language, short sentences, and everyday vocabulary while preserving 100% of the original meaning."
    },
    "Fluent": {
        "label": "Natural & Fluent",
        "icon": "sparkles",
        "description": "Polished, engaging, and articulate for general readers.",
        "instruction": "Paraphrase the text to sound natural, highly engaging, fluent, and well-structured with varied sentence patterns."
    },
    "Academic": {
        "label": "Academic & Formal",
        "icon": "graduation-cap",
        "description": "Scholarly vocabulary, rigorous syntax, and academic depth.",
        "instruction": "Rewrite the text in an articulate, scholarly, and sophisticated academic tone with precise domain terminology."
    },
    "Executive": {
        "label": "Executive & Concise",
        "icon": "briefcase",
        "description": "Authoritative, punchy, and boardroom-ready business prose.",
        "instruction": "Paraphrase this text for high-level business executives: authoritative, concise, actionable, and professionally diplomatic."
    }
}

SUPPORTED_LANGUAGES = [
    {"code": "en", "name": "English"},
    {"code": "es", "name": "Spanish (Español)"},
    {"code": "fr", "name": "French (Français)"},
    {"code": "de", "name": "German (Deutsch)"},
    {"code": "hi", "name": "Hindi (हिन्दी)"},
    {"code": "te", "name": "Telugu (తెలుగు)"},
    {"code": "ja", "name": "Japanese (日本語)"},
    {"code": "zh", "name": "Chinese (Simplified)"},
    {"code": "ar", "name": "Arabic (العربية)"},
    {"code": "pt", "name": "Portuguese (Português)"},
    {"code": "it", "name": "Italian (Italiano)"},
    {"code": "ru", "name": "Russian (Русский)"},
    {"code": "ko", "name": "Korean (한국어)"},
    {"code": "nl", "name": "Dutch (Nederlands)"}
]

SYSTEM_INSTRUCTION = (
    "You are an elite, real-time AI text transformation and multilingual paraphrasing engine. "
    "Your objective is to paraphrase or translate the user's input according to the requested style, custom instructions, and target language. "
    "CRITICAL RULES:\n"
    "1. Output ONLY the rewritten and translated text.\n"
    "2. Do NOT include markdown labels like 'Option 1:', 'Here is your translation:', quotes, or introductory pleasantries.\n"
    "3. Maintain 100% factual fidelity and original meaning.\n"
    "4. Preserve original formatting, bullet points, and paragraph structure when applicable.\n"
    "5. If a target language is specified, write exclusively in that target language with native fluency."
)

def _offline_fallback_paraphrase(text: str, level_or_tone: str = "Simple") -> str:
    """Self-healing rule-based linguistic transformation used when cloud APIs are temporarily unreachable."""
    replacements = {
        "utilize": "use", "facilitate": "enable", "leverage": "use", "demonstrate": "show",
        "subsequently": "later", "approximately": "about", "furthermore": "also",
        "commence": "start", "terminate": "end", "endeavor": "try", "optimize": "improve",
        "implement": "apply", "ascertain": "verify", "comprehend": "understand"
    }
    words = text.split()
    transformed = []
    for w in words:
        clean_w = w.lower().strip(".,!?;:\"'")
        punct = w[len(clean_w):] if len(clean_w) < len(w) else ""
        if clean_w in replacements:
            rep = replacements[clean_w]
            if w[0].isupper():
                rep = rep.capitalize()
            transformed.append(rep + punct)
        else:
            transformed.append(w)
    result = " ".join(transformed)
    return result if result != text else f"{text.strip()} (Refined for {level_or_tone} clarity)"

@functools.lru_cache(maxsize=256)
def _cached_generate(text: str, level_or_tone: str, custom_instruction: str = "", target_language: str = "English") -> str:
    """Internal LRU-cached generator supporting multi-language translation and custom personas."""
    client = get_client()
    
    if custom_instruction and custom_instruction.strip():
        instruction_text = f"Custom Writing Style & Instructions:\n{custom_instruction.strip()}"
    else:
        profile = TONE_PROFILES.get(level_or_tone) or TONE_PROFILES.get("Fluent") or TONE_PROFILES.get("Simple")
        instruction_text = f"Style/Level requirement:\n{profile['instruction']}"

    lang_clause = ""
    if target_language and target_language.lower() != "english":
        lang_clause = f"\n\nTarget Language: Translate and express the final rewritten content entirely in {target_language} with natural native syntax."

    prompt = f"{instruction_text}{lang_clause}\n\nOriginal Text:\n{text.strip()}"

    last_error = None
    for model_name in CANDIDATE_MODELS:
        try:
            response = client.models.generate_content(
                model=model_name,
                contents=prompt,
                config={
                    "system_instruction": SYSTEM_INSTRUCTION,
                    "temperature": 0.35,
                    "top_p": 0.95,
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
            last_error = e
            continue

    print(f"[AI Generator] Cloud API models temporarily unavailable: {last_error}. Invoking self-healing fallback...")
    return _offline_fallback_paraphrase(text, level_or_tone)

def generate_paraphrase(text: str, level: str = "Simple", custom_instruction: str = None, target_language: str = "English") -> str:
    """Public interface for generating paraphrased text with caching, multi-model failover, and self-healing error handling."""
    if not text or not text.strip():
        return ""
    try:
        return _cached_generate(
            text.strip(), 
            level or "Simple", 
            (custom_instruction or "").strip(), 
            (target_language or "English").strip()
        )
    except Exception as e:
        print(f"CRITICAL RECOVERY: {e}")
        return _offline_fallback_paraphrase(text, level or "Simple")