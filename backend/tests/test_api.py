import pytest
from fastapi.testclient import TestClient
from server import app
import database

client = TestClient(app)

def setup_module(module):
    database.init_db()

def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["security"] == "bcrypt-salted"

def test_tones_endpoint():
    response = client.get("/api/tones")
    assert response.status_code == 200
    tones = response.json().get("tones", {})
    assert "Simple" in tones
    assert "Fluent" in tones
    assert "Academic" in tones
    assert "Executive" in tones

def test_languages_endpoint():
    response = client.get("/api/languages")
    assert response.status_code == 200
    languages = response.json().get("languages", [])
    assert len(languages) > 5
    codes = [l["code"] for l in languages]
    assert "en" in codes
    assert "es" in codes
    assert "fr" in codes

def test_custom_personas_crud():
    email = "qa_persona_tester@example.com"
    
    # 1. Create persona
    create_res = client.post("/api/personas", json={
        "email": email,
        "title": "Marketing Pitch",
        "instruction": "Rewrite with dynamic energy and bold action verbs.",
        "icon": "sparkles"
    })
    assert create_res.status_code == 200
    persona_id = create_res.json()["persona_id"]
    
    # 2. Fetch personas
    get_res = client.get(f"/api/personas?email={email}")
    assert get_res.status_code == 200
    personas = get_res.json()["personas"]
    assert len(personas) == 1
    assert personas[0]["title"] == "Marketing Pitch"
    
    # 3. Delete persona
    del_res = client.delete(f"/api/personas/{persona_id}?email={email}")
    assert del_res.status_code == 200
    
    # 4. Confirm deletion
    get_after = client.get(f"/api/personas?email={email}")
    assert len(get_after.json()["personas"]) == 0

def test_metrics_endpoint():
    response = client.post("/api/metrics", json={
        "original_text": "A quick test sentence.",
        "paraphrased_text": "A fast test line."
    })
    assert response.status_code == 200
    data = response.json()
    assert "summary" in data
    assert "table_data" in data
