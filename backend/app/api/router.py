from fastapi import APIRouter
from app.api.endpoints import health, datasets, predictions, models, analytics, settings

api_router = APIRouter()

api_router.include_router(health.router, tags=["Health"])
api_router.include_router(datasets.router, prefix="/datasets", tags=["Datasets"])
api_router.include_router(predictions.router, prefix="/predictions", tags=["Predictions"])
api_router.include_router(models.router, prefix="/models", tags=["Models"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["Analytics"])
api_router.include_router(settings.router, prefix="/settings", tags=["Settings"])
