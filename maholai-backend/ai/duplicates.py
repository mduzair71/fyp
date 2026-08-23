"""Nearby + text + category duplicate candidates. Never auto-merge."""

import math
import re
from datetime import datetime, timedelta

STOPWORDS = {"the", "a", "an", "in", "on", "of", "and", "or", "hai", "mein", "ki", "ke"}


def _tokens(text: str) -> set:
    words = re.findall(r"[a-zA-Z0-9]+", (text or "").lower())
    return {w for w in words if len(w) > 2 and w not in STOPWORDS}


def _jaccard(a: set, b: set) -> float:
    if not a or not b:
        return 0.0
    return len(a & b) / len(a | b)


def _haversine_m(lat1, lon1, lat2, lon2) -> float | None:
    try:
        lat1, lon1, lat2, lon2 = map(float, (lat1, lon1, lat2, lon2))
    except (TypeError, ValueError):
        return None
    r = 6371000
    p1, p2 = math.radians(lat1), math.radians(lat2)
    dp = math.radians(lat2 - lat1)
    dl = math.radians(lon2 - lon1)
    h = math.sin(dp / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dl / 2) ** 2
    return 2 * r * math.asin(math.sqrt(h))


def similarity_score(new_issue: dict, existing: dict) -> float:
    score = 0.0
    if new_issue.get("category") and new_issue.get("category") == existing.get("category"):
        score += 0.28
    if new_issue.get("location_area") and new_issue.get("location_area") == existing.get("location_area"):
        score += 0.18
    text_sim = _jaccard(
        _tokens(f"{new_issue.get('title','')} {new_issue.get('description','')}"),
        _tokens(f"{existing.get('title','')} {existing.get('description','')}"),
    )
    score += text_sim * 0.42
    dist = _haversine_m(
        new_issue.get("location_latitude"),
        new_issue.get("location_longitude"),
        (existing.get("location") or {}).get("latitude") or existing.get("location_latitude"),
        (existing.get("location") or {}).get("longitude") or existing.get("location_longitude"),
    )
    if dist is not None:
        if dist <= 120:
            score += 0.22
        elif dist <= 350:
            score += 0.12
    return round(min(score, 1.0), 3)


def find_duplicate_candidates(issues: list, new_issue: dict, threshold: float = 0.58, limit: int = 5) -> list:
    ranked = []
    for issue in issues:
        sim = similarity_score(new_issue, issue)
        if sim >= threshold:
            ranked.append({**issue, "similarity": sim})
    ranked.sort(key=lambda i: i["similarity"], reverse=True)
    return ranked[:limit]


def recent_nearby_query(new_issue: dict, days: int = 45) -> dict:
    since = datetime.utcnow() - timedelta(days=days)
    query = {"is_deleted": {"$ne": True}, "created_at": {"$gte": since}}
    if new_issue.get("location_district"):
        query["location_district"] = new_issue["location_district"]
    if new_issue.get("category"):
        query["category"] = new_issue["category"]
    return query
