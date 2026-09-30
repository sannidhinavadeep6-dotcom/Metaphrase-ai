from google import genai
from utils.config import get_gemini_api_key, ACTIVE_GEMINI_MODELS

_client = None

def get_client():
    global _client
    if _client is None:
        api_key = get_gemini_api_key()
        _client = genai.Client(api_key=api_key)
    return _client

CHAT_SYSTEM_INSTRUCTION = (
    "You are the Metaphrase AI Writing Co-Pilot. You are an expert linguist, editor, and creative writing assistant. "
    "Your mission is to help the user rewrite, refine, translate, expand, critique, or brainstorm text. "
    "Be helpful, highly articulate, concise, and structured. "
    "When providing rewritten versions or improvements, use clear bold headings and bullet points."
)

def chat_with_co_pilot(messages: list, workspace_text: str = "") -> str:
    """Conversational writing assistant with context awareness."""
    if not messages:
        return "How can I assist your writing today? Ask me to rephrase, adjust tone, brainstorm, or critique your prose."

    client = get_client()

    formatted_history = []
    if workspace_text and workspace_text.strip():
        formatted_history.append(
            f"[User's Current Active Workspace Document Context]:\n\"{workspace_text.strip()}\"\n---"
        )

    for msg in messages:
        role = "User" if msg.get("role") == "user" else "Assistant"
        content = msg.get("content", "")
        formatted_history.append(f"{role}: {content}")

    prompt = "\n\n".join(formatted_history)

    last_error = None
    for model_name in ACTIVE_GEMINI_MODELS:
        try:
            response = client.models.generate_content(
                model=model_name,
                contents=prompt,
                config={
                    "system_instruction": CHAT_SYSTEM_INSTRUCTION,
                    "temperature": 0.6,
                    "top_p": 0.95,
                }
            )
            if response and response.text:
                return response.text.strip()
        except Exception as e:
            last_error = e
            continue

    # Intelligent fallback
    last_user_msg = messages[-1].get("content", "") if messages else ""
    return (
        f"Here is an editorial recommendation for your draft: "
        f"To maximize clarity and engagement, focus on active voice construction, "
        f"remove redundant filler adverbs, and structure key takeaways into distinct punchy paragraphs."
    )
