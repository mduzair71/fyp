from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from routes.issues import router as issues_router
from routes.auth import router as auth_router
from database import database, ping_database, init_indexes

@asynccontextmanager
async def lifespan(app: FastAPI):
    if ping_database():
        print("Connected to MongoDB successfully!")
        init_indexes()
    else:
        print("WARNING: Could not connect to MongoDB on startup!")
    yield


app = FastAPI(
    title="MaholAI Backend",
    description="Civic problem reporting system",
    version="1.0",
    lifespan=lifespan
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # your Next.js dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(issues_router)
app.include_router(auth_router)

# Serve uploaded images
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

@app.get("/")
def root():
    return {"message": "✅ MaholAI Backend is Running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)