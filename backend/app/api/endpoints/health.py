from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.core.database import get_db
from app.core.config import settings
from app.models.db_models import MLModel
from app.schemas.schemas import HealthResponse
from datetime import datetime, timezone

router = APIRouter()

@router.get("/health", response_model=HealthResponse)
def check_health(db: Session = Depends(get_db)):
    db_status = "Connected"
    try:
        db.execute(text("SELECT 1"))
    except Exception as e:
        db_status = f"Unavailable: {str(e)}"

    active_model = db.query(MLModel).filter(MLModel.is_active == True).first()
    active_model_name = f"{active_model.model_name} ({active_model.version})" if active_model else "Rule-based Fallback"

    return HealthResponse(
        status="ok",
        version=settings.PROJECT_VERSION,
        timestamp=datetime.now(timezone.utc).isoformat(),
        database=db_status,
        active_model=active_model_name
    )
