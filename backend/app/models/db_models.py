import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, Text, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class Dataset(Base):
    __tablename__ = "datasets"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    file_type = Column(String(50), nullable=False)
    upload_timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    row_count = Column(Integer, default=0)
    date_range_start = Column(String(50), nullable=True)
    date_range_end = Column(String(50), nullable=True)
    validation_status = Column(String(50), default="PENDING")  # PENDING, VALID, WARNING, INVALID
    processing_status = Column(String(50), default="RAW")      # RAW, PROCESSED, ERROR
    source_information = Column(String(255), default="Manual Upload")
    file_path = Column(String(500), nullable=True)
    quality_report_json = Column(Text, nullable=True)

    records = relationship("EnvironmentalRecord", back_populates="dataset", cascade="all, delete-orphan")


class Location(Base):
    __tablename__ = "locations"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(255), unique=True, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    region_metadata = Column(String(255), nullable=True)
    is_demo = Column(Boolean, default=False)

    records = relationship("EnvironmentalRecord", back_populates="location")
    predictions = relationship("PredictionRecord", back_populates="location")


class EnvironmentalRecord(Base):
    __tablename__ = "environmental_records"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    dataset_id = Column(Integer, ForeignKey("datasets.id"), nullable=True)
    location_id = Column(Integer, ForeignKey("locations.id"), nullable=False)
    observation_date = Column(String(50), index=True, nullable=False)
    
    # Meteorological and Hydrological parameters
    rainfall = Column(Float, nullable=True)                  # mm
    temp_min = Column(Float, nullable=True)                  # °C
    temp_max = Column(Float, nullable=True)                  # °C
    temp_avg = Column(Float, nullable=True)                  # °C
    humidity = Column(Float, nullable=True)                  # %
    wind_speed = Column(Float, nullable=True)                # m/s
    soil_moisture = Column(Float, nullable=True)             # % or m3/m3
    streamflow = Column(Float, nullable=True)                # m3/s
    evapotranspiration = Column(Float, nullable=True)        # mm
    
    # Calculated Drought Indices
    spi = Column(Float, nullable=True)
    spei = Column(Float, nullable=True)
    severity_label = Column(String(50), nullable=True)       # Normal, Moderate, Severe, Extreme

    dataset = relationship("Dataset", back_populates="records")
    location = relationship("Location", back_populates="records")


class MLModel(Base):
    __tablename__ = "ml_models"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    model_name = Column(String(100), nullable=False)
    algorithm = Column(String(100), nullable=False)          # Random Forest, XGBoost, Decision Tree, Logistic Regression
    version = Column(String(50), nullable=False)
    features_json = Column(Text, nullable=False)             # JSON list of features used
    target_definition = Column(String(255), nullable=False)
    training_dataset_name = Column(String(255), nullable=True)
    training_timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    evaluation_metrics_json = Column(Text, nullable=True)    # JSON metrics: accuracy, precision, recall, f1, auc, cm
    feature_importance_json = Column(Text, nullable=True)    # JSON dict of feature importances
    artifact_path = Column(String(500), nullable=True)
    is_active = Column(Boolean, default=False)

    training_runs = relationship("TrainingRun", back_populates="model", cascade="all, delete-orphan")


class TrainingRun(Base):
    __tablename__ = "training_runs"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    model_id = Column(Integer, ForeignKey("ml_models.id"), nullable=True)
    status = Column(String(50), default="STARTED")           # STARTED, RUNNING, COMPLETED, FAILED
    started_timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    completed_timestamp = Column(DateTime, nullable=True)
    error_details = Column(Text, nullable=True)
    evaluation_summary_json = Column(Text, nullable=True)

    model = relationship("MLModel", back_populates="training_runs")


class PredictionRecord(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    location_id = Column(Integer, ForeignKey("locations.id"), nullable=True)
    location_name = Column(String(255), nullable=False)
    prediction_date = Column(String(50), nullable=False)
    drought_probability = Column(Float, nullable=False)      # 0.0 to 100.0 %
    severity = Column(String(50), nullable=False)            # Normal, Moderate, Severe, Extreme
    warning_status = Column(String(50), nullable=False)      # Normal, Watch, Warning, Critical
    model_version = Column(String(100), nullable=False)
    model_name = Column(String(100), nullable=False)
    input_snapshot_json = Column(Text, nullable=False)       # JSON of raw input values
    explanation_json = Column(Text, nullable=True)           # Contributing factors & suggested actions
    threshold_config_json = Column(Text, nullable=True)      # Threshold rules at prediction time
    created_timestamp = Column(DateTime, default=datetime.datetime.utcnow)

    location = relationship("Location", back_populates="predictions")


class AppSetting(Base):
    __tablename__ = "app_settings"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    setting_key = Column(String(100), unique=True, nullable=False)
    setting_value_json = Column(Text, nullable=False)
    updated_timestamp = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
