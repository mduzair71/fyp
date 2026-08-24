# from utils.scope import has_scope_access, scoped_issue_query as scoped_issues

# from fastapi import APIRouter, HTTPException, File, UploadFile, Form, Depends, Request
# # from database import issues_collection, users_collection
# from database import issues_collection, users_collection, notifications_collection
# from bson import ObjectId
# # from ai_analyzer import analyze_issue
# from routes.auth import require_admin, get_current_user, log_audit_action
# from models.issue import CATEGORY_DEPARTMENT_MAP
# from utils.scope import has_scope_access, scoped_issue_query
# from utils.uploads import validate_upload
# # from ai import (
# #     classify_text,
# #     compute_priority,
# #     find_duplicate_candidates,
# #     build_clusters,
# #     detect_from_filename,
# # )
# # from ai.duplicates import recent_nearby_query
# from utils.issue_helpers import (
#     identify_viewer,
#     serialize_issue,
#     strip_reporter_info_if_needed,
#     notify,
#     ALLOWED_STATUSES,
#     STATUS_TRANSITIONS,
#     compute_priority,
#     build_clusters,
# )

# import os
# import uuid
# from datetime import datetime

# router = APIRouter()


# # Level 1 Statuses
# ALLOWED_STATUSES = {
#     "PENDING", "IN_PROGRESS", "RESOLVED", "REJECTED"
# }

# STATUS_TRANSITIONS = {
#     "PENDING": {"IN_PROGRESS", "REJECTED"},
#     "IN_PROGRESS": {"RESOLVED", "REJECTED"},
#     "RESOLVED": set(),
#     "REJECTED": set()
# }

# # Original Statuses
# # ALLOWED_STATUSES = {
# #     "pending",
# #     "under_review",
# #     "assigned",
# #     "in_progress",
# #     "resolution_submitted",
# #     "community_verification",
# #     "resolved",
# #     "rejected",
# #     "invalid",
# #     "duplicate",
# #     "reopened",
# # }

# # STATUS_TRANSITIONS = {
# #     "pending": {"under_review", "assigned", "in_progress", "rejected", "invalid", "duplicate"},
# #     "under_review": {"assigned", "in_progress", "rejected", "invalid", "duplicate"},
# #     "assigned": {"in_progress", "rejected"},
# #     "in_progress": {"resolution_submitted", "resolved", "rejected"},
# #     "resolution_submitted": {"community_verification", "in_progress", "resolved"},
# #     "community_verification": {"resolved", "reopened", "in_progress"},
# #     "resolved": {"reopened"},
# #     "reopened": {"in_progress", "under_review"},
# #     "rejected": {"reopened", "pending"},
# #     "invalid": set(),
# #     "duplicate": set(),
# # }


# def serialize_issue(issue: dict) -> dict:
#     issue["_id"] = str(issue["_id"])
#     if issue.get("created_at"):
#         issue["created_at"] = str(issue["created_at"])
#     # issue["support_count"] = len(issue.get("supports") or [])
#     return issue



# def strip_reporter_info_if_needed(issue: dict, viewer: dict):
#     role = viewer.get("role")
#     user_id = viewer.get("user_id")
#     is_owner = user_id is not None and user_id == issue.get("created_by")
#     is_privileged = role == "super_admin" or (role == "sub_admin" and has_scope_access(viewer, issue))
#     if not (is_owner or is_privileged):
#         issue.pop("reporter_name", None)
#         issue.pop("reporter_cnic", None)
#         issue.pop("reporter_phone", None)


# def identify_viewer(request: Request) -> dict:
#     if not request.cookies.get("token"):
#         return {}
#     try:
#         payload = get_current_user(request)
#         if payload.get("role") == "admin":
#             payload["role"] = "sub_admin"
#         return payload
#     except Exception:
#         return {}


# # def notify(user_id: str, title: str, message: str, issue_id: str | None = None):
# #     if not user_id:
# #         return
# #     try:
# #         notifications_collection.insert_one({
# #             "user_id": str(user_id),
# #             "title": title,
# #             "message": message,
# #             "issue_id": issue_id,
# #             "read": False,
# #             "created_at": datetime.utcnow(),
# #         })
# #     except Exception as e:
# #         print(f"Notification insert failed: {e}")


# # def apply_ai(issue_data: dict, filename: str | None = None) -> dict:
# #     analysis = analyze_issue(
# #         title=issue_data["title"],
# #         description=issue_data["description"],
# #         location=f"{issue_data.get('location_area')}, {issue_data.get('location_district')}",
# #     )
# #     nlp = classify_text(issue_data["title"], issue_data["description"])
# #     image_ai = detect_from_filename(filename, issue_data.get("category"))
# #     priority = compute_priority(
# #         severity=issue_data.get("severity_level") or analysis.get("priority"),
# #         safety_risk=nlp.get("safety_risk", False),
# #         support_count=0,
# #         has_evidence=bool(issue_data.get("photo_url")),
# #         frequency=issue_data.get("frequency"),
# #         ai_priority=analysis.get("priority"),
# #     )
# #     issue_data["summary"] = analysis.get("summary") or issue_data["description"]
# #     issue_data["priority"] = priority["priority"]
# #     issue_data["priority_score"] = priority["priority_score"]
# #     issue_data["priority_level"] = priority["priority_level"]
# #     issue_data["ai_category"] = nlp.get("ai_category")
# #     issue_data["ai_confidence"] = nlp.get("ai_confidence")
# #     issue_data["ai_severity"] = analysis.get("priority")
# #     issue_data["ai_department_recommendation"] = CATEGORY_DEPARTMENT_MAP.get(
# #         issue_data.get("category"), "General Admin"
# #     )
# #     issue_data["safety_risk"] = nlp.get("safety_risk", False)
# #     issue_data.update(image_ai)
# #     return issue_data


# # def duplicate_payload(issue: dict) -> dict:
# #     return {
# #         "category": issue.get("category"),
# #         "title": issue.get("title"),
# #         "description": issue.get("description"),
# #         "location_area": issue.get("location_area"),
# #         "location_district": issue.get("location_district"),
# #         "location_latitude": issue.get("location_latitude"),
# #         "location_longitude": issue.get("location_longitude"),
# #     }


# # def find_duplicates_for(payload: dict) -> list:
# #     query = recent_nearby_query(payload)
# #     existing = list(issues_collection.find(query).limit(80))
# #     matches = find_duplicate_candidates(existing, payload)
# #     out = []
# #     for item in matches:
# #         out.append({
# #             "_id": str(item["_id"]),
# #             "title": item.get("title"),
# #             "category": item.get("category"),
# #             "location_area": item.get("location_area"),
# #             "status": item.get("status"),
# #             "support_count": len(item.get("supports") or []),
# #             "similarity": item.get("similarity"),
# #         })
# #     return out


# def scoped_issues(viewer: dict):
#     query = {"is_deleted": {"$ne": True}}
#     if viewer.get("role") == "sub_admin":
#         query.update(scoped_issue_query(viewer))
#     return query


# # @router.post("/issues/check-duplicates")
# # async def check_duplicates(
# #     category: str = Form(...),
# #     title: str = Form(...),
# #     description: str = Form(...),
# #     location_area: str = Form(...),
# #     location_district: str = Form(...),
# #     location_latitude: float = Form(None),
# #     location_longitude: float = Form(None),
# # ):
# #     payload = {
# #         "category": category,
# #         "title": title,
# #         "description": description,
# #         "location_area": location_area,
# #         "location_district": location_district,
# #         "location_latitude": location_latitude,
# #         "location_longitude": location_longitude,
# #     }
# #     matches = find_duplicates_for(payload)
# #     return {"total": len(matches), "data": matches}




# @router.post("/issues")
# async def create_issue(
#     request: Request,
#     category: str = Form(...),
#     # problem_type: str = Form(...),
#     title: str = Form(...),
#     description: str = Form(...),
#     location_area: str = Form(...),
#     location_district: str = Form(...),
#     location_latitude: float = Form(None),
#     location_longitude: float = Form(None),
#     # additional_info: str = Form(None),
#     location_landmark: str = Form(None),
#     # occurred_date: str = Form(None),
#     # frequency: str = Form(None),
#     # severity_level: str = Form(None),
#     is_anonymous: str = Form("false"),
#     created_by: str = Form(...),
#     # confirm_duplicate: str = Form("false"),
#     file: UploadFile = File(None),
# ):
#     try:
#         reporter = users_collection.find_one({"_id": ObjectId(created_by)})
#         if not reporter:
#             raise HTTPException(status_code=404, detail="User not found")

#         viewer = identify_viewer(request)
#         if viewer.get("user_id") and viewer["user_id"] != created_by:
#             raise HTTPException(status_code=403, detail="You can only report issues as yourself")

#         # payload = duplicate_payload({
#         #     "category": category,
#         #     "title": title,
#         #     "description": description,
#         #     "location_area": location_area,
#         #     "location_district": location_district,
#         #     "location_latitude": location_latitude,
#         #     "location_longitude": location_longitude,
#         # })
#         # duplicates = find_duplicates_for(payload)
#         # if duplicates and confirm_duplicate.lower() != "true":
#         #     return {
#         #         "possible_duplicate": True,
#         #         "message": "Similar civic issues already exist nearby",
#         #         "duplicates": duplicates,
#         #     }

#         initial_status = "PENDING"
#         status_timeline_entry = {
#             "status": initial_status,
#             "updated_at": datetime.utcnow(),
#             "updated_by": created_by,
#             "note": "Issue reported by citizen",
#         }
#         default_department = CATEGORY_DEPARTMENT_MAP.get(category, "General Admin")
#         anonymous = str(is_anonymous).lower() in ("true", "1", "yes")

#         issue_data = {
#             "category": category,
#             # "problem_type": problem_type,
#             "title": title,
#             "description": description,
#             "location": {
#                 "area": location_area,
#                 "district": location_district,
#                 "latitude": location_latitude,
#                 "longitude": location_longitude,
#                 "landmark": location_landmark,
#             },
#             # "additional_info": additional_info,
#             # "occurred_date": occurred_date,
#             # "frequency": frequency,
#             # "severity_level": severity_level,
#             "is_anonymous": anonymous,
#             "created_by": created_by,
#             "reporter_name": None if anonymous else reporter.get("name"),
#             "reporter_cnic": None if anonymous else reporter.get("cnic"),
#             "reporter_phone": None if anonymous else reporter.get("phone"),
#             "department": default_department,
#             "photo_url": None,
#             "resolution_photo_url": None,
#             "status": initial_status,
#             "status_history": [status_timeline_entry],
#             # "supports": [],
#             # "comments": [],
#             # "community_votes": {},
#             "is_deleted": False,
#             "created_at": datetime.utcnow(),
#         }

#         if file and file.filename:
#             content = await file.read()
#             try:
#                 ext = validate_upload(file.filename, file.content_type, len(content))
#             except ValueError as ve:
#                 raise HTTPException(status_code=422, detail=str(ve))
#             os.makedirs("uploads", exist_ok=True)
#             unique_filename = f"{uuid.uuid4()}{ext}"
#             file_path = f"uploads/{unique_filename}"
#             with open(file_path, "wb") as buffer:
#                 buffer.write(content)
#             issue_data["photo_url"] = file_path

#         # apply_ai(issue_data, file.filename if file else None)
#         # issue_data["status_history"].append({
#         #     "status": "ai_analyzed",
#         #     "updated_at": datetime.utcnow(),
#         #     "updated_by": "system",
#         #     "note": f"AI classified as {issue_data.get('ai_category')} ({issue_data.get('ai_confidence')})",
#         # })

#         result = issues_collection.insert_one(issue_data)
#         inserted_issue = issues_collection.find_one({"_id": result.inserted_id})
#         # notify(
#         #     created_by,
#         #     "Issue Submitted",
#         #     f"Your report “{title}” was received and analyzed.",
#         #     str(result.inserted_id),
#         # )
#         return {"message": "Issue reported successfully", "possible_duplicate": False, "data": serialize_issue(inserted_issue)}
#     except HTTPException:
#         raise
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))


# @router.get("/issues")
# def get_all_issues(request: Request):
#     try:
#         viewer = identify_viewer(request)
#         query = scoped_issues(viewer)
#         issues = []
#         for issue in issues_collection.find(query).sort("created_at", -1):
#             serialize_issue(issue)
#             strip_reporter_info_if_needed(issue, viewer)
#             issues.append(issue)
#         return {"total": len(issues), "data": issues}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))


# @router.get("/issues/geo")
# def get_geo_issues(request: Request):
#     viewer = identify_viewer(request)
#     query = scoped_issues(viewer)
#     points = []
#     for issue in issues_collection.find(query):
#         lat = issue.get("location_latitude") or (issue.get("location") or {}).get("latitude")
#         lng = issue.get("location_longitude") or (issue.get("location") or {}).get("longitude")
#         if lat is None or lng is None:
#             continue
#         points.append({
#             "_id": str(issue["_id"]),
#             "title": issue.get("title"),
#             "category": issue.get("category"),
#             "status": issue.get("status"),
#             "priority_level": issue.get("priority_level") or issue.get("priority"),
#             "priority_score": issue.get("priority_score"),
#             "location_area": issue.get("location_area"),
#             "latitude": lat,
#             "longitude": lng,
#         })
#     return {"total": len(points), "data": points}


# @router.get("/issues/heatmap")
# def get_heatmap(request: Request):
#     viewer = identify_viewer(request)
#     if viewer.get("role") not in ("sub_admin", "super_admin"):
#         raise HTTPException(status_code=403, detail="Admin access only")
#     query = scoped_issues(viewer)
#     buckets = {}
#     for issue in issues_collection.find(query):
#         area = issue.get("location_area") or "Unknown"
#         buckets.setdefault(area, {"area": area, "count": 0, "critical": 0})
#         buckets[area]["count"] += 1
#         if (issue.get("priority_level") or "").upper() == "CRITICAL" or issue.get("priority") == "high":
#             buckets[area]["critical"] += 1
#     hotspots = []
#     for item in buckets.values():
#         count = item["count"]
#         level = "Low"
#         if count >= 8 or item["critical"] >= 3:
#             level = "Critical"
#         elif count >= 4:
#             level = "High"
#         elif count >= 2:
#             level = "Medium"
#         item["level"] = level
#         hotspots.append(item)
#     hotspots.sort(key=lambda x: x["count"], reverse=True)
#     return {"total": len(hotspots), "data": hotspots}


# @router.get("/issues/clusters")
# def get_clusters(request: Request):
#     viewer = identify_viewer(request)
#     if viewer.get("role") not in ("sub_admin", "super_admin"):
#         raise HTTPException(status_code=403, detail="Admin access only")
#     query = scoped_issues(viewer)
#     issues = list(issues_collection.find(query))
#     return {"total": len(issues), "data": build_clusters(issues)}


# @router.get("/analytics")
# def get_analytics(request: Request, admin=Depends(require_admin)):
#     query = scoped_issues(admin)
#     issues = list(issues_collection.find(query))
#     by_category, by_area, by_status, by_priority = {}, {}, {}, {}
#     resolved_times = []
#     for issue in issues:
#         by_category[issue.get("category") or "Other"] = by_category.get(issue.get("category") or "Other", 0) + 1
#         by_area[issue.get("location_area") or "Unknown"] = by_area.get(issue.get("location_area") or "Unknown", 0) + 1
#         by_status[issue.get("status") or "pending"] = by_status.get(issue.get("status") or "pending", 0) + 1
#         level = issue.get("priority_level") or (issue.get("priority") or "MEDIUM").upper()
#         by_priority[level] = by_priority.get(level, 0) + 1
#         if issue.get("status") == "resolved" and issue.get("created_at"):
#             history = issue.get("status_history") or []
#             resolved_at = next((h.get("updated_at") for h in reversed(history) if h.get("status") == "resolved"), None)
#             if resolved_at and issue.get("created_at"):
#                 try:
#                     resolved_times.append((resolved_at - issue["created_at"]).total_seconds() / 3600)
#                 except Exception:
#                     pass
#     total = len(issues)
#     resolved = by_status.get("resolved", 0)
#     pending = by_status.get("pending", 0) + by_status.get("under_review", 0)
#     alerts = []
#     for area, count in by_area.items():
#         if count >= 5:
#             alerts.append({"type": "hotspot", "message": f"High number of complaints in {area} ({count})"})
#     for issue in issues:
#         if issue.get("safety_risk"):
#             alerts.append({"type": "safety", "message": f"Critical safety issue detected: {issue.get('title')}"})
#         if issue.get("status") in ("pending", "in_progress") and issue.get("created_at"):
#             age_days = (datetime.utcnow() - issue["created_at"]).days if not isinstance(issue["created_at"], str) else 0
#             if age_days >= 14:
#                 alerts.append({"type": "overdue", "message": f"Unresolved beyond threshold: {issue.get('title')}"})
#     return {
#         "total_issues": total,
#         "resolved": resolved,
#         "pending": pending,
#         "in_progress": by_status.get("in_progress", 0),
#         "resolution_rate": round((resolved / total) * 100, 1) if total else 0,
#         "avg_resolution_hours": round(sum(resolved_times) / len(resolved_times), 1) if resolved_times else None,
#         "by_category": by_category,
#         "by_area": by_area,
#         "by_status": by_status,
#         "by_priority": by_priority,
#         "alerts": alerts[:12],
#         "scope": {
#             "categories": admin.get("categories"),
#             "areas": admin.get("areas"),
#             "role": admin.get("role"),
#         },
#     }


# @router.get("/issues/user/{user_id}")
# def get_issues_by_user(user_id: str, request: Request):
#     try:
#         viewer = identify_viewer(request)
#         role = viewer.get("role")
#         viewer_id = viewer.get("user_id")
#         if not (viewer_id == user_id or role in ("super_admin", "sub_admin")):
#             raise HTTPException(status_code=403, detail="Not authorized to view these issues")
#         query = {"created_by": user_id, "is_deleted": {"$ne": True}}
#         issues = []
#         for issue in issues_collection.find(query).sort("created_at", -1):
#             if role == "sub_admin" and not has_scope_access(viewer, issue):
#                 continue
#             serialize_issue(issue)
#             strip_reporter_info_if_needed(issue, viewer)
#             issues.append(issue)
#         return {"total": len(issues), "data": issues}
#     except HTTPException:
#         raise
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))


# @router.get("/notifications")
# def list_notifications(current_user=Depends(get_current_user)):
#     items = []
#     for note in notifications_collection.find({"user_id": current_user["user_id"]}).sort("created_at", -1).limit(30):
#         note["_id"] = str(note["_id"])
#         note["created_at"] = str(note.get("created_at", ""))
#         items.append(note)
#     return {"total": len(items), "data": items}


# @router.get("/issues/{issue_id}")
# def get_issue(issue_id: str, request: Request):
#     try:
#         issue = issues_collection.find_one({"_id": ObjectId(issue_id), "is_deleted": {"$ne": True}})
#         if not issue:
#             raise HTTPException(status_code=404, detail="Issue not found")
#         viewer = identify_viewer(request)
#         if viewer.get("role") == "sub_admin" and not has_scope_access(viewer, issue):
#             raise HTTPException(status_code=403, detail="Not authorized to view this issue")
#         serialize_issue(issue)
#         strip_reporter_info_if_needed(issue, viewer)
#         return issue
#     except HTTPException:
#         raise
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))


# @router.patch("/issues/{issue_id}/status")
# def update_issue_status(
#     issue_id: str,
#     status: str = Form(...),
#     note: str = Form(None),
#     admin=Depends(require_admin),
# ):
#     try:
#         if status not in ALLOWED_STATUSES:
#             raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of {sorted(ALLOWED_STATUSES)}")
#         issue = issues_collection.find_one({"_id": ObjectId(issue_id), "is_deleted": {"$ne": True}})
#         if not issue:
#             raise HTTPException(status_code=404, detail="Issue not found")
#         if not has_scope_access(admin, issue):
#             raise HTTPException(status_code=403, detail="Not authorized for this department/area")

#         current = issue.get("status") or "PENDING"
#         allowed = STATUS_TRANSITIONS.get(current, set())
#         if status not in allowed and status != current:
#             raise HTTPException(status_code=422, detail=f"Cannot change status from {current} to {status}")

#         history_entry = {
#             "status": status,
#             "updated_at": datetime.utcnow(),
#             "updated_by": admin.get("user_id"),
#             "note": note or f"Status changed to {status}",
#         }
#         issues_collection.update_one(
#             {"_id": ObjectId(issue_id)},
#             {"$set": {"status": status}, "$push": {"status_history": history_entry}},
#         )
#         log_audit_action(
#             performed_by=admin.get("user_id"),
#             role=admin.get("role"),
#             action="STATUS_UPDATE",
#             target_type="issue",
#             target_id=issue_id,
#             previous_val={"status": current},
#             new_val={"status": status},
#         )
#         notify(issue.get("created_by"), "Status Changed", f"Issue \u201c{issue.get('title')}\u201d is now {status}.", issue_id)
#         if status in ("resolved", "resolution_submitted", "community_verification"):
#             notify(issue.get("created_by"), "Community Verification Required", "Please confirm whether this issue is actually resolved.", issue_id)

#         return {"message": "Status & Timeline updated successfully", "status": status}
#     except HTTPException:
#         raise
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))

# # @router.patch("/issues/{issue_id}/status")
# # def update_issue_status(
# #     issue_id: str,
# #     status: str = Form(...),
# #     note: str = Form(None),
# #     admin=Depends(require_admin),
# # ):
# #     try:
# #         if status not in ALLOWED_STATUSES:
# #             raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of {sorted(ALLOWED_STATUSES)}")
# #         issue = issues_collection.find_one({"_id": ObjectId(issue_id), "is_deleted": {"$ne": True}})
# #         if not issue:
# #             raise HTTPException(status_code=404, detail="Issue not found")
# #         if not has_scope_access(admin, issue):
# #             raise HTTPException(status_code=403, detail="Not authorized for this department/area")
# #         current = issue.get("status") or "PENDING"
# #         allowed = STATUS_TRANSITIONS.get(current, set())
# #         if status not in allowed and status != current:
# #             raise HTTPException(status_code=400, detail=f"Transition from {current} to {status} is not allowed.")

# #         update_data = {"status": status}
# #         timeline_entry = {
# #             "status": status,
# #             "updated_at": datetime.utcnow(),
# #             "updated_by": admin["user_id"],
# #             "note": note,
# #         }
# #         issues_collection.update_one(
# #             {"_id": ObjectId(issue_id)},
# #             {"$set": update_data, "$push": {"status_history": timeline_entry}},
# #         )
# #         log_audit_action(admin["user_id"], "update_status", issue_id, {"status": status, "note": note})
# #         # notify(
# #         #     issue.get("created_by"),
# #         #     f"Status of “{issue.get('title')}” Updated",
# #         #     f"The status of your issue has been updated to {status}.",
# #         #     issue_id,
# #         # )
# #         return {"message": "Issue status updated successfully"}
# #     except HTTPException:
# #         raise
# #     except Exception as e:
# #         raise HTTPException(status_code=500, detail=str(e))
# #             raise HTTPException(status_code=422, detail=f"Cannot change status from {current} to {status}")
# #         history_entry = {
# #             "status": status,
# #             "updated_at": datetime.utcnow(),
# #             "updated_by": admin.get("user_id"),
# #             "note": note or f"Status changed to {status}",
# #         }
# #         issues_collection.update_one(
# #             {"_id": ObjectId(issue_id)},
# #             {"$set": {"status": status}, "$push": {"status_history": history_entry}},
# #         )
# #         log_audit_action(
# #             performed_by=admin.get("user_id"),
# #             role=admin.get("role"),
# #             action="STATUS_UPDATE",
# #             target_type="issue",
# #             target_id=issue_id,
# #             previous_val={"status": current},
# #             new_val={"status": status},
# #         )
# #         notify(issue.get("created_by"), "Status Changed", f"Issue “{issue.get('title')}” is now {status}.", issue_id)
# #         if status in ("resolved", "resolution_submitted", "community_verification"):
# #             notify(issue.get("created_by"), "Community Verification Required", "Please confirm whether this issue is actually resolved.", issue_id)
# #         return {"message": "Status & Timeline updated successfully", "status": status}
# #     except HTTPException:
# #         raise
# #     except Exception as e:
# #         raise HTTPException(status_code=500, detail=str(e))


# @router.delete("/issues/{issue_id}")
# def delete_issue(issue_id: str, admin=Depends(require_admin)):
#     try:
#         issue = issues_collection.find_one({"_id": ObjectId(issue_id), "is_deleted": {"$ne": True}})
#         if not issue:
#             raise HTTPException(status_code=404, detail="Issue not found")
#         if not has_scope_access(admin, issue):
#             raise HTTPException(status_code=403, detail="Not authorized for this department/area")
#         issues_collection.update_one(
#             {"_id": ObjectId(issue_id)},
#             {"$set": {"is_deleted": True, "deleted_at": datetime.utcnow(), "deleted_by": admin.get("user_id")}},
#         )
#         log_audit_action(
#             performed_by=admin.get("user_id"),
#             role=admin.get("role"),
#             action="ISSUE_DELETE",
#             target_type="issue",
#             target_id=issue_id,
#             previous_val={"is_deleted": False},
#             new_val={"is_deleted": True},
#         )
#         return {"message": "Issue deleted successfully"}
#     except HTTPException:
#         raise
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))


# @router.post("/issues/{issue_id}/support")
# def support_issue(issue_id: str, current_user=Depends(get_current_user)):
#     try:
#         user_id = current_user.get("user_id")
#         issue = issues_collection.find_one({"_id": ObjectId(issue_id), "is_deleted": {"$ne": True}})
#         if not issue:
#             raise HTTPException(status_code=404, detail="Issue not found")
#         supports = issue.get("supports") or []
#         if user_id in supports:
#             issues_collection.update_one({"_id": ObjectId(issue_id)}, {"$pull": {"supports": user_id}})
#             return {"message": "Support removed", "supported": False}
#         issues_collection.update_one({"_id": ObjectId(issue_id)}, {"$addToSet": {"supports": user_id}})
#         support_count = len(set(supports + [user_id]))
#         priority = compute_priority(
#             severity=issue.get("severity_level") or issue.get("ai_severity"),
#             safety_risk=issue.get("safety_risk", False),
#             support_count=support_count,
#             has_evidence=bool(issue.get("photo_url")),
#             frequency=issue.get("frequency"),
#             ai_priority=issue.get("ai_severity"),
#         )
#         issues_collection.update_one({"_id": ObjectId(issue_id)}, {"$set": priority})
#         return {"message": "Supported issue successfully", "supported": True}
#     except HTTPException:
#         raise
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))


# @router.post("/issues/{issue_id}/comments")
# def add_comment(issue_id: str, message: str = Form(...), current_user=Depends(get_current_user)):
#     issue = issues_collection.find_one({"_id": ObjectId(issue_id), "is_deleted": {"$ne": True}})
#     if not issue:
#         raise HTTPException(status_code=404, detail="Issue not found")
#     if current_user.get("role") == "sub_admin" and not has_scope_access(current_user, issue):
#         raise HTTPException(status_code=403, detail="Not authorized for this issue")
#     comment = {
#         "user_id": current_user.get("user_id"),
#         "name": current_user.get("name") or "Citizen",
#         "message": message.strip(),
#         "created_at": datetime.utcnow(),
#     }
#     if not comment["message"]:
#         raise HTTPException(status_code=422, detail="Comment cannot be empty")
#     issues_collection.update_one({"_id": ObjectId(issue_id)}, {"$push": {"comments": comment}})
#     notify(issue.get("created_by"), "New Comment", f"{comment['name']} commented on your report.", issue_id)
#     comment["created_at"] = str(comment["created_at"])
#     return {"message": "Comment added", "data": comment}


# @router.post("/issues/{issue_id}/verify")
# def verify_resolution(issue_id: str, resolved: str = Form(...), current_user=Depends(get_current_user)):
#     issue = issues_collection.find_one({"_id": ObjectId(issue_id), "is_deleted": {"$ne": True}})
#     if not issue:
#         raise HTTPException(status_code=404, detail="Issue not found")
#     if issue.get("status") not in ("resolved", "resolution_submitted", "community_verification"):
#         raise HTTPException(status_code=422, detail="This issue is not awaiting community verification")
#     vote = "yes" if str(resolved).lower() in ("true", "1", "yes") else "no"
#     votes = issue.get("community_votes") or {}
#     votes[current_user["user_id"]] = vote
#     yes = sum(1 for v in votes.values() if v == "yes")
#     no = sum(1 for v in votes.values() if v == "no")
#     update = {"community_votes": votes}
#     history_note = None
#     new_status = issue.get("status")
#     if no >= 3 and no > yes:
#         new_status = "reopened"
#         update["status"] = new_status
#         history_note = "Community reported the issue still exists. Reopened for review."
#     elif yes >= 3 and yes > no:
#         new_status = "resolved"
#         update["status"] = new_status
#         history_note = "Community verified the resolution."
#     else:
#         new_status = "community_verification"
#         update["status"] = new_status
#     ops = {"$set": update}
#     if history_note:
#         ops["$push"] = {
#             "status_history": {
#                 "status": new_status,
#                 "updated_at": datetime.utcnow(),
#                 "updated_by": current_user.get("user_id"),
#                 "note": history_note,
#             }
#         }
#     issues_collection.update_one({"_id": ObjectId(issue_id)}, ops)
#     return {"message": "Verification recorded", "vote": vote, "yes": yes, "no": no, "status": new_status}


# @router.post("/issues/{issue_id}/resolution-evidence")
# async def upload_resolution_evidence(
#     issue_id: str,
#     file: UploadFile = File(...),
#     admin=Depends(require_admin),
# ):
#     issue = issues_collection.find_one({"_id": ObjectId(issue_id), "is_deleted": {"$ne": True}})
#     if not issue:
#         raise HTTPException(status_code=404, detail="Issue not found")
#     if not has_scope_access(admin, issue):
#         raise HTTPException(status_code=403, detail="Not authorized for this department/area")
#     content = await file.read()
#     try:
#         ext = validate_upload(file.filename, file.content_type, len(content))
#     except ValueError as ve:
#         raise HTTPException(status_code=422, detail=str(ve))
#     os.makedirs("uploads", exist_ok=True)
#     path = f"uploads/{uuid.uuid4()}{ext}"
#     with open(path, "wb") as buffer:
#         buffer.write(content)
#     confidence = 88 if issue.get("photo_url") else 55
#     issues_collection.update_one(
#         {"_id": ObjectId(issue_id)},
#         {
#             "$set": {
#                 "resolution_photo_url": path,
#                 "resolution_confidence": confidence,
#                 "resolution_ai_result": "Likely Resolved" if confidence >= 70 else "Needs Review",
#                 "status": "resolution_submitted",
#             },
#             "$push": {
#                 "status_history": {
#                     "status": "resolution_submitted",
#                     "updated_at": datetime.utcnow(),
#                     "updated_by": admin.get("user_id"),
#                     "note": "Resolution evidence uploaded",
#                 }
#             },
#         },
#     )
#     notify(issue.get("created_by"), "Resolution Submitted", "Please verify whether the issue is actually resolved.", issue_id)
#     return {
#         "message": "Resolution evidence uploaded",
#         "resolution_photo_url": path,
#         "resolution_confidence": confidence,
#         "result": "Likely Resolved" if confidence >= 70 else "Needs Review",
#     }

from utils.scope import has_scope_access, scoped_issue_query as scoped_issues

from fastapi import APIRouter, HTTPException, File, UploadFile, Form, Depends, Request
# from database import issues_collection, users_collection
from database import issues_collection, users_collection, notifications_collection
from bson import ObjectId
# from ai_analyzer import analyze_issue
from routes.auth import require_admin, get_current_user, log_audit_action
from models.issue import CATEGORY_DEPARTMENT_MAP
from utils.scope import has_scope_access, scoped_issue_query
from utils.uploads import validate_upload
# from ai import (
#     classify_text,
#     compute_priority,
#     find_duplicate_candidates,
#     build_clusters,
#     detect_from_filename,
# )
# from ai.duplicates import recent_nearby_query
from utils.issue_helpers import (
    identify_viewer,
    serialize_issue,
    strip_reporter_info_if_needed,
    notify,
    ALLOWED_STATUSES,
    STATUS_TRANSITIONS,
    compute_priority,
    build_clusters,
)

import os
import uuid
from datetime import datetime

router = APIRouter()


# Level 1 Statuses
ALLOWED_STATUSES = {
    "PENDING", "IN_PROGRESS", "RESOLVED", "REJECTED"
}

STATUS_TRANSITIONS = {
    "PENDING": {"IN_PROGRESS", "REJECTED"},
    "IN_PROGRESS": {"RESOLVED", "REJECTED"},
    "RESOLVED": set(),
    "REJECTED": set()
}

# Original Statuses
# ALLOWED_STATUSES = {
#     "pending",
#     "under_review",
#     "assigned",
#     "in_progress",
#     "resolution_submitted",
#     "community_verification",
#     "resolved",
#     "rejected",
#     "invalid",
#     "duplicate",
#     "reopened",
# }

# STATUS_TRANSITIONS = {
#     "pending": {"under_review", "assigned", "in_progress", "rejected", "invalid", "duplicate"},
#     "under_review": {"assigned", "in_progress", "rejected", "invalid", "duplicate"},
#     "assigned": {"in_progress", "rejected"},
#     "in_progress": {"resolution_submitted", "resolved", "rejected"},
#     "resolution_submitted": {"community_verification", "in_progress", "resolved"},
#     "community_verification": {"resolved", "reopened", "in_progress"},
#     "resolved": {"reopened"},
#     "reopened": {"in_progress", "under_review"},
#     "rejected": {"reopened", "pending"},
#     "invalid": set(),
#     "duplicate": set(),
# }


def serialize_issue(issue: dict) -> dict:
    issue["_id"] = str(issue["_id"])
    if issue.get("created_at"):
        issue["created_at"] = str(issue["created_at"])
    # issue["support_count"] = len(issue.get("supports") or [])
    return issue



def strip_reporter_info_if_needed(issue: dict, viewer: dict):
    role = viewer.get("role")
    user_id = viewer.get("user_id")
    is_owner = user_id is not None and user_id == issue.get("created_by")
    is_privileged = role == "super_admin" or (role == "sub_admin" and has_scope_access(viewer, issue))
    if not (is_owner or is_privileged):
        issue.pop("reporter_name", None)
        issue.pop("reporter_cnic", None)
        issue.pop("reporter_phone", None)


def identify_viewer(request: Request) -> dict:
    if not request.cookies.get("token"):
        return {}
    try:
        payload = get_current_user(request)
        if payload.get("role") == "admin":
            payload["role"] = "sub_admin"
        return payload
    except Exception:
        return {}


# def notify(user_id: str, title: str, message: str, issue_id: str | None = None):
#     if not user_id:
#         return
#     try:
#         notifications_collection.insert_one({
#             "user_id": str(user_id),
#             "title": title,
#             "message": message,
#             "issue_id": issue_id,
#             "read": False,
#             "created_at": datetime.utcnow(),
#         })
#     except Exception as e:
#         print(f"Notification insert failed: {e}")


# def apply_ai(issue_data: dict, filename: str | None = None) -> dict:
#     analysis = analyze_issue(
#         title=issue_data["title"],
#         description=issue_data["description"],
#         location=f"{issue_data.get('location_area')}, {issue_data.get('location_district')}",
#     )
#     nlp = classify_text(issue_data["title"], issue_data["description"])
#     image_ai = detect_from_filename(filename, issue_data.get("category"))
#     priority = compute_priority(
#         severity=issue_data.get("severity_level") or analysis.get("priority"),
#         safety_risk=nlp.get("safety_risk", False),
#         support_count=0,
#         has_evidence=bool(issue_data.get("photo_url")),
#         frequency=issue_data.get("frequency"),
#         ai_priority=analysis.get("priority"),
#     )
#     issue_data["summary"] = analysis.get("summary") or issue_data["description"]
#     issue_data["priority"] = priority["priority"]
#     issue_data["priority_score"] = priority["priority_score"]
#     issue_data["priority_level"] = priority["priority_level"]
#     issue_data["ai_category"] = nlp.get("ai_category")
#     issue_data["ai_confidence"] = nlp.get("ai_confidence")
#     issue_data["ai_severity"] = analysis.get("priority")
#     issue_data["ai_department_recommendation"] = CATEGORY_DEPARTMENT_MAP.get(
#         issue_data.get("category"), "General Admin"
#     )
#     issue_data["safety_risk"] = nlp.get("safety_risk", False)
#     issue_data.update(image_ai)
#     return issue_data


# def duplicate_payload(issue: dict) -> dict:
#     return {
#         "category": issue.get("category"),
#         "title": issue.get("title"),
#         "description": issue.get("description"),
#         "location_area": issue.get("location_area"),
#         "location_district": issue.get("location_district"),
#         "location_latitude": issue.get("location_latitude"),
#         "location_longitude": issue.get("location_longitude"),
#     }


# def find_duplicates_for(payload: dict) -> list:
#     query = recent_nearby_query(payload)
#     existing = list(issues_collection.find(query).limit(80))
#     matches = find_duplicate_candidates(existing, payload)
#     out = []
#     for item in matches:
#         out.append({
#             "_id": str(item["_id"]),
#             "title": item.get("title"),
#             "category": item.get("category"),
#             "location_area": item.get("location_area"),
#             "status": item.get("status"),
#             "support_count": len(item.get("supports") or []),
#             "similarity": item.get("similarity"),
#         })
#     return out


def scoped_issues(viewer: dict):
    query = {"is_deleted": {"$ne": True}}
    if viewer.get("role") == "sub_admin":
        query.update(scoped_issue_query(viewer))
    return query


# @router.post("/issues/check-duplicates")
# async def check_duplicates(
#     category: str = Form(...),
#     title: str = Form(...),
#     description: str = Form(...),
#     location_area: str = Form(...),
#     location_district: str = Form(...),
#     location_latitude: float = Form(None),
#     location_longitude: float = Form(None),
# ):
#     payload = {
#         "category": category,
#         "title": title,
#         "description": description,
#         "location_area": location_area,
#         "location_district": location_district,
#         "location_latitude": location_latitude,
#         "location_longitude": location_longitude,
#     }
#     matches = find_duplicates_for(payload)
#     return {"total": len(matches), "data": matches}




@router.post("/issues")
async def create_issue(
    request: Request,
    category: str = Form(...),
    problem_type: str = Form(None),
    title: str = Form(...),
    description: str = Form(...),
    location_area: str = Form(...),
    location_district: str = Form(...),
    location_latitude: float = Form(None),
    location_longitude: float = Form(None),
    additional_info: str = Form(None),
    location_landmark: str = Form(None),
    occurred_date: str = Form(None),
    frequency: str = Form(None),
    severity_level: str = Form(None),
    is_anonymous: str = Form("false"),
    created_by: str = Form(...),
    # confirm_duplicate: str = Form("false"),
    file: UploadFile = File(None),
):
    try:
        reporter = users_collection.find_one({"_id": ObjectId(created_by)})
        if not reporter:
            raise HTTPException(status_code=404, detail="User not found")

        viewer = identify_viewer(request)
        if viewer.get("user_id") and viewer["user_id"] != created_by:
            raise HTTPException(status_code=403, detail="You can only report issues as yourself")

        # payload = duplicate_payload({
        #     "category": category,
        #     "title": title,
        #     "description": description,
        #     "location_area": location_area,
        #     "location_district": location_district,
        #     "location_latitude": location_latitude,
        #     "location_longitude": location_longitude,
        # })
        # duplicates = find_duplicates_for(payload)
        # if duplicates and confirm_duplicate.lower() != "true":
        #     return {
        #         "possible_duplicate": True,
        #         "message": "Similar civic issues already exist nearby",
        #         "duplicates": duplicates,
        #     }

        initial_status = "PENDING"
        status_timeline_entry = {
            "status": initial_status,
            "updated_at": datetime.utcnow(),
            "updated_by": created_by,
            "note": "Issue reported by citizen",
        }
        default_department = CATEGORY_DEPARTMENT_MAP.get(category, "General Admin")
        anonymous = str(is_anonymous).lower() in ("true", "1", "yes")

        issue_data = {
            "category": category,
            "problem_type": problem_type,
            "title": title,
            "description": description,
            "location": {
                "area": location_area,
                "district": location_district,
                "latitude": location_latitude,
                "longitude": location_longitude,
                "landmark": location_landmark,
            },
            "additional_info": additional_info,
            "occurred_date": occurred_date,
            "frequency": frequency,
            "severity_level": severity_level,
            "is_anonymous": anonymous,
            "created_by": created_by,
            "reporter_name": None if anonymous else reporter.get("name"),
            "reporter_cnic": None if anonymous else reporter.get("cnic"),
            "reporter_phone": None if anonymous else reporter.get("phone"),
            "department": default_department,
            "photo_url": None,
            "resolution_photo_url": None,
            "status": initial_status,
            "status_history": [status_timeline_entry],
            # "supports": [],
            # "comments": [],
            # "community_votes": {},
            "is_deleted": False,
            "created_at": datetime.utcnow(),
        }

        if file and file.filename:
            content = await file.read()
            try:
                ext = validate_upload(file.filename, file.content_type, len(content))
            except ValueError as ve:
                raise HTTPException(status_code=422, detail=str(ve))
            os.makedirs("uploads", exist_ok=True)
            unique_filename = f"{uuid.uuid4()}{ext}"
            file_path = f"uploads/{unique_filename}"
            with open(file_path, "wb") as buffer:
                buffer.write(content)
            issue_data["photo_url"] = file_path

        # apply_ai(issue_data, file.filename if file else None)
        # issue_data["status_history"].append({
        #     "status": "ai_analyzed",
        #     "updated_at": datetime.utcnow(),
        #     "updated_by": "system",
        #     "note": f"AI classified as {issue_data.get('ai_category')} ({issue_data.get('ai_confidence')})",
        # })

        result = issues_collection.insert_one(issue_data)
        inserted_issue = issues_collection.find_one({"_id": result.inserted_id})
        # notify(
        #     created_by,
        #     "Issue Submitted",
        #     f"Your report “{title}” was received and analyzed.",
        #     str(result.inserted_id),
        # )
        return {"message": "Issue reported successfully", "possible_duplicate": False, "data": serialize_issue(inserted_issue)}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/issues")
def get_all_issues(request: Request):
    try:
        viewer = identify_viewer(request)
        query = scoped_issues(viewer)
        issues = []
        for issue in issues_collection.find(query).sort("created_at", -1):
            serialize_issue(issue)
            strip_reporter_info_if_needed(issue, viewer)
            issues.append(issue)
        return {"total": len(issues), "data": issues}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/issues/geo")
def get_geo_issues(request: Request):
    viewer = identify_viewer(request)
    query = scoped_issues(viewer)
    points = []
    for issue in issues_collection.find(query):
        lat = issue.get("location_latitude") or (issue.get("location") or {}).get("latitude")
        lng = issue.get("location_longitude") or (issue.get("location") or {}).get("longitude")
        if lat is None or lng is None:
            continue
        points.append({
            "_id": str(issue["_id"]),
            "title": issue.get("title"),
            "category": issue.get("category"),
            "status": issue.get("status"),
            "priority_level": issue.get("priority_level") or issue.get("priority"),
            "priority_score": issue.get("priority_score"),
            "location_area": issue.get("location_area"),
            "latitude": lat,
            "longitude": lng,
        })
    return {"total": len(points), "data": points}


@router.get("/issues/heatmap")
def get_heatmap(request: Request):
    viewer = identify_viewer(request)
    if viewer.get("role") not in ("sub_admin", "super_admin"):
        raise HTTPException(status_code=403, detail="Admin access only")
    query = scoped_issues(viewer)
    buckets = {}
    for issue in issues_collection.find(query):
        area = issue.get("location_area") or "Unknown"
        buckets.setdefault(area, {"area": area, "count": 0, "critical": 0})
        buckets[area]["count"] += 1
        if (issue.get("priority_level") or "").upper() == "CRITICAL" or issue.get("priority") == "high":
            buckets[area]["critical"] += 1
    hotspots = []
    for item in buckets.values():
        count = item["count"]
        level = "Low"
        if count >= 8 or item["critical"] >= 3:
            level = "Critical"
        elif count >= 4:
            level = "High"
        elif count >= 2:
            level = "Medium"
        item["level"] = level
        hotspots.append(item)
    hotspots.sort(key=lambda x: x["count"], reverse=True)
    return {"total": len(hotspots), "data": hotspots}


@router.get("/issues/clusters")
def get_clusters(request: Request):
    viewer = identify_viewer(request)
    if viewer.get("role") not in ("sub_admin", "super_admin"):
        raise HTTPException(status_code=403, detail="Admin access only")
    query = scoped_issues(viewer)
    issues = list(issues_collection.find(query))
    return {"total": len(issues), "data": build_clusters(issues)}


@router.get("/analytics")
def get_analytics(request: Request, admin=Depends(require_admin)):
    query = scoped_issues(admin)
    issues = list(issues_collection.find(query))
    by_category, by_area, by_status, by_priority = {}, {}, {}, {}
    resolved_times = []
    for issue in issues:
        by_category[issue.get("category") or "Other"] = by_category.get(issue.get("category") or "Other", 0) + 1
        by_area[issue.get("location_area") or "Unknown"] = by_area.get(issue.get("location_area") or "Unknown", 0) + 1
        by_status[issue.get("status") or "pending"] = by_status.get(issue.get("status") or "pending", 0) + 1
        level = issue.get("priority_level") or (issue.get("priority") or "MEDIUM").upper()
        by_priority[level] = by_priority.get(level, 0) + 1
        if issue.get("status") == "resolved" and issue.get("created_at"):
            history = issue.get("status_history") or []
            resolved_at = next((h.get("updated_at") for h in reversed(history) if h.get("status") == "resolved"), None)
            if resolved_at and issue.get("created_at"):
                try:
                    resolved_times.append((resolved_at - issue["created_at"]).total_seconds() / 3600)
                except Exception:
                    pass
    total = len(issues)
    resolved = by_status.get("resolved", 0)
    pending = by_status.get("pending", 0) + by_status.get("under_review", 0)
    alerts = []
    for area, count in by_area.items():
        if count >= 5:
            alerts.append({"type": "hotspot", "message": f"High number of complaints in {area} ({count})"})
    for issue in issues:
        if issue.get("safety_risk"):
            alerts.append({"type": "safety", "message": f"Critical safety issue detected: {issue.get('title')}"})
        if issue.get("status") in ("pending", "in_progress") and issue.get("created_at"):
            age_days = (datetime.utcnow() - issue["created_at"]).days if not isinstance(issue["created_at"], str) else 0
            if age_days >= 14:
                alerts.append({"type": "overdue", "message": f"Unresolved beyond threshold: {issue.get('title')}"})
    return {
        "total_issues": total,
        "resolved": resolved,
        "pending": pending,
        "in_progress": by_status.get("in_progress", 0),
        "resolution_rate": round((resolved / total) * 100, 1) if total else 0,
        "avg_resolution_hours": round(sum(resolved_times) / len(resolved_times), 1) if resolved_times else None,
        "by_category": by_category,
        "by_area": by_area,
        "by_status": by_status,
        "by_priority": by_priority,
        "alerts": alerts[:12],
        "scope": {
            "categories": admin.get("categories"),
            "areas": admin.get("areas"),
            "role": admin.get("role"),
        },
    }


@router.get("/issues/user/{user_id}")
def get_issues_by_user(user_id: str, request: Request):
    try:
        viewer = identify_viewer(request)
        role = viewer.get("role")
        viewer_id = viewer.get("user_id")
        if not (viewer_id == user_id or role in ("super_admin", "sub_admin")):
            raise HTTPException(status_code=403, detail="Not authorized to view these issues")
        query = {"created_by": user_id, "is_deleted": {"$ne": True}}
        issues = []
        for issue in issues_collection.find(query).sort("created_at", -1):
            if role == "sub_admin" and not has_scope_access(viewer, issue):
                continue
            serialize_issue(issue)
            strip_reporter_info_if_needed(issue, viewer)
            issues.append(issue)
        return {"total": len(issues), "data": issues}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/notifications")
def list_notifications(current_user=Depends(get_current_user)):
    items = []
    for note in notifications_collection.find({"user_id": current_user["user_id"]}).sort("created_at", -1).limit(30):
        note["_id"] = str(note["_id"])
        note["created_at"] = str(note.get("created_at", ""))
        items.append(note)
    return {"total": len(items), "data": items}


@router.get("/issues/{issue_id}")
def get_issue(issue_id: str, request: Request):
    try:
        issue = issues_collection.find_one({"_id": ObjectId(issue_id), "is_deleted": {"$ne": True}})
        if not issue:
            raise HTTPException(status_code=404, detail="Issue not found")
        viewer = identify_viewer(request)
        if viewer.get("role") == "sub_admin" and not has_scope_access(viewer, issue):
            raise HTTPException(status_code=403, detail="Not authorized to view this issue")
        serialize_issue(issue)
        strip_reporter_info_if_needed(issue, viewer)
        return issue
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.patch("/issues/{issue_id}/status")
def update_issue_status(
    issue_id: str,
    status: str = Form(...),
    note: str = Form(None),
    admin=Depends(require_admin),
):
    try:
        if status not in ALLOWED_STATUSES:
            raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of {sorted(ALLOWED_STATUSES)}")
        issue = issues_collection.find_one({"_id": ObjectId(issue_id), "is_deleted": {"$ne": True}})
        if not issue:
            raise HTTPException(status_code=404, detail="Issue not found")
        if not has_scope_access(admin, issue):
            raise HTTPException(status_code=403, detail="Not authorized for this department/area")

        current = issue.get("status") or "PENDING"
        allowed = STATUS_TRANSITIONS.get(current, set())
        if status not in allowed and status != current:
            raise HTTPException(status_code=422, detail=f"Cannot change status from {current} to {status}")

        history_entry = {
            "status": status,
            "updated_at": datetime.utcnow(),
            "updated_by": admin.get("user_id"),
            "note": note or f"Status changed to {status}",
        }
        issues_collection.update_one(
            {"_id": ObjectId(issue_id)},
            {"$set": {"status": status}, "$push": {"status_history": history_entry}},
        )
        log_audit_action(
            performed_by=admin.get("user_id"),
            role=admin.get("role"),
            action="STATUS_UPDATE",
            target_type="issue",
            target_id=issue_id,
            previous_val={"status": current},
            new_val={"status": status},
        )
        notify(issue.get("created_by"), "Status Changed", f"Issue \u201c{issue.get('title')}\u201d is now {status}.", issue_id)
        if status in ("resolved", "resolution_submitted", "community_verification"):
            notify(issue.get("created_by"), "Community Verification Required", "Please confirm whether this issue is actually resolved.", issue_id)

        return {"message": "Status & Timeline updated successfully", "status": status}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# @router.patch("/issues/{issue_id}/status")
# def update_issue_status(
#     issue_id: str,
#     status: str = Form(...),
#     note: str = Form(None),
#     admin=Depends(require_admin),
# ):
#     try:
#         if status not in ALLOWED_STATUSES:
#             raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of {sorted(ALLOWED_STATUSES)}")
#         issue = issues_collection.find_one({"_id": ObjectId(issue_id), "is_deleted": {"$ne": True}})
#         if not issue:
#             raise HTTPException(status_code=404, detail="Issue not found")
#         if not has_scope_access(admin, issue):
#             raise HTTPException(status_code=403, detail="Not authorized for this department/area")
#         current = issue.get("status") or "PENDING"
#         allowed = STATUS_TRANSITIONS.get(current, set())
#         if status not in allowed and status != current:
#             raise HTTPException(status_code=400, detail=f"Transition from {current} to {status} is not allowed.")

#         update_data = {"status": status}
#         timeline_entry = {
#             "status": status,
#             "updated_at": datetime.utcnow(),
#             "updated_by": admin["user_id"],
#             "note": note,
#         }
#         issues_collection.update_one(
#             {"_id": ObjectId(issue_id)},
#             {"$set": update_data, "$push": {"status_history": timeline_entry}},
#         )
#         log_audit_action(admin["user_id"], "update_status", issue_id, {"status": status, "note": note})
#         # notify(
#         #     issue.get("created_by"),
#         #     f"Status of “{issue.get('title')}” Updated",
#         #     f"The status of your issue has been updated to {status}.",
#         #     issue_id,
#         # )
#         return {"message": "Issue status updated successfully"}
#     except HTTPException:
#         raise
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))
#             raise HTTPException(status_code=422, detail=f"Cannot change status from {current} to {status}")
#         history_entry = {
#             "status": status,
#             "updated_at": datetime.utcnow(),
#             "updated_by": admin.get("user_id"),
#             "note": note or f"Status changed to {status}",
#         }
#         issues_collection.update_one(
#             {"_id": ObjectId(issue_id)},
#             {"$set": {"status": status}, "$push": {"status_history": history_entry}},
#         )
#         log_audit_action(
#             performed_by=admin.get("user_id"),
#             role=admin.get("role"),
#             action="STATUS_UPDATE",
#             target_type="issue",
#             target_id=issue_id,
#             previous_val={"status": current},
#             new_val={"status": status},
#         )
#         notify(issue.get("created_by"), "Status Changed", f"Issue “{issue.get('title')}” is now {status}.", issue_id)
#         if status in ("resolved", "resolution_submitted", "community_verification"):
#             notify(issue.get("created_by"), "Community Verification Required", "Please confirm whether this issue is actually resolved.", issue_id)
#         return {"message": "Status & Timeline updated successfully", "status": status}
#     except HTTPException:
#         raise
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))


@router.delete("/issues/{issue_id}")
def delete_issue(issue_id: str, admin=Depends(require_admin)):
    try:
        issue = issues_collection.find_one({"_id": ObjectId(issue_id), "is_deleted": {"$ne": True}})
        if not issue:
            raise HTTPException(status_code=404, detail="Issue not found")
        if not has_scope_access(admin, issue):
            raise HTTPException(status_code=403, detail="Not authorized for this department/area")
        issues_collection.update_one(
            {"_id": ObjectId(issue_id)},
            {"$set": {"is_deleted": True, "deleted_at": datetime.utcnow(), "deleted_by": admin.get("user_id")}},
        )
        log_audit_action(
            performed_by=admin.get("user_id"),
            role=admin.get("role"),
            action="ISSUE_DELETE",
            target_type="issue",
            target_id=issue_id,
            previous_val={"is_deleted": False},
            new_val={"is_deleted": True},
        )
        return {"message": "Issue deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/issues/{issue_id}/support")
def support_issue(issue_id: str, current_user=Depends(get_current_user)):
    try:
        user_id = current_user.get("user_id")
        issue = issues_collection.find_one({"_id": ObjectId(issue_id), "is_deleted": {"$ne": True}})
        if not issue:
            raise HTTPException(status_code=404, detail="Issue not found")
        supports = issue.get("supports") or []
        if user_id in supports:
            issues_collection.update_one({"_id": ObjectId(issue_id)}, {"$pull": {"supports": user_id}})
            return {"message": "Support removed", "supported": False}
        issues_collection.update_one({"_id": ObjectId(issue_id)}, {"$addToSet": {"supports": user_id}})
        support_count = len(set(supports + [user_id]))
        priority = compute_priority(
            severity=issue.get("severity_level") or issue.get("ai_severity"),
            safety_risk=issue.get("safety_risk", False),
            support_count=support_count,
            has_evidence=bool(issue.get("photo_url")),
            frequency=issue.get("frequency"),
            ai_priority=issue.get("ai_severity"),
        )
        issues_collection.update_one({"_id": ObjectId(issue_id)}, {"$set": priority})
        return {"message": "Supported issue successfully", "supported": True}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/issues/{issue_id}/comments")
def add_comment(issue_id: str, message: str = Form(...), current_user=Depends(get_current_user)):
    issue = issues_collection.find_one({"_id": ObjectId(issue_id), "is_deleted": {"$ne": True}})
    if not issue:
        raise HTTPException(status_code=404, detail="Issue not found")
    if current_user.get("role") == "sub_admin" and not has_scope_access(current_user, issue):
        raise HTTPException(status_code=403, detail="Not authorized for this issue")
    comment = {
        "user_id": current_user.get("user_id"),
        "name": current_user.get("name") or "Citizen",
        "message": message.strip(),
        "created_at": datetime.utcnow(),
    }
    if not comment["message"]:
        raise HTTPException(status_code=422, detail="Comment cannot be empty")
    issues_collection.update_one({"_id": ObjectId(issue_id)}, {"$push": {"comments": comment}})
    notify(issue.get("created_by"), "New Comment", f"{comment['name']} commented on your report.", issue_id)
    comment["created_at"] = str(comment["created_at"])
    return {"message": "Comment added", "data": comment}


@router.post("/issues/{issue_id}/verify")
def verify_resolution(issue_id: str, resolved: str = Form(...), current_user=Depends(get_current_user)):
    issue = issues_collection.find_one({"_id": ObjectId(issue_id), "is_deleted": {"$ne": True}})
    if not issue:
        raise HTTPException(status_code=404, detail="Issue not found")
    if issue.get("status") not in ("resolved", "resolution_submitted", "community_verification"):
        raise HTTPException(status_code=422, detail="This issue is not awaiting community verification")
    vote = "yes" if str(resolved).lower() in ("true", "1", "yes") else "no"
    votes = issue.get("community_votes") or {}
    votes[current_user["user_id"]] = vote
    yes = sum(1 for v in votes.values() if v == "yes")
    no = sum(1 for v in votes.values() if v == "no")
    update = {"community_votes": votes}
    history_note = None
    new_status = issue.get("status")
    if no >= 3 and no > yes:
        new_status = "reopened"
        update["status"] = new_status
        history_note = "Community reported the issue still exists. Reopened for review."
    elif yes >= 3 and yes > no:
        new_status = "resolved"
        update["status"] = new_status
        history_note = "Community verified the resolution."
    else:
        new_status = "community_verification"
        update["status"] = new_status
    ops = {"$set": update}
    if history_note:
        ops["$push"] = {
            "status_history": {
                "status": new_status,
                "updated_at": datetime.utcnow(),
                "updated_by": current_user.get("user_id"),
                "note": history_note,
            }
        }
    issues_collection.update_one({"_id": ObjectId(issue_id)}, ops)
    return {"message": "Verification recorded", "vote": vote, "yes": yes, "no": no, "status": new_status}


@router.post("/issues/{issue_id}/resolution-evidence")
async def upload_resolution_evidence(
    issue_id: str,
    file: UploadFile = File(...),
    admin=Depends(require_admin),
):
    issue = issues_collection.find_one({"_id": ObjectId(issue_id), "is_deleted": {"$ne": True}})
    if not issue:
        raise HTTPException(status_code=404, detail="Issue not found")
    if not has_scope_access(admin, issue):
        raise HTTPException(status_code=403, detail="Not authorized for this department/area")
    content = await file.read()
    try:
        ext = validate_upload(file.filename, file.content_type, len(content))
    except ValueError as ve:
        raise HTTPException(status_code=422, detail=str(ve))
    os.makedirs("uploads", exist_ok=True)
    path = f"uploads/{uuid.uuid4()}{ext}"
    with open(path, "wb") as buffer:
        buffer.write(content)
    confidence = 88 if issue.get("photo_url") else 55
    issues_collection.update_one(
        {"_id": ObjectId(issue_id)},
        {
            "$set": {
                "resolution_photo_url": path,
                "resolution_confidence": confidence,
                "resolution_ai_result": "Likely Resolved" if confidence >= 70 else "Needs Review",
                "status": "resolution_submitted",
            },
            "$push": {
                "status_history": {
                    "status": "resolution_submitted",
                    "updated_at": datetime.utcnow(),
                    "updated_by": admin.get("user_id"),
                    "note": "Resolution evidence uploaded",
                }
            },
        },
    )
    notify(issue.get("created_by"), "Resolution Submitted", "Please verify whether the issue is actually resolved.", issue_id)
    return {
        "message": "Resolution evidence uploaded",
        "resolution_photo_url": path,
        "resolution_confidence": confidence,
        "result": "Likely Resolved" if confidence >= 70 else "Needs Review",
    }