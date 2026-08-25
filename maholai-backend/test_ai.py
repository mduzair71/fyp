from utils.ai_analyzer import analyze_issue, check_duplicate_with_ai

# Test 1: analyze_issue kaam kar raha hai ya nahi
print("=== Test 1: analyze_issue ===")
result = analyze_issue(
    title="Water pipe burst",
    description="A major water pipeline has burst near the main market, water is flooding the street",
    location="G-9, Islamabad"
)
print(result)
print()

# Test 2: check_duplicate_with_ai kaam kar raha hai ya nahi
print("=== Test 2: check_duplicate_with_ai ===")
fake_existing_issues = [
    {
        "_id": "60d5ec49f1a2c81128c11a1a",
        "title": "Water leakage near market",
        "description": "Water is leaking heavily near the main market area, road is flooded",
        "location": {"area": "G-9"}
    }
]
dup_result = check_duplicate_with_ai(
    new_title="Pipeline burst near market",
    new_desc="Big water pipe burst outside the market, lots of water on the road",
    existing_issues=fake_existing_issues
)
print(dup_result)