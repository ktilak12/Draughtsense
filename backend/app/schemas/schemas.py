from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field, ConfigDict
import datetime

# --- Health Schema ---
class HealthResponse(BaseModel):
    status: str
    version: str
    timestamp: str
    database: str
    active_model: Optional[str] = None


# --- Dataset Schemas ---
class DatasetCreate(BaseModel):
    name: str
    source_information: Optional[str] = "Manual Upload"

class ColumnMapping(BaseModel):
    date_col: str
    rainfall_col: str
    temp_min_col: Optional[str] = None
    temp_max_col: Optional[str] = None
    temp_avg_col: Optional[str] = None
    humidity_col: Optional[str] = None
    wind_speed_col: Optional[str] = None
    soil_moisture_col: Optional[str] = None
    streamflow_col: Optional[str] = None
    location_col: Optional[str] = None

class DataValidationReport(BaseModel):
    total_rows: int
    valid_rows: int
    missing_values: Dict[str, int]
    duplicate_rows: int
    outlier_counts: Dict[str, int]
    invalid_dates: int
    validation_status: str  # VALID, WARNING, INVALID
    warnings: List[str] = []
    errors: List[str] = []

class DatasetResponse(BaseModel):
    id: int
    name: str
    file_type: str
    upload_timestamp: datetime.datetime
    row_count: int
    date_range_start: Optional[str] = None
    date_range_end: Optional[str] = None
    validation_status: str
    processing_status: str
    source_information: str
    quality_report_json: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


# --- Prediction Schemas ---
class ManualPredictionRequest(BaseModel):
    location_name: str = Field(..., description="Monitored region or station name")
    prediction_date: str = Field(..., description="YYYY-MM-DD")
    rainfall: float = Field(..., ge=0.0, le=1000.0, description="Precipitation in mm (required)")
    temp_min: Optional[float] = Field(None, ge=-50.0, le=60.0, description="Min temp °C")
    temp_max: Optional[float] = Field(None, ge=-50.0, le=60.0, description="Max temp °C")
    temp_avg: Optional[float] = Field(None, ge=-50.0, le=60.0, description="Average temp °C")
    humidity: Optional[float] = Field(None, ge=0.0, le=100.0, description="Relative humidity %")
    wind_speed: Optional[float] = Field(None, ge=0.0, le=100.0, description="Wind speed m/s")
    soil_moisture: Optional[float] = Field(None, ge=0.0, le=100.0, description="Soil moisture % or vol%")
    streamflow: Optional[float] = Field(None, ge=0.0, le=10000.0, description="Streamflow m3/s")
    evapotranspiration: Optional[float] = Field(None, ge=0.0, le=100.0, description="PET in mm")
    spi: Optional[float] = Field(None, ge=-5.0, le=5.0, description="Recent SPI index")
    spei: Optional[float] = Field(None, ge=-5.0, le=5.0, description="Recent SPEI index")

class BatchPredictionRequest(BaseModel):
    dataset_id: int
    location_id: Optional[int] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None

class PredictionExplanation(BaseModel):
    primary_factors: List[Dict[str, Any]]
    suggested_actions: List[str]
    limitations: str

class PredictionResponse(BaseModel):
    id: Optional[int] = None
    location_name: str
    prediction_date: str
    drought_probability: float
    severity: str  # Normal, Moderate, Severe, Extreme
    warning_status: str  # Normal, Watch, Warning, Critical
    model_name: str
    model_version: str
    input_snapshot: Dict[str, Any]
    explanation: PredictionExplanation
    created_timestamp: str

    model_config = ConfigDict(from_attributes=True)


# --- Model Schemas ---
class ModelTrainRequest(BaseModel):
    algorithm: str = Field(..., description="Random Forest, XGBoost, Decision Tree, Logistic Regression")
    target_type: str = Field("drought_severity", description="drought_severity or binary_drought")
    features: Optional[List[str]] = None
    dataset_id: Optional[int] = None
    test_size: float = Field(0.2, ge=0.1, le=0.4)

class ModelMetrics(BaseModel):
    accuracy: float
    precision: float
    recall: float
    f1_score: float
    auc_roc: Optional[float] = None
    confusion_matrix: List[List[int]]
    classes: List[str]
    per_class: Dict[str, Dict[str, float]]
    train_samples: int
    test_samples: int

class ModelResponse(BaseModel):
    id: int
    model_name: str
    algorithm: str
    version: str
    features: List[str]
    target_definition: str
    training_dataset_name: Optional[str]
    training_timestamp: datetime.datetime
    evaluation_metrics: Optional[Dict[str, Any]] = None
    feature_importance: Optional[Dict[str, float]] = None
    is_active: bool

    model_config = ConfigDict(from_attributes=True)


# --- Analytics & Map Schemas ---
class MapStation(BaseModel):
    id: int
    name: str
    latitude: float
    longitude: float
    region: Optional[str] = None
    is_demo: bool
    latest_rainfall: Optional[float] = None
    latest_temp: Optional[float] = None
    latest_soil_moisture: Optional[float] = None
    latest_spi: Optional[float] = None
    latest_spei: Optional[float] = None
    drought_probability: float
    severity: str
    warning_status: str
    observation_date: str

class AnalyticsSummary(BaseModel):
    monitored_stations: int
    total_records: int
    active_warnings_count: int
    average_rainfall: float
    average_soil_moisture: float
    severity_breakdown: Dict[str, int]
    current_system_status: str


# --- Settings Schemas ---
class SettingsPayload(BaseModel):
    default_location: str = "Central Region"
    preferred_units: str = "Metric (mm, °C)"
    default_date_range: str = "Last 12 Months"
    severity_thresholds: Dict[str, float] = {
        "moderate_spi": -1.0,
        "severe_spi": -1.5,
        "extreme_spi": -2.0,
        "moderate_prob": 40.0,
        "severe_prob": 65.0,
        "extreme_prob": 85.0
    }
    warning_thresholds: Dict[str, float] = {
        "watch_prob": 35.0,
        "warning_prob": 60.0,
        "critical_prob": 80.0
    }
    demo_mode_enabled: bool = True
