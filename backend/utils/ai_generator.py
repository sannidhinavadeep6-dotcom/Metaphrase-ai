import os
import functools
from google import genai
from utils.config import get_gemini_api_key, ACTIVE_GEMINI_MODELS

_client = None

def get_client():
    global _client
    if _client is None:
        api_key = get_gemini_api_key()
        _client = genai.Client(api_key=api_key)
    return _client

# Multi-tier candidate models with self-healing failover (stable, high-speed first)
CANDIDATE_MODELS = ACTIVE_GEMINI_MODELS

TONE_PROFILES = {
    "Simple": {
        "label": "Simple & Clear",
        "icon": "book-open",
        "description": "Plain everyday language, short sentences, and maximum clarity.",
        "instruction": (
            "Comprehensively paraphrase and rephrase this text using simple, clear, everyday vocabulary "
            "and active sentence structures. Actively replace formal phrasing, shorten complex clauses, and "
            "reword sentences with direct clarity while preserving 100% of the core meaning."
        )
    },
    "Fluent": {
        "label": "Natural & Fluent",
        "icon": "sparkles",
        "description": "Polished, engaging, and articulate for general readers.",
        "instruction": (
            "Paraphrase this text with natural rhythm, expressive vocabulary, and varied sentence architecture. "
            "Actively rephrase idioms, enhance flow, and restructure sentences for seamless readability."
        )
    },
    "Academic": {
        "label": "Academic & Formal",
        "icon": "graduation-cap",
        "description": "Scholarly vocabulary, rigorous syntax, and academic depth.",
        "instruction": (
            "Rewrite this text into formal, scholarly academic prose. Use precise analytical terminology, "
            "objective third-person formulations, and rigorous syntactic variation."
        )
    },
    "Executive": {
        "label": "Executive & Concise",
        "icon": "briefcase",
        "description": "Authoritative, punchy, and boardroom-ready business prose.",
        "instruction": (
            "Transform this text for senior executive communication: direct, authoritative, high-impact, "
            "and concise, distilling key messages without fluff."
        )
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
    "Your objective is to thoroughly paraphrase or translate the user's input according to the requested style, custom instructions, and target language. "
    "CRITICAL RULES:\n"
    "1. You MUST actively paraphrase, rewrite sentences, and vary vocabulary — never return the original text verbatim.\n"
    "2. Output ONLY the rewritten text without commentary, pleasantries, markdown titles, quotation marks, or meta-labels.\n"
    "3. Maintain 100% factual accuracy and core intent.\n"
    "4. Preserve formatting, lists, line breaks, and paragraph boundaries.\n"
    "5. If a non-English target language is specified, translate fluently with native phrasing."
)

def _offline_fallback_paraphrase(text: str, level_or_tone: str = "Simple") -> str:
    """Comprehensive rule-based linguistic transformation used when cloud APIs are temporarily unreachable."""
    replacements = {
        "utilize": "use", "facilitate": "enable", "leverage": "apply", "demonstrate": "show",
        "subsequently": "later", "approximately": "roughly", "furthermore": "in addition",
        "commence": "begin", "terminate": "conclude", "endeavor": "effort", "optimize": "streamline",
        "implement": "deploy", "ascertain": "confirm", "comprehend": "understand",
        "location": "based in", "join us": "become part of our team", "ensuring": "delivering",
        "consistent": "dependable", "deliver": "provide", "delivering": "providing",
        "support": "assistance", "transforming": "reshaping", "empowering": "equipping",
        "future": "next era", "manage": "oversee", "assistance": "help", "role": "position",
        "replace": "substitute", "opportunity": "chance", "create": "develop", "innovative": "novel"
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
                # Re-attach leading/trailing punctuation
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

    prompt = f"{instruction_text}{lang_clause}\n\nOriginal Text to Paraphrase:\n{text.strip()}"

    last_error = None
    for model_name in CANDIDATE_MODELS:
        try:
            response = client.models.generate_content(
                model=model_name,
                contents=prompt,
                config={
                    "system_instruction": SYSTEM_INSTRUCTION,
                    "temperature": 0.70,
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