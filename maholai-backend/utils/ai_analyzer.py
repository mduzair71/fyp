# # from anthropic import Anthropic
# # from config import CLAUDE_API_KEY
# # import json
# # import re

# # client = Anthropic(api_key=CLAUDE_API_KEY) if CLAUDE_API_KEY else None

# # VALID_PRIORITIES = {"high", "medium", "low"}


# # def analyze_issue(title: str, description: str, location: str) -> dict:
# #     """
# #     Use Claude AI to analyze a civic issue report.
# #     Returns: {"category": str, "summary": str, "priority": "high"|"medium"|"low"}

# #     Never raises -- falls back to a safe default on any error (missing key,
# #     API failure, timeout, bad JSON) so issue creation is never blocked.
# #     """
# #     fallback = {
# #         "category": "Other",
# #         "summary": description[:300],
# #         "priority": "medium",
# #     }

# #     if not client:
# #         return fallback

# #     try:
# #         prompt = f"""
# # You are an expert civic issue analyzer for Pakistani cities.

# # Analyze this civic problem report and provide:
# # 1. Category (Roads, Water, Sanitation, Electricity, Health, Education, Other)
# # 2. Summary (2-3 sentences explaining the issue)
# # 3. Priority (high, medium, low)

# # Report Details:
# # - Title: {title}
# # - Description: {description}
# # - Location: {location}

# # Respond ONLY with a valid JSON object. Do not include markdown headers or extra text:
# # {{
# #     "category": "category_name",
# #     "summary": "brief summary here",
# #     "priority": "high|medium|low"
# # }}
# # """

# #         message = client.messages.create(
# #             model="claude-sonnet-4-5",
# #             max_tokens=500,
# #             messages=[
# #                 {"role": "user", "content": prompt}
# #             ]
# #         )

# #         response_text = message.content[0].text.strip()

# #         if "```" in response_text:
# #             response_text = re.sub(r"```json\s*|\s*```", "", response_text).strip()

# #         analysis = json.loads(response_text)

# #         priority = str(analysis.get("priority", "medium")).lower()
# #         if priority not in VALID_PRIORITIES:
# #             priority = "medium"

# #         return {
# #             "category": analysis.get("category") or fallback["category"],
# #             "summary": analysis.get("summary") or fallback["summary"],
# #             "priority": priority,
# #         }

# #     except Exception as e:
# #         print(f"Error analyzing issue via Claude AI: {e}")
# #         return fallback
# import json
# import re
# import requests
# from config import GEMINI_API_KEY

# VALID_PRIORITIES = {"high", "medium", "low"}

# def analyze_issue(title: str, description: str, location: str = "") -> dict:
#     """
#     Use Gemini REST API to analyze a civic issue report.
#     Returns: {"category": str, "summary": str, "priority": "high"|"medium"|"low"}

#     Never raises -- falls back to a safe default on any error (missing key,
#     API failure, timeout, bad JSON) so issue creation is never blocked.
#     """
#     fallback = {
#         "category": "Other",
#         "summary": description[:300],
#         "priority": "medium",
#     }

#     if not GEMINI_API_KEY:
#         print("Gemini API key missing, using fallback.")
#         return fallback

#     prompt = f"""
# You are an expert civic issue analyzer for Pakistani cities.

# Analyze this civic problem report and provide:
# 1. Category (Roads, Water, Sanitation, Electricity, Health, Education, Other)
# 2. Summary (2-3 sentences explaining the issue)
# 3. Priority (high, medium, low)

# Report Details:
# - Title: {title}
# - Description: {description}
# - Location: {location}

# Respond ONLY with a valid JSON object. Do not include markdown headers or extra text:
# {{
#     "category": "category_name",
#     "summary": "brief summary here",
#     "priority": "high|medium|low"
# }}
# """

#     url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={GEMINI_API_KEY}"
    
#     payload = {
#         "contents": [{
#             "parts": [{"text": prompt}]
#         }],
#         "generationConfig": {
#             "response_mime_type": "application/json"
#         }
#     }

#     headers = {'Content-Type': 'application/json'}

#     try:
#         response = requests.post(url, headers=headers, json=payload, timeout=10)
        
#         if response.status_code == 200:
#             res_json = response.json()
#             response_text = res_json['candidates'][0]['content']['parts'][0]['text'].strip()

#             if "```" in response_text:
#                 response_text = re.sub(r"```json\s*|\s*```", "", response_text).strip()

#             analysis = json.loads(response_text)

#             priority = str(analysis.get("priority", "medium")).lower()
#             if priority not in VALID_PRIORITIES:
#                 priority = "medium"

#             return {
#                 "category": analysis.get("category") or fallback["category"],
#                 "summary": analysis.get("summary") or fallback["summary"],
#                 "priority": priority,
#             }
#         else:
#             print(f"Error analyzing issue via Gemini AI: HTTP {response.status_code} - {response.text}")
#             return fallback

#     except Exception as e:
#         print(f"Error analyzing issue via Gemini AI: {e}")
#         return fallback
import json
import re
from google import genai
from google.genai import types
from config import GEMINI_API_KEY

# Client ko global single-instance ke taur par initialize kiya gaya hai
if GEMINI_API_KEY:
    _client = genai.Client(api_key=GEMINI_API_KEY)
else:
    _client = None

VALID_PRIORITIES = {"high", "medium", "low"}


def analyze_issue(title: str, description: str, location: str = "") -> dict:
    """
    Use Gemini AI to analyze a civic issue report.
    Returns: {"category": str, "summary": str, "priority": "high"|"medium"|"low"}

    Never raises -- falls back to a safe default on any error (missing key,
    API failure, timeout, bad JSON) so issue creation is never blocked.
    """
    clean_desc = (description or "").strip()
    desc_lower = clean_desc.lower()
    
    # Smart Fallback logic: Agar API fail ho jaye ya API Key na ho, tab bhi sensible default jaye
    is_urgent = any(word in desc_lower for word in ["burst", "pipe", "outbreak", "flood", "hazard", "gushing", "leakage", "water", "wire", "fire"])
    fallback_summary = clean_desc[:250] + ("..." if len(clean_desc) > 250 else "")

    fallback = {
        "category": "Water" if "water" in desc_lower or "pipe" in desc_lower else "Other",
        "summary": fallback_summary if fallback_summary else title,
        "priority": "high" if is_urgent else "medium",
    }

    if not _client:
        print("[AI Analyzer] WARNING: GEMINI_API_KEY is missing or invalid. Using fallback.")
        return fallback

    try:
        prompt = f"""
You are an expert civic issue analyzer for Pakistani cities.

Analyze this civic problem report and provide:
1. Category (Roads, Water, Sanitation, Electricity, Health, Education, Other)
2. Summary (2-3 sentences explaining the issue clearly)
3. Priority (high, medium, low) using these criteria:

   HIGH priority -- any of these apply:
   - Immediate risk to life or public health (contaminated drinking water,
     disease outbreak risk, gas leaks, exposed live wires, structural
     collapse risk, fire hazards)
   - Affects a large number of people (hundreds+) or a critical facility
     (hospital, school, main road/artery)
   - No safe alternative currently available to affected residents

   MEDIUM priority -- causes real inconvenience or economic loss but no
   immediate danger to life or health (e.g. intermittent power outages,
   minor road damage, delayed but available water supply)

   LOW priority -- cosmetic, minor, or affects very few people with easy
   workarounds available

Report Details:
- Title: {title}
- Description: {clean_desc[:4000]}
- Location: {location}

Respond ONLY with a valid JSON object:
{{
    "category": "category_name",
    "summary": "brief summary here",
    "priority": "high|medium|low"
}}
"""

        response = _client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                max_output_tokens=500,
                temperature=0.2,
            ),
        )

        response_text = response.text.strip()

        # Clean markdown wrappers if returned
        if "```" in response_text:
            response_text = re.sub(r"```json\s*|\s*```", "", response_text).strip()

        analysis = json.loads(response_text)

        priority = str(analysis.get("priority", "medium")).lower()
        if priority not in VALID_PRIORITIES:
            priority = "medium"

        return {
            "category": analysis.get("category") or fallback["category"],
            "summary": analysis.get("summary") or fallback["summary"],
            "priority": priority,
        }

    except Exception as e:
        print(f"[AI Analyzer] Error analyzing issue via Gemini AI: {e}")
        return fallback