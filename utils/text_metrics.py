import textstat

def get_readability_scores(original_text: str, paraphrased_text: str) -> dict:
    orig_ease = textstat.flesch_reading_ease(original_text)
    new_ease = textstat.flesch_reading_ease(paraphrased_text)
    
    orig_grade = textstat.text_standard(original_text)
    new_grade = textstat.text_standard(paraphrased_text)
    
    return {
        "Metric": ["Flesch Reading Ease (Higher = Easier)", "Estimated School Grade Level"],
        "Original Text": [f"{orig_ease}", orig_grade],
        "Paraphrased Text": [f"{new_ease}", new_grade]
    }