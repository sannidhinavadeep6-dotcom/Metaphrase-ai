import io
from google import genai
from google.genai import types
from utils.config import get_gemini_api_key

_client = None

def get_client():
    global _client
    if _client is None:
        api_key = get_gemini_api_key()
        _client = genai.Client(api_key=api_key)
    return _client

def extract_text_from_image(image_bytes: bytes, mime_type: str = "image/png") -> str:
    """
    Extracts high-precision text from images, textbook photos, screenshots, or scanned notes
    using Gemini Vision multimodal capabilities with automatic fallback to pytesseract.
    """
    if not image_bytes:
        return ""

    # 1. Primary: Gemini 3.5 Flash Multimodal OCR
    try:
        client = get_client()
        image_part = types.Part.from_bytes(data=image_bytes, mime_type=mime_type)
        prompt = (
            "Extract all text from this image with high precision. "
            "Maintain original layout, paragraph breaks, and bullet points where applicable. "
            "Output ONLY the extracted raw text without any commentary or headers."
        )

        response = client.models.generate_content(
            model="gemini-3.5-flash",
            contents=[prompt, image_part],
            config={
                "temperature": 0.1,
                "top_p": 0.95
            }
        )
        if response and response.text:
            cleaned = response.text.strip()
            if cleaned:
                return cleaned
    except Exception as e:
        print(f"[OCR] Gemini Vision OCR failed: {e}. Trying pytesseract fallback...")

    # 2. Secondary Fallback: pytesseract + PIL
    try:
        import pytesseract
        from PIL import Image

        image = Image.open(io.BytesIO(image_bytes))
        extracted = pytesseract.image_to_string(image)
        if extracted and extracted.strip():
            return extracted.strip()
    except Exception as e:
        print(f"[OCR] Pytesseract fallback failed: {e}")

    raise RuntimeError("Failed to extract text from image. Please ensure the image is clear and contains readable text.")
