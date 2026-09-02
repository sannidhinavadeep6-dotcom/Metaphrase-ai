import pytest
from utils.text_metrics import (
    get_detailed_metrics, 
    calculate_reading_time, 
    calculate_lexical_diversity
)

def test_reading_time_calculation():
    assert calculate_reading_time("") == "0 sec"
    # 200 words should be ~60 seconds / 1 min
    text_100_words = "word " * 100
    res = calculate_reading_time(text_100_words)
    assert res == "30s"

def test_lexical_diversity():
    assert calculate_lexical_diversity("") == 0.0
    all_unique = "the quick brown fox jumps"
    assert calculate_lexical_diversity(all_unique) == 100.0
    half_unique = "hello hello world world"
    assert calculate_lexical_diversity(half_unique) == 50.0

def test_detailed_metrics_structure():
    orig = "The artificial intelligence system optimizes computational throughput."
    para = "AI boosts computer speed."
    
    metrics = get_detailed_metrics(orig, para)
    assert "summary" in metrics
    assert "table_data" in metrics
    
    summary = metrics["summary"]
    assert "ease_orig" in summary
    assert "ease_para" in summary
    assert "word_count_orig" in summary
    assert "word_count_para" in summary
    assert summary["word_count_orig"] == 7
    assert summary["word_count_para"] == 4
    assert len(metrics["table_data"]) == 7

def test_flesch_reading_ease_scale():
    simple_text = "The dog ran. It was a good dog. The sun was hot."
    complex_text = "The multidimensional algorithmic paradigm necessitates rigorous computational validation."
    
    metrics = get_detailed_metrics(complex_text, simple_text)
    # Simple text should have a higher Flesch Reading Ease score than complex text
    assert metrics["summary"]["ease_para"] > metrics["summary"]["ease_orig"]
