import pytest
import pandas as pd
import numpy as np
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.services.spi_spei import DroughtIndexCalculator

def test_spi_insufficient_data():
    short_series = pd.Series([10.0, 20.0, 5.0, 0.0])
    spi, meta = DroughtIndexCalculator.calculate_spi(short_series, scale=1)
    assert meta["status"] == "ERROR"
    assert "Insufficient data" in meta["message"]

def test_spi_calculation_and_zeros():
    # 36 months of realistic rainfall with seasonal zeros
    np.random.seed(123)
    precip = [0.0 if i % 6 == 0 else float(np.random.gamma(shape=2.0, scale=30.0)) for i in range(36)]
    series = pd.Series(precip)
    
    spi, meta = DroughtIndexCalculator.calculate_spi(series, scale=1)
    assert meta["status"] == "SUCCESS"
    assert meta["zero_probability_q"] > 0.0
    assert len(spi.dropna()) == 36
    # SPI values should be within standard bounds (-3.5, 3.5)
    assert spi.min() >= -3.5
    assert spi.max() <= 3.5

def test_drought_severity_classification():
    assert DroughtIndexCalculator.classify_drought_index(0.5) == "Normal"
    assert DroughtIndexCalculator.classify_drought_index(-0.5) == "Normal"
    assert DroughtIndexCalculator.classify_drought_index(-1.2) == "Moderate"
    assert DroughtIndexCalculator.classify_drought_index(-1.75) == "Severe"
    assert DroughtIndexCalculator.classify_drought_index(-2.3) == "Extreme"

def test_spei_calculation():
    np.random.seed(456)
    precip = pd.Series([float(np.random.uniform(5.0, 150.0)) for _ in range(36)])
    pet = pd.Series([float(np.random.uniform(30.0, 80.0)) for _ in range(36)])

    spei, meta = DroughtIndexCalculator.calculate_spei(precip, pet, scale=3)
    assert meta["status"] == "SUCCESS"
    # First 2 values are NaN due to rolling window of 3
    assert spei.iloc[0] is None or np.isnan(spei.iloc[0])
    assert not np.isnan(spei.iloc[3])
