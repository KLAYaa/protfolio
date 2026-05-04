from flask import Flask, render_template, jsonify, request, send_from_directory
from datetime import datetime
import os
import re

app = Flask(__name__)


ABOUT = {
    # ── Personal Info ──────────────────────────────────────────
    "name":       "Laya k",          # ← your name
    "bio":        "I am a fresher passionate about building web applications and solving real-world problems through code. Currently looking for internship and full-time opportunities.",
    "email":      "layak2296@gmail.com",           # ← your email
    "phone":      "+91 9392954480",          # ← your phone (or "")
    "location":   "Bengaluru, India",        # ← your city

    # ── Education ──────────────────────────────────────────────
    "college":    "Sree Vidyanikethan Engineering College",       # ← college
    "degree":     "B.E. Computer Science (Data Science)",   # ← degree
    "grad_year":  "2025",                    # ← graduation year
    "cgpa":       "8.42",                     # ← CGPA (or "")

    # ── What you are looking for ───────────────────────────────
    "looking_for": "Internship & Full-time Opportunities",

    # ── Social Links ───────────────────────────────────────────
    "github":    "https://github.com//KLAYaa",
    "linkedin":  "https://linkedin.com/in/k-laya-028707271",
    "twitter":   "",   # ← optional, leave "" if none
    "dribbble":  "",   # ← optional, leave "" if none

    # ── Stats shown on About section ───────────────────────────
    "stats": {
        "projects":   2,   
        "experience": 0,   
        "clients":    0,   
    },

    "resume_file": "resume.pdf",
}


PROJECTS = [
    {
        "id": 1,
        "title": "Predication of Chornic Kidney",
        "description": "Developed a VGG-based deep learning model to predict Chronic Kidney Disease, achieving 93% accuracy in classifying patient data for early diagnosis and decision support.",
        "tags": ["Python", "Deep Learning", "CNN", "VGG16", "TensorFlow", "Keras", "NumPy", "Image Processing"],
        "emoji": "🫁",
        "color": "linear-gradient(135deg, #1a0a2e 0%, #16213e 100%)",
        "link": "https://github.com/yourusername/project1", 
        "year": 2025,
        "featured": True,   # ← True = shown big at top
    },
    {
        "id": 2,
        "title": "E-Learning",
        "description": "An interactive web-based E-Learning quiz app with 9 lesson pages built using HTML, CSS, and JavaScript.",
        "tags": ["HTML","CSS","JAVASCRIPT"],
        "emoji": "💡",
        "color": "linear-gradient(135deg, #0a2015 0%, #0f3020 100%)",
        "link": "https://github.com/KLAYaa/E-Learning",
        "year": 2024,
        "featured": True,
    },
    # {
    #     "id": 3,
    #     "title": "Project Three Name",
    #     "description": "Write what this project does, what problem it solves, and what you built.",
    #     "tags": ["HTML", "CSS", "JavaScript"],
    #     "emoji": "🌐",
    #     "color": "linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 100%)",
    #     "link": "#",
    #     "year": 2023,
    #     "featured": False,
    # },
]


SKILLS = [
    {"name": "Python",       "icon": "🐍", "level": 75, "label": "Intermediate"},
    {"name": "HTML / CSS",   "icon": "🎨", "level": 80, "label": "Intermediate"},
    {"name": "JavaScript",   "icon": "🟨", "level": 65, "label": "Beginner"},
    {"name": "MySQL",        "icon": "🗄️", "level": 70, "label": "Intermediate"},
]


CERTIFICATIONS = [
    {"name": "Full Stack Web Development",   "issuer": "Next24tech Technology and Services",     "year": "2024"},
    {"name": "Data Science Foundations",  "issuer": "Great Learning", "year": "2024"},
    # ── Add more or clear this list ────────────────────────────
]

MESSAGES = []


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/api/about")
def get_about():
    data = dict(ABOUT)
    data["has_resume"] = bool(ABOUT.get("resume_file"))
    return jsonify(data)


@app.route("/api/projects")
def get_projects():
    sorted_projects = sorted(PROJECTS, key=lambda p: (not p["featured"], -p["year"]))
    return jsonify({"projects": sorted_projects, "total": len(sorted_projects)})


@app.route("/api/skills")
def get_skills():
    sorted_skills = sorted(SKILLS, key=lambda s: -s["level"])
    return jsonify({"skills": sorted_skills})


@app.route("/api/certifications")
def get_certifications():
    return jsonify({"certifications": CERTIFICATIONS})


@app.route("/resume")
def download_resume():
    filename = ABOUT.get("resume_file", "")
    if not filename:
        return jsonify({"error": "Resume not available"}), 404
    static_dir = os.path.join(app.root_path, "static")
    filepath = os.path.join(static_dir, filename)
    if not os.path.exists(filepath):
        return jsonify({"error": f"File '{filename}' not found in static/ folder"}), 404
    return send_from_directory(static_dir, filename, as_attachment=True)


@app.route("/api/contact", methods=["POST"])
def contact():
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Invalid JSON"}), 400

    name    = (data.get("name")    or "").strip()
    email   = (data.get("email")   or "").strip()
    message = (data.get("message") or "").strip()

    errors = []
    if not name or len(name) < 2:
        errors.append("Name must be at least 2 characters.")
    if not re.match(r"^[^@\s]+@[^@\s]+\.[^@\s]+$", email):
        errors.append("Please provide a valid email address.")
    if not message or len(message) < 10:
        errors.append("Message must be at least 10 characters.")
    if errors:
        return jsonify({"error": "; ".join(errors)}), 422

    entry = {
        "id": len(MESSAGES) + 1,
        "name": name,
        "email": email,
        "message": message,
        "received_at": datetime.utcnow().isoformat() + "Z",
    }
    MESSAGES.append(entry)
    print(f"\n📬  New message from {name} <{email}>:\n{message}\n")

    return jsonify({
        "success": True,
        "message": f"Thanks {name}! I'll get back to you soon. ✦",
    })


@app.route("/api/messages")
def get_messages():
    return jsonify({"messages": MESSAGES, "total": len(MESSAGES)})


if __name__ == "__main__":
    print("🚀  Portfolio running at http://localhost:5000")
    app.run(debug=True, host="0.0.0.0", port=5000)
