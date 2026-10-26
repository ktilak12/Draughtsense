import pytest
import pandas as pd
import numpy as np
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.services.ml_pipeline import DroughtMLPipeline

def test_ml_pipeline_train_and_predict(tmp_path):
    np.random.seed(42)
    n = 60
    dates = pd.date_range("2021-01-01", periods=n, freq="ME").strftime("%Y-%m-%d")
    
    df = pd.DataFrame({
        "observation_date": dates,
        "rainfall": np.random.uniform(0.0, 150.0, n),
        "temp_avg": np.random.uniform(18.0, 38.0, n),
        "humidity": np.random.uniform(20.0, 90.0, n),
        "wind_speed": np.random.uniform(1.0, 8.0, n),
        "soil_moisture": np.random.uniform(10.0, 70.0, n),
        "streamflow": np.random.uniform(0.5, 10.0, n),
        "evapotranspiration": np.random.uniform(20.0, 80.0, n),
        "severity_label": np.random.choice(["Normal", "Moderate", "Severe", "Extreme"], n)
    })

    metadata, artifact_path = DroughtMLPipeline.train_model(
        df=df,
        algorithm="Random Forest",
        test_size=0.25
    )

    assert "metrics" in metadata
    assert metadata["metrics"]["accuracy"] >= 0.0
    assert metadata["metrics"]["train_samples"] == 45
    assert metadata["metrics"]["test_samples"] == 15
    assert os.path.exists(artifact_path)

    # Test prediction
    test_input = {
        "rainfall": 5.0,
        "temp_avg": 34.0,
        "humidity": 25.0,
        "wind_speed": 4.5,
        "soil_moisture": 12.0,
        "streamflow": 0.4,
        "evapotranspiration": 65.0
    }
    prob, severity, explanation = DroughtMLPipeline.predict_single(artifact_path, test_input)
    assert 0.0 <= prob <= 100.0
    assert severity in ["Normal", "Moderate", "Severe", "Extreme"]
    assert "primary_factors" in explanation
