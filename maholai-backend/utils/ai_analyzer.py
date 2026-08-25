
# import json
# import re
# from google import genai
# from google.genai import types
# from config import GEMINI_API_KEY

# # Client ko global single-instance ke taur par initialize kiya gaya hai
# if GEMINI_API_KEY:
#     _client = genai.Client(api_key=GEMINI_API_KEY)
# else:
#     _client = None

# VALID_PRIORITIES = {"high", "medium", "low"}


# def analyze_issue(title: str, description: str, location: str = "") -> dict:
#     """
#     Use Gemini AI to analyze a civic issue report.
#     Returns: {"category": str, "summary": str, "priority": "high"|"medium"|"low"}

#     Never raises -- falls back to a safe default on any error (missing key,
#     API failure, timeout, bad JSON) so issue creation is never blocked.
#     """
#     clean_desc = (description or "").strip()
#     desc_lower = clean_desc.lower()
    
#     # Smart Fallback logic: Agar API fail ho jaye ya API Key na ho, tab bhi sensible default jaye
#     is_urgent = any(word in desc_lower for word in ["burst", "pipe", "outbreak", "flood", "hazard", "gushing", "leakage", "water", "wire", "fire"])
#     fallback_summary = clean_desc[:250] + ("..." if len(clean_desc) > 250 else "")

#     fallback = {
#         "category": "Water" if "water" in desc_lower or "pipe" in desc_lower else "Other",
#         "summary": fallback_summary if fallback_summary else title,
#         "priority": "high" if is_urgent else "medium",
#     }

#     if not _client:
#         print("[AI Analyzer] WARNING: GEMINI_API_KEY is missing or invalid. Using fallback.")
#         return fallback

#     try:
#         prompt = f"""
# You are an expert civic issue analyzer for Pakistani cities.

# Analyze this civic problem report and provide:
# 1. Category (Roads, Water, Sanitation, Electricity, Health, Education, Other)
# 2. Summary (2-3 sentences explaining the issue clearly)
# 3. Priority (high, medium, low) using these criteria:

#    HIGH priority -- any of these apply:
#    - Immediate risk to life or public health (contaminated drinking water,
#      disease outbreak risk, gas leaks, exposed live wires, structural
#      collapse risk, fire hazards)
#    - Affects a large number of people (hundreds+) or a critical facility
#      (hospital, school, main road/artery)
#    - No safe alternative currently available to affected residents

#    MEDIUM priority -- causes real inconvenience or economic loss but no
#    immediate danger to life or health (e.g. intermittent power outages,
#    minor road damage, delayed but available water supply)

#    LOW priority -- cosmetic, minor, or affects very few people with easy
#    workarounds available

# Report Details:
# - Title: {title}
# - Description: {clean_desc[:4000]}
# - Location: {location}

# Respond ONLY with a valid JSON object:
# {{
#     "category": "category_name",
#     "summary": "brief summary here",
#     "priority": "high|medium|low"
# }}
# """

#         response = _client.models.generate_content(
#             model="gemini-2.0-flash",
#             contents=prompt,
#             config=types.GenerateContentConfig(
#                 response_mime_type="application/json",
#                 max_output_tokens=500,
#                 temperature=0.2,
#             ),
#         )

#         response_text = response.text.strip()

#         # Clean markdown wrappers if returned
#         if "```" in response_text:
#             response_text = re.sub(r"```json\s*|\s*```", "", response_text).strip()

#         analysis = json.loads(response_text)

#         priority = str(analysis.get("priority", "medium")).lower()
#         if priority not in VALID_PRIORITIES:
#             priority = "medium"

#         return {
#             "category": analysis.get("category") or fallback["category"],
#             "summary": analysis.get("summary") or fallback["summary"],
#             "priority": priority,
#         }

#     except Exception as e:
#         print(f"[AI Analyzer] Error analyzing issue via Gemini AI: {e}")
#         return fallback

#         def check_duplicate_with_ai(new_title: str, new_desc: str, existing_issues: list) -> dict:
#     """
#     Compares a new issue against existing issues using Gemini AI.
#     Returns: {"is_duplicate": bool, "matched_issue_id": str | None}
#     """
#     if not existing_issues:
#         return {"is_duplicate": False, "matched_issue_id": None}

#     candidates = [
#         {
#             "id": str(iss["_id"]),
#             "title": iss.get("title", ""),
#             "description": iss.get("description", "")[:200],
#             "area": iss.get("location", {}).get("area", "")
#         }
#         for iss in existing_issues
#     ]

#     if not _client:
#         # Fallback if AI key is missing
#         for item in candidates:
#             if new_title.lower() in item["title"].lower() or item["title"].lower() in new_title.lower():
#                 return {"is_duplicate": True, "matched_issue_id": item["id"]}
#         return {"is_duplicate": False, "matched_issue_id": None}

#     try:
#         prompt = f"""
# Analyze if the new issue refers to the EXACT SAME physical problem as any existing issue.

# New Issue:
# - Title: {new_title}
# - Description: {new_desc[:1000]}

# Existing Issues:
# {json.dumps(candidates, indent=2)}

# Respond ONLY with JSON:
# {{
#     "is_duplicate": true|false,
#     "matched_issue_id": "ID_string_or_null"
# }}
# """
#         response = _client.models.generate_content(
#             model="gemini-2.0-flash",
#             contents=prompt,
#             config=types.GenerateContentConfig(
#                 response_mime_type="application/json",
#                 max_output_tokens=200,
#                 temperature=0.1,
#             ),
#         )

#         response_text = response.text.strip()
#         if "```" in response_text:
#             response_text = re.sub(r"```json\s*|\s*```", "", response_text).strip()

#         result = json.loads(response_text)
#         return {
#             "is_duplicate": bool(result.get("is_duplicate", False)),
#             "matched_issue_id": result.get("matched_issue_id")
#         }

#     except Exception as e:
#         print(f"[AI Analyzer] Duplicate check error: {e}")
#         return {"is_duplicate": False, "matched_issue_id": None}

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
            model="gemini-3.6-flash",
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                max_output_tokens=1024,
                temperature=0.2,
            ),
        )

        response_text = response.text.strip()
        # print("=== RAW RESPONSE (analyze_issue) ===")
        # print(repr(response_text))
        # print("=== END ===")

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


def check_duplicate_with_ai(new_title: str, new_desc: str, existing_issues: list) -> dict:
    """
    Compares a new issue against existing issues using Gemini AI.
    Returns: {"is_duplicate": bool, "matched_issue_id": str | None}
    """
    if not existing_issues:
        return {"is_duplicate": False, "matched_issue_id": None}

    candidates = [
        {
            "id": str(iss["_id"]),
            "title": iss.get("title", ""),
            "description": iss.get("description", "")[:200],
            "area": iss.get("location", {}).get("area", "")
        }
        for iss in existing_issues
    ]

    if not _client:
        for item in candidates:
            if new_title.lower() in item["title"].lower() or item["title"].lower() in new_title.lower():
                return {"is_duplicate": True, "matched_issue_id": item["id"]}
        return {"is_duplicate": False, "matched_issue_id": None}

    try:
        prompt = f"""
Analyze if the new issue refers to the EXACT SAME physical problem as any existing issue.

New Issue:
- Title: {new_title}
- Description: {new_desc[:1000]}

Existing Issues:
{json.dumps(candidates, indent=2)}

Respond ONLY with JSON:
{{
    "is_duplicate": true|false,
    "matched_issue_id": "ID_string_or_null"
}}
"""
        response = _client.models.generate_content(
            model="gemini-3.6-flash",
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                max_output_tokens=600,
                temperature=0.1,
            ),
        )

        response_text = response.text.strip()
        # print("=== RAW RESPONSE (check_duplicate_with_ai) ===")
        # print(repr(response_text))
        # print("=== END ===")

        if "```" in response_text:
            response_text = re.sub(r"```json\s*|\s*```", "", response_text).strip()

        result = json.loads(response_text)
        return {
            "is_duplicate": bool(result.get("is_duplicate", False)),
            "matched_issue_id": result.get("matched_issue_id")
        }

    except Exception as e:
        print(f"[AI Analyzer] Duplicate check error: {e}")
        return {"is_duplicate": False, "matched_issue_id": None}