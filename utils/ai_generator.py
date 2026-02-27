# ...existing code...
import os
from google import genai
from dotenv import load_dotenv

load_dotenv()

# Modern 2026 SDK Client initialization
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
for model in client.models.list():
    print(f"✅ Found Model: {model.name}")
PROMPTS = {
    "Simple": "Rewrite for a middle school student. Keep meaning identical. Text: ",
    "Moderate": "Paraphrase for a high school level. Keep meaning identical. Text: ",
    "Advanced": "Rewrite in an academic, professional tone. Keep meaning identical. Text: "
}

def generate_paraphrase(text: str, level: str) -> str:
    if not text.strip():
        return ""
    try:
        # Use 'gemini-3-flash', the 2026 production standard
        # Using 'gemini-1.5-flash' or 'gemini-pro' will keep giving 404 errors
        response = client.models.generate_content(
            model="gemini-3-flash-preview", 
            contents=f"Paraphrase this at a {level} level: {text}"
        )
        return response.text.strip()
    except Exception as e:
        print(f"CRITICAL API ERROR: {e}")
        return "SERVICE_ERROR"
# ...existing code...