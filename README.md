# 🌵 DroughtSense
### A Machine Learning-Based Framework for Drought Prediction and Early Warning

DroughtSense is a machine learning project designed to predict drought conditions using hydrological and meteorological data. It aims to estimate drought probability, classify drought severity, and provide early warnings to help communities and authorities prepare for water shortages.

## 📌 Problem Statement

Drought is a long period of low water availability caused by insufficient rainfall, high temperatures, increased evapotranspiration, and low soil moisture.

It affects agriculture, groundwater, rivers, reservoirs, ecosystems, and drinking-water supplies. Traditional drought identification may happen after serious water stress has already developed.

DroughtSense aims to identify possible drought conditions early using environmental data and machine learning techniques.

## 🎯 Objectives

- Collect historical hydrological and meteorological data.
- Clean the dataset and handle missing values and outliers.
- Analyze relationships between environmental variables.
- Calculate SPI and SPEI drought indices.
- Train machine learning models to predict drought conditions.
- Estimate drought probability and classify drought severity.
- Develop an early-warning dashboard for better water-resource management.

## 🌦️ Data Sources and Features

The project may use the following environmental variables, depending on data availability.

**Hydrological Variables**
- Rainfall or precipitation
- Soil moisture
- Streamflow
- Groundwater levels
- Reservoir and water-storage data

**Meteorological Variables**
- Minimum, maximum, and average temperature
- Humidity
- Wind speed
- Evapotranspiration

**Optional Environmental Variables**
- Normalized Difference Vegetation Index (NDVI)
- Land-use and land-cover data

The dataset, data sources, geographic coverage, and time period will be documented during implementation.

## 📉 Drought Assessment Using SPI and SPEI

**1. Standardized Precipitation Index (SPI)**

SPI measures variations in precipitation and helps identify meteorological drought over different time periods.

**2. Standardized Precipitation Evapotranspiration Index (SPEI)**

SPEI considers both precipitation and evapotranspiration. It helps assess drought conditions by considering water demand and temperature-related effects.

Both indices are part of the proposed DroughtSense drought-assessment pipeline.

## ⚙️ Proposed Machine Learning Workflow

1. **Data Collection:** Collect historical environmental, hydrological, and meteorological data.
2. **Data Cleaning:** Remove duplicate records and correct inconsistent data.
3. **Missing Value and Outlier Treatment:** Handle missing observations and unusual values.
4. **Exploratory Data Analysis:** Study data patterns, trends, and relationships.
5. **Feature Engineering:** Prepare useful features and calculate SPI/SPEI where possible.
6. **Model Training:** Train machine learning models using the prepared dataset.
7. **Model Evaluation:** Compare model performance using suitable evaluation metrics.
8. **Drought Prediction:** Estimate drought probability and classify severity.
9. **Dashboard Development:** Display drought risk, environmental trends, and warning indicators.

## 🤖 Machine Learning Models

The following models are proposed for drought prediction.

| Model | Purpose |
|---|---|
| Logistic Regression | Baseline model for drought classification |
| Decision Tree | Identifies relationships between environmental variables |
| Random Forest | Proposed primary model for robust classification and feature-importance analysis |
| XGBoost | Provides an additional model for performance comparison |
| LSTM | Optional model for time-series drought prediction |

**Primary Model:** Random Forest is proposed as the main model. The final model will be selected after testing and comparing performance.

## 📊 Model Evaluation

The proposed models will be evaluated using:

- Accuracy
- Precision
- Recall
- F1-score
- AUC-ROC

These metrics will help compare the models and understand their ability to identify drought conditions.

## 📈 Proposed Early-Warning Dashboard

The dashboard is planned to include the following features:

- **Drought Probability:** Displays the predicted likelihood of drought as a percentage.
- **Drought Severity:** Classifies conditions as Normal, Moderate, Severe, or Extreme.
- **SPI/SPEI Status:** Displays drought index values and classifications.
- **Rainfall Trend:** Shows historical and forecasted rainfall patterns when forecast data is available.
- **Soil Moisture Status:** Displays current soil moisture levels and their variations.
- **Temperature Trend:** Shows temperature changes compared with historical averages.
- **Drought-Risk Map:** Displays drought risk across monitored regions when location-based data is available.
- **Early-Warning Indicator:** Highlights possible drought conditions based on defined risk criteria.

These are proposed features. Actual dashboard outputs will depend on implementation, available data, and model validation.

## 🧰 Suggested Technology Stack

The project proposal does not specify a final technology stack. The following tools are possible choices for implementation.

- **Programming Language:** Python
- **Data Processing:** Pandas, NumPy
- **Data Visualization:** Matplotlib, Seaborn
- **Machine Learning:** Scikit-learn
- **Gradient Boosting:** XGBoost
- **Deep Learning:** TensorFlow/Keras for optional LSTM implementation
- **Dashboard:** Streamlit, Flask, or FastAPI

The final tools should reflect the technologies actually used in the project.

## 🚀 Installation and Setup

Once the project code and dependencies are available, use the following commands as a starting point.

```bash
# Clone the repository
git clone <your-repository-url>

# Open the project folder
cd <repository-folder>

# Create a virtual environment
python -m venv .venv
```

Activate the environment.

**Windows:**
```bash
.venv\Scripts\activate
```

**macOS/Linux:**
```bash
source .venv/bin/activate
```

Install dependencies after creating the `requirements.txt` file.

```bash
pip install -r requirements.txt
```

The exact commands for training the model and launching the dashboard should be added once the implementation is finalized.

## 📁 Project Structure

A suggested project structure is shown below.

```text
DroughtSense/
├── data/
│   ├── raw/
│   └── processed/
├── notebooks/
├── src/
│   ├── data_preprocessing.py
│   ├── drought_indices.py
│   ├── train_model.py
│   ├── evaluate_model.py
│   └── predict.py
├── dashboard/
├── models/
├── requirements.txt
├── README.md
└── .gitignore
```

This structure can be adjusted to match the actual project files.

## 🌍 Applications

DroughtSense may support:

- Agricultural planning and crop management
- Water-resource planning and allocation
- Groundwater and reservoir conservation
- Community drought early-warning systems
- Disaster preparedness and response planning
- Environmental monitoring and ecosystem protection

## 🌱 Expected Impact

The project aims to support earlier identification of drought risk and better preparation for water shortages.

Potential benefits include:

- Better agricultural planning
- Improved water conservation
- Reduced drought-related crop losses
- Better preparedness for water shortages
- Data-driven decisions by authorities and agricultural planners
- Improved environmental protection

DroughtSense is intended to support decision-making and should not replace official forecasts or emergency guidance.

## 🔬 Validation and Responsible Use

Before using the model for real-world decisions, the team should:

- Verify the reliability and quality of the dataset.
- Document data sources and coverage.
- Prevent future information from leaking into training data.
- Use appropriate training and testing methods for time-series data.
- Compare models using suitable evaluation metrics.
- Test performance across drought severity classes.
- Define drought severity thresholds and alert rules.
- Validate predictions before using them for operational decisions.

## 👥 Team Members

**Course:** EHDS-2026 Project 1

| Team Member | Registration Number |
|---|---|
| Vyoam Joshi | RA2411056010048 |
| Midhu John | RA2411026010534 |
| Tilak | RA241103010556 |

## 🗺️ Project Roadmap

- [ ] Identify suitable data sources.
- [ ] Collect and inspect environmental data.
- [ ] Clean the dataset and handle missing values.
- [ ] Calculate and validate SPI/SPEI.
- [ ] Perform exploratory data analysis.
- [ ] Train baseline machine learning models.
- [ ] Train and compare candidate models.
- [ ] Evaluate and document model performance.
- [ ] Develop the early-warning dashboard.
- [ ] Test drought-risk indicators and document the results.

## 📄 Project Reference

**Project Title:** DroughtSense: A Machine Learning-Based Framework for Drought Prediction and Early Warning Using Hydrological and Meteorological Data.

**Course:** EHDS-2026 Project 1

---

*DroughtSense aims to turn environmental data into useful signals for earlier drought-risk identification and improved water-resource management.*
