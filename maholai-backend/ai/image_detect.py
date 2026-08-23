"""Lightweight image-class hint from filename/category. Replace with a CV model later."""

HINTS = {
    "pothole": ("Infrastructure", "Pothole", 0.82),
    "road": ("Infrastructure", "Road damage", 0.7),
    "garbage": ("Environment", "Garbage", 0.8),
    "trash": ("Environment", "Garbage", 0.78),
    "water": ("Water", "Water accumulation", 0.72),
    "drain": ("Water", "Drainage", 0.74),
    "sewer": ("Water", "Drainage", 0.76),
    "light": ("Infrastructure", "Broken streetlight", 0.68),
    "pole": ("Electricity", "Broken pole", 0.65),
}


def detect_from_filename(filename: str | None, category: str | None = None) -> dict:
    name = (filename or "").lower()
    for key, (cat, label, conf) in HINTS.items():
        if key in name:
            return {
                "image_class": label,
                "image_confidence": conf,
                "image_suggested_category": cat,
            }
    if category:
        return {
            "image_class": f"{category} evidence",
            "image_confidence": 0.45,
            "image_suggested_category": category,
        }
    return {
        "image_class": "Unclassified civic evidence",
        "image_confidence": 0.3,
        "image_suggested_category": None,
    }
