from pydantic import BaseModel
from typing import Optional, List


class UserRegister(BaseModel):
    name: str
    email: str
    password: str
    cnic: str
    phone: Optional[str] = None
    district: Optional[str] = None
    area: Optional[str] = None
    date_of_birth: Optional[str] = None
    address: Optional[str] = None


class UserLogin(BaseModel):
    cnic: str
    password: str


class SubAdminRegister(BaseModel):
    """Created only by Super Admin. Supports multi area + multi category."""
    name: str
    email: str
    password: str
    cnic: str
    phone: Optional[str] = None
    department: Optional[str] = None
    district: Optional[str] = None
    area: Optional[str] = None
    categories: Optional[List[str]] = None
    areas: Optional[List[str]] = None
    districts: Optional[List[str]] = None
    status: str = "active"


class SubAdminUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    password: Optional[str] = None
    department: Optional[str] = None
    district: Optional[str] = None
    area: Optional[str] = None
    categories: Optional[List[str]] = None
    areas: Optional[List[str]] = None
    districts: Optional[List[str]] = None
    status: Optional[str] = None
