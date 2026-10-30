import {
  HealthStatus,
  AnalyticsSummaryData,
  EnvironmentalTrendPoint,
  MapStation,
  PredictionResult,
  DatasetItem,
  MLModelItem,
  MLModelDetail,
  AppSettingsConfig
} from '../types';

const API_BASE = '/api';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let errorMsg = `HTTP ${res.status}: ${res.statusText}`;
    try {
      const errJson = await res.json();
      if (errJson.detail) {
        errorMsg = typeof errJson.detail === 'string' ? errJson.detail : JSON.stringify(errJson.detail);
      }
    } catch {
      // ignore
    }
    throw new Error(errorMsg);
  }
  return res.json();
}

export const api = {
  // Health
  getHealth: async (): Promise<HealthStatus> => {
    const res = await fetch(`${API_BASE}/health`);
    return handleResponse<HealthStatus>(res);
  },

  // Analytics
  getSummary: async (): Promise<AnalyticsSummaryData> => {
    const res = await fetch(`${API_BASE}/analytics/summary`);
    return handleResponse<AnalyticsSummaryData>(res);
  },

  getTrends: async (params?: { location_name?: string; start_date?: string; end_date?: string; limit?: number }): Promise<EnvironmentalTrendPoint[]> => {
    const query = new URLSearchParams();
    if (params?.location_name && params.location_name !== 'All') query.append('location_name', params.location_name);
    if (params?.start_date) query.append('start_date', params.start_date);
    if (params?.end_date) query.append('end_date', params.end_date);
    if (params?.limit) query.append('limit', params.limit.toString());
    const res = await fetch(`${API_BASE}/analytics/trends?${query.toString()}`);
    return handleResponse<EnvironmentalTrendPoint[]>(res);
  },

  getCorrelations: async (): Promise<{ variables: string[]; matrix: Array<Record<string, any>> }> => {
    const res = await fetch(`${API_BASE}/analytics/correlations`);
    return handleResponse<{ variables: string[]; matrix: Array<Record<string, any>> }>(res);
  },

  getSeverityDistribution: async (): Promise<Array<{ severity: string; count: number; percentage: number }>> => {
    const res = await fetch(`${API_BASE}/analytics/severity-distribution`);
    return handleResponse<Array<{ severity: string; count: number; percentage: number }>>(res);
  },

  getMapStations: async (): Promise<MapStation[]> => {
    const res = await fetch(`${API_BASE}/analytics/map`);
    return handleResponse<MapStation[]>(res);
  },

  // Predictions
  predictManual: async (data: {
    location_name: string;
    prediction_date: string;
    rainfall: number;
    temp_min?: number | null;
    temp_max?: number | null;
    temp_avg?: number | null;
    humidity?: number | null;
    wind_speed?: number | null;
    soil_moisture?: number | null;
    streamflow?: number | null;
    evapotranspiration?: number | null;
    spi?: number | null;
    spei?: number | null;
  }): Promise<PredictionResult> => {
    const res = await fetch(`${API_BASE}/predictions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse<PredictionResult>(res);
  },

  getPredictions: async (params?: {
    search?: string;
    location?: string;
    severity?: string;
    warning?: string;
    page?: number;
    limit?: number;
  }): Promise<{ items: PredictionResult[]; total: number; page: number; pages: number }> => {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.location && params.location !== 'All') query.append('location', params.location);
    if (params?.severity && params.severity !== 'All') query.append('severity', params.severity);
    if (params?.warning && params.warning !== 'All') query.append('warning', params.warning);
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());
    const res = await fetch(`${API_BASE}/predictions?${query.toString()}`);
    return handleResponse<{ items: PredictionResult[]; total: number; page: number; pages: number }>(res);
  },

  getPredictionDetail: async (id: number): Promise<PredictionResult> => {
    const res = await fetch(`${API_BASE}/predictions/${id}`);
    return handleResponse<PredictionResult>(res);
  },

  predictBatch: async (datasetId: number): Promise<{ status: string; dataset_id: number; predictions_generated: number; message: string }> => {
    const res = await fetch(`${API_BASE}/predictions/batch/${datasetId}`, {
      method: 'POST'
    });
    return handleResponse<{ status: string; dataset_id: number; predictions_generated: number; message: string }>(res);
  },

  exportPredictionsCsvUrl: `${API_BASE}/predictions/export/csv`,

  // Datasets
  getDatasets: async (): Promise<DatasetItem[]> => {
    const res = await fetch(`${API_BASE}/datasets`);
    return handleResponse<DatasetItem[]>(res);
  },

  uploadDataset: async (file: File, sourceInfo: string = 'Manual Upload'): Promise<any> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('source_information', sourceInfo);
    const res = await fetch(`${API_BASE}/datasets/upload`, {
      method: 'POST',
      body: formData
    });
    return handleResponse<any>(res);
  },

  processDataset: async (datasetId: number): Promise<any> => {
    const res = await fetch(`${API_BASE}/datasets/${datasetId}/process`, {
      method: 'POST'
    });
    return handleResponse<any>(res);
  },

  deleteDataset: async (datasetId: number): Promise<any> => {
    const res = await fetch(`${API_BASE}/datasets/${datasetId}`, {
      method: 'DELETE'
    });
    return handleResponse<any>(res);
  },

  loadDemoDataset: async (): Promise<any> => {
    const res = await fetch(`${API_BASE}/datasets/load-demo`, {
      method: 'POST'
    });
    return handleResponse<any>(res);
  },

  // Models
  getModels: async (): Promise<MLModelItem[]> => {
    const res = await fetch(`${API_BASE}/models`);
    return handleResponse<MLModelItem[]>(res);
  },

  getModelDetail: async (id: number): Promise<MLModelDetail> => {
    const res = await fetch(`${API_BASE}/models/${id}`);
    return handleResponse<MLModelDetail>(res);
  },

  trainModel: async (data: {
    algorithm: string;
    target_type?: string;
    features?: string[];
    dataset_id?: number | null;
    test_size?: number;
  }): Promise<any> => {
    const res = await fetch(`${API_BASE}/models/train`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse<any>(res);
  },

  activateModel: async (modelId: number): Promise<any> => {
    const res = await fetch(`${API_BASE}/models/${modelId}/activate`, {
      method: 'POST'
    });
    return handleResponse<any>(res);
  },

  // Settings
  getSettings: async (): Promise<AppSettingsConfig> => {
    const res = await fetch(`${API_BASE}/settings`);
    return handleResponse<AppSettingsConfig>(res);
  },

  updateSettings: async (settings: AppSettingsConfig): Promise<AppSettingsConfig> => {
    const res = await fetch(`${API_BASE}/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    });
    return handleResponse<AppSettingsConfig>(res);
  }
};
