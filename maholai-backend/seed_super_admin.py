import bcrypt
import base64
from datetime import datetime
from database import users_collection

def seed_super_admin():
    cnic = "00000-0000000-0"
    password = "admin123password"
    
    hashed_password_bytes = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    hashed_password_str = base64.b64encode(hashed_password_bytes).decode('utf-8')

    super_admin_doc = {
        "name": "System Administrator",
        "email": "superadmin@maholai.com",
        "password": hashed_password_str,
        "cnic": cnic,
        "role": "super_admin",
        "department": None,
        "district": None,
        "area": None,
        "status": "active",
        "created_at": datetime.utcnow()
    }

    users_collection.update_one(
        {"cnic": cnic},
        {"$set": super_admin_doc},
        upsert=True
    )
    print("SUCCESS: Super Admin account created/updated!")
    print(f"CNIC: {cnic}")
    print(f"Password: {password}")

if __name__ == "__main__":
    seed_super_admin()
