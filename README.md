# DroughtSense: A Machine Learning-Based Framework for Drought Prediction and Early Warning

[![Python 3.11+](https://img.shields.io/badge/python-3.11+-blue.svg)](https://www.python.org/downloads/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-teal.svg)](https://fastapi.tiangolo.com)
[![React 19](https://img.shields.io/badge/React-19-61dafb.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.0+-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind-v4-38bdf8.svg)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**Course:** EHDS-2026 Project 1  
**Team Members:**
- **Vyoam Joshi** &mdash; `RA2411056010048`
- **Midhu John** &mdash; `RA2411026010534`
- **Tilak** &mdash; `RA241103010556`

---

## 1. Project Overview

**DroughtSense** is an environmental monitoring and machine learning platform that utilizes hydrological and meteorological observations to estimate drought probability, classify severity into WMO-standard categories, visualize spatial risk, and trigger early warnings.

The platform provides a functional end-to-end pipeline:
1. **Data Ingestion & Quality Control:** Automated column detection, type verification, duplicate removal, outlier screening, and CSV formula injection protection.
2. **Standardized Drought Indices:** Statistically robust calculations for the **Standardized Precipitation Index (SPI)** and **Standardized Precipitation Evapotranspiration Index (SPEI)** with zero-rainfall adjustments.
3. **Machine Learning Ensembles:** Date-based chronological training (preventing temporal data leakage) across **Random Forest** (primary proposed model), **XGBoost**, **Decision Trees**, and **Logistic Regression**.
4. **Early-Warning Engine:** Multi-criteria rule engine mapping probability, SPI, and root-zone moisture anomalies to alert tiers (**Normal**, **Watch**, **Warning**, **Critical**).
5. **Interactive Analytics:** Time-series trends, correlation matrix heatmaps, seasonal rainfall cycles, and OpenStreetMap spatial risk visualization.

---

## 2. System Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                    DroughtSense Frontend                     │
│  React 19 • Vite • TypeScript • Tailwind CSS • Recharts      │
│  React Leaflet OpenStreetMap • Lucide Icons • React Router   │
└──────────────────────────────▲───────────────────────────────┘
                               │ HTTP / JSON REST APIs
┌──────────────────────────────▼───────────────────────────────┐
│                     FastAPI Backend                          │
│  FastAPI • Pydantic V2 • Uvicorn • SQLAlchemy ORM            │
├──────────────────────────────┬───────────────────────────────┤
│    Statistical Indices       │     Machine Learning Core     │
│   • SPI (Gamma + Thom MLE)   │   • Random Forest Classifier  │
│   • SPEI (GEV / Water Bal.)  │   • XGBoost Ensemble          │
│   • PET (Thornthwaite)       │   • Decision Tree & LogReg    │
├──────────────────────────────┼───────────────────────────────┤
│    Data Quality Control      │      Early-Warning Rules      │
│   • Anti-Formula Injection   │   • Multi-Threshold Mapping   │
│   • IQR Outlier Screening    │   • Actionable Advisories     │
└──────────────────────────────▲───────────────────────────────┘
                               │
┌──────────────────────────────▼───────────────────────────────┐
│                     SQLite Database                          │
│  Datasets • Locations • Records • Models • Predictions       │
└──────────────────────────────────────────────────────────────┘
```

---

## 3. Drought Index Methodology

### 3.1 Standardized Precipitation Index (SPI)
SPI measures precipitation anomalies over a moving window $k$ (e.g., 3-month rolling sum) against a fitted 2-parameter Gamma distribution:

$$f(x; \alpha, \beta) = \frac{1}{\beta^\alpha \Gamma(\alpha)} x^{\alpha - 1} e^{-x/\beta}, \quad x > 0$$

Where:
- $\alpha$ (shape) and $\beta$ (scale) are fitted via Maximum Likelihood Estimation (MLE) or Thom's approximation.
- To account for zero-rainfall periods ($x = 0$), cumulative probability is adjusted:
  
  $$H(x) = q + (1 - q) G(x)$$
  
  where $q$ is the empirical probability of zero precipitation and $G(x)$ is the cumulative Gamma distribution.
- $H(x)$ is mapped to standard normal quantiles: $Z = \Phi^{-1}(H(x))$.

### 3.2 Standardized Precipitation Evapotranspiration Index (SPEI)
SPEI incorporates evaporative atmospheric demand by analyzing the climatic water balance:

$$D_i = P_i - \text{PET}_i$$

- Potential Evapotranspiration ($\text{PET}$) is computed via the Thornthwaite (1948) or Hargreaves-Samani method based on temperature and latitude.
- Aggregated water balance $D$ is fitted to Generalized Extreme Value (GEV) and Pearson Type III distributions, accounting for negative deficits.

### 3.3 Severity Classification Convention

| SPI / SPEI Range | Severity Class | Visual Badge | Indicator Meaning |
| :--- | :--- | :--- | :--- |
| $\ge -0.99$ | **Normal** | `Green` | Near-normal moisture or surplus |
| $-1.00 \text{ to } -1.49$ | **Moderate** | `Amber` | Mild moisture deficit; early soil drying |
| $-1.50 \text{ to } -1.99$ | **Severe** | `Orange` | Substantial precipitation deficit; crop stress |
| $\le -2.00$ | **Extreme** | `Red` | Critical water balance collapse; emergency |

---

## 4. Application Pages

The application is structured into 9 dedicated pages:

1. **Overview Dashboard (`/`):** Summary cards (Drought Probability, Severity, Rainfall, Soil Moisture, SPI/SPEI, Early Warning Status), interactive trend graphs, and recent activity logs.
2. **Drought Prediction (`/prediction`):** Manual input form (Method A) with input validation and batch dataset inference (Method B) with feature factor breakdown and mitigation advisories.
3. **Environmental Data (`/data`):** CSV/Excel file upload, automated column detection, data quality report (missing values, duplicates, outliers), and single-click demo data ingestion.
4. **Drought Risk Map (`/map`):** Interactive OpenStreetMap with color-coded severity markers, station popups, and severity filtering.
5. **Trends & Analytics (`/analytics`):** Multi-year environmental curves, seasonal rainfall bar charts, and a Pearson correlation heatmap matrix.
6. **Model Performance (`/models`):** Training trigger with chronological train/test split, model comparison matrix, confusion matrix, and feature importance chart.
7. **Prediction History (`/history`):** Complete persistent audit trail with keyword search, multi-factor filtering, pagination, snapshot inspection, and CSV export.
8. **Settings (`/settings`):** Configurable thresholds for drought severity and early-warning alerts, measurement unit preferences, and demo mode settings.
9. **About Project (`/about`):** Academic course details (EHDS-2026 Project 1), team credentials, mathematical formulas, and scientific disclaimers.

---

## 5. Getting Started & Installation

### Prerequisites
- **Python 3.11+** installed
- **Node.js v18+** & **npm** installed
- Git

### Step 1: Clone Repository
```bash
git clone https://github.com/your-username/DroughtSense.git
cd DroughtSense
```

### Step 2: Backend Setup
```bash
# Navigate to backend and install dependencies
cd backend
python -m pip install -r requirements.txt

# Run backend development server
python run.py
```
*The FastAPI backend will start at `http://localhost:8000`. Automatic API documentation is accessible at `http://localhost:8000/docs`.*

### Step 3: Frontend Setup
In a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
*The Vite React frontend will start at `http://localhost:5173`.*

---

## 6. Running Automated Tests

The repository includes a suite of unit and integration tests covering the SPI/SPEI mathematical calculations, data validation pipelines, ML training ensembles, and REST API endpoints.

```bash
# Run pytest from the repository root
python -m pytest backend/tests -v
```

**Verification Results:**
- `test_spi_spei.py`: Validates Gamma fitting, zero-rainfall adjustments, and SPEI water balance.
- `test_data_processor.py`: Verifies column auto-detection, formula injection sanitization, and IQR outlier screening.
- `test_ml_pipeline.py`: Validates chronological train/test split, scaling fit, metrics, and artifact serialization.
- `test_api.py`: Validates health check, analytics summary, prediction generation, and CSV export.

---

## 7. Docker Deployment

To launch the full system using Docker and Docker Compose:

```bash
docker compose up --build
```

---

## 8. Academic & Scientific Disclaimer

> **Notice:** DroughtSense is an academic research platform developed for Course EHDS-2026 Project 1. Predictions generated by this system represent statistical probabilities derived from the supplied meteorological variables and do not constitute official statutory weather forecasts or government disaster declarations. Ground truth operational validation requires localized station calibration and high-density telemetry.
