# from anthropic import Anthropic
# from config import CLAUDE_API_KEY

# client = Anthropic(api_key=CLAUDE_API_KEY)

# def analyze_issue(title: str, description: str, location: str) -> dict:
#     """
#     Use Claude AI to analyze civic issue
#     Returns: category, summary, priority
#     """
#     try:
#         prompt = f"""
# You are an expert civic issue analyzer for Pakistani cities.

# Analyze this civic problem report and provide:
# 1. Category (Roads, Water, Sanitation, Electricity, Health, Education, Other)
# 2. Summary (2-3 sentences explaining the issue)
# 3. Priority (high, medium, low)

# Report Details:
# - Title: {title}
# - Description: {description}
# - Location: {location}

# Respond in JSON format only:
# {{
#     "category": "category_name",
#     "summary": "brief summary here",
#     "priority": "high|medium|low"
# }}
# """
        
#         message = client.messages.create(
#             model="claude-opus-4-6",
#             max_tokens=500,
#             messages=[
#                 {"role": "user", "content": prompt}
#             ]
#         )
        
#         # Parse response
#         response_text = message.content[0].text
#         import json
#         analysis = json.loads(response_text)
        
#         return analysis
#     except Exception as e:
#         print(f"Error analyzing issue: {e}")
#         return {
#             "category": "Other",
#             "summary": description,
#             "priority": "medium"
#         }
from anthropic import Anthropic
from config import CLAUDE_API_KEY
import json
import re

client = Anthropic(api_key=CLAUDE_API_KEY)

def analyze_issue(title: str, description: str, location: str) -> dict:
    """
    Use Claude AI to analyze civic issue
    Returns: category, summary, priority
    """
    # Agar API key config mein nahi hai to seedha fallback return karo
    if not CLAUDE_API_KEY:
        return {
            "category": "Other",
            "summary": description,
            "priority": "medium"
        }

    try:
        prompt = f"""
You are an expert civic issue analyzer for Pakistani cities.

Analyze this civic problem report and provide:
1. Category (Roads, Water, Sanitation, Electricity, Health, Education, Other)
2. Summary (2-3 sentences explaining the issue)
3. Priority (high, medium, low)

Report Details:
- Title: {title}
- Description: {description}
- Location: {location}

Respond ONLY with a valid JSON object. Do not include markdown headers or extra text:
{{
    "category": "category_name",
    "summary": "brief summary here",
    "priority": "high|medium|low"
}}
"""
        
        # Valid Anthropic Model Name
        message = client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=500,
            messages=[
                {"role": "user", "content": prompt}
            ]
        )
        
        response_text = message.content[0].text.strip()
        
        # Clean markdown wrappers (```json ... ```) if present
        if "```" in response_text:
            response_text = re.sub(r"```json\s*|\s*```", "", response_text).strip()
            
        analysis = json.loads(response_text)
        return analysis

    except Exception as e:
        print(f"Error analyzing issue via Claude AI: {e}")
        return {
            "category": "Other",
            "summary": description,
            "priority": "medium"
        }