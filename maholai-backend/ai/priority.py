"""Configurable civic priority engine (0-100)."""

PRIORITY_THRESHOLDS = {
    "LOW": (0, 25),
    "MEDIUM": (26, 50),
    "HIGH": (51, 75),
    "CRITICAL": (76, 100),
}

SEVERITY_POINTS = {"low": 10, "medium": 22, "high": 38, "critical": 50}


def _level_from_score(score: int) -> str:
    for name, (lo, hi) in PRIORITY_THRESHOLDS.items():
        if lo <= score <= hi:
            return name
    return "MEDIUM"


def compute_priority(
    *,
    severity: str | None = None,
    safety_risk: bool = False,
    support_count: int = 0,
    has_evidence: bool = False,
    frequency: str | None = None,
    ai_priority: str | None = None,
) -> dict:
    score = 18
    score += SEVERITY_POINTS.get((severity or "").lower(), 16)
    if safety_risk:
        score += 22
    score += min(20, support_count * 2)
    if has_evidence:
        score += 8
    if frequency in ("frequently", "always"):
        score += 10
    elif frequency == "occasionally":
        score += 4
    if ai_priority == "high":
        score += 12
    elif ai_priority == "low":
        score -= 6
    score = max(0, min(100, score))
    return {
        "priority_score": score,
        "priority_level": _level_from_score(score),
        "priority": "high" if score >= 51 else "medium" if score >= 26 else "low",
    }
