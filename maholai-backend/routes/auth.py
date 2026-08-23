# from fastapi import APIRouter, HTTPException, Response, Request, Depends
# from models.user import UserRegister, UserLogin, SubAdminRegister, SubAdminUpdate
# from database import users_collection, audit_logs_collection
# from pymongo.errors import PyMongoError
# from config import JWT_SECRET_KEY

# import bcrypt
# import base64
# import jwt
# import datetime
# import os
# from bson import ObjectId

# router = APIRouter()

# SECRET_KEY = JWT_SECRET_KEY


# # ==================== AUDIT LOG HELPER ====================
# def log_audit_action(performed_by: str, role: str, action: str, target_type: str, target_id: str, previous_val=None, new_val=None):
#     try:
#         audit_logs_collection.insert_one({
#             "performed_by": str(performed_by) if performed_by else "system",
#             "role": role,
#             "action": action,
#             "target_type": target_type,
#             "target_id": str(target_id) if target_id else None,
#             "previous_val": previous_val,
#             "new_val": new_val,
#             "timestamp": datetime.datetime.utcnow()
#         })
#     except Exception as e:
#         print(f"Audit log insertion failed: {e}")


# # ==================== GET CURRENT USER ====================
# def get_current_user(request: Request):
#     token = request.cookies.get("token")
#     if not token:
#         raise HTTPException(status_code=401, detail="Not authenticated")

#     try:
#         payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
#         user_id = payload.get("user_id")
#         if user_id:
#             try:
#                 db_user = users_collection.find_one({"_id": ObjectId(user_id)})
#                 if db_user:
#                     if db_user.get("status") == "inactive":
#                         raise HTTPException(status_code=403, detail="Account is deactivated")
#                     role = db_user.get("role", payload.get("role"))
#                     if role == "admin": role = "sub_admin"
#                     payload["role"] = role
#                     payload["department"] = db_user.get("department")
#                     payload["district"] = db_user.get("district")
#                     payload["area"] = db_user.get("area")
#                     payload["status"] = db_user.get("status", "active")
#             except HTTPException:
#                 raise
#             except Exception:
#                 pass
#         return payload
#     except jwt.ExpiredSignatureError:
#         raise HTTPException(status_code=401, detail="Token expired, please log in again")
#     except jwt.InvalidTokenError:
#         raise HTTPException(status_code=401, detail="Invalid token")


# # ==================== SUPER ADMIN GUARD ====================
# def require_super_admin(request: Request):
#     user = get_current_user(request)
#     if user.get("role") != "super_admin":
#         raise HTTPException(status_code=403, detail="Super Admin access only")
#     return user


# # ==================== ADMIN GUARD ====================
# def require_admin(request: Request):
#     """ Allows both 'sub_admin' and 'super_admin'. """
#     user = get_current_user(request)
#     role = user.get("role")
#     if role not in ("sub_admin", "super_admin", "admin"):
#         raise HTTPException(status_code=403, detail="Admin access only")
#     return user


# # ==================== GET CURRENT USER INFO ENDPOINT ====================
# @router.get("/auth/me")
# def get_me(user=Depends(get_current_user)):
#     return user


# # ==================== REGISTER (Citizen Only) ====================
# @router.post("/auth/register")
# def register(user: UserRegister):
#     """
#     New citizen signup. 
#     Role is strictly forced to "citizen".
#     """
#     try:
#         existing_user = users_collection.find_one({"cnic": user.cnic})
#         if existing_user:
#             raise HTTPException(status_code=400, detail="CNIC already registered")

#         hashed_password_bytes = bcrypt.hashpw(user.password.encode('utf-8'), bcrypt.gensalt())
#         hashed_password_str = base64.b64encode(hashed_password_bytes).decode('utf-8')

#         # Strictly force citizen role and null admin fields
#         user_data = {
#             "name": user.name,
#             "email": user.email,
#             "password": hashed_password_str,
#             "cnic": user.cnic,
#             "phone": user.phone,
#             "date_of_birth": user.date_of_birth,
#             "address": user.address,
#             "role": "citizen",
#             "department": None,
#             "area": None,
#             "district": None,
#             "status": "active",
#             "created_at": datetime.datetime.utcnow()
#         }

#         result = users_collection.insert_one(user_data)

#         return {
#             "message": "User registered successfully",
#             "user_id": str(result.inserted_id),
#             "name": user.name,
#             "cnic": user.cnic,
#             "role": "citizen"
#         }

#     except HTTPException:
#         raise
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))


# # ==================== CREATE SUB ADMIN ====================
# @router.post("/auth/create-sub-admin")
# def create_sub_admin(admin: SubAdminRegister, super_admin_user=Depends(require_super_admin)):
#     """
#     Create a Sub Admin. Only accessible by Super Admin.
#     """
#     try:
#         existing = users_collection.find_one({"cnic": admin.cnic})
#         if existing:
#             raise HTTPException(status_code=400, detail="CNIC already registered")

#         hashed_password_bytes = bcrypt.hashpw(admin.password.encode('utf-8'), bcrypt.gensalt())
#         hashed_password_str = base64.b64encode(hashed_password_bytes).decode('utf-8')

#         admin_data = {
#             "name": admin.name,
#             "email": admin.email,
#             "password": hashed_password_str,
#             "cnic": admin.cnic,
#             "role": "sub_admin",
#             "department": admin.department,
#             "district": admin.district,
#             "area": admin.area,
#             "status": admin.status or "active",
#             "created_at": datetime.datetime.utcnow()
#         }

#         result = users_collection.insert_one(admin_data)
#         admin_id_str = str(result.inserted_id)

#         log_audit_action(
#             performed_by=super_admin_user.get("user_id"),
#             role="super_admin",
#             action="CREATE_SUB_ADMIN",
#             target_type="user",
#             target_id=admin_id_str,
#             new_val={
#                 "name": admin.name,
#                 "email": admin.email,
#                 "department": admin.department,
#                 "district": admin.district,
#                 "area": admin.area,
#                 "status": admin.status
#             }
#         )

#         return {
#             "message": "Sub Admin created successfully",
#             "user_id": admin_id_str,
#             "name": admin.name,
#             "role": "sub_admin",
#             "department": admin.department,
#             "district": admin.district,
#             "area": admin.area,
#             "status": admin.status
#         }

#     except HTTPException:
#         raise
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))


# # ==================== GET ALL SUB ADMINS ====================
# @router.get("/auth/sub-admins")
# def list_sub_admins(super_admin_user=Depends(require_super_admin)):
#     """
#     Super Admin listing of all Sub Admins.
#     """
#     try:
#         admins = []
#         for user in users_collection.find({"role": {"$in": ["sub_admin", "admin"]}}).sort("created_at", -1):
#             user["_id"] = str(user["_id"])
#             if "password" in user:
#                 del user["password"]
#             if user.get("role") == "admin":
#                 user["role"] = "sub_admin"
#             user["created_at"] = str(user.get("created_at", ""))
#             admins.append(user)
#         return {"total": len(admins), "data": admins}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))


# # ==================== UPDATE SUB ADMIN ====================
# @router.patch("/auth/sub-admins/{admin_id}")
# def update_sub_admin(admin_id: str, data: SubAdminUpdate, super_admin_user=Depends(require_super_admin)):
#     """
#     Super Admin updating Sub Admin scope, role details, or status.
#     """
#     try:
#         existing = users_collection.find_one({"_id": ObjectId(admin_id)})
#         if not existing:
#             raise HTTPException(status_code=404, detail="Sub Admin not found")

#         update_fields = {}
#         if data.name is not None: update_fields["name"] = data.name
#         if data.email is not None: update_fields["email"] = data.email
#         if data.department is not None: update_fields["department"] = data.department
#         if data.district is not None: update_fields["district"] = data.district
#         if data.area is not None: update_fields["area"] = data.area
#         if data.status is not None: update_fields["status"] = data.status
#         if data.password:
#             hashed_password_bytes = bcrypt.hashpw(data.password.encode('utf-8'), bcrypt.gensalt())
#             update_fields["password"] = base64.b64encode(hashed_password_bytes).decode('utf-8')

#         if not update_fields:
#             return {"message": "No changes provided"}

#         users_collection.update_one({"_id": ObjectId(admin_id)}, {"$set": update_fields})

#         log_audit_action(
#             performed_by=super_admin_user.get("user_id"),
#             role="super_admin",
#             action="UPDATE_SUB_ADMIN",
#             target_type="user",
#             target_id=admin_id,
#             previous_val={k: existing.get(k) for k in update_fields if k != "password"},
#             new_val={k: v for k, v in update_fields.items() if k != "password"}
#         )

#         return {"message": "Sub Admin updated successfully", "admin_id": admin_id}
#     except HTTPException:
#         raise
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))


# # ==================== GET AUDIT LOGS ====================
# @router.get("/auth/audit-logs")
# def get_audit_logs(super_admin_user=Depends(require_super_admin)):
#     """
#     Super Admin audit log viewer.
#     """
#     try:
#         logs = []
#         for log in audit_logs_collection.find().sort("timestamp", -1).limit(100):
#             log["_id"] = str(log["_id"])
#             log["timestamp"] = str(log.get("timestamp", ""))
#             logs.append(log)
#         return {"total": len(logs), "data": logs}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))


# # ==================== LOGIN ====================
# @router.post("/auth/login")
# def login(user: UserLogin, response: Response):
#     """
#     Single login endpoint for Citizen, Sub Admin, and Super Admin.
#     """
#     try:
#         found_user = users_collection.find_one({"cnic": user.cnic})
#         if not found_user:
#             raise HTTPException(status_code=404, detail="User not found")

#         # Check status
#         if found_user.get("status") == "inactive":
#             raise HTTPException(status_code=403, detail="Account is deactivated")

#         stored_hash_bytes = base64.b64decode(found_user["password"])
#         if not bcrypt.checkpw(user.password.encode('utf-8'), stored_hash_bytes):
#             raise HTTPException(status_code=401, detail="Wrong password")
        
#         role = found_user.get("role", "citizen")
#         if role == "admin":
#             role = "sub_admin"

#         token_payload = {
#             "user_id": str(found_user["_id"]),
#             "cnic": found_user["cnic"],
#             "role": role,
#             "department": found_user.get("department"),
#             "district": found_user.get("district"),
#             "area": found_user.get("area"),
#             "exp": datetime.datetime.utcnow() + datetime.timedelta(days=7)
#         }

#         token = jwt.encode(token_payload, SECRET_KEY, algorithm="HS256")

#         response.set_cookie(
#             key="token",
#             value=token,
#             httponly=True,
#             secure=True,
#             samesite="lax",
#             max_age=7 * 24 * 60 * 60
#         )

#         return {
#             "message": "Login successful",
#             "user_id": str(found_user["_id"]),
#             "name": found_user["name"],
#             "role": role,
#             "department": found_user.get("department"),
#             "district": found_user.get("district"),
#             "area": found_user.get("area"),
#             "status": found_user.get("status", "active")
#         }

#     except HTTPException:
#         raise
#     except PyMongoError as pe:
#         print(f"MongoDB login error: {pe}")
#         raise HTTPException(
#             status_code=503,
#             detail="Database connection error. Please check internet connection or try again."
#         )
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))


# # ==================== LOGOUT ====================
# @router.post("/auth/logout")
# def logout(response: Response):
#     response.delete_cookie("token")
#     return {"message": "Logged out successfully"}


# from fastapi import APIRouter, HTTPException, Response, Request, Depends
# from models.user import UserRegister, UserLogin, SubAdminRegister, SubAdminUpdate
# from database import users_collection, audit_logs_collection
# from pymongo.errors import PyMongoError
# from config import JWT_SECRET_KEY

# import bcrypt
# import base64
# import jwt
# import datetime
# from bson import ObjectId

# router = APIRouter()

# SECRET_KEY = JWT_SECRET_KEY


# # ==================== AUDIT LOG HELPER ====================
# def log_audit_action(performed_by: str, role: str, action: str, target_type: str, target_id: str, previous_val=None, new_val=None):
#     try:
#         audit_logs_collection.insert_one({
#             "performed_by": str(performed_by) if performed_by else "system",
#             "role": role,
#             "action": action,
#             "target_type": target_type,
#             "target_id": str(target_id) if target_id else None,
#             "previous_val": previous_val,
#             "new_val": new_val,
#             "timestamp": datetime.datetime.utcnow()
#         })
#     except Exception as e:
#         print(f"Audit log insertion failed: {e}")


# # ==================== GET CURRENT USER ====================
# def get_current_user(request: Request):
#     token = request.cookies.get("token")
#     if not token:
#         raise HTTPException(status_code=401, detail="Not authenticated")

#     try:
#         payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
#         user_id = payload.get("user_id")
#         if user_id:
#             try:
#                 db_user = users_collection.find_one({"_id": ObjectId(user_id)})
#                 if db_user:
#                     if db_user.get("status") == "inactive":
#                         raise HTTPException(status_code=403, detail="Account is deactivated")
#                     role = db_user.get("role", payload.get("role"))
#                     if role == "admin":
#                         role = "sub_admin"
#                     payload["role"] = role
#                     payload["department"] = db_user.get("department")
#                     payload["district"] = db_user.get("district")
#                     payload["area"] = db_user.get("area")
#                     payload["status"] = db_user.get("status", "active")
#             except HTTPException:
#                 raise
#             except Exception:
#                 pass
#         return payload
#     except jwt.ExpiredSignatureError:
#         raise HTTPException(status_code=401, detail="Token expired, please log in again")
#     except jwt.InvalidTokenError:
#         raise HTTPException(status_code=401, detail="Invalid token")


# # ==================== SUPER ADMIN GUARD ====================
# def require_super_admin(request: Request):
#     user = get_current_user(request)
#     if user.get("role") != "super_admin":
#         raise HTTPException(status_code=403, detail="Super Admin access only")
#     return user


# # ==================== ADMIN GUARD (allows sub_admin + super_admin) ====================
# def require_admin(request: Request):
#     user = get_current_user(request)
#     role = user.get("role")
#     if role not in ("sub_admin", "super_admin"):
#         raise HTTPException(status_code=403, detail="Admin access only")
#     return user


# # ==================== GET CURRENT USER INFO ENDPOINT ====================
# @router.get("/auth/me")
# def get_me(user=Depends(get_current_user)):
#     return user


# # ==================== REGISTER (Citizen Only) ====================
# @router.post("/auth/register")
# def register(user: UserRegister):
#     """
#     New citizen signup. Role is strictly forced to "citizen".
#     Uniqueness enforced on both CNIC and email.
#     """
#     try:
#         if users_collection.find_one({"cnic": user.cnic}):
#             raise HTTPException(status_code=400, detail="CNIC already registered")
#         if users_collection.find_one({"email": user.email}):
#             raise HTTPException(status_code=400, detail="Email already registered")

#         hashed_password_bytes = bcrypt.hashpw(user.password.encode('utf-8'), bcrypt.gensalt())
#         hashed_password_str = base64.b64encode(hashed_password_bytes).decode('utf-8')

#         user_data = {
#             "name": user.name,
#             "email": user.email,
#             "password": hashed_password_str,
#             "cnic": user.cnic,
#             "phone": user.phone,
#             "date_of_birth": user.date_of_birth,
#             "address": user.address,
#             "role": "citizen",
#             "department": None,
#             "area": None,
#             "district": None,
#             "status": "active",
#             "created_at": datetime.datetime.utcnow()
#         }

#         result = users_collection.insert_one(user_data)

#         return {
#             "message": "User registered successfully",
#             "user_id": str(result.inserted_id),
#             "name": user.name,
#             "cnic": user.cnic,
#             "role": "citizen"
#         }

#     except HTTPException:
#         raise
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))


# # ==================== CREATE SUB ADMIN ====================
# @router.post("/auth/create-sub-admin")
# def create_sub_admin(admin: SubAdminRegister, super_admin_user=Depends(require_super_admin)):
#     """
#     Create a Sub Admin. Only accessible by Super Admin.
#     Uniqueness enforced on both CNIC and email.
#     """
#     try:
#         if users_collection.find_one({"cnic": admin.cnic}):
#             raise HTTPException(status_code=400, detail="CNIC already registered")
#         if users_collection.find_one({"email": admin.email}):
#             raise HTTPException(status_code=400, detail="Email already registered")

#         hashed_password_bytes = bcrypt.hashpw(admin.password.encode('utf-8'), bcrypt.gensalt())
#         hashed_password_str = base64.b64encode(hashed_password_bytes).decode('utf-8')

#         admin_data = {
#             "name": admin.name,
#             "email": admin.email,
#             "password": hashed_password_str,
#             "cnic": admin.cnic,
#             "role": "sub_admin",
#             "department": admin.department,
#             "district": admin.district,
#             "area": admin.area,
#             "status": admin.status or "active",
#             "created_at": datetime.datetime.utcnow()
#         }

#         result = users_collection.insert_one(admin_data)
#         admin_id_str = str(result.inserted_id)

#         log_audit_action(
#             performed_by=super_admin_user.get("user_id"),
#             role="super_admin",
#             action="CREATE_SUB_ADMIN",
#             target_type="user",
#             target_id=admin_id_str,
#             new_val={
#                 "name": admin.name,
#                 "email": admin.email,
#                 "department": admin.department,
#                 "district": admin.district,
#                 "area": admin.area,
#                 "status": admin.status
#             }
#         )

#         return {
#             "message": "Sub Admin created successfully",
#             "user_id": admin_id_str,
#             "name": admin.name,
#             "role": "sub_admin",
#             "department": admin.department,
#             "district": admin.district,
#             "area": admin.area,
#             "status": admin.status
#         }

#     except HTTPException:
#         raise
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))


# # ==================== GET ALL SUB ADMINS ====================
# @router.get("/auth/sub-admins")
# def list_sub_admins(super_admin_user=Depends(require_super_admin)):
#     try:
#         admins = []
#         for user in users_collection.find({"role": {"$in": ["sub_admin", "admin"]}}).sort("created_at", -1):
#             user["_id"] = str(user["_id"])
#             user.pop("password", None)
#             if user.get("role") == "admin":
#                 user["role"] = "sub_admin"
#             user["created_at"] = str(user.get("created_at", ""))
#             admins.append(user)
#         return {"total": len(admins), "data": admins}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))


# # ==================== UPDATE SUB ADMIN ====================
# @router.patch("/auth/sub-admins/{admin_id}")
# def update_sub_admin(admin_id: str, data: SubAdminUpdate, super_admin_user=Depends(require_super_admin)):
#     try:
#         existing = users_collection.find_one({"_id": ObjectId(admin_id)})
#         if not existing:
#             raise HTTPException(status_code=404, detail="Sub Admin not found")

#         update_fields = {}
#         if data.name is not None: update_fields["name"] = data.name
#         if data.email is not None: update_fields["email"] = data.email
#         if data.department is not None: update_fields["department"] = data.department
#         if data.district is not None: update_fields["district"] = data.district
#         if data.area is not None: update_fields["area"] = data.area
#         if data.status is not None: update_fields["status"] = data.status
#         if data.password:
#             hashed_password_bytes = bcrypt.hashpw(data.password.encode('utf-8'), bcrypt.gensalt())
#             update_fields["password"] = base64.b64encode(hashed_password_bytes).decode('utf-8')

#         if not update_fields:
#             return {"message": "No changes provided"}

#         users_collection.update_one({"_id": ObjectId(admin_id)}, {"$set": update_fields})

#         log_audit_action(
#             performed_by=super_admin_user.get("user_id"),
#             role="super_admin",
#             action="UPDATE_SUB_ADMIN",
#             target_type="user",
#             target_id=admin_id,
#             previous_val={k: existing.get(k) for k in update_fields if k != "password"},
#             new_val={k: v for k, v in update_fields.items() if k != "password"}
#         )

#         return {"message": "Sub Admin updated successfully", "admin_id": admin_id}
#     except HTTPException:
#         raise
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))


# # ==================== GET AUDIT LOGS ====================
# @router.get("/auth/audit-logs")
# def get_audit_logs(super_admin_user=Depends(require_super_admin)):
#     try:
#         logs = []
#         for log in audit_logs_collection.find().sort("timestamp", -1).limit(100):
#             log["_id"] = str(log["_id"])
#             log["timestamp"] = str(log.get("timestamp", ""))
#             logs.append(log)
#         return {"total": len(logs), "data": logs}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))


# # ==================== LOGIN ====================
# # NOTE: login is by CNIC + password, not email. Every login form on the
# # frontend (citizen /login, sub-admin/super-admin login) must collect and
# # send { cnic, password } — not { email, password } — or this will always
# # return "User not found".
# @router.post("/auth/login")
# def login(user: UserLogin, response: Response):
#     """
#     Single login endpoint for Citizen, Sub Admin, and Super Admin.
#     """
#     try:
#         found_user = users_collection.find_one({"cnic": user.cnic})
#         if not found_user:
#             raise HTTPException(status_code=404, detail="User not found")

#         if found_user.get("status") == "inactive":
#             raise HTTPException(status_code=403, detail="Account is deactivated")

#         stored_hash_bytes = base64.b64decode(found_user["password"])
#         if not bcrypt.checkpw(user.password.encode('utf-8'), stored_hash_bytes):
#             raise HTTPException(status_code=401, detail="Wrong password")

#         role = found_user.get("role", "citizen")
#         if role == "admin":
#             role = "sub_admin"

#         token_payload = {
#             "user_id": str(found_user["_id"]),
#             "cnic": found_user["cnic"],
#             "role": role,
#             "department": found_user.get("department"),
#             "district": found_user.get("district"),
#             "area": found_user.get("area"),
#             "exp": datetime.datetime.utcnow() + datetime.timedelta(days=7)
#         }

#         token = jwt.encode(token_payload, SECRET_KEY, algorithm="HS256")

#         response.set_cookie(
#             key="token",
#             value=token,
#             httponly=True,
#             secure=True,
#             samesite="lax",
#             max_age=7 * 24 * 60 * 60
#         )

#         return {
#             "message": "Login successful",
#             "user_id": str(found_user["_id"]),
#             "name": found_user["name"],
#             "role": role,
#             "department": found_user.get("department"),
#             "district": found_user.get("district"),
#             "area": found_user.get("area"),
#             "status": found_user.get("status", "active")
#         }

#     except HTTPException:
#         raise
#     except PyMongoError as pe:
#         print(f"MongoDB login error: {pe}")
#         raise HTTPException(
#             status_code=503,
#             detail="Database connection error. Please check internet connection or try again."
#         )
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))


# # ==================== LOGOUT ====================
# @router.post("/auth/logout")
# def logout(response: Response):
#     response.delete_cookie("token")
#     return {"message": "Logged out successfully"}
from fastapi import APIRouter, HTTPException, Response, Request, Depends
from models.user import UserRegister, UserLogin, SubAdminRegister, SubAdminUpdate
from database import users_collection, audit_logs_collection
from pymongo.errors import PyMongoError
from config import JWT_SECRET_KEY
from utils.scope import normalize_scope

import bcrypt
import base64
import jwt
import datetime
import os
from bson import ObjectId

router = APIRouter()

SECRET_KEY = JWT_SECRET_KEY
COOKIE_SECURE = os.getenv("COOKIE_SECURE", "false").lower() == "true"

_login_attempts = {}


def _rate_limit_auth(key: str, limit: int = 8, window_sec: int = 300):
    now = datetime.datetime.utcnow().timestamp()
    attempts = [t for t in _login_attempts.get(key, []) if now - t < window_sec]
    if len(attempts) >= limit:
        raise HTTPException(status_code=429, detail="Too many attempts. Try again later.")
    attempts.append(now)
    _login_attempts[key] = attempts


def _hash_password(password: str) -> str:
    hashed_password_bytes = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())
    return base64.b64encode(hashed_password_bytes).decode("utf-8")


def _set_auth_cookie(response: Response, token: str):
    response.set_cookie(
        key="token",
        value=token,
        httponly=True,
        secure=COOKIE_SECURE,
        samesite="lax",
        max_age=7 * 24 * 60 * 60,
    )


def _build_sub_admin_scope(data) -> dict:
    categories = list(getattr(data, "categories", None) or [])
    areas = list(getattr(data, "areas", None) or [])
    districts = list(getattr(data, "districts", None) or [])
    if not categories and getattr(data, "department", None):
        categories = [data.department]
    if not areas and getattr(data, "area", None):
        areas = [data.area]
    if not districts and getattr(data, "district", None):
        districts = [data.district]
    if not categories:
        raise HTTPException(status_code=422, detail="Assign at least one category")
    if not areas:
        raise HTTPException(status_code=422, detail="Assign at least one area")
    return {
        "categories": categories,
        "areas": areas,
        "districts": districts,
        "department": categories[0],
        "area": areas[0],
        "district": districts[0] if districts else None,
    }


# ==================== AUDIT LOG HELPER ====================
def log_audit_action(performed_by: str, role: str, action: str, target_type: str, target_id: str, previous_val=None, new_val=None):
    try:
        audit_logs_collection.insert_one({
            "performed_by": str(performed_by) if performed_by else "system",
            "role": role,
            "action": action,
            "target_type": target_type,
            "target_id": str(target_id) if target_id else None,
            "previous_val": previous_val,
            "new_val": new_val,
            "timestamp": datetime.datetime.utcnow()
        })
    except Exception as e:
        print(f"Audit log insertion failed: {e}")


# ==================== GET CURRENT USER ====================
def get_current_user(request: Request):
    token = request.cookies.get("token")
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        user_id = payload.get("user_id")
        if user_id:
            try:
                db_user = users_collection.find_one({"_id": ObjectId(user_id)})
                if db_user:
                    if db_user.get("status") == "inactive":
                        raise HTTPException(status_code=403, detail="Account is deactivated")
                    role = db_user.get("role", payload.get("role"))
                    if role == "admin":
                        role = "sub_admin"
                    payload["role"] = role
                    scope = normalize_scope(db_user)
                    payload.update(scope)
                    payload["status"] = db_user.get("status", "active")
                    payload["name"] = db_user.get("name")
                    payload["phone"] = db_user.get("phone")
            except HTTPException:
                raise
            except Exception:
                pass
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired, please log in again")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


# ==================== SUPER ADMIN GUARD ====================
def require_super_admin(request: Request):
    user = get_current_user(request)
    if user.get("role") != "super_admin":
        raise HTTPException(status_code=403, detail="Super Admin access only")
    return user


# ==================== ADMIN GUARD (allows sub_admin + super_admin) ====================
def require_admin(request: Request):
    user = get_current_user(request)
    role = user.get("role")
    if role not in ("sub_admin", "super_admin"):
        raise HTTPException(status_code=403, detail="Admin access only")
    return user


# ==================== GET CURRENT USER INFO ENDPOINT ====================
@router.get("/auth/me")
def get_me(user=Depends(get_current_user)):
    return user


# ==================== REGISTER (Citizen Only) ====================
@router.post("/auth/register")
def register(user: UserRegister):
    """
    New citizen signup. Role is strictly forced to "citizen".
    Uniqueness enforced on both CNIC and email.
    """
    try:
        if users_collection.find_one({"cnic": user.cnic}):
            raise HTTPException(status_code=400, detail="CNIC already registered")
        if users_collection.find_one({"email": user.email}):
            raise HTTPException(status_code=400, detail="Email already registered")

        hashed_password_bytes = bcrypt.hashpw(user.password.encode('utf-8'), bcrypt.gensalt())
        hashed_password_str = base64.b64encode(hashed_password_bytes).decode('utf-8')

        user_data = {
            "name": user.name,
            "email": user.email,
            "password": hashed_password_str,
            "cnic": user.cnic,
            "phone": user.phone,
            "date_of_birth": user.date_of_birth,
            "address": user.address,
            "role": "citizen",
            "department": None,
            "district": getattr(user, "district", "Nowshera"),
            "area": getattr(user, "area", "Jehangira"),
            "status": "active",
            "created_at": datetime.datetime.utcnow()
        }

        result = users_collection.insert_one(user_data)

        return {
            "message": "User registered successfully",
            "user_id": str(result.inserted_id),
            "name": user.name,
            "cnic": user.cnic,
            "role": "citizen",
            "district": user_data["district"],
            "area": user_data["area"]
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ==================== CREATE SUB ADMIN ====================
@router.post("/auth/create-sub-admin")
def create_sub_admin(admin: SubAdminRegister, super_admin_user=Depends(require_super_admin)):
    """
    Create a Sub Admin. Only accessible by Super Admin.
    Uniqueness enforced on both CNIC and email.
    """
    try:
        if users_collection.find_one({"cnic": admin.cnic}):
            raise HTTPException(status_code=400, detail="CNIC already registered")
        if users_collection.find_one({"email": admin.email}):
            raise HTTPException(status_code=400, detail="Email already registered")

        hashed_password_str = _hash_password(admin.password)
        scope = _build_sub_admin_scope(admin)

        admin_data = {
            "name": admin.name,
            "email": admin.email,
            "password": hashed_password_str,
            "cnic": admin.cnic,
            "phone": admin.phone,
            "role": "sub_admin",
            "status": admin.status or "active",
            "created_at": datetime.datetime.utcnow(),
            **scope,
        }

        result = users_collection.insert_one(admin_data)
        admin_id_str = str(result.inserted_id)

        log_audit_action(
            performed_by=super_admin_user.get("user_id"),
            role="super_admin",
            action="CREATE_SUB_ADMIN",
            target_type="user",
            target_id=admin_id_str,
            new_val={
                "name": admin.name,
                "email": admin.email,
                "categories": scope["categories"],
                "areas": scope["areas"],
                "districts": scope["districts"],
                "status": admin.status
            }
        )

        return {
            "message": "Sub Admin created successfully",
            "user_id": admin_id_str,
            "name": admin.name,
            "role": "sub_admin",
            **scope,
            "status": admin.status
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ==================== GET ALL SUB ADMINS ====================
@router.get("/auth/sub-admins")
def list_sub_admins(super_admin_user=Depends(require_super_admin)):
    try:
        admins = []
        for user in users_collection.find({"role": {"$in": ["sub_admin", "admin"]}}).sort("created_at", -1):
            user["_id"] = str(user["_id"])
            user.pop("password", None)
            if user.get("role") == "admin":
                user["role"] = "sub_admin"
            user["created_at"] = str(user.get("created_at", ""))
            admins.append(user)
        return {"total": len(admins), "data": admins}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ==================== UPDATE SUB ADMIN ====================
@router.patch("/auth/sub-admins/{admin_id}")
def update_sub_admin(admin_id: str, data: SubAdminUpdate, super_admin_user=Depends(require_super_admin)):
    try:
        existing = users_collection.find_one({"_id": ObjectId(admin_id)})
        if not existing:
            raise HTTPException(status_code=404, detail="Sub Admin not found")

        update_fields = {}
        if data.name is not None: update_fields["name"] = data.name
        if data.email is not None: update_fields["email"] = data.email
        if data.phone is not None: update_fields["phone"] = data.phone
        if data.status is not None: update_fields["status"] = data.status
        if any([data.categories, data.areas, data.districts, data.department, data.district, data.area]):
            merged = {
                "categories": data.categories if data.categories is not None else existing.get("categories"),
                "areas": data.areas if data.areas is not None else existing.get("areas"),
                "districts": data.districts if data.districts is not None else existing.get("districts"),
                "department": data.department if data.department is not None else existing.get("department"),
                "district": data.district if data.district is not None else existing.get("district"),
                "area": data.area if data.area is not None else existing.get("area"),
            }
            update_fields.update(_build_sub_admin_scope(type("Scope", (), merged)()))
        if data.password:
            update_fields["password"] = _hash_password(data.password)

        if not update_fields:
            return {"message": "No changes provided"}

        users_collection.update_one({"_id": ObjectId(admin_id)}, {"$set": update_fields})

        log_audit_action(
            performed_by=super_admin_user.get("user_id"),
            role="super_admin",
            action="UPDATE_SUB_ADMIN",
            target_type="user",
            target_id=admin_id,
            previous_val={k: existing.get(k) for k in update_fields if k != "password"},
            new_val={k: v for k, v in update_fields.items() if k != "password"}
        )

        return {"message": "Sub Admin updated successfully", "admin_id": admin_id}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/auth/users")
def list_users(super_admin_user=Depends(require_super_admin)):
    users = []
    for user in users_collection.find({"role": "citizen"}).sort("created_at", -1).limit(200):
        user["_id"] = str(user["_id"])
        user.pop("password", None)
        user["created_at"] = str(user.get("created_at", ""))
        users.append(user)
    return {"total": len(users), "data": users}


# ==================== GET AUDIT LOGS ====================
@router.get("/auth/audit-logs")
def get_audit_logs(super_admin_user=Depends(require_super_admin)):
    try:
        logs = []
        for log in audit_logs_collection.find().sort("timestamp", -1).limit(100):
            log["_id"] = str(log["_id"])
            log["timestamp"] = str(log.get("timestamp", ""))
            logs.append(log)
        return {"total": len(logs), "data": logs}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


def _authenticate(user: UserLogin, response: Response, allowed_roles=None):
    _rate_limit_auth(user.cnic)
    found_user = users_collection.find_one({"cnic": user.cnic})
    if not found_user:
        raise HTTPException(status_code=404, detail="User not found")

    if found_user.get("status") == "inactive":
        raise HTTPException(status_code=403, detail="Account is deactivated")

    stored_hash_bytes = base64.b64decode(found_user["password"])
    if not bcrypt.checkpw(user.password.encode("utf-8"), stored_hash_bytes):
        raise HTTPException(status_code=401, detail="Wrong password")

    role = found_user.get("role", "citizen")
    if role == "admin":
        role = "sub_admin"

    if allowed_roles and role not in allowed_roles:
        raise HTTPException(status_code=403, detail="This portal is not for your account type")

    scope = normalize_scope(found_user)
    token_payload = {
        "user_id": str(found_user["_id"]),
        "cnic": found_user["cnic"],
        "role": role,
        **scope,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(days=7),
    }
    token = jwt.encode(token_payload, SECRET_KEY, algorithm="HS256")
    _set_auth_cookie(response, token)
    return {
        "message": "Login successful",
        "user_id": str(found_user["_id"]),
        "name": found_user["name"],
        "role": role,
        **scope,
        "status": found_user.get("status", "active"),
    }


@router.post("/auth/login")
def login(user: UserLogin, response: Response):
    try:
        return _authenticate(user, response)
    except HTTPException:
        raise
    except PyMongoError as pe:
        print(f"MongoDB login error: {pe}")
        raise HTTPException(status_code=503, detail="Database connection error. Please check internet connection or try again.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/auth/login/citizen")
def login_citizen(user: UserLogin, response: Response):
    return _authenticate(user, response, allowed_roles=["citizen"])


@router.post("/auth/login/sub-admin")
def login_sub_admin(user: UserLogin, response: Response):
    return _authenticate(user, response, allowed_roles=["sub_admin"])


@router.post("/auth/login/super-admin")
def login_super_admin(user: UserLogin, response: Response):
    return _authenticate(user, response, allowed_roles=["super_admin"])


# ==================== LOGOUT ====================
@router.post("/auth/logout")
def logout(response: Response):
    response.delete_cookie("token")
    return {"message": "Logged out successfully"}