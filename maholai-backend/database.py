

# from pymongo import MongoClient, ASCENDING, DESCENDING
# from pymongo.errors import PyMongoError
# from config import MONGODB_URI, DATABASE_NAME

# client = MongoClient(
#     MONGODB_URI,
#     serverSelectionTimeoutMS=10000,
#     connectTimeoutMS=10000,
#     socketTimeoutMS=20000,
#     retryWrites=True
# )
# database = client[DATABASE_NAME]

# issues_collection = database["issues"]
# users_collection = database["users"]
# audit_logs_collection = database["audit_logs"]


# def ping_database():
#     """Ping MongoDB server to warm up connection pool on startup."""
#     try:
#         client.admin.command('ping')
#         return True
#     except Exception as e:
#         print(f"MongoDB connection ping warning: {e}")
#         return False


# def init_indexes():
#     """Initialize MongoDB indexes for query performance."""
#     try:
#         # NOTE: uses dot-notation for nested location fields
#         # (location: { district, area, lat, lng }) — must match
#         # exactly how models/issue.py stores it, or this index
#         # will silently never be used.
#         issues_collection.create_index([
#             ("category", ASCENDING),
#             ("location.district", ASCENDING),
#             ("location.area", ASCENDING),
#             ("status", ASCENDING),
#             ("created_at", DESCENDING)
#         ])
#         users_collection.create_index("cnic", unique=True, sparse=True)
#         users_collection.create_index("email", unique=True, sparse=True)
#         users_collection.create_index([("role", ASCENDING), ("status", ASCENDING)])
#         audit_logs_collection.create_index([("timestamp", DESCENDING)])
#         print("MongoDB indexes verified/created successfully.")
#     except Exception as e:
#         print(f"Warning initializing MongoDB indexes: {e}")


# print("MongoDB client initialized")
from pymongo import MongoClient, ASCENDING, DESCENDING
from pymongo.errors import PyMongoError
from config import MONGODB_URI, DATABASE_NAME

client = MongoClient(
    MONGODB_URI,
    serverSelectionTimeoutMS=10000,
    connectTimeoutMS=10000,
    socketTimeoutMS=20000,
    retryWrites=True
)
database = client[DATABASE_NAME]

issues_collection = database["issues"]
users_collection = database["users"]
audit_logs_collection = database["audit_logs"]
notifications_collection = database["notifications"]


def ping_database():
    """Ping MongoDB server to warm up connection pool on startup."""
    try:
        client.admin.command('ping')
        return True
    except Exception as e:
        print(f"MongoDB connection ping warning: {e}")
        return False


def init_indexes():
    """Initialize MongoDB indexes safely without crashing on existing conflicts."""
    try:
        # Step 1: Safe drop of existing email index if conflict exists
        try:
            users_collection.drop_index("email_1")
        except Exception:
            pass

        # Step 2: Create structured query indexes
        issues_collection.create_index([
            ("category", ASCENDING),
            ("location.district", ASCENDING),
            ("location.area", ASCENDING),
            ("status", ASCENDING),
            ("created_at", DESCENDING)
        ])
        
        users_collection.create_index("cnic", unique=True, sparse=True)
        users_collection.create_index("email", unique=True, sparse=True)
        users_collection.create_index([("role", ASCENDING), ("status", ASCENDING)])
        
        audit_logs_collection.create_index([("timestamp", DESCENDING)])
        notifications_collection.create_index([("user_id", ASCENDING), ("created_at", DESCENDING)])
        issues_collection.create_index([("location_area", ASCENDING), ("category", ASCENDING)])
        
        print("MongoDB indexes verified/created successfully.")
    except Exception as e:
        print(f"Warning initializing MongoDB indexes: {e}")


print("MongoDB client initialized")