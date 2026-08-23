"""Group nearby similar reports into civic issue clusters."""

from collections import defaultdict


def build_clusters(issues: list) -> list:
    buckets = defaultdict(list)
    for issue in issues:
        area = issue.get("location_area") or (issue.get("location") or {}).get("area") or "Unknown"
        category = issue.get("category") or "Other"
        buckets[(category, area)].append(issue)

    clusters = []
    for i, ((category, area), items) in enumerate(buckets.items(), start=1):
        supports = sum(len(x.get("supports") or []) for x in items)
        photos = sum(1 for x in items if x.get("photo_url"))
        scores = [x.get("priority_score") or 0 for x in items]
        clusters.append({
            "cluster_id": i,
            "title": f"{category} cluster",
            "category": category,
            "location_area": area,
            "reports": len(items),
            "supporters": supports,
            "evidence": photos,
            "priority": max(scores) if scores else 0,
            "status": items[0].get("status") if items else "pending",
            "issue_ids": [str(x.get("_id")) for x in items],
        })
    clusters.sort(key=lambda c: (c["priority"], c["reports"]), reverse=True)
    return clusters
