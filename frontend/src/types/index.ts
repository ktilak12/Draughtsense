export type SeverityLevel = 'Normal' | 'Moderate' | 'Severe' | 'Extreme';
export type WarningLevel = 'Normal' | 'Watch' | 'Warning' | 'Critical';

export interface HealthStatus {
  status: string;
  version: string;
  timestamp: string;
  database: string;
  active_model?: string;
}

export interface AnalyticsSummaryData {
  monitored_stations: number;
  total_records: number;
  average_rainfall: number;
  average_soil_moisture: number;
  severity_breakdown: Record<string, number>;
  active_warnings_count: number;
  current_system_status: string;
}

export interface EnvironmentalTrendPoint {
  date: string;
  rainfall: number | null;
  temp_avg: number | null;
  temp_min: number | null;
  temp_max: number | null;
  humidity: number | null;
  wind_speed: number | null;
  soil_moisture: number | null;
  streamflow: number | null;
  evapotranspiration: number | null;
  spi: number | null;
  spei: number | null;
  severity: SeverityLevel | null;
}

export interface MapStation {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  region?: string;
  is_demo: boolean;
  latest_rainfall: number | null;
  latest_temp: number | null;
  latest_soil_moisture: number | null;
  latest_spi: number | null;
  latest_spei: number | null;
  drought_probability: number;
  severity: SeverityLevel;
  warning_status: WarningLevel;
  observation_date: string;
}

export interface PredictionFactor {
  feature: string;
  observed_value?: number | string | null;
  impact: string;
  importance_weight?: number;
}

export interface PredictionResult {
  id?: number;
  location_name: string;
  prediction_date: string;
  drought_probability: number;
  severity: SeverityLevel;
  warning_status: WarningLevel;
  model_name: string;
  model_version: string;
  input_snapshot: Record<string, any>;
  explanation: {
    primary_factors: PredictionFactor[];
    suggested_actions: string[];
    limitations: string;
  };
  created_timestamp: string;
}

export interface DatasetItem {
  id: number;
  name: string;
  file_type: string;
  upload_timestamp: string;
  row_count: number;
  date_range_start?: string;
  date_range_end?: string;
  validation_status: 'PENDING' | 'VALID' | 'WARNING' | 'INVALID';
  processing_status: 'RAW' | 'PROCESSED' | 'ERROR';
  source_information: string;
  quality_report_json?: string;
}

export interface MLModelItem {
  id: number;
  model_name: string;
  algorithm: string;
  version: string;
  features: string[];
  target_definition: string;
  training_dataset_name?: string;
  training_timestamp: string;
  accuracy?: number;
  f1_score?: number;
  precision?: number;
  recall?: number;
  auc_roc?: number | null;
  is_active: boolean;
}

export interface MLModelDetail extends MLModelItem {
  metrics: {
    accuracy: number;
    precision: number;
    recall: number;
    f1_score: number;
    auc_roc?: number | null;
    confusion_matrix: number[][];
    classes: string[];
    per_class: Record<string, { precision: number; recall: number; f1_score: number; support: number }>;
    train_samples: number;
    test_samples: number;
  };
  feature_importance: Record<string, number>;
}

export interface AppSettingsConfig {
  default_location: string;
  preferred_units: string;
  default_date_range: string;
  severity_thresholds: {
    moderate_spi: number;
    severe_spi: number;
    extreme_spi: number;
    moderate_prob: number;
    severe_prob: number;
    extreme_prob: number;
  };
  warning_thresholds: {
    watch_prob: number;
    warning_prob: number;
    critical_prob: number;
  };
  demo_mode_enabled: boolean;
}
