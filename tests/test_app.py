import pytest
from app import app, slots_clash, backtrack, SLOT_TIMING

@pytest.fixture
def client():
    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client

def test_slots_clash_basic():
    # A1 vs F1 (No clash)
    assert slots_clash("A1", "F1") is False

    # A1 vs A1 (Clash)
    assert slots_clash("A1", "A1") is True

def test_slots_clash_composed_string():
    # A1+TAA1 vs A1 (Clash)
    assert slots_clash("A1+TAA1", "A1") is True

    # A1+TAA1 vs B1 (No clash)
    assert slots_clash("A1+TAA1", "B1") is False
    
    # L1+L2 vs L2 (Clash)
    assert slots_clash("L1+L2", "L2") is True
    
    # L1+L2 vs L3+L4 (No clash)
    assert slots_clash("L1+L2", "L3+L4") is False

def test_slots_clash_empty_invalid():
    # Empty slot strings
    assert slots_clash("", "") is False
    assert slots_clash("INVALID", "A1") is False
    # If both invalid, intersection of empty sets is empty
    assert slots_clash("INVALID", "ANOTHER_INVALID") is False

def test_backtrack_empty_courses():
    steps = []
    result = backtrack([], 0, set(), [], steps)
    assert result == []
    assert len(steps) == 1
    assert steps[0]["label"] == "✓ Solution found!"

def test_backtrack_invalid_slots():
    courses = [{
        "name": "Invalid Course",
        "options": [{"faculty": "Dr. X", "slot": "INVALID_SLOT"}]
    }]
    steps = []
    result = backtrack(courses, 0, set(), [], steps)
    assert result is None
    assert len(steps) > 0
    assert "Invalid Slot" in steps[-1]["label"]
    assert steps[-1]["nodes"][-1]["state"] == "fail"

def test_backtrack_impossible_timetable():
    # Forced clash
    courses = [
        {"name": "Course A", "options": [{"faculty": "Dr. A", "slot": "A1"}]},
        {"name": "Course B", "options": [{"faculty": "Dr. B", "slot": "A1"}]}
    ]
    steps = []
    result = backtrack(courses, 0, set(), [], steps)
    assert result is None
    assert any("clashes with" in step["label"] for step in steps)
    assert any(node["state"] == "fail" for step in steps for node in step["nodes"])

def test_backtrack_success_path():
    courses = [
        {"name": "Course A", "options": [{"faculty": "Dr. A", "slot": "A1"}, {"faculty": "Dr. A2", "slot": "B1"}]},
        {"name": "Course B", "options": [{"faculty": "Dr. B", "slot": "A1"}, {"faculty": "Dr. B2", "slot": "C1"}]}
    ]
    steps = []
    result = backtrack(courses, 0, set(), [], steps)
    assert result is not None
    assert len(result) == 2
    # The first option for A is A1, so B should backtrack and pick C1
    assert result[0]["slot"] == "A1"
    assert result[1]["slot"] == "C1"
    
    assert any(step["label"] == "✓ Solution found!" for step in steps)
    
def test_generate_endpoint_empty(client):
    res = client.post("/generate", json={"courses": []})
    assert res.status_code == 400
    assert "No courses provided" in res.get_json()["error"]

def test_generate_endpoint_success(client):
    payload = {
        "courses": [
            {"name": "Test Course", "options": [{"faculty": "Fac", "slot": "E1+E2"}]}
        ]
    }
    res = client.post("/generate", json=payload)
    assert res.status_code == 200
    data = res.get_json()
    assert data["success"] is True
    assert len(data["assignment"]) == 1
    assert data["assignment"][0]["slot"] == "E1+E2"

def test_generate_endpoint_fail(client):
    payload = {
        "courses": [
            {"name": "C1", "options": [{"faculty": "F", "slot": "D1"}]},
            {"name": "C2", "options": [{"faculty": "F", "slot": "D1"}]}
        ]
    }
    res = client.post("/generate", json=payload)
    assert res.status_code == 200 # App logic returns 200 for algorithm negative results
    data = res.get_json()
    assert data["success"] is False
    assert "No valid timetable exists" in data["message"]

def test_slots_endpoint(client):
    res = client.get("/slots")
    assert res.status_code == 200
    data = res.get_json()
    assert "theory_slots" in data
    assert "lab_slots" in data
    assert "A1" in data["theory_slots"]
    assert "L1" in data["lab_slots"]
