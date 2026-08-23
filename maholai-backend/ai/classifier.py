"""Keyword fallback NLP classifier. Claude remains the primary analyzer."""

CATEGORY_KEYWORDS = {
    "Water": ["water", "pani", "leak", "pipeline", "drainage", "sewer", "naala", "khara"],
    "Infrastructure": ["road", "pothole", "bridge", "streetlight", "footpath", "sarak"],
    "Environment": ["garbage", "kooda", "pollution", "sewage", "sanitation", "trash"],
    "Electricity": ["electric", "bijli", "pole", "transformer", "load shedding", "wire"],
    "Education": ["school", "teacher", "college", "university"],
    "Healthcare": ["hospital", "medicine", "clinic", "doctor"],
    "Transport": ["bus", "traffic", "transport"],
}

SAFETY_KEYWORDS = [
    "fire", "explosion", "collapse", "electrocute", "open wire", "child",
    "accident", "flood", "sewage overflow", "danger",
]


def classify_text(title: str, description: str) -> dict:
    text = f"{title} {description}".lower()
    scores = {}
    for category, words in CATEGORY_KEYWORDS.items():
        scores[category] = sum(1 for w in words if w in text)
    best = max(scores, key=scores.get) if scores else "Other"
    total = sum(scores.values()) or 1
    confidence = round(min(0.99, 0.45 + scores.get(best, 0) / total * 0.5), 2)
    if scores.get(best, 0) == 0:
        best, confidence = "Other", 0.4
    safety = any(k in text for k in SAFETY_KEYWORDS)
    return {
        "ai_category": best,
        "ai_confidence": confidence,
        "safety_risk": safety,
    }
