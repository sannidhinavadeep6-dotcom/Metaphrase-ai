import re
from datetime import datetime

def get_ngrams(tokens: list, n: int = 3) -> set:
    """Generates a set of n-grams from a list of words."""
    if len(tokens) < n:
        return set()
    return set(tuple(tokens[i:i+n]) for i in range(len(tokens) - n + 1))

def calculate_originality_score(original_text: str, transformed_text: str) -> dict:
    """
    Evaluates phrase uniqueness, n-gram divergence, and syntactic independence
    between the original and transformed texts to generate an Originality Index (0-100%).
    """
    orig_clean = (original_text or "").strip().lower()
    trans_clean = (transformed_text or "").strip().lower()

    if not orig_clean or not trans_clean:
        return {
            "originality_score": 100,
            "similarity_score": 0,
            "ngram_overlap_pct": 0.0,
            "jaccard_index": 0.0,
            "verdict": "Unique Content"
        }

    orig_words = re.findall(r'\b\w+\b', orig_clean)
    trans_words = re.findall(r'\b\w+\b', trans_clean)

    if not orig_words or not trans_words:
        return {
            "originality_score": 100,
            "similarity_score": 0,
            "ngram_overlap_pct": 0.0,
            "jaccard_index": 0.0,
            "verdict": "Unique Content"
        }

    # 1. Jaccard similarity on word sets
    set_orig = set(orig_words)
    set_trans = set(trans_words)
    intersection = set_orig.intersection(set_trans)
    union = set_orig.union(set_trans)
    jaccard = len(intersection) / len(union) if union else 0.0

    # 2. 3-gram overlap percentage
    orig_3grams = get_ngrams(orig_words, 3)
    trans_3grams = get_ngrams(trans_words, 3)
    
    if trans_3grams:
        ngram_overlap = len(orig_3grams.intersection(trans_3grams)) / len(trans_3grams)
    else:
        ngram_overlap = jaccard

    # 3. Originality index calculation
    # High n-gram overlap indicates copy-paste / superficial spinning
    similarity_score = min(100, max(0, int((ngram_overlap * 70 + jaccard * 30) * 100)))
    originality_score = 100 - similarity_score

    if originality_score >= 75:
        verdict = "Highly Original & Syntactically Independent"
    elif originality_score >= 45:
        verdict = "Moderate Paraphrase (Good Variation)"
    else:
        verdict = "High Similarity (Surface-level Rewrite)"

    return {
        "originality_score": originality_score,
        "similarity_score": similarity_score,
        "ngram_overlap_pct": round(ngram_overlap * 100, 1),
        "jaccard_index": round(jaccard * 100, 1),
        "verdict": verdict
    }

def generate_citations(title: str, author: str = "", year: str = "", source_url: str = "") -> dict:
    """
    Generates standardized academic citations across APA 7th, MLA 9th, Chicago, and Harvard formats.
    """
    curr_year = str(year).strip() or str(datetime.now().year)
    clean_title = (title or "Untitled Document").strip()
    clean_author = (author or "Metaphrase AI User").strip()
    clean_source = (source_url or "Metaphrase AI Transformation Engine").strip()

    # Format author (Lastname, First Initial.)
    parts = clean_author.split()
    if len(parts) >= 2:
        author_apa = f"{parts[-1]}, {parts[0][0]}."
    else:
        author_apa = clean_author

    apa = f"{author_apa} ({curr_year}). {clean_title}. {clean_source}."
    mla = f"{clean_author}. \"{clean_title}.\" {clean_source}, {curr_year}."
    chicago = f"{clean_author}. \"{clean_title}.\" {clean_source} ({curr_year})."
    harvard = f"{clean_author} ({curr_year}) '{clean_title}', {clean_source}."

    return {
        "apa": apa,
        "mla": mla,
        "chicago": chicago,
        "harvard": harvard
    }
