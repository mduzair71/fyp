
# from fastapi import APIRouter, HTTPException, File, UploadFile, Form, Depends, Request
# from database import issues_collection, users_collection, notifications_collection
# from bson import ObjectId

# from routes.auth import require_admin, get_current_user, log_audit_action
# from models.issue import CATEGORY_DEPARTMENT_MAP
# from utils.scope import has_scope_access, scoped_issue_query
# from utils.ai_analyzer import analyze_issue, check_duplicate_with_ai
# from utils.uploads import validate_upload
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


# # =====================================================================
# # LEVEL 1 STATUS SYSTEM
# # The full lifecycle an issue can move through, and which transitions
# # are legal from each status. Sub Admin status updates are validated
# # against STATUS_TRANSITIONS in update_issue_status() below.
# # =====================================================================
# ALLOWED_STATUSES = {
#     "PENDING", "IN_PROGRESS", "RESOLVED", "REJECTED"
# }

# STATUS_TRANSITIONS = {
#     "PENDING": {"IN_PROGRESS", "REJECTED"},
#     "IN_PROGRESS": {"RESOLVED", "REJECTED"},
#     "RESOLVED": set(),
#     "REJECTED": set(),
# }


# # =====================================================================
# # HELPERS
# # =====================================================================

# def serialize_issue(issue: dict) -> dict:
#     """Converts Mongo-specific types (ObjectId, datetime) to strings so an
#     issue document can be safely returned as JSON."""
#     issue["_id"] = str(issue["_id"])
#     if issue.get("created_at"):
#         issue["created_at"] = str(issue["created_at"])
#     return issue


# def strip_reporter_info_if_needed(issue: dict, viewer: dict):
#     """Removes the reporter's name/CNIC/phone from an issue unless the
#     viewer is the reporter themselves, a Super Admin, or a Sub Admin whose
#     scope covers this issue."""
#     role = viewer.get("role")
#     user_id = viewer.get("user_id")
#     is_owner = user_id is not None and user_id == issue.get("created_by")
#     is_privileged = role == "super_admin" or (role == "sub_admin" and has_scope_access(viewer, issue))
#     if not (is_owner or is_privileged):
#         issue.pop("reporter_name", None)
#         issue.pop("reporter_cnic", None)
#         issue.pop("reporter_phone", None)


# def identify_viewer(request: Request) -> dict:
#     """Like get_current_user, but never raises -- returns an empty dict for
#     anonymous/invalid-token visitors instead of a 401, since public GET
#     endpoints need to work for logged-out visitors too."""
#     if not request.cookies.get("token"):
#         return {}
#     try:
#         payload = get_current_user(request)
#         if payload.get("role") == "admin":
#             payload["role"] = "sub_admin"
#         return payload
#     except Exception:
#         return {}


# def scoped_issues(viewer: dict):
#     """Builds the Mongo query for GET /issues: everyone gets non-deleted
#     issues, and Sub Admins get it further narrowed to their assigned
#     category/area/district via scoped_issue_query()."""
#     query = {"is_deleted": {"$ne": True}}
#     if viewer.get("role") == "sub_admin":
#         query.update(scoped_issue_query(viewer))
#     return query


# # =====================================================================
# # CREATE ISSUE  (citizen reports a new civic issue)
# # =====================================================================
# @router.post("/issues")
# async def create_issue(
#     request: Request,
#     category: str = Form(...),
#     problem_type: str = Form(None),
#     title: str = Form(...),
#     description: str = Form(...),
#     location_area: str = Form(...),
#     location_district: str = Form(...),
#     location_latitude: float = Form(None),
#     location_longitude: float = Form(None),
#     additional_info: str = Form(None),
#     location_landmark: str = Form(None),
#     occurred_date: str = Form(None),
#     frequency: str = Form(None),
#     severity_level: str = Form(None),
#     is_anonymous: str = Form("false"),
#     created_by: str = Form(...),
#     file: UploadFile = File(None),
# ):
#     try:
#         reporter = users_collection.find_one({"_id": ObjectId(created_by)})
#         if not reporter:
#             raise HTTPException(status_code=404, detail="User not found")

#         viewer = identify_viewer(request)
#         if viewer.get("user_id") and viewer["user_id"] != created_by:
#             raise HTTPException(status_code=403, detail="You can only report issues as yourself")

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
#             "problem_type": problem_type,
#             "title": title,
#             "description": description,
#             "location": {
#                 "area": location_area,
#                 "district": location_district,
#                 "latitude": location_latitude,
#                 "longitude": location_longitude,
#                 "landmark": location_landmark,
#             },
#             "additional_info": additional_info,
#             "occurred_date": occurred_date,
#             "frequency": frequency,
#             "severity_level": severity_level,
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
#             "is_deleted": False,
#             "created_at": datetime.utcnow(),
#         }

#         # AI summary + priority classification (Claude). Never blocks issue
#         # creation -- analyze_issue() falls back safely on any AI failure.
#         ai_result = analyze_issue(title, description, f"{location_area}, {location_district}")
#         issue_data["summary"] = ai_result["summary"]
#         issue_data["priority"] = ai_result["priority"]
#            # =====================================================================
#         # DUPLICATE DETECTION LOGIC (AI-based via Gemini)
#         # =====================================================================
#         # Pehle same category + same district ke narrow candidates nikalo,
#         # taake Gemini ko pura database na bhejna pade.
#         existing_issues = list(issues_collection.find({
#             "category": category,
#             "location.district": location_district,
#             "status": {"$in": ["PENDING", "IN_PROGRESS"]},
#             "is_deleted": {"$ne": True}
#         }).limit(15))

#         dup_result = check_duplicate_with_ai(title, description, existing_issues)
#         possible_duplicate = dup_result["is_duplicate"]
#         duplicate_parent_id = dup_result["matched_issue_id"]

#         # Agar upload wali file hai to pehle usse handle kar lo (dono
#         # cases -- duplicate ho ya naya issue -- mein zaroorat pad sakti hai)
#         uploaded_photo_url = None
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
#             uploaded_photo_url = file_path

#         if possible_duplicate and duplicate_parent_id:
#             # Naya issue create MAT karo -- purane issue ka count badhao
#             try:
#                 parent_oid = ObjectId(duplicate_parent_id)
#             except Exception:
#                 parent_oid = None

#             if parent_oid:
#                 issues_collection.update_one(
#                     {"_id": parent_oid},
#                     {
#                         "$inc": {"report_count": 1},
#                         "$addToSet": {"reported_by": created_by},
#                     },
#                 )
#                 updated_issue = issues_collection.find_one({"_id": parent_oid})
#                 return {
#                     "message": "This issue was already reported. Your report has been added to it.",
#                     "possible_duplicate": True,
#                     "duplicate_of": duplicate_parent_id,
#                     "data": serialize_issue(updated_issue),
#                 }

#         # Duplicate nahi mila -- naya issue banao
#         issue_data["is_duplicate"] = False
#         issue_data["duplicate_of"] = None
#         issue_data["report_count"] = 1
#         issue_data["reported_by"] = [created_by]
#         if uploaded_photo_url:
#             issue_data["photo_url"] = uploaded_photo_url

#         result = issues_collection.insert_one(issue_data)
#         inserted_issue = issues_collection.find_one({"_id": result.inserted_id})
#         return {
#             "message": "Issue reported successfully",
#             "possible_duplicate": False,
#             "duplicate_of": None,
#             "data": serialize_issue(inserted_issue),
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

#         result = issues_collection.insert_one(issue_data)
#         inserted_issue = issues_collection.find_one({"_id": result.inserted_id})
#         return {
#             "message": "Issue reported successfully",
#             "possible_duplicate": possible_duplicate,
#             "duplicate_of": duplicate_parent_id,
#             "data": serialize_issue(inserted_issue)
#         }
#         # return {"message": "Issue reported successfully", "possible_duplicate": False, "data": serialize_issue(inserted_issue)}
#     except HTTPException:
#         raise
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))


# # =====================================================================
# # LIST ISSUES  (scoped by role: public sees all, Sub Admin sees only
# # their assigned category/area/district)
# # =====================================================================
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


# # =====================================================================
# # GEO / HEATMAP / CLUSTERS  (map & analytics views, scoped same as above)
# # =====================================================================
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


# # =====================================================================
# # ANALYTICS  (admin-only dashboard summary numbers)
# # =====================================================================
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


# # =====================================================================
# # CITIZEN'S OWN ISSUES  ("My Reports" page)
# # =====================================================================
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


# # =====================================================================
# # NOTIFICATIONS  (in-app notification list for the logged-in user)
# # =====================================================================
# @router.get("/notifications")
# def list_notifications(current_user=Depends(get_current_user)):
#     items = []
#     for note in notifications_collection.find({"user_id": current_user["user_id"]}).sort("created_at", -1).limit(30):
#         note["_id"] = str(note["_id"])
#         note["created_at"] = str(note.get("created_at", ""))
#         items.append(note)
#     return {"total": len(items), "data": items}


# # =====================================================================
# # SINGLE ISSUE DETAILS
# # =====================================================================
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


# # =====================================================================
# # UPDATE ISSUE STATUS  (Sub Admin / Super Admin only, scope-checked,
# # transition-validated against STATUS_TRANSITIONS above)
# # =====================================================================
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


# # =====================================================================
# # DELETE ISSUE  (soft delete -- Sub Admin / Super Admin only, scope-checked)
# # =====================================================================
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


# # =====================================================================
# # SUPPORT AN ISSUE  (citizen "I'm affected too" toggle)
# # =====================================================================
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


# # =====================================================================
# # COMMENTS  (citizen/admin discussion thread on an issue)
# # =====================================================================
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


# # =====================================================================
# # COMMUNITY VERIFICATION  (NOT part of Level 1 -- uses statuses outside
# # ALLOWED_STATUSES like "resolution_submitted"/"community_verification"/
# # "reopened". Left as-is per your request not to change working code,
# # but flagged: calling this will write a status your Level 1
# # ALLOWED_STATUSES/STATUS_TRANSITIONS don't recognize.)
# # =====================================================================
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


# # =====================================================================
# # RESOLUTION EVIDENCE UPLOAD  (NOT part of Level 1 -- writes status
# # "resolution_submitted" which is outside ALLOWED_STATUSES. Left as-is
# # per your request, same flag as verify_resolution above.)
# # =====================================================================
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
from fastapi import APIRouter, HTTPException, File, UploadFile, Form, Depends, Request
from database import issues_collection, users_collection, notifications_collection
from bson import ObjectId

from routes.auth import require_admin, get_current_user, log_audit_action
from models.issue import CATEGORY_DEPARTMENT_MAP
from utils.scope import has_scope_access, scoped_issue_query
from utils.ai_analyzer import analyze_issue, check_duplicate_with_ai
from utils.uploads import validate_upload
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

ALLOWED_STATUSES = {"PENDING", "IN_PROGRESS", "RESOLVED", "REJECTED"}

STATUS_TRANSITIONS = {
    "PENDING": {"IN_PROGRESS", "REJECTED"},
    "IN_PROGRESS": {"RESOLVED", "REJECTED"},
    "RESOLVED": set(),
    "REJECTED": set(),
}

def serialize_issue(issue: dict) -> dict:
    issue["_id"] = str(issue["_id"])
    if issue.get("created_at"):
        issue["created_at"] = str(issue["created_at"])
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

def scoped_issues(viewer: dict):
    query = {"is_deleted": {"$ne": True}}
    if viewer.get("role") == "sub_admin":
        query.update(scoped_issue_query(viewer))
    return query

# =====================================================================
# CREATE ISSUE 
# =====================================================================
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
    file: UploadFile = File(None),
):
    try:
        reporter = users_collection.find_one({"_id": ObjectId(created_by)})
        if not reporter:
            raise HTTPException(status_code=404, detail="User not found")

        viewer = identify_viewer(request)
        if viewer.get("user_id") and viewer["user_id"] != created_by:
            raise HTTPException(status_code=403, detail="You can only report issues as yourself")

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
            "is_deleted": False,
            "created_at": datetime.utcnow(),
        }

        # AI summary & priority
        ai_result = analyze_issue(title, description, f"{location_area}, {location_district}")
        issue_data["summary"] = ai_result.get("summary", "")
        issue_data["priority"] = ai_result.get("priority", "MEDIUM")

        # Duplicate detection candidates
        existing_issues = list(issues_collection.find({
            "category": category,
            "location.district": location_district,
            "status": {"$in": ["PENDING", "IN_PROGRESS"]},
            "is_deleted": {"$ne": True}
        }).limit(15))

        dup_result = check_duplicate_with_ai(title, description, existing_issues)
        possible_duplicate = dup_result.get("is_duplicate", False)
        duplicate_parent_id = dup_result.get("matched_issue_id")

        # Handle File Upload
        uploaded_photo_url = None
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
            uploaded_photo_url = file_path

        if possible_duplicate and duplicate_parent_id:
            try:
                parent_oid = ObjectId(duplicate_parent_id)
            except Exception:
                parent_oid = None

            if parent_oid:
                issues_collection.update_one(
                    {"_id": parent_oid},
                    {
                        "$inc": {"report_count": 1},
                        "$addToSet": {"reported_by": created_by},
                    },
                )
                updated_issue = issues_collection.find_one({"_id": parent_oid})
                return {
                    "message": "This issue was already reported. Your report has been added to it.",
                    "possible_duplicate": True,
                    "duplicate_of": duplicate_parent_id,
                    "data": serialize_issue(updated_issue),
                }

        # Create New Issue
        issue_data["is_duplicate"] = False
        issue_data["duplicate_of"] = None
        issue_data["report_count"] = 1
        issue_data["reported_by"] = [created_by]
        if uploaded_photo_url:
            issue_data["photo_url"] = uploaded_photo_url

        result = issues_collection.insert_one(issue_data)
        inserted_issue = issues_collection.find_one({"_id": result.inserted_id})
        return {
            "message": "Issue reported successfully",
            "possible_duplicate": False,
            "duplicate_of": None,
            "data": serialize_issue(inserted_issue),
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# =====================================================================
# LIST ISSUES
# =====================================================================
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

# =====================================================================
# GEO / HEATMAP / CLUSTERS
# =====================================================================
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
            "location_area": issue.get("location_area") or (issue.get("location") or {}).get("area"),
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
        area = issue.get("location_area") or (issue.get("location") or {}).get("area") or "Unknown"
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

# =====================================================================
# ANALYTICS
# =====================================================================
@router.get("/analytics")
def get_analytics(request: Request, admin=Depends(require_admin)):
    query = scoped_issues(admin)
    issues = list(issues_collection.find(query))
    by_category, by_area, by_status, by_priority = {}, {}, {}, {}
    resolved_times = []
    for issue in issues:
        cat = issue.get("category") or "Other"
        area = issue.get("location_area") or (issue.get("location") or {}).get("area") or "Unknown"
        stat = issue.get("status") or "PENDING"
        
        by_category[cat] = by_category.get(cat, 0) + 1
        by_area[area] = by_area.get(area, 0) + 1
        by_status[stat] = by_status.get(stat, 0) + 1
        
        level = issue.get("priority_level") or (issue.get("priority") or "MEDIUM").upper()
        by_priority[level] = by_priority.get(level, 0) + 1
        
        if issue.get("status") == "RESOLVED" and issue.get("created_at"):
            history = issue.get("status_history") or []
            resolved_at = next((h.get("updated_at") for h in reversed(history) if h.get("status") == "RESOLVED"), None)
            if resolved_at and isinstance(issue["created_at"], datetime):
                try:
                    resolved_times.append((resolved_at - issue["created_at"]).total_seconds() / 3600)
                except Exception:
                    pass
    total = len(issues)
    resolved = by_status.get("RESOLVED", 0)
    pending = by_status.get("PENDING", 0)
    alerts = []
    for area, count in by_area.items():
        if count >= 5:
            alerts.append({"type": "hotspot", "message": f"High number of complaints in {area} ({count})"})
    
    return {
        "total_issues": total,
        "resolved": resolved,
        "pending": pending,
        "in_progress": by_status.get("IN_PROGRESS", 0),
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

# =====================================================================
# CITIZEN'S OWN ISSUES
# =====================================================================
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

# =====================================================================
# NOTIFICATIONS
# =====================================================================
@router.get("/notifications")
def list_notifications(current_user=Depends(get_current_user)):
    items = []
    for note in notifications_collection.find({"user_id": current_user["user_id"]}).sort("created_at", -1).limit(30):
        note["_id"] = str(note["_id"])
        note["created_at"] = str(note.get("created_at", ""))
        items.append(note)
    return {"total": len(items), "data": items}

# =====================================================================
# SINGLE ISSUE DETAILS
# =====================================================================
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

# =====================================================================
# UPDATE ISSUE STATUS
# =====================================================================
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
        notify(issue.get("created_by"), "Status Changed", f"Issue \"{issue.get('title')}\" is now {status}.", issue_id)

        return {"message": "Status & Timeline updated successfully", "status": status}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# =====================================================================
# DELETE ISSUE
# =====================================================================
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

# =====================================================================
# SUPPORT AN ISSUE
# =====================================================================
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

# =====================================================================
# COMMENTS
# =====================================================================
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