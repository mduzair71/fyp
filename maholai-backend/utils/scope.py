def normalize_scope(user: dict) -> dict:
    """Build category/area/district lists from new or legacy sub-admin fields."""
    categories = list(user.get("categories") or [])
    areas = list(user.get("areas") or [])
    districts = list(user.get("districts") or [])
    if not categories and user.get("department"):
        categories = [user["department"]]
    if not areas and user.get("area"):
        areas = [user["area"]]
    if not districts and user.get("district"):
        districts = [user["district"]]
    return {
        "categories": categories,
        "areas": areas,
        "districts": districts,
        "department": categories[0] if categories else user.get("department"),
        "area": areas[0] if areas else user.get("area"),
        "district": districts[0] if districts else user.get("district"),
    }


def has_scope_access(admin: dict, issue: dict) -> bool:
    """
    Super Admin: unrestricted.
    Sub Admin: issue category AND area must both match assigned scope.
    """
    if admin.get("role") == "super_admin":
        return True
    scope = normalize_scope(admin)
    category = issue.get("category")
    area = issue.get("location_area") or (issue.get("location") or {}).get("area")
    district = issue.get("location_district") or (issue.get("location") or {}).get("district")

    category_ok = (not scope["categories"]) or (category in scope["categories"])
    area_ok = (not scope["areas"]) or (area in scope["areas"])
    district_ok = (not scope["districts"]) or (district in scope["districts"])
    return bool(category_ok and area_ok and district_ok)


def scoped_issue_query(admin: dict) -> dict:
    if admin.get("role") == "super_admin":
        return {}
    scope = normalize_scope(admin)
    query = {}
    if scope["categories"]:
        query["category"] = {"$in": scope["categories"]}
    if scope["areas"]:
        query["location.area"] = {"$in": scope["areas"]}
    if scope["districts"]:
        query["location.district"] = {"$in": scope["districts"]}
    return query