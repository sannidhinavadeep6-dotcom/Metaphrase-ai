import io
import re
from typing import List, Tuple
import docx
import pypdf

def extract_text_from_pdf(content: bytes) -> str:
    """Extract text from a PDF byte stream with page aggregation."""
    reader = pypdf.PdfReader(io.BytesIO(content))
    extracted_pages = []
    for idx, page in enumerate(reader.pages):
        page_text = page.extract_text()
        if page_text and page_text.strip():
            extracted_pages.append(page_text.strip())
    
    if not extracted_pages:
        raise ValueError("The PDF document does not contain any extractable text (it might be a scanned image-only PDF).")
    
    return "\n\n".join(extracted_pages)

def extract_text_from_docx(content: bytes) -> str:
    """Extract text from a Word .docx byte stream."""
    doc = docx.Document(io.BytesIO(content))
    paragraphs = []
    for p in doc.paragraphs:
        if p.text.strip():
            paragraphs.append(p.text.strip())
            
    # Also parse tables if any
    for table in doc.tables:
        for row in table.rows:
            row_text = " | ".join(cell.text.strip() for cell in row.cells if cell.text.strip())
            if row_text:
                paragraphs.append(row_text)
                
    if not paragraphs:
        raise ValueError("The Word document is empty or does not contain extractable paragraphs.")
    return "\n\n".join(paragraphs)

def extract_text_from_plain(content: bytes) -> str:
    """Extract text from text-based formats with automatic encoding detection."""
    encodings = ["utf-8", "utf-8-sig", "latin-1", "cp1252", "iso-8859-1"]
    text = None
    for enc in encodings:
        try:
            text = content.decode(enc)
            break
        except (UnicodeDecodeError, Exception):
            continue
            
    if text is None:
        text = content.decode("utf-8", errors="ignore")
        
    # Strip basic RTF tags if it's an RTF document
    if text.startswith("{\\rtf"):
        # Remove RTF control sequences
        text = re.sub(r'\\[a-z0-9\-]+ ?', ' ', text)
        text = re.sub(r'[{}\\]', ' ', text)
        text = re.sub(r'\s+', ' ', text).strip()
        
    return text.strip()

def parse_document_file(filename: str, content: bytes) -> Tuple[str, List[str]]:
    """
    Parse any document format (PDF, DOCX, DOC, TXT, MD, RTF, CSV, etc.).
    Returns (full_text, list_of_paragraphs).
    """
    ext = filename.lower().split(".")[-1] if "." in filename else "txt"
    
    if ext == "pdf":
        full_text = extract_text_from_pdf(content)
    elif ext in ["docx", "doc"]:
        try:
            full_text = extract_text_from_docx(content)
        except Exception:
            # Fallback to plain text decode
            full_text = extract_text_from_plain(content)
    else:
        full_text = extract_text_from_plain(content)
        
    if not full_text or not full_text.strip():
        raise ValueError(f"No readable text could be extracted from '{filename}'.")
        
    # Clean & normalize paragraphs
    raw_paras = re.split(r'\n{2,}|\r\n{2,}', full_text)
    clean_paragraphs = []
    for p in raw_paras:
        cleaned = " ".join(p.strip().split())
        if cleaned:
            clean_paragraphs.append(cleaned)
            
    if not clean_paragraphs:
        clean_paragraphs = [full_text.strip()]
        
    return full_text.strip(), clean_paragraphs
