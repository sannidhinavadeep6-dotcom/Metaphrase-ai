import re
import textstat

def calculate_reading_time(text: str) -> str:
    """Estimates reading time assuming an average of 200 words per minute."""
    words = len(text.split())
    if words == 0:
        return "0 sec"
    seconds = max(1, round((words / 200) * 60))
    if seconds < 60:
        return f"{seconds}s"
    minutes = seconds // 60
    rem_sec = seconds % 60
    return f"{minutes}m {rem_sec}s" if rem_sec > 0 else f"{minutes}m"

def calculate_lexical_diversity(text: str) -> float:
    """Calculates Type-Token Ratio (unique words / total words)."""
    words = re.findall(r'\b\w+\b', text.lower())
    if not words:
        return 0.0
    return round((len(set(words)) / len(words)) * 100, 1)

def get_detailed_metrics(original_text: str, paraphrased_text: str) -> dict:
    """
    Returns rich linguistic and readability metrics for comparison.
    """
    orig_clean = (original_text or "").strip()
    para_clean = (paraphrased_text or "").strip()

    if not orig_clean or not para_clean:
        return {
            "summary": {},
            "table_data": []
        }

    # Calculations
    orig_words = len(orig_clean.split())
    para_words = len(para_clean.split())

    orig_chars = len(orig_clean)
    para_chars = len(para_clean)

    orig_ease = round(textstat.flesch_reading_ease(orig_clean), 1)
    para_ease = round(textstat.flesch_reading_ease(para_clean), 1)

    orig_grade = textstat.text_standard(orig_clean, float_output=False)
    para_grade = textstat.text_standard(para_clean, float_output=False)

    orig_fk = round(textstat.flesch_kincaid_grade(orig_clean), 1)
    para_fk = round(textstat.flesch_kincaid_grade(para_clean), 1)

    orig_fog = round(textstat.gunning_fog(orig_clean), 1)
    para_fog = round(textstat.gunning_fog(para_clean), 1)

    orig_syllables = textstat.syllable_count(orig_clean)
    para_syllables = textstat.syllable_count(para_clean)

    orig_diversity = calculate_lexical_diversity(orig_clean)
    para_diversity = calculate_lexical_diversity(para_clean)

    orig_read_time = calculate_reading_time(orig_clean)
    para_read_time = calculate_reading_time(para_clean)

    # Word count delta
    word_diff = para_words - orig_words
    ease_diff = round(para_ease - orig_ease, 1)

    summary = {
        "word_count_orig": orig_words,
        "word_count_para": para_words,
        "word_delta": f"{'+' if word_diff > 0 else ''}{word_diff} words",
        "ease_orig": orig_ease,
        "ease_para": para_ease,
        "ease_delta": f"{'+' if ease_diff > 0 else ''}{ease_diff} pts",
        "read_time_orig": orig_read_time,
        "read_time_para": para_read_time,
        "diversity_orig": f"{orig_diversity}%",
        "diversity_para": f"{para_diversity}%"
    }

    table_data = [
        {"Metric": "Flesch Reading Ease (0-100, higher = easier)", "Original Text": f"{orig_ease} / 100", "Paraphrased Text": f"{para_ease} / 100", "Impact": f"{'+' if ease_diff > 0 else ''}{ease_diff}"},
        {"Metric": "Reading Grade Level", "Original Text": str(orig_grade), "Paraphrased Text": str(para_grade), "Impact": "Adapted"},
        {"Metric": "Flesch-Kincaid Grade", "Original Text": f"Grade {orig_fk}", "Paraphrased Text": f"Grade {para_fk}", "Impact": f"{'+' if para_fk >= orig_fk else ''}{round(para_fk - orig_fk, 1)}"},
        {"Metric": "Gunning Fog Index", "Original Text": str(orig_fog), "Paraphrased Text": str(para_fog), "Impact": f"{'+' if para_fog >= orig_fog else ''}{round(para_fog - orig_fog, 1)}"},
        {"Metric": "Word & Character Count", "Original Text": f"{orig_words} w / {orig_chars} c", "Paraphrased Text": f"{para_words} w / {para_chars} c", "Impact": f"{'+' if word_diff > 0 else ''}{word_diff} words"},
        {"Metric": "Estimated Reading Time", "Original Text": orig_read_time, "Paraphrased Text": para_read_time, "Impact": "Fast"},
        {"Metric": "Vocabulary Diversity", "Original Text": f"{orig_diversity}%", "Paraphrased Text": f"{para_diversity}%", "Impact": f"{'+' if para_diversity >= orig_diversity else ''}{round(para_diversity - orig_diversity, 1)}%"}
    ]

    return {
        "summary": summary,
        "table_data": table_data
    }

# Backward-compatibility helper
def get_readability_scores(original_text: str, paraphrased_text: str) -> dict:
    data = get_detailed_metrics(original_text, paraphrased_text)
    table = data.get("table_data", [])
    return {
        "Metric": [row["Metric"] for row in table],
        "Original Text": [row["Original Text"] for row in table],
        "Paraphrased Text": [row["Paraphrased Text"] for row in table]
    }