"""
Early-Warning Engine for DroughtSense
=====================================
Multi-criteria rule engine mapping probability, SPI, soil moisture, and rainfall anomalies
to actionable risk categories:
- Normal (Standard baseline, no elevated risk)
- Watch (Early advisory, moisture deficit beginning)
- Warning (High probability, impending agricultural or meteorological drought)
- Critical (Severe or extreme drought active or imminent, urgent mitigation needed)
"""

from typing import Dict, Any, Tuple, List, Optional

class EarlyWarningEngine:
    RULE_VERSION = "2026.1-RuleEngine"

    DEFAULT_THRESHOLDS = {
        "critical_prob": 75.0,
        "warning_prob": 55.0,
        "watch_prob": 35.0,
        "critical_spi": -2.0,
        "warning_spi": -1.5,
        "watch_spi": -1.0,
        "critical_soil": 15.0,   # % soil moisture
        "warning_soil": 25.0,
        "watch_soil": 35.0,
    }

    @classmethod
    def evaluate(
        cls,
        drought_prob: float,
        spi: Optional[float] = None,
        spei: Optional[float] = None,
        soil_moisture: Optional[float] = None,
        rainfall: Optional[float] = None,
        custom_thresholds: Optional[Dict[str, float]] = None
    ) -> Tuple[str, List[str], List[str]]:
        """
        Evaluate early-warning status and produce documented justification reasons and actionable advisories.
        
        Returns:
        --------
        status : str ("Normal", "Watch", "Warning", "Critical")
        reasons : List[str] (Triggering conditions)
        advisories : List[str] (Preparedness actions)
        """
        th = cls.DEFAULT_THRESHOLDS.copy()
        if custom_thresholds:
            th.update(custom_thresholds)

        reasons = []
        status = "Normal"

        # Check Critical Conditions
        if drought_prob >= th["critical_prob"]:
            reasons.append(f"Model drought probability is acute at {drought_prob:.1f}% (threshold: ≥{th['critical_prob']}%)")
            status = "Critical"
        if spi is not None and spi <= th["critical_spi"]:
            reasons.append(f"Standardized Precipitation Index (SPI={spi:.2f}) indicates extreme meteorological deficit (≤{th['critical_spi']})")
            status = "Critical"
        if spei is not None and spei <= th["critical_spi"]:
            reasons.append(f"Standardized Precipitation Evapotranspiration Index (SPEI={spei:.2f}) indicates critical water balance collapse (≤{th['critical_spi']})")
            status = "Critical"
        if soil_moisture is not None and soil_moisture <= th["critical_soil"]:
            reasons.append(f"Root-zone soil moisture critically depleted at {soil_moisture:.1f}% (threshold: ≤{th['critical_soil']}%)")
            if status != "Critical":
                status = "Critical"

        # Check Warning Conditions if not already Critical
        if status != "Critical":
            if drought_prob >= th["warning_prob"]:
                reasons.append(f"Model drought probability elevated at {drought_prob:.1f}% (threshold: ≥{th['warning_prob']}%)")
                status = "Warning"
            if spi is not None and spi <= th["warning_spi"]:
                reasons.append(f"SPI indicates severe deficit at {spi:.2f} (threshold: ≤{th['warning_spi']})")
                status = "Warning"
            if spei is not None and spei <= th["warning_spi"]:
                reasons.append(f"SPEI indicates severe water balance deficit at {spei:.2f} (threshold: ≤{th['warning_spi']})")
                status = "Warning"
            if soil_moisture is not None and soil_moisture <= th["warning_soil"]:
                reasons.append(f"Soil moisture low at {soil_moisture:.1f}% (threshold: ≤{th['warning_soil']}%)")
                status = "Warning"

        # Check Watch Conditions if not already Warning or Critical
        if status not in ["Critical", "Warning"]:
            if drought_prob >= th["watch_prob"]:
                reasons.append(f"Model drought probability is in watch zone at {drought_prob:.1f}% (threshold: ≥{th['watch_prob']}%)")
                status = "Watch"
            if spi is not None and spi <= th["watch_spi"]:
                reasons.append(f"SPI shows moderate moisture deficit at {spi:.2f} (threshold: ≤{th['watch_spi']})")
                status = "Watch"
            if spei is not None and spei <= th["watch_spi"]:
                reasons.append(f"SPEI indicates moderate climatic water balance stress at {spei:.2f} (threshold: ≤{th['watch_spi']})")
                status = "Watch"
            if soil_moisture is not None and soil_moisture <= th["watch_soil"]:
                reasons.append(f"Soil moisture approaching marginal levels at {soil_moisture:.1f}% (threshold: ≤{th['watch_soil']}%)")
                status = "Watch"

        if not reasons:
            reasons.append("Environmental indicators within normal climatological boundaries.")

        # Determine Preparedness Actions based on status
        if status == "Critical":
            advisories = [
                "Activate emergency water rationing and reserve reservoir preservation protocols.",
                "Advise agricultural stakeholders to initiate drought-contingency irrigation strategies.",
                "Deploy emergency livestock water points and supplementary fodder relief.",
                "Review municipal storage quotas and restrict non-essential water consumption."
            ]
        elif status == "Warning":
            advisories = [
                "Issue drought advisories to agricultural extension workers and regional irrigation boards.",
                "Audit local water distribution pipelines to minimize transport leakage.",
                "Promote soil moisture conservation techniques like mulching and precision drip scheduling.",
                "Prepare reservoir monitoring teams for potential water supply curtailment."
            ]
        elif status == "Watch":
            advisories = [
                "Begin routine weekly monitoring of surface water levels and soil tension sensors.",
                "Advise farmers to monitor long-range weather outlooks prior to seasonal planting.",
                "Optimize irrigation canal maintenance to prepare for potential dry conditions."
            ]
        else:
            advisories = [
                "Maintain standard hydrometeorological observation and routine reservoir management.",
                "Continue standard rainwater harvesting and groundwater recharge programs."
            ]

        return status, reasons, advisories
