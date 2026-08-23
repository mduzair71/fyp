
# from pydantic import BaseModel
# from typing import Optional
# from datetime import datetime


# # ==================== STRUCTURED LOCATION ====================
# class IssueLocation(BaseModel):
#     """
#     Structured location model for an issue.
#     area  = local neighborhood/town (e.g. "Jehangira")
#     district = administrative district   (e.g. "Nowshera")
#     latitude / longitude = optional GPS coordinates
#     """
#     area: str
#     district: str
#     latitude: Optional[float] = None
#     longitude: Optional[float] = None


# # ==================== CATEGORY -> DEPARTMENT MAP ====================
# CATEGORY_DEPARTMENT_MAP = {
#     "Water": "WASA",
#     "Electricity": "LESCO",
#     "Gas": "FESCO",
#     "Road": "TMA / Municipal Authority",
#     "Garbage": "Sanitation Department",
#     "Drainage": "TMA / Municipal Authority",
#     "Streetlight": "TMA / Municipal Authority",
#     "Education": "Education Department",
#     "Healthcare": "Health Department",
#     "Other": "General Admin",
# }


# # ==================== ISSUE ====================
# class Issue(BaseModel):
#     category: str
#     problem_type: str
#     title: str
#     description: str
#     location_area: str          # e.g. "Jehangira"
#     location_district: str      # e.g. "Nowshera"
#     location_latitude: Optional[float] = None
#     location_longitude: Optional[float] = None
#     additional_info: Optional[str] = None
#     photo_url: Optional[str] = None

#     # AI-generated fields (filled after Claude analysis)
#     summary: Optional[str] = None
#     priority: Optional[str] = None

#     # Department assignment
#     department: Optional[str] = None   # auto-filled from CATEGORY_DEPARTMENT_MAP or overridden by AI/admin

#     status: str = "pending"
#     created_at: datetime = datetime.now()
#     created_by: str
#     reporter_name: Optional[str] = None
#     reporter_cnic: Optional[str] = None
#     reporter_phone: Optional[str] = None

#     class Config:
#         json_schema_extra = {
#             "example": {
#                 "category": "Water",
#                 "problem_type": "Pipeline Leakage",
#                 "title": "Pipeline burst on main road",
#                 "description": "Main pipeline leaking near school",
#                 "location_area": "Jehangira",
#                 "location_district": "Nowshera",
#                 "department": "WASA",
#                 "status": "pending",
#                 "created_by": "user123"
#             }
#         }
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

# ==================== STATUS HISTORY ENTRY ====================
class StatusHistoryItem(BaseModel):
    status: str
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    updated_by: Optional[str] = None
    note: Optional[str] = None

# ==================== STRUCTURED LOCATION ====================
class IssueLocation(BaseModel):
    area: str
    district: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None

# ==================== CATEGORY -> DEPARTMENT MAP ====================
CATEGORY_DEPARTMENT_MAP = {
    "Water": "WASA",
    "Electricity": "LESCO/PESCO",
    "Gas": "SNGPL",
    "Road": "TMA / Municipal Authority",
    "Garbage": "Sanitation Department",
    "Drainage": "TMA / Municipal Authority",
    "Streetlight": "TMA / Municipal Authority",
    "Education": "Education Department",
    "Healthcare": "Health Department",
    "Other": "General Admin",
}

# ==================== ISSUE MODEL ====================
class Issue(BaseModel):
    category: str
    problem_type: str
    title: str
    description: str
    location_area: str          # e.g. "Jehangira"
    location_district: str      # e.g. "Nowshera"
    location_latitude: Optional[float] = None
    location_longitude: Optional[float] = None
    additional_info: Optional[str] = None
    photo_url: Optional[str] = None

    # Auto Assigned/Updated Fields
    department: Optional[str] = None
    summary: Optional[str] = None
    priority: Optional[str] = "medium"
    
    # Community & Timeline Workflow
    status: str = "Submitted"
    status_history: List[StatusHistoryItem] = []
    supports: List[str] = []    # List of UserIDs who supported this complaint
    
    created_at: datetime = Field(default_factory=datetime.utcnow)
    created_by: str
    reporter_name: Optional[str] = None
    reporter_cnic: Optional[str] = None
    reporter_phone: Optional[str] = None

    class Config:
        json_schema_extra = {
            "example": {
                "category": "Road",
                "problem_type": "Road Damage",
                "title": "Main road damage in bazaar",
                "description": "Deep potholes causing traffic jams.",
                "location_area": "Main Bazaar",
                "location_district": "Swabi",
                "created_by": "60d5ec49f1a2c81128c11a1a"
            }
        }