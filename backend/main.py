from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging

# Establish root logging formatting
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

from routers.xray import router as xray_router
from routers.tax import router as tax_router
from routers.ai_advisor import router as ai_advisor_router
from routers.calculators import router as calculators_router
from routers.behavior import router as behavior_router
from routers.health import router as health_router
from routers.dashboard_router import router as dashboard_router

app = FastAPI(
    title="ArthSaathi Backend API",
    description="Engine for MF X-Ray, Tax Wizard, FIRE Calculators, and SEBI-Level Anthropic Advisory.",
    version="1.0.0"
)

# Connect heavily asynchronous routers to the FastAPI framework securely
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Expand cleanly in production builds
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Wire all routers together, guaranteeing asynchronous endpoints handle high concurrency
app.include_router(xray_router)
app.include_router(tax_router)
app.include_router(ai_advisor_router)
app.include_router(calculators_router)
app.include_router(behavior_router, prefix="/api/v1/behavior", tags=["Behavior"])
app.include_router(health_router)
app.include_router(dashboard_router)

@app.get("/health")
async def health_check():
    """Core health ping identifying active services."""
    return {"status": "ok", "app": "ArthSaathi Engine Linked!"}
