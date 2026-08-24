
import os
from dotenv import load_dotenv

load_dotenv()

MONGODB_URI = os.getenv(
    "MONGODB_URI",
    "mongodb://mduzair0322:uzair0322@ac-tbbvmug-shard-00-00.zvzhrde.mongodb.net:27017,ac-tbbvmug-shard-00-01.zvzhrde.mongodb.net:27017,ac-tbbvmug-shard-00-02.zvzhrde.mongodb.net:27017/maholai?ssl=true&authSource=admin&retryWrites=true&w=majority"
)
DATABASE_NAME = os.getenv("DATABASE_NAME", "maholai")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
JWT_SECRET_KEY = os.getenv(
    "JWT_SECRET_KEY",
    "maholai_super_secret_jwt_key_2026_safe_32_bytes_long!"
)

print(f"Config loaded - Database: {DATABASE_NAME}")
print("Gemini API Key loaded" if GEMINI_API_KEY else "WARNING: Gemini API Key NOT found!")