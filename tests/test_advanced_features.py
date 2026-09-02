import pytest
from utils.ai_detector import analyze_ai_probability, AI_MARKER_TERMS
from utils.originality import calculate_originality_score, generate_citations

def test_ai_detection_human_vs_synthetic():
    human_text = "I went down to the store yesterday. It was raining hard, so I ran quickly! Then my friend called me."
    synthetic_text = "Furthermore, it is important to note that the multidimensional tapestry of operational excellence underscores a crucial role in modern frameworks. Moreover, in conclusion, this paradigm revolutionizes efficiency."

    human_res = analyze_ai_probability(human_text)
    synthetic_res = analyze_ai_probability(synthetic_text)

    assert human_res["ai_probability"] < 40
    assert synthetic_res["ai_probability"] > 40
    assert len(synthetic_res["markers_found"]) > 0

def test_originality_index_scoring():
    orig = "The microservices architecture employs asynchronous event-driven message queuing."
    identical = "The microservices architecture employs asynchronous event-driven message queuing."
    paraphrased = "By utilizing decoupled messaging pipelines, distributed services communicate asynchronously without strict dependencies."

    res_ident = calculate_originality_score(orig, identical)
    res_para = calculate_originality_score(orig, paraphrased)

    # Identical text should have low originality score
    assert res_ident["originality_score"] < 20
    # Paraphrased text should have high originality score
    assert res_para["originality_score"] > 60

def test_citation_generation_formats():
    citations = generate_citations(
        title="Deep Learning Frameworks",
        author="Nilesh Hake",
        year="2026",
        source_url="Metaphrase AI Engine"
    )

    assert "apa" in citations
    assert "mla" in citations
    assert "chicago" in citations
    assert "harvard" in citations

    assert "Hake, N." in citations["apa"]
    assert "(2026)" in citations["apa"]
    assert "Nilesh Hake" in citations["mla"]
