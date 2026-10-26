from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

from app.core.config import settings
from app.core.database import engine, Base, SessionLocal
from app.api.router import api_router
from app.models.db_models import Location, Dataset, MLModel
from app.api.endpoints.datasets import load_demo_dataset
from app.schemas.schemas import ModelTrainRequest
from app.api.endpoints.models import train_model

# Initialize SQLite database schema
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="A Machine Learning-Based Framework for Drought Prediction and Early Warning Using Hydrological and Meteorological Data.",
    version=settings.PROJECT_VERSION
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include central API router
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.on_event("startup")
def startup_db_seed():
    """
    On initial boot, seed the demo dataset and train initial baseline models if database has no records.
    """
    db = SessionLocal()
    try:
        loc_count = db.query(Location).count()
        if loc_count == 0:
            print("[DroughtSense Startup] Initializing demo hydrometeorological dataset...")
            load_demo_dataset(db=db)
            
            # Train default Random Forest model
            existing_models = db.query(MLModel).count()
            if existing_models == 0:
                print("[DroughtSense Startup] Training initial Random Forest model...")
                try:
                    train_model(
                        payload=ModelTrainRequest(
                            algorithm="Random Forest",
                            target_type="drought_severity",
                            test_size=0.2
                        ),
                        db=db
                    )
                except Exception as e:
                    print(f"[DroughtSense Startup] Initial model train notice: {e}")
    finally:
        db.close()

@app.get("/")
def root():
    return {
        "project": "DroughtSense API",
        "version": settings.PROJECT_VERSION,
        "docs_url": "/docs",
        "api_v1": settings.API_V1_STR
    }
