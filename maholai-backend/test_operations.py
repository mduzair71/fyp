import requests
import json

BASE_URL = "http://localhost:8000"

# Test 1: Create Issue
print("=" * 50)
print("TEST 1: CREATE ISSUE")
print("=" * 50)

data = {
    'title': 'Test Pothole',
    'description': 'Test description for pothole',
    'location': 'Test location',
    'created_by': 'testuser'
}

response = requests.post(f"{BASE_URL}/issues", data=data)
print(f"Status: {response.status_code}")
result = response.json()
print(json.dumps(result, indent=2))
issue_id = result['data']['_id']
print(f"\n✅ Issue Created! ID: {issue_id}\n")

# Test 2: Get All Issues
print("=" * 50)
print("TEST 2: GET ALL ISSUES")
print("=" * 50)

response = requests.get(f"{BASE_URL}/issues")
print(f"Status: {response.status_code}")
result = response.json()
print(f"Total issues: {result['total']}\n")

# Test 3: Get Single Issue
print("=" * 50)
print("TEST 3: GET SINGLE ISSUE")
print("=" * 50)

response = requests.get(f"{BASE_URL}/issues/{issue_id}")
print(f"Status: {response.status_code}")
result = response.json()
print(json.dumps(result, indent=2))
print()

# Test 4: Update Issue Status (FIXED - status as query param)
print("=" * 50)
print("TEST 4: UPDATE ISSUE STATUS")
print("=" * 50)

response = requests.put(f"{BASE_URL}/issues/{issue_id}?status=in_progress")
print(f"Status: {response.status_code}")
result = response.json()
print(json.dumps(result, indent=2))
print(f"\n✅ Status Updated to: {result['data']['status']}\n")

# Test 5: Delete Issue
print("=" * 50)
print("TEST 5: DELETE ISSUE")
print("=" * 50)

response = requests.delete(f"{BASE_URL}/issues/{issue_id}")
print(f"Status: {response.status_code}")
result = response.json()
print(json.dumps(result, indent=2))
print(f"\n✅ Issue Deleted!\n")

print("=" * 50)
print("ALL TESTS COMPLETED!")
print("=" * 50)