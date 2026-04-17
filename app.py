from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

SLOT_TIMING = {"A1": [["MON", "08:00"], ["WED", "09:00"]], "F1": [["MON", "09:00"], ["WED", "10:00"]], "D1": [["MON", "10:00"], ["THU", "08:00"]], "TB1": [["MON", "11:00"]], "TG1": [["MON", "12:00"]], "A2": [["MON", "14:00"], ["WED", "15:00"]], "F2": [["MON", "15:00"], ["WED", "16:00"]], "D2": [["MON", "16:00"], ["THU", "14:00"]], "TB2": [["MON", "17:00"]], "TG2": [["MON", "18:00"]], "V3": [["MON", "19:01"]], "L1": [["MON", "08:00"]], "L2": [["MON", "08:51"]], "L3": [["MON", "09:51"]], "L4": [["MON", "10:41"]], "L5": [["MON", "11:40"]], "L6": [["MON", "12:31"]], "L31": [["MON", "14:00"]], "L32": [["MON", "14:51"]], "L33": [["MON", "15:51"]], "L34": [["MON", "16:41"]], "L35": [["MON", "17:40"]], "L36": [["MON", "18:31"]], "B1": [["TUE", "08:00"], ["THU", "09:00"]], "G1": [["TUE", "09:00"], ["THU", "10:00"]], "E1": [["TUE", "10:00"], ["FRI", "08:00"]], "TC1": [["TUE", "11:00"]], "TAA1": [["TUE", "12:00"]], "B2": [["TUE", "14:00"], ["THU", "15:00"]], "G2": [["TUE", "15:00"], ["THU", "16:00"]], "E2": [["TUE", "16:00"], ["FRI", "14:00"]], "TC2": [["TUE", "17:00"]], "TAA2": [["TUE", "18:00"]], "V4": [["TUE", "19:01"]], "L7": [["TUE", "08:00"]], "L8": [["TUE", "08:51"]], "L9": [["TUE", "09:51"]], "L10": [["TUE", "10:41"]], "L11": [["TUE", "11:40"]], "L12": [["TUE", "12:31"]], "L37": [["TUE", "14:00"]], "L38": [["TUE", "14:51"]], "L39": [["TUE", "15:51"]], "L40": [["TUE", "16:41"]], "L41": [["TUE", "17:40"]], "L42": [["TUE", "18:31"]], "C1": [["WED", "08:00"], ["FRI", "09:00"]], "V1": [["WED", "11:00"]], "V2": [["WED", "12:00"]], "C2": [["WED", "14:00"], ["FRI", "15:00"]], "TD2": [["WED", "17:00"]], "TBB2": [["WED", "18:00"]], "V5": [["WED", "19:01"]], "L13": [["WED", "08:00"]], "L14": [["WED", "08:51"]], "L15": [["WED", "09:51"]], "L16": [["WED", "10:41"]], "L17": [["WED", "11:40"]], "L18": [["WED", "12:31"]], "L43": [["WED", "14:00"]], "L44": [["WED", "14:51"]], "L45": [["WED", "15:51"]], "L46": [["WED", "16:41"]], "L47": [["WED", "17:40"]], "L48": [["WED", "18:31"]], "TE1": [["THU", "11:00"]], "TCC1": [["THU", "12:00"]], "TE2": [["THU", "17:00"]], "TCC2": [["THU", "18:00"]], "V6": [["THU", "19:01"]], "L19": [["THU", "08:00"]], "L20": [["THU", "08:51"]], "L21": [["THU", "09:51"]], "L22": [["THU", "10:41"]], "L23": [["THU", "11:40"]], "L24": [["THU", "12:31"]], "L49": [["THU", "14:00"]], "L50": [["THU", "14:51"]], "L51": [["THU", "15:51"]], "L52": [["THU", "16:41"]], "L53": [["THU", "17:40"]], "L54": [["THU", "18:31"]], "TA1": [["FRI", "10:00"]], "TF1": [["FRI", "11:00"]], "TD1": [["FRI", "12:00"]], "TA2": [["FRI", "16:00"]], "TF2": [["FRI", "17:00"]], "TDD2": [["FRI", "18:00"]], "V7": [["FRI", "19:01"]], "L25": [["FRI", "08:00"]], "L26": [["FRI", "08:51"]], "L27": [["FRI", "09:51"]], "L28": [["FRI", "10:41"]], "L29": [["FRI", "11:40"]], "L30": [["FRI", "12:31"]], "L55": [["FRI", "14:00"]], "L56": [["FRI", "14:51"]], "L57": [["FRI", "15:51"]], "L58": [["FRI", "16:41"]], "L59": [["FRI", "17:40"]], "L60": [["FRI", "18:31"]]}


def slots_clash(slot1, slot2):
    t1 = set()
    for s in slot1.split('+'):
        s = s.strip()
        if s in SLOT_TIMING:
            t1.update(map(tuple, SLOT_TIMING[s]))
    t2 = set()
    for s in slot2.split('+'):
        s = s.strip()
        if s in SLOT_TIMING:
            t2.update(map(tuple, SLOT_TIMING[s]))
    return len(t1 & t2) > 0


def backtrack(courses, index, assigned_slots, current_assignment, steps):
    if index == len(courses):
        solved_nodes = [dict(n, state="solved") if n.get("state") != "fail" else n for n in steps[-1]["nodes"]] if steps else []
        steps.append({"label": "✓ Solution found!", "nodes": solved_nodes})
        return current_assignment[:]

    course = courses[index]

    for oi, option in enumerate(course["options"]):
        slot = option.get("slot", "")
        node_id = f"{index}-{oi}"
        parent_id = f"{index-1}-chosen" if index > 0 else None

        invalid = False
        parts = []
        for s in slot.split('+'):
            s = s.strip()
            if s: 
                parts.append(s)
                if s not in SLOT_TIMING:
                    invalid = True
        
        if not parts or invalid:
            prev_nodes = steps[-1]["nodes"] if steps else []
            steps.append({
                "label": f"✗ {course['name']} → Invalid Slot: {slot}",
                "nodes": prev_nodes + [{
                    "id": node_id, "course": course["name"],
                    "slot": slot, "state": "fail", "parent": parent_id
                }]
            })
            continue

        clash_with = next((t for t in assigned_slots if slots_clash(slot, t)), None)

        if clash_with:
            prev_nodes = steps[-1]["nodes"] if steps else []
            steps.append({
                "label": f"✗ {course['name']} → {slot} clashes with {clash_with}",
                "nodes": prev_nodes + [{
                    "id": node_id, "course": course["name"],
                    "slot": slot, "state": "fail", "parent": parent_id
                }]
            })
            continue

        prev_nodes = steps[-1]["nodes"] if steps else []
        updated_prev = []
        for n in prev_nodes:
            if n["state"] == "active":
                updated_prev.append(dict(n, state="done", id=f"{n['id'].split('-')[0]}-chosen"))
            else:
                updated_prev.append(n)

        steps.append({
            "label": f"Try {course['name']} → {option['faculty']} [{slot}]",
            "nodes": updated_prev + [{
                "id": node_id, "course": course["name"],
                "slot": slot, "state": "active", "parent": parent_id
            }]
        })

        current_assignment.append({
            "course": course["name"],
            "faculty": option["faculty"],
            "slot": slot,
            "timings": [t for s in slot.split('+') if s.strip() in SLOT_TIMING for t in SLOT_TIMING[s.strip()]]
        })
        assigned_slots.add(slot)

        result = backtrack(courses, index + 1, assigned_slots, current_assignment, steps)
        if result is not None:
            return result

        current_assignment.pop()
        assigned_slots.remove(slot)

        prev_nodes = steps[-1]["nodes"] if steps else []
        steps.append({
            "label": f"↩ Backtrack from {course['name']} [{slot}]",
            "nodes": [n for n in prev_nodes if n["id"] != node_id and n["id"] != f"{index}-chosen"]
        })

    return None


@app.route("/generate", methods=["POST"])
def generate_timetable():
    data = request.json
    courses = data.get("courses", [])
    if not courses:
        return jsonify({"error": "No courses provided"}), 400

    steps = []
    result = backtrack(courses, 0, set(), [], steps)

    if result is None:
        return jsonify({"success": False, "message": "No valid timetable exists! Try different faculty options.", "steps": steps})

    return jsonify({"success": True, "assignment": result, "steps": steps})


@app.route("/slots", methods=["GET"])
def get_slots():
    return jsonify({
        "theory_slots": [s for s in SLOT_TIMING if not s.startswith("L")],
        "lab_slots":    [s for s in SLOT_TIMING if s.startswith("L")],
        "all_slots":    list(SLOT_TIMING.keys())
    })


@app.route("/check-clash", methods=["POST"])
def check_clash():
    data = request.json
    return jsonify({"clash": slots_clash(data.get("slot1"), data.get("slot2"))})


if __name__ == "__main__":
    print("🎓 FFCS Timetable Generator Backend")
    print("📡 Running on http://localhost:8080")
    app.run(debug=True, port=8080)
