from datetime import datetime
import jwt

from database import notifications_collection
from config import JWT_SECRET_KEY


ALLOWED_STATUSES = {
    "pending",
    "in_progress",
    "resolved",
    "resolution_submitted",
    "community_verification",
    "reopened",
    "rejected",
}

STATUS_TRANSITIONS = {
    "pending": {"in_progress", "rejected"},
    "in_progress": {"resolved", "resolution_submitted", "rejected"},
    "resolution_submitted": {"community_verification", "resolved"},
    "community_verification": {"resolved", "reopened"},
    "reopened": {"in_progress", "resolved"},
    "resolved": {"reopened"},
    "rejected": set(),
}


def identify_viewer(request) -> dict:
    """Like get_current_user, but never raises — returns anonymous viewer if no/invalid token."""
    token = request.cookies.get("token")
    if not token:
        return {"user_id": None, "role": "public"}
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=["HS256"])
        return payload
    except Exception:
        return {"user_id": None, "role": "public"}


def serialize_issue(issue: dict) -> dict:
    """Mutates issue in place: ObjectId/datetime -> JSON-safe strings."""
    issue["_id"] = str(issue["_id"])
    if issue.get("created_at"):
        issue["created_at"] = str(issue["created_at"])
    if issue.get("updated_at"):
        issue["updated_at"] = str(issue["updated_at"])
    for entry in issue.get("status_history") or []:
        if entry.get("updated_at"):
            entry["updated_at"] = str(entry["updated_at"])
    return issue


def strip_reporter_info_if_needed(issue: dict, viewer: dict):
    """Removes reporter PII unless viewer owns the issue or is an authorized admin."""
    role = viewer.get("role")
    is_owner = viewer.get("user_id") and str(viewer["user_id"]) == str(issue.get("created_by"))
    is_admin = role in ("super_admin", "sub_admin")
    if is_owner or is_admin:
        return
    issue["reporter_name"] = None
    issue["reporter_cnic"] = None
    issue["reporter_phone"] = None


def notify(user_id, title: str, message: str, issue_id: str = None):
    """Best-effort in-app notification. Never raises — a failed notify must not fail the request."""
    if not user_id:
        return
    try:
        notifications_collection.insert_one({
            "user_id": str(user_id),
            "title": title,
            "message": message,
            "issue_id": str(issue_id) if issue_id else None,
            "read": False,
            "created_at": datetime.utcnow(),
        })
    except Exception as e:
        print(f"Notification insert failed: {e}")


def compute_priority(severity=None, safety_risk=False, support_count=0, has_evidence=False, frequency=None, ai_priority=None) -> dict:
    """Simple heuristic priority score — placeholder until AI scoring is added later."""
    score = support_count * 2
    if safety_risk:
        score += 10
    if has_evidence:
        score += 2
    if severity == "high" or ai_priority == "high":
        score += 5
    elif severity == "medium" or ai_priority == "medium":
        score += 2
    level = "high" if score >= 10 else "medium" if score >= 4 else "low"
    return {"priority": level, "priority_score": score}


def build_clusters(issues: list) -> list:
    """Groups issues by category+area — placeholder until geo clustering is added later."""
    clusters = {}
    for issue in issues:
        area = issue.get("location_area") or (issue.get("location") or {}).get("area") or "Unknown"
        category = issue.get("category") or "Other"
        key = f"{category}:{area}"
        clusters.setdefault(key, {"category": category, "area": area, "count": 0, "issue_ids": []})
        clusters[key]["count"] += 1
        clusters[key]["issue_ids"].append(str(issue["_id"]))
    return list(clusters.values())