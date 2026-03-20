from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from config.config import settings
from routers import xray, tax, ai_advisor, calculators

app = FastAPI(
    title="ArthSaathi API",
    description="Backend for ArthSaathi, a multi-agent AI financial mentor.",
    version="1.0.0"
)

# CORS middleware for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"], # Allowing standard React/Vite dev ports
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Placeholder for External Service / DB Dependency Injection
def get_db_session():
    """Yield a database session (to be implemented)."""
    db = None # Placeholder for actual db connection
    try:
        yield db
    finally:
        pass

@app.get("/health")
async def health_check(db = Depends(get_db_session)):
    """Basic health-check endpoint to verify API operations."""
    return {
        "status": "ok",
        "environment": settings.ENV,
        "message": "ArthSaathi backend is running."
    }

# Register Application Routers
app.include_router(xray.router)
app.include_router(tax.router)
app.include_router(ai_advisor.router)
app.include_router(calculators.router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=settings.PORT, reload=True)
