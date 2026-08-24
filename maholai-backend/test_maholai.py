"""
MaholAI backend test script.
Run with: python test_maholai.py
Requires: pip install requests

Tests, in order:
  1. Citizen signup
  2. Citizen login
  3. Citizen creates an issue
  4. Citizen fetches own issues
  5. (optional) Sub Admin login + scoped GET /issues + 403 on out-of-scope issue

Edit the CONFIG block below before running.
"""

import requests
import random

BASE_URL = "http://localhost:8000"

# ==================== CONFIG ====================
# Citizen test account (will be created fresh each run with a random CNIC)
CITIZEN = {
    "name": "Test Citizen",
    "email": f"testcitizen{random.randint(1000,9999)}@example.com",
    "password": "TestPass123!",
    "cnic": f"{random.randint(10000,99999)}-{random.randint(1000000,9999999)}-{random.randint(0,9)}",
    "phone": "03001234567",
    "date_of_birth": "2000-01-01",
    "address": "Test Address, Nowshera",
}

# Test issue payload -- must match a real category from your CATEGORIES config
ISSUE = {
    "category": "Water",
    "title": "Test pipeline leakage",
    "description": "Automated test issue - pipeline leaking near main road.",
    "location_area": "Jehangira",
    "location_district": "Nowshera",
}

# Out-of-scope issue -- deliberately does NOT match the sub-admin's assigned
# category/area/district, to confirm the backend blocks cross-scope access.
# Edit this so it's guaranteed different from your test sub-admin's scope.
OUT_OF_SCOPE_ISSUE = {
    "category": "Electricity",
    "title": "Test out-of-scope issue",
    "description": "Automated test issue - should NOT be visible to the Water/lahor/Swabi sub-admin.",
    "location_area": "SomeOtherArea",
    "location_district": "SomeOtherDistrict",
}

# Set this to an EXISTING sub-admin's CNIC/password to run the scope test.
# Leave as None to skip steps 5+ (since sub-admins can't self-register).
SUB_ADMIN_CNIC = "1620174919211"
SUB_ADMIN_PASSWORD = "mduzair123"
# ==================================================


def line(msg):
    print(f"\n{'='*60}\n{msg}\n{'='*60}")


def check(label, condition):
    status = "PASS" if condition else "FAIL"
    print(f"  [{status}] {label}")
    return condition


def main():
    all_ok = True

    # ---------- 1. SIGNUP ----------
    line("STEP 1: Citizen signup")
    r = requests.post(f"{BASE_URL}/auth/register", json=CITIZEN)
    print(f"  status={r.status_code} body={r.text[:300]}")
    all_ok &= check("signup returns 200", r.status_code == 200)

    # ---------- 2. LOGIN ----------
    line("STEP 2: Citizen login")
    session = requests.Session()
    r = session.post(f"{BASE_URL}/auth/login", json={
        "cnic": CITIZEN["cnic"],
        "password": CITIZEN["password"],
    })
    print(f"  status={r.status_code} body={r.text[:300]}")
    all_ok &= check("login returns 200", r.status_code == 200)
    all_ok &= check("auth cookie set", "token" in session.cookies.get_dict())

    if r.status_code != 200:
        line("Stopping - login failed, can't continue.")
        return

    user_id = r.json().get("user_id")

    # ---------- 3. CREATE ISSUE ----------
    line("STEP 3: Citizen creates an issue")
    form_data = {
        "category": ISSUE["category"],
        "title": ISSUE["title"],
        "description": ISSUE["description"],
        "location_area": ISSUE["location_area"],
        "location_district": ISSUE["location_district"],
        "created_by": user_id,
        "is_anonymous": "false",
    }
    r = session.post(f"{BASE_URL}/issues", data=form_data)
    print(f"  status={r.status_code} body={r.text[:500]}")
    all_ok &= check("issue create returns 200", r.status_code == 200)

    issue_id = None
    if r.status_code == 200:
        issue_id = r.json().get("data", {}).get("_id")
        status_val = r.json().get("data", {}).get("status")
        all_ok &= check("status stored as 'PENDING'", status_val == "PENDING")
        print(f"  created issue_id={issue_id} status={status_val}")

    # ---------- 4. GET OWN ISSUES ----------
    line("STEP 4: Citizen fetches own issues")
    r = session.get(f"{BASE_URL}/issues/user/{user_id}")
    print(f"  status={r.status_code} body={r.text[:500]}")
    all_ok &= check("own issues returns 200", r.status_code == 200)
    if r.status_code == 200:
        data = r.json().get("data", [])
        all_ok &= check("own issue appears in list", any(i.get("_id") == issue_id for i in data))
        if data:
            first = data[0]
            all_ok &= check("reporter info visible to owner", first.get("reporter_cnic") is not None)

    # ---------- 5. SUB ADMIN SCOPE TEST (optional) ----------
    if SUB_ADMIN_CNIC and SUB_ADMIN_PASSWORD:
        line("STEP 5: Sub Admin login")
        admin_session = requests.Session()
        r = admin_session.post(f"{BASE_URL}/auth/login", json={
            "cnic": SUB_ADMIN_CNIC,
            "password": SUB_ADMIN_PASSWORD,
        })
        print(f"  status={r.status_code} body={r.text[:300]}")
        all_ok &= check("sub-admin login returns 200", r.status_code == 200)

        if r.status_code == 200:
            line("STEP 6: Sub Admin GET /issues (should only see in-scope issues)")
            r = admin_session.get(f"{BASE_URL}/issues")
            print(f"  status={r.status_code} total={r.json().get('total') if r.status_code==200 else '?'}")
            all_ok &= check("scoped issues returns 200", r.status_code == 200)

            if issue_id:
                line("STEP 7: Sub Admin GET single issue by ID (in or out of scope)")
                r = admin_session.get(f"{BASE_URL}/issues/{issue_id}")
                print(f"  status={r.status_code} body={r.text[:300]}")
                print("  -> Check manually: if this issue's category/area is OUTSIDE")
                print("     the sub-admin's assigned scope, status MUST be 403.")

                line("STEP 8: Sub Admin updates status (if in scope)")
                r = admin_session.patch(
                    f"{BASE_URL}/issues/{issue_id}/status",
                    data={"status": "IN_PROGRESS", "note": "Automated test note"},
                )
                print(f"  status={r.status_code} body={r.text[:300]}")

            # ---------- 9. OUT-OF-SCOPE 403 TEST (the mandatory security test) ----------
            line("STEP 9: Create an OUT-OF-SCOPE issue as citizen")
            oos_form = {
                "category": OUT_OF_SCOPE_ISSUE["category"],
                "title": OUT_OF_SCOPE_ISSUE["title"],
                "description": OUT_OF_SCOPE_ISSUE["description"],
                "location_area": OUT_OF_SCOPE_ISSUE["location_area"],
                "location_district": OUT_OF_SCOPE_ISSUE["location_district"],
                "created_by": user_id,
                "is_anonymous": "false",
            }
            r = session.post(f"{BASE_URL}/issues", data=oos_form)
            print(f"  status={r.status_code} body={r.text[:300]}")
            all_ok &= check("out-of-scope issue create returns 200", r.status_code == 200)

            oos_issue_id = None
            if r.status_code == 200:
                oos_issue_id = r.json().get("data", {}).get("_id")
                print(f"  created out-of-scope issue_id={oos_issue_id}")

            if oos_issue_id:
                line("STEP 10: Sub Admin GET out-of-scope issue by ID (MUST be 403)")
                r = admin_session.get(f"{BASE_URL}/issues/{oos_issue_id}")
                print(f"  status={r.status_code} body={r.text[:300]}")
                all_ok &= check("out-of-scope issue GET returns 403", r.status_code == 403)

                line("STEP 11: Sub Admin tries to change out-of-scope issue's status (MUST be 403)")
                r = admin_session.patch(
                    f"{BASE_URL}/issues/{oos_issue_id}/status",
                    data={"status": "IN_PROGRESS", "note": "Should be blocked"},
                )
                print(f"  status={r.status_code} body={r.text[:300]}")
                all_ok &= check("out-of-scope status update returns 403", r.status_code == 403)

                line("STEP 12: Sub Admin GET /issues list must NOT contain the out-of-scope issue")
                r = admin_session.get(f"{BASE_URL}/issues")
                if r.status_code == 200:
                    ids_in_list = [i.get("_id") for i in r.json().get("data", [])]
                    all_ok &= check(
                        "out-of-scope issue absent from scoped list",
                        oos_issue_id not in ids_in_list,
                    )
    else:
        line("STEP 5+ SKIPPED - set SUB_ADMIN_CNIC / SUB_ADMIN_PASSWORD in CONFIG to test scoping")

    line("SUMMARY: " + ("ALL CHECKS PASSED" if all_ok else "SOME CHECKS FAILED - see [FAIL] lines above"))


if __name__ == "__main__":
    main()