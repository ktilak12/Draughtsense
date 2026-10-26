"""
Machine Learning Pipeline for DroughtSense
=========================================
Supports:
- Models: Random Forest (primary), XGBoost, Decision Tree, Logistic Regression
- Chronological train/test split to prevent temporal data leakage
- Feature scaling & preprocessing fit strictly on training set
- Model evaluation: Accuracy, Precision, Recall, F1, AUC-ROC, Confusion Matrix, per-class metrics
- Feature importance analysis
- Model serialization & version tracking
"""

import os
import joblib
import numpy as np
import pandas as pd
from typing import Dict, Any, Tuple, List, Optional
from datetime import datetime

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.impute import SimpleImputer
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    confusion_matrix, roc_auc_score, classification_report
)
from sklearn.ensemble import RandomForestClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.linear_model import LogisticRegression
from xgboost import XGBClassifier

from app.core.config import settings


class DroughtMLPipeline:
    SEVERITY_CLASSES = ["Normal", "Moderate", "Severe", "Extreme"]
    DEFAULT_FEATURES = [
        "rainfall", "temp_avg", "humidity", "wind_speed",
        "soil_moisture", "streamflow", "evapotranspiration"
    ]

    @staticmethod
    def get_algorithm_instance(algorithm: str, random_state: int = 42):
        algo_lower = algorithm.lower().replace(" ", "_")
        if "random_forest" in algo_lower:
            return RandomForestClassifier(
                n_estimators=100, max_depth=10, random_state=random_state, class_weight="balanced"
            )
        elif "xgboost" in algo_lower:
            return XGBClassifier(
                n_estimators=100, max_depth=6, learning_rate=0.1, random_state=random_state, eval_metric="mlogloss"
            )
        elif "decision_tree" in algo_lower:
            return DecisionTreeClassifier(max_depth=8, random_state=random_state, class_weight="balanced")
        elif "logistic_regression" in algo_lower:
            return LogisticRegression(max_iter=1000, random_state=random_state, class_weight="balanced")
        else:
            # Default to Random Forest
            return RandomForestClassifier(n_estimators=100, random_state=random_state)

    @classmethod
    def train_model(
        cls,
        df: pd.DataFrame,
        algorithm: str = "Random Forest",
        features: Optional[List[str]] = None,
        target_col: str = "severity_label",
        test_size: float = 0.2
    ) -> Tuple[Dict[str, Any], str]:
        """
        Train ML model on dataframe with chronological split and no data leakage.
        """
        if features is None:
            features = [f for f in cls.DEFAULT_FEATURES if f in df.columns]

        # Filter required columns and drop null targets
        train_df = df.dropna(subset=[target_col]).copy()
        
        # Chronological sort if date column exists
        if "observation_date" in train_df.columns:
            train_df = train_df.sort_values(by="observation_date")
        elif "date" in train_df.columns:
            train_df = train_df.sort_values(by="date")

        X = train_df[features].copy()
        y = train_df[target_col].copy()

        # Ensure target labels are valid
        valid_mask = y.isin(cls.SEVERITY_CLASSES)
        X = X[valid_mask]
        y = y[valid_mask]

        total_samples = len(X)
        if total_samples < 20:
            raise ValueError(f"Insufficient training samples ({total_samples}). Minimum 20 records required.")

        # Chronological split (no shuffle) to represent time-series forecasting correctly
        split_idx = int(total_samples * (1.0 - test_size))
        X_train, X_test = X.iloc[:split_idx], X.iloc[split_idx:]
        y_train, y_test = y.iloc[:split_idx], y.iloc[split_idx:]

        # Preprocessing: Impute missing features based strictly on training set
        imputer = SimpleImputer(strategy="median")
        X_train_imp = imputer.fit_transform(X_train)
        X_test_imp = imputer.transform(X_test)

        # Preprocessing: Scaler fit strictly on training set
        scaler = StandardScaler()
        X_train_scaled = scaler.fit_transform(X_train_imp)
        X_test_scaled = scaler.transform(X_test_imp)

        # Label encoding for XGBoost if needed
        label_to_idx = {cls.SEVERITY_CLASSES[i]: i for i in range(len(cls.SEVERITY_CLASSES))}
        idx_to_label = {i: cls.SEVERITY_CLASSES[i] for i in range(len(cls.SEVERITY_CLASSES))}

        y_train_encoded = np.array([label_to_idx[val] for val in y_train])
        y_test_encoded = np.array([label_to_idx[val] for val in y_test])

        model = cls.get_algorithm_instance(algorithm)
        
        # Fit model
        if "xgboost" in algorithm.lower():
            model.fit(X_train_scaled, y_train_encoded)
            y_pred_encoded = model.predict(X_test_scaled)
            y_pred = [idx_to_label.get(idx, "Normal") for idx in y_pred_encoded]
            try:
                y_proba = model.predict_proba(X_test_scaled)
            except Exception:
                y_proba = None
        else:
            model.fit(X_train_scaled, y_train)
            y_pred = model.predict(X_test_scaled)
            try:
                y_proba = model.predict_proba(X_test_scaled)
            except Exception:
                y_proba = None

        # Metrics calculation
        acc = float(accuracy_score(y_test, y_pred))
        prec = float(precision_score(y_test, y_pred, average="weighted", zero_division=0))
        rec = float(recall_score(y_test, y_pred, average="weighted", zero_division=0))
        f1 = float(f1_score(y_test, y_pred, average="weighted", zero_division=0))

        # Confusion matrix
        unique_classes = cls.SEVERITY_CLASSES
        cm = confusion_matrix(y_test, y_pred, labels=unique_classes).tolist()

        # Multi-class AUC-ROC
        auc_roc = None
        if y_proba is not None:
            try:
                # Present classes check
                present_classes = list(model.classes_) if hasattr(model, "classes_") else list(range(len(unique_classes)))
                if len(present_classes) > 1 and len(np.unique(y_test)) > 1:
                    auc_roc = float(roc_auc_score(y_test_encoded, y_proba, multi_class="ovr", average="weighted"))
            except Exception:
                auc_roc = None

        # Per class metrics
        report_dict = classification_report(y_test, y_pred, labels=unique_classes, output_dict=True, zero_division=0)
        per_class = {}
        for c in unique_classes:
            if c in report_dict:
                per_class[c] = {
                    "precision": round(float(report_dict[c]["precision"]), 3),
                    "recall": round(float(report_dict[c]["recall"]), 3),
                    "f1_score": round(float(report_dict[c]["f1-score"]), 3),
                    "support": int(report_dict[c]["support"])
                }

        # Feature Importance
        feat_importance = {}
        if hasattr(model, "feature_importances_"):
            importances = model.feature_importances_
            for feat, imp in zip(features, importances):
                feat_importance[feat] = round(float(imp), 4)
        elif hasattr(model, "coef_"):
            importances = np.mean(np.abs(model.coef_), axis=0)
            for feat, imp in zip(features, importances):
                feat_importance[feat] = round(float(imp), 4)
        else:
            for feat in features:
                feat_importance[feat] = round(1.0 / len(features), 4)

        metrics = {
            "accuracy": round(acc, 4),
            "precision": round(prec, 4),
            "recall": round(rec, 4),
            "f1_score": round(f1, 4),
            "auc_roc": round(auc_roc, 4) if auc_roc is not None else None,
            "confusion_matrix": cm,
            "classes": unique_classes,
            "per_class": per_class,
            "train_samples": len(X_train),
            "test_samples": len(X_test)
        }

        # Save artifacts
        timestamp_str = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
        version = f"v_{timestamp_str}"
        model_filename = f"{algorithm.replace(' ', '_').lower()}_{version}.joblib"
        artifact_path = os.path.join(settings.MODEL_DIR, model_filename)

        bundle = {
            "model": model,
            "algorithm": algorithm,
            "version": version,
            "features": features,
            "imputer": imputer,
            "scaler": scaler,
            "classes": unique_classes,
            "metrics": metrics,
            "feature_importance": feat_importance
        }
        joblib.dump(bundle, artifact_path)

        metadata = {
            "version": version,
            "artifact_path": artifact_path,
            "metrics": metrics,
            "features": features,
            "feature_importance": feat_importance
        }

        return metadata, artifact_path

    @classmethod
    def predict_single(
        cls,
        model_artifact_path: str,
        input_dict: Dict[str, Any]
    ) -> Tuple[float, str, Dict[str, Any]]:
        """
        Execute prediction using trained artifact bundle.
        Returns: (drought_probability, severity_label, explanation_dict)
        """
        if not os.path.exists(model_artifact_path):
            raise FileNotFoundError(f"Model artifact not found at {model_artifact_path}")

        bundle = joblib.load(model_artifact_path)
        model = bundle["model"]
        features = bundle["features"]
        imputer = bundle["imputer"]
        scaler = bundle["scaler"]
        classes = bundle["classes"]

        # Prepare 1-row DataFrame
        row_data = {}
        for feat in features:
            val = input_dict.get(feat)
            row_data[feat] = [val if val is not None else np.nan]

        df_in = pd.DataFrame(row_data)

        # Impute and Scale
        X_imp = imputer.transform(df_in)
        X_scaled = scaler.transform(X_imp)

        # Predict
        if "xgboost" in bundle.get("algorithm", "").lower():
            pred_encoded = model.predict(X_scaled)[0]
            severity = classes[int(pred_encoded)] if int(pred_encoded) < len(classes) else "Moderate"
            try:
                proba = model.predict_proba(X_scaled)[0]
                # Drought probability is sum of Moderate, Severe, Extreme probabilities
                # class 0 = Normal, 1 = Moderate, 2 = Severe, 3 = Extreme
                drought_prob = float(np.sum(proba[1:])) * 100.0 if len(proba) > 1 else (0.0 if severity == "Normal" else 80.0)
            except Exception:
                drought_prob = 10.0 if severity == "Normal" else 75.0
        else:
            severity = str(model.predict(X_scaled)[0])
            try:
                proba = model.predict_proba(X_scaled)[0]
                # Match classes in model
                model_classes = list(model.classes_)
                drought_indices = [i for i, c in enumerate(model_classes) if c in ["Moderate", "Severe", "Extreme"]]
                drought_prob = float(np.sum(proba[drought_indices])) * 100.0
            except Exception:
                # Fallback probability mapping based on severity
                prob_map = {"Normal": 12.5, "Moderate": 48.0, "Severe": 76.5, "Extreme": 92.0}
                drought_prob = prob_map.get(severity, 25.0)

        drought_prob = round(float(np.clip(drought_prob, 0.0, 100.0)), 1)

        # Generate factor explanations
        feature_importances = bundle.get("feature_importance", {})
        top_factors = []
        for feat, imp in sorted(feature_importances.items(), key=lambda x: x[1], reverse=True)[:3]:
            val = input_dict.get(feat)
            top_factors.append({
                "feature": feat,
                "importance_weight": imp,
                "observed_value": val,
                "impact": "Deficit drives drought risk higher" if feat in ["rainfall", "soil_moisture"] and (val is not None and val < 20) else "Elevated influence on model score"
            })

        explanation = {
            "primary_factors": top_factors,
            "feature_weights": feature_importances,
            "model_confidence": round(float(np.max(proba) * 100.0) if 'proba' in locals() and proba is not None else 85.0, 1)
        }

        return drought_prob, severity, explanation
