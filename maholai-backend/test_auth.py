import requests
import json

BASE_URL = "http://localhost:8000"

# Test 1: Register
print("=" * 50)
print("TEST 1: REGISTER USER")
print("=" * 50)

data = {
    "name": "Uzair Ahmed",
    "email": "uzair@maholai.com",
    "password": "uzair123",
    "phone": "03001234567",
    "location": "Rawalpindi"
}

response = requests.post(f"{BASE_URL}/auth/register", json=data)
print(f"Status: {response.status_code}")
result = response.json()
print(json.dumps(result, indent=2))

# Test 2: Login
print("=" * 50)
print("TEST 2: LOGIN USER")
print("=" * 50)

data = {
    "email": "uzair@maholai.com",
    "password": "uzair123"
}

response = requests.post(f"{BASE_URL}/auth/login", json=data)
print(f"Status: {response.status_code}")
result = response.json()
print(json.dumps(result, indent=2))

if response.status_code == 200:
    print(f"\n✅ Login successful!")
    print(f"Token: {result['token'][:50]}...")
    print(f"Role: {result['role']}")