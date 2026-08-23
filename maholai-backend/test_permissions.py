import uuid
from fastapi.testclient import TestClient
from main import app
from database import users_collection, issues_collection
from bson import ObjectId
import bcrypt, base64

client = TestClient(app)

def run_tests():
    print("=" * 60)
    print("MAHOLAI AUTOMATED PERMISSION & SECURITY SUITE")
    print("=" * 60)

    suffix = str(uuid.uuid4())[:6]

    print("\n--- PRE-TEST SETUP ---")
    super_admin_cnic = f"99999-{suffix}-1"

    # Register citizen user first
    c_cnic = f"11111-{suffix}-1"
    c_data = {
        "name": f"Citizen {suffix}",
        "email": f"citizen_{suffix}@example.com",
        "password": "CitizenPassword123!",
        "cnic": c_cnic,
        "phone": "03001111111",
        "address": "Nowshera"
    }
    r = client.post("/auth/register", json=c_data)
    assert r.status_code == 200, f"Failed citizen reg: {r.text}"
    citizen_user_id = r.json()["user_id"]
    print(f"Registered Citizen: {c_cnic} (ID: {citizen_user_id})")

    # -------------------------------------------------------------
    # TEST 1: Citizen Signup (role forced to citizen)
    # -------------------------------------------------------------
    print("\n[TEST 1] Citizen Signup (Role Forced to Citizen)")
    assert r.json()["role"] == "citizen", f"Expected citizen role, got {r.json()['role']}"
    print("[PASS] TEST 1 PASSED: Role is strictly 'citizen'")

    # -------------------------------------------------------------
    # TEST 2: Citizen attempts signup with role = super_admin
    # -------------------------------------------------------------
    print("\n[TEST 2] Citizen attempts signup with role = super_admin")
    fake_super_cnic = f"22222-{suffix}-1"
    payload_fake_super = {
        **c_data,
        "cnic": fake_super_cnic,
        "email": f"fake_super_{suffix}@example.com",
        "role": "super_admin"
    }
    r2 = client.post("/auth/register", json=payload_fake_super)
    assert r2.status_code == 200
    assert r2.json()["role"] == "citizen", f"Privilege escalation vulnerability! Got: {r2.json()['role']}"
    print("[PASS] TEST 2 PASSED: Malicious role 'super_admin' ignored, forced to 'citizen'")

    # -------------------------------------------------------------
    # TEST 3: Citizen attempts signup with role = sub_admin
    # -------------------------------------------------------------
    print("\n[TEST 3] Citizen attempts signup with role = sub_admin")
    fake_sub_cnic = f"33333-{suffix}-1"
    payload_fake_sub = {
        **c_data,
        "cnic": fake_sub_cnic,
        "email": f"fake_sub_{suffix}@example.com",
        "role": "sub_admin",
        "department": "Water"
    }
    r3 = client.post("/auth/register", json=payload_fake_sub)
    assert r3.status_code == 200
    assert r3.json()["role"] == "citizen", f"Privilege escalation vulnerability! Got: {r3.json()['role']}"
    print("[PASS] TEST 3 PASSED: Malicious role 'sub_admin' ignored, forced to 'citizen'")

    # Citizen login
    r_login_c = client.post("/auth/login", json={"cnic": c_cnic, "password": "CitizenPassword123!"})
    assert r_login_c.status_code == 200
    token_citizen = r_login_c.cookies.get("token")

    # -------------------------------------------------------------
    # TEST 4: Citizen calls POST /auth/create-sub-admin
    # -------------------------------------------------------------
    print("\n[TEST 4] Citizen calls POST /auth/create-sub-admin")
    r4 = client.post("/auth/create-sub-admin", json={
        "name": "Hacker Admin", "email": "hacker@test.com", "password": "pass",
        "cnic": f"44444-{suffix}-1", "department": "Water", "district": "Nowshera", "area": "Jehangira"
    }, cookies={"token": token_citizen})
    assert r4.status_code in (401, 403), f"Expected 403 Forbidden, got {r4.status_code}"
    print(f"[PASS] TEST 4 PASSED: Denied with status {r4.status_code}")

    # Seed Super Admin
    h_bytes = bcrypt.hashpw("SuperPassword123!".encode('utf-8'), bcrypt.gensalt())
    h_str = base64.b64encode(h_bytes).decode('utf-8')
    users_collection.insert_one({
        "name": "Super Admin",
        "email": f"super_{suffix}@maholai.com",
        "password": h_str,
        "cnic": super_admin_cnic,
        "role": "super_admin",
        "department": None,
        "district": None,
        "area": None,
        "status": "active"
    })
    r_super_login = client.post("/auth/login", json={"cnic": super_admin_cnic, "password": "SuperPassword123!"})
    assert r_super_login.status_code == 200, f"Super admin login failed: {r_super_login.text}"
    token_super = r_super_login.cookies.get("token")

    # -------------------------------------------------------------
    # TEST 6: Super Admin calls POST /auth/create-sub-admin
    # -------------------------------------------------------------
    print("\n[TEST 6] Super Admin calls POST /auth/create-sub-admin")
    sub_admin_cnic = f"55555-{suffix}-1"
    sub_admin_data = {
        "name": "Water Sub Admin",
        "email": f"water_admin_{suffix}@example.com",
        "password": "SubPassword123!",
        "cnic": sub_admin_cnic,
        "department": "Water",
        "district": "Nowshera",
        "area": "Jehangira",
        "status": "active"
    }
    r6 = client.post("/auth/create-sub-admin", json=sub_admin_data, cookies={"token": token_super})
    assert r6.status_code == 200, f"Failed creating sub admin: {r6.text}"
    sub_admin_id = r6.json()["user_id"]
    print(f"[PASS] TEST 6 PASSED: Sub Admin created successfully (ID: {sub_admin_id})")

    # Sub Admin Login
    r_sub_login = client.post("/auth/login", json={"cnic": sub_admin_cnic, "password": "SubPassword123!"})
    assert r_sub_login.status_code == 200
    token_sub = r_sub_login.cookies.get("token")

    # -------------------------------------------------------------
    # TEST 5: Sub Admin calls POST /auth/create-sub-admin
    # -------------------------------------------------------------
    print("\n[TEST 5] Sub Admin calls POST /auth/create-sub-admin")
    r5 = client.post("/auth/create-sub-admin", json={
        "name": "Sub Creating Sub", "email": "sub2@test.com", "password": "pass",
        "cnic": f"66666-{suffix}-1", "department": "Water", "district": "Nowshera", "area": "Jehangira"
    }, cookies={"token": token_sub})
    assert r5.status_code in (401, 403), f"Expected 403 Forbidden, got {r5.status_code}"
    print(f"[PASS] TEST 5 PASSED: Denied with status {r5.status_code}")

    print("\n--- CREATING TEST ISSUES ---")
    def create_test_issue(category, district, area, title):
        data = {
            "category": category,
            "problem_type": "Test Issue",
            "title": title,
            "description": f"Test issue description for {title}",
            "location_area": area,
            "location_district": district,
            "created_by": citizen_user_id
        }
        res = client.post("/issues", data=data)
        assert res.status_code == 200, f"Failed creating issue: {res.text}"
        return res.json()["data"]["_id"]

    issue_match = create_test_issue("Water", "Nowshera", "Jehangira", f"Matching Issue {suffix}")
    issue_pabbi = create_test_issue("Water", "Nowshera", "Pabbi", f"Pabbi Issue {suffix}")
    issue_edu   = create_test_issue("Education", "Nowshera", "Jehangira", f"Edu Issue {suffix}")
    issue_swabi = create_test_issue("Water", "Swabi", "Jehangira", f"Swabi Issue {suffix}")

    # -------------------------------------------------------------
    # TEST 7, 8, 9, 10: Sub Admin Scope Filtering Checks
    # -------------------------------------------------------------
    print("\n[TEST 7, 8, 9, 10] Sub Admin Scope Filtering Checks")
    r_issues_sub = client.get("/issues", cookies={"token": token_sub})
    assert r_issues_sub.status_code == 200
    returned_ids = [i["_id"] for i in r_issues_sub.json()["data"]]

    assert issue_match in returned_ids, "TEST 7 FAILED: Matching issue should be visible"
    print("[PASS] TEST 7 PASSED: Matching Water/Nowshera/Jehangira issue is VISIBLE")

    assert issue_pabbi not in returned_ids, "TEST 8 FAILED: Pabbi issue should not be visible"
    print("[PASS] TEST 8 PASSED: Mismatched Area (Pabbi) issue is NOT VISIBLE")

    assert issue_edu not in returned_ids, "TEST 9 FAILED: Education issue should not be visible"
    print("[PASS] TEST 9 PASSED: Mismatched Department (Education) issue is NOT VISIBLE")

    assert issue_swabi not in returned_ids, "TEST 10 FAILED: Swabi issue should not be visible"
    print("[PASS] TEST 10 PASSED: Mismatched District (Swabi) issue is NOT VISIBLE")

    r_idor_edu = client.get(f"/issues/{issue_edu}", cookies={"token": token_sub})
    assert r_idor_edu.status_code == 403, f"IDOR vulnerability! Expected 403, got {r_idor_edu.status_code}"
    print("[PASS] SINGLE ISSUE IDOR PROTECTION PASSED: Direct GET for Education issue returned 403 Forbidden")

    # -------------------------------------------------------------
    # TEST 11: Super Admin requests any issue -> ALL VISIBLE
    # -------------------------------------------------------------
    print("\n[TEST 11] Super Admin Global Scope Check")
    r_issues_super = client.get("/issues", cookies={"token": token_super})
    assert r_issues_super.status_code == 200
    super_ids = [i["_id"] for i in r_issues_super.json()["data"]]
    for i_id in [issue_match, issue_pabbi, issue_edu, issue_swabi]:
        assert i_id in super_ids, f"Super Admin missing issue {i_id}"
    print("[PASS] TEST 11 PASSED: Super Admin has global visibility across all issues")

    # -------------------------------------------------------------
    # TEST 12: Sub Admin attempts to update another area's issue
    # -------------------------------------------------------------
    print("\n[TEST 12] Sub Admin attempts to update another area's issue status")
    r_up_forbidden = client.patch(f"/issues/{issue_pabbi}/status", data={"status": "resolved"}, cookies={"token": token_sub})
    assert r_up_forbidden.status_code == 403, f"Expected 403, got {r_up_forbidden.status_code}"
    print("[PASS] TEST 12 PASSED: Sub Admin update for Pabbi issue denied with 403 Forbidden")

    r_up_allowed = client.patch(f"/issues/{issue_match}/status", data={"status": "in_progress"}, cookies={"token": token_sub})
    assert r_up_allowed.status_code == 200, f"Expected 200, got {r_up_allowed.status_code}"
    print("[PASS] Sub Admin update for matching Jehangira issue ALLOWED")

    # -------------------------------------------------------------
    # TEST 13: Sub Admin attempts to delete another area's issue
    # -------------------------------------------------------------
    print("\n[TEST 13] Sub Admin attempts to delete another area's issue")
    r_del_forbidden = client.delete(f"/issues/{issue_pabbi}", cookies={"token": token_sub})
    assert r_del_forbidden.status_code == 403, f"Expected 403, got {r_del_forbidden.status_code}"
    print("[PASS] TEST 13 PASSED: Sub Admin delete for Pabbi issue denied with 403 Forbidden")

    r_del_allowed = client.delete(f"/issues/{issue_match}", cookies={"token": token_sub})
    assert r_del_allowed.status_code == 200, f"Expected 200, got {r_del_allowed.status_code}"
    print("[PASS] Sub Admin soft-delete for matching Jehangira issue ALLOWED")

    # -------------------------------------------------------------
    # TEST 14: Inactive Sub Admin attempts dashboard access
    # -------------------------------------------------------------
    print("\n[TEST 14] Inactive Sub Admin Access Lockout Test")
    r_deactivate = client.patch(f"/auth/sub-admins/{sub_admin_id}", json={"status": "inactive"}, cookies={"token": token_super})
    assert r_deactivate.status_code == 200

    r_inactive_call = client.get("/issues", cookies={"token": token_sub})
    assert r_inactive_call.status_code in (401, 403), f"Expected 403 Forbidden, got {r_inactive_call.status_code}"
    print(f"[PASS] TEST 14 PASSED: Inactive Sub Admin request locked out with status {r_inactive_call.status_code}")

    print("\n" + "=" * 60)
    print("[SUCCESS] ALL 14 PERMISSION AND SECURITY BOUNDARY TESTS PASSED!")
    print("=" * 60)

if __name__ == "__main__":
    run_tests()
